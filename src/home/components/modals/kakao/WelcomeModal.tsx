import React from "react";

interface WelcomeModalProps {
    closeWelcomeModal: () => void;
    onStart: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({closeWelcomeModal, onStart}) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
             onClick={closeWelcomeModal}>
            <div
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-8 text-center max-w-lg animate-slideUp transform"
                onClick={(e) => e.stopPropagation()}>
                <div
                    className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">📍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    모임 장소 찾기
                </h2>
                <p className="text-gray-600 mb-6 mx-4">
                    친구들과의 완벽한 중간지점을 찾아보세요!
                    <br/>쉽고 빠르게 최적의 만남 장소를 추천해드립니다.
                </p>
                <button
                    onClick={onStart}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    🚀 지금 시작하기
                </button>
            </div>
        </div>
    );
};

export default WelcomeModal;