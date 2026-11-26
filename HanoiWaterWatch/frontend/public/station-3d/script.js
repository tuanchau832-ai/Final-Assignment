(function(){
/* ================= text ================= */
const T={
en:{eyebrow:"Hanoi WaterWatch · interactive 3D",title:'A station on a <em>polluted Hanoi river</em>',
rot:"Drag to rotate in any direction · scroll or pinch to zoom · right-drag to move",
sliderT:"Wastewater discharge",tLow:"Light",tMid:"Normal",tHigh:"Heavy",
play:"Play: how it works",pause:"Pause",spike:"Simulate a discharge",spin:"Auto-rotate",reset:"Reset",info:"Details",focus:"◎ Focus on station",
tStatus:"Status",tRun:"Over limit in a row",
hint:"Tap marker 1 (the screen) or 2 (the drain outlet). You can also tap the parts on the model.",
disclaimer:"Example values for the demonstration, not real measurements. The probe measures pH, dissolved oxygen, turbidity and temperature only; BOD, COD and heavy metals still need lab samples.",
SAFE:"SAFE",WATCH:"WATCH",EXCEEDED:"EXCEEDED",
phOkT:"No alerts near you",phOkM:"All readings at this outlet are within limits.",
phWT:"Watching outlet NH-03",phWM:"A reading is over the limit. The station is checking the next readings.",
phBT:"⚠ Red alert · drain outlet NH-03",phBM:"Untreated wastewater detected. Do not use the river water for crops or fish. The environment authority has been notified.",
defE:"Start here",defT:"Tap a part of the station",defP:"Two parts open more detail. The rest of the model shows where the station sits: on the railing of an embankment, above a drain that empties into a polluted city river.",
m1:"Screen",m2:"Drain outlet + probe",
scrE:"Part 1",scrT:"Display screen",scrP:"The screen shows the latest readings from the probe and compares each one with the QCVN limit. Move the discharge slider and watch the values change.",
lG:"Green: every reading is safe",lY:"Yellow: a reading is over the limit, checking again",lR:"Red: 3 readings in a row over the limit; the beacon flashes",
btns:"Buttons: TEST checks the sensors, SYNC sends stored data now, CAL is for calibration by technicians.",
howE:"Part 2",howT:"How the station works",howP:"Tap a step, or press Play to run through all five.",
steps:[
["Wastewater leaves the drain","Household and industrial wastewater flows through the underground drain and comes out here, before it mixes with the river. Measuring at the mouth shows which outlet the pollution comes from."],
["The probe measures","The probe hangs in the outflow and measures pH, dissolved oxygen (DO), turbidity and temperature every few minutes. A wiper brush keeps the sensors clean."],
["Readings travel up the cable","A sealed cable runs up the embankment wall to the white box on the railing post, above flood level."],
["The box checks the limits","The controller compares each reading with the QCVN limit and shows it on the screen. Only 3 readings in a row over the limit turn the light red."],
["The alert goes out","The 4G / LoRa antenna sends every reading to the cloud. When the light turns red, the beacon flashes, people nearby get a phone alert and the authority sees it on the map."]],
lab:{solar:"Solar panel + battery",ant:"4G / LoRa antenna",beacon:"Alert beacon",cable:"Probe cable",river:"Polluted city river (e.g. the Nhue)",homes:"Tube houses along the river"},
lcdFoot:"Limits: QCVN · example values",rowName:{ph:"pH",do:"Dissolved O₂",tu:"Turbidity",te:"Temperature"}},
vi:{eyebrow:"Hanoi WaterWatch · mô hình 3D tương tác",title:'Trạm quan trắc trên <em>sông ô nhiễm Hà Nội</em>',
rot:"Kéo để xoay mọi hướng · cuộn hoặc chụm hai ngón để phóng to · kéo chuột phải để di chuyển",
sliderT:"Lượng nước thải xả ra",tLow:"Ít",tMid:"Bình thường",tHigh:"Nhiều",
play:"Chạy: cách hoạt động",pause:"Tạm dừng",spike:"Mô phỏng xả thải",spin:"Tự xoay",reset:"Về ban đầu",info:"Chi tiết",focus:"◎ Quay về trạm",
tStatus:"Trạng thái",tRun:"Vượt ngưỡng liên tiếp",
hint:"Bấm điểm 1 (màn hình) hoặc 2 (miệng cống xả). Cũng có thể bấm thẳng vào bộ phận trên mô hình.",
disclaimer:"Số liệu minh hoạ để trình bày, không phải số đo thật. Đầu dò chỉ đo pH, oxy hoà tan, độ đục và nhiệt độ; BOD, COD và kim loại nặng vẫn cần lấy mẫu gửi phòng thí nghiệm.",
SAFE:"AN TOÀN",WATCH:"THEO DÕI",EXCEEDED:"VƯỢT NGƯỠNG",
phOkT:"Không có cảnh báo gần bạn",phOkM:"Mọi số đo tại cửa xả này đều trong ngưỡng.",
phWT:"Đang theo dõi cửa xả NH-03",phWM:"Có số đo vượt ngưỡng. Trạm đang kiểm tra các lần đo tiếp theo.",
phBT:"⚠ Báo động đỏ · cửa xả NH-03",phBM:"Phát hiện nước thải chưa xử lý. Không dùng nước sông để tưới rau hay nuôi cá. Cơ quan môi trường đã được báo.",
defE:"Bắt đầu",defT:"Bấm vào một bộ phận của trạm",defP:"Có hai chỗ bấm để xem chi tiết. Phần còn lại của mô hình cho thấy trạm đặt ở đâu: trên lan can bờ kè, ngay trên miệng cống đổ ra một con sông nội đô bị ô nhiễm.",
m1:"Màn hình",m2:"Cống xả + đầu dò",
scrE:"Bộ phận 1",scrT:"Màn hình",scrP:"Màn hình hiện số đo mới nhất từ đầu dò và so từng chỉ số với ngưỡng QCVN. Kéo thanh lượng xả thải để thấy số đo thay đổi.",
lG:"Xanh: mọi chỉ số an toàn",lY:"Vàng: có chỉ số vượt ngưỡng, đang đo lại",lR:"Đỏ: 3 lần đo liên tiếp vượt ngưỡng, đèn báo động nháy",
btns:"Nút bấm: TEST kiểm tra cảm biến, SYNC gửi ngay dữ liệu đang lưu, CAL để kỹ thuật viên hiệu chuẩn.",
howE:"Bộ phận 2",howT:"Trạm hoạt động như thế nào",howP:"Bấm vào từng bước, hoặc bấm Chạy để xem cả năm bước.",
steps:[
["Nước thải chảy ra từ cống","Nước thải sinh hoạt và công nghiệp chảy qua cống ngầm và đổ ra ở đây, trước khi hoà vào sông. Đo ngay tại miệng cống cho biết ô nhiễm đến từ cửa xả nào."],
["Đầu dò đo nước","Đầu dò treo trong dòng nước thải, đo pH, oxy hoà tan (DO), độ đục và nhiệt độ vài phút một lần. Chổi gạt giữ cho cảm biến sạch."],
["Số đo chạy lên theo cáp","Cáp kín nước chạy dọc tường kè lên hộp trắng gắn trên cột lan can, cao hơn mức ngập."],
["Hộp so với ngưỡng","Bộ điều khiển so từng số đo với ngưỡng QCVN và hiện lên màn hình. Chỉ khi 3 lần đo liên tiếp vượt ngưỡng thì đèn mới chuyển đỏ."],
["Gửi cảnh báo","Ăng-ten 4G / LoRa gửi mọi số đo lên hệ thống. Khi đèn đỏ, đèn báo động nháy, người dân gần đó nhận cảnh báo trên điện thoại và cơ quan quản lý thấy trên bản đồ."]],
lab:{solar:"Tấm pin mặt trời + pin sạc",ant:"Ăng-ten 4G / LoRa",beacon:"Đèn báo động",cable:"Cáp đầu dò",river:"Sông nội đô ô nhiễm (vd. sông Nhuệ)",homes:"Nhà ống ven sông"},
lcdFoot:"Ngưỡng: QCVN · số minh hoạ",rowName:{ph:"pH",do:"Oxy hoà tan",tu:"Độ đục",te:"Nhiệt độ"}}};
let L="en";try{const s=localStorage.getItem("ww-lang");if(s==="vi"||s==="en")L=s}catch(e){}
/* Language chosen in the WaterWatch app (added when embedding the model in the app) */
{const q=new URLSearchParams(location.search).get("lang");if(q==="vi"||q==="en")L=q}
const t=k=>T[L][k];

/* ================= three.js scene ================= */
const host=document.getElementById("gl"),stage=document.getElementById("stage");
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xC9D6DC);
scene.fog=new THREE.Fog(0xC9D6DC,30,75);
const camera=new THREE.PerspectiveCamera(40,1,0.05,200);
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=1.5;controls.maxDistance=30;
controls.minPolarAngle=0;controls.maxPolarAngle=Math.PI;controls.autoRotateSpeed=1.2;
const HOME={pos:new THREE.Vector3(7.6,5.2,-12.4),tgt:new THREE.Vector3(0.3,0.5,-1.6)};
camera.position.copy(HOME.pos);controls.target.copy(HOME.tgt);
scene.add(new THREE.HemisphereLight(0xffffff,0x8a8f80,0.95));
const sun=new THREE.DirectionalLight(0xfff4e0,.8);sun.position.set(-8,16,-10);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:1,far:60});scene.add(sun);

const mats={};const M=(c,o={})=>{const k=c+JSON.stringify(o);return mats[k]||(mats[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85,metalness:0},o)))};
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
function box(w,h,d,mat,x,y,z,parent,shadow=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;(parent||scene).add(m);return m}
function cyl(r,h,mat,x,y,z,parent,seg){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg||18),mat);m.position.set(x,y,z);m.castShadow=true;(parent||scene).add(m);return m}
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const WATER_Y=-2.0, NEAR=-0.4, FAR=-14.6;

// ----- ground both banks -----
box(90,4,30,M(0x8b7a66),0,-2.03,15);          // near land block
box(90,4,30,M(0x8b7a66),0,-2.03,FAR-15.2);     // far land block
box(90,1,16,M(0x2d3326),0,-4.5,-7.5,null,false); // river bed
// embankment walls
const wallMat=M(0xBAB5A7);
box(90,4,0.4,wallMat,0,-2,NEAR+0.2);box(90,0.12,0.62,M(0xD3CEC1),0,0.06,NEAR+0.25);
box(90,0.5,0.02,M(0x5f5a48),0,-1.85,NEAR-0.005,null,false);          // water-line stain
box(90,4,0.4,wallMat,0,-2,FAR-0.2);box(90,0.12,0.62,M(0xD3CEC1),0,0.06,FAR-0.25);
box(90,0.5,0.02,M(0x5f5a48),0,-1.85,FAR+0.005,null,false);
// near bank: walkway, road, sidewalk
box(90,0.05,3,M(0xC59D86),0,0.0,1.5);box(90,0.05,4,M(0x5E6266),0,-0.005,5);box(90,0.05,1.2,M(0xC59D86),0,0,7.6);
for(let x=-44;x<45;x+=2.4)box(1.2,0.01,0.12,M(0xE9E4D4),x,0.025,5,null,false);
// far bank
box(90,0.05,3,M(0xC59D86),0,0,FAR-1.5);box(90,0.05,4,M(0x5E6266),0,-0.005,FAR-5);box(90,0.05,1.2,M(0xC59D86),0,0,FAR-7.6);
for(let x=-44;x<45;x+=2.4)box(1.2,0.01,0.12,M(0xE9E4D4),x,0.025,FAR-5,null,false);
// railings
const railMat=M(0x56606A,{metalness:.4,roughness:.5});
[[0.05,1],[FAR-0.05,-1]].forEach(([z])=>{for(let x=-44;x<=44;x+=1.6){if(z>0&&Math.abs(x)<0.3)continue;box(0.07,1.05,0.07,railMat,x,0.53,z)}
  box(88,0.06,0.06,railMat,0,1.05,z);box(88,0.04,0.04,railMat,0,0.6,z)});

// ----- water + pollution -----
const water=new THREE.Mesh(new THREE.PlaneGeometry(90,14.2,60,12),new THREE.MeshStandardMaterial({color:0x48523F,roughness:.35,metalness:.15}));
water.rotation.x=-Math.PI/2;water.position.set(0,WATER_Y,-7.5);water.receiveShadow=true;scene.add(water);
const wPos=water.geometry.attributes.position;const wBase=Float32Array.from(wPos.array);
const foamMat=new THREE.MeshBasicMaterial({color:0xD9D4C0,transparent:true,opacity:.55,depthWrite:false});
const floaters=[];
for(let i=0;i<18;i++){const f=new THREE.Mesh(new THREE.CircleGeometry(0.3+rnd()*0.6,14),foamMat);f.rotation.x=-Math.PI/2;f.scale.y=0.5+rnd()*0.5;f.position.set(-14+rnd()*28,WATER_Y+0.02,-1.4-rnd()*12);scene.add(f);floaters.push(f)}
const trashCols=[0xE9ECEC,0x2F80C9,0xC0392B,0xF2C14E,0xF7F7F2,0x3a3a3a];
for(let i=0;i<70;i++){const c=trashCols[i%6];let m;
  if(i%3===0){m=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.28,8),M(c,{roughness:.4}));m.rotation.z=Math.PI/2}
  else m=new THREE.Mesh(new THREE.BoxGeometry(0.14+rnd()*0.25,0.04,0.1+rnd()*0.2),M(c));
  m.position.set(-16+rnd()*32,WATER_Y+0.03,-1.2-rnd()*12.8);m.rotation.y=rnd()*6;m.userData.ph=rnd()*6;scene.add(m);floaters.push(m)}
// plume of wastewater near the outlet
const plumeMat=new THREE.MeshBasicMaterial({color:0x1E1A12,transparent:true,opacity:.4,depthWrite:false});
const plumes=[];[[0,-1.6,1.2,1.5],[0.6,-2.9,1.8,2.2],[1.4,-4.6,2.4,2.4],[2.4,-6.4,2.6,2.2]].forEach(([x,z,sx,sz],i)=>{const p=new THREE.Mesh(new THREE.CircleGeometry(1,32),plumeMat);p.rotation.x=-Math.PI/2;p.scale.set(sx,sz,1);p.position.set(x,WATER_Y+0.012+i*0.002,z);scene.add(p);plumes.push(p)});

// ----- tube houses -----
const houseCols=[0xE8C35A,0xE9B8AE,0xA9CDB8,0xEFEDE6,0x9EC2D9,0xE7A266,0xF1DA8C,0xD9C7E6];
const signCols=[0xC0392B,0x2563A8,0x1F7A4D,0xD35400,0x8E2C5B];
const winMat=M(0x34444f,{roughness:.3,metalness:.2}),darkMat=M(0x2E3438),shutMat=M(0x8D9497),tankMat=M(0xD5DADE,{metalness:.6,roughness:.3});
const housesGroup=new THREE.Group();scene.add(housesGroup);
function street(z0,dir){ // dir=-1 front faces -z (near bank); +1 front faces +z (far bank)
  let x=-40;while(x<40){const w=2+rnd()*1.3,h=4+rnd()*5,d=6,col=houseCols[Math.floor(rnd()*8)];
    const cx=x+w/2,cz=z0-dir*d/2,fz=z0+dir*0.03;
    box(w-0.04,h,d,M(col),cx,h/2,cz,housesGroup);
    // ground floor shop
    box(w*0.86,0.5,0.06,M(signCols[Math.floor(rnd()*5)]),cx,2.6,fz+dir*0.02,housesGroup,false);
    box(w*0.8,2.2,0.04,shutMat,cx,1.1,fz,housesGroup,false);
    for(let fy=3.4;fy<h-0.6;fy+=3){
      box(w*0.6,1.5,0.05,winMat,cx,fy+0.9,fz,housesGroup,false);
      box(w*0.86,0.1,0.55,M(0xd8d4c8),cx,fy+0.2,z0+dir*0.28,housesGroup);
      box(w*0.86,0.55,0.03,darkMat,cx,fy+0.5,z0+dir*0.54,housesGroup,false);
      if(rnd()<.5)box(w*0.3,0.35,0.3,M(0x7FA35B),cx-w*0.25,fy+0.45,z0+dir*0.3,housesGroup);
    }
    if(rnd()<.6){const tk=cyl(0.3,0.9,tankMat,cx+(rnd()-.5)*w*.4,h+0.35,cz,housesGroup,14);tk.rotation.z=Math.PI/2}
    x+=w}}
street(8.2,-1);street(FAR-8.2,1);

// ----- trees, poles, wires, motorbikes -----
const leafA=M(0x4F7D42,{flatShading:true}),leafB=M(0x6E9E5A,{flatShading:true}),trunk=M(0x5B4636);
function tree(x,z){cyl(0.12,2.6,trunk,x,1.3,z);[[0,3.2,0,1.1,leafA],[0.6,3.0,0.3,0.8,leafB],[-0.5,3.4,-0.2,0.85,leafB],[0.1,3.9,0.1,0.75,leafA]].forEach(([dx,y,dz,r,m])=>{const s=new THREE.Mesh(new THREE.IcosahedronGeometry(r,0),m);s.position.set(x+dx,y,z+dz);s.castShadow=true;scene.add(s)})}
[-12,-6.5,6,12,18].forEach(x=>tree(x,1.9));[-15,-8,-1,7,14].forEach(x=>tree(x,FAR-1.9));
const poleMat2=M(0x8C8A82);
const poles=[-9,3.5,16];poles.forEach(x=>{cyl(0.13,8,poleMat2,x,4,2.7);box(1.2,0.12,0.12,M(0x6E6C64),x,7.6,2.7)});
const wireMat=new THREE.MeshBasicMaterial({color:0x222222});
for(let i=0;i<poles.length-1;i++)for(let k=0;k<6;k++){const a=V(poles[i],7.5-k*0.07,2.7+(k-3)*0.1),b=V(poles[i+1],7.5-k*0.05,2.7+(k-3)*0.1),m=a.clone().lerp(b,.5);m.y-=0.6+k*0.12;
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a,m,b),24,0.012,4,false),wireMat))}
const bikes=[];const wheelG=new THREE.TorusGeometry(0.2,0.06,8,16);
function bike(x,z,col,dirn){const g=new THREE.Group();[-0.45,0.45].forEach(dx=>{const w=new THREE.Mesh(wheelG,M(0x1b1b1b));w.position.set(dx,0.26,0);g.add(w)});
  box(1.1,0.3,0.32,M(col),0,0.55,0,g);box(0.3,0.6,0.34,M(0x3C4A6B),-0.05,1.05,0,g);const hd=new THREE.Mesh(new THREE.SphereGeometry(0.17,12,10),M(col===0xC0392B?0xF2C14E:0xE74C3C));hd.position.set(-0.02,1.5,0);g.add(hd);
  g.position.set(x,0,z);g.rotation.y=dirn>0?0:Math.PI;g.userData.v=dirn*(1.2+rnd());scene.add(g);bikes.push(g)}
bike(-6,4,0xC0392B,1);bike(4,3.9,0x2563A8,1);bike(10,6,0xE9E4D4,-1);bike(-14,6.1,0x1F7A4D,-1);bike(-2,FAR-4,0xD35400,-1);bike(8,FAR-6,0x2563A8,1);

// ----- drain outlet -----
const targets={};function tag(obj,id){obj.traverse(o=>{if(o.isMesh)o.userData.target=id});(targets[id]=targets[id]||[]).push(obj)}
const outletG=new THREE.Group();scene.add(outletG);
const PIPE_Y=-1.55;
const pipe=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.36,0.6,28,1,true),M(0x9C978A,{side:THREE.DoubleSide}));pipe.rotation.x=Math.PI/2;pipe.position.set(0,PIPE_Y,NEAR-0.25);outletG.add(pipe);
const rim=new THREE.Mesh(new THREE.TorusGeometry(0.37,0.06,10,28),M(0x8E897A));rim.position.set(0,PIPE_Y,NEAR-0.55);outletG.add(rim);
const mouth=new THREE.Mesh(new THREE.CircleGeometry(0.34,24),new THREE.MeshBasicMaterial({color:0x14120e}));mouth.position.set(0,PIPE_Y,NEAR-0.2);mouth.rotation.y=Math.PI;outletG.add(mouth);
box(0.8,0.4,0.02,M(0x3E4A2E),0,-1.9,NEAR-0.012,outletG,false); // moss streak
// discharge stream
const fallMat=new THREE.MeshBasicMaterial({color:0x2B2618,transparent:true,opacity:.9});
const fall=[];const fallG=new THREE.SphereGeometry(0.07,6,5);
for(let i=0;i<60;i++){const s=new THREE.Mesh(fallG,fallMat);s.userData={t:Math.random(),dx:(Math.random()-.5)*.4,v:0.8+Math.random()*0.4};outletG.add(s);fall.push(s)}
// probe
const probeG=new THREE.Group();probeG.position.set(0.42,-1.9,NEAR-0.72);outletG.add(probeG);
cyl(0.08,0.42,M(0xF2F4F6,{roughness:.4}),0,0,0,probeG);
const pcap=new THREE.Mesh(new THREE.SphereGeometry(0.08,14,8,0,Math.PI*2,0,Math.PI/2),M(0xF2F4F6));pcap.position.y=0.21;probeG.add(pcap);
box(0.17,0.02,0.17,M(0x1F3A5A),0,0.02,0,probeG);
[[-0.035,-0.035],[0.035,-0.035],[-0.035,0.035],[0.035,0.035]].forEach(([x,z])=>cyl(0.012,0.07,M(0x1d7fc4),x,-0.24,z,probeG,8));
const wiper=box(0.02,0.16,0.02,M(0x1F3A5A),0.09,-0.16,0,probeG);wiper.rotation.z=0.4;
const pulseMat=new THREE.MeshBasicMaterial({color:0xFFD447,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
const pulses=[0,1,2].map(i=>{const r=new THREE.Mesh(new THREE.RingGeometry(0.16,0.2,32),pulseMat.clone());r.rotation.x=-Math.PI/2;r.position.set(0.42,WATER_Y+0.03,NEAR-0.72);r.userData.t=i/3;scene.add(r);return r});
const outletHit=new THREE.Mesh(new THREE.SphereGeometry(0.75,10,8),new THREE.MeshBasicMaterial({visible:false}));outletHit.position.set(0.15,-1.7,NEAR-0.6);outletG.add(outletHit);
tag(outletG,"outlet");

// ----- the station (box hangs on the river side of the railing post) -----
const st=new THREE.Group();scene.add(st);
const metal=M(0x8C969F,{metalness:.5,roughness:.4});
cyl(0.07,3.5,metal,0,1.75,0.05,st);
const BZ=-0.33;
const boxG=new THREE.Group();st.add(boxG);
const whiteMat=M(0xF6F8FA,{roughness:.45});
box(0.9,1.04,0.38,whiteMat,0,2.0,BZ,boxG);
box(1.04,0.05,0.56,M(0xC3CCD3),0,2.55,BZ-0.05,boxG);
const scr=document.createElement("canvas");scr.width=512;scr.height=316;const sctx=scr.getContext("2d");
const scrTex=new THREE.CanvasTexture(scr);
const screen=new THREE.Mesh(new THREE.PlaneGeometry(0.8,0.5),new THREE.MeshBasicMaterial({map:scrTex}));screen.position.set(0,2.24,BZ-0.191);screen.rotation.y=Math.PI;boxG.add(screen);
const screenGlow=new THREE.Mesh(new THREE.PlaneGeometry(0.88,0.58),new THREE.MeshBasicMaterial({color:0xFFD447,transparent:true,opacity:0,depthWrite:false}));screenGlow.position.set(0,2.24,BZ-0.1905);screenGlow.rotation.y=Math.PI;boxG.add(screenGlow);
const led=c=>new THREE.Mesh(new THREE.CircleGeometry(0.035,16),new THREE.MeshBasicMaterial({color:c}));
const ledG=led(0x2f9e5a),ledY=led(0x6b5a1a),ledR=led(0x5a1a1a);
[[ledG,0.14],[ledY,0],[ledR,-0.14]].forEach(([l,x])=>{l.position.set(x,1.92,BZ-0.192);l.rotation.y=Math.PI;boxG.add(l)});
[-0.18,0,0.18].forEach(x=>box(0.13,0.07,0.02,M(0x3A434F),x,1.72,BZ-0.195,boxG));
box(0.2,0.08,0.24,M(0x55606a),0,1.68,-0.12,st);box(0.2,0.08,0.24,M(0x55606a),0,2.3,-0.12,st);
cyl(0.05,0.08,M(0x222222),0.12,1.47,BZ,boxG);
tag(boxG,"screen");
// beacon
const beaconMat=new THREE.MeshStandardMaterial({color:0xd63b3b,emissive:0x000000,roughness:.3});
cyl(0.08,0.07,M(0x55606a),-0.26,2.59,BZ,st);
const beacon=new THREE.Mesh(new THREE.SphereGeometry(0.085,16,10,0,Math.PI*2,0,Math.PI/2),beaconMat);beacon.position.set(-0.26,2.62,BZ);st.add(beacon);
// antenna
cyl(0.018,0.62,M(0x1b1f24),0.28,2.86,BZ,st,10);
const tip=new THREE.Mesh(new THREE.SphereGeometry(0.045,12,10),M(0x1b1f24));tip.position.set(0.28,3.18,BZ);st.add(tip);
const rings=[0,1,2].map(i=>{const r=new THREE.Mesh(new THREE.TorusGeometry(0.15,0.012,8,40),new THREE.MeshBasicMaterial({color:0x0E8FB0,transparent:true,opacity:0,depthWrite:false}));r.rotation.x=Math.PI/2;r.position.copy(tip.position);r.userData.t=i/3;scene.add(r);return r});
// solar panel facing the river
box(0.12,0.1,0.12,M(0x55606a),0,3.52,0.05,st);
const panelGrp=new THREE.Group();panelGrp.position.set(0,3.64,0.05);panelGrp.rotation.x=-0.5;st.add(panelGrp);
box(1.1,0.04,0.72,M(0xd9dee3),0,0,0,panelGrp);
box(1.06,0.012,0.68,M(0x2F5FB3,{roughness:.25,metalness:.3}),0,0.026,0,panelGrp);
for(let i=1;i<4;i++)box(0.008,0.006,0.68,M(0xdfe9f1),-0.53+i*0.265,0.036,0,panelGrp,false);
box(1.06,0.006,0.008,M(0xdfe9f1),0,0.036,0,panelGrp,false);
// cable: box -> down outside the railing -> down the wall -> probe
const cablePts=[V(0.12,1.43,BZ),V(0.12,0.4,BZ),V(0.15,0.14,NEAR-0.03),V(0.3,-0.2,NEAR-0.06),V(0.32,-1.1,NEAR-0.06),V(0.42,-1.4,NEAR-0.55),V(0.42,-1.67,NEAR-0.72)];
const cableCurve=new THREE.CatmullRomCurve3(cablePts,false,"catmullrom",0.2);
const cable=new THREE.Mesh(new THREE.TubeGeometry(cableCurve,90,0.022,8,false),M(0x1b1f24));cable.castShadow=true;scene.add(cable);
const packets=[0,1,2].map(i=>{const p=new THREE.Mesh(new THREE.SphereGeometry(0.06,12,10),new THREE.MeshBasicMaterial({color:0xFFD447}));p.visible=false;p.userData.t=i/3;scene.add(p);return p});

/* ================= readings ================= */
const LO={ph:7.3,do:6.0,tu:15,te:27.0},HI={ph:5.9,do:0.8,tu:110,te:30.5};
let cur={...LO},level=20,run=0,alertOn=false;
function status(k,v){if(k==="ph")return(v<6||v>8.5)?"bad":(v<6.5)?"watch":"ok";if(k==="do")return v<2?"bad":v<4?"watch":"ok";if(k==="tu")return v>60?"bad":v>40?"watch":"ok";return v>32?"bad":v>29.5?"watch":"ok"}
const UNIT={ph:"",do:"mg/L",tu:"NTU",te:"°C"};
const fmt=(k,v)=>k==="tu"?Math.round(v)+"":v.toFixed(1);
const word=(s,k)=>s==="ok"?"OK":s==="watch"?"WATCH":(k==="do"?"LOW":"HIGH");
const overBad=()=>Object.keys(cur).some(k=>status(k,cur[k])==="bad");
const stState=()=>alertOn?"bad":Object.keys(cur).some(k=>status(k,cur[k])!=="ok")?"watch":"ok";
function sample(){const f=level/100;Object.keys(cur).forEach(k=>{const g=LO[k]+(HI[k]-LO[k])*f;const j={ph:.04,do:.12,tu:2,te:.1}[k];cur[k]=g+(Math.random()-.5)*j})}
function drawScreen(){const c=sctx;c.fillStyle="#13283A";c.fillRect(0,0,512,316);
  c.font='700 38px "IBM Plex Mono",monospace';c.fillStyle="#9fcdf5";c.textAlign="left";c.fillText("NH-03",18,44);
  const col={ok:"#7ddc9c",watch:"#f3cf5f",bad:"#ff8c8c"},nm={ph:"pH",do:"DO",tu:"Turb.",te:"Temp"};
  Object.keys(cur).forEach((k,i)=>{const y=110+i*60,s=status(k,cur[k]);c.fillStyle="#ffffff";c.font='600 44px "IBM Plex Mono",monospace';c.textAlign="left";c.fillText(nm[k],18,y);c.textAlign="right";c.fillText(fmt(k,cur[k]),318,y);c.fillStyle=col[s];c.font='700 40px "IBM Plex Mono",monospace';c.fillText(word(s,k),498,y)});
  c.textAlign="left";scrTex.needsUpdate=true}
const $=id=>document.getElementById(id);
function render(){
  drawScreen();const s=stState();
  ledG.material.color.setHex(s==="ok"?0x5ee08a:0x1d4a2c);ledY.material.color.setHex(s==="watch"?0xffd34d:0x5a4a16);ledR.material.color.setHex(s==="bad"?0xff4a4a:0x4a1616);
  const pill=$("pill");pill.className="pill "+s;pill.textContent=t(s==="ok"?"SAFE":s==="watch"?"WATCH":"EXCEEDED");
  $("run").firstChild.nodeValue=Math.min(run,3);
  $("phone").classList.toggle("alert",alertOn);
  $("phT").textContent=t(s==="ok"?"phOkT":s==="watch"?"phWT":"phBT");$("phM").textContent=t(s==="ok"?"phOkM":s==="watch"?"phWM":"phBM");
  $("clock").textContent=new Date().toTimeString().slice(0,5);
  $("sval").textContent=level+"%";
  plumeMat.opacity=0.12+level/100*0.75;fallMat.opacity=0.35+level/100*0.6;
  water.material.color.setHex(level>60?0x3F4636:0x48523F);
  if(view==="screen")fillLcd();
}
function tickData(){sample();run=overBad()?run+1:0;alertOn=run>=3;render()}

/* ================= panel ================= */
let view="default",step=0,playing=null;
const pbody=$("pbody"),panel=$("panel");
function fillLcd(){const tb=$("lcdRows");if(!tb)return;
  tb.innerHTML=Object.keys(cur).map(k=>{const s=status(k,cur[k]);return `<tr><td>${T[L].rowName[k]}</td><td class="v">${fmt(k,cur[k])}</td><td class="u">${UNIT[k]}</td><td class="s s-${s}">${word(s,k)}</td></tr>`}).join("");
  $("lcdTime").textContent=new Date().toTimeString().slice(0,8)}
function showPanel(animate){
  $("hot1").classList.toggle("sel",view==="screen");$("hot2").classList.toggle("sel",view==="outlet");
  let num="?",eye=t("defE"),title=t("defT"),html="";
  if(view==="default"){html=`<p>${t("defP")}</p><div class="legend"><button id="go1"><b>1</b>${t("m1")}</button><button id="go2"><b>2</b>${t("m2")}</button></div>`}
  else if(view==="screen"){num="1";eye=t("scrE");title=t("scrT");
    html=`<div class="lcd"><div class="t"><span>STATION NH-03</span><span id="lcdTime"></span></div><table><tbody id="lcdRows"></tbody></table><div class="f">${t("lcdFoot")}</div></div>
    <p>${t("scrP")}</p><ul class="facts"><li><span class="dot" style="background:#5ee08a"></span><span>${t("lG")}</span></li><li><span class="dot" style="background:#ffd34d"></span><span>${t("lY")}</span></li><li><span class="dot" style="background:#ff4a4a"></span><span>${t("lR")}</span></li></ul><p class="note">${t("btns")}</p>`}
  else{num="2";eye=t("howE");title=t("howT");
    html=`<p class="note">${t("howP")}</p><ol class="steps">${T[L].steps.map((s,i)=>`<li><button data-step="${i+1}" aria-expanded="${i+1===step}"><span class="n">${i+1}</span><span>${s[0]}<span class="d">${s[1]}</span></span><span class="bar"></span></button></li>`).join("")}</ol>`}
  $("pNum").textContent=num;$("pEye").textContent=eye;$("pTitle").textContent=title;pbody.innerHTML=html;
  if(animate){pbody.classList.remove("pop");void pbody.offsetWidth;pbody.classList.add("pop")}
  if(view==="screen")fillLcd();
  if(view==="default"){$("go1").onclick=()=>select("screen");$("go2").onclick=()=>select("outlet")}
  pbody.querySelectorAll("[data-step]").forEach(b=>b.onclick=()=>{stopPlay();setStep(+b.dataset.step===step?0:+b.dataset.step)})}
function setStep(n){step=n;pbody.querySelectorAll("[data-step]").forEach(b=>b.setAttribute("aria-expanded",+b.dataset.step===n));
  if(n===1&&level<45){animateLevel(45)}
  if(n===4&&level<80&&playing){animateLevel(85)}
  const foc={1:[V(0.1,-1.6,-1.0),V(3.2,0.2,-5.6)],2:[V(0.4,-1.8,-1.1),V(2.4,-0.6,-4.2)],3:[V(0.25,0.2,-0.4),V(4.2,1.6,-5.4)],4:[V(0,2.15,-0.4),V(1.6,2.6,-3.2)],5:[V(0.1,2.2,-0.3),V(5.5,4.2,-7.2)]}[n];
  if(foc)flyTo(foc[1],foc[0])}
function select(v){stopPlay();view=v;step=v==="outlet"?1:0;showPanel(true);openSheet();
  if(v==="screen")flyTo(V(1.5,2.5,-3.4),V(0,2.1,-0.4));else if(v==="outlet")setStep(1);else flyTo(HOME.pos,HOME.tgt)}
function openSheet(){panel.classList.add("open")}
$("closeBtn").onclick=()=>panel.classList.remove("open");
$("infoBtn").onclick=()=>panel.classList.toggle("open");

/* ================= camera tween ================= */
let tween=null;
function flyTo(pos,tgt,ms=1100){if(matchMedia("(prefers-reduced-motion: reduce)").matches){camera.position.copy(pos);controls.target.copy(tgt);return}
  tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:pos.clone(),t1:tgt.clone(),s:performance.now(),ms}}

/* ================= buttons ================= */
const STEP_MS=9000;document.documentElement.style.setProperty("--ms",STEP_MS/1000+"s");
function stopPlay(){pbody.classList.remove("playing");if(playing){clearInterval(playing);playing=null;$("playBtn").textContent=t("play")}}
$("playBtn").onclick=()=>{if(playing){stopPlay();return}
  view="outlet";step=1;showPanel(true);openSheet();setStep(1);$("playBtn").textContent=t("pause");
  pbody.classList.add("playing");
  playing=setInterval(()=>{if(step>=5){stopPlay();return}setStep(step+1)},STEP_MS)};
function animateLevel(to){const from=level,t0=performance.now();const f=now=>{const k=Math.min(1,(now-t0)/900);level=Math.round(from+(to-from)*k);$("discharge").value=level;render();if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
$("spikeBtn").onclick=()=>animateLevel(85);
$("spinBtn").onclick=()=>{controls.autoRotate=!controls.autoRotate;$("spinBtn").setAttribute("aria-pressed",controls.autoRotate)};
$("resetBtn").onclick=()=>{stopPlay();level=20;run=0;alertOn=false;$("discharge").value=20;cur={...LO};view="default";step=0;controls.autoRotate=false;$("spinBtn").setAttribute("aria-pressed","false");showPanel(true);render();flyTo(HOME.pos,HOME.tgt)};
$("discharge").addEventListener("input",e=>{level=+e.target.value;render()});

/* ================= markers + tags ================= */
function mk(id,n,key){const b=document.createElement("button");b.className="hot";b.id=id;b.innerHTML=`${n}<span class="lbl"></span>`;b.dataset.key=key;stage.appendChild(b);return b}
const hot1=mk("hot1","1","m1"),hot2=mk("hot2","2","m2");
hot1.onclick=()=>select("screen");hot2.onclick=()=>select("outlet");
const anchors=[{el:hot1,p:V(-0.5,2.3,BZ-0.2)},{el:hot2,p:V(-0.55,-1.55,NEAR-0.6)}];
const tags=[["solar",V(0,3.95,0.05)],["ant",V(0.28,3.3,BZ)],["beacon",V(-0.26,2.76,BZ)],["cable",V(0.32,-0.6,NEAR-0.06)],["river",V(-5,WATER_Y,-7)],["homes",V(-6,8.5,FAR-8)]].map(([k,p])=>{const e=document.createElement("div");e.className="tag";e.dataset.k=k;stage.appendChild(e);return {el:e,p,k}});
const tmp=new THREE.Vector3();
function place(el,p,dx=0){tmp.copy(p).project(camera);const w=stage.clientWidth,h=stage.clientHeight;
  if(tmp.z>1||Math.abs(tmp.x)>1.05||Math.abs(tmp.y)>1.05){el.style.display="none";return}
  el.style.display="";el.style.transform=(el.classList.contains("tag")?"translate(-50%,-140%) ":"")+`translate(${(tmp.x*.5+.5)*w}px,${(-tmp.y*.5+.5)*h}px)`;
  if(!el.classList.contains("tag"))el.style.transform=`translate(${(tmp.x*.5+.5)*w}px,${(-tmp.y*.5+.5)*h}px)`;
  if(el.classList.contains("tag"))el.style.transform=`translate(${(tmp.x*.5+.5)*w}px,${(-tmp.y*.5+.5)*h}px) translate(-50%,-140%)`}

/* ================= picking ================= */
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let down=null,hover=null;
function pick(e){const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);
  const hits=ray.intersectObjects([...targets.screen,...targets.outlet],true);for(const h of hits){let o=h.object;while(o&&!o.userData.target)o=o.parent;if(o)return o.userData.target}return null}
renderer.domElement.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;const id=pick(e);if(id!==hover){hover=id;renderer.domElement.style.cursor=id?"pointer":"grab";whiteMat.emissive.setHex(id==="screen"?0x3a3200:0x000000)}});
renderer.domElement.addEventListener("pointerdown",e=>{down={x:e.clientX,y:e.clientY}});
renderer.domElement.addEventListener("pointerup",e=>{if(!down)return;const mv=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(mv>6)return;const id=pick(e);if(id)select(id)});
controls.addEventListener("start",()=>{tween=null});

const TMIN=V(-18,-3.5,-22),TMAX=V(18,8,14),FOCUS_T=V(0.2,0.6,-1.2);
const focusBtn=$("focusBtn");focusBtn.onclick=()=>{controls.autoRotate=false;$("spinBtn").setAttribute("aria-pressed","false");flyTo(HOME.pos,HOME.tgt)};
/* ================= language ================= */
function applyLang(){document.documentElement.lang=L;
  document.querySelectorAll("[data-i]").forEach(el=>{const v=T[L][el.dataset.i];if(el.hasAttribute("data-html"))el.innerHTML=v;else el.textContent=v});
  $("lang-en").setAttribute("aria-pressed",L==="en");$("lang-vi").setAttribute("aria-pressed",L==="vi");
  if(playing)$("playBtn").textContent=t("pause");
  [hot1,hot2].forEach(b=>b.querySelector(".lbl").textContent=t(b.dataset.key));
  tags.forEach(g=>g.el.textContent=T[L].lab[g.k]);
  showPanel(false);if(view==="outlet")setStepSilent();render()}
function setStepSilent(){pbody.querySelectorAll("[data-step]").forEach(b=>b.setAttribute("aria-expanded",+b.dataset.step===step))}
function saveL(){try{localStorage.setItem("ww-lang",L)}catch(e){}}
$("lang-en").onclick=()=>{L="en";saveL();applyLang()};$("lang-vi").onclick=()=>{L="vi";saveL();applyLang()};

/* ================= loop ================= */
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w<640?52:40;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(stage);resize();
const clock=new THREE.Clock();const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
function loop(){const dt=Math.min(clock.getDelta(),.05),T0=clock.elapsedTime;
  if(tween){const k=Math.min(1,(performance.now()-tween.s)/tween.ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;camera.position.lerpVectors(tween.p0,tween.p1,e);controls.target.lerpVectors(tween.t0,tween.t1,e);if(k>=1)tween=null}
  controls.target.clamp(TMIN,TMAX);controls.update();
  {const far=camera.position.distanceTo(FOCUS_T)>16||controls.target.distanceTo(FOCUS_T)>5;focusBtn.classList.toggle("far",far)}
  {const w=stage.clientWidth,h=stage.clientHeight,sh=innerWidth<=820&&panel.classList.contains("open");const oy=sh?h*0.27:0;if(camera.view?camera.view.offsetY!==oy||camera.view.fullHeight!==h||camera.view.fullWidth!==w:oy){camera.setViewOffset(w,h,0,oy,w,h)}}
  if(!reduce){
    for(let i=0;i<wPos.count;i++){const x=wBase[i*3],y=wBase[i*3+1];wPos.array[i*3+2]=Math.sin(x*.6+T0*1.1)*.03+Math.cos(y*.8+T0*.8)*.025}wPos.needsUpdate=true;
    floaters.forEach(f=>{f.position.x+=dt*0.12;if(f.position.x>18)f.position.x=-18;if(f.userData.ph!==undefined)f.position.y=WATER_Y+0.03+Math.sin(T0*1.5+f.userData.ph)*0.02});
    bikes.forEach(b=>{b.position.x+=b.userData.v*dt;if(b.position.x>30)b.position.x=-30;if(b.position.x<-30)b.position.x=30});
    const n=Math.round(10+level/100*50);
    fall.forEach((s,i)=>{s.visible=i<n;s.userData.t+=dt*s.userData.v;if(s.userData.t>1)s.userData.t-=1;const u=s.userData.t;s.position.set(s.userData.dx*u,PIPE_Y-0.2-u*u*0.3,NEAR-0.55-u*0.9)});
  }
  // step effects
  const on2=view==="outlet"&&step===2,on3=view==="outlet"&&step===3,on4=view==="outlet"&&step===4,on5=(view==="outlet"&&step===5)||alertOn;
  pulses.forEach(p=>{p.userData.t=(p.userData.t+dt*.6)%1;const s=1+p.userData.t*3;p.scale.set(s,s,1);p.material.opacity=on2?(1-p.userData.t)*.9:0});
  packets.forEach(p=>{p.visible=on3;if(on3){p.userData.t=(p.userData.t+dt*.45)%1;p.position.copy(cableCurve.getPoint(1-p.userData.t))}});
  screenGlow.material.opacity=on4?.35+Math.sin(T0*6)*.25:0;
  rings.forEach(r=>{r.userData.t=(r.userData.t+dt*.7)%1;const s=1+r.userData.t*4;r.scale.set(s,s,s);r.material.opacity=on5?(1-r.userData.t)*.85:0});
  beaconMat.emissive.setHex(alertOn&&Math.sin(T0*9)>0?0xff2a2a:0x000000);
  $("phone").classList.toggle("flash",view==="outlet"&&step===5);
  anchors.forEach(a=>place(a.el,a.p));tags.forEach(g=>place(g.el,g.p));
  renderer.render(scene,camera);requestAnimationFrame(loop)}
sample();applyLang();setInterval(tickData,2000);loop();
})();
