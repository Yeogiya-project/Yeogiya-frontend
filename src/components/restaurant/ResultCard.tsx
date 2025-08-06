import React from 'react';
import type { Restaurant } from "../../types/restaurant";

interface ResultCardProps {
    result: Restaurant | null;
    onClose: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onClose }) => {
    if (!result) return null;

    return (
        <div className="relative w-full max-w-md mt-8 bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg animate-fade-in">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-500/50 hover:bg-red-500/80 rounded-full text-white transition-all z-10"
                aria-label="결과 닫기"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <h3 className="text-3xl font-bold text-white mb-2">{result.title}</h3>
            <p className="text-indigo-300 font-semibold mb-4">{result.category}</p>
            <div className="space-y-2 text-gray-200">
                <p><span className="font-bold">🗺️ 도로명:</span> {result.roadAddress}</p>
                <p><span className="font-bold">📍 지번:</span> {result.address}</p>
            </div>
            <a
                href={result.placeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg text-center transition-colors"
            >
                카카오맵에서 자세히 보기
            </a>
        </div>
    );
};
export default ResultCard;
