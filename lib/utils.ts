import { BasicStockInfo, StockLogoInfo } from "./types/types";

export const generateLogo = (
  stock: StockLogoInfo,
  needBackup: boolean = false
) => {
  if (!needBackup) {
    return `https://static.toss.im/png-icons/securities/icn-sec-fill-${stock.stockCode}.png`;
  } else {
    return `https://img.logo.dev/ticker/${stock.stockCode}.${
      stock.marketType == "KOSDAQ" ? "KQ" : "KS"
    }?token=pk_amIJ2SB5Q6GhzPy7kIxrRQ`;
  }
};
