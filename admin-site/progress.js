/* Supabase is used ONLY to save progress (points, baby, best scores, mood). Plain REST, no library. Works offline via localStorage. */
const Prog={ok:false,err:'',onchange:null,
d:(()=>{try{return JSON.parse(localStorage.getItem('prog'))}catch(e){return null}})()||{love_points:0,baby_name:'البيبي',baby_gender:'girl',scores:{},last_mood:''},
on(){return !!CFG.SUPABASE_URL&&!/YOUR-/.test(CFG.SUPABASE_URL+CFG.SUPABASE_KEY)},
async req(p,o){o=o||{};const h={apikey:CFG.SUPABASE_KEY,'Content-Type':'application/json'};if(CFG.SUPABASE_KEY.startsWith('eyJ'))h.Authorization='Bearer '+CFG.SUPABASE_KEY;
const r=await fetch(CFG.SUPABASE_URL+'/rest/v1/'+p,{method:o.method||'GET',headers:h,body:o.body});const x=await r.text();if(!r.ok)throw new Error(x);try{return JSON.parse(x)}catch(e){return null}},
store(){try{localStorage.setItem('prog',JSON.stringify(this.d))}catch(e){}this.onchange&&this.onchange()},
async load(){if(!this.on())return;try{const r=await this.req('progress?id=eq.1&select=*');if(r&&r[0]){this.d=Object.assign({},this.d,r[0]);this.ok=true;this.err='';this.store()}else this.err='progress row missing – run schema.sql'}catch(e){this.ok=false;this.err=String(e.message||e).slice(0,180)}},
rpc(f,a){if(!this.on())return;this.req('rpc/'+f,{method:'POST',body:JSON.stringify(a)}).then(()=>{this.ok=true;this.err=''}).catch(e=>{this.ok=false;this.err=String(e.message||e).slice(0,180)})},
add(n){n=Math.min(50,Math.max(0,n|0));if(!n)return;this.d.love_points=(this.d.love_points|0)+n;this.store();this.rpc('add_points',{n})},
baby(g,nm){this.d.baby_gender=g;this.d.baby_name=nm;this.store();this.rpc('set_baby',{g,nm})},
score(g,s){this.d.scores=this.d.scores||{};if(s>(this.d.scores[g]||0)){this.d.scores[g]=s;this.store();this.rpc('save_score',{g,s})}},
mood(m){this.d.last_mood=m;this.store();this.rpc('add_mood',{m})}};
