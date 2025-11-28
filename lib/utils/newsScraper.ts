import * as cheerio from "cheerio";
import iconv from "iconv-lite";

export interface NewsItem {
  title: string;
  link: string;
  press: string;
  time: string;
  image?: string;
}

export async function scrapeStockNews(): Promise<NewsItem[]> {
  try {
    // Naver Finance News Main
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

    // Select news items (adjust selectors based on actual Naver Finance structure)
    // This is a common structure for Naver Finance Main News
    $(".mainNewsList li, .newsList li").each((_, element) => {
      const titleElement = $(element).find(
        "dd.articleSubject a, dt.articleSubject a"
      );
      const pressElement = $(element).find("span.press");
      const timeElement = $(element).find("span.wdate");
      const imageElement = $(element).find(
        "dt.articlePhoto img, .thumb img, dt.photo img"
      );

      if (titleElement.length > 0) {
        const title = titleElement.text().trim();
        let link = titleElement.attr("href") || "";

        if (link && !link.startsWith("http")) {
          link = `https://finance.naver.com${link}`;
        }

        let image = imageElement.attr("src");
        if (image) {
          if (!image.startsWith("http")) {
            image = `https://finance.naver.com${image}`;
          }
        }

        newsList.push({
          title,
          link,
          press: pressElement.text().trim(),
          time: timeElement.text().trim(),
          image,
        });
      }
    });

    return newsList.slice(0, 10); // Return top 10 news
  } catch (error) {
    console.error("Failed to scrape news:", error);
    return [];
  }
}
