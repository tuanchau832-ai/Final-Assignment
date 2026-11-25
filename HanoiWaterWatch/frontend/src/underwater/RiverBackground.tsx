import { useEffect, useRef, useState } from 'react';

const poster='/media/underwater.webp';
const override=import.meta.env.VITE_LOGIN_VIDEO_URL?.trim();
type Device = Navigator & { deviceMemory?:number; connection?:EventTarget & {saveData?:boolean; effectiveType?:string} };

export default function RiverBackground() {
  const current=useRef<ReturnType<typeof import('./current')['startCurrent']>|null>(null);
  const video=useRef<HTMLVideoElement>(null), canvas=useRef<HTMLCanvasElement>(null);
  const [enabled,setEnabled]=useState(false), [failed,setFailed]=useState(false);
  const [visible,setVisible]=useState(!document.hidden);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    const motion=matchMedia('(prefers-reduced-motion: reduce)'), device=navigator as Device;
    const update=()=>setEnabled(!motion.matches && !device.connection?.saveData &&
      !['slow-2g','2g'].includes(device.connection?.effectiveType||'') && (device.deviceMemory??8)>2 &&
      (device.hardwareConcurrency||4)>2);
    const visibility=()=>setVisible(!document.hidden);
    update(); motion.addEventListener('change',update); document.addEventListener('visibilitychange',visibility);
    device.connection?.addEventListener('change',update);
    return ()=>{motion.removeEventListener('change',update); document.removeEventListener('visibilitychange',visibility); device.connection?.removeEventListener('change',update);};
  },[]);
  const animate=enabled && !failed, running=animate && visible;
  useEffect(()=>{
    const player=video.current;
    if(!player) return;
    let active=true;
    if(running) void player.play().catch(()=>{if(active) setFailed(true);});
    else player.pause();
    return ()=>{active=false;player.pause();};
  },[running,animate]);
  useEffect(()=>{
    const layer=canvas.current, surface=layer?.parentElement;
    if(!animate || !layer || !surface || override) return;
    let active=true;
    void import('./current').then(({startCurrent})=>{
      if(!active) return;
      current.current=startCurrent(layer,surface,()=>setFailed(true));
      current.current.setRunning(!document.hidden && !video.current?.paused);
    }).catch(()=>{if(active)setFailed(true);});
    return ()=>{active=false;current.current?.dispose();current.current=null;};
  },[animate]);
  useEffect(()=>{current.current?.setRunning(running);},[running]);
  return <>
    <img className="entry-poster" src={poster} width="1672" height="941" alt="" fetchPriority="high"/>
    {animate && <>
      <video ref={video} className={'entry-video'+(ready?' visible':'')} src={override||'/media/underwater.mp4'} poster={poster}
        muted autoPlay={running} loop playsInline preload="metadata" disablePictureInPicture aria-hidden="true" tabIndex={-1}
        onPlaying={()=>{setReady(true);current.current?.setRunning(!document.hidden);}} onError={()=>setFailed(true)}/>
      {!override && <canvas ref={canvas} className="entry-current" aria-hidden="true"/>}
    </>}
  </>;
}
