import {useState, forwardRef, useImperativeHandle} from "react";

// 타입 정의
interface Friend {
    id: number;
    name: string;
    address: string;
}

export interface MeetupSetupModalRef {
    updateFriendAddress: (friendId: number, address: string) => void;
}

interface MeetupSetupModalProps {
    onClose: () => void;
    onSearchAddress: (friendId: number) => void;
    onFindMeetingPoint: (friends: Friend[]) => void;
}

const MeetupSetupModal = forwardRef<MeetupSetupModalRef, MeetupSetupModalProps>(({
                                                                                     onClose,
                                                                                     onSearchAddress,
                                                                                     onFindMeetingPoint
                                                                                 }, ref) => {
    const [friends, setFriends] = useState<Friend[]>([
        {id: 1, name: "", address: ""},
        {id: 2, name: "", address: ""}
    ]);

    const updateFriend = (id: number, field: 'name' | 'address', value: string) => {
        setFriends(prev => prev.map(friend =>
            friend.id === id ? {...friend, [field]: value} : friend
        ));
    };

    const addFriend = () => {
        if (friends.length < 5) {
            setFriends(prev => [...prev, {
                id: Math.max(...prev.map(f => f.id)) + 1,
                name: "",
                address: ""
            }]);
        }
    };

    const removeFriend = (id: number) => {
        if (friends.length > 2) {
            setFriends(prev => prev.filter(friend => friend.id !== id));
        }
    };

    const handleFindMeetingPoint = () => {
        const validFriends = friends.filter(f => f.name.trim() && f.address.trim());
        if (validFriends.length >= 2) {
            onFindMeetingPoint(validFriends);
        }
    };

    const validFriendsCount = friends.filter(f => f.name.trim() && f.address.trim()).length;
    const canProceed = validFriendsCount >= 2;

    // ref를 통해 외부에서 주소를 업데이트할 수 있도록 함
    useImperativeHandle(ref, () => ({
        updateFriendAddress: (friendId: number, address: string) => {
            updateFriend(friendId, 'address', address);
        }
    }), []);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[750px] overflow-hidden flex flex-col">
                {/* 헤더 */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">중간지점 찾기</h2>
                            <p className="text-blue-100 mt-1">친구들의 정보를 입력하고 만날 장소를 찾아보세요</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center justify-center"
                        >
                            <span className="text-xl">×</span>
                        </button>
                    </div>
                </div>

                {/* 내용 */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        {friends.map((friend, index) => (
                            <div key={friend.id}
                                 className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <span className="font-semibold text-gray-700">
                                            {friend.name}
                                        </span>
                                    </div>
                                    {friends.length > 2 && index > 1 && (
                                        <button
                                            onClick={() => removeFriend(friend.id)}
                                            className="w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full text-red-600 text-sm transition-colors"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* 이름 입력 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            이름/별명
                                        </label>
                                        <input
                                            type="text"
                                            value={friend.name}
                                            onChange={(e) => updateFriend(friend.id, 'name', e.target.value)}
                                            placeholder={index === 0 ? "내 이름" : "친구 이름"}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            maxLength={15}
                                        />
                                    </div>

                                    {/* 주소 입력 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            위치
                                        </label>
                                        <button
                                            onClick={() => onSearchAddress(friend.id)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        >
                                            {friend.address ? (
                                                <span className="text-gray-800">{friend.address}</span>
                                            ) : (
                                                <span className="text-gray-500">📍 주소 검색</span>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* 완료 상태 표시 */}
                                <div className="mt-3 flex items-center gap-4 text-sm">
                                    <div
                                        className={`flex items-center gap-1 ${friend.name.trim() ? 'text-green-600' : 'text-gray-400'}`}>
                                        <span>{friend.name.trim() ? '✅' : '⭕'}</span>
                                        <span>이름</span>
                                    </div>
                                    <div
                                        className={`flex items-center gap-1 ${friend.address ? 'text-green-600' : 'text-gray-400'}`}>
                                        <span>{friend.address ? '✅' : '⭕'}</span>
                                        <span>위치</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* 친구 추가 버튼 */}
                        {friends.length < 5 && (
                            <button
                                onClick={addFriend}
                                className="w-full p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">➕</span>
                                <span>친구 추가 (최대 5명)</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* 하단 정보 및 버튼 */}
                <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold text-blue-600">{validFriendsCount}명</span>의 정보가 입력되었습니다
                            {validFriendsCount < 2 && (
                                <span className="text-red-500 ml-2">(최소 2명 필요)</span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500">
                            💡 더 많은 친구를 추가할수록 정확한 중간지점을 찾을 수 있어요
                        </div>
                    </div>

                    <button
                        onClick={handleFindMeetingPoint}
                        disabled={!canProceed}
                        className={`w-full py-4 font-bold rounded-xl transition-all ${
                            canProceed
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {canProceed ? (
                            <span className="flex items-center justify-center gap-2">
                                🎯 중간지점 찾기
                            </span>
                        ) : (
                            <span>친구들의 정보를 입력해주세요</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
});

MeetupSetupModal.displayName = 'MeetupSetupModal';

export default MeetupSetupModal;