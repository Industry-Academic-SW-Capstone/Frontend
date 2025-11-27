import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/Drawer";

const TierSystemGuide: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="pb-6">
            <DrawerTitle className="text-2xl font-bold tracking-tight mb-2">
              티어 및 점수 시스템
            </DrawerTitle>
            <DrawerDescription className="text-base text-text-secondary">
              스톡잇의 티어 제도 및 점수 시스템을 소개해요.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-5 pb-10 space-y-8 overflow-y-auto">
            {/* 1. 시스템 개요 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-text-primary tracking-tight">
                  어떤 시스템인가요?
                </h3>
              </div>
              <div className="bg-bg-third/50 rounded-2xl p-5">
                <p className="text-text-secondary leading-relaxed">
                  사용자의{" "}
                  <span className="text-text-primary font-semibold">
                    성실함(활동 점수)
                  </span>
                  과{" "}
                  <span className="text-text-primary font-semibold">
                    투자 실력(실력 점수)
                  </span>
                  을 합산하여 티어를 산정해요. 수익금이 커질수록 점수 획득이
                  어려워지는 '수확 체감' 설계로 밸런스를 맞췄으며, 3개월 단위의
                  시즌제로 운영됩니다.
                </p>
              </div>
            </section>

            {/* 2. 점수 산정 방식 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-text-primary tracking-tight">
                  점수는 어떻게 계산하나요?
                </h3>
              </div>

              <div className="bg-bg-third/30 rounded-2xl p-6 mb-4 text-center border border-border-color/50">
                <p className="font-bold text-lg text-text-primary">
                  총점 = 활동 점수 + 실력 점수
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-bg-secondary rounded-2xl p-5 border border-border-color/50 shadow-sm">
                  <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    활동 점수
                  </h4>
                  <ul className="text-sm text-text-secondary space-y-1.5">
                    <li>• 앱 내 미션 수행으로 획득</li>
                    <li>• 초기값: 1,200점</li>
                    <li>• 최대: 2,200점 (골드 초입)</li>
                  </ul>
                </div>
                <div className="bg-bg-secondary rounded-2xl p-5 border border-border-color/50 shadow-sm">
                  <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    실력 점수
                  </h4>
                  <ul className="text-sm text-text-secondary space-y-1.5">
                    <li>• 확정 매도 수익금 기반</li>
                    <li>• 수익금의 제곱근으로 계산</li>
                    <li className="text-xs text-text-secondary/70 mt-1">
                      (예: 10만원 수익 → 100점)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. 티어 구조 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-text-primary tracking-tight">
                  티어는 총 14단계예요
                </h3>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border-color/50 shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-bg-third/50 text-text-secondary font-medium">
                    <tr>
                      <th className="px-5 py-3 font-semibold">티어</th>
                      <th className="px-5 py-3 font-semibold text-right">
                        점수 구간
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color/50 bg-bg-secondary">
                    <tr>
                      <td className="px-5 py-3 font-bold text-bronze">
                        BRONZE
                      </td>
                      <td className="px-5 py-3 text-right text-text-secondary">
                        1 ~ 1,200
                      </td>
                    </tr>
                    <tr className="bg-accent/5">
                      <td className="px-5 py-3 font-bold text-silver flex items-center gap-2">
                        SILVER
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent/10 text-accent font-medium">
                          START
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-text-primary font-medium">
                        1,200 ~ 1,800
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-bold text-gold">GOLD</td>
                      <td className="px-5 py-3 text-right text-text-secondary">
                        1,800 ~ 2,400
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-bold text-platinum">
                        MASTER
                      </td>
                      <td className="px-5 py-3 text-right text-text-secondary">
                        2,400 ~ 3,000
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-bold text-legend">
                        GRANDMASTER
                      </td>
                      <td className="px-5 py-3 text-right text-text-secondary">
                        3,000 ~ 3,600
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-black text-legend">
                        LEGEND
                      </td>
                      <td className="px-5 py-3 text-right text-text-secondary">
                        3,600 이상
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. 운영 정책 */}
            <section>
              <h3 className="text-xl font-bold text-text-primary tracking-tight mb-4">
                꼭 알아두세요
              </h3>
              <div className="bg-bg-third/30 rounded-2xl p-5 space-y-5">
                <div>
                  <h4 className="font-bold text-text-primary text-sm mb-1">
                    3개월 시즌제
                  </h4>
                  <p className="text-sm text-text-secondary leading-snug">
                    시즌 종료 시 랭킹 결산 후 점수가 초기화돼요.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm mb-1">
                    공정한 경쟁
                  </h4>
                  <p className="text-sm text-text-secondary leading-snug">
                    기본 계좌의 거래만 인정되며, 어뷰징은 엄격히 제한돼요.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-error text-sm mb-1">
                    파산 시 초기화
                  </h4>
                  <p className="text-sm text-text-secondary leading-snug">
                    파산 신청 시 티어는 IRON(0점)으로 초기화되니 주의하세요.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TierSystemGuide;
