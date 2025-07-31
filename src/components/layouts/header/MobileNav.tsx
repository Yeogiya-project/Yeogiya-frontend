import React, {useCallback, useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {NAV_ITEMS} from '../../../constants/navigation.ts';
import {useAuth} from "../../../hooks/useAuth.ts";

interface NavProps {
    showLoginModal: () => void;
}

export const MobileNav: React.FC<NavProps> = ({showLoginModal}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {isLoggedIn, login, logout} = useAuth();

    const handleLogin = useCallback(() => {
        login();
        showLoginModal();
    }, [login, showLoginModal]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);
    return (
        <>
            <button
                onClick={toggleMenu}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            >
                {isMenuOpen ? <CloseIcon/> : <MenuIcon/>}
            </button>
            {isMenuOpen && (
                <div
                    className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                    <nav className="px-4 py-6 space-y-4">
                        {NAV_ITEMS.map((item, index) => (
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
                                       onClick={logout}>로그아웃</a>
                                </div>
                            </>)}
                    </nav>
                </div>
            )}
        </>
    );
}

export default MobileNav;