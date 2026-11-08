const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SEC=[['notes','💌','رسائل حب · Love notes',['t','b']],['voice','🎙️','رسائل صوتية · Voice notes',['t','u']],['songs','🎵','أغاني (+كلمات) · Songs',['t','u','b']],['photos','📷','صور · Photos',['t','u']],['phrases','💬','كلماتي · Catchphrases',['b']],['poems','📜','شعر · Poetry',['t','b']],['reasons','💖','أسباب أحبك · Reasons',['b']],['letters','✉️','افتحي عندما · Open when',['t','b']],['quiz','💕','أسئلة اختبار الحب · Love quiz',['t','b']]];
const FL={t:'العنوان · Title',b:'النص · Text',u:'مسار الملف أو رابط · File path / URL (media/name.mp3)'};
const EMPTY={start_date:'2024-01-01',next_date:'',next_label:'موعدنا القادم'};SEC.forEach(s=>EMPTY[s[0]]=[]);
let C=null,tab='content',msg='',err='',FILES=[],remoteOK=false;
const loadJS=s=>new Promise((a,b)=>{const e=document.createElement('script');e.src=s;e.onload=a;e.onerror=b;document.head.appendChild(e)});
const draft=()=>{try{localStorage.setItem('draft',JSON.stringify(C))}catch(e){}};
async function boot(){let d=null;try{d=JSON.parse(localStorage.getItem('draft'))}catch(e){}
if(d){C=d}else{try{await loadJS(CFG.LOVE_URL.replace(/\/$/,'')+'/content.js?x='+Date.now());C=Object.assign({},EMPTY,window.CONTENT);remoteOK=true}catch(e){C=JSON.parse(JSON.stringify(EMPTY))}}draw()}
const LK=(p,l)=>`<a class="chip" target="_blank" href="${CFG.LOVE_URL.replace(/\/$/,'')}/${p}">${l}</a>`;
function nav(){return`<header><h1>🛡️ لوحة التحكم · Admin</h1><button class="chip" onclick="sessionStorage.clear();draw()">خروج · Exit</button></header>
<nav class="chips">${[['content','✍️ المحتوى · Content'],['progress','💎 التقدم · Progress'],['guide','📘 الدليل · Guide']].map(([k,l])=>`<a class="chip ${tab===k?'on':''}" href="#/${k}">${l}</a>`).join('')}
${LK('','👑 موقع الحب · Love site')}${LK('#/games','🎮 الألعاب')}${LK('#/notes','💌 الرسائل')}${LK('#/photos','📷 الصور')}</nav>`}
const fld=(s,i,f,v,q)=>`<label><small class="l">${q&&f==='t'?'السؤال · Question':q&&f==='b'?'الصحيحة|خطأ|خطأ · correct|wrong|wrong':FL[f]}</small>${f==='b'?`<textarea rows="3" dir="auto" oninput="ed('${s}',${i},'b',this.value)">${esc(v)}</textarea>`:`<input dir="auto" value="${esc(v)}" oninput="ed('${s}',${i},'${f}',this.value)">`}</label>`+(f==='u'?`<input type="file" accept="audio/*,image/*" onchange="pick('${s}',${i},this.files[0])">`:'');
function content(){return`<div class="card"><h3>⚙️ عام · General</h3><label>معًا منذ · Together since<input type="date" value="${esc(C.start_date)}" oninput="C.start_date=this.value;draft()"></label>
<label>تاريخ الموعد القادم · Next date<input type="date" value="${esc(C.next_date)}" oninput="C.next_date=this.value;draft()"></label><label>عنوان الموعد · Label<input dir="auto" value="${esc(C.next_label)}" oninput="C.next_label=this.value;draft()"></label></div>
${SEC.map(([k,ic,lb,fs])=>`<div class="card"><h3>${ic} ${lb} (${(C[k]||[]).length})</h3>${(C[k]||[]).map((x,i)=>`<div class="item">${fs.map(f=>fld(k,i,f,x[f]||'',k==='quiz')).join('')}<button onclick="del('${k}',${i})">🗑</button></div>`).join('')}<button class="gold" onclick="add('${k}')">➕</button></div>`).join('')}
<div class="card center"><button class="gold" onclick="exp()">⬇️ تصدير · Export content.js</button><p class="mut">${msg}</p><button onclick="if(confirm('Discard draft and reload from love site?')){localStorage.removeItem('draft');C=null;boot()}">↺ إعادة التحميل · Reload from love site</button></div>`}
const ed=(s,i,f,v)=>{C[s][i][f]=v;draft()},add=s=>{(C[s]=C[s]||[]).push({t:'',b:'',u:''});draft();draw()},del=(s,i)=>{C[s].splice(i,1);draft();draw()};
function pick(s,i,f){if(!f)return;const p='media/'+f.name.replace(/[^\w.\-]/g,'_');C[s][i].u=p;if(!FILES.includes(f.name))FILES.push(f.name);draft();draw()}
function exp(){const o=JSON.parse(JSON.stringify(C));SEC.forEach(([k,,,fs])=>o[k]=(o[k]||[]).map(x=>{const r={};fs.forEach(f=>r[f]=x[f]||'');return r}));
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['window.CONTENT='+JSON.stringify(o,null,1)+';'],{type:'text/javascript'}));a.download='content.js';a.click();msg='✅ content.js'+(FILES.length?' — انسخ الملفات إلى /media · copy to /media: '+FILES.join(', '):'');draw()}
async function progress(){await Prog.load();const d=Prog.d;return`<div class="card"><h3>💎 التقدم · Progress ${Prog.ok?'☁️':'⚠️'}</h3>${Prog.err?`<p class="err">${esc(Prog.err)}</p>`:''}
<label>نقاط الحب · Love points<input id="pp" type="number" value="${d.love_points|0}"></label><label>اسم البيبي · Baby name<input id="pn" dir="auto" value="${esc(d.baby_name)}"></label>
<select id="pg"><option value="girl" ${d.baby_gender==='girl'?'selected':''}>👧</option><option value="boy" ${d.baby_gender==='boy'?'selected':''}>👦</option></select>
<div class="row"><button class="gold" onclick="saveP()">💾 حفظ · Save</button><button onclick="draw()">🔄</button></div></div>
<div class="card"><h3>🥰 آخر مزاج · Last mood</h3><p style="font-size:2rem">${esc(d.last_mood||'—')} <small class="mut">${esc(d.last_mood_at||'')}</small></p></div>
<div class="card"><h3>🏅 أفضل النتائج · Best scores</h3><p>${Object.entries(d.scores||{}).map(([k,v])=>`${esc(k)}: <b>${v}</b>`).join(' · ')||'—'}</p></div>`}
function saveP(){Prog.rpc('admin_set',{p:+$('pp').value|0,g:$('pg').value,nm:$('pn').value});setTimeout(draw,700)}
const guide=()=>`<div class="card pre"><h3>📘 كيف تنشر؟ · How to publish</h3>1) ✍️ المحتوى · Content: add notes, poems, photos… (type or paste links).
2) ⬇️ Export <b>content.js</b>.
3) Put it in the <b>love-site</b> repo (replace the old one). Photos/audio: copy the files into <b>love-site/media/</b>.
4) Commit → Vercel redeploys → done. Progress (points, baby, scores, mood) is saved separately in Supabase and never needs redeploy.
<br><br>🔗 ${LK('','Love site')} · ${LK('admin/','/admin')} · ${LK('#/games','Games')} · ${LK('#/home','Home')}</div>`;
async function draw(){document.documentElement.dir='rtl';tab=location.hash.slice(2)||'content';
if(!sessionStorage.aok)return $('app').innerHTML=`<div class="gate"><div class="card"><h1>🛡️ لوحة التحكم · Admin</h1><input id="c" type="password" placeholder="الرمز السري · Admin code" onkeydown="event.key==='Enter'&&login()" oninput="login(1)"><button class="gold" onclick="login()">دخول · Enter</button><p class="err">${err}</p></div></div>`;
if(!C)return boot();$('app').innerHTML=`<div class="wrap">${nav()}<div id="body">${tab==='guide'?guide():tab==='progress'?'<p class="center">⏳</p>':content()}</div></div>`;
if(tab==='progress')$('body').innerHTML=await progress()}
function login(a){if($('c').value.trim()===CFG.ADMIN_CODE){sessionStorage.aok=1;err='';draw()}else if(!a){err='رمز خاطئ · Wrong code';draw()}}
window.addEventListener('hashchange',()=>sessionStorage.aok&&draw());draw();
