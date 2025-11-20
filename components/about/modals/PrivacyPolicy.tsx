import React from "react";

export const PrivacyPolicyContent: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-700">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
        <p className="text-sm text-gray-600">
          <strong className="text-blue-900">시행일자:</strong> 2025년 11월 20일
        </p>
      </div>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          1. 개인정보의 수집 및 이용 목적
        </h3>
        <p className="mb-4 leading-relaxed">
          StockIt! (이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다.
          처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
          이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의
          동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른
            본인 식별·인증
          </li>
          <li>
            서비스 제공: 모의투자 서비스, 투자 대회 운영, 랭킹 시스템 제공
          </li>
          <li>
            마케팅 및 광고: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및
            광고성 정보 제공
          </li>
          <li>서비스 개선: 사용자 경험 개선, 통계학적 분석</li>
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          2. 수집하는 개인정보 항목
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">필수 항목</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>이메일 주소</li>
              <li>닉네임</li>
              <li>비밀번호 (암호화 저장)</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">선택 항목</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>프로필 이미지</li>
              <li>관심 종목</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">자동 수집 항목</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>IP 주소, 쿠키, 서비스 이용 기록</li>
              <li>기기 정보 (OS, 브라우저 종류)</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          3. 개인정보의 보유 및 이용기간
        </h3>
        <p className="mb-4 leading-relaxed">
          회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
          개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를
          처리·보유합니다.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 관련 법령에 따라
            보존 필요시 해당 기간 동안 보관)
          </li>
          <li>
            <strong>거래 기록:</strong> 전자상거래 등에서의 소비자보호에 관한
            법률에 따라 5년
          </li>
          <li>
            <strong>로그 기록:</strong> 통신비밀보호법에 따라 3개월
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          4. 개인정보의 제3자 제공
        </h3>
        <p className="leading-relaxed">
          회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
          다만, 다음의 경우에는 예외로 합니다:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>이용자가 사전에 동의한 경우</li>
          <li>
            법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에
            따라 수사기관의 요구가 있는 경우
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          5. 개인정보 처리의 위탁
        </h3>
        <p className="mb-4 leading-relaxed">
          회사는 서비스 향상을 위해 아래와 같이 개인정보 처리 업무를 외부
          전문업체에 위탁하여 처리하고 있습니다.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">수탁업체</th>
                <th className="p-2 text-left">위탁업무 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-300">
                <td className="p-2">GCP (Google Cloud Platform)</td>
                <td className="p-2">서버 호스팅 및 데이터 보관</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          6. 정보주체의 권리·의무 및 행사방법
        </h3>
        <p className="mb-4 leading-relaxed">
          이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>개인정보 열람 요구</li>
          <li>개인정보 오류 등이 있을 경우 정정 요구</li>
          <li>개인정보 삭제 요구</li>
          <li>개인정보 처리정지 요구</li>
        </ul>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong className="text-blue-900">권리 행사 방법:</strong>
            설정 메뉴 내 '개인정보 관리' 또는 이메일(urous3814@gmail.com)을 통해
            요청하실 수 있습니다.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          7. 개인정보의 파기
        </h3>
        <p className="mb-4 leading-relaxed">
          회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
          불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
        </p>
        <div className="space-y-2">
          <p>
            <strong>파기 절차:</strong> 이용자가 입력한 정보는 목적 달성 후
            별도의 DB에 옮겨져 내부 방침 및 관련 법령에 따라 일정기간 저장된 후
            혹은 즉시 파기됩니다.
          </p>
          <p>
            <strong>파기 방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할
            수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는
            분쇄기로 분쇄하거나 소각하여 파기합니다.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          8. 개인정보 보호책임자
        </h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="mb-2">
            <strong>개인정보 보호책임자:</strong> 최재현
          </p>
          <p className="mb-2">
            <strong>이메일:</strong> macarthur17@naver.com
          </p>
          <p className="text-sm text-gray-600 mt-4">
            기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에
            문의하시기 바랍니다.
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
            <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
            <li>개인정보 분쟁조정위원회 (www.kopico.go.kr / 1833-6972)</li>
            <li>대검찰청 사이버범죄수사단 (www.spo.go.kr / 국번없이 1301)</li>
            <li>
              경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          9. 개인정보 처리방침의 변경
        </h3>
        <p className="leading-relaxed">
          이 개인정보처리방침은 2025년 11월 20일부터 적용되며, 법령 및 방침에
          따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
          전부터 공지사항을 통하여 고지할 것입니다.
        </p>
      </section>
    </div>
  );
};
