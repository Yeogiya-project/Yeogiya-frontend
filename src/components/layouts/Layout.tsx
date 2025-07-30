import React, {type ReactNode, useState} from "react";
import Header from "./header/Header.tsx";
import Footer from "./Footer";
import LoginModal from "../modals/LoginModal";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const showLoginModal = () => {
        setLoginModalOpen(true);
    }
    const closeLoginModal = () => {
        setLoginModalOpen(false);
    }
    return (
        <>
            {loginModalOpen && <LoginModal closeLoginModal={closeLoginModal}/>}
            <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
                <Header showLoginModal={showLoginModal}/>
                <main className="w-full">
                    {children}
                </main>
                <Footer/>
            </div>
        </>
    );
};

export default Layout;