"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { User, UserGroup } from "@/lib/types/stock";
import * as Icons from "@/components/icons/Icons";
import {
  requestNotificationPermission,
  registerServiceWorker,
  subscribeToPush,
} from "@/lib/services/notificationService";
import TwoFactorSettings from "../settings/TwoFactorSettings";
import TFARegisterPage from "../auth/TFARegisterPage";
import {
  LoginRequest,
  SignUpRequest,
  KakaoCallbackResponse,
  KakaoSignupRequest,
} from "@/lib/types/auth";
import { useLogin } from "@/lib/hooks/auth/useLogin";
import { useSignup } from "@/lib/hooks/auth/useSignup";
import useKakaoOAuth from "@/lib/hooks/auth/useKakaoOAuth";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { usePutInfo } from "@/lib/hooks/me/useInfo";

type AuthStep =
  | "welcome"
  | "login"
  | "signup"
  | "pass"
  | "username"
  | "avatar"
  | "group"
  | "2FA"
  | "notification"
  | "complete";

interface AuthScreenProps {
  onLoginSuccess: (newUser: Partial<User>) => void;
}

const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({
  step,
  totalSteps,
}) => (
  <div className="w-full bg-border-color rounded-full h-1.5">
    <div
      className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${(step / totalSteps) * 100}%` }}
    />
  </div>
);

const OAuthButtons: React.FC<{
  title: string;
  onOAuth: () => void;
  disabled: boolean;
}> = ({ title, onOAuth, disabled }) => (
  <div className="space-y-3">
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-border-color" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-bg-primary px-2 text-sm text-text-secondary">
          {title}
        </span>
      </div>
    </div>
    {/* <button
      onClick={onOAuth}
      className="w-full flex items-center justify-center gap-3 py-3 border border-border-color rounded-xl font-semibold hover:bg-border-color/50"
    >
      <Icons.GoogleIcon className="w-6 h-6" />
      <span>Google로 계속하기</span>
    </button> */}
    <button
      onClick={onOAuth}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold bg-[#FEE500] text-[#3C1E1E] hover:bg-opacity-90"
    >
      <Icons.KakaoIcon className="w-6 h-6" />
      <span>카카오로 계속하기</span>
    </button>
    {/* <button
      onClick={onOAuth}
      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold bg-black text-white hover:bg-opacity-90"
    >
      <Icons.AppleIcon className="w-6 h-6" />
      <span>Apple로 계속하기</span>
    </button> */}
  </div>
);

const OnboardingScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<AuthStep>("welcome");
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.stockit.live";
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: "",
    avatar: "https://picsum.photos/seed/avatar1/100",
    group: undefined,
  });
  const [loginRequest, setLoginRequest] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [signupRequest, setSignupRequest] = useState<SignUpRequest>({
    email: "",
    password: "",
    name: "",
    profileImage: "",
    twoFactorEnabled: false,
    notificationAgreement: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isKakaoSignup, setIsKakaoSignup] = useState(false);
  const searchParams = useSearchParams();
  const { loginWithKakao, isLoading, fetchKakaoCallback } = useKakaoOAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleKakaoCallback(code);
    }
  }, [searchParams]);

  const handleKakaoCallback = async (code: string) => {
    setIsAuthLoading(true);
    try {
      const data = await fetchKakaoCallback(code, window.location.origin);

      if (data.token) {
        // 이미 가입된 유저 -> 로그인 처리
        onLoginSuccess({ username: "Kakao User" }); // 실제 유저 정보가 있다면 여기서 파싱
        // 토큰 저장 로직 필요 (useLogin 훅 내부 로직 참고하거나 직접 저장)
        // 예: localStorage.setItem("accessToken", data.token);
        // useAuthStore.getState().setToken(data.token); // 만약 store 밖에서 쓴다면
        alert("카카오 로그인 성공!");
      } else if (data.userInfo) {
        // 미가입 유저 -> 회원가입 진행
        const { email, name, profile_image } = data.userInfo;
        if (confirm("계정이 없습니다. 회원가입 하시겠습니까?")) {
          setIsKakaoSignup(true);
          setSignupRequest((prev) => ({
            ...prev,
            email,
            name,
            profile_image,
            password: "KAKAO_LOGIN_USER", // 더미 패스워드 혹은 별도 처리
          }));
          setStep("signup");
          // 바로 다음 단계로 넘길지, 아니면 signup 화면에서 보여줄지 결정
          // 여기서는 signup 화면으로 보내서 정보 확인하게 함
        } else {
          // 취소 시
          setStep("welcome");
        }
      }
    } catch (error: any) {
      console.error("Kakao Callback Error:", error);
      if (error.response?.status === 409) {
        if (confirm("이미 존재하는 계정입니다. 로그인 하시겠습니까?")) {
          // 로그인 처리 로직 (토큰이 있다면)
          // 혹은 일반 로그인 화면으로 이동
          setStep("login");
        }
      } else {
        setErrorMessage("카카오 로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsAuthLoading(false);
      // URL에서 code 제거 (선택 사항)
      window.history.replaceState({}, document.title, "/pwa");
    }
  };

  useEffect(() => {
    if (step === "welcome") {
      setErrorMessage(null);
      setLoginRequest({ email: "", password: "" });
      setSignupRequest({
        email: "",
        password: "",
        name: "",
        profileImage: "",
        twoFactorEnabled: false,
        notificationAgreement: false,
      });
    }
  }, [step]);

  const handleNext = () => {
    switch (step) {
      case "welcome":
        setStep("signup");
        break;
      case "login":
        handleLogin();
        break; // Mock login
      case "signup":
        handleSignup();
        break;
      case "pass":
        setStep("username");
        break;
      case "username":
        setStep("avatar");
        break;
      case "avatar":
        setStep("notification");
        break;
      case "notification":
        setStep("2FA");
        break;
      case "2FA":
        handleRegister();
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case "login":
      case "signup":
        setStep("welcome");
        break;
      case "pass":
        setStep("signup");
        break;
      case "username":
        setStep("signup");
        break;
      case "avatar":
        setStep("username");
        break;
      case "notification":
        setStep("avatar");
        break;
      case "2FA":
        setStep("notification");
        break;
    }
  };
  const {
    mutate: doLogin,
    isPending: isLoginPending,
    isError: isLoginError,
    error: loginError,
  } = useLogin();

  const loginRequestRef = React.useRef(loginRequest);
  useEffect(() => {
    loginRequestRef.current = loginRequest;
    setErrorMessage(null);
  }, [loginRequest]);

  const handleLogin = async () => {
    // use the ref to ensure we always send the latest loginRequest
    const latestRequest = loginRequestRef.current;
    doLogin(latestRequest, {
      onSuccess: () => {
        onLoginSuccess(newUser.username ? newUser : {}); // 로그인 성공 콜백 호출
      },
      onError: (err: any) => {
        const data = err?.response?.data;
        const message =
          typeof data === "string"
            ? data
            : data?.message ||
              (data && typeof data === "object"
                ? JSON.stringify(data)
                : null) ||
              "로그인에 실패했습니다.";
        setErrorMessage(message);
      },
    });
  };

  // const { loginWithKakao, isLoading } = useKakaoOAuth(); // Moved up

  // const handleKakaoSuccess = async (kakaoAccessToken: string) => { ... } // Removed old handler

  const {
    mutate: doSignup,
    isPending: isSignupPending,
    isError: isSignupError,
    error: signupError,
  } = useSignup();

  const {
    mutate: doPutInfo,
    isPending: isPutInfoPending,
    isError: isPutInfoError,
    error: putInfoError,
  } = usePutInfo();

  const signupRequestRef = React.useRef(signupRequest);
  useEffect(() => {
    signupRequestRef.current = signupRequest;
    setErrorMessage(null);
  }, [signupRequest]);
  const handleSignup = () => {
    // Mock signup process
    if (!signupRequestRef.current.email || !signupRequestRef.current.password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    } else if (signupRequestRef.current.password.length < 6) {
      setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(signupRequestRef.current.email)) {
      setErrorMessage("유효한 이메일 주소를 입력해주세요.");
      return;
    } else if (signupRequestRef.current.password.includes(" ")) {
      setErrorMessage("비밀번호에 공백이 포함될 수 없습니다.");
      return;
    }

    doSignup(signupRequestRef.current, {
      onSuccess: () => {
        doLogin(signupRequestRef.current);
        setStep("username");
      },
      onError: (err: any) => {
        const data = err?.response?.data;
        const message =
          typeof data === "string"
            ? data
            : data?.message ||
              (data && typeof data === "object"
                ? JSON.stringify(data)
                : null) ||
              "회원가입에 실패했습니다.";
        setErrorMessage(message);
      },
    });
  };
  const handleRegister = async () => {
    // Mock register process
    if (!signupRequestRef.current.name) {
      setErrorMessage("이름을 입력해주세요.");
      return;
    } else if (signupRequestRef.current.name.length < 2) {
      setErrorMessage("이름은 최소 2자 이상이어야 합니다.");
      return;
    } else if (signupRequestRef.current.name.length > 20) {
      setErrorMessage("이름은 최대 20자 이하여야 합니다.");
      return;
    } else if (/[^a-zA-Z0-9가-힣]/.test(signupRequestRef.current.name)) {
      setErrorMessage("이름에 특수문자는 사용할 수 없습니다.");
      return;
    }

    if (isKakaoSignup) {
      try {
        await axios.post(`/api/auth/kakao/signup/complete`, {
          email: signupRequestRef.current.email,
          name: signupRequestRef.current.name,
          profileImage: signupRequestRef.current.profileImage,
        });
        setErrorMessage(null);
        setNewUser((prev) => ({
          ...prev,
          username: signupRequestRef.current.name,
          group: { id: "hsu", name: "한성대학교", averageReturn: 18.5 },
          avatar: signupRequestRef.current.profileImage,
        }));
        // 카카오 로그인은 비밀번호가 없으므로 자동 로그인 처리가 필요할 수 있음
        // 여기서는 일단 완료 단계로 이동
        setStep("complete");
      } catch (error) {
        console.error("Kakao Signup Complete Error:", error);
        setErrorMessage("카카오 회원가입 완료 중 오류가 발생했습니다.");
      }
      return;
    }

    const latestRequest = signupRequestRef.current;

    doPutInfo(latestRequest, {
      onSuccess: () => {
        setErrorMessage(null);
        setNewUser((prev) => ({
          ...prev,
          username: signupRequest.name,
          group: { id: "hsu", name: "한성대학교", averageReturn: 18.5 },
          avatar: signupRequest.profileImage,
        }));
        setLoginRequest({
          email: signupRequest.email,
          password: signupRequest.password,
        });
        setStep("complete");
      },
      onError: (err: any) => {
        const data = err?.response?.data;
        const message =
          typeof data === "string"
            ? data
            : data?.message ||
              (data && typeof data === "object"
                ? JSON.stringify(data)
                : null) ||
              "회원가입에 실패했습니다.";
        setErrorMessage(message);
      },
    });
  };

  const handlePassVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      handleNext();
    }, 2500);
  };

  useEffect(() => {
    if (step === "complete") {
      setTimeout(() => {
        handleLogin();
      }, 1000);
    }
  }, [step, newUser, onLoginSuccess]);

  const renderContent = () => {
    const avatars = Array.from(
      { length: 6 },
      (_, i) => `https://picsum.photos/seed/avatar${i + 1}/100`
    );
    const groups: UserGroup[] = [
      { id: "hsu", name: "한성대학교", averageReturn: 18.5 },
      { id: "snu", name: "서울대학교", averageReturn: 22.1 },
      { id: "ku", name: "고려대학교", averageReturn: 20.3 },
      { id: "yu", name: "연세대학교", averageReturn: 21.5 },
    ];

    const isError = errorMessage !== null;

    switch (step) {
      case "welcome":
        return (
          <div className="flex flex-col h-full p-8 text-center justify-between">
            <div />
            <div>
              <div
                className="w-24 h-24 bg-primary text-white rounded-3xl mx-auto flex items-center justify-center mb-6 animate-fadeInUp"
                style={{ animationDelay: "0.1s" }}
              >
                <Icons.StonkIcon className="w-14 h-14" />
              </div>
              <h1
                className="text-4xl font-extrabold text-text-primary animate-fadeInUp"
                style={{ animationDelay: "0.1s" }}
              >
                스톡잇!
              </h1>
              <p
                className="text-text-secondary mt-4 text-lg animate-fadeInUp"
                style={{ animationDelay: "0.15s" }}
              >
                게임하듯 즐겁게, 주식 투자를 마스터하세요.
              </p>
            </div>
            <div
              className="space-y-3 animate-fadeInUp"
              style={{ animationDelay: "0.65s" }}
            >
              <button
                onClick={handleNext}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl"
              >
                시작하기
              </button>
              <button
                onClick={() => setStep("login")}
                className="w-full text-primary font-bold py-3.5 rounded-xl"
              >
                이미 계정이 있어요
              </button>
            </div>
          </div>
        );
      case "login":
        return (
          <div
            className={`p-6 h-full text-text-primary bg-bg-primary transition-opacity duration-500 ${
              isAuthLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <div
              className={`transform transition-all duration-500 ${
                isAuthLoading ? "-translate-y-4" : "translate-y-0"
              } flex flex-col h-full justify-between`}
            >
              <div>
                <div
                  className="animate-fadeInUp"
                  style={{ animationDelay: "0.05s" }}
                >
                  <button
                    onClick={handleBack}
                    className="p-1 mb-4 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Icons.ArrowLeftIcon className="w-6 h-6" />
                  </button>
                  <h2 className="text-3xl font-bold text-text-primary">
                    다시 오신 것을 환영해요!
                  </h2>
                </div>

                <div
                  className="mt-8 space-y-2 animate-fadeInUp"
                  style={{ animationDelay: "0.15s" }}
                >
                  <div className="relative mb-4">
                    <Icons.EnvelopeIcon
                      className={`w-5 h-5 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        isError ? "text-error" : "peer-focus:text-primary"
                      }`}
                    />
                    <input
                      type="email"
                      placeholder="이메일"
                      onChange={(e) =>
                        setLoginRequest({
                          ...loginRequest,
                          email: e.target.value,
                        })
                      }
                      value={loginRequest.email}
                      className={`peer w-full bg-bg-secondary border-2 rounded-lg p-3.5 pl-12 focus:border-primary outline-none transition-all duration-300 ${
                        isError
                          ? "border-error animate-shake"
                          : "border-border-color"
                      }`}
                      disabled={isAuthLoading}
                    />
                  </div>
                  <div className="relative mb-2">
                    <Icons.KeyIcon
                      className={`w-5 h-5 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        isError ? "text-error" : "peer-focus:text-primary"
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="비밀번호"
                      onChange={(e) =>
                        setLoginRequest({
                          ...loginRequest,
                          password: e.target.value,
                        })
                      }
                      value={loginRequest.password}
                      className={`peer w-full bg-bg-secondary border-2 rounded-lg p-3.5 pl-12 focus:border-primary outline-none transition-all duration-300 ${
                        isError
                          ? "border-error animate-shake"
                          : "border-border-color"
                      }`}
                      disabled={isAuthLoading}
                    />
                  </div>

                  <div
                    className={`flex items-center h-0 overflow-hidden space-x-2 text-error text-sm transition-all duration-300 ease-in-out
                        ${
                          isError
                            ? "h-auto animate-fadeInUp"
                            : "h-0 overflow-hidden"
                        }
                        `}
                  >
                    <Icons.ErrorIcon className="w-5 h-5" />
                    <p>{errorMessage}</p>
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={isAuthLoading}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-4 hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isAuthLoading ? (
                      <Icons.SpinnerIcon className="w-6 h-6 animate-spin" />
                    ) : (
                      "로그인"
                    )}
                  </button>
                </div>

                <p
                  className="text-center text-sm mt-6 animate-fadeInUp"
                  style={{ animationDelay: "0.2s" }}
                >
                  계정이 없으신가요?{" "}
                  <button
                    className="font-bold text-primary hover:underline"
                    onClick={() => setStep("signup")}
                  >
                    회원가입
                  </button>
                </p>
              </div>

              <div
                className="my-6 animate-fadeInUp"
                style={{ animationDelay: "0.35s" }}
              >
                <OAuthButtons
                  title="소셜 계정으로 로그인"
                  onOAuth={() => loginWithKakao()}
                  disabled={isAuthLoading}
                />
              </div>
            </div>
          </div>
        );
      case "signup":
        return (
          <div
            className={`p-6 h-full text-text-primary bg-bg-primary transition-opacity duration-500 ${
              isAuthLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <div
              className={`transform transition-all duration-500 ${
                isAuthLoading ? "-translate-y-4" : "translate-y-0"
              } flex flex-col h-full justify-between`}
            >
              <div>
                <div
                  className="animate-fadeInUp"
                  style={{ animationDelay: "0.05s" }}
                >
                  <button
                    onClick={handleBack}
                    className="p-1 mb-4 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Icons.ArrowLeftIcon className="w-6 h-6" />
                  </button>
                  <h2 className="text-3xl font-bold text-text-primary">
                    계정을 만들어 보세요.
                  </h2>
                </div>

                <div
                  className="mt-8 space-y-2 animate-fadeInUp"
                  style={{ animationDelay: "0.15s" }}
                >
                  <div className="relative mb-4">
                    <Icons.EnvelopeIcon
                      className={`w-5 h-5 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        isError ? "text-error" : "peer-focus:text-primary"
                      }`}
                    />
                    <input
                      type="email"
                      placeholder="이메일"
                      onChange={(e) => {
                        sessionStorage.setItem("email", e.target.value);
                        setSignupRequest({
                          ...signupRequest,
                          email: e.target.value,
                        });
                      }}
                      value={signupRequest.email}
                      className={`peer w-full bg-bg-secondary border-2 rounded-lg p-3.5 pl-12 focus:border-primary outline-none transition-all duration-300 ${
                        isError
                          ? "border-error animate-shake"
                          : "border-border-color"
                      }`}
                      disabled={isAuthLoading}
                    />
                  </div>
                  <div className="relative mb-2">
                    <Icons.KeyIcon
                      className={`w-5 h-5 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        isError ? "text-error" : "peer-focus:text-primary"
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="비밀번호"
                      onChange={(e) =>
                        setSignupRequest({
                          ...signupRequest,
                          password: e.target.value,
                        })
                      }
                      value={signupRequest.password}
                      className={`peer w-full bg-bg-secondary border-2 rounded-lg p-3.5 pl-12 focus:border-primary outline-none transition-all duration-300 ${
                        isError
                          ? "border-error animate-shake"
                          : "border-border-color"
                      }`}
                      disabled={isAuthLoading}
                    />
                  </div>

                  <div
                    className={`flex items-center h-0 overflow-hidden space-x-2 text-error text-sm transition-all duration-300 ease-in-out
                        ${
                          isError
                            ? "h-auto animate-fadeInUp"
                            : "h-0 overflow-hidden"
                        }
                        `}
                  >
                    <Icons.ErrorIcon className="w-5 h-5" />
                    <p>{errorMessage}</p>
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={isAuthLoading}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-4 hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>

                <p
                  className="text-center text-sm mt-6 animate-fadeInUp"
                  style={{ animationDelay: "0.2s" }}
                >
                  이미 계정이 있으신가요?{" "}
                  <button
                    className="font-bold text-primary hover:underline"
                    onClick={() => setStep("login")}
                  >
                    로그인
                  </button>
                </p>
              </div>

              <div
                className="my-6 animate-fadeInUp"
                style={{ animationDelay: "0.35s" }}
              >
                <OAuthButtons
                  title="소셜 계정으로 진행하기"
                  disabled={isLoading}
                  onOAuth={() => loginWithKakao()}
                />
              </div>
            </div>
          </div>
        );
      case "pass":
        return (
          <div className="p-6 flex flex-col h-full animate-fadeInUp text-center">
            <div className="mb-8 self-start">
              <button onClick={handleBack} className="p-1">
                <Icons.ArrowLeftIcon className="w-6 h-6" />
              </button>
            </div>
            <Icons.PhoneIcon className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold mt-4">휴대폰 본인인증</h2>
            <p className="text-text-secondary mt-2 mb-8">
              안전한 서비스 이용을 위해
              <br />
              PASS로 본인인증을 진행해주세요.
            </p>
            {isVerifying ? (
              <div className="flex flex-col items-center justify-center h-40 bg-bg-secondary rounded-2xl">
                <Icons.CheckCircleIcon
                  className="w-12 h-12 text-positive animate-ping"
                  style={{ animationDuration: "1.5s" }}
                />
                <p className="mt-4 font-semibold text-text-primary">
                  인증이 완료되었습니다.
                </p>
              </div>
            ) : (
              <div className="h-40 bg-bg-secondary rounded-2xl p-6 flex flex-col justify-center">
                <p className="font-semibold text-text-primary">
                  홍길동 010-1234-5678
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  본인 정보가 맞으시면 인증하기를 눌러주세요.
                </p>
              </div>
            )}
            <button
              onClick={handlePassVerify}
              disabled={isVerifying}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-auto disabled:bg-opacity-50"
            >
              {isVerifying ? "인증 확인 중..." : "인증하기"}
            </button>
          </div>
        );
      case "username":
        return (
          <div className="p-6 flex flex-col h-full animate-fadeInUp">
            <div className="mb-4">
              <ProgressBar step={1} totalSteps={4} />
            </div>
            <button onClick={handleBack} className="self-start mb-4">
              <Icons.ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold mb-4">
              멋진 닉네임을
              <br />
              만들어보세요.
            </h2>
            <input
              type="text"
              placeholder="닉네임 입력"
              onChange={(e) => {
                setSignupRequest({
                  ...signupRequest,
                  name: e.target.value,
                });
              }}
              value={signupRequest.name}
              className="w-full bg-bg-secondary border-2 border-border-color rounded-lg p-4 text-lg focus:border-primary focus:ring-0 outline-none"
            />
            <button
              onClick={handleNext}
              disabled={!signupRequest.name.trim()}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-auto disabled:bg-opacity-50"
            >
              다음
            </button>
          </div>
        );
      case "avatar":
        return (
          <div className="p-6 flex flex-col h-full animate-fadeInUp">
            <div className="mb-4">
              <ProgressBar step={2} totalSteps={4} />
            </div>
            <button onClick={handleBack} className="self-start mb-4">
              <Icons.ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold mb-6">
              프로필 아바타를
              <br />
              선택하세요.
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-auto">
              {avatars.map((avatarUrl) => (
                <button
                  key={avatarUrl}
                  onClick={() => setNewUser({ ...newUser, avatar: avatarUrl })}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    newUser.avatar === avatarUrl ? "ring-4 ring-primary" : ""
                  }`}
                >
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-auto"
            >
              다음
            </button>
          </div>
        );
      case "group":
        return (
          <div className="p-6 flex flex-col h-full animate-fadeInUp">
            <div className="mb-4">
              <ProgressBar step={3} totalSteps={4} />
            </div>
            <button onClick={handleBack} className="self-start mb-4">
              <Icons.ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                소속 그룹을
                <br />
                선택하세요.
              </h2>
            </div>
            <div className="space-y-3">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setNewUser({ ...newUser, group })}
                  className={`w-full text-left p-4 border-2 rounded-lg flex justify-between items-center transition-colors ${
                    newUser.group?.id === group.id
                      ? "border-primary bg-primary/5"
                      : "border-border-color"
                  }`}
                >
                  <span className="font-bold text-text-primary">
                    {group.name}
                  </span>
                  {newUser.group?.id === group.id && (
                    <Icons.CheckCircleIcon className="w-6 h-6 text-primary" />
                  )}
                </button>
              ))}
            </div>
            <div className="h-full" />
            <div className="space-y-3 mt-6">
              <button
                onClick={handleNext}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl"
              >
                다음
              </button>
              <button
                onClick={handleNext}
                className="w-full text-text-secondary font-semibold py-3"
              >
                나중에 설정할게요
              </button>
            </div>
          </div>
        );

      case "notification":
        return (
          <div className="p-6 flex flex-col h-full animate-fadeInUp text-center">
            <div className="mb-4">
              <ProgressBar step={3} totalSteps={4} />
            </div>
            <button onClick={handleBack} className="self-start mb-4">
              <Icons.ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div className="h-full flex flex-col justify-between">
              <div>
                <Icons.BellAlertIcon className="w-20 h-20 text-primary mx-auto mt-6" />
                <h2 className="text-3xl font-bold mt-4">실시간 알림 받기</h2>
                <p className="text-text-secondary mt-3 mb-8">
                  주문 체결, 랭킹 변동, 업적 달성 등<br />
                  중요한 순간을 놓치지 마세요!
                </p>
              </div>
              <div>
                <div className="space-y-3 mt-6">
                  <button
                    onClick={async () => {
                      const permission = await requestNotificationPermission();
                      if (permission === "granted") {
                        const registration = await registerServiceWorker();
                        if (registration) {
                          await subscribeToPush(registration);
                          setSignupRequest((prev) => ({
                            ...prev,
                            notification_agreement: true,
                          }));
                        }
                      }
                      handleNext();
                    }}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl"
                  >
                    알림 허용하기
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-full text-text-secondary font-semibold py-3"
                  >
                    나중에 설정할게요
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "2FA":
        return (
          <TFARegisterPage
            handleNext={handleNext}
            handleBack={handleBack}
            signupRequest={signupRequest}
            setSignupRequest={setSignupRequest}
          >
            <div className="mb-4">
              <ProgressBar step={4} totalSteps={4} />
            </div>
          </TFARegisterPage>
        );
      case "complete":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fadeInUp">
            <Icons.CheckCircleIcon className="w-24 h-24 text-positive mb-6" />
            <h1 className="text-3xl font-bold">
              환영합니다, {newUser.username}님!
            </h1>
            <p className="text-text-secondary mt-2">
              이제 스톡잇을 시작할 준비가 되었습니다.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="h-screen w-full bg-bg-primary">{renderContent()}</div>;
};

export default OnboardingScreen;
