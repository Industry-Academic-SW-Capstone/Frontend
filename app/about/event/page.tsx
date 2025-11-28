"use client";
import { motion, Variants } from "framer-motion";

export default function AnnouncePage() {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black overflow-x-hidden">
      {/* Header Section with Gradient Fade */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full bg-gradient-to-b from-[#3182F6] via-[#82aded] via-70% to-[#F9FAFB] dark:from-[#1E2B45] dark:via-[#0a0a0a] dark:via-70% dark:to-black pt-24 pb-20 px-6 flex flex-col items-center text-center relative"
      >
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto w-full">
          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-block bg-white/10 text-white text-[15px] font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-md border border-white/10 shadow-sm"
          >
            기간 한정 이벤트
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-[42px] md:text-[56px] font-bold leading-[1.2] mb-6 text-white tracking-tight drop-shadow-md"
          >
            스톡잇 런칭기념
            <br />
            <span className="font-extrabold">모의투자대회</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-blue-50/90 text-[20px] md:text-[24px] font-medium leading-relaxed mb-8"
          >
            총 자본금 1억으로 시작하는
            <br />
            스톡잇 공식 모의투자대회
          </motion.p>
        </div>

        {/* Decorative Elements - Subtle Gradient Orbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_60%)] pointer-events-none blur-3xl"
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-6 -mt-10 pb-32 space-y-16 max-w-3xl mx-auto w-full"
      >
        {/* Prizes Section - Seamless Flow */}
        <div className="relative">
          <motion.h3
            variants={itemVariants}
            className="text-[32px] font-bold text-[#191F28] dark:text-white mb-10 leading-snug text-center"
          >
            총 4분께
            <br />
            <span className="text-[#3182F6]">선물을 드려요</span>
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1위 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-sm border border-gray-100 dark:border-[#333] text-center"
            >
              <div className="w-[80px] h-[80px] bg-gray-50 dark:bg-[#222] rounded-full flex items-center justify-center text-[40px] mb-4 shadow-inner">
                🍗
              </div>
              <span className="text-[#3182F6] font-bold text-[15px] mb-1">
                수익금 1위
              </span>
              <span className="text-[#333D4B] dark:text-gray-100 font-bold text-[20px] mb-1">
                BHC 치킨 세트
              </span>
              <span className="text-[#8B95A1] text-[14px]">25,000원 상당</span>
            </motion.div>

            {/* 2위 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-sm border border-gray-100 dark:border-[#333] text-center"
            >
              <div className="w-[80px] h-[80px] bg-gray-50 dark:bg-[#222] rounded-full flex items-center justify-center text-[40px] mb-4 shadow-inner">
                💄
              </div>
              <span className="text-[#3182F6] font-bold text-[15px] mb-1">
                수익금 2위
              </span>
              <span className="text-[#333D4B] dark:text-gray-100 font-bold text-[20px] mb-1">
                올리브영 2만원권
              </span>
              <span className="text-[#8B95A1] text-[14px] opacity-0">-</span>{" "}
              {/* Spacer */}
            </motion.div>

            {/* 3위 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-sm border border-gray-100 dark:border-[#333] text-center"
            >
              <div className="w-[80px] h-[80px] bg-gray-50 dark:bg-[#222] rounded-full flex items-center justify-center text-[40px] mb-4 shadow-inner">
                🛵
              </div>
              <span className="text-[#3182F6] font-bold text-[15px] mb-1">
                수익금 3위
              </span>
              <span className="text-[#333D4B] dark:text-gray-100 font-bold text-[20px] mb-1">
                배달의민족 1만원권
              </span>
              <span className="text-[#8B95A1] text-[14px] opacity-0">-</span>{" "}
              {/* Spacer */}
            </motion.div>
          </div>
        </div>

        {/* Special Prize Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[32px] p-10 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#333] shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-center md:text-left">
              <h3 className="text-[28px] font-bold text-[#191F28] dark:text-white leading-snug mb-4">
                특별상도
                <br />
                준비했어요
              </h3>
              <div className="space-y-2">
                <h4 className="font-bold text-[#333D4B] dark:text-gray-100 text-[20px]">
                  창의적 망함상
                </h4>
                <p className="text-[#6B7684] dark:text-gray-400 text-[16px] leading-relaxed">
                  손해를 많이 보신 분들 중에서 GRIT팀이 선정한,
                  <br />
                  포트폴리오가 가장 창의적인 분께 드려요.
                </p>
              </div>
            </div>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              className="text-[100px] filter drop-shadow-md"
            >
              👻
            </motion.span>
          </div>
          {/* Decorative background blob */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-full blur-3xl pointer-events-none opacity-50" />
        </motion.div>

        {/* Rules Section */}
        <motion.div variants={itemVariants} className="pt-8">
          <h3 className="text-[28px] font-bold text-[#191F28] dark:text-white mb-10 text-center">
            참여 방법
          </h3>
          <div className="relative max-w-2xl mx-auto">
            <ul className="space-y-12 relative ml-4 md:ml-0">
              {/* Gradient Vertical Line */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#3182F6] via-[#E5E8EB] to-[#E5E8EB] dark:from-[#3182F6] dark:via-[#333] dark:to-[#333]"
              />

              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="relative pl-10"
              >
                <span className="absolute left-0 top-2 w-4 h-4 rounded-full bg-[#3182F6] ring-4 ring-white dark:ring-black z-10 shadow-sm"></span>
                <p className="font-bold text-[#333D4B] dark:text-gray-100 mb-2 text-[20px]">
                  대회 참여
                </p>
                <p className="text-[#6B7684] dark:text-gray-400 text-[16px] leading-relaxed">
                  상단 고정된 대회에서 대회 기간 내<br className="md:hidden" />{" "}
                  1회 이상 거래하면 참여 완료
                </p>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="relative pl-10"
              >
                <span className="absolute left-0 top-2 w-4 h-4 rounded-full bg-[#E5E8EB] dark:bg-[#333] ring-4 ring-white dark:ring-black z-10"></span>
                <p className="font-bold text-[#333D4B] dark:text-gray-100 mb-2 text-[20px]">
                  자본금 1억
                </p>
                <p className="text-[#6B7684] dark:text-gray-400 text-[16px] leading-relaxed">
                  가상 자본금으로 부담 없이 투자하세요
                </p>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0 }}
                className="relative pl-10"
              >
                <span className="absolute left-0 top-2 w-4 h-4 rounded-full bg-[#E5E8EB] dark:bg-[#333] ring-4 ring-white dark:ring-black z-10"></span>
                <p className="font-bold text-[#333D4B] dark:text-gray-100 mb-2 text-[20px]">
                  카카오톡 연동
                </p>
                <p className="text-[#6B7684] dark:text-gray-400 text-[16px] leading-relaxed">
                  대회 참여를 위해서는 카카오톡으로
                  <br className="md:hidden" /> 인증된 계정이어야 해요.
                </p>
              </motion.li>
            </ul>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={fadeInVariants}
          className="py-12 border-t border-gray-200 dark:border-[#222] text-center md:text-left"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-[#8B95A1] text-[15px] mb-4">
                대회 일정 상세
              </h4>
              <p className="text-[15px] text-[#8B95A1] font-medium">
                2025.11.28(목) 09:00 ~ 12.05(목) 12:00
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#8B95A1] text-[15px] mb-4">
                유의사항
              </h4>
              <ul className="text-[13px] text-[#8B95A1] space-y-2 leading-relaxed tracking-tight">
                <li>
                  • 본 이벤트는 당사 사정에 따라 사전 고지 없이 변경되거나 조기
                  종료될 수 있습니다.
                </li>
                <li>
                  • 부정한 방법(어뷰징 등)으로 참여 시 당첨이 취소될 수
                  있습니다.
                </li>
                <li>
                  • 상품 발송을 위해 개인정보(이메일) 활용 동의가 필요할 수
                  있습니다.
                </li>
                <li>
                  • 특별상의 대상자는 비공개로 GRIT팀 내부 투표를 통해 진행되며,
                  상품은 발표 후에 공개됩니다.
                </li>
                <li>
                  • 우승자 분들의 포트폴리오와 실적 등의 정보는 발표 후에 공개될
                  수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Bottom Button with Gradient Mask */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent pb-10 z-50 flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-md py-4 bg-[#3182F6] text-white font-bold rounded-[24px] text-[18px] shadow-lg shadow-blue-500/30"
          onClick={() => {
            // Handle join or navigation
            window.location.href = "/pwa";
          }}
        >
          지금 참여하기
        </motion.button>
      </motion.div>
    </div>
  );
}
