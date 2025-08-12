import { useEffect, useMemo, useState } from "react";
import GameIntro from "./GameIntro";
import { playRouletteGame, type RoulettePlayResponse } from "../rouletteApi";

interface Props {
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

export default function RouletteGameModal({ closeWelcomeModal }: Props) {
    const [showIntro, setShowIntro] = useState(true);
    const [participants, setParticipants] = useState<string[]>(["user1", "user2"]);
    const [newUser, setNewUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<RoulettePlayResponse | null>(null);

    // ESC로 닫기
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeWelcomeModal();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeWelcomeModal]);

    const canPlay = useMemo(() => {
        const names = participants.map((v) => v.trim());
        const hasEmpty = names.some((n) => !n);
        const hasDup = new Set(names).size !== names.length;
        return !loading && names.length >= 2 && !hasEmpty && !hasDup;
    }, [participants, loading]);

    const onRemove = (name: string) =>
        setParticipants((prev) => (prev.length <= 2 ? prev : prev.filter((p) => p !== name)));

    const onAdd = () => {
        const v = newUser.trim();
        const name = v || nextAutoName(participants);
        if (participants.includes(name)) {
            setNewUser("");
            return;
        }
        setParticipants((prev) => [...prev, name]);
        setNewUser("");
    };

    const play = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const payload = participants.map((p) => p.trim()).filter(Boolean);
            const data = await playRouletteGame(payload);
            setResult(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "요청 실패");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setParticipants(["user1", "user2"]);
        setResult(null);
        setError(null);
    };

    const sorted = useMemo(() => {
        if (!result) return [];
        return Object.entries(result.userSpins).sort((a, b) => b[1] - a[1]); // [ [name, score], ... ]
    }, [result]);

    const isWinner = (u: string) => !!result?.winners.includes(u);

    // ── Intro (부드러운 등장) ───────────────────────────────────────────────
    if (showIntro) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={closeWelcomeModal}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div
                    className="relative z-10 w-full max-w-xl rounded-2xl bg-white/95 p-8 shadow-2xl border border-gray-200 animate-slideUp"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GameIntro
                        title="🎯 룰렛 게임"
                        subtitle="여러 명이 1~100 사이 숫자를 뽑아요. 최댓값을 뽑은 사람이 승리! (동점이면 공동 승자)"
                        icon="🎯"
                        onClose={closeWelcomeModal}
                        onStart={() => setShowIntro(false)}
                        startLabel="시작하기"
                    />
                </div>
            </div>
        );
    }

    // ── Game 화면 ───────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={closeWelcomeModal}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className="relative z-10 w-[min(720px,92vw)] max-h-[92vh] overflow-y-auto rounded-2xl bg-white/95 p-6 shadow-2xl border border-gray-200 animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">🎯 룰렛 게임 (최댓값 승자)</h2>
                    <div className="flex gap-2">
                        <button onClick={reset} className="rounded-lg px-3 py-1 border hover:bg-gray-50">리셋</button>
                        <button onClick={closeWelcomeModal} className="rounded-lg px-3 py-1 hover:bg-gray-100">닫기</button>
                    </div>
                </div>

                {/* 참가자 관리 */}
                <section className="mt-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">참여자</label>
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border p-3">
                        {participants.map((u) => (
                            <span
                                key={u}
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${isWinner(u) ? "border-amber-500 bg-amber-50" : "bg-gray-50"}`}
                            >
                {u}
                                <button
                                    onClick={() => onRemove(u)}
                                    disabled={participants.length <= 2}
                                    className="text-gray-400 hover:text-gray-600 disabled:opacity-40"
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
                    <p className="mt-1 text-xs text-gray-500">최소 2명 이상, 공백/중복 닉네임은 불가.</p>
                </section>

                {/* 실행 버튼 */}
                <section className="mt-4 flex items-center gap-2">
                    <button
                        disabled={!canPlay}
                        onClick={play}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-indigo-300"
                    >
                        {loading ? "돌리는 중..." : "룰렛 돌리기"}
                    </button>

                    {result && (
                        <button onClick={() => setResult(null)} className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                            결과 지우기
                        </button>
                    )}
                </section>

                {/* 에러 */}
                {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                {/* 결과 */}
                {result && (
                    <section className="mt-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-lg font-semibold">결과</h3>
                            <p className="text-sm text-gray-500">playedAt: {result.playedAt}</p>
                        </div>

                        <ul className="space-y-2">
                            {sorted.map(([name, score], idx) => (
                                <li key={name} className="flex items-center justify-between rounded-xl border p-3 bg-white">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 w-6 text-right">{idx + 1}.</span>
                                        <span className={`font-medium ${isWinner(name) ? "text-amber-700" : ""}`}>{name}</span>
                                    </div>
                                    <div className="text-sm">
                                        점수 <span className={`font-semibold ${isWinner(name) ? "text-amber-700" : "text-gray-900"}`}>{score}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className={`mt-2 rounded-xl p-3 text-sm ${result.winners.length > 1 ? "bg-yellow-50" : "bg-green-50"}`}>
                            {result.winners.length > 1
                                ? `🤝 공동 승자: ${result.winners.join(", ")}`
                                : <>🏆 승자: <span className="font-semibold">{result.winners[0]}</span></>}
                        </div>
                    </section>
                )}

                <p className="mt-6 text-xs text-gray-400">
                    엔드포인트: <code className="rounded bg-gray-100 px-1 py-0.5">POST /games/roulette/play</code> · 요청 바디 예시: <code>{`["user1","user2","user3"]`}</code>
                </p>
            </div>
        </div>
    );
}
