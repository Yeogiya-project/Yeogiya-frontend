import React from "react";
import KakaoLoginImage from "../../assets/kakao_login_large_wide.png"

interface LoginModalProps {
    closeLoginModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({closeLoginModal}) => {
    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                 onClick={closeLoginModal}>
                <div className="bg-white w-115 rounded-2xl border border-gray-300 shadow-xl p-8" onClick={(e) => e.stopPropagation()}>
                    <div
                        className="flex items-center justify-center mb-4 text-2xl font-bold text-gray-800 border-b border-gray-300 p-4">로그인
                    </div>
                    <div className="text-center mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">환영합니다!</h3>
                        <p className="text-gray-500">간편하게 로그인하고 서비스를 이용해보세요</p>
                    </div>

                    <div className="flex justify-center items-center">
                        <img
                            src={KakaoLoginImage}
                            alt="카카오 로그인"
                            className="cursor-pointer transition-all duration-200 hover:brightness-90 hover:scale-105 hover:shadow-lg rounded-lg"
                        />
                    </div>

                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-sm text-gray-500">또는</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    <div className="flex justify-center items-center">
                        <div
                            className="transition-all duration-200 hover:brightness-90 hover:scale-105 cursor-pointer">
                            이메일로 로그인
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
                        로그인 시 <span className="text-blue-500 cursor-pointer">서비스 이용약관</span> 및 <span
                        className="text-blue-500 cursor-pointer">개인정보처리방침</span>에 동의한 것으로 간주됩니다.
                    </p>
                </div>
            </div>
        </>
    );
}
export default LoginModal;