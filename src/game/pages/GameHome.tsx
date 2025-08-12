import { useState } from "react";
import DiceGameModal from "../modals/DiceGameModal";
import CardGameModal from "../modals/CardGameModal";
import RpsGameModal from "../modals/RpsGameModal";
import TimingGameModal from "../modals/TimingGameModal";
import RouletteGameModal from "../modals/RouletteGameModal";

type ActiveModal = null | "dice" | "card" | "rps" | "timing" | "roulette";

const GameHome = () => {
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => setActiveModal("dice")}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
                🎲 주사위 게임 열기(모달)
            </button>

            <button
                onClick={() => setActiveModal("card")}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
                🃏 카드 게임 열기(모달)
            </button>

            <button
                onClick={() => setActiveModal("rps")}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
                ✌️ 가위바위보 열기(모달)
            </button>

            <button
                onClick={() => setActiveModal("timing")}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
                ⏱️ 타이밍 게임 열기(모달)
            </button>

            <button
                onClick={() => setActiveModal("roulette")}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                🎯 룰렛 게임 열기(모달)
            </button>

            {activeModal === "dice" && (
                <DiceGameModal closeWelcomeModal={() => setActiveModal(null)} />
            )}
            {activeModal === "card" && (
                <CardGameModal closeWelcomeModal={() => setActiveModal(null)} />
            )}
            {activeModal === "rps" && (
                <RpsGameModal closeWelcomeModal={() => setActiveModal(null)} />
            )}
            {activeModal === "timing" && (
                <TimingGameModal closeWelcomeModal={() => setActiveModal(null)} />
            )}
            {activeModal === "roulette" && (
                <RouletteGameModal closeWelcomeModal={() => setActiveModal(null)} />
            )}
        </div>
    );
};

export default GameHome;
