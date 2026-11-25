export const BOTTLE=0, BAG=1, WRAPPER=2, ROD=3, CELL=4, SPIRAL=5, CLOUD=6, SILT=7, RING=8;

// Nine translucent sprite paintings share one texture and one draw call.
export function makeAtlas() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 288;
  const c = canvas.getContext('2d')!;
  for (let i=0; i<9; i++) {
    c.save();
    c.translate((i%3+.5)*96,(Math.floor(i/3)+.5)*96);
    const sheen = c.createLinearGradient(-22,0,20,6);
    sheen.addColorStop(0,'#819f9690'); sheen.addColorStop(.35,'#d2e9dfcc');
    sheen.addColorStop(.64,'#597c738d'); sheen.addColorStop(1,'#bfd9c9c0');
    c.fillStyle=sheen; c.strokeStyle='#cee1cebd'; c.lineWidth=1.6;
    const paint=(d:string)=>{const p=new Path2D(d); c.fill(p); c.stroke(p);};
    const line=(d:string)=>c.stroke(new Path2D(d));
    if(i===BOTTLE) {
      paint('M-6 -32H6V-23Q7 -19 13 -15Q18 -11 15 -1L13 8L16 16V27Q14 34 7 32Q1 36 -6 32Q-15 34 -15 27L-13 14L-16 4V-10Q-15 -16 -9 -19L-6 -24Z');
      c.fillStyle='#617e80'; c.fillRect(-7,-36,14,7);
      c.fillStyle='#749796bd'; c.fillRect(-14,0,28,10);
      line('M-12 16Q0 20 13 16M-12 22Q0 26 13 22M-10 -10L-11 -2');
    } else if(i===BAG) {
      paint('M-29 20Q-20 4 -21 -18L-16 -34L-8 -31Q-16 -10 -4 -13Q7 -10 13 -29L19 -31L20 -14Q17 -6 26 5L31 25Q20 19 11 28Q-1 35 -12 26Z');
      line('M-16 -12Q-14 6 1 22M15 -15Q5 1 11 19M-12 24L-3 18');
    } else if(i===WRAPPER) {
      c.fillStyle='#ac9b79c9';
      paint('M-32 -15L-24 -12L-19 -16L-9 -12L12 -14L26 -18L32 -12L28 -4L32 9L25 15L17 11L5 15L-7 12L-27 19L-23 10L-31 6Z');
      line('M-22 -10L-18 10M-14 -7L3 6L20 -5M23 -9L22 9');
    } else if(i===ROD || i===CELL) {
      const rx=i===ROD?30:21, ry=i===ROD?12:21;
      c.fillStyle='#95bca67d';
      c.beginPath(); c.ellipse(0,0,rx,ry,0,0,Math.PI*2); c.fill(); c.stroke();
      for(let j=0;j<21;j++) {
        const a=j*Math.PI*2/21,x=Math.cos(a),y=Math.sin(a);
        c.beginPath(); c.moveTo(rx*x,ry*y); c.quadraticCurveTo((rx+5)*x,(ry+4)*y,(rx+7)*x-y*3,(ry+7)*y+x*3); c.stroke();
      }
      for(let j=0;j<7;j++){c.beginPath(); c.arc(Math.cos(j*2.1)*rx*.55,Math.sin(j*4)*ry*.52,2.4,0,Math.PI*2); c.fill();}
    } else if(i===SPIRAL) {
      c.lineWidth=7; line('M-30 12C-19 -32 -7 36 3 0S19 19 31 -14');
      c.lineWidth=2; c.strokeStyle='#799880'; line('M-30 12C-19 -32 -7 36 3 0S19 19 31 -14');
    } else if(i===RING) {
      c.beginPath(); c.arc(0,0,43,0,Math.PI*2); c.stroke();
    } else {
      const color=i===CLOUD?'112,104,73':'215,225,196';
      const fog=c.createRadialGradient(0,0,0,0,0,46);
      fog.addColorStop(0,'rgba('+color+',.86)'); fog.addColorStop(.45,'rgba('+color+',.4)'); fog.addColorStop(1,'rgba('+color+',0)');
      c.fillStyle=fog; c.fillRect(-46,-46,92,92);
    }
    c.restore();
  }
  return canvas;
}