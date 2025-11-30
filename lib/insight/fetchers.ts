import axios from "axios";
import * as cheerio from "cheerio";

// Types
export interface MarketData {
  kospi: { index: string; change: string; changeRate: string };
  kosdaq: { index: string; change: string; changeRate: string };
  exchangeRate: string; // USD/KRW
  usIndices: {
    nasdaq: string;
    snp500: string;
    sox: string; // PHLX Semiconductor
  };
}

export interface SupplyData {
  foreigner: { kospi: string; kosdaq: string }; // Net buying amount (e.g., "+2000억")
  institution: { kospi: string; kosdaq: string };
}

export interface DartNotice {
  rcept_no: string;
  corp_name: string;
  report_nm: string;
  rcept_dt: string;
}

// Helper to fetch and decode EUC-KR pages
async function fetchEucKrPage(url: string): Promise<cheerio.CheerioAPI> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const html = iconv.decode(buffer, "EUC-KR");
  return cheerio.load(html);
}

// 1. Fetch Basic Market Indices (Naver Finance + Global)
export async function fetchMarketIndices(): Promise<MarketData> {
  try {
    // A. Domestic Indices (KOSPI, KOSDAQ) - https://finance.naver.com/sise/
    const $sise = await fetchEucKrPage("https://finance.naver.com/sise/");

    const getIndexData = (idPrefix: string) => {
      const index = $sise(`#${idPrefix}_now`).text().trim();
      const changeRaw = $sise(`#${idPrefix}_change`).text().trim(); // "60.32 -1.51% 하락"
      const [change, changeRate] = changeRaw.split(/\s+/); // ["60.32", "-1.51%", "하락"]
      return { index, change, changeRate };
    };

    const kospi = getIndexData("KOSPI");
    const kosdaq = getIndexData("KOSDAQ");

    // B. Exchange Rate (USD/KRW) - https://finance.naver.com/
    const $main = await fetchEucKrPage("https://finance.naver.com/");
    const exchangeRate = $main(
      ".article2 .section1 .group1 table tbody tr:first-child td:nth-of-type(1)"
    )
      .text()
      .trim();

    // C. Global Indices (US) - https://finance.naver.com/world/
    const $world = await fetchEucKrPage("https://finance.naver.com/world/");

    const getGlobalIndex = (symbol: string) => {
      const row = $world(`a[href*="${symbol}"]`).closest("tr");
      const index = row.find(".tb_td3").text().trim();
      // const change = row.find('.tb_td4').text().trim();
      // const changeRate = row.find('.tb_td5').text().trim();
      return index || "0.00";
    };

    const usIndices = {
      nasdaq: getGlobalIndex("NAS@NDX"), // Nasdaq 100
      snp500: getGlobalIndex("SPI@SPX"), // S&P 500
      sox: getGlobalIndex("NAS@SOX"), // PHLX Semiconductor
    };

    return { kospi, kosdaq, exchangeRate, usIndices };
  } catch (error) {
    console.error("Failed to fetch market indices:", error);
    // Return empty/safe defaults on error
    return {
      kospi: { index: "0", change: "0", changeRate: "0%" },
      kosdaq: { index: "0", change: "0", changeRate: "0%" },
      exchangeRate: "0",
      usIndices: { nasdaq: "0", snp500: "0", sox: "0" },
    };
  }
}

// 2. Fetch Supply (Foreigner/Institution) - Naver Finance
export async function fetchSupplyData(): Promise<SupplyData> {
  try {
    // https://finance.naver.com/sise/
    const $sise = await fetchEucKrPage("https://finance.naver.com/sise/");

    const getSupply = (selector: string) => {
      const val = $sise(selector).text().trim();
      // "+15,685억" -> "+15,685" (remove '억' if present, keep sign)
      return val.replace("억", "");
    };

    return {
      foreigner: {
        kospi: getSupply("#tab_sel1_deal_trend .c3 .val"),
        kosdaq: getSupply("#tab_sel2_deal_trend .c3 .val"),
      },
      institution: {
        kospi: getSupply("#tab_sel1_deal_trend .c4 .val"),
        kosdaq: getSupply("#tab_sel2_deal_trend .c4 .val"),
      },
    };
  } catch (error) {
    console.error("Failed to fetch supply data:", error);
    return {
      foreigner: { kospi: "0", kosdaq: "0" },
      institution: { kospi: "0", kosdaq: "0" },
    };
  }
}

import iconv from "iconv-lite";

// ... (previous code)

// 3. Fetch Top News
export interface NewsItem {
  title: string;
  link: string;
  press: string;
  time: string;
}

export async function fetchTopNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      "https://finance.naver.com/news/mainnews.naver",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const html = iconv.decode(buffer, "EUC-KR");
    const $ = cheerio.load(html);

    const newsList: NewsItem[] = [];

    // Selectors for Naver Finance Main News
    $(".mainNewsList li, .newsList li").each((_, element) => {
      const $el = $(element);
      const titleElement = $el.find("dd.articleSubject a, dt.articleSubject a");
      const pressElement = $el.find(
        "dd.articleSummary .press, dt.articleSummary .press"
      );
      const timeElement = $el.find(
        "dd.articleSummary .wdate, dt.articleSummary .wdate"
      );

      if (titleElement.length > 0) {
        const title = titleElement.text().trim();
        let link = titleElement.attr("href") || "";

        // Ensure absolute URL
        if (link && !link.startsWith("http")) {
          link = `https://finance.naver.com${link}`;
        }

        const press = pressElement.text().trim() || "네이버금융";
        const time = timeElement.text().trim() || "";

        newsList.push({ title, link, press, time });
      }
    });

    return newsList.slice(0, 5); // Top 5 news
  } catch (error) {
    console.error("Failed to fetch top news:", error);
    return [];
  }
}

// 4. Fetch DART Notices
export async function fetchDartNotices(apiKey: string): Promise<DartNotice[]> {
  if (!apiKey) return [];

  try {
    // Open DART API: list.json (Recent Disclosures)
    // Check last 3 days to ensure data exists even on weekends/holidays
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const formatDate = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}${mm}${dd}`;
    };

    const endDe = formatDate(today);
    const bgnDe = formatDate(threeDaysAgo);

    // pblntf_detail_ty: F001(MD/A), F002(Audit Report), etc. - Optional, but let's fetch all and filter if needed.
    // page_count: 20 to get enough recent ones
    const url = `https://opendart.fss.or.kr/api/list.json?crtfc_key=${apiKey}&bgn_de=${bgnDe}&end_de=${endDe}&page_count=20&sort=date&sort_mth=desc`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "000" || !data.list) {
      // status 013 means no data found
      if (data.status !== "013") {
        console.warn("DART API Error:", data.message);
      }
      return [];
    }

    // Filter for significant disclosures if possible, or just return recent ones
    // For now, return top 10
    return data.list.slice(0, 10).map((item: any) => ({
      rcept_no: item.rcept_no,
      corp_name: item.corp_name,
      report_nm: item.report_nm,
      rcept_dt: item.rcept_dt,
    }));
  } catch (error) {
    console.error("Failed to fetch DART notices:", error);
    return [];
  }
}
