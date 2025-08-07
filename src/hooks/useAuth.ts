import {useState, useCallback} from 'react';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = useCallback(() => {
        setIsLoggedIn(true);
        // 실제로는 API 호출, 토큰 저장 등
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        // 토큰 삭제 등
    }, []);

    const handleLoginModal = useCallback((showLoginModal: () => void) => {
        showLoginModal();
    }, []);

    return {
        isLoggedIn,
        login,
        logout,
        handleLoginModal
    };
};