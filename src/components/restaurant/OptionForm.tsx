import React, { useState } from 'react';

interface OptionFormProps {
    onRecommend: (keyword: string, category: string) => void;
    loading: boolean;
}

const OptionForm: React.FC<OptionFormProps> = ({ onRecommend, loading }) => {
    const [keyword, setKeyword] = useState<string>('데이트');
    const [people, setPeople] = useState<string>('2');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onRecommend(keyword, 'FD6');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            <div className="mb-6">
                <label htmlFor="keyword" className="block text-white text-lg font-bold mb-2">
                    찾고 싶은 곳을 입력해 주세요.
                </label>
                <input
                    type="text"
                    id="keyword"
                    value={keyword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                    placeholder="예: 중국집, 혼밥, 데이트"
                    className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                />
            </div>
            <div className="mb-8">
                <label htmlFor="people" className="block text-white text-lg font-bold mb-2">
                    인원수를 선택해 주세요.
                </label>
                <select
                    id="people"
                    value={people}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPeople(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                    <option value="1">1명</option>
                    <option value="2">2명</option>
                    <option value="3">3명</option>
                    <option value="4">4명</option>
                    <option value="5">5명</option>
                    <option value="6">6명 이상</option>
                </select>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
            >
                {loading ? '두근두근 찾는 중...' : '요기야?'}
            </button>
        </form>
    );
};
export default OptionForm;