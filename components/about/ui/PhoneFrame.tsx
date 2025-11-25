import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[22px] m-[21px] overflow-hidden rounded-[4rem] h-[900px] w-[450px] shadow-xl transform transition-transform duration-500 scale-66 hover:scale-69">
      {/* Screen Notch */}
      <div className="w-[222px] h-[27px] bg-gray-800 top-[-1px] rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>

      {/* Side Buttons */}
      <div className="h-[48px] w-[5px] bg-gray-800 absolute -start-[-6px] top-[72px] rounded-s-lg"></div>
      <div className="h-[69px] w-[5px] bg-gray-800 absolute -start-[-6px] top-[124px] rounded-s-lg"></div>
      <div className="h-[69px] w-[5px] bg-gray-800 absolute -start-[6px] top-[178px] rounded-s-lg"></div>
      <div className="h-[96px] w-[5px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>

      {/* Screen Content */}
      <div className="rounded-[3rem] overflow-hidden w-[408px] h-[858px] bg-white dark:bg-gray-800 relative z-10">
        <div
          className="w-full h-full overflow-y-auto scrollbar-hide bg-gray-50"
          data-lenis-prevent
        >
          {children}
        </div>
      </div>
    </div>
  );
};
