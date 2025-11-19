"use client";
import React from "react";
import {
  HiHome,
  HiMagnifyingGlass,
  HiTrophy,
  HiChartBar,
  HiUserCircle,
  HiCheckCircle,
  HiXMark,
  HiCalendar,
  HiUsers,
  HiGift,
  HiSparkles,
  HiCog6Tooth,
  HiArrowUturnLeft,
  HiBriefcase,
  HiChartPie,
  HiArrowLeft,
  HiChevronDown,
  HiPlusCircle,
  HiArrowTrendingUp,
  HiArrowTrendingDown,
  HiBuildingOffice2,
  HiCpuChip,
  HiShieldCheck,
  HiFlag,
  HiPencilSquare,
  HiBookmark,
  HiClock,
  HiFire,
  HiBanknotes,
  HiUserPlus,
  HiBell,
  HiBellAlert,
  HiChevronLeft,
  HiClipboardDocumentList,
  HiCog,
  HiMegaphone,
  HiChevronRight,
  HiChevronUp,
  HiCamera,
  HiUser,
  HiMoon,
  HiSun,
  HiLockClosed,
  HiQuestionMarkCircle,
  HiArrowRightOnRectangle,
  HiPencil,
  HiLink,
  HiXCircle,
  HiExclamationTriangle,
  HiInformationCircle,
  HiArrowPath,
  HiExclamationCircle,
  HiArrowRight,
  HiHeart,
} from "react-icons/hi2";
import { MdPhone, MdKey, MdEmail, MdError } from "react-icons/md";
import { IconBaseProps } from "react-icons";
import { FaSpinner } from "react-icons/fa6";

type IconProps = IconBaseProps & React.SVGProps<SVGSVGElement>;

// Social Login Icons (Custom - 대체 불가능)
export const GoogleIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const KakaoIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.72 1.8 5.11 4.52 6.47l-1.05 3.88c-.08.3.22.56.49.42l4.72-3.15c.44.06.89.09 1.32.09 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
  </svg>
);

export const AppleIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

// Contact Icons (React Icons로 대체)
export const PhoneIcon = (props: IconProps) => <MdPhone {...props} />;
export const KeyIcon = (props: IconProps) => <MdKey {...props} />;
export const EnvelopeIcon = (props: IconProps) => <MdEmail {...props} />;
export const ErrorIcon = (props: IconProps) => <MdError {...props} />;
export const SpinnerIcon = (props: IconProps) => <FaSpinner {...props} />;

// Stock Icon (Custom - 대체 불가능)
export const StonkIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 16C4 16 5 13 8 13C11 13 12 8 15 8C18 8 20 4 20 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 4H20V9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 20H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Navigation Icons (React Icons로 대체)
export const HomeIcon = (props: IconProps) => <HiHome {...props} />;
export const MagnifyingGlassIcon = (props: IconProps) => (
  <HiMagnifyingGlass {...props} />
);
export const TrophyIcon = (props: IconProps) => <HiTrophy {...props} />;
export const ChartBarIcon = (props: IconProps) => <HiChartBar {...props} />;
export const UserCircleIcon = (props: IconProps) => <HiUserCircle {...props} />;

// UI Icons (React Icons로 대체)
export const CheckCircleIcon = (props: IconProps) => (
  <HiCheckCircle {...props} />
);
export const XMarkIcon = (props: IconProps) => <HiXMark {...props} />;
export const CalendarIcon = (props: IconProps) => <HiCalendar {...props} />;
export const UsersIcon = (props: IconProps) => <HiUsers {...props} />;
export const GiftIcon = (props: IconProps) => <HiGift {...props} />;
export const SparklesIcon = (props: IconProps) => <HiSparkles {...props} />;
export const Cog6ToothIcon = (props: IconProps) => <HiCog6Tooth {...props} />;
export const ArrowUturnLeftIcon = (props: IconProps) => (
  <HiArrowUturnLeft {...props} />
);
export const BriefcaseIcon = (props: IconProps) => <HiBriefcase {...props} />;
export const ChartPieIcon = (props: IconProps) => <HiChartPie {...props} />;
export const ArrowLeftIcon = (props: IconProps) => <HiArrowLeft {...props} />;
export const ChevronDownIcon = (props: IconProps) => (
  <HiChevronDown {...props} />
);
export const PlusCircleIcon = (props: IconProps) => <HiPlusCircle {...props} />;
export const ArrowTrendingUpIcon = (props: IconProps) => (
  <HiArrowTrendingUp {...props} />
);
export const ArrowTrendingDownIcon = (props: IconProps) => (
  <HiArrowTrendingDown {...props} />
);
export const BuildingOffice2Icon = (props: IconProps) => (
  <HiBuildingOffice2 {...props} />
);
export const CpuChipIcon = (props: IconProps) => <HiCpuChip {...props} />;
export const ShieldCheckIcon = (props: IconProps) => (
  <HiShieldCheck {...props} />
);
export const FlagIcon = (props: IconProps) => <HiFlag {...props} />;
export const PencilSquareIcon = (props: IconProps) => (
  <HiPencilSquare {...props} />
);
export const BookmarkIcon = (props: IconProps) => <HiBookmark {...props} />;
export const ClockIcon = (props: IconProps) => <HiClock {...props} />;
export const FireIcon = (props: IconProps) => <HiFire {...props} />;
export const BanknotesIcon = (props: IconProps) => <HiBanknotes {...props} />;
export const UserPlusIcon = (props: IconProps) => <HiUserPlus {...props} />;
export const BellIcon = (props: IconProps) => <HiBell {...props} />;
export const BellAlertIcon = (props: IconProps) => <HiBellAlert {...props} />;
export const ChevronLeftIcon = (props: IconProps) => (
  <HiChevronLeft {...props} />
);
export const ClipboardDocumentListIcon = (props: IconProps) => (
  <HiClipboardDocumentList {...props} />
);
export const CogIcon = (props: IconProps) => <HiCog {...props} />;
export const MegaphoneIcon = (props: IconProps) => <HiMegaphone {...props} />;
export const ChevronRightIcon = (props: IconProps) => (
  <HiChevronRight {...props} />
);
export const ArrowPathIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);
export const ChevronUpIcon = (props: IconProps) => <HiChevronUp {...props} />;
export const CameraIcon = (props: IconProps) => <HiCamera {...props} />;
export const UserIcon = (props: IconProps) => <HiUser {...props} />;
export const MoonIcon = (props: IconProps) => <HiMoon {...props} />;
export const SunIcon = (props: IconProps) => <HiSun {...props} />;
export const LockClosedIcon = (props: IconProps) => <HiLockClosed {...props} />;
export const QuestionMarkCircleIcon = (props: IconProps) => (
  <HiQuestionMarkCircle {...props} />
);
export const ArrowRightOnRectangleIcon = (props: IconProps) => (
  <HiArrowRightOnRectangle {...props} />
);
export const PencilIcon = (props: IconProps) => <HiPencil {...props} />;
export const LinkIcon = (props: IconProps) => <HiLink {...props} />;
export const XCircleIcon = (props: IconProps) => <HiXCircle {...props} />;
export const ExclamationTriangleIcon = (props: IconProps) => (
  <HiExclamationTriangle {...props} />
);
export const InformationCircleIcon = (props: IconProps) => (
  <HiInformationCircle {...props} />
);
export const ExclamationCircleIcon = (props: IconProps) => (
  <HiExclamationCircle {...props} />
);
export const ArrowRightIcon = (props: IconProps) => <HiArrowRight {...props} />;
export const HeartIcon = (props: IconProps) => <HiHeart {...props} />;
