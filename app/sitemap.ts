import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://stockit.live";
  // 팁: 실제 배포 시에는 new Date() 대신 실제 글 수정일이나 고정된 날짜를 쓰는 것이 SEO에 더 좋습니다.
  const currentDate = new Date();

  return [
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about/tech`,
      lastModified: currentDate,
      changeFrequency: "monthly", // 기술 블로그 등은 업데이트 빈도에 맞게 조절
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/announce`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pwa`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.1,
    },
  ];
}
