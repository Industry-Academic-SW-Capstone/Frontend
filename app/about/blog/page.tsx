import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/about/Header";
import { Footer } from "@/components/about/Footer";
import { BLOG_POSTS } from "@/components/about/constants";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/ui/Motion";
import { Calendar, Clock, User } from "lucide-react";

export const metadata: Metadata = {
  title: "블로그 - StockIt",
  description: "StockIt 팀의 개발 이야기와 금융 인사이트를 공유합니다.",
  alternates: {
    canonical: "/about/blog",
  },
  openGraph: {
    title: "블로그 - StockIt",
    description: "StockIt 팀의 개발 경험과 금융 인사이트를 공유합니다.",
    url: "/about/blog",
  },
};

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    blogPost: BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: post.author,
      },
      image: post.image,
    })),
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="pt-32 pb-20 container mx-auto px-6">
        <FadeIn direction="up" duration={0.6}>
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              블로그
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              개발 과정의 고민과 금융에 대한 새로운 시각을 공유합니다.
            </p>
          </div>
        </FadeIn>

        <Stagger
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          staggerDelay={0.1}
        >
          {BLOG_POSTS.map((post) => (
            <StaggerItem key={post.id} direction="up">
              <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 pt-6 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {post.author}
                    </span>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </main>
      <Footer />
    </div>
  );
}
