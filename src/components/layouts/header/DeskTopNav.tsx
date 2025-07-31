import React, {useCallback, useState} from "react";
import {NAV_ITEMS} from "../../../constants/navigation.ts";
import SentimentSatisfiedAltSharpIcon from '@mui/icons-material/SentimentSatisfiedAltSharp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {useAuth} from "../../../hooks/useAuth.ts";

interface NavProps {
    showLoginModal: () => void;
}

const DeskTopNav: React.FC<NavProps> = ({showLoginModal}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const {isLoggedIn, login, logout} = useAuth();

    const handleLogin = useCallback(() => {
        login();
        showLoginModal();
    }, [login, showLoginModal]);

    const toggleProfile = useCallback(() => {
        setIsProfileOpen(prev => !prev);
    }, []);

    const closeProfile = useCallback(() => {
        setIsProfileOpen(false);
    }, []);
    return (
        <>
            <nav className="hidden items-center gap-8 md:flex">
                {NAV_ITEMS.map((item, index) => (
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
                                    onClick={toggleProfile}
                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#1993e5] to-[#1976d2] text-white transition-all hover:shadow-lg hover:scale-105 active:scale-95">
                                    <SentimentSatisfiedAltSharpIcon fontSize="medium"/>
                                </button>
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10"
                                             onClick={closeProfile}></div>
                                        <div
                                            className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2">
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
                                               onClick={logout}>
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

export default DeskTopNav;