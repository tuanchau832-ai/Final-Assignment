/// <reference types="vite/client" />
import { useEffect, useRef, useState } from 'react';
import type { FormEvent, RefObject } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Droplets, Eye, EyeOff, FlaskConical, Globe2, LockKeyhole, Map, UserRound } from 'lucide-react';
import { api, ApiError } from './api';
import type { User } from './types';
import { loginDestination } from './loginDestination';
import RiverBackground from './underwater/RiverBackground';
import './login.css';

const copy = {
  en: {
    title: 'See Hanoi through', accent: 'its waterways.',
    lead: 'Explore the city’s monitoring stations, follow changes in water quality, and investigate simulated alerts.',
    welcome: 'Welcome back', formIntro: 'Sign in to your WaterWatch workspace.',
    submitting: 'Signing in…', guest: 'Explore the map', show: 'Show password', hide: 'Hide password',
    denied: 'Sign-in failed. Check your username and password.', wait: 'Too many attempts. Try again in a minute.',
    failed: 'Unable to reach the sign-in service. Check your connection and try again.',
    skip: 'Skip to sign in', language: 'Switch to Vietnamese',
  },
  vi: {
    title: 'Khám phá Hà Nội', accent: 'qua những dòng sông.',
    lead: 'Khám phá mạng lưới trạm quan trắc, theo dõi diễn biến chất lượng nước và xem xét các cảnh báo mô phỏng.',
    welcome: 'Chào mừng trở lại', formIntro: 'Đăng nhập vào không gian làm việc WaterWatch.',
    submitting: 'Đang đăng nhập…', guest: 'Khám phá bản đồ', show: 'Hiện mật khẩu', hide: 'Ẩn mật khẩu',
    denied: 'Đăng nhập thất bại. Hãy kiểm tra tên đăng nhập và mật khẩu.', wait: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau một phút.',
    failed: 'Không thể kết nối dịch vụ đăng nhập. Hãy kiểm tra kết nối và thử lại.',
    pause: 'Tạm dừng hình nền', play: 'Phát hình nền', credit: 'Mô phỏng minh họa ô nhiễm sông · Không đo mầm bệnh',
    skip: 'Chuyển đến đăng nhập', language: 'Switch to English',
  },
};

function useMouseEffectEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(!reduced.matches && fine.matches);
    update();
    reduced.addEventListener('change', update);
    fine.addEventListener('change', update);
    return () => {
      reduced.removeEventListener('change', update);
      fine.removeEventListener('change', update);
    };
  }, []);
  return enabled;
}

function useSoapPointer(surface: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    const node = surface.current;
    if (!node || !enabled) return;
    let frame = 0;
    let releaseTimer = 0;
    let x = 0;
    let y = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      window.clearTimeout(releaseTimer);
      setPressed(false);
      delete node.dataset.pointer;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        node.style.setProperty('--entry-x', x + 'px');
        node.style.setProperty('--entry-y', y + 'px');
        node.dataset.pointer = 'active';
      });
    };
    const press = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      if ((event.target as Element | null)?.closest('.entry-card')) return;
      window.clearTimeout(releaseTimer);
      move(event);
      setPressed(true);
    };
    const release = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      // Keep the bubbles visible even after a quick click.
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => setPressed(false), 180);
    };
    node.addEventListener('pointerenter', move, { passive: true });
    node.addEventListener('pointermove', move, { passive: true });
    node.addEventListener('pointerdown', press, { passive: true });
    node.addEventListener('pointerleave', reset);
    node.addEventListener('pointercancel', reset);
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('blur', reset);
    return () => {
      reset();
      node.style.removeProperty('--entry-x');
      node.style.removeProperty('--entry-y');
      node.removeEventListener('pointerenter', move);
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerdown', press);
      node.removeEventListener('pointerleave', reset);
      node.removeEventListener('pointercancel', reset);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('blur', reset);
    };
  }, [enabled, surface]);
  return pressed ? '🫧' : '🧼';
}

export default function LoginPage() {
  const { i18n, t } = useTranslation();
  const vi = i18n.language.startsWith('vi');
  const strings = vi ? copy.vi : copy.en;
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const surface = useRef<HTMLDivElement>(null);
  const mouseEffectEnabled = useMouseEffectEnabled();
  const pointerIcon = useSoapPointer(surface, mouseEffectEnabled);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submitting = useRef(false);
  const login = useMutation({
    mutationFn: () => api<{ user: User }>('/auth/login', { username, password }),
    onSuccess: async session => {
      await queryClient.cancelQueries({ queryKey: ['user'] });
      queryClient.setQueryData(['user'], session);
      void queryClient.invalidateQueries({ predicate: query => query.queryKey[0] !== 'user' });
      navigate(loginDestination(new URLSearchParams(location.search).get('returnTo')), { replace: true });
    },
    onSettled: () => { submitting.current = false; },
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    login.mutate();
  }
  const error = login.error instanceof ApiError && login.error.status === 429 ? strings.wait
    : login.error instanceof ApiError && [401, 403, 422].includes(login.error.status) ? strings.denied : strings.failed;
  return <div className="entry-page" ref={surface}>
    <RiverBackground pause={strings.pause} play={strings.play}/>
    <div className="entry-shade" aria-hidden="true" />
    <span className="entry-pointer" aria-hidden="true">{pointerIcon}</span>
    <a className="skip" href="#entry-username">{strings.skip}</a>
    <header className="entry-head">
      <span className="entry-wordmark"><span className="entry-mark"><Droplets size={25} aria-hidden="true"/></span>Hanoi<span>WaterWatch</span></span>
      <button className="entry-language" title={strings.language} onClick={() => void i18n.changeLanguage(vi ? 'en' : 'vi')}>
        <Globe2 size={16} aria-hidden="true"/><span lang={vi ? 'en' : 'vi'}>{vi ? 'English' : 'Tiếng Việt'}</span>
      </button>
    </header>
    <main className="entry-content" id="main">
      <section className="entry-intro" aria-labelledby="entry-title">
        <h1 id="entry-title">{strings.title} <span>{strings.accent}</span></h1>
        <p>{strings.lead}</p>
      </section>
      <section className="entry-card" aria-labelledby="entry-form-title">
        <h2 id="entry-form-title">{strings.welcome}</h2>
        <p>{strings.formIntro}</p>
        <form onSubmit={submit} aria-busy={login.isPending}>
          <label htmlFor="entry-username">{t('username')}</label>
          <div className="entry-field"><UserRound size={17} aria-hidden="true"/>
            <input id="entry-username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false}
              required maxLength={200} value={username} onChange={e => setUsername(e.target.value)}/>
          </div>
          <label htmlFor="entry-password">{t('password')}</label>
          <div className="entry-field"><LockKeyhole size={17} aria-hidden="true"/>
            <input id="entry-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
              required maxLength={2000} value={password} onChange={e => setPassword(e.target.value)}/>
            <button type="button" aria-label={showPassword ? strings.hide : strings.show} aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
          </div>
          {login.isError && <p className="entry-error" role="alert">{error}</p>}
          <button className="entry-submit" disabled={login.isPending} type="submit">{login.isPending ? strings.submitting : t('login')}<ArrowRight size={17}/></button>
        </form>
        <Link className="entry-guest" to="/map"><Map size={16}/>{strings.guest}<ArrowRight size={15}/></Link>
      </section>
    </main>
    <div className="entry-foot">
      <div className="entry-disclosure" role="note"><FlaskConical size={18} aria-hidden="true"/><p>{t('banner')}</p></div>
      <small>{strings.credit}</small>
    </div>
  </div>;
}
