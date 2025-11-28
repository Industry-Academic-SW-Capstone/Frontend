"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

interface EventDescriptionScreenProps {
  onClose: () => void;
}

const EventDescriptionScreen: React.FC<EventDescriptionScreenProps> = ({
  onClose,
}) => {
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
    <div className="relative w-full h-full bg-[#F9FAFB] dark:bg-black overflow-x-hidden overflow-y-auto">
      {/* Header Section with Gradient Fade */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full bg-gradient-to-b from-[#3182F6] via-[#82aded] via-70% to-[#F9FAFB] dark:from-[#1E2B45] dark:via-[#0a0a0a] dark:via-70% dark:to-black pt-16 pb-12 px-6 flex flex-col items-center text-center relative"
      >
        <div className="relative z-10 flex pt-safe flex-col items-center">
          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-block bg-white/10 text-white text-[13px] font-semibold px-3 py-1.5 rounded-full mb-5 backdrop-blur-md border border-white/10 shadow-sm"
          >
            기간 한정 이벤트
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-[30px] font-bold leading-[1.3] mb-3 text-white tracking-tight drop-shadow-md"
          >
            스톡잇 런칭기념
            <br />
            <span className="font-extrabold text-[33px]">모의투자대회</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-blue-50/90 text-[17px] font-medium leading-relaxed mb-6"
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
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_60%)] pointer-events-none blur-3xl"
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-6 -mt-6 pb-32 space-y-12"
      >
        {/* Prizes Section - Seamless Flow */}
        <div className="relative">
          <motion.h3
            variants={itemVariants}
            className="text-[24px] pt-8 font-bold text-[#191F28] dark:text-white mb-8 leading-snug"
          >
            총 4분께
            <br />
            <span className="text-[#3182F6]">선물을 드려요</span>
          </motion.h3>

          <div className="space-y-2">
            {/* 1위 */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between p-4 "
            >
              <div className="flex flex-col">
                <span className="text-[#3182F6] font-bold text-[13px]">
                  수익금 1위
                </span>
                <span className="text-[#333D4B] dark:text-gray-100 font-bold text-[18px]">
                  BHC 치킨 세트
                </span>
                <span className="text-[#8B95A1] text-[12px] mt-0.5">
                  25,000원 상당
                </span>
              </div>
              <div className="w-[56px] h-[56px] bg-white dark:bg-[#1A1A1A] rounded-full flex items-center justify-center text-[30px] shadow-sm border border-gray-50 dark:border-[#333]">
                🍗
              </div>
            </motion.div>
            {/* 2위 */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between p-4 "
            >
              <div className="flex flex-col">
                <span className="text-[#3182F6] font-bold text-[13px]">
                  수익금 2위
                </span>
                <span className="text-[#333D4B] dark:text-gray-100 font-bold text-[18px]">
                  올리브영 2만원권
                </span>
              </div>
              <div className="w-[56px] h-[56px] bg-white dark:bg-[#1A1A1A] rounded-full flex items-center justify-center text-[30px] shadow-sm border border-gray-50 dark:border-[#333]">
                💄
              </div>
            </motion.div>
            {/* 3위 */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between p-4 "
            >
              <div className="flex flex-col">
                <span className="text-[#3182F6] font-bold text-[13px]">
                  수익금 3위
                </span>
                <span className="text-[#333D4B] dark:text-gray-100 font-bold text-[18px]">
                  배달의민족 1만원권
                </span>
              </div>
              <div className="w-[56px] h-[56px] bg-white dark:bg-[#1A1A1A] rounded-full flex items-center justify-center text-[30px] shadow-sm border border-gray-50 dark:border-[#333]">
                🛵
              </div>
            </motion.div>
          </div>
        </div>

        {/* Special Prize Section - Subtle Highlight */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl p-6"
        >
          <div className="flex items-start justify-between mb-4 relative z-10">
            <h3 className="text-[20px] -ml-2 font-bold text-[#191F28] dark:text-white leading-snug">
              특별상도
              <br />
              준비했어요
            </h3>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              className="text-[36px] filter drop-shadow-md"
            >
              👻
            </motion.span>
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-[#333D4B] dark:text-gray-100 mb-1 text-[16px]">
              창의적 망함상
            </h4>
            <p className="text-[#6B7684] dark:text-gray-400 text-[14px] leading-relaxed">
              손해를 많이 보신 분들 중에서 GRIT팀이 선정한,
              <br />
              포트폴리오가 가장 창의적인 분께 드려요.
            </p>
          </div>
          {/* Decorative background blob */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-200/50 dark:bg-gray-800/30 rounded-full blur-2xl pointer-events-none" />
        </motion.div>

        {/* Rules Section */}
        <motion.div variants={itemVariants} className="pt-2">
          <h3 className="text-[20px] font-bold text-[#191F28] dark:text-white mb-6">
            참여 방법
          </h3>
          <ul className="space-y-8 relative ml-2">
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
              className="relative pl-8"
            >
              <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#3182F6] ring-4 ring-white dark:ring-black z-10 shadow-sm"></span>
              <p className="font-bold text-[#333D4B] dark:text-gray-100 mb-1 text-[16px]">
                대회 참여
              </p>
              <p className="text-[#6B7684] dark:text-gray-400 text-[14px] leading-relaxed">
                상단 고정된 대회에서 대회 기간 내<br />
                1회 이상 거래하면 참여 완료
              </p>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="relative pl-8"
            >
              <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#E5E8EB] dark:bg-[#333] ring-4 ring-white dark:ring-black z-10"></span>
              <p className="font-bold text-[#333D4B] dark:text-gray-100 mb-1 text-[16px]">
                자본금 1억
              </p>
              <p className="text-[#6B7684] dark:text-gray-400 text-[14px] leading-relaxed">
                가상 자본금으로 부담 없이 투자하세요
              </p>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
              className="relative pl-8"
            >
              <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#E5E8EB] dark:bg-[#333] ring-4 ring-white dark:ring-black z-10"></span>
              <p className="font-bold text-[#333D4B] dark:text-gray-100 mb-1 text-[16px]">
                카카오톡 연동
              </p>
              <p className="text-[#6B7684] dark:text-gray-400 text-[14px] leading-relaxed">
                대회 참여를 위해서는 카카오톡으로
                <br />
                인증된 계정이어야 해요.
              </p>
            </motion.li>
          </ul>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={fadeInVariants}
          className="py-8 border-t border-gray-100 dark:border-[#222]"
        >
          <h4 className="font-bold text-[#8B95A1] text-[13px] mb-3">
            대회 일정 상세
          </h4>
          <p className="text-[13px] text-[#8B95A1] mb-6 font-medium">
            2025.11.28(금) 09:00 ~ 12.05(금) 13:00
          </p>

          <h4 className="font-bold text-[#8B95A1] text-[13px] mb-3">
            유의사항
          </h4>
          <ul className="text-[12px] text-[#8B95A1] space-y-2 leading-relaxed tracking-tight">
            <li>
              • 본 이벤트는 당사 사정에 따라 사전 고지 없이 변경되거나 조기
              종료될 수 있습니다.
            </li>
            <li>
              • 부정한 방법(어뷰징 등)으로 참여 시 당첨이 취소될 수 있습니다.
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
              • 우승자 분들의 포트폴리오와 실적 등의 정보는 발표 후에 공개될 수
              있습니다.
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Floating Bottom Button with Gradient Mask */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-0 left-0 w-full p-5 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent pb-safe z-50"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full py-4 bg-[#3182F6] text-white font-bold rounded-[20px] text-[17px] shadow-lg shadow-blue-500/30"
        >
          지금 참여하기
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EventDescriptionScreen;
