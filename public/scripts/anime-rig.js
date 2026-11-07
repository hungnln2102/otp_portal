(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AnimeRig=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const TAU=Math.PI*2,RAD=Math.PI/180;
const groups=[['background','Nền trời'],['clouds','Mây'],['tower','Tháp đồng hồ'],['clock','Ba kim đồng hồ'],['city','Thành phố'],['characters','Cặp nhân vật nguyên vẹn'],['lanterns','Đèn & sao treo'],['ribbons','Dải lụa'],['branches','Cành hoa & cánh hoa'],['balcony','Lan can tiền cảnh'],['fireworks','Pháo hoa'],['lights','Ánh sáng & bụi sao']];
const definition={version:2,type:'static-characters-animated-environment',characters:{x:-35,y:300,width:550,height:825},meshSegments:12};
function rand(n){const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)}
function mod(n,m){return ((n%m)+m)%m}
function ease(x){return x*x*(3-2*x)}
class Scene{
 constructor(images,manifest){this.images=images;this.manifest=manifest;this.rig=manifest.rig||definition;this.width=1600;this.height=900;this.enabled=Object.fromEntries(groups.map(([id])=>[id,true]));this.amount=.65;this.wind=.65;this.mx=0;this.my=0;this.gust=0;this.assets={props:{}};for(const[key,v]of Object.entries(manifest.props))this.assets.props[key]=images[v.file];}
 light(c,x,y,r,alpha,color='255,216,160'){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(.35,`rgba(${color},${alpha*.3})`);g.addColorStop(1,`rgba(${color},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
 image(c,img,x,y,w,h,a=1){if(!img)return;c.save();c.globalAlpha*=a;c.drawImage(img,x,y,w,h);c.restore()}
 triangle(c,img,uv,p){const [s0,s1,s2]=uv,[p0,p1,p2]=p,du1=s1.x-s0.x,dv1=s1.y-s0.y,du2=s2.x-s0.x,dv2=s2.y-s0.y,det=du1*dv2-du2*dv1;if(Math.abs(det)<.01)return;const a=((p1.x-p0.x)*dv2-(p2.x-p0.x)*dv1)/det,b=((p1.y-p0.y)*dv2-(p2.y-p0.y)*dv1)/det,cc=((p2.x-p0.x)*du1-(p1.x-p0.x)*du2)/det,d=((p2.y-p0.y)*du1-(p1.y-p0.y)*du2)/det,e=p0.x-a*s0.x-cc*s0.y,f=p0.y-b*s0.x-d*s0.y;
 c.save();const center={x:(p0.x+p1.x+p2.x)/3,y:(p0.y+p1.y+p2.y)/3};c.beginPath();for(let i=0;i<3;i++){const pp=p[i],dx=pp.x-center.x,dy=pp.y-center.y,len=Math.hypot(dx,dy)||1;const x=pp.x+dx/len*.45,y=pp.y+dy/len*.45;if(i)c.lineTo(x,y);else c.moveTo(x,y)}c.closePath();c.clip();c.transform(a,b,cc,d,e,f);c.drawImage(img,0,0);c.restore();}
 mesh(c,img,x,y,w,h,axis,t,amplitude,phase=0){if(!img)return;const n=this.rig.meshSegments;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n;const wave=u=>amplitude*u*u*(Math.sin(t*1.15-u*2.1+phase)*.72+Math.sin(t*.67-u*1.2+phase)*.28);let p,uv;if(axis==='x'){p=[{x:x+w*u0,y:y+wave(u0)},{x:x+w*u1,y:y+wave(u1)},{x:x+w*u1,y:y+h+wave(u1)},{x:x+w*u0,y:y+h+wave(u0)}];uv=[{x:img.width*u0,y:0},{x:img.width*u1,y:0},{x:img.width*u1,y:img.height},{x:img.width*u0,y:img.height}]}else{p=[{x:x+wave(u0),y:y+h*u0},{x:x+w+wave(u0),y:y+h*u0},{x:x+w+wave(u1),y:y+h*u1},{x:x+wave(u1),y:y+h*u1}];uv=[{x:0,y:img.height*u0},{x:img.width,y:img.height*u0},{x:img.width,y:img.height*u1},{x:0,y:img.height*u1}]}
 this.triangle(c,img,[uv[0],uv[1],uv[2]],[p[0],p[1],p[2]]);this.triangle(c,img,[uv[0],uv[2],uv[3]],[p[0],p[2],p[3]])}}
 clock(c,t){const x=-108,y=-82,w=600,h=900,cx=x+505/1024*w,cy=y+583/1536*h,r=119/1024*w;const seconds=50+t,minute=59+seconds/60,hour=11+minute/60;const hands=[[hour/12*TAU, r*.48,4,'#77513c'],[minute/60*TAU,r*.72,2.9,'#60403b'],[seconds/60*TAU,r*.84,.9,'#c77c4c']];for(const[a,len,thick,color]of hands){c.save();c.translate(cx,cy);c.rotate(a);c.lineCap='round';c.strokeStyle=color;c.lineWidth=thick;c.beginPath();c.moveTo(0,5);c.lineTo(0,-len);c.stroke();c.restore()}c.fillStyle='#b0824b';c.beginPath();c.arc(cx,cy,4,0,TAU);c.fill()}
 // Analytic particle paths: deterministic at any frame rate, pause and video seek.
 fireworks(c,t){
  const strength=.55+this.amount*.45;
  const shells=[{start:.25,x:1335,y:285,size:185,type:0,color:'255,198,105'}, {start:4.2,x:1195,y:250,size:145,type:1,color:'240,179,219'}, {start:8.2,x:1390,y:270,size:185,type:2,color:'255,213,139'}];
  c.save();c.globalCompositeOperation='lighter';c.lineCap='round';
  for(let k=0;k<shells.length;k++){
   const sh=shells[k],age=mod(t-sh.start,14),rise=1.45,u=age-rise,seed=k*917+17;
   // A slowing comet, shedding a thin, curved golden wake.
   if(age<rise){
    const point=q=>{const f=1-Math.pow(1-q/rise,1.7);return{x:sh.x-28*(1-f)+Math.sin(q*2)*2,y:760+(sh.y-760)*f}};
    for(let n=22;n>=0;n--){const q=age-n*.014;if(q<0)continue;const p=point(q),f=(1-n/23);c.globalAlpha=f*f*.8*strength;c.fillStyle=n<3?'#fff6dc':'#ffad49';c.beginPath();c.arc(p.x,p.y,.5+f*1.1,0,TAU);c.fill()}
    const p=point(age);this.light(c,p.x,p.y,15,.22*strength);continue;
   }
   if(u>6.5)continue;
   // Brief white-hot ignition, followed by a much softer light wash.
   if(u<.28){this.light(c,sh.x,sh.y,75+u*160,Math.exp(-u*22)*.75*strength);this.light(c,sh.x,sh.y,280,Math.exp(-u*12)*.065*strength,sh.color)}
   const count=sh.type===2?340:280;
   for(let j=0;j<count;j++){
    const r=rand(seed+j*3),r2=rand(seed+j*3+1),r3=rand(seed+j*3+2);
    // Project a spherical shell; depth, speed and lifetime are deliberately unequal.
    const z=1-2*(j+.5)/count,angle=j*2.399963229728653+(r-.5)*.25;
    const sphere=Math.sqrt(1-z*z),speed=sh.size*(.84+r*.25),vx=Math.cos(angle)*sphere*speed,vy=z*speed;
    const drag=sh.type===2?.52:.85,gravity=sh.type===2?29:24,life=(sh.type===2?4.5:2.5)+r2*1.4;
    if(u>life+.8)continue;
    const pos=q=>{const f=(1-Math.exp(-drag*q))/drag;return{x:sh.x+vx*f+q*q*1.7,y:sh.y+vy*f+gravity*(q-f)/drag}};
    const fade=Math.pow(Math.max(0,1-u/life),.65),flicker=u<life*.65?1:.5+.5*Math.pow(Math.sin(u*24+j*7),2);
    const alpha=fade*flicker*strength;
    if(alpha>.008){
     const tail=Math.min(u,sh.type===2?1.5:1.05),steps=10;
     // Continuous tapered trails, with a faint bloom under a fine luminous core.
     for(let n=steps-1;n>=0;n--){const q=u-tail*n/steps,prev=Math.max(0,q-tail/steps),p=pos(q),o=pos(prev),f=1-n/steps;
      c.globalAlpha=alpha*f*f*.22;c.strokeStyle=`rgb(${sh.color})`;c.lineWidth=3.6;c.beginPath();c.moveTo(o.x,o.y);c.lineTo(p.x,p.y);c.stroke();
      c.globalAlpha=alpha*f*f;c.lineWidth=.55+r3*.55;c.beginPath();c.moveTo(o.x,o.y);c.lineTo(p.x,p.y);c.stroke();
     }
     const p=pos(u);c.globalAlpha=alpha;c.fillStyle=u<.18?'#ffffff':'#fff1cb';c.fillRect(p.x-.65,p.y-.65,1.3,1.3);
    }
    // Secondary embers detach along each trajectory and fall independently.
    if(j%2===0)for(let n=0;n<13;n++){
     const emitted=.12+n*.23+r3*.2,dt=u-emitted,emberLife=.4+rand(j+n+seed)*.8;
     if(dt<0||dt>emberLife||emitted>life*.8)continue;
     const p=pos(emitted),v=Math.exp(-drag*emitted)*.15,dx=vx*v,dy=vy*v,ef=Math.pow(1-dt/emberLife,1.6),ex=p.x+dx*dt+(r-.5)*10*dt,ey=p.y+dy*dt+22*dt*dt;
     c.globalAlpha=ef*.9*strength;c.strokeStyle='#ffcf85';c.lineWidth=.5;c.beginPath();c.moveTo(ex-dx*.035,ey-(dy+44*dt)*.035);c.lineTo(ex,ey);c.stroke();
    }
   }
  }
  c.restore();
 }

 render(c,t){const I=this.amount,P=this.assets.props;this.gust=Math.max(0,this.gust);c.save();c.clearRect(0,0,1600,900);c.fillStyle='#211a40';c.fillRect(0,0,1600,900);
 if(this.enabled.background)this.image(c,this.images['background.png'],0,0,1600,900);
 if(this.enabled.lights){for(let i=0;i<60;i++){const x=rand(i+31)*1600,y=rand(i+77)*480;c.globalAlpha=(.12+Math.sin(t*.65+i)*.08)*I;c.fillStyle='#fbe1ba';c.beginPath();c.arc(x,y,.5+rand(i+5)*.8,0,TAU);c.fill()}c.globalAlpha=1}
 if(this.enabled.clouds){this.image(c,P.cloud,100+Math.sin(t*.13)*7*I,170,410,110,.3);this.image(c,P.cloud,970+Math.sin(t*.11+2)*9*I,270,460,130,.4);this.image(c,P.cloud,500+Math.sin(t*.09+4)*6*I,720,650,170,.3)}
 c.save();c.translate(this.mx*1.3*I,this.my*.5*I);if(this.enabled.tower)this.image(c,this.images['tower.png'],-108,-82,600,900);if(this.enabled.tower&&this.enabled.clock)this.clock(c,t);c.restore();
 if(this.enabled.fireworks)this.fireworks(c,t);
 if(this.enabled.city){c.save();c.translate(-this.mx*2*I,0);this.image(c,this.images['skyline.png'],770,410,900,450);c.restore();if(this.enabled.lights){this.light(c,1410,620,95,(.022+Math.sin(t*.7)*.007)*I);this.light(c,1120,738,110,(.021+Math.sin(t*.8+2)*.006)*I)}}
 if(this.enabled.ribbons){this.mesh(c,P.ribbon,-45,340,340,130,'x',t,9*this.wind*(1+this.gust),1);this.mesh(c,P.ribbon,1190,95,370,140,'x',t,7*this.wind*(1+this.gust),2)}
 if(this.enabled.lanterns){for(const [x,y,w,h,phase]of [[1220,-30,98,300,1],[1475,18,73,225,3]]){c.save();c.translate(x,y);c.rotate(Math.sin(t*.72+phase)*.025*this.wind*(1+this.gust*.5));this.image(c,P.lantern,-w/2,0,w,h);if(this.enabled.lights)this.light(c,0,h*.72,w*.8,(.05+Math.sin(t*.9+phase)*.012)*I);c.restore()}c.save();c.translate(1110,-35);c.rotate(Math.sin(t*.63+3)*.02*this.wind);this.image(c,P.star,-34,0,68,250);c.restore()}
 if(this.enabled.characters){const p=this.rig.characters;this.image(c,this.images[this.manifest.characterImage],p.x,p.y,p.width,p.height);}
 if(this.enabled.balcony){this.image(c,P.balcony,-40,795,625,180);this.image(c,P.balcony,1260,810,410,150)}
 if(this.enabled.branches){c.save();c.translate(-30,835);c.rotate(-.16+Math.sin(t*.65)*.009*this.wind*(1+this.gust));this.image(c,P.branch,0,-140,370,330);c.restore();c.save();c.translate(1600,900);c.scale(-1,1);c.rotate(.06+Math.sin(t*.58+1)*.007*this.wind);this.image(c,P.branch,-20,-190,330,300);c.restore();for(let i=0;i<14;i++){const p=mod(rand(i+121)+t*.025,1),x=mod(rand(i+19)*1600+p*100,1600),y=p*1050-90;if(x>570&&x<1050&&y>150&&y<760)continue;c.save();c.translate(x,y);c.rotate(t*.35+i);c.globalAlpha=.45*I;c.fillStyle=i%2?'#d7adc8':'#f2d6df';c.beginPath();c.ellipse(0,0,3+rand(i)*2,1.8,0,0,TAU);c.fill();c.restore()}}
 if(this.enabled.lights)for(let i=0;i<35;i++){const p=mod(rand(i+278)+t*.019,1),x=rand(i+287)*1600+Math.sin(t*.3+i)*12,y=900-p*950;if(x>570&&x<1050&&y>200&&y<800)continue;this.light(c,x,y,3+rand(i+5)*2,Math.sin(p*Math.PI)*I*.22)}
 c.restore();}
}
async function loadImages(manifest,loader){const paths=new Set(['background.png','tower.png','skyline.png',manifest.characterImage]);for(const v of Object.values(manifest.props))paths.add(v.file);const entries=await Promise.all([...paths].map(async p=>[p,await loader(p)]));return Object.fromEntries(entries)}
return{Scene,groups,loadImages,definition};});
