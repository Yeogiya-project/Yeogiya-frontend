import { useMemo, useState } from "react";
import GameIntro from "./GameIntro";
import { playCardGame, type CardPlayResponse } from "../../game/cardApi";

interface Props {
    closeWelcomeModal: () => void;
}

const faceMap: Record<number, string> = { 1: "A", 11: "J", 12: "Q", 13: "K" };
const toFace = (n: number) => faceMap[n] ?? String(n);

function formatKST(iso: string) {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

// 자동 닉네임 생성: userN (기존 user 번호 중 최댓값 + 1)
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

export default function CardGameModal({ closeWelcomeModal }: Props) {
    const [showIntro, setShowIntro] = useState(true);
    const [participants, setParticipants] = useState<string[]>(["user1", "user2", "user3"]);
    const [newUser, setNewUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CardPlayResponse | null>(null);

    const canPlay = useMemo(() => participants.length >= 1 && !loading, [participants.length, loading]);

    const onRemove = (u: string) =>
        setParticipants((prev) => {
            if (prev.length <= 1) return prev; // 마지막 1명은 삭제 불가
            return prev.filter((p) => p !== u);
        });

    const onAdd = () => {
        const v = newUser.trim();
        if (!v) {
            const gen = nextAutoName(participants);
            setParticipants((prev) => [...prev, gen]);
            return;
        }
        if (participants.includes(v)) {
            setNewUser("");
            return;
        }
        setParticipants((prev) => [...prev, v]);
        setNewUser("");
    };

    async function play() {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await playCardGame(participants);
            setResult(data);
        } catch (e) {
            if (e instanceof Error) setError(e.message);
            else setError("요청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    const isWinner = (u: string) => result?.winner === u;

    return (
        // 바깥 레이어: 페이드 인
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4
             bg-transparent animate-fadeIn"   // ✅ 여기 추가(배경은 아래 overlay가 깔아줌)
        >
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeWelcomeModal} />

            {/* 내용 래퍼: 슬라이드 업 */}
            <div
                className="relative z-10 w-[min(720px,92vw)] max-h-[92vh] overflow-y-auto
               rounded-2xl bg-white p-6 shadow-2xl border border-gray-200
               animate-slideUp transform"     // ✅ 여기 추가
                onClick={(e) => e.stopPropagation()}
            >
                {showIntro ? (
                    <GameIntro
                        title="카드 게임"
                        icon="🃏"
                        onClose={closeWelcomeModal}
                        onStart={() => setShowIntro(false)}
                        startLabel="🚀 지금 시작하기"
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-xl font-semibold">🃏 카드 게임 (최대값 승자)</h2>
                            <button onClick={closeWelcomeModal} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50">
                                닫기
                            </button>
                        </div>

                        <section className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">참여자</label>
                            <div className="flex flex-wrap items-center gap-2 rounded-xl border p-3">
                                {participants.map((u) => (
                                    <span
                                        key={u}
                                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
                                            result && isWinner(u) ? "border-amber-500 bg-amber-50" : "bg-gray-50"
                                        }`}
                                    >
                    {u}
                                        <button
                                            onClick={() => onRemove(u)}
                                            disabled={participants.length <= 1}
                                            className="text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                            aria-label={`${u} 제거`}
                                        >
                      ×
                    </button>
                  </span>
                                ))}
                                <input
                                    value={newUser}
                                    onChange={(e) => setNewUser(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && onAdd()}
                                    placeholder="닉네임 추가(미입력 시 자동:userN) 후 Enter"
                                    className="min-w-[160px] flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button onClick={onAdd} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                                    추가
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">참가자 수 제한 없음 (1명 이상).</p>
                        </section>

                        <section className="mt-4 flex items-center gap-2">
                            <button
                                disabled={!canPlay}
                                onClick={play}
                                className="rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-indigo-300"
                            >
                                {loading ? "진행 중..." : "게임 시작"}
                            </button>

                            {result && (
                                <button onClick={() => setResult(null)} className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                                    결과 지우기
                                </button>
                            )}
                        </section>

                        {error && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
                        )}

                        {result && (
                            <section className="mt-6 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="text-lg font-semibold">결과</h3>
                                    <p className="text-sm text-gray-500">플레이 시간: {formatKST(result.playedAt)}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                                    {Object.entries(result.userCards).map(([user, num]) => {
                                        const winner = isWinner(user);
                                        return (
                                            <div key={user} className={`rounded-2xl border p-4 shadow-sm ${winner ? "border-amber-500 bg-amber-50" : "bg-white"}`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">{user}</span>
                                                    {winner && (
                                                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600">WIN</span>
                                                    )}
                                                </div>
                                                <div className="mt-3 flex items-end justify-between">
                                                    <div className="text-4xl font-bold leading-none">{toFace(num)}</div>
                                                    <div className="text-xs text-gray-500">({num})</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-2 rounded-xl bg-gray-50 p-3 text-sm">
                                    최종 승자: <span className="font-semibold">{result.winner}</span>
                                </div>
                            </section>
                        )}

                        <p className="mt-6 text-xs text-gray-400">
                            엔드포인트: <code className="rounded bg-gray-100 px-1 py-0.5">POST /games/card/play</code> · 요청 바디 예시: <code>{`{ "participants": ["user1", "user2", "user3"] }`}</code>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
