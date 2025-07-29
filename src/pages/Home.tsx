import React, { useEffect, useState, useCallback, useMemo } from "react";
import AddressSearchModal from "../components/modals/AddressSearchModal";
import WelcomeModal from "../components/modals/WelcomeModal";
import MeetupSetupModal from "../components/modals/MeetupSetupModal";

// 타입 정의
interface Friend {
    id: number;
    name: string;
    address: string;
}

interface MeetupSetupModalRef {
    updateFriendAddress: (friendId: number, address: string) => void;
}

const Home: React.FC = () => {
    const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
    const [showMeetupSetupModal, setShowMeetupSetupModal] = useState<boolean>(false);
    const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
    const [currentFriendId, setCurrentFriendId] = useState<number>(0);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [meetupSetupModalRef, setMeetupSetupModalRef] = useState<MeetupSetupModalRef | null>(null);

    const handleStart = useCallback(() => {
        setShowWelcomeModal(false);
        setShowMeetupSetupModal(true);
    }, []);

    const closeWelcomeModal = useCallback(() => {
        setShowWelcomeModal(false);
    }, []);

    const handleSearchAddress = useCallback((friendId: number) => {
        setCurrentFriendId(friendId);
        setShowSearchModal(true);
    }, []);

    const handleCloseMeetupSetup = useCallback(() => {
        setShowMeetupSetupModal(false);
        setShowWelcomeModal(true);
    }, []);

    const closeSearchModal = useCallback(() => {
        setShowSearchModal(false);
    }, []);

    const handleSelectAddress = useCallback((address: string) => {
        // MeetupSetupModal의 주소 업데이트 함수 호출
        if (meetupSetupModalRef?.updateFriendAddress) {
            meetupSetupModalRef.updateFriendAddress(currentFriendId, address);
        }
        setShowSearchModal(false);
    }, [currentFriendId, meetupSetupModalRef]);

    const handleFindMeetingPoint = useCallback((friendsData: Friend[]) => {
        setFriends(friendsData);
        setShowMeetupSetupModal(false);
        // TODO: 중간지점 찾기 로직 구현
        console.log('중간지점 찾기:', friends);
        console.log('중간지점 찾기:', friendsData);
    }, [friends]);
    // 네이버 지도 초기화를 메모화
    const mapConfig = useMemo(() => ({
        zoom: 16,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: window.naver?.maps?.MapTypeControlStyle?.BUTTON,
            position: window.naver?.maps?.Position?.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: window.naver?.maps?.ZoomControlStyle?.LARGE,
            position: window.naver?.maps?.Position?.TOP_LEFT
        }
    }), []);

    useEffect(() => {
        if (window.naver?.maps) {
            new window.naver.maps.Map('map', mapConfig);
        } else {
            console.error("네이버 지도 API가 로드되지 않았습니다.");
        }
    }, [mapConfig]);

    return (
        <>
            {showWelcomeModal && (
                <WelcomeModal closeWelcomeModal={closeWelcomeModal} onStart={handleStart} />
            )}
            {showMeetupSetupModal && (
                <MeetupSetupModal
                    onClose={handleCloseMeetupSetup}
                    onSearchAddress={handleSearchAddress}
                    onFindMeetingPoint={handleFindMeetingPoint}
                    ref={setMeetupSetupModalRef}
                />
            )}
            {showSearchModal && (
                <AddressSearchModal
                    closeModal={closeSearchModal}
                    onSelectAddress={handleSelectAddress}
                    addressIndex={currentFriendId}
                />
            )}
            <div className="w-full h-full">
                <div
                    id="map"
                    className="w-full h-full"
                />
            </div>
        </>
    );
}

export default Home;