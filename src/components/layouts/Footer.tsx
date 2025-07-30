import React from "react";

const Footer: React.FC = () => {
    const navItems = [
        {name: "회사소개", path: "/"},
        {name: "자주 묻는 질문", path: "/"},
        {name: "개인정보처리방침", path: "/"},
        {name: "이용 약관", path: "/"},
        {name: "문의하기", path: "/"}
    ];

    return (
        <footer className="w-full bg-gray-800 text-gray-400 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <nav className="flex justify-center space-x-6 text-sm">
                    {navItems.map((item, index) => (
                        <a key={index} href={item.path} className="hover:text-white transition-colors">{item.name}</a>
                    ))}
                </nav>
            </div>
        </footer>
    );
};

export default Footer;