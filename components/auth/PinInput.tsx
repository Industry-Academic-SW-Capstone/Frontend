"use client";

import { useState, useEffect } from "react";

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  title?: string;
  subtitle?: string;
  error?: string;
  autoFocus?: boolean;
  onBack?: () => void;
}

export default function PinInput({
  length = 6,
  onComplete,
  title = "PIN 입력",
  subtitle = "보안 PIN을 입력해주세요",
  error,
  autoFocus = true,
  onBack,
}: PinInputProps) {
  useEffect(() => {
    setPin(Array(length).fill(""));
  }, [title, subtitle]);
  const [pin, setPin] = useState<string[]>(Array(length).fill(""));
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [clickedPinIndexs, setClickedPinIndexs] = useState<number[]>([]);
  const [PinResetTimer, setPinResetTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (autoFocus && typeof window !== "undefined") {
      // 자동 포커스를 위한 숨겨진 input
      const hiddenInput = document.getElementById(
        "hidden-pin-input"
      ) as HTMLInputElement;
      hiddenInput?.focus();
    }
  }, [autoFocus]);

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      if (PinResetTimer) clearTimeout(PinResetTimer);
      setClickedPinIndexs([-1]);

      setPinResetTimer(
        setTimeout(() => {
          setClickedPinIndexs([]);
        }, 700)
      );
      setPin((prev) => {
        const newPin = [...prev];
        const lastFilledIndex = newPin.findLastIndex((p) => p !== "");
        if (lastFilledIndex >= 0) {
          newPin[lastFilledIndex] = "";
        }
        return newPin;
      });
      return;
    }

    if (!/^\d$/.test(key)) return;

    setPin((prev) => {
      if (PinResetTimer) clearTimeout(PinResetTimer);
      setClickedPinIndexs(() => {
        const pressed = Number(key);
        let fake = Math.floor(Math.random() * 10); // 0..9 난수 생성
        if (fake === pressed) {
          // 만약 동일하면 다음 숫자로 보정(0~9 범위 유지)
          fake = (fake + 1) % 10;
        }
        return [fake, pressed];
      });

      setPinResetTimer(
        setTimeout(() => {
          setClickedPinIndexs([]);
        }, 700)
      );
      const newPin = [...prev];
      const firstEmptyIndex = newPin.findIndex((p) => p === "");

      if (firstEmptyIndex !== -1) {
        newPin[firstEmptyIndex] = key;

        setActiveIndices([firstEmptyIndex]);

        setTimeout(() => setActiveIndices([]), 300);

        // 모두 입력되었으면 onComplete 호출
        if (firstEmptyIndex === length - 1) {
          setTimeout(() => {
            onComplete(newPin.join(""));
          }, 300);
        }
      }

      return newPin;
    });
  };

  return (
    <div className="flex z-50 flex-col items-center justify-center min-h-screen-safe bg-linear-to-br from-gray-900 via-gray-800 to-black px-6">
      {/* 숨겨진 input (키보드 입력 받기 용) */}
      <input
        id="hidden-pin-input"
        type="text"
        inputMode="none"
        className="absolute opacity-0 pointer-events-none"
        onKeyDown={(e) => {
          e.preventDefault();
          if (e.key === "Backspace") {
            handleKeyPress("backspace");
          } else if (/^\d$/.test(e.key)) {
            handleKeyPress(e.key);
          }
        }}
      />

      <div className="w-full max-w-md">
        {/* 타이틀 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>

        {/* PIN 디스플레이 */}
        <div className="flex justify-center gap-3 mb-8">
          {pin.map((digit, index) => (
            <div
              key={index}
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center
                transition-all duration-300 transform
                ${
                  digit
                    ? "bg-blue-500 scale-110"
                    : activeIndices.includes(index)
                    ? "bg-blue-400 scale-105"
                    : "bg-gray-700"
                }
                ${activeIndices.includes(index) ? "ring-4 ring-blue-300" : ""}
              `}
            >
              {digit && (
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="text-center mb-6">
            <p className="text-red-400 text-sm animate-shake">{error}</p>
          </div>
        )}

        {/* 숫자 키패드 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className={`
                h-16 rounded-2xl bg-gray-800 hover:bg-gray-700
                text-white text-2xl font-semibold
                transition-all duration-200
                hover:shadow-lg hover:shadow-blue-500/20
                ${
                  clickedPinIndexs.includes(num)
                    ? "ring-3 ring-blue-300 scale-95"
                    : ""
                }
              `}
            >
              {num}
            </button>
          ))}

          {/* 빈 공간 */}
          {onBack ? (
            <button
              onClick={onBack}
              className="
                h-16 rounded-2xl bg-gray-800 hover:bg-gray-700
                text-white text-xl
                transition-all duration-200 active:scale-95
                hover:shadow-lg hover:shadow-gray-500/20
              "
            >
              재설정
            </button>
          ) : (
            <div />
          )}

          {/* 0 */}
          <button
            onClick={() => handleKeyPress("0")}
            className="
              h-16 rounded-2xl bg-gray-800 hover:bg-gray-700
              text-white text-2xl font-semibold
              transition-all duration-200 active:scale-95
              hover:shadow-lg hover:shadow-blue-500/20
            "
          >
            0
          </button>

          {/* 백스페이스 */}
          <button
            onClick={() => handleKeyPress("backspace")}
            className="
              h-16 rounded-2xl bg-gray-800 hover:bg-gray-700
              text-white text-xl
              transition-all duration-200 active:scale-95
              hover:shadow-lg hover:shadow-red-500/20
            "
          >
            ⌫
          </button>
        </div>

        {/* 진행 상황 인디케이터 */}
        <div className="flex justify-center gap-1">
          {pin.map((_, index) => (
            <div
              key={index}
              className={`
                h-1 w-8 rounded-full transition-all duration-300
                ${pin[index] ? "bg-blue-500" : "bg-gray-700"}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
