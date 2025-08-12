import { useEffect, useMemo, useRef, useState } from "react";
import GameIntro from "./GameIntro.tsx";
import { playTimingGame } from "../timingApi.tsx";
import type { TimingPlayResponse } from "../timingApi.tsx";

interface Props {
    closeWelcomeModal: () => void;
}

type PlayerRow = {
    name: string;
    stoppedAtMs: number | null; // 누른 시점의 경과 시간(ms)
};

const TARGET_MS = 3000;

// 기본 상태: user1, user2 & 아직 정지 안 함
function createInitialPlayers(): PlayerRow[] {
    return [
        { name: "user1", stoppedAtMs: null },
        { name: "user2", stoppedAtMs: null },
    ];
}

function formatMs(ms: number | null) {
    if (ms == null) return "—";
    return `${(ms / 1000).toFixed(3)}s`;
}

export default function TimingGameModal({ closeWelcomeModal }: Props) {
    const [welcome, setWelcome] = useState(true);
    const [players, setPlayers] = useState<PlayerRow[]>([]);
    const [running, setRunning] = useState(false);
    const [tick, setTick] = useState(0); // 리렌더용
    const startAtRef = useRef<number | null>(null); // 공통 시작 시각 (epoch ms)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<TimingPlayResponse | null>(null);

    // 자동 닉네임 (userN 최대값 + 1)
    const nextUserName = useMemo(() => {
        const pat = /^user(\d+)$/;
        let max = 0;
        for (const p of players) {
            const m = p.name.match(pat);
            if (m) max = Math.max(max, Number(m[1]));
        }
        return `user${max + 1}`;
    }, [players]);

    // 러닝 중일 때 20ms 간격으로 경과시간 표시용 re-render
    useEffect(() => {
        if (!running) return;
        const t = setInterval(() => setTick((v) => v + 1), 20);
        return () => clearInterval(t);
    }, [running]);

    // 현재 경과 시간(ms)
    const nowElapsedMs = () => {
        if (!running || startAtRef.current == null) return 0;
        return Date.now() - startAtRef.current;
    };

    function startCommonTimer() {
        startAtRef.current = Date.now();
        setRunning(true);
        // 기존 기록은 유지하지 않고, 새 라운드 시작 시 값 초기화
        setPlayers((prev) => prev.map((p) => ({ ...p, stoppedAtMs: null })));
        setResult(null);
        setError(null);
    }

    function stopFor(index: number) {
        if (!running || startAtRef.current == null) return;
        setPlayers((prev) =>
            prev.map((p, i) =>
                i === index && p.stoppedAtMs == null
                    ? { ...p, stoppedAtMs: Date.now() - startAtRef.current! }
                    : p
            )
        );
    }

    function addPlayer() {
        setPlayers((prev) => [...prev, { name: nextUserName, stoppedAtMs: null }]);
    }

    function removePlayer(index: number) {
        setPlayers((prev) => prev.filter((_, i) => i !== index));
    }

    function updateName(index: number, name: string) {
        setPlayers((prev) => prev.map((p, i) => (i === index ? { ...p, name } : p)));
    }

    function reset() {
        setPlayers(createInitialPlayers());
        setRunning(false);
        startAtRef.current = null;
        setResult(null);
        setError(null);
    }

    // 유효성: 2명 이상, 이름 공백/중복 없음, 모두 정지 누름
    function validate(): string | null {
        if (players.length < 2) return "최소 2명 이상이 필요해요.";
        const names = players.map((p) => p.name.trim());
        if (names.some((n) => !n)) return "이름을 모두 입력해 주세요.";
        if (new Set(names).size !== names.length) return "이름이 중복되면 안 돼요.";
        if (players.some((p) => p.stoppedAtMs == null)) return "모든 참가자가 정지 버튼을 눌러야 해요.";
        return null;
    }

    const hasError = !!validate();

    async function submit() {
        setError(null);
        setResult(null);
        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        try {
            setLoading(true);
            // payload: { userTimings: { user1: 2988, ... } }
            const userTimings: Record<string, number> = {};
            players.forEach((p) => {
                userTimings[p.name.trim()] = p.stoppedAtMs as number;
            });
            const res = await playTimingGame({ userTimings });
            setResult(res);
        } catch (e: any) {
            setError(e?.message ?? "요청 실패");
        } finally {
            setLoading(false);
        }
    }

    // Intro
    if (welcome) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
                 onClick={closeWelcomeModal}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white/95 p-8 shadow-2xl border border-gray-200
                      animate-slideUp"
                     onClick={(e) => e.stopPropagation()}>
                    <GameIntro
                        title="⏱️ 타이밍 게임"
                        subtitle="3초에 가장 가깝게 정지 버튼을 누르면 승리!"
                        icon="⏱️"
                        onClose={closeWelcomeModal}
                        onStart={() => {
                            setPlayers(createInitialPlayers());
                            setWelcome(false);
                        }}
                        startLabel="시작하기"
                    />
                </div>
            </div>
        );
    }

    // Game
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">⏱️ 타이밍 게임</h2>
                    <div className="flex gap-2">
                        <button onClick={reset} className="rounded-lg px-3 py-1 border hover:bg-gray-50">리셋</button>
                        <button onClick={closeWelcomeModal} className="rounded-lg px-3 py-1 hover:bg-gray-100">닫기</button>
                    </div>
                </div>

                {/* 상단 타이머 영역 */}
                <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border p-3">
                        <div className="text-xs text-gray-500">기준 시간</div>
                        <div className="text-lg font-semibold">{(TARGET_MS / 1000).toFixed(3)}s</div>
                    </div>
                    <div className="rounded-lg border p-3">
                        <div className="text-xs text-gray-500">{running ? "경과 시간" : "대기 중"}</div>
                        <div className="text-lg font-semibold">{formatMs(running ? nowElapsedMs() : 0)}</div>
                    </div>
                    <div className="rounded-lg border p-3">
                        <button
                            onClick={running ? undefined : startCommonTimer}
                            disabled={running}
                            className="w-full rounded-lg bg-gray-900 px-3 py-2 text-white disabled:opacity-50 hover:bg-gray-800"
                            title={running ? "이미 진행 중" : "타이머 시작"}
                        >
                            {running ? "진행 중..." : "타이머 시작"}
                        </button>
                    </div>
                </div>

                {/* 참가자 행 */}
                <div className="space-y-3">
                    {players.map((p, i) => {
                        const elapsed = p.stoppedAtMs ?? (running ? nowElapsedMs() : null);
                        const diff = p.stoppedAtMs == null ? null : Math.abs(p.stoppedAtMs - TARGET_MS);

                        return (
                            <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                <input
                                    className="col-span-4 rounded-lg border px-3 py-2"
                                    placeholder={`user${i + 1}`}
                                    value={p.name}
                                    onChange={(e) => updateName(i, e.target.value)}
                                />
                                <div className="col-span-3 rounded-lg border px-3 py-2 text-center">
                                    {formatMs(elapsed)}
                                </div>
                                <div className="col-span-3 rounded-lg border px-3 py-2 text-center text-sm text-gray-600">
                                    {diff == null ? "—" : `오차 ${diff}ms`}
                                </div>
                                <div className="col-span-2 flex gap-2">
                                    <button
                                        onClick={() => stopFor(i)}
                                        disabled={!running || p.stoppedAtMs != null}
                                        className="flex-1 rounded-lg border px-2 py-2 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        정지
                                    </button>
                                    <button
                                        onClick={() => removePlayer(i)}
                                        disabled={players.length <= 2}
                                        className="rounded-lg border px-2 py-2 hover:bg-gray-50 disabled:opacity-50"
                                        title={players.length <= 2 ? "최소 2명 필요" : "삭제"}
                                    >
                                        ✖︎
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex gap-2">
                        <button onClick={addPlayer} className="rounded-xl border px-3 py-2 hover:bg-gray-50">
                            + 참가자 추가
                        </button>
                        <button
                            onClick={submit}
                            disabled={loading || hasError}
                            className="rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? "계산 중..." : "결과 제출"}
                        </button>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    {result && (
                        <div className="rounded-xl border p-4">
                            <div className="font-medium mb-1">승자 🎉</div>
                            <ul className="list-inside list-disc">
                                {result.winners.map((w, idx) => (
                                    <li key={idx}>{w}</li>
                                ))}
                            </ul>
                            <div className="mt-2 text-sm text-gray-600">
                                기준에 가장 가까운 시간: <b>{result.winningTime}ms</b>
                            </div>
                            <div className="text-xs text-gray-500">playedAt: {result.playedAt}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}