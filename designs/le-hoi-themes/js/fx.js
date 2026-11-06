/* Hạt chuyển động trên canvas: kích thước/độ sâu ngẫu nhiên, gió đổi hướng theo thời gian, lật cánh hoa, dơi vỗ cánh. */
(function(){
  var cv=document.getElementById("fx"),g=cv.getContext("2d"),W=0,H=0,D=1,P=[],cfg=null,T=0,L=performance.now(),raf=0;
  var calm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  function spr(w,h,f){var s=document.createElement("canvas");s.width=w;s.height=h;f(s.getContext("2d"));return s}
  function dot(rgb){return spr(48,48,function(c){var r=c.createRadialGradient(24,24,0,24,24,24);r.addColorStop(0,"rgba("+rgb+",1)");r.addColorStop(.3,"rgba("+rgb+",.6)");r.addColorStop(1,"rgba("+rgb+",0)");c.fillStyle=r;c.fillRect(0,0,48,48)})}
  function petal(a,b,notch){return spr(40,44,function(c){var r=c.createLinearGradient(4,0,36,44);r.addColorStop(0,a);r.addColorStop(1,b);c.fillStyle=r;c.beginPath();c.moveTo(20,42);c.bezierCurveTo(0,30,0,8,13,3);
    if(notch)c.lineTo(20,10);else c.quadraticCurveTo(20,0,27,3);c.lineTo(27,3);c.bezierCurveTo(40,8,40,30,20,42);c.fill()})}
  var CFG={
    "tet":{t:"fall",n:36,s:function(){return petal("#ffe35a","#f0a000")},sz:[11,24],v:[26,62],sw:34,spin:1},
    "nguyen-tieu":{t:"rise",n:26,s:function(){return dot("255,205,120")},sz:[10,38],v:[10,30],sw:22,glow:1},
    "gio-to":{t:"rise",n:34,s:function(){return dot("240,190,90")},sz:[5,16],v:[8,22],sw:14,glow:1},
    "trung-thu":{t:"float",n:34,s:function(){return dot("255,232,130")},sz:[8,22]},
    "halloween":{t:"bat",n:7},
    "phu-nu":{t:"fall",n:36,s:function(){return petal("#ffe1ee","#ff8fb8",1)},sz:[13,28],v:[24,54],sw:42,spin:1},
    "giang-sinh":{t:"fall",n:120,s:function(){return dot("255,255,255")},sz:[4,15],v:[20,68],sw:24}
  };
  function mk(first){var z=Math.random(),c=cfg,s=c.sz[0]+(c.sz[1]-c.sz[0])*z*z;
    return{x:Math.random()*W,y:first?Math.random()*H:(c.t==="rise"?H+40:-40),s:s,z:z,v:c.v?c.v[0]+(c.v[1]-c.v[0])*z:0,f:.5+Math.random()*1.3,ph:Math.random()*6.28,a:Math.random()*6.28,w:(Math.random()-.5)*2.4,fl:Math.random()*6.28,al:.4+.6*z}}
  function mkBat(){var d=Math.random()<.5?1:-1;return{x:d>0?-60:W+60,y0:H*(.12+Math.random()*.4),dir:d,s:.55+Math.random()*.8,v:50+Math.random()*60,ph:Math.random()*6.28,x0:0}}
  function size(){D=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;g.setTransform(D,0,0,D,0,0)}
  function bat(b){var f=Math.sin(T*13+b.ph);g.save();g.translate(b.x,b.y);g.scale(b.dir*b.s,b.s);g.fillStyle="#0c0512";g.beginPath();g.ellipse(0,0,4,6,0,0,6.3);g.fill();
    g.beginPath();g.moveTo(-3,-5);g.lineTo(-2,-10);g.lineTo(0,-6);g.lineTo(2,-10);g.lineTo(3,-5);g.fill();
    [1,-1].forEach(function(m){g.beginPath();g.moveTo(0,-2);g.quadraticCurveTo(m*14,-10-f*10,m*27,-2-f*13);g.quadraticCurveTo(m*21,3,m*16,0);g.quadraticCurveTo(m*12,6,m*8,2);g.quadraticCurveTo(m*4,7,0,4);g.fill()});g.restore()}
  function frame(now){raf=requestAnimationFrame(frame);var dt=Math.min(.05,(now-L)/1000);L=now;T+=dt;g.clearRect(0,0,W,H);if(!cfg)return;
    var wind=Math.sin(T*.23)*14+Math.sin(T*.61+1.7)*8,i,p;
    if(cfg.t==="bat"){for(i=0;i<P.length;i++){p=P[i];p.x+=p.dir*p.v*dt;p.y=p.y0+Math.sin(T*.9+p.ph)*34+Math.sin(T*2.1+p.ph)*8;
        if((p.dir>0&&p.x>W+80)||(p.dir<0&&p.x<-80))P[i]=mkBat();bat(p)}return}
    var im=cfg.img;
    for(i=0;i<P.length;i++){p=P[i];
      if(cfg.t==="fall"||cfg.t==="rise"){var up=cfg.t==="rise"?-1:1;p.y+=p.v*dt*up;p.x+=(Math.sin(T*p.f+p.ph)*cfg.sw+wind*(.4+p.z))*dt;p.a+=p.w*dt;p.fl+=(1+p.z)*dt*1.5;
        if(up>0&&p.y>H+40||up<0&&p.y<-60){P[i]=mk(false);continue}if(p.x>W+40)p.x=-40;if(p.x<-40)p.x=W+40}
      else{p.x+=Math.sin(T*.4*p.f+p.ph)*18*dt;p.y+=Math.cos(T*.33*p.f+p.ph*1.7)*14*dt}
      var al=p.al;if(cfg.t==="float"||cfg.glow)al*=.45+.55*(.5+.5*Math.sin(T*p.f*1.4+p.ph));
      g.globalAlpha=al;g.save();g.translate(p.x,p.y);
      if(cfg.spin){g.rotate(p.a);g.scale(1,Math.max(.18,Math.abs(Math.cos(p.fl))))}
      g.drawImage(im,-p.s/2,-p.s/2,p.s,p.s*(cfg.spin?1.1:1));g.restore()}
    g.globalAlpha=1}
  window.FX={set:function(id){cfg=CFG[id]||null;P=[];if(!cfg||calm)return cfg=null;var k=W<640?.55:1,n=Math.round(cfg.n*k),i;
    if(cfg.s)cfg.img=cfg.s();for(i=0;i<n;i++)P.push(cfg.t==="bat"?mkBat():mk(true));
    if(cfg.t==="bat")P.forEach(function(b,j){b.x=Math.random()*W*(j%2?1:.6)})}};
  addEventListener("resize",size);size();raf=requestAnimationFrame(frame);
})();
