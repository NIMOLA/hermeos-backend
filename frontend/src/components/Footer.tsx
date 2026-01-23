import logoFull from '../assets/logo-full.png';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 dark:border-[#243647] bg-white dark:bg-[#111a22] py-8">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-2">
                    <img
                        src={logoFull}
                        alt="Hermeos Proptech"
                        className="h-32 w-auto brightness-0 dark:invert -ml-2"
                    />
                    <div className="text-sm text-gray-500 dark:text-[#93adc8] flex flex-col gap-1">
                        <p>© 2026 Hermeos Proptech. All rights reserved.</p>
                        <p className="flex items-center gap-2 mt-2">
                            <span className="material-symbols-outlined text-[18px]">call</span>
                            <span>0201 330 6309</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">mail</span>
                            <span>hello@hermeosproptech.com</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="text-sm text-gray-500 dark:text-[#93adc8] hover:text-primary">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-sm text-gray-500 dark:text-[#93adc8] hover:text-primary">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
}
