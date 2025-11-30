"use client";
import { useState } from "react";

const AdminInsightPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [latestData, setLatestData] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setMessage("전체 인사이트 생성 중 (AI 분석 포함)...");

    try {
      const response = await fetch("/api/insight/generate");
      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ 성공! Snapshot ID: ${data.snapshot_id}`);
        // Auto-fetch latest after generation
        setTimeout(() => handleFetchLatest(), 1000);
      } else {
        setMessage(`❌ 실패: ${data.error || "Unknown error"}`);
      }
    } catch (error: any) {
      setMessage(`❌ 에러: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFactSheetOnly = async () => {
    setLoading(true);
    setMessage("팩트시트 생성 중 (데이터 수집)...");

    try {
      // Use the collect endpoint which generates fact sheet only
      const response = await fetch("/api/insight/collect");
      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ 팩트시트 생성 성공! ID: ${data.fact_sheet_id}`);
      } else {
        setMessage(`❌ 실패: ${data.error || "Unknown error"}`);
      }
    } catch (error: any) {
      setMessage(`❌ 에러: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchLatest = async () => {
    try {
      const response = await fetch("/api/insight/latest");
      const data = await response.json();
      setLatestData(data.data);
    } catch (error: any) {
      alert("데이터 불러오기 실패: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">📊 Insight Admin Panel</h1>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🎮 Controls</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-bold mb-2">수동 생성</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "작업 중..." : "전체 인사이트 생성 (AI 포함)"}
                </button>

                <button
                  onClick={handleGenerateFactSheetOnly}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  {loading ? "작업 중..." : "팩트시트만 생성 (데이터 수집)"}
                </button>
              </div>
              {message && (
                <p className="mt-2 text-sm text-gray-600">{message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleFetchLatest}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                📥 최신 데이터 불러오기
              </button>
            </div>
          </div>
          {message && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="font-mono text-sm">{message}</p>
            </div>
          )}
        </div>

        {/* JSON Viewer */}
        {latestData && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">📄 Latest Snapshot JSON</h2>
              <div className="text-sm text-gray-500">
                ID: {latestData.id} | Created:{" "}
                {new Date(latestData.created_at).toLocaleString("ko-KR")}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Mode:{" "}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {latestData.mode_type}
                </span>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-[600px]">
              <pre className="text-green-400 font-mono text-xs">
                {JSON.stringify(latestData.payload, null, 2)}
              </pre>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(latestData.payload, null, 2)
                  )
                }
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                📋 JSON 복사
              </button>
              <button
                onClick={() => {
                  const blob = new Blob(
                    [JSON.stringify(latestData.payload, null, 2)],
                    { type: "application/json" }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `insight-${latestData.id}.json`;
                  a.click();
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                💾 JSON 다운로드
              </button>
            </div>
          </div>
        )}

        {!latestData && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500">
              데이터를 불러오려면 위의 버튼을 클릭하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInsightPage;
