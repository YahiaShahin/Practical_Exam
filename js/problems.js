/* ═══════════════════════════════════════
   PROBLEMS PAGE — Grouped List View
   Depends on: problems-data.js (Q array)
═══════════════════════════════════════ */

/* Topic groups config - Now dynamically generated but with some defaults */
let GROUPS = [];

function getQuestionGroup(q) {
  // If explicitly specified in data, use that
  if (q.group) return q.group;
  // Default rule: Q1-20 are practical, others are based on their tag
  return q.num <= 20 ? 'practical' : q.tag;
}

function initDynamicGroups() {
  const groups = [];
  const tagsInQ = new Set();
  
  // Assign groupId to each question and find unique groups for tasks
  Q.forEach(q => {
    q.groupId = getQuestionGroup(q);
    if (q.groupId !== 'practical' && !tagsInQ.has(q.groupId)) {
      tagsInQ.add(q.groupId);
      groups.push({
        tag: q.groupId,
        label: q.tagLabel || (q.groupId.charAt(0).toUpperCase() + q.groupId.slice(1)),
        cls: 'tag-' + q.groupId
      });
    }
  });

  // Add Practical Exam group to the start if any questions belong to it
  if (Q.some(q => q.groupId === 'practical')) {
    groups.unshift({ tag: 'practical', label: 'Practical Exam (Q1-Q20)', cls: 'tag-practical' });
  }

  GROUPS = groups;
  
  // Initialize expandedGroups
  GROUPS.forEach(g => {
    if (expandedGroups[g.tag] === undefined) {
      expandedGroups[g.tag] = true;
    }
  });
}

/* STATE */
let learned=[], notes={};
try{learned=JSON.parse(localStorage.getItem('csg3_learned')||'[]');notes=JSON.parse(localStorage.getItem('csg3_notes')||'{}');}catch(e){}
let filter='all', search='', queue=[], idx=0;
let expandedGroups = {};

/* MODAL MODE (brief / detailed) */
let modalMode = localStorage.getItem('csg3_modal_mode') || 'detailed';

function setModalMode(m){
  modalMode = m;
  localStorage.setItem('csg3_modal_mode', m);
  // toolbar buttons
  const bd = document.getElementById('mode-btn-detailed');
  const bb = document.getElementById('mode-btn-brief');
  if(bd) bd.classList.toggle('active', m === 'detailed');
  if(bb) bb.classList.toggle('active', m === 'brief');
  // apply to open modal if any
  const left = document.getElementById('m-left');
  if(left) left.classList.toggle('brief-mode', m === 'brief');
}

function syncModeBtn(){
  setModalMode(modalMode);
}

function toggleModalMode(){
  setModalMode(modalMode === 'detailed' ? 'brief' : 'detailed');
}

function save(){
  try{localStorage.setItem('csg3_learned',JSON.stringify(learned));localStorage.setItem('csg3_notes',JSON.stringify(notes));}catch(e){}
  updateProgress();
}
function resetProgress(){
  if(!confirm('Reset all progress and notes?'))return;
  learned=[];notes={};
  _celebrated = false;
  sessionStorage.removeItem('csg3_cel_session'); /* allow celebration next time they finish */
  save();renderList();showToast('Reset complete');
}

/* PROGRESS & STATS */
let _celebrated = false;

function updateProgress(){
  const pct=Math.round(learned.length/Q.length*100);
  const fill = document.getElementById('prog-fill');
  const text = document.getElementById('prog-text');
  const hdr = document.getElementById('hdr-learned');
  if(fill) fill.style.width=pct+'%';
  if(text) text.textContent=learned.length+' / '+Q.length+' learned';
  if(hdr) hdr.textContent=learned.length;

  /* 100% — fires once per session (sessionStorage), picks the right variant */
  if(pct === 100 && learned.length === Q.length && !_celebrated){
    /* sessionStorage clears when the tab is closed — perfect "once per session" */
    if(sessionStorage.getItem('csg3_cel_session')) return;
    _celebrated = true;
    sessionStorage.setItem('csg3_cel_session','1');
    const firstTime = !localStorage.getItem('csg3_celebrated_once');
    setTimeout(() => {
      if(firstTime){
        localStorage.setItem('csg3_celebrated_once','1');
        showCelebration('first');
      } else {
        showCelebration('again');
      }
    }, 600);
  }
}

function updateStats(){
  const qHdr = document.getElementById('hdr-questions');
  const tHdr = document.getElementById('hdr-topics');
  if(qHdr) qHdr.textContent = Q.length;
  if(tHdr) tHdr.textContent = GROUPS.length;
  const filterAll = document.getElementById('filter-all');
  if(filterAll) filterAll.textContent = 'All (' + Q.length + ')';
  
  // Re-render filter buttons dynamically if they exist in a container
  renderFilterButtons();
}

function renderFilterButtons() {
  const container = document.getElementById('filter-row');
  if (!container) return;
  
  let html = `<span class="filter-label">TOPICS:</span>
    <button class="filter-btn ${filter==='all'?'active':''}" id="filter-all" onclick="filterCards('all',this)">All (${Q.length})</button>`;
    
  GROUPS.forEach(g => {
    html += `<button class="filter-btn ${filter===g.tag?'active':''}" data-tag="${g.tag}" onclick="filterCards('${g.tag}',this)">${g.label}</button>`;
  });
  
  container.innerHTML = html;
}

/* SYNTAX HIGHLIGHT */
function hl(code){
  let s=code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  s=s.replace(/"([^"\\]|\\.)*"/g,m=>`<span class="str">${m}</span>`);
  s=s.replace(/(\/\/[^\n]*)/g,m=>`<span class="cm">${m}</span>`);
  s=s.replace(/(#\w+)/g,m=>`<span class="kw">${m}</span>`);
  ['int','float','char','double','void','return','if','else','for','while','do','switch','case','break','default','long','short','unsigned','const'].forEach(k=>{
    s=s.replace(new RegExp('\\b('+k+')\\b','g'),'<span class="kw">$1</span>');
  });
  s=s.replace(/\b(\d+)\b/g,'<span class="num">$1</span>');
  s=s.replace(/\b([a-z_]\w*)\s*(?=\()/g,'<span class="fn">$1</span>');
  return s;
}

/* FILTER / SEARCH */
function getFiltered(){
  let list = Q;
  if (filter !== 'all') {
    list = Q.filter(q => q.groupId === filter);
  }
  
  if(search){
    const s=search.toLowerCase();
    list=list.filter(q=>q.title.toLowerCase().includes(s)||q.brief.toLowerCase().includes(s)||q.concepts.some(c=>c.toLowerCase().includes(s)));
  }
  return list;
}
function filterCards(tag,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');filter=tag;renderList();
}
function clearSearch(){
  document.getElementById('search').value='';search='';
  document.getElementById('clear-btn').classList.remove('visible');renderList();
}

/* ═══════════════════════════════════════
   RENDER GROUPED LIST
   ═══════════════════════════════════════ */
function renderList(){
  const container=document.getElementById('grid');
  const filtered=getFiltered();
  const meta=document.getElementById('results-meta');
  if(search||filter!=='all'){meta.textContent=filtered.length+' of '+Q.length+' questions shown';meta.style.display='block';}else{meta.style.display='none';}

  queue=filtered.map(q=>q.num);

  if(!filtered.length){
    container.innerHTML='<div class="empty-state">No matches found. Try a different search or filter.</div>';
    return;
  }

  let html='';

  // Group by our dynamic groups
  const groupsToShow = filter !== 'all'
    ? [GROUPS.find(g=>g.tag===filter)].filter(Boolean)
    : GROUPS;

  groupsToShow.forEach((g, gi) => {
    const items = filtered.filter(q => q.groupId === g.tag);
    
    if(!items.length) return;

    const learnedCount = items.filter(q => learned.includes(q.num)).length;
    const isOpen = expandedGroups[g.tag] !== false;

    html += `<div class="topic-group" style="animation-delay:${gi*.06}s">
      <div class="topic-group-hdr" onclick="toggleGroup('${g.tag}')">
        <span class="tg-icon ${isOpen?'open':''}" id="tgi-${g.tag}">&rsaquo;</span>
        <span class="tg-tag ${g.cls}">${g.label}</span>
        <span class="tg-title">${items.length} question${items.length>1?'s':''}</span>
        ${learnedCount > 0 ? `<span class="tg-progress">${learnedCount}/${items.length} learned</span>` : ''}
        <span class="tg-count">${isOpen ? '&minus;' : '+'}</span>
      </div>
      <div class="topic-group-body ${isOpen?'':'collapsed'}" id="tgb-${g.tag}">`;

    items.forEach(q => {
      const isL = learned.includes(q.num);
      // Determine if we should show a subtype badge
      let subTagHtml = '';
      if (g.tag === 'practical') {
        const tagLbl = q.tagLabel || (q.tag.charAt(0).toUpperCase() + q.tag.slice(1));
        subTagHtml = `<span class="qr-tag tag-${q.tag}">${tagLbl}</span>`;
      }

      html += `<div class="q-row ${isL?'learned':''}" id="qr-${q.num}" onclick="openModal(${q.num})">
        <span class="qr-num">Q${q.num}</span>
        <div class="qr-main">
          <span class="qr-title">${q.title}</span>
          ${subTagHtml}
        </div>
        <div class="qr-actions">
          <button class="qr-learn ${isL?'active':''}" onclick="toggleLearned(${q.num},event)">${isL?'&#10003;':'&#9675;'}</button>
          <button class="qr-open" onclick="event.stopPropagation();openModal(${q.num})">Study &rarr;</button>
        </div>
      </div>`;
    });

    html += `</div></div>`;
  });

  container.innerHTML = html;
}

function toggleGroup(tag){
  expandedGroups[tag] = !expandedGroups[tag];
  const body = document.getElementById('tgb-'+tag);
  const icon = document.getElementById('tgi-'+tag);
  if(body){
    body.classList.toggle('collapsed');
    icon.classList.toggle('open');
    // Update +/- indicator
    icon.parentElement.querySelector('.tg-count').innerHTML = expandedGroups[tag] ? '&minus;' : '+';
  }
}

/* LEARNED */
function toggleLearned(num,e){
  if(e)e.stopPropagation();
  if(learned.includes(num)){learned=learned.filter(n=>n!==num);showToast('Removed from learned');}
  else{learned.push(num);showToast('&#10003; Marked as learned!');}
  save();renderList();syncLearnBtn(num);
}
function toggleLearnedModal(){
  const num=queue[idx];toggleLearned(num,null);syncLearnBtn(num);
}
function syncLearnBtn(num){
  const btn=document.getElementById('m-learn');if(!btn)return;
  const isL=learned.includes(num);
  btn.textContent=isL?'\u2713 Learned':'\u25CB Mark as learned';
  btn.className='learn-btn'+(isL?' active':'');
}

/* MODAL */
function openModal(num){
  idx=queue.indexOf(num);
  if(idx<0){queue=Q.map(q=>q.num);idx=queue.indexOf(num);}
  renderModal(num);
  document.getElementById('modal').classList.add('active');
  /* Save scroll position — position:fixed resets it on iOS */
  document.body.dataset.scrollY = window.scrollY;
  document.body.style.top = '-' + window.scrollY + 'px';
  document.body.classList.add('modal-open');
  syncModeBtn();
  // highlight active row
  document.querySelectorAll('.q-row').forEach(r=>r.classList.remove('active'));
  const row=document.getElementById('qr-'+num);
  if(row) row.classList.add('active');
}
function renderModal(num){
  const q=Q.find(x=>x.num===num);
  const modalEl = document.querySelector('.modal');
  if(modalEl) {
    if(q.layout === 'wide') modalEl.classList.add('wide');
    else modalEl.classList.remove('wide');
  }
  document.getElementById('m-qnum').textContent='Q'+q.num+' / '+Q.length;
  document.getElementById('m-title').textContent=q.title;
  document.getElementById('m-prev').disabled=idx<=0;
  document.getElementById('m-next').disabled=idx>=queue.length-1;
  syncLearnBtn(num);
  syncModeBtn();

  const bkHtml=q.breakdown.map(b=>`
    <div class="bk">
      <div class="bk-code">${escHtml(b.code)}</div>
      <div class="bk-text">${b.text}</div>
    </div>`).join('');

  const mistakesHtml=q.mistakes?(`<div class="mistakes detail-only">
      <div class="mistakes-title">&#9888; Common Mistakes</div>
      ${q.mistakes.map(m=>`<div class="mistake-row"><span class="mistake-x">&#10007;</span><span class="mistake-txt">${m.text}</span></div>`).join('')}
    </div>`):'';

  const whatHtml=q.whatHappens?(`<div class="what-box detail-only">
      <div class="what-box-title">&#128203; What Happens Step-by-Step</div>
      ${q.whatHappens.map((w,i)=>`<p><strong>${i+1}.</strong> ${w}</p>`).join('')}
    </div>`):'';

  document.getElementById('m-left').innerHTML=`
    <div class="brief-banner brief-only">
      <span class="brief-banner-icon">⚡</span>
      <span>${q.brief}</span>
    </div>
    <div class="sec detail-only">What This Program Does</div>
    <div class="expl detail-only">${q.explanationDetailed || q.explanation || ''}</div>
    ${whatHtml}
    <div class="sec">Code Breakdown</div>
    <div class="breakdown">${bkHtml}</div>
    ${mistakesHtml}
    <div class="syn">
      <div class="syn-lbl">&#128161; Syntax Tip</div>
      <div class="syn-txt">${q.syntaxTip}</div>
    </div>
    <div class="sec">Key Concepts</div>
    <div class="concepts-m">${q.concepts.map(c=>'<span class="concept">'+c+'</span>').join('')}</div>
    <div class="out-box">
      <div class="out-lbl">&#9656; Expected Output</div>
      <pre class="out-txt">${escHtml(q.output)}</pre>
    </div>`;

  document.getElementById('cp-fname').textContent='main.c -- Q'+q.num;
  document.getElementById('code-display').innerHTML='<pre>'+hl(q.rawCode)+'</pre>';
  buildTryIt(q);
  document.getElementById('notes-ta').value=notes[num]||'';
}

function buildTryIt(q){
  const body=document.getElementById('tryit-body');
  if(!q.tryIt){body.innerHTML='<p style="font-size:.75rem;color:var(--muted);padding:4px 0;">No interactive demo.</p>';return;}
  const ti=q.tryIt;
  let inputsHtml='';
  ti.inputs.forEach(inp=>{
    let control='';
    if(inp.type==='select'){
      control=`<select class="ti-select" id="${inp.id}">${inp.options.map(o=>`<option value="${o}" ${o===inp.default?'selected':''}>${o}</option>`).join('')}</select>`;
    } else if(inp.type==='range'){
      control=`<div style="display:flex;align-items:center;gap:8px;">
        <input type="range" class="ti-input" id="${inp.id}" min="${inp.min||0}" max="${inp.max||100}" value="${inp.default||0}" oninput="updateRangeLabel(this,'lbl_${inp.id}')">
        <span id="lbl_${inp.id}" style="font-family:var(--font-mono);font-size:11px;color:var(--accent);min-width:28px;">${inp.default||0}</span>
      </div>`;
    } else {
      control=`<input type="${inp.type}" class="ti-input" id="${inp.id}" value="${inp.default}" ${inp.step?'step="'+inp.step+'"':''} ${inp.min!==undefined?'min="'+inp.min+'"':''} ${inp.max!==undefined?'max="'+inp.max+'"':''} ${inp.maxlength?'maxlength="'+inp.maxlength+'"':''}>`;
    }
    inputsHtml+=`<div class="ti-row"><label class="ti-label">${inp.label}</label>${control}</div>`;
  });
  body.innerHTML=`
    <p style="font-size:.76rem;color:var(--text2);line-height:1.6;">${ti.desc}</p>
    ${inputsHtml}
    <button class="ti-run" onclick="runTryIt(${q.num})">&#9654; Run</button>
    <pre class="ti-terminal" id="ti-out"></pre>`;
  body.querySelectorAll('input,select').forEach(el=>{
    el.addEventListener('change',()=>runTryIt(q.num));
    el.addEventListener('input',()=>runTryIt(q.num));
  });
}

function updateRangeLabel(el,lblId){
  const lbl=document.getElementById(lblId);
  if(lbl) lbl.textContent=el.value;
}

function runTryIt(num){
  const q=Q.find(x=>x.num===num);
  if(!q||!q.tryIt)return;
  const vals={};
  q.tryIt.inputs.forEach(inp=>{
    const el=document.getElementById(inp.id);
    if(el){
      let v = el.value;
      if(inp.type==='number'){
        let numV = parseInt(v)||0;
        if(numV > 20 && (q.tag==='task2' || q.title.toLowerCase().includes('pattern') || q.num === 46)){
           numV = 20;
           el.value = 20;
        }
        v = numV;
      }
      vals[inp.id]=v;
    }
  });
  try{
    const out=q.tryIt.run(vals);
    const term=document.getElementById('ti-out');
    if(term) {
      term.innerText=out;
      term.classList.add('visible');
    }
  }catch(e){
    const term=document.getElementById('ti-out');
    if(term) {
      term.innerText='Error: '+e.message;
      term.classList.add('visible');
    }
  }
}

let tryItOpen=false;
function toggleTryIt(){
  tryItOpen=!tryItOpen;
  document.getElementById('tryit-body').classList.toggle('hidden',!tryItOpen);
  document.getElementById('tryit-icon').classList.toggle('open',tryItOpen);
  if(tryItOpen){const num=queue[idx];if(num)runTryIt(num);}
}

function copyModalCode(){
  const num=queue[idx];
  const q=Q.find(x=>x.num===num);
  if(!q)return;
  navigator.clipboard.writeText(q.rawCode).then(()=>showToast('Code copied!'));
}

/* NAV */
function navModal(dir){
  idx=Math.max(0,Math.min(queue.length-1,idx+dir));
  renderModal(queue[idx]);
  /* Scroll to top — modal-wrap is scroller on mobile, m-left on desktop */
  const wrap=document.querySelector('.modal-wrap');
  if(wrap)wrap.scrollTop=0;
  const left=document.getElementById('m-left');
  if(left)left.scrollTop=0;
  if(tryItOpen)setTimeout(()=>runTryIt(queue[idx]),50);
  document.querySelectorAll('.q-row').forEach(r=>r.classList.remove('active'));
  const row=document.getElementById('qr-'+queue[idx]);
  if(row) row.classList.add('active');
}
/* Click outside modal-box to close */
function onOverlayClick(e){
  if(!document.getElementById('modal-box').contains(e.target))closeModal();
}
function closeModal(){
  document.getElementById('modal').classList.remove('active');
  const scrollY = parseInt(document.body.dataset.scrollY || '0');
  document.body.classList.remove('modal-open');
  document.body.style.top = '';
  window.scrollTo(0, scrollY);
  document.querySelectorAll('.q-row').forEach(r=>r.classList.remove('active'));
}

/* NOTES */
document.getElementById('notes-ta').addEventListener('input',function(){
  const num=queue[idx];if(!num)return;
  notes[num]=this.value;save();
});

/* SEARCH */
document.getElementById('search').addEventListener('input',function(e){
  search=e.target.value.trim();
  document.getElementById('clear-btn').classList.toggle('visible',search.length>0);
  renderList();
});

/* KEYBOARD */
document.addEventListener('keydown',e=>{
  const open=document.getElementById('modal').classList.contains('active');
  if(e.key==='Escape'&&open){closeModal();return;}
  if(open&&e.key==='ArrowLeft'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA')navModal(-1);
  if(open&&e.key==='ArrowRight'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA')navModal(1);
  if(!open&&e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();document.getElementById('search').focus();}
});

/* BACK TO TOP */
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>btt.classList.toggle('visible',window.scrollY>380));
btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* TOAST */
let tT;
function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('show'),2100);
}

/* HELPERS */
function escHtml(s){
  if(!s)return '';
  return s.toString()
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/\\n/g, '\n'); // Handle literal \n strings if they exist
}

/* SWIPE — only trigger on clearly horizontal gestures, not vertical scrolls */
let tx=0,ty=0,tCancelled=false;
document.getElementById('modal-box').addEventListener('touchstart',e=>{
  tx=e.touches[0].clientX;ty=e.touches[0].clientY;tCancelled=false;
},{passive:true});
document.getElementById('modal-box').addEventListener('touchmove',e=>{
  const dx=Math.abs(e.touches[0].clientX-tx);
  const dy=Math.abs(e.touches[0].clientY-ty);
  if(dy>dx)tCancelled=true; /* vertical scroll intent — cancel swipe */
},{passive:true});
document.getElementById('modal-box').addEventListener('touchend',e=>{
  if(tCancelled)return;
  const d=e.changedTouches[0].clientX-tx;
  const dy=Math.abs(e.changedTouches[0].clientY-ty);
  /* Require clearly horizontal: >60px horizontal, <40px vertical drift */
  if(Math.abs(d)>60&&dy<40&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA')navModal(d<0?1:-1);
},{passive:true});

/* THEME */
function changeTheme(val){
  document.documentElement.setAttribute('data-theme',val);
  localStorage.setItem('study_theme',val);
}
(function(){
  const saved=localStorage.getItem('study_theme')||'paper';
  document.documentElement.setAttribute('data-theme',saved);
  const sel=document.getElementById('theme-select');
  if(sel)sel.value=saved;
})();

/* INIT */
initDynamicGroups();
updateStats();
updateProgress();
renderList();
setModalMode(modalMode);

/* ═══════════════════════════════════════
   100% CELEBRATION
═══════════════════════════════════════ */
function showCelebration(variant) {
  const ov = document.getElementById('celebrate-overlay');
  if (!ov) return;

  /* Swap content based on variant */
  const icon  = document.getElementById('cel-icon');
  const title = document.getElementById('cel-title');
  const sub   = document.getElementById('cel-sub');
  const quote = document.getElementById('cel-quote');

  if (variant === 'again') {
    /* Second+ time — quieter, warmer, no confetti */
    if (icon)  icon.textContent  = '🔁';
    if (title) title.textContent = 'You did it again.';
    if (sub)   sub.textContent   = 'Every problem. Again. On purpose.';
    if (quote) quote.innerHTML   =
      '"Some people study once and hope for the best.<br>' +
      'You came back. That\'s a different level of serious.<br>' +
      'The exam doesn\'t stand a chance."';
    /* subtle pulse instead of confetti */
    ov.classList.add('celebrate-again');
    spawnParticles();
  } else {
    /* First time — full confetti */
    if (icon)  icon.textContent  = '🏆';
    if (title) title.textContent = 'You finished everything.';
    if (sub)   sub.textContent   = 'Every single problem. Marked. Done.';
    if (quote) quote.innerHTML   =
      '"Most people open the page, scroll a bit, and close it.<br>' +
      'You actually did the work.<br>' +
      'That\'s not nothing — that\'s everything."';
    ov.classList.remove('celebrate-again');
    spawnConfetti();
  }

  ov.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeCelebration() {
  const ov = document.getElementById('celebrate-overlay');
  if (!ov) return;
  ov.classList.remove('active', 'celebrate-again');
  const scrollY = parseInt(document.body.dataset.scrollY || '0');
  document.body.classList.remove('modal-open');
  document.body.style.top = '';
  window.scrollTo(0, scrollY);
}

/* Full confetti — first time */
function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#3fb950','#58a6ff','#d29922','#f85149','#bc8cff','#79c0ff'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = [
      'left:'              + (Math.random() * 100) + '%',
      'background:'        + colors[Math.floor(Math.random() * colors.length)],
      'width:'             + (5 + Math.random() * 7) + 'px',
      'height:'            + (9 + Math.random() * 9) + 'px',
      'animation-delay:'   + (Math.random() * 1.4) + 's',
      'animation-duration:'+ (2.2 + Math.random() * 1.8) + 's',
      'border-radius:'     + (Math.random() > 0.5 ? '50%' : '2px'),
      'transform:rotate('  + (Math.random() * 360) + 'deg)',
    ].join(';');
    container.appendChild(p);
  }
}

/* Subtle rising particles — repeat visits */
function spawnParticles() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  const symbols = ['✓','★','✓','◆','✓'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece particle-piece';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.cssText = [
      'left:'              + (5 + Math.random() * 90) + '%',
      'color:'             + ['#3fb950','#58a6ff','#d29922'][Math.floor(Math.random()*3)],
      'font-size:'         + (12 + Math.random() * 10) + 'px',
      'animation-delay:'   + (Math.random() * 1.6) + 's',
      'animation-duration:'+ (2.8 + Math.random() * 1.4) + 's',
      'background:transparent',
      'width:auto','height:auto',
      'border-radius:0',
    ].join(';');
    container.appendChild(p);
  }
}