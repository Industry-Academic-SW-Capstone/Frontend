-- 1. Market Fact Sheet (Raw data for AI analysis)
CREATE TABLE IF NOT EXISTS market_fact_sheets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raw_content TEXT NOT NULL, -- Text converted market data
  structured_data JSONB, -- Raw JSON data from fetchers
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure structured_data column exists (safe for existing tables)
ALTER TABLE market_fact_sheets ADD COLUMN IF NOT EXISTS structured_data JSONB;

-- 2. Insight Snapshots Table (AI generated final output)
CREATE TABLE IF NOT EXISTS insight_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Mode: 'morning' | 'active' | 'closing' | 'weekend'
  mode_type VARCHAR(20) NOT NULL,
  
  -- AI generated layout and widget data
  -- Structure: {
  --   "layout": ["HeroHeader", "SupplyTrend", "StockCarousel"],
  --   "widgets": {
  --     "HeroHeader": { ... },
  --     "SupplyTrend": { ... }
  --   }
  -- }
  payload JSONB NOT NULL,
  
  -- Reference to the source Fact Sheet
  fact_sheet_id UUID REFERENCES market_fact_sheets(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DART Cache (Avoid duplicate processing)
CREATE TABLE IF NOT EXISTS dart_cache (
  rcept_no VARCHAR(20) PRIMARY KEY,
  corp_name VARCHAR(100),
  report_nm VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Persona Research Reports (Guru Analysis)
CREATE TABLE IF NOT EXISTS research_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  persona_id VARCHAR(50) NOT NULL, -- e.g., 'buffett', 'graham'
  title VARCHAR(200) NOT NULL,
  summary TEXT NOT NULL, -- Short intro/hook
  full_content TEXT NOT NULL, -- Long form content (Markdown supported)
  fact_sheet_id UUID REFERENCES market_fact_sheets(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Enable RLS
ALTER TABLE insight_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_fact_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dart_cache ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read for Snapshots)
DROP POLICY IF EXISTS "Public Read Snapshots" ON insight_snapshots;
CREATE POLICY "Public Read Snapshots" ON insight_snapshots FOR SELECT USING (true);
-- Fact sheets and cache might be internal only, but for now we can leave them restricted or add policies as needed.
