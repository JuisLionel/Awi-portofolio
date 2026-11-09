import { useLanguage } from "@/context/useLanguage";

const NEXT_LANGUAGE_KEY = {
  en: "switchToIndonesian",
  id: "switchToEnglish",
};

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const nextLanguage = language === "en" ? "id" : "en";

  return (
    <button
      type="button"
      onClick={() => setLanguage(nextLanguage)}
      aria-label={t("language", NEXT_LANGUAGE_KEY[language])}
      className="relative z-10 rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors hover:border-lime hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
    >
      {t("language", "nextLabel")}
    </button>
  );
}
