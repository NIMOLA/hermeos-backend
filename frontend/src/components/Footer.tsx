import logoFull from '../assets/logo-full.png';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 dark:border-[#243647] bg-white dark:bg-[#111a22] py-8">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <img
                        src={logoFull}
                        alt="Hermeos Proptech"
                        className="h-20 w-auto brightness-0 dark:invert"
                    />
                    <p className="text-sm text-gray-500 dark:text-[#93adc8]">
                        © 2026 Hermeos Proptech. All rights reserved.
                    </p>
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
