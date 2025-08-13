import React, { useState } from 'react';
import { CATEGORY_DATA } from "../constants/categoryData.ts";

interface OptionFormProps {
    loading: boolean;
    mainCategory: keyof typeof CATEGORY_DATA;
    selectedKeyword: string;
    setMainCategory: (category: keyof typeof CATEGORY_DATA) => void;
    setSelectedKeyword: (keyword: string) => void;
    onRecommend: () => void;
}

const OptionForm: React.FC<OptionFormProps> = ({
    loading,
    mainCategory,
    selectedKeyword,
    setMainCategory,
    setSelectedKeyword,
    onRecommend
}) => {

    // 현재 보여줄 화면이 메인인지 서브인지 기억하는 상태 추가
    const [currentStep, setCurrentStep] = useState<'main' | 'sub'>('main');

    const handleMainCategoryClick = (key: keyof typeof CATEGORY_DATA) => {
        setMainCategory(key);
        setCurrentStep('sub'); // 메인 카테고리를 선택하면 '서브' 화면으로 전환!
    };

    const handleBackClick = () => {
        setCurrentStep('main'); // '뒤로가기'를 누르면 '메인' 화면으로 전환!
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onRecommend();
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            {/* urrentStep 상태에 따라 다른 화면을 보여주는 조건부 렌더링 */}
            {currentStep === 'main' ? (
                // --- '메인' 화면 ---
                <div>
                    <label className="block text-white text-lg font-bold mb-3">
                        어떤 곳을 찾고 계신가요?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(CATEGORY_DATA) as Array<keyof typeof CATEGORY_DATA>).map((key) => (
                            <button
                                type="button"
                                key={key}
                                onClick={() => handleMainCategoryClick(key)}
                                className="p-4 rounded-lg text-center font-semibold transition-all duration-200 bg-gray-800 text-gray-300 hover:bg-indigo-600 hover:text-white"
                            >
                                {CATEGORY_DATA[key].name}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                // --- '서브' 화면 ---
                <div>
                    <div className="flex items-center mb-3">
                        {/* 뒤로가기 버튼 */}
                        <button type="button" onClick={handleBackClick} className="mr-3 text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <label className="block text-white text-lg font-bold">
                            세부 카테고리를 선택해 주세요
                        </label>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {CATEGORY_DATA[mainCategory].subCategories.map((subCategory) => (
                            <button
                                type="button"
                                key={subCategory.id}
                                onClick={() => setSelectedKeyword(subCategory.keyword)}
                                className={`p-3 rounded-lg text-center font-semibold transition-all duration-200 ${
                                    selectedKeyword === subCategory.keyword
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {subCategory.name}
                            </button>
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {loading ? '두근두근 찾는 중...' : '여기야?'}
                    </button>
                </div>
            )}
        </form>
    );
};
export default OptionForm;
