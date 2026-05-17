import { Lang } from '@/types';
import { Translation } from '@/i18n';
import AuthButton from '@/components/auth/AuthButton';
import type { AuthState } from '@/hooks/useAuth';

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translation;
  auth: AuthState;
  onLogin: () => void;
  onLogout: () => void;
}

const LANGS: Lang[] = ['ko', 'en', 'zh', 'ja'];

export default function Header({ lang, setLang, t, auth, onLogin, onLogout }: Props) {
  return (
    <header className="flex justify-between items-center w-full px-3 h-14 z-50 bg-background/95 backdrop-blur-sm sticky top-0 border-b border-outline-variant max-w-2xl mx-auto gap-2">
      <h1 className="text-base font-bold text-primary tracking-tight shrink-0">{t.title}</h1>

      <div className="flex gap-0.5 flex-1 justify-center">
        {LANGS.map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${lang === l ? 'bg-primary text-white' : 'text-outline hover:text-primary'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <AuthButton lang={lang} auth={auth} onLogin={onLogin} onLogout={onLogout} />
    </header>
  );
}
