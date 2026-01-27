import logoFull from '../assets/logo-full.png';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 dark:border-[#243647] bg-white dark:bg-[#111a22] py-8 w-full">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex flex-col gap-4">
                    <img
                        src={logoFull}
                        alt="Hermeos Proptech"
                        className="h-48 w-auto object-contain dark:brightness-0 dark:invert -ml-2"
                    />
                    <div className="text-sm text-gray-500 dark:text-[#93adc8] flex flex-col gap-2">
                        <p>© 2026 Hermeos Proptech. All rights reserved.</p>
                        <p className="flex items-center gap-2 mt-1">
                            <span className="material-symbols-outlined text-[18px]">call</span>
                            <span>0201 330 6309</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">mail</span>
                            <span>hello@hermeosproptech.com</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                    <a href="/privacy" className="text-sm text-gray-500 dark:text-[#93adc8] hover:text-primary transition-colors">
                        Privacy Policy
                    </a>
                    <a href="/terms" className="text-sm text-gray-500 dark:text-[#93adc8] hover:text-primary transition-colors">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
}
