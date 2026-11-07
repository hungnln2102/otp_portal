(function(){'use strict';const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],base=window.HOLIDAY_BASE||'',themes=window.HOLIDAYS,canvas=$('#effects'),fx=new HolidayEffects.Effects(canvas),key='mavryk-anime24-review-v1';let reviews={};try{reviews=JSON.parse(localStorage.getItem(key)||'{}')}catch{}let selected=0,filter='all',paused=matchMedia('(prefers-reduced-motion: reduce)').matches,time=2,last=performance.now(),service='Adobe',loadVersion=0;
const effectNames = [
  'Pháo hoa · đuôi sáng & tàn lửa', 'Mây ngũ sắc · bụi sáng quanh cá chép', 'Mai đào · nhiều lớp cánh hoa theo gió',
  'Cánh hồng · ánh đèn và đốm hồng', 'Hoa đăng · đèn trời và gợn nước', 'Đàn bướm · cánh hoa và ánh tím',
  'Cánh sen · đốm sáng và đèn ấm', 'Chim Lạc · hai tầng sương núi', 'Pháo hoa · đài phun và tàn sáng',
  'Bánh răng · vệt ánh kim và bụi vàng', 'Đèn sen · cánh hoa và phản chiếu', 'Bóng bay · ánh sao nhiều tầng',
  'Lá xanh · luồng gió và đốm sáng', 'Đom đóm · lá bay quanh mái ấm', 'Sao băng · nhiều hướng và vệt sáng',
  'Hoa đăng · gợn và ánh đèn trên sông', 'Pháo hoa · chùm phụ và nền gạch phản sáng', 'Đèn giấy bay · đom đóm và phản chiếu',
  'Cánh mẫu đơn · phản chiếu ven hồ', 'Hai tốp dơi · lá cuốn và sương sát đất', 'Trang giấy · cuộn theo gió và ánh nước',
  'Sương núi · đốm sáng và ánh kim', 'Tuyết ba lớp · đèn cây nhấp nháy', 'Xung dữ liệu · vệt quét khiên và mạch sáng',
];
function save(){try{localStorage.setItem(key,JSON.stringify(reviews));$('#saved-note').textContent='Đã lưu trên trình duyệt này'}catch{$('#saved-note').textContent='Trình duyệt không cho lưu. Hãy xuất ghi chú trước khi đóng.'}updateCards()}
function readReview(){const r=reviews[themes[selected].id]||{status:'pending',note:''};$('#review-note').value=r.note||'';$$('[data-status]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.status===r.status)));$('#saved-note').textContent='Lưu tự động trên trình duyệt'}
function updateCards(){$$('.theme-card').forEach(b=>{const id=+b.dataset.id;b.setAttribute('aria-pressed',String(id===themes[selected].id));const r=reviews[id];b.querySelector('.review-dot').className='review-dot '+(r?.status||'pending')})}
function cards(){const grid=$('#theme-grid');grid.innerHTML='';themes.filter(t=>filter==='all'||t.season===filter).forEach(t=>{const b=document.createElement('button');b.className='theme-card';b.dataset.id=t.id;b.setAttribute('aria-pressed',String(t.id===themes[selected].id));b.setAttribute('aria-label',`${t.slug}. ${t.name}`);b.innerHTML=`<div class="thumb"><img src="${base+t.art}" alt="Minh họa anime ${t.name}" loading="lazy"><span class="card-id">${t.slug}</span><i class="mini-form"></i></div><div class="theme-info"><div><h3>${t.name}</h3><i class="review-dot"></i></div><p>${t.date}</p></div>`;b.addEventListener('click',()=>{select(t.id-1,true);$('#theme-name').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})});grid.appendChild(b)});updateCards()}
function applyHeading(theme) {
 const headline = $('#headline');
 const font = theme.headingFont;
 headline.textContent = theme.title;
 headline.style.setProperty('--heading-family', JSON.stringify(font.alias));
 headline.style.setProperty('--heading-size', font.size + 'px');
 headline.style.setProperty('--heading-fluid', (font.size / 13.6).toFixed(3) + 'vw');
 headline.style.setProperty('--heading-mobile', font.mobile + 'px');
}
function select(i,urlUpdate=false){selected=(i+themes.length)%themes.length;const t=themes[selected],version=++loadVersion;document.documentElement.style.setProperty('--accent',t.accent);$('#theme-number').textContent=t.slug+' / 24';$('#theme-name').textContent=t.name;$('#occasion').textContent=t.name+' · '+t.date;applyHeading(t);$('#tagline').textContent=t.subtitle;$('#scene-caption').textContent=`${t.slug} / ${t.headingFont.name.toUpperCase()}`;$('#effect-label').textContent=effectNames[t.id - 1]||'';$('#standalone').href=base+'holidays/'+t.slug+'.html';document.title=t.name+' · Mavryk Anime 24';$('#art').style.opacity='.2';
 fx.setTheme(null);
 fx.draw(time);
 const image=new Image();image.onload=()=>{if(version===loadVersion){$('#art').style.backgroundImage=`url("${base+t.art}")`;$('#art').style.opacity='1';fx.setTheme(t);time=2;resize()}};image.onerror=()=>{if(version===loadVersion){$('#art').style.backgroundImage='none';$('#art').style.opacity='1';$('#effect-label').textContent='Không tải được minh họa. Hãy tải lại trang.'}};image.src=base+t.art;
 const left = $('.decor-left');
 const right = $('.decor-right');
 // The New Year layout keeps its original ornaments. Other effects are drawn in scene space.
 left.innerHTML = t.id === 1 ? HolidayEffects.svg('clock') : '';
 right.innerHTML = t.id === 1 ? HolidayEffects.svg('star') : '';
readReview();updateCards();$('#form-message').textContent='';if(urlUpdate){const u=new URL(location.href);u.searchParams.set('theme',t.slug);history.replaceState(null,'',u)}
 // Prefetch immediate neighbors, not all 24 full-size images.
 for(const j of [(selected+1)%24,(selected+23)%24]){const p=new Image();p.src=base+themes[j].art;}
}
$('#previous').addEventListener('click',()=>select(selected-1,true));$('#next').addEventListener('click',()=>select(selected+1,true));$$('[data-season]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.season;$$('[data-season]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));cards()}));$$('[data-status]').forEach(b=>b.addEventListener('click',()=>{const id=themes[selected].id;reviews[id]={status:b.dataset.status,note:$('#review-note').value};save();readReview()}));$('#review-note').addEventListener('input',()=>{const id=themes[selected].id;reviews[id]={status:reviews[id]?.status||'pending',note:$('#review-note').value};save()});$('#export-reviews').addEventListener('click',()=>{const data={collection:'Mavryk Anime 24',exportedAt:new Date().toISOString(),themes:themes.map(t=>({id:t.id,name:t.name,page:'holidays/'+t.slug+'.html',status:reviews[t.id]?.status||'pending',note:reviews[t.id]?.note||''}))};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mavryk-anime-24-review.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
function pauseState(){$('#pause').textContent=paused?'▶ Tiếp tục':'Ⅱ Tạm dừng';$('#pause').setAttribute('aria-pressed',String(paused));$('#banner').classList.toggle('paused',paused)}$('#pause').addEventListener('click',()=>{paused=!paused;pauseState()});$('#clean').addEventListener('click',()=>{const clean=$('#banner').classList.toggle('clean');$('#clean').setAttribute('aria-pressed',String(clean));$('#clean').textContent=clean?'Hiện form':'Ẩn form'});$('#intensity').addEventListener('input',e=>{fx.amount=+e.target.value/100;$('#intensity-value').textContent=e.target.value+'%';if(paused)fx.draw(time)});
$$('[data-service]').forEach(b=>b.addEventListener('click',()=>{service=b.dataset.service;$$('[data-service]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});$('#email').placeholder='Nhập email tài khoản '+service;$('#cta-label').textContent='Lấy mã OTP '+service;$('#form-message').textContent=''}));$('#otp-form').addEventListener('submit',e=>{e.preventDefault();$('#form-message').textContent='Bản demo giao diện — chưa kết nối dịch vụ OTP.'});$('#get-account').addEventListener('click',()=>{$('#form-message').textContent='Chức năng lấy tài khoản sẽ được kết nối khi triển khai.'});const dialog=$('#help-dialog');$('#help').addEventListener('click',()=>dialog.showModal());$('#close-help').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
function resize() {
 const rect = $('#stage').getBoundingClientRect();
 const dpr = Math.min(devicePixelRatio || 1, 2);
 canvas.width = Math.round(rect.width * dpr);
 canvas.height = Math.round(rect.height * dpr);
 if (themes[selected].id === 1) {
   fx.ctx.setTransform(canvas.width / 1600, 0, 0, canvas.height / 900, 0, 0);
 } else {
   // Match background-size: cover and background-position: center.
   const scale = Math.max(canvas.width / 1600, canvas.height / 900);
   const visibleWidth = canvas.width / scale;
   fx.viewport = { width: visibleWidth, left: (1600 - visibleWidth) / 2, right: (1600 + visibleWidth) / 2 };
   fx.ctx.setTransform(scale, 0, 0, scale,
     (canvas.width - 1600 * scale) / 2, (canvas.height - 900 * scale) / 2);
 }
 fx.draw(time);
}
new ResizeObserver(resize).observe($('#stage'));
document.addEventListener('visibilitychange', () => { last = performance.now(); });
function frame(now) {
 const dt = Math.min((now - last) / 1000, .05);
 last = now;
 if (!paused && !document.hidden) {
   time += dt;
   fx.draw(time);
 }
 requestAnimationFrame(frame);
}
const q=+(new URLSearchParams(location.search).get('theme')||document.body.dataset.theme||1);select(Number.isInteger(q)&&q>=1&&q<=24?q-1:0);cards();pauseState();resize();requestAnimationFrame(frame);
})();
