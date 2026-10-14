import { useEffect, useState } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { ArrowLeft, Menu, X, LogOut, UserRound, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Wordmark, Modal } from './shared';
import { Intro } from './intro';
import { PageThread, ScrollReveal } from './page-motion';
import { ScrollProgress } from './scroll-progress';
import { useDemo } from '@/features/suda/demo-context';
import { imageCredits } from '@/features/suda/mock-data';
const nav=[{to:'/',label:'الرئيسية'},{to:'/opportunities',label:'الفرص'},{to:'/profile',label:'الملف المهني'},{to:'/portfolio',label:'معرض الأعمال'},{to:'/learning',label:'رحلتي التعليمية'},{to:'/inspiration',label:'إلهام سعودي'}] as const;
export function Shell({children}:{children:React.ReactNode}) {
 const {session,logout,resetDemo,storageError,clearStorageError}=useDemo();const navigate=useNavigate();const pathname=useRouterState({select:s=>s.location.pathname});const [open,setOpen]=useState(false);const [resetting,setResetting]=useState(false);const [resetDone,setResetDone]=useState(false);const [scrolled,setScrolled]=useState(false);
 useEffect(()=>{const on=()=>setScrolled(window.scrollY>40);on();window.addEventListener('scroll',on,{passive:true});return()=>window.removeEventListener('scroll',on);},[]);
 useEffect(()=>setOpen(false),[pathname]);
 useEffect(()=>{if(!resetDone)return;const t=setTimeout(()=>setResetDone(false),4000);return()=>clearTimeout(t);},[resetDone]);
 return <><Intro/><ScrollProgress/><a href="#main-content" className="skip-link">تخطّي إلى المحتوى</a><header className={`site-header ${scrolled?'is-scrolled':''} ${pathname==='/'?'is-home':''}`}><div className="nav-wrap"><Link to="/" className="brand-link" aria-label="سُدى، الصفحة الرئيسية" onClick={()=>setOpen(false)}><Wordmark/></Link><nav className={`main-nav ${open?'is-open':''}`} aria-label="التنقل الرئيسي">{nav.map(n=><Link key={n.to} to={n.to} activeOptions={{exact:n.to==='/'}} onClick={()=>setOpen(false)}>{n.label}</Link>)}{session?.role==='admin'&&<Link to="/admin" onClick={()=>setOpen(false)}>إدارة الفرص</Link>}</nav><div className="nav-account">{session?<><span className="session-name"><UserRound size={15}/>{session.name}</span><Button variant="ghost" size="icon" title="تسجيل الخروج" aria-label="تسجيل الخروج" onClick={()=>{logout();setOpen(false);navigate({to:'/login',replace:true});}}><LogOut/></Button></>:<Button asChild variant="outline" className="login-button"><Link to="/login">تسجيل الدخول <ArrowLeft/></Link></Button>}<Button variant="ghost" size="icon" className="mobile-menu" aria-expanded={open} aria-label={open?'إغلاق القائمة':'فتح القائمة'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button></div></div></header>
 {storageError&&<div role="alert" className="global-alert"><span>{storageError}</span><button onClick={clearStorageError} aria-label="إغلاق التنبيه"><X size={15}/></button></div>}
 {resetDone&&<div role="status" className="global-alert is-success"><span>أُعيدت البيانات التجريبية إلى حالتها الأصلية.</span></div>}
 <main id="main-content" className={pathname === "/" ? undefined : "suda-threaded-page"}>{pathname !== "/" && <PageThread pathname={pathname}/>} {children}</main>
 <ScrollReveal pathname={pathname}/>
 <footer className="site-footer suda-footer" aria-label="تذييل سُدى">
   <div className="suda-footer-main">
     <Link to="/" className="suda-footer-logo" aria-label="سُدى — العودة للرئيسية"><Wordmark/></Link>
     <p className="suda-footer-motto">رُؤى تُنسَج</p>
     <span className="suda-footer-rule" aria-hidden="true"/>
   </div>
   <div className="suda-footer-utility">
     <p>© ٢٠٢٦ سُدى · جميع الحقوق محفوظة</p>
     <span className="suda-footer-project">مشروع جامعي تجريبي · لا توجد حسابات أو فرص حقيقية في هذه النسخة</span>
     <div className="suda-footer-utilities">
       <details className="suda-photo-sources"><summary>اعتمادات الصور</summary><div className="suda-photo-sources-content"><span>صور عامة من Unsplash:</span>{imageCredits.map(credit=><a key={credit.key} href={credit.source} target="_blank" rel="noopener noreferrer">{credit.author}</a>)}<a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">الترخيص</a></div></details>
       <button type="button" className="suda-reset" onClick={()=>setResetting(true)}><RotateCcw size={13}/>إعادة ضبط البيانات</button>
     </div>
   </div>
 </footer>
 <Modal open={resetting} onClose={()=>setResetting(false)} title="إعادة ضبط البيانات التجريبية" description="ستُستعاد الفرص الأصلية، ويُمسح الملف المهني ومعرض الأعمال والالتحاقات والتقدّم المحفوظ محليًا."><div className="form-actions"><Button variant="destructive" onClick={()=>{if(resetDemo()){setResetting(false);setResetDone(true);}}}>تأكيد إعادة الضبط</Button><Button variant="outline" onClick={()=>setResetting(false)}>إلغاء</Button></div></Modal></>;
}
