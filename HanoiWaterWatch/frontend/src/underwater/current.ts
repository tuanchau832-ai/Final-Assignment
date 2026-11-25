import { makeAtlas, CLOUD, SILT, RING, ROD } from './atlas';

const capacity = 96;
const trashPushDecay = 1.05;
const trashPushCooldownMs = 750;
const random = (low: number, high: number) => low + Math.random()*(high-low);
const vertex = `
attribute vec2 position;
attribute vec4 paint;
uniform vec2 viewport;
uniform float density;
varying vec3 ink;
void main(){
  gl_Position=vec4(position/viewport*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);
  gl_PointSize=paint.x*density;
  ink=paint.yzw;
}`;
const fragment = `
precision mediump float;
uniform sampler2D atlas;
varying vec3 ink;
void main(){
  float c=cos(ink.x),s=sin(ink.x);
  vec2 uv=mat2(c,-s,s,c)*(gl_PointCoord-.5)+.5;
  if(any(lessThan(uv,vec2(0.)))||any(greaterThan(uv,vec2(1.))))discard;
  vec2 tile=vec2(mod(ink.y,3.),floor(ink.y/3.));
  vec4 color=texture2D(atlas,(tile+uv)/3.);
  gl_FragColor=vec4(color.rgb,color.a*ink.z);
}`;

export function startCurrent(canvas: HTMLCanvasElement, surface: HTMLElement, fallback: ()=>void) {
  const gl=canvas.getContext('webgl',{alpha:true, antialias:false,depth:false,powerPreference:'low-power'});
  if(!gl) throw new Error('WebGL unavailable');
  const program=gl.createProgram()!;
  for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]] as const){
    const shader=gl.createShader(type)!;
    gl.shaderSource(shader,source); gl.compileShader(shader); gl.attachShader(program,shader); gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) {gl.deleteProgram(program); throw new Error('Shader unavailable');}
  gl.useProgram(program);
  const buffer=gl.createBuffer(), texture=gl.createTexture();
  const vertices=new Float32Array(capacity*6);
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,vertices.byteLength,gl.DYNAMIC_DRAW);
  for(const [name,size,offset] of [['position',2,0],['paint',4,8]] as const){
    const loc=gl.getAttribLocation(program,name);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,size,gl.FLOAT,false,24,offset);
  }
  gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,makeAtlas());
  for(const wrap of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D,wrap,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  const viewport=gl.getUniformLocation(program,'viewport'),density=gl.getUniformLocation(program,'density');
  const pool=Array.from({length:capacity},()=>({
    life:0,age:0,x:0,y:0,vx:0,vy:0,pushX:0,pushY:0,nextPushAt:0,size:0,spin:0,angle:0,kind:0,depth:0,
  }));
  let w=1,h=1,sourceX=0,sourceY=0,budget=capacity, nextObject=0,nextCloud=0;
  function resize(){
    w=canvas.clientWidth; h=canvas.clientHeight;
    const scale=Math.max(w/1280,h/720), dpr=Math.min(devicePixelRatio,1.5);
    sourceX=.153*1280*scale+(w-1280*scale)*.115;
    sourceY=.633*720*scale+(h-720*scale)*.5;
    canvas.width=Math.max(1,Math.round(w*dpr)); canvas.height=Math.max(1,Math.round(h*dpr));
    gl!.viewport(0,0,canvas.width,canvas.height); gl!.uniform2f(viewport,w,h); gl!.uniform1f(density,dpr);
    budget=w<640?54:capacity;
  }
  resize();
  const observer=new ResizeObserver(resize); observer.observe(canvas);
  function emit(kind:number,x=sourceX,y=sourceY){
    const p=pool.find(p=>p.life<=0);
    if(!p || (kind<SILT && pool.filter(p=>p.life>0).length>=budget-8)) return;
    const depth=random(.45,1);
    const sizeScale=kind<ROD ? 2.6 : 1.3;
    Object.assign(p,{kind,x,y,depth,age:0,pushX:0,pushY:0,nextPushAt:0,angle:random(-3,3),spin:random(-.42,.42),vx:random(44,84)*depth,vy:random(-12,19),
      life:kind<CLOUD?random(19,34):random(4,8),size:kind<CLOUD?random(38,66)*depth*sizeScale:random(24,45)});
    if(kind===SILT || kind===RING){
      p.life=random(.64,1.1); p.size=kind===RING?12:random(3,7);
      p.vx=kind===RING?0:random(-34,34); p.vy=kind===RING?0:random(-34,34);
    }
  }
  function step(dt:number){
    nextObject-=dt; nextCloud-=dt;
    if(nextObject<=0){emit(Math.floor(random(0,6))); nextObject=random(.65,1.55)*(capacity/budget);}
    if(nextCloud<=0){emit(CLOUD); nextCloud=random(.25,.48)*(capacity/budget);}
    const pushRetention=Math.exp(-dt*trashPushDecay);
    let count=0;
    for(const p of pool){
      if(p.life<=0) continue;
      p.age+=dt;
      const driftingObject=p.kind<CLOUD;
      const expired=driftingObject ? p.x>w+p.size : p.age>=p.life || p.x>w+120 || p.y>h+110 || p.y< -110;
      if(expired){p.life=0;continue;}
      if(p.kind<=CLOUD){
        const drag=1-Math.exp(-dt*.48);
        const baseFlow=25*p.depth;
        // For solid objects, life determines the pace across the viewport, not when to fade out.
        const flow=driftingObject ? Math.max(baseFlow,(w-sourceX+p.size)/p.life) : baseFlow;
        p.vx+=(flow+11*Math.sin(p.age*.6+p.angle)-p.vx)*drag;
        p.vy+=(-5+16*Math.sin(p.age*.54+6*p.depth)-p.vy)*drag;
      }
      p.x+=(p.vx+p.pushX)*dt; p.y+=(p.vy+p.pushY)*dt; p.angle+=p.spin*dt;
      p.pushX*=pushRetention; p.pushY*=pushRetention;
      if(driftingObject) p.y=Math.max(0,Math.min(h,p.y));
      let size=p.size,alpha=p.depth*.86;
      if(p.kind===CLOUD){size+=p.age*21; alpha=.32;}
      else if(p.kind===RING){size+=p.age*78; alpha=.58;}
      else if(p.kind>=ROD && p.kind<CLOUD) size*=1+.065*Math.sin(p.age*2.3);
      const fadeOut=driftingObject ? 1 : (1-p.age/p.life)*3;
      alpha*=Math.min(1,fadeOut,p.kind>=SILT?1:p.age*2);
      const offset=count++*6;
      vertices[offset]=p.x; vertices[offset+1]=p.y; vertices[offset+2]=size;
      vertices[offset+3]=p.angle; vertices[offset+4]=p.kind; vertices[offset+5]=alpha;
    }
    return count;
  }
  // Prime the same emitter so first paint shows a current already in motion.
  for(let i=0;i<360;i++) step(.1);
  let lastPointer: { id: number; x: number; y: number } | undefined;
  function resetPointer(){lastPointer=undefined;}
  function interact(e:PointerEvent){
    if (!surface.hasAttribute('data-current-running')) return;
    const previousPointer=lastPointer?.id===e.pointerId ? lastPointer : undefined;
    const movementX=previousPointer ? e.clientX-previousPointer.x : e.movementX;
    const movementY=previousPointer ? e.clientY-previousPointer.y : e.movementY;
    lastPointer={id:e.pointerId,x:e.clientX,y:e.clientY};
    if(e.type==='pointerdown') return;
    const pointerTravel=Math.hypot(movementX,movementY);
    if(e.type==='pointermove' && !pointerTravel) return;
    if ((e.target as Element)?.closest('a,button,input,label,.entry-card')) return;
    const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
    for(const p of pool){
      if(!p.life) continue;
      const dx=p.x-x,dy=p.y-y,dist=Math.hypot(dx,dy);
      if(e.type==='pointerup' && p.kind>=ROD && p.kind<CLOUD && dist<Math.max(16,p.size*.46)){
        p.life=0; emit(RING,x,y); for(let j=0;j<7;j++) emit(SILT,x,y); break;
      }
      if(e.type==='pointermove' && p.kind<ROD && e.timeStamp>=p.nextPushAt){
        const reach=Math.max(145,p.size*.5+80);
        if(dist>=reach) continue;
        const impulse=(1-dist/reach)*Math.min(220,150+pointerTravel*10);
        p.pushX=movementX/pointerTravel*impulse;
        p.pushY=movementY/pointerTravel*impulse;
        p.nextPushAt=e.timeStamp+trashPushCooldownMs;
      }
    }
  }
  surface.addEventListener('pointerdown',interact,{passive:true});
  surface.addEventListener('pointermove',interact,{passive:true});
  surface.addEventListener('pointerup',interact,{passive:true});
  surface.addEventListener('pointerleave',resetPointer);
  surface.addEventListener('pointercancel',resetPointer);
  canvas.addEventListener('webglcontextlost',fallback);
  let frame=0, previous=0, elapsed=0, frames=0, slow=0;
  function render(now:number){
    const dt=previous?(now-previous)/1000:1/60; previous=now;
    elapsed+=dt; frames++;
    if(elapsed>=2){
      slow=frames/elapsed<21?slow+1:0;
      if(slow) budget=Math.max(24,Math.floor(budget*.72));
      if(slow>=3){fallback();return;}
      elapsed=0; frames=0;
    }
    const count=step(Math.min(dt,.06));
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.bufferSubData(gl!.ARRAY_BUFFER,0,vertices.subarray(0,count*6));
    gl!.drawArrays(gl!.POINTS,0,count);
    frame=requestAnimationFrame(render);
  }
  function setRunning(active:boolean){
    cancelAnimationFrame(frame);
    previous=0; elapsed=0; frames=0;
    resetPointer();
    surface.toggleAttribute('data-current-running',active);
    if(active) frame=requestAnimationFrame(render);
  }
  return { setRunning, dispose: ()=>{
    setRunning(false); observer.disconnect();
    surface.removeEventListener('pointerdown',interact);
    surface.removeEventListener('pointermove',interact); surface.removeEventListener('pointerup',interact);
    surface.removeEventListener('pointerleave',resetPointer);
    surface.removeEventListener('pointercancel',resetPointer);
    canvas.removeEventListener('webglcontextlost',fallback);
    gl.deleteBuffer(buffer); gl.deleteTexture(texture); gl.deleteProgram(program);
  }};
}
