import { useState } from "react";
import GameIntro from "./GameIntro.tsx"; // GameIntro 경로 확인!
import type { RpsPlayResponse, RpsPlayerInput, RpsChoice, MaybeChoice } from "../../game/rpsApi";
import { playRpsGame } from "../../game/rpsApi";

interface Props {
    closeWelcomeModal: () => void;
}

const CHOICES: RpsChoice[] = ["ROCK", "PAPER", "SCISSORS"];

// 기본 상태 생성 함수
function createInitialPlayers(count: number): RpsPlayerInput[] {
    return Array.from({ length: count }, (_, i) => ({
        name: `user${i + 1}`,
        choice: "",
    }));
}

export default function RpsGameModal({ closeWelcomeModal }: Props) {
    const [welcome, setWelcome] = useState(true);
    const [players, setPlayers] = useState<RpsPlayerInput[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<RpsPlayResponse | null>(null);

    // 자동 닉네임 생성: 현재 userN 중 가장 큰 N + 1
    function getNextUserName(): string {
        const pattern = /^user(\d+)$/;
        let max = 0;
        for (const p of players) {
            const match = p.name.match(pattern);
            if (match) {
                max = Math.max(max, parseInt(match[1], 10));
            }
        }
        return `user${max + 1}`;
    }

    function addPlayer() {
        setPlayers(prev => [...prev, { name: getNextUserName(), choice: "" }]);
    }

    function removePlayer(index: number) {
        setPlayers(prev => prev.filter((_, i) => i !== index));
    }

    function updateName(index: number, name: string) {
        setPlayers(prev => prev.map((p, i) => (i === index ? { ...p, name } : p)));
    }

    function updateChoice(index: number, choice: MaybeChoice) {
        setPlayers(prev => prev.map((p, i) => (i === index ? { ...p, choice } : p)));
    }

    function reset() {
        setPlayers(createInitialPlayers(2)); // 처음 상태로 복귀
        setResult(null);
        setError(null);
    }

    function validate(): string | null {
        if (players.length < 2) return "최소 2명 이상이 필요해요.";
        const names = players.map(p => p.name.trim());
        if (names.some(n => !n)) return "이름을 모두 입력해 주세요.";
        if (players.some(p => !p.choice)) return "모든 참가자의 선택을 입력해주세요.";
        if (new Set(names).size !== names.length) return "이름이 중복되면 안 돼요.";
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
            const payload = players.map(p => ({
                name: p.name,
                choice: p.choice as RpsChoice,
            }));
            const res = await playRpsGame(payload);
            setResult(res);
        } catch (e: any) {
            setError(e?.message ?? "요청 실패");
        } finally {
            setLoading(false);
        }
    }

    // --- GameIntro 화면 ---
    if (welcome) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeWelcomeModal} />
                <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white/95 p-8 shadow-2xl border border-gray-200 animate-slideUp"
                     onClick={(e) => e.stopPropagation()}>
                    <GameIntro
                        title="✌️ 가위바위보 게임"
                        subtitle="기본으로 2명이 추가되어 있습니다. 선택지를 고르고 시작하세요."
                        icon="✌️"
                        onClose={closeWelcomeModal}
                        onStart={() => {
                            setPlayers(createInitialPlayers(2)); // 시작할 때 초기값 설정
                            setWelcome(false);
                        }}
                        startLabel="시작하기"
                    />
                </div>
            </div>
        );
    }

    // --- 실제 게임 화면 ---
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">✌️ 가위바위보</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={reset}
                            className="rounded-lg px-3 py-1 border hover:bg-gray-50"
                        >
                            리셋
                        </button>
                        <button
                            onClick={closeWelcomeModal}
                            className="rounded-lg px-3 py-1 hover:bg-gray-100"
                        >
                            닫기
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {players.map((p, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2">
                            <input
                                className="col-span-6 rounded-lg border px-3 py-2"
                                placeholder={`user${i + 1}`}
                                value={p.name}
                                onChange={(e) => updateName(i, e.target.value)}
                            />
                            <select
                                className="col-span-5 rounded-lg border px-3 py-2"
                                value={p.choice}
                                onChange={(e) =>
                                    updateChoice(i, e.target.value as MaybeChoice)
                                }
                            >
                                <option value="" disabled>
                                    선택해주세요
                                </option>
                                {CHOICES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => removePlayer(i)}
                                className="col-span-1 rounded-lg border px-2 py-2 hover:bg-gray-50"
                                disabled={players.length <= 2}
                                title={players.length <= 2 ? "최소 2명 필요" : "삭제"}
                            >
                                ✖︎
                            </button>
                        </div>
                    ))}

                    <div className="flex gap-2">
                        <button
                            onClick={addPlayer}
                            className="rounded-xl border px-3 py-2 hover:bg-gray-50"
                        >
                            + 참가자 추가
                        </button>
                        <button
                            onClick={submit}
                            disabled={loading || hasError}
                            className="rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? "계산 중..." : "승자 계산"}
                        </button>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    {result && (
                        <div className="rounded-xl border p-4">
                            {result.draw ? (
                                <p className="font-medium">무승부 🎯</p>
                            ) : (
                                <div>
                                    <p className="font-medium">승자 🎉</p>
                                    <ul className="list-inside list-disc">
                                        {result.winners.map((w, idx) => (
                                            <li key={idx}>{w}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}