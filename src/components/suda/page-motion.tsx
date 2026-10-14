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

/** Reveal elements only when they enter the viewport. A short stagger makes
 * the motion noticeable while keeping the page readable and accessible. */
export function ScrollReveal({ pathname }: { pathname: string }) {
  useEffect(() => {
    const main = document.getElementById('main-content');
    if (!main || window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !('IntersectionObserver' in window)) return;

    const targets = [
      '.section-heading > *', '.opportunity-card', '.editorial-copy > *', '.editorial-photo',
      '.suda-journey-intro > *', '.suda-journey-step',
      '.inspiration-teaser-copy > *', '.inspiration-teaser-art', '.category-ribbon > a',
      '.page-intro > *', '.filter-bar', '.category-tabs', '.work-card',
      '.designer-tile', '.designer-expanded', '.profile-section', '.profile-person',
      '.learning-row', '.admin-banner', '.admin-mobile-cards > *',
      '.detail-visual', '.auth-form-wrap', '.auth-visual', '.empty-state',
      '.inspiration-hero .content-wrap > *', '.result-line', '.demo-note',
      '.section-wrap > h2', '.content-wrap > h2'
    ].join(',');

    let index = 0;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        element.classList.add('suda-reveal-visible');
        observer.unobserve(element);
      }
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -12% 0px'
    });

    const register = () => {
      main.querySelectorAll<HTMLElement>(targets).forEach(element => {
        if (element.dataset.sudaReveal) return;
        element.dataset.sudaReveal = 'true';
        // Elements visible on initial load must remain accessible immediately;
        // all elements further down begin faded and reveal on scroll.
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * .78 && rect.bottom > 0) {
          element.classList.add('suda-reveal-visible');
          return;
        }
        if (rect.bottom <= 0) {
          element.classList.add('suda-reveal-visible');
          return;
        }
        element.style.setProperty('--suda-reveal-delay', `${(index++ % 3) * 130}ms`);
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
