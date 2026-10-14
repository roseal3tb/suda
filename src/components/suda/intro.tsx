import { useEffect, useRef, useState } from 'react';
import { INTRO_KEY } from '@/features/suda/storage';
/** Session-only skippable brand reveal; never recreates the original logo. */
export function Intro(){
 const [show,setShow]=useState(false);
 const [leaving,setLeaving]=useState(false);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>{
   let seen=false;
   try {seen=sessionStorage.getItem(INTRO_KEY)==='1';sessionStorage.setItem(INTRO_KEY,'1');}catch{seen=true;}
   if(seen||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
   setShow(true);
   timers.current=[setTimeout(()=>setLeaving(true),2100),setTimeout(()=>setShow(false),2750)];
   return ()=>timers.current.forEach(clearTimeout);
 },[]);
 function skip(){timers.current.forEach(clearTimeout);setLeaving(true);timers.current=[setTimeout(()=>setShow(false),280)];}
 if(!show)return null;
 return <div className={`intro ${leaving?'is-leaving':''}`} role="region" aria-label="مقدمة سُدى">
  <svg className="intro-thread" viewBox="0 0 700 150" aria-hidden="true"><path d="M0 85 C130 10 215 160 365 77 S575 35 700 82"/></svg>
  <div className="intro-mark"><img src="/suda-logo-transparent.png" alt="سُدى — رُؤى تُنسَج" width={1582} height={1128}/></div>
  <button type="button" className="intro-skip" autoFocus onClick={skip}>تخطّي المقدمة</button>
 </div>;
}
