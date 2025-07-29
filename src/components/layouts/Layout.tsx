import React, {type ReactNode, useState} from "react";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import LoginModal from "../modals/LoginModal.tsx";

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
            <div className="flex flex-col h-screen">
                <Header showLoginModal={showLoginModal}/>
                <main className="flex-1 w-full items-center content-center justify-center">
                    {children}
                </main>
                <Footer/>
            </div>
        </>
    );
};

export default Layout;