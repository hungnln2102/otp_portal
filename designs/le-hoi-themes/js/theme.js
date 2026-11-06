/* Chọn theme: dock phía dưới, #tên-theme hoặc ?theme=tên-theme. Nhớ lựa chọn bằng localStorage. */
(function(){
  var T=[
    {id:"tet",e:"🧧",n:"Tết Nguyên Đán",chip:"Mừng xuân mới · Giao hàng toàn quốc",t:"Xuân sang, lộc đến nhà",s:"Mứt, bánh chưng và hộp quà xuân làm thủ công, giao tận nơi trước Giao thừa.",tag:["Hộp quà Xuân An Khang","490.000đ"],
      p:[["🍬","Mứt Tết sáu vị","Gừng, dừa, bí, hạt sen, quất, cà rốt","185.000đ"],["🍃","Bánh chưng lá dong","Nếp cái hoa vàng, nhân thịt đậu xanh","95.000đ"],["🧧","Set lì xì thêu tay","Bộ 10 bao đỏ viền vàng","68.000đ"]]},
    {id:"nguyen-tieu",e:"🏮",n:"Tết Nguyên Tiêu",chip:"Đêm rằm tháng Giêng",t:"Rằm tháng Giêng, trăng tròn đầu năm",s:"Chè trôi nước, bánh trôi và đèn lồng cho đêm rằm sum vầy.",tag:["Mâm rằm đầu năm","320.000đ"],
      p:[["🍡","Chè trôi nước","Nhân đậu xanh, nước đường gừng","45.000đ"],["🥟","Bánh trôi tàu","Mè đen xay, nặn tay","52.000đ"],["🏮","Đèn lồng giấy","Khung tre, thắp được nến điện","120.000đ"]]},
    {id:"gio-to",e:"🥁",n:"Giỗ Tổ Hùng Vương",chip:"Mùng 10 tháng 3 âm lịch",t:"Uống nước nhớ nguồn",s:"Bánh chưng, bánh giầy và xôi ngũ sắc dâng lễ ngày Giỗ Tổ.",tag:["Mâm cỗ dâng Tổ","650.000đ"],
      p:[["🍃","Bánh chưng vuông","Tượng trưng cho đất","95.000đ"],["⚪","Bánh giầy giã tay","Tượng trưng cho trời","60.000đ"],["🍚","Xôi ngũ sắc","Năm màu từ lá và củ tự nhiên","75.000đ"]]},
    {id:"trung-thu",e:"🥮",n:"Tết Trung Thu",chip:"Rằm tháng Tám",t:"Trăng rằm, rước đèn phá cỗ",s:"Bánh nướng, bánh dẻo và đèn ông sao cho đêm rằm tháng Tám.",tag:["Hộp bốn bánh trăng vàng","389.000đ"],
      p:[["🥮","Bánh nướng thập cẩm","Hạt sen, trứng muối, lạp xưởng","98.000đ"],["🍮","Bánh dẻo hạt sen","Vỏ dẻo mỏng, nhân ngọt thanh","85.000đ"],["🌟","Đèn ông sao","Khung tre dán giấy kiếng","55.000đ"]]},
    {id:"halloween",e:"🎃",n:"Halloween",chip:"Đêm 31 tháng 10",t:"Trick or treat?",s:"Bánh bí ngô, cupcake ma và kẹo phù thủy. Dám mở hộp quà đêm nay không?",tag:["Hộp bí mật phù thủy","259.000đ"],
      p:[["🎃","Bánh bí ngô","Quế, hạt nhục đậu khấu","78.000đ"],["👻","Cupcake ma","Kem vani, mắt sô-cô-la","49.000đ"],["🍬","Kẹo phù thủy","Túi 12 viên đủ màu","65.000đ"]]},
    {id:"phu-nu",e:"💐",n:"Quốc tế Phụ nữ 8/3",chip:"Ngày 8 tháng 3",t:"Gửi hoa, gửi lời yêu thương",s:"Hoa tươi và hộp quà nhỏ cho mẹ, chị, bạn gái và đồng nghiệp nữ.",tag:["Bó hoa tulip hồng","350.000đ"],
      p:[["💐","Bó hoa tulip","Mười cành, gói giấy kraft","350.000đ"],["🎁","Hộp quà tri ân","Trà, nến thơm, thiệp viết tay","290.000đ"],["🍰","Bánh hoa hồng","Mousse dâu, trang trí hoa ăn được","175.000đ"]]},
    {id:"giang-sinh",e:"🎄",n:"Giáng Sinh",chip:"Mùa Giáng Sinh",t:"Mùa đông ấm áp bên nhau",s:"Bánh khúc cây, bánh gừng và hộp quà Noel, gói sẵn dưới cây thông.",tag:["Hộp quà Noel nhỏ","420.000đ"],
      p:[["🍰","Bánh khúc cây","Sô-cô-la đen, phủ tuyết đường","220.000đ"],["🍪","Bánh quy gừng","Hộp 8 chiếc, vẽ icing","88.000đ"],["🎁","Hộp quà Noel","Nơ đỏ, thiệp tặng kèm","150.000đ"]]}
  ],LIGHTS={"giang-sinh":["#ff4d4f","#ffd24d","#4dd2ff","#6bff7a"],"phu-nu":["#ff6fa5","#ffb3d1","#ffe27a","#c58bff"]};
  var $=function(i){return document.getElementById(i)},root=document.documentElement,main=$("main"),dock=$("dock"),cur="";
  [].forEach.call(document.querySelectorAll(".lanterns i"),function(i){i.innerHTML='<svg viewBox="0 0 64 132" aria-hidden="true"><use href="#lantern"/></svg>'});
  T.forEach(function(x){var b=document.createElement("button");b.type="button";b.textContent=x.e;b.title=x.n;b.setAttribute("aria-label",x.n);b.dataset.id=x.id;dock.appendChild(b)});
  function overlay(id){var o=document.querySelector(".bgvideo");if(o)o.remove();var v=document.createElement("video"),e=["webm","mp4"],k=0;
    v.className="bgvideo";v.muted=true;v.loop=true;v.autoplay=true;v.playsInline=true;v.setAttribute("aria-hidden","true");
    function next(){if(k>=e.length){v.remove();return}v.src="assets/overlay-"+id+"."+e[k++];var p=v.play&&v.play();if(p&&p.catch)p.catch(function(){})}
    v.addEventListener("error",next);document.body.appendChild(v);next()}
  function lights(cols){var box=$("lights");box.innerHTML="";if(!cols)return;var S=6,N=7,h='<svg viewBox="0 0 100 40" preserveAspectRatio="none"><path vector-effect="non-scaling-stroke" d="M0 2',k,i;
    for(k=0;k<S;k++)h+=" Q"+((k+.5)*100/S).toFixed(2)+" 34 "+((k+1)*100/S).toFixed(2)+" 2";h+='"/></svg>';
    for(k=0;k<S;k++)for(i=1;i<=N;i++){var t=i/(N+1),y=(1-t)*(1-t)*2+2*(1-t)*t*34+t*t*2,c=cols[(k*N+i)%cols.length];
      h+='<span style="left:'+((k+t)*100/S).toFixed(2)+'%;top:'+(y/40*100-2).toFixed(1)+'%;color:'+c+';animation-delay:'+(-Math.random()*1.8).toFixed(2)+'s;animation-duration:'+(1.2+Math.random()*1.4).toFixed(2)+'s"></span>'}
    box.innerHTML=h}
  function apply(id,first){var x=T.filter(function(v){return v.id===id})[0]||T[0];if(x.id===cur)return;cur=x.id;root.setAttribute("data-theme",x.id);
    $("chip").textContent=x.chip;$("title").textContent=x.t;$("sub").textContent=x.s;$("big").textContent=x.e;$("tn").textContent=x.tag[0];$("tp").textContent=x.tag[1];
    $("shelf").innerHTML=x.p.map(function(p){return '<article class="item"><i aria-hidden="true">'+p[0]+'</i><b>'+p[1]+'</b><small>'+p[2]+'</small><div class="row"><em>'+p[3]+'</em><button type="button">Thêm vào giỏ</button></div></article>'}).join("");
    [].forEach.call(dock.children,function(b){b.setAttribute("aria-pressed",b.dataset.id===x.id)});
    lights(LIGHTS[x.id]);window.FX&&FX.set(x.id);overlay(x.id);document.title=x.n+" – Tiệm Bánh Nhà Bơ";
    if(!first){main.classList.remove("enter");void main.offsetWidth;main.classList.add("enter")}
    try{localStorage.setItem("theme",x.id)}catch(e){}}
  dock.addEventListener("click",function(e){var b=e.target.closest("button");if(b)apply(b.dataset.id)});
  $("shelf").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;b.classList.add("ok");b.textContent="Đã thêm ✓";setTimeout(function(){b.classList.remove("ok");b.textContent="Thêm vào giỏ"},1600)});
  var q=(location.search.match(/theme=([\w-]+)/)||[])[1],h=location.hash.slice(1),s=null;try{s=localStorage.getItem("theme")}catch(e){}
  apply(q||h||s||T[0].id,true);
})();
