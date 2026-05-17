import { LogIn, LogOut, User } from 'lucide-react';
import { Lang } from '@/types';
import type { AuthState } from '@/hooks/useAuth';

const LABEL: Record<Lang, { login: string; logout: string }> = {
  ko: { login: '로그인', logout: '로그아웃' },
  en: { login: 'Sign in', logout: 'Sign out' },
  zh: { login: '登录', logout: '退出' },
  ja: { login: 'ログイン', logout: 'ログアウト' },
};

interface Props {
  lang: Lang;
  auth: AuthState;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AuthButton({ lang, auth, onLogin, onLogout }: Props) {
  const l = LABEL[lang];
  if (auth.loading) return null;

  if (auth.user) {
    const avatar = auth.user.user_metadata?.avatar_url as string | undefined;
    return (
      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 text-xs font-bold px-2 py-1.5 rounded-full hover:bg-surface-variant/40 transition-colors text-on-surface-variant"
        aria-label={l.logout}
      >
        {avatar
          ? <img src={avatar} alt="" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
          : <User size={14} />
        }
        <LogOut size={12} />
      </button>
    );
  }

  return (
    <button
      onClick={onLogin}
      className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors active:scale-95"
      aria-label={l.login}
    >
      <LogIn size={13} /> {l.login}
    </button>
  );
}
