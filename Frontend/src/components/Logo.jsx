import React from "react";

const Logo = () => {
  return (
    <div className="relative">
      <div className="font-oswald border-4 border-[#2f4f2f] rounded-[30px] px-10 py-2 flex items-center justify-center text-[#2f4f2f] font-semibold text-4xl tracking-wider relative select-none whitespace-nowrap h-20 max-w-[300px]">
        NSC-RENTALS
      </div>
      <div className="absolute top-0 -right-10 text-4xl font-semibold text-[#2f4f2f] leading-none select-none">
        ®
      </div>
    </div>
  );
};

export default Logo;
