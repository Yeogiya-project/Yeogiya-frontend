import { useEffect, useMemo, useState } from "react";
import GameIntro from "./GameIntro";
import { playDiceGame } from "../../game/diceApi";
import type { DicePlayResponse } from "../../game/diceApi";

interface DiceGameModalProps {
    closeWelcomeModal: () => void;
}

function nextAutoName(existing: string[]) {
    const pattern = /^user(\d+)$/;
    let max = 0;
    for (const u of existing) {
        const m = u.match(pattern);
        if (m) {
            const n = parseInt(m[1], 10);
            if (!Number.isNaN(n) && n > max) max = n;
        }
    }
    return `user${max + 1}`;
}

export default function DiceGameModal({ closeWelcomeModal }: DiceGameModalProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    // ESC로 닫기
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeWelcomeModal();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeWelcomeModal]);

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={closeWelcomeModal}
            aria-modal
            role="dialog"
        >
            <div
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-8 text-center max-w-lg w-full animate-slideUp transform"
                onClick={(e) => e.stopPropagation()}
            >
                {!isPlaying ? (
                    <GameIntro
                        title="주사위 게임"
                        icon="🎲"
                        onClose={closeWelcomeModal}
                        onStart={() => setIsPlaying(true)}
                        startLabel="🚀 지금 시작하기"
                    />
                ) : (
                    <DicePanel onClose={closeWelcomeModal} onBack={() => setIsPlaying(false)} />
                )}
            </div>
        </div>
    );
}

// ───────────────────────────────
// 모달 내부 실제 플레이 화면
// ───────────────────────────────
function DicePanel({ onClose, onBack }: { onClose: () => void; onBack: () => void }) {
    const [players, setPlayers] = useState<string[]>(["user1", "user2"]);
    const [loading, setLoading] = useState(false);
    const [resp, setResp] = useState<DicePlayResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const sortedResults = useMemo(() => {
        if (!resp) return [];
        return Object.entries(resp.userResults).sort((a, b) => b[1] - a[1]); // [ [name, score], ... ]
    }, [resp]);

    const addPlayer = () => setPlayers((prev) => [...prev, nextAutoName(prev)]);
    const removePlayer = (idx: number) => setPlayers((prev) => prev.filter((_, i) => i !== idx));
    const updatePlayer = (idx: number, name: string) =>
        setPlayers((prev) => prev.map((p, i) => (i === idx ? name : p)));

    const onPlay = async () => {
        setLoading(true);
        setError(null);
        setResp(null);
        try {
            const payload = players.map((p) => p.trim()).filter(Boolean);
            if (payload.length === 0) {
                setError("플레이어를 최소 1명 이상 입력해주세요.");
                return;
            }
            const data = await playDiceGame(payload);
            setResp(data);
        } catch (e: unknown) {
            if (e instanceof Error) setError(e.message);
            else setError("실패했어요. 콘솔을 확인해주세요.");
        } finally {
            setLoading(false);
        }
    };

    const hasTie =
        sortedResults.length > 1 &&
        resp &&
        sortedResults[0][1] === sortedResults[1][1];

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">🎲 주사위 게임</h3>
                <div className="flex gap-2">
                    <button onClick={onBack} className="px-3 py-2 rounded-lg border hover:bg-gray-50">← 뒤로</button>
                    <button onClick={onClose} className="px-3 py-2 rounded-lg border hover:bg-gray-50">닫기</button>
                </div>
            </div>

            {/* 플레이어 입력 - 인원 제한 없음, 길어지면 스크롤 */}
            <div className="text-left mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">플레이어 목록</span>
                    <button onClick={addPlayer} className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50">+ 추가</button>
                </div>
                <div className="space-y-2 max-h-64 overflow-auto">
                    {players.map((name, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                value={name}
                                onChange={(e) => updatePlayer(idx, e.target.value)}
                                placeholder={`user${idx + 1}`}
                                className="border rounded-lg px-3 py-2 flex-1"
                            />
                            <button
                                onClick={() => removePlayer(idx)}
                                className="px-3 py-2 rounded-lg border hover:bg-gray-50"
                                disabled={players.length <= 1}
                                title={players.length <= 1 ? "최소 1명 필요" : ""}
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end mb-4">
                <button
                    onClick={onPlay}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
                >
                    {loading ? "굴리는 중..." : "굴리기"}
                </button>
            </div>

            {/* 결과 */}
            {error && <p className="text-red-600 mb-3">{error}</p>}

            {resp && (
                <div className="text-left space-y-3">
                    <div className="p-4 rounded-xl border bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">결과</h4>
                            <div className="text-xs text-gray-500">
                                ID: {resp.id} · {resp.gameType} · {resp.playAt}
                            </div>
                        </div>

                        <ul className="space-y-2">
                            {sortedResults.map(([name, score], idx) => (
                                <li key={name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 w-6 text-right">{idx + 1}.</span>
                                        <span className="font-medium">{name}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        점수 <span className="font-semibold text-gray-900">{score}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`p-4 rounded-xl border ${hasTie ? "bg-yellow-50" : "bg-green-50"}`}>
                        {hasTie ? "🤝 동점 발생! 상위 점수가 동일합니다." : <>🏆 승자: <span className="font-semibold">{resp.winner}</span></>}
                    </div>

                    <div className="flex justify-end">
                        <button onClick={() => setResp(null)} className="px-3 py-2 rounded-lg border hover:bg-gray-50">
                            다시 하기
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
