import { useEffect, useState } from 'react';

/** A quiet, continuous thread in the margins of every page except the home page,
 * which already has its own editorial thread journey. */
export function PageThread({ pathname }: { pathname: string }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const main = document.getElementById('main-content');
        if (!main) return;
        const bounds = main.getBoundingClientRect();
        const viewHeight = window.innerHeight || 1;
        const amount = (viewHeight * .76 - bounds.top) / (bounds.height + viewHeight * .25);
        setProgress(Math.max(0, Math.min(1, amount)));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  const variant = ['/inspiration', '/portfolio', '/learning'].some(p => pathname.startsWith(p));
  const path = variant
    ? 'M 65 0 C 85 120 155 190 125 305 S 60 485 125 590 C 245 790 845 650 925 815 S 880 1110 940 1260 S 935 1410 890 1500'
    : 'M 935 0 C 900 115 825 220 875 340 S 960 505 890 620 C 760 830 135 690 95 880 S 160 1120 75 1290 S 75 1450 115 1500';

  return <svg className="suda-page-thread" viewBox="0 0 1000 1500" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path className="suda-page-thread-shadow" d={path} vectorEffect="non-scaling-stroke" />
    <path className="suda-page-thread-ink" d={path} pathLength={1000} vectorEffect="non-scaling-stroke"
      style={{ strokeDasharray: 1000, strokeDashoffset: 1000 * (1 - progress) }} />
  </svg>;
}

/** Secondary pages: cover legacy sections while core cards and home elements
 * use per-component Reveal. No early-visible shortcut; the observer triggers
 * at the viewport threshold and never replays on scroll-back. */
export function ScrollReveal({ pathname }: { pathname: string }) {
  useEffect(() => {
    const main = document.getElementById('main-content');
    if (!main || window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !('IntersectionObserver' in window)) return;
    const targets = [
      '.category-ribbon > a', '.category-tabs', '.filter-bar', '.result-line',
      '.work-card', '.designer-tile', '.profile-person', '.profile-section',
      '.learning-row', '.admin-banner', '.admin-mobile-card', '.admin-table-wrap',
      '.auth-form-wrap', '.auth-visual', '.detail-visual', '.empty-state',
      '.inspiration-hero .content-wrap > *', '.inspiration-main .section-heading',
      '.inspiration-disclaimer', '.designer-expanded', '.teaser-label'
    ].join(',');
    let count = 0;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('suda-reveal-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
    const register = () => {
      main.querySelectorAll<HTMLElement>(targets).forEach(element => {
        if (element.dataset.sudaReveal || element.closest('.suda-enter')) return;
        element.dataset.sudaReveal = 'true';
        element.style.setProperty('--suda-reveal-delay', `${(count++ % 3) * 90}ms`);
        element.classList.add('suda-reveal-pending');
        observer.observe(element);
      });
    };
    register();
    const changes = new MutationObserver(register);
    changes.observe(main, { childList: true, subtree: true });
    return () => {
      changes.disconnect();
      observer.disconnect();
      main.querySelectorAll<HTMLElement>('[data-suda-reveal]').forEach(element => {
        element.classList.remove('suda-reveal-pending', 'suda-reveal-visible');
        element.style.removeProperty('--suda-reveal-delay');
        delete element.dataset.sudaReveal;
      });
    };
  }, [pathname]);
  return null;
}
