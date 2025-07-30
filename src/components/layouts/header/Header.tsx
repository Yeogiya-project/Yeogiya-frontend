import React from "react";
import MobileNav from "./MobileNav.tsx";
import DeskTopNav from "./DeskTopNav.tsx";

interface HeaderProps {
    showLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({showLoginModal}) => {
    return (
        <div className="relative flex w-full border-b border-gray-200 shadow-sm">
            <header className="sticky top-0 z-40 w-full">
                <div className=" mx-auto px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                            <svg className="h-10 w-10 text-[#1993e5]" fill="none" viewBox="0 0 48 48"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_6_330)">
                                    <path clipRule="evenodd"
                                          d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                                          fill="currentColor" fillRule="evenodd"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_6_330">
                                        <rect fill="white" height="48" width="48"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                            <h1 className="text-2xl font-bold">
                                여기요
                            </h1>
                        </div>

                        {/* 데스크탑 */}
                        <DeskTopNav showLoginModal={showLoginModal}/>

                        {/* 모바일 */}
                        <MobileNav showLoginModal={showLoginModal}/>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;