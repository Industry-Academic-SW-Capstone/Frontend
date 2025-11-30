import { MarketData, SupplyData, DartNotice, NewsItem } from "./fetchers";

export function generateFactSheet(
  market: MarketData,
  supply: SupplyData,
  news: NewsItem[],
  notices: DartNotice[]
): string {
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  return `
[Market Status]
Time: ${now}
KOSPI: ${market.kospi.index} (${market.kospi.change} / ${
    market.kospi.changeRate
  })
KOSDAQ: ${market.kosdaq.index} (${market.kosdaq.change} / ${
    market.kosdaq.changeRate
  })
USD/KRW: ${market.exchangeRate}

[Supply Trend]
Foreigner: KOSPI ${supply.foreigner.kospi}, KOSDAQ ${supply.foreigner.kosdaq}
Institution: KOSPI ${supply.institution.kospi}, KOSDAQ ${
    supply.institution.kosdaq
  }

[Global Context]
Nasdaq: ${market.usIndices.nasdaq}
S&P500: ${market.usIndices.snp500}
SOX: ${market.usIndices.sox}

[Major News]
${news.map((n, i) => `${i + 1}. ${n.title}`).join("\n")}

[Recent Disclosures (DART)]
${notices
  .map((n, i) => `${i + 1}. [${n.corp_name}] ${n.report_nm} (${n.rcept_dt})`)
  .join("\n")}
`.trim();
}
