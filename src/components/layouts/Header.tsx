import React, {useState} from "react";
import SentimentSatisfiedAltSharpIcon from '@mui/icons-material/SentimentSatisfiedAltSharp';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface HeaderProps {
    showLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({showLoginModal}) => {
    return (
        <div className="relative flex w-full border-b border-gray-200 shadow-sm">
            <header className="sticky top-0 z-50 w-full">
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

export const DeskTopNav: React.FC<HeaderProps> = ({showLoginModal}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navItems = [
        {name: "홈", path: "/"},
        {name: "보드게임", path: "/"},
        {name: "방탈출", path: "/"},
        {name: "이벤트", path: "/"}
    ];

    const handleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
        showLoginModal();
    }
    return (
        <>
            <nav className="hidden items-center gap-8 md:flex">
                {navItems.map((item, index) => (
                    <a key={index}
                       className="text-lg font-medium text-gray-600 transition-all hover:text-gray-900 hover:scale-105 relative group"
                       href={item.path}>
                        {item.name}
                        <span
                            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1993e5] transition-all group-hover:w-full"></span>
                    </a>
                ))}
            </nav>
            <div className="hidden md:flex items-center gap-4">
                {!isLoggedIn ? (
                    <>
                        <div className="flex items-center">
                            <a className="text-sm font-medium text-white bg-gradient-to-r from-[#1993e5] to-[#1976d2] px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                               onClick={handleLogin}>로그인</a>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex gap-0.5">
                            <button
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:scale-105 active:scale-95">
                                <NotificationsIcon fontSize="medium"/>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#1993e5] to-[#1976d2] text-white transition-all hover:shadow-lg hover:scale-105 active:scale-95">
                                    <SentimentSatisfiedAltSharpIcon fontSize="medium"/>
                                </button>
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10"
                                             onClick={() => setIsProfileOpen(false)}></div>
                                        <div
                                            className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-in slide-in-from-top-2">
                                            <a className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                               href="#">
                                                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                                마이페이지
                                            </a>
                                            <a className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                               href="#">
                                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                                                내 모임 관리
                                            </a>
                                            <hr className="my-2 border-gray-100"/>
                                            <a className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                               onClick={() => setIsLoggedIn(false)}>
                                                <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                                                로그아웃
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export const MobileNav: React.FC<HeaderProps> = ({showLoginModal}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navItems = [
        {name: "홈", path: "/"},
        {name: "보드게임", path: "/"},
        {name: "방탈출", path: "/"},
        {name: "이벤트", path: "/"}
    ];

    const handleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
        showLoginModal();
    }
    return (
        <>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            >
                {isMenuOpen ? <CloseIcon/> : <MenuIcon/>}
            </button>
            {isMenuOpen && (
                <div
                    className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
                    <nav className="px-4 py-6 space-y-4">
                        {navItems.map((item, index) => (
                            <a key={index}
                               className="block text-lg font-medium text-gray-600 hover:text-gray-900 py-2 transition-colors"
                               href={item.path}>{item.name}</a>
                        ))}
                        {!isLoggedIn ? (
                            <>
                                <hr className="my-4 border-gray-200"/>
                                <div className="space-y-3">
                                    <a className="block text-center text-sm font-medium text-white bg-gradient-to-r from-[#1993e5] to-[#1976d2] px-6 py-3 rounded-full cursor-pointer"
                                       onClick={handleLogin}>로그인</a>
                                    <a className="block text-center text-sm font-medium text-gray-600 hover:text-gray-900 py-2 transition-colors"
                                       href="#">회원가입</a>
                                </div>
                            </>) : (
                            <>
                                <hr className="my-4 border-gray-200"/>
                                <div className="space-y-2">
                                    <a className="block text-sm text-gray-700 hover:text-gray-900 py-2 transition-colors"
                                       href="#">마이페이지</a>
                                    <a className="block text-sm text-gray-700 hover:text-gray-900 py-2 transition-colors"
                                       href="#">내 모임 관리</a>
                                    <a className="block text-sm text-red-600 hover:text-red-700 py-2 transition-colors"
                                       onClick={() => setIsLoggedIn(false)}>로그아웃</a>
                                </div>
                            </>)}
                    </nav>
                </div>
            )}
        </>
    );
}