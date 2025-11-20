import React from "react";

export const TermsOfServiceContent: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-700">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
        <p className="text-sm text-gray-600">
          <strong className="text-blue-900">시행일자:</strong> 2025년 11월 20일
        </p>
      </div>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">제1조 (목적)</h3>
        <p className="leading-relaxed">
          본 약관은 StockIt! (이하 "회사")가 제공하는 주식 모의투자 서비스(이하
          "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항,
          기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제2조 (용어의 정의)
        </h3>
        <ul className="space-y-3">
          <li>
            <strong className="text-gray-900">1. "서비스"</strong>란 회사가
            제공하는 주식 모의투자 플랫폼으로, 실제 주식 시장 데이터를 기반으로
            가상의 자금으로 주식 매매를 경험할 수 있는 시뮬레이션 서비스를
            의미합니다.
          </li>
          <li>
            <strong className="text-gray-900">2. "회원"</strong>이란 회사의
            서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가
            제공하는 서비스를 이용하는 고객을 말합니다.
          </li>
          <li>
            <strong className="text-gray-900">3. "계정(ID)"</strong>이란 회원의
            식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인하는 이메일
            주소를 말합니다.
          </li>
          <li>
            <strong className="text-gray-900">4. "가상 자금"</strong>이란 서비스
            내에서 주식 거래에 사용되는 가상의 화폐로, 실제 금전적 가치가 없음을
            의미합니다.
          </li>
          <li>
            <strong className="text-gray-900">5. "대회"</strong>란 정해진 기간
            동안 회원들이 수익률을 겨루는 이벤트를 의미합니다.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제3조 (약관의 효력 및 변경)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을
            발생합니다.
          </li>
          <li>
            회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을
            변경할 수 있으며, 변경된 약관은 시행일로부터 7일 전에 공지합니다.
          </li>
          <li>
            회원이 변경된 약관에 동의하지 않을 경우, 서비스 이용을 중단하고
            탈퇴할 수 있습니다. 변경된 약관의 시행일 이후에도 서비스를 계속
            이용하는 경우에는 약관의 변경 사항에 동의한 것으로 간주됩니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제4조 (회원가입)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            회원가입은 이용자가 약관의 내용에 대하여 동의를 한 다음 회원가입
            신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
          </li>
          <li>
            회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나
            사후에 이용계약을 해지할 수 있습니다:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>타인의 명의를 사용하여 신청한 경우</li>
              <li>
                허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은
                경우
              </li>
              <li>만 14세 미만 아동이 법정대리인의 동의를 얻지 아니한 경우</li>
              <li>
                이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반
                사항을 위반하며 신청하는 경우
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제5조 (서비스의 제공 및 변경)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            회사는 다음과 같은 서비스를 제공합니다:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>실시간 주식 시세를 기반으로 한 모의투자 기능</li>
              <li>포트폴리오 관리 및 수익률 분석</li>
              <li>주간/월간 투자 대회</li>
              <li>랭킹 시스템 및 리더보드</li>
              <li>투자 미션 및 리워드 시스템</li>
              <li>투자 관련 정보 및 뉴스 제공</li>
            </ul>
          </li>
          <li>
            회사는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라
            제공하고 있는 서비스를 변경할 수 있습니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제6조 (서비스의 중단)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절
            등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수
            있습니다.
          </li>
          <li>
            제1항에 의한 서비스 중단의 경우에는 회사는 사전에 통지합니다. 다만,
            회사가 통제할 수 없는 사유로 인한 서비스의 중단으로 인하여 사전
            통지가 불가능한 경우에는 그러하지 아니합니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제7조 (회원의 의무)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            회원은 다음 행위를 하여서는 안됩니다:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>신청 또는 변경 시 허위내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>
                회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는
                게시
              </li>
              <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>
                회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
              </li>
              <li>
                외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는
                정보를 서비스에 공개 또는 게시하는 행위
              </li>
              <li>자동화된 수단을 사용하여 서비스를 이용하는 행위</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제8조 (가상 자금 및 투자)
        </h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
          <p className="text-sm font-semibold text-yellow-900">
            ⚠️ 중요: 본 서비스는 모의투자 서비스입니다
          </p>
        </div>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            서비스 내 모든 거래는 가상 자금으로 이루어지며, 실제 금전적 가치가
            없습니다.
          </li>
          <li>
            회원이 서비스 내에서 달성한 수익 또는 손실은 실제 자산과 무관하며,
            회사는 이에 대한 어떠한 금전적 보상 또는 책임도 지지 않습니다.
          </li>
          <li>
            서비스에서 제공되는 정보는 투자 권유나 조언이 아니며, 실제 투자 결정
            시 참고 자료로만 활용되어야 합니다.
          </li>
          <li>
            회사는 시장 데이터의 정확성을 보장하지 않으며, 데이터 오류로 인한
            어떠한 손해에 대해서도 책임지지 않습니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제9조 (대회 및 이벤트)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            회사는 회원들의 참여를 독려하기 위해 다양한 대회 및 이벤트를 개최할
            수 있습니다.
          </li>
          <li>
            대회의 규칙, 기간, 보상 등은 각 대회별로 별도로 공지되며, 회사는
            필요에 따라 이를 변경할 수 있습니다.
          </li>
          <li>
            부정한 방법으로 대회에 참여하거나 결과를 조작한 것으로 판단되는
            경우, 회사는 해당 회원의 참가 자격을 박탈하고 계정을 정지할 수
            있습니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제10조 (저작권의 귀속 및 이용제한)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에
            귀속합니다.
          </li>
          <li>
            회원은 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이
            귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송
            기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게
            하여서는 안됩니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제11조 (계약해제, 해지 등)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            회원은 언제든지 서비스 이용을 원하지 않는 경우 회원 탈퇴를 통해
            이용계약을 해지할 수 있습니다.
          </li>
          <li>
            회사는 회원이 다음 각 호의 사유에 해당하는 경우, 사전통지 없이
            이용계약을 해지하거나 또는 기간을 정하여 서비스 이용을 중지할 수
            있습니다:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                타인의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래
                질서를 위협하는 경우
              </li>
              <li>
                서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에
                반하는 행위를 하는 경우
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제12조 (책임제한)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할
            수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
          </li>
          <li>
            회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을
            지지 않습니다.
          </li>
          <li>
            회사는 회원이 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한
            것에 대하여 책임을 지지 않으며, 서비스를 통하여 얻은 자료로 인한
            손해에 관하여 책임을 지지 않습니다.
          </li>
          <li>
            회사는 회원이 서비스에 게재한 정보, 자료, 사실의 신뢰도, 정확성 등
            내용에 관하여는 책임을 지지 않습니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제13조 (분쟁해결)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를
            보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
          </li>
          <li>
            서비스 이용과 관련하여 회사와 회원 사이에 분쟁이 발생한 경우, 회사와
            회원은 분쟁의 해결을 위해 성실히 협의합니다.
          </li>
          <li>
            본 약관에 명시되지 않은 사항은 전기통신사업법 등 관계법령과 상관습에
            따릅니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          제14조 (재판권 및 준거법)
        </h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>이 약관에 명시되지 않은 사항은 대한민국 법령에 의합니다.</li>
          <li>
            서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 대한민국
            법원을 관할 법원으로 합니다.
          </li>
        </ol>
      </section>

      <div className="bg-gray-50 p-6 rounded-lg mt-8">
        <p className="text-sm text-gray-600 text-center">
          <strong className="text-gray-900">부칙</strong>
          <br />본 약관은 2025년 11월 20일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
};
