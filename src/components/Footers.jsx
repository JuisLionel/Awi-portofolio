export default function Footer() {
    return (
        <footer className="relative flex min-h-15 w-full flex-col items-center justify-center gap-1 bg-black px-4 py-3 text-center text-xs text-white sm:flex-row sm:gap-0 sm:text-sm">
            <span>&copy; {new Date().getFullYear()} Awi Dev. All rights reserved.</span>
            <a className="hidden text-gray-500 hover:text-white hover:underline sm:absolute sm:bottom-2 sm:right-2 sm:block sm:text-xs" href="/" target="_blank" rel="noopener noreferrer">
                secret
            </a>
        </footer>
    );
}