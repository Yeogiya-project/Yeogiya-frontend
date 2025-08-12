import type { ReactNode } from "react";

type GameIntroProps = {
    title: string;
    subtitle?: string;
    icon?: ReactNode;         // 이모지/이미지
    onStart: () => void;
    onClose: () => void;
    startLabel?: string;
};

export default function GameIntro({
                                      title,
                                      subtitle = "모달에서 바로 플레이합니다.",
                                      icon = "🎲",
                                      onStart,
                                      onClose,
                                      startLabel = "🚀 지금 시작하기",
                                  }: GameIntroProps) {
    return (
        <div className="text-center">                {/* ✅ 전체 중앙 정렬 */}
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500
                      rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">{icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{subtitle}</p>
            <div className="flex gap-3 justify-center">
                <button onClick={onClose} className="px-6 py-3 rounded-2xl border border-gray-300 hover:bg-gray-50">
                    닫기
                </button>
                <button
                    onClick={onStart}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    {startLabel}
                </button>
            </div>
        </div>
    );
}
