import { StockLogoInfo } from "./types/stock";

export const generateLogo = (
  stock: StockLogoInfo,
  needBackup: boolean = false
) => {
  if (!needBackup) {
    return `https://financialmodelingprep.com/image-stock/${stock.stockCode}.${
      stock.marketType == "KOSDAQ" ? "KQ" : "KS"
    }.png`;
  } else {
    return `https://img.logo.dev/ticker/${stock.stockCode}.${
      stock.marketType == "KOSDAQ" ? "KQ" : "KS"
    }?token=pk_amIJ2SB5Q6GhzPy7kIxrRQ`;
  }
};
