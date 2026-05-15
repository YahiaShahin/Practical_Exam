/* ═══════════════════════════════════
   DATA
═══════════════════════════════════ */
const SCOPE_RULES = {
  A:{ visible:['a'], note:'<strong>ScopeA is main().</strong> It is the outermost block. It can only see variables declared directly inside it: <strong>a</strong>.', why:'Think of scopes like nested rooms. A room can see its own furniture and the furniture of every room it is inside. ScopeA is the outermost room — nothing is outside it.', mistake:'Thinking a parent can reach into a child — it cannot. main() cannot see b, c, d, or e even though they are all declared somewhere inside it.' },
  B:{ visible:['a','b','e'], note:'<strong>ScopeB</strong> sees its own vars (<strong>b</strong>, <strong>e</strong>) plus everything in ScopeA (its parent): <strong>a</strong>. This is the <em>scope chain</em>.', why:'ScopeB is nested inside ScopeA. When C looks up a variable, it starts in the current scope, then walks outward one level at a time until found — or errors.', mistake:'Forgetting that e is visible here because it is declared in ScopeB itself. Order matters only inside the same scope (you cannot use a variable before its declaration line).' },
  C:{ visible:['a','b','c'], note:'<strong>ScopeC</strong> sees <strong>c</strong> (own) + <strong>b</strong> (parent B) + <strong>a</strong> (grandparent A). It <em>cannot</em> see <strong>d</strong> (sibling scope) or <strong>e</strong> (declared after C in B).', why:"Sibling scopes are completely blind to each other — separate rooms on the same floor. Once a scope's closing brace } is passed, its variables are gone from the stack.", mistake:'Assuming d is visible because it is at the same level — it is not. Scopes are not shared; they are sequential and isolated.' },
  D:{ visible:['a','b','d'], note:'<strong>ScopeD</strong> sees <strong>d</strong> (own) + <strong>b</strong> (parent B) + <strong>a</strong> (grandparent A). Cannot see <strong>c</strong> (sibling scope, already closed).', why:'Same logic as C — D inherits from its parents (B → A) but is isolated from sibling C. The chain only goes upward, never sideways.', mistake:'Thinking that because C and D are both children of B, they can see each other. They cannot — each scope is its own private bubble.' },
};

const OP_DATA = {
  '+':{title:'Addition',why:'The <code>+</code> operator adds two numeric values. Both operands must be compatible types — C will automatically promote an <code>int</code> to <code>float</code> if the other side is <code>float</code>.',note:'',code:`int x = 5 + 3;    // x = 8
float y = 1.5 + 2; // y = 3.5  ← int promoted to float`},
  '-':{title:'Subtraction',why:'Subtracts the right operand from the left. Result can be negative — C integers happily hold negative values.',note:'',code:`int x = 10 - 4;   // x = 6
int y = 3  - 7;   // y = -4  ← negative is fine`},
  '*':{title:'Multiplication',why:'Multiplies two operands. Watch for <strong>integer overflow</strong>: if the result exceeds the max value an int can hold (~2 billion), it wraps around silently.',note:'Large products can silently overflow. Use long for big numbers.',code:`int x = 3 * 7;         // x = 21
int big = 100000 * 100000; // OVERFLOW! undefined behavior`},
  '/':{title:'Division ⚠',why:'When <em>both</em> operands are integers, C performs <strong>integer division</strong> — it discards the decimal part entirely (does not round). To get a real result, at least one operand must be a float or double.',note:'Dividing two integers drops the decimal — 7/2 gives 3, not 3.5. Fix: write 7.0/2 or cast: (float)a / b.',code:`int    a = 7 / 2;       // a = 3   ← decimal DROPPED (not rounded!)
double b = 7.0 / 2;     // b = 3.5 ← one float = float result
double c = (double)7/2; // c = 3.5 ← explicit cast`},
  '%':{title:'Modulus (Remainder)',why:'Returns the leftover after integer division. The most classic use is checking even/odd: any number <code>% 2</code> is either 0 (even) or 1 (odd).',note:'Modulus only works with integers. Using it on floats is a compile error.',code:`int x = 7 % 3;   // x = 1  (7 = 3×2 + 1)
int y = 10 % 2;  // y = 0  → even number!
int z = 11 % 2;  // z = 1  → odd number
int h = 75 % 24; // h = 3  → hours remaining after whole days`},
  '++':{title:'Increment',why:'Adds 1 to a variable. Position matters: <strong>post-increment</strong> (x++) uses the current value in the expression first, then adds 1. <strong>Pre-increment</strong> (++x) adds 1 first, then uses the new value.',note:"Post-increment (x++) uses value first, then increases. Pre-increment (++x) increases first, then uses. Difference only matters when the result is assigned somewhere.",code:`int x = 5;
int a = x++;  // a = 5 (old value), then x becomes 6
int b = ++x;  // x becomes 7 first, b = 7 (new value)
x++;          // standalone: same as x = x + 1`},
  '--':{title:'Decrement',why:'Same logic as increment but subtracts 1. Very common in loops that count down.',note:'Same pre/post rules as increment. Standalone x-- and --x have identical effect.',code:`int x = 5;
int a = x--;  // a = 5 (old value), then x becomes 4
int b = --x;  // x becomes 3 first, b = 3`},
  '+=':{title:'Compound Assignment',why:'A shorthand combining an operation with assignment. <code>x += 3</code> is exactly equivalent to <code>x = x + 3</code>. Helps avoid typos like writing y instead of x on the right side.',note:'All arithmetic operators have compound forms: +=, -=, *=, /=, %=. All read as: "take x, apply, store back into x".',code:`int x = 10;
x += 5;  // x = 15  (x = x + 5)
x -= 3;  // x = 12  (x = x - 3)
x *= 2;  // x = 24  (x = x * 2)
x /= 4;  // x = 6   (x = x / 4, integer division)
x %= 4;  // x = 2   (x = x % 4)`},
};

const CONCEPT_DATA = {
  datatypes:{title:'Data Types',rows:[
    {code:'int x = 42;',text:'Whole numbers. Range ~−2 billion to +2 billion. 4 bytes. Use for counters, indices, anything without a decimal.'},
    {code:'float f = 3.14f;',text:'Decimal numbers, ~6–7 significant digits of precision. 4 bytes. The trailing f marks it as float (not double).'},
    {code:'double d = 3.14;',text:'Like float but double the precision (~15 sig digits). 8 bytes. Default for decimal literals in C.'},
    {code:"char c = 'A';",text:"A single character. Stored as its ASCII number ('A' = 65). Single quotes only — double quotes make a string."},
    {code:'char s[] = "hi";',text:'A string is an array of chars ending with a hidden \\0 (null terminator). "hi" is stored as [\'h\',\'i\',\'\\0\'].'},
  ],mistake:"Mixing up 'A' (char, single quotes) and \"A\" (string, double quotes). They are different types — a char is 1 byte, a string literal is a pointer to an array."},
  printf:{title:'printf Format Specifiers',rows:[
    {code:'%d',text:'Prints an int. The d stands for decimal integer.'},
    {code:'%f',text:'Prints a float or double. By default shows 6 decimal places.'},
    {code:'%.2f',text:'Prints a float with exactly 2 decimal places. The .2 is the precision specifier.'},
    {code:'%c',text:'Prints a single char.'},
    {code:'%s',text:'Prints a string (char array). Reads characters until it hits \\0.'},
    {code:'%lld',text:'Prints a long long int. Use when your integer might exceed ~2 billion. (On most platforms, plain long is also 32-bit — long long is the safe choice for large numbers.)'},
  ],mistake:'Using %d with a float variable or %f with an int. This causes garbage output — the format specifier must match the variable type exactly.'},
  scanf:{title:'scanf & the & Operator',rows:[
    {code:'scanf("%d", &x);',text:'Reads an integer from the keyboard and stores it in x. The & gives scanf the memory address of x so it knows where to write.'},
    {code:'scanf("%f", &f);',text:'Reads a float. Always use & — without it scanf has a garbage address and the program crashes or silently corrupts memory.'},
    {code:'scanf("%c", &c);',text:'Reads one character. Watch out: scanf leaves a newline in the buffer. If a previous scanf read a number, add a space before %c to skip it: scanf(" %c", &c).'},
    {code:'scanf("%s", name);',text:'Reads a string into a char array. Notice: NO & here — an array name is already a pointer (it already IS an address).'},
  ],mistake:'Forgetting & for scalar types (int, float, char) but including it for arrays (char[]). The rule: scalars need &, arrays do not.'},
  scope:{title:'Scope Rules',rows:[
    {code:'{ int x = 1; }',text:'x is created when this block opens and destroyed when it closes. Cannot be accessed outside.'},
    {code:'// child → parent',text:'A child scope can access all variables from its parent scopes (the scope chain goes upward).'},
    {code:'// parent → child',text:'A parent scope CANNOT access variables declared inside a child scope. Information flows upward only.'},
    {code:'// sibling → sibling',text:'Two scopes at the same level (siblings) are completely isolated. They cannot see each other\'s variables.'},
  ],mistake:'Assuming a variable is visible in a sibling scope just because they share the same parent. Scopes are isolated — visibility is only upward through the ancestry chain.'},
  loops:{title:'Loop Patterns',rows:[
    {code:'for (int i=0; i<n; i++)',text:'Classic counted loop. Use when you know exactly how many times to iterate. The init, condition, and update are all in one line.'},
    {code:'while (condition)',text:'Use when you do not know the count in advance — the loop runs as long as the condition is true. May run zero times.'},
    {code:'do { ... } while (cond)',text:'Same as while, but the body runs first, then the condition is checked. Always runs at least once. Good for menus and input validation.'},
    {code:'break / continue',text:'break exits the loop immediately. continue skips to the next iteration. Both work for all three loop types.'},
  ],mistake:'Writing the condition wrong for a while loop: if the condition starts false, the loop body never runs (this can be intentional with do-while instead).'},
};

/* ═══════════════════════════════════
   SCOPE
═══════════════════════════════════ */
function selectScope(s){
  ['A','B','C','D'].forEach(id=>{
    const b=document.getElementById('sb-'+id);
    if(b) b.classList.toggle('lit', id===s);
  });
  const rule=SCOPE_RULES[s];
  document.querySelectorAll('.scope-var').forEach(el=>{
    const v=el.dataset.var;
    el.classList.toggle('visible', rule.visible.includes(v));
    el.classList.toggle('hidden',  !rule.visible.includes(v));
  });
  const res=document.getElementById('scope-result');
  if(!res) return;
  res.innerHTML=
    '<strong style="color:var(--cyan)">Scope '+s+'</strong>: '+rule.note+
    '<div style="margin-top:8px;font-size:12px;color:var(--text3);font-family:var(--mono)">Accessible: <span style="color:var(--cyan)">'+rule.visible.join(', ')+'</span></div>'+
    '<div style="margin-top:6px;font-size:12px;color:var(--text2);line-height:1.6"><em>Why?</em> '+rule.why+'</div>'+
    '<div style="margin-top:10px;padding:8px 12px;background:rgba(224,92,107,.1);border-left:2px solid var(--red);border-radius:4px;font-size:12px;color:var(--text2)"><strong style="color:var(--red);font-size:10px;text-transform:uppercase;letter-spacing:.06em">Common Mistake</strong><br>'+rule.mistake+'</div>';
}

/* ═══════════════════════════════════
   OPERATORS
═══════════════════════════════════ */
function pickOp(card, sym){
  document.querySelectorAll('.op-card').forEach(c=>c.classList.remove('selected'));
  card.classList.add('selected');
  const d=OP_DATA[sym];
  document.getElementById('op-title').textContent=d.title;
  document.getElementById('op-why').innerHTML=d.why;
  const noteEl=document.getElementById('op-note');
  if(d.note){ noteEl.textContent=d.note; noteEl.style.display='block'; } else { noteEl.style.display='none'; }
  document.getElementById('op-code').textContent=d.code;
  document.getElementById('op-demo').style.display='block';
}

/* ═══════════════════════════════════
   CALCULATOR
═══════════════════════════════════ */
function doCalc(){
  const a=parseFloat(document.getElementById('ca').value)||0;
  const b=parseFloat(document.getElementById('cb2').value)||0;
  const op=document.getElementById('cop').value;
  const res=document.getElementById('cres');
  const note=document.getElementById('cnote');
  let r, n='';
  if(op==='+') r=a+b;
  else if(op==='-') r=a-b;
  else if(op==='*') r=a*b;
  else if(op==='/'){
    if(b===0){ res.textContent='ERR'; note.textContent='Cannot divide by zero — undefined in math and causes a crash in C.'; return; }
    r=Math.trunc(a/b);
    if(a%b!==0) n='⚠ Integer division: '+a+'/'+b+' in C gives '+r+', not '+(a/b).toFixed(4)+'. Use (float)'+a+'/'+b+' to get the decimal.';
  } else if(op==='%'){
    if(b===0){ res.textContent='ERR'; note.textContent='Cannot modulo by zero.'; return; }
    r=Math.trunc(a)%Math.trunc(b);
    n='Remainder of '+Math.trunc(a)+'÷'+Math.trunc(b)+'. Think: '+Math.trunc(a)+' = '+Math.trunc(b)+'×'+Math.floor(Math.trunc(a)/Math.trunc(b))+' + '+r;
  }
  res.textContent=r;
  note.textContent=n;
}
doCalc();

/* ═══════════════════════════════════
   PRINTF BUILDER
═══════════════════════════════════ */
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function buildPrintf(){
  const name=document.getElementById('pf-name').value||'';
  const score=parseInt(document.getElementById('pf-score').value)||0;
  const gpa=parseFloat(document.getElementById('pf-gpa').value)||0;
  document.getElementById('pf-code').innerHTML=
    '<span style="color:#c586c0">#include</span> <span style="color:#ce9178">&lt;stdio.h&gt;</span>\n'+
    '<span style="color:#569cd6">int</span> <span style="color:#dcdcaa">main</span>() {\n'+
    '    <span style="color:#569cd6">char</span>  name[]  = <span style="color:#ce9178">"'+esc(name)+'"</span>;\n'+
    '    <span style="color:#569cd6">int</span>   score   = <span style="color:#b5cea8">'+score+'</span>;\n'+
    '    <span style="color:#569cd6">float</span> gpa     = <span style="color:#b5cea8">'+gpa.toFixed(2)+'</span>f;\n\n'+
    '    <span style="color:#dcdcaa">printf</span>(<span style="color:#ce9178">"Student: %s\\n"</span>, name);\n'+
    '    <span style="color:#dcdcaa">printf</span>(<span style="color:#ce9178">"Score:   %d\\n"</span>, score);\n'+
    '    <span style="color:#dcdcaa">printf</span>(<span style="color:#ce9178">"GPA:     %.2f\\n"</span>, gpa);\n'+
    '    <span style="color:#c586c0">return</span> <span style="color:#b5cea8">0</span>;\n}';
  document.getElementById('pf-output').textContent=
    'Student: '+name+'\nScore:   '+score+'\nGPA:     '+gpa.toFixed(2);
}
buildPrintf();

/* ═══════════════════════════════════
   IF / ELSE
═══════════════════════════════════ */
const IF_EXPL = [
  {grade:'A', color:'var(--cyan)',  msg:'Score ≥ 90 → condition is true. The first branch runs immediately. All others are completely skipped — C never evaluates them once a match is found.'},
  {grade:'B', color:'#7ec8e3',     msg:'Score ≥ 75 and implicitly < 90 (because the first branch already failed). You don\'t need to write && score < 90 — reaching here proves the first condition was false.'},
  {grade:'C', color:'var(--gold)', msg:'Score ≥ 60. By the time we reach this else-if, we know the score is less than both 90 and 75. The chain acts as a cascading filter.'},
  {grade:'F', color:'var(--red)',  msg:'No condition matched → the bare else runs. It is the safety net with no condition — it catches everything that fell through all the checks above.'},
];
function runIf(){
  const v=parseInt(document.getElementById('score-sl').value);
  document.getElementById('score-disp').textContent=v;
  const cases=[
    {id:'if-r0',arr:'if-arr0',cond:v>=90,diam:'ifc-d0',body:'ifc-b0'},
    {id:'if-r1',arr:'if-arr1',cond:v>=75,diam:'ifc-d1',body:'ifc-b1'},
    {id:'if-r2',arr:'if-arr2',cond:v>=60,diam:'ifc-d2',body:'ifc-b2'},
    {id:'if-r3',arr:'if-arr3',cond:true,body:'ifc-b3'},
  ];
  let found=false, activeIdx=-1;
  cases.forEach((c,idx)=>{
    const row=document.getElementById(c.id);
    const arr=document.getElementById(c.arr);
    if(!row||!arr) return;
    row.classList.remove('active','inactive');
    arr.classList.remove('running');
    // update flowchart
    const b=document.getElementById(c.body);
    if(b) b.classList.remove('active-b');
    if(c.diam){ const d=document.getElementById(c.diam); if(d) d.classList.remove('active-d'); }
    if(!found&&c.cond){
      row.classList.add('active');
      arr.classList.add('running');
      arr.textContent='▶ runs';
      activeIdx=idx; found=true;
      if(b) b.classList.add('active-b');
      if(c.diam){ const d=document.getElementById(c.diam); if(d) d.classList.add('active-d'); }
    } else if(found){
      row.classList.add('inactive'); arr.textContent='skipped';
    } else {
      arr.textContent='false';
      if(c.diam){ const d=document.getElementById(c.diam); if(d) d.classList.add('active-d'); }
    }
  });
  const ex=IF_EXPL[activeIdx];
  const el=document.getElementById('if-explain');
  if(el&&ex) el.innerHTML='<span style="color:'+ex.color+';font-weight:700">Grade '+ex.grade+'</span> — '+ex.msg;
}
runIf();

/* ═══════════════════════════════════
   LOOPS
═══════════════════════════════════ */
const LOOP_PARAMS = {
  for:    {start:1,end:5,dir:'up'},
  while:  {start:5,end:1,dir:'down'},
  dowhile:{start:1,end:5,dir:'up'},
};
let curLoop='for', loopState=null, loopPhase='init', loopDone=false, loopTimer=null;

function phaseNote(type,phase,state,isAsc,start,end){
  const v=type==='for'?'i':'n';
  const val=state[v];
  const nextVal=isAsc?val+1:val-1;
  const op=isAsc?'<=':'>=';
  if(phase==='init'){
    if(type==='for') return `<strong>Init:</strong> <code>int i = ${start}</code>. We enter the loop for the first time. The variable <code>i</code> is born and set to ${start}. This only happens once!`;
    return `<strong>Init:</strong> <code>int n = ${start}</code> was declared before the loop. We arrive at the loop block.`;
  }
  if(phase==='check'){
    if(state.cond===null) return `<strong>Check:</strong> Time to test: is <code>${v} ${op} ${end}</code>? (is ${val} ${op} ${end}?)`;
    if(state.cond) return `<strong>Check:</strong> Is <code>${val} ${op} ${end}</code>? <strong style="color:var(--green)">YES (True).</strong> We proceed into the loop body.`;
    return `<strong>Check:</strong> Is <code>${val} ${op} ${end}</code>? <strong style="color:var(--red)">NO (False).</strong> The loop stops — we exit.`;
  }
  if(phase==='body') return `<strong>Body:</strong> Condition was true, so we execute the block. We print the current value: <strong style="color:var(--cyan)">${val}</strong>.`;
  if(phase==='step'){
    const action=isAsc?'incremented (+1)':'decremented (−1)';
    return `<strong>Update:</strong> Body finished. Now we update: <code>${v}</code> is ${action} → changes from <strong>${val}</strong> to <strong>${nextVal}</strong>. We go back to Check.`;
  }
  if(phase==='done') return `<strong>Loop Finished:</strong> The condition failed. We exit completely and continue with the rest of the program. Total iterations: <strong style="color:var(--cyan)">${state.iter}</strong>.`;
  return '';
}

function getCodeLines(type){
  const p=LOOP_PARAMS[type];
  const isAsc=p.dir==='up';
  const cond=(isAsc?'i <= ':'i >= ')+p.end;
  const inc=isAsc?'i++':'i--';
  if(type==='for') return [`for (int i = ${p.start}; ${cond}; ${inc}) {`, '    printf("%d\\n", i);', '}'];
  const ncond=(isAsc?'n <= ':'n >= ')+p.end;
  const ninc=(isAsc?'n++':'n--');
  if(type==='while') return [`int n = ${p.start};`, `while (${ncond}) {`, '    printf("%d\\n", n);', `    ${ninc};`, '}'];
  return [`int n = ${p.start};`, 'do {', '    printf("%d\\n", n);', `    ${ninc};`, `} while (${ncond});`];
}

function buildLoopCode(){
  const panel=document.getElementById('loop-code-panel');
  if(!panel) return;
  panel.innerHTML='';
  getCodeLines(curLoop).forEach((line,i)=>{
    const el=document.createElement('div');
    el.className='loop-line'; el.id='ll-'+i;
    el.innerHTML='<span class="ln">'+(i+1)+'</span><span>'+line+'</span>';
    panel.appendChild(el);
  });
}

function renderLoopParams(){
  const p=LOOP_PARAMS[curLoop];
  const el=document.getElementById('loop-params');
  if(!el) return;
  el.innerHTML=`<span style="color:var(--text2)">From</span>
    <input type="number" value="${p.start}" style="width:50px" oninput="updLP('${curLoop}','start',this.value)" onchange="updLP('${curLoop}','start',this.value)">
    <span style="color:var(--text2)">to</span>
    <input type="number" value="${p.end}" style="width:50px" oninput="updLP('${curLoop}','end',this.value)" onchange="updLP('${curLoop}','end',this.value)">
    <span style="color:var(--cyan);font-family:var(--mono);font-size:12px">${p.dir==='up'?'↑ ascending':'↓ descending'}</span>`;
}
function updLP(type,param,val){
  const parsed=parseInt(val);
  if(isNaN(parsed)) return; // ignore incomplete input while typing
  LOOP_PARAMS[type][param]=parsed;
  const p=LOOP_PARAMS[type];
  p.dir=p.start<=p.end?'up':'down';
  buildLoopCode(); renderLoopParams(); loopReset();
}

function switchLoop(type,btn){
  document.querySelectorAll('.loop-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  curLoop=type;
  buildLoopCode(); renderLoopParams(); loopReset();
}

function getInitState(){
  const p=LOOP_PARAMS[curLoop];
  if(curLoop==='for') return {i:p.start,cond:null,out:[],iter:0};
  return {n:p.start,cond:null,out:[],iter:0};
}

function updateLoopUI(activeLine){
  document.querySelectorAll('.loop-line').forEach((el,i)=>el.classList.toggle('active-line',i===activeLine));
  const useI=curLoop==='for';
  const showI=document.getElementById('lv-i'); if(showI) showI.style.display=useI?'block':'none';
  const showN=document.getElementById('lv-n'); if(showN) showN.style.display=useI?'none':'block';
  const iVal=document.getElementById('lv-i-val'); if(iVal) iVal.textContent=loopState.i!=null?loopState.i:'—';
  const nVal=document.getElementById('lv-n-val'); if(nVal) nVal.textContent=loopState.n!=null?loopState.n:'—';
  const cv=document.getElementById('lv-cond-val');
  if(cv){
    cv.textContent=loopState.cond===null?'—':(loopState.cond?'✓ true':'✗ false');
    cv.style.color=loopState.cond===null?'var(--text3)':(loopState.cond?'var(--green)':'var(--red)');
  }
  const it=document.getElementById('lv-iter'); if(it) it.textContent=loopState.iter;
  const out=document.getElementById('loop-output');
  if(out){
    if(!loopState.out.length) out.textContent='—';
    else out.innerHTML=loopState.out.map(v=>'<span class="out-n">'+v+'</span>').join('\n');
  }
}

function buildLoopFlowchart(type, phase, state, p) {
  const isAsc = p.dir === 'up';
  const v = type === 'for' ? 'i' : 'n';
  const val = state && state[v] !== undefined ? state[v] : '?';
  const condOp = isAsc ? '&lt;=' : '&gt;=';

  let initTxt = `int ${v} = ${p.start}`;
  let checkTxt = `${v} ${condOp} ${p.end}`;
  let bodyTxt = `printf("%d", ${v})`;
  let stepTxt = `${v}${isAsc ? '++' : '--'}`;
  
  // If the phase is active, we can highlight the actual numbers being used,
  // but we won't append long conversational explanations here.
  if (phase === 'init') {
    initTxt = `<span style="color:var(--cyan)">int ${v} = ${p.start}</span>`;
  }
  if (phase === 'check' && state && state.cond !== null) {
    const clr = state.cond ? 'var(--green)' : 'var(--red)';
    checkTxt = `<span style="color:${clr}">${val} ${condOp} ${p.end}</span>`;
  }
  if (phase === 'body') {
    bodyTxt = `printf("%d", <span style="color:var(--cyan)">${val}</span>)`;
  }
  if (phase === 'step') {
    stepTxt = `<span style="color:var(--cyan)">${v}${isAsc ? '++' : '--'}</span>`;
  }

  const getNode = (nodeType, text, isActive) => {
    if (nodeType === 'start') return `<div class="ifc-start ${isActive ? (phase==='done'?'done':'active') : ''}">${text}</div>`;
    if (nodeType === 'diamond') return `<div class="ifc-diamond ${isActive ? 'active-d' : ''}"><svg viewBox="0 0 130 60" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><polygon points="65,4 126,30 65,56 4,30" fill="var(--cyan-dim)" stroke="var(--border2)" stroke-width="1.5"/></svg><span>${text}</span></div>`;
    if (nodeType === 'box') return `<div class="ifc-body-box ${isActive ? 'active-b' : ''}">${text}</div>`;
    return '';
  };

  if (type === 'for' || type === 'while') {
    return `
    <div style="display:flex; flex-direction:column; align-items:center; font-family:var(--mono); font-size:12px; width:100%;">
      ${getNode('start', initTxt, phase === 'init')}
      <div class="fc-arr-v"></div>
      ${getNode('diamond', checkTxt, phase === 'check')}
      <div style="display:flex; gap:24px; align-items:flex-start; margin-top:2px;">
        <div style="display:flex; flex-direction:column; align-items:center">
          <div class="ifc-yes" style="margin-bottom:0">YES</div>
          <div class="fc-arr-v"></div>
          ${getNode('box', bodyTxt, phase === 'body')}
          <div class="fc-arr-v"></div>
          ${getNode('box', stepTxt, phase === 'step')}
          <div class="fc-arr-turn"></div>
          <div style="font-size:10px;color:var(--text3)">(back to check)</div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center">
          <div class="ifc-no" style="margin-bottom:0">NO</div>
          <div class="fc-arr-v"></div>
          ${getNode('start', 'Done', phase === 'done')}
        </div>
      </div>
    </div>`;
  } else {
    return `
    <div style="display:flex; flex-direction:column; align-items:center; font-family:var(--mono); font-size:12px; width:100%;">
      ${getNode('start', initTxt, phase === 'init')}
      <div class="fc-arr-v"></div>
      ${getNode('box', bodyTxt, phase === 'body')}
      <div class="fc-arr-v"></div>
      ${getNode('box', stepTxt, phase === 'step')}
      <div class="fc-arr-v"></div>
      ${getNode('diamond', checkTxt, phase === 'check')}
      <div style="display:flex; gap:24px; align-items:flex-start; margin-top:2px;">
        <div style="display:flex; flex-direction:column; align-items:center">
          <div class="ifc-yes" style="margin-bottom:0">YES</div>
          <div class="fc-arr-turn"></div>
          <div style="font-size:10px;color:var(--text3)">(back to body)</div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center">
          <div class="ifc-no" style="margin-bottom:0">NO</div>
          <div class="fc-arr-v"></div>
          ${getNode('start', 'Done', phase === 'done')}
        </div>
      </div>
    </div>`;
  }
}

/* ── Tokenizer (shared) ── */
function tokenizeLine(raw) {
  const keywords = ['printf', 'while', 'for', 'do', 'int'];
  let result = '', j = 0;
  while (j < raw.length) {
    if (raw[j] === '"') {
      let end = j + 1;
      while (end < raw.length && raw[end] !== '"') end++;
      end++;
      result += `<span class="lc-str">${raw.slice(j,end).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`;
      j = end; continue;
    }
    let matched = false;
    for (const kw of keywords) {
      if (raw.startsWith(kw, j)) {
        const before = j > 0 ? raw[j-1] : ' ';
        const after = j + kw.length < raw.length ? raw[j + kw.length] : ' ';
        if (!/\w/.test(before) && !/\w/.test(after)) {
          result += `<span class="lc-kw">${kw}</span>`;
          j += kw.length; matched = true; break;
        }
      }
    }
    if (matched) continue;
    if (/\d/.test(raw[j])) {
      const before = j > 0 ? raw[j-1] : ' ';
      if (!/\w/.test(before)) {
        let numEnd = j;
        while (numEnd < raw.length && /\d/.test(raw[numEnd])) numEnd++;
        const after = numEnd < raw.length ? raw[numEnd] : ' ';
        if (!/\w/.test(after)) {
          result += `<span class="lc-num">${raw.slice(j, numEnd)}</span>`;
          j = numEnd; continue;
        }
      }
    }
    const ch = raw[j];
    result += ch==='&'?'&amp;':ch==='<'?'&lt;':ch==='>'?'&gt;':ch;
    j++;
  }
  return result;
}

/* Build the 3-panel grid once; patch inner content on each step */
function initLoopVizPanel() {
  const el = document.getElementById('phase-note');
  if (!el || el.querySelector('.loop-viz-wrap')) return;
  el.innerHTML = `
    <div class="loop-viz-wrap">
      <div class="loop-fc-panel" id="lv-fc-panel"></div>
      <div class="loop-code-side">
        <div class="loop-code-side-hdr">
          <span class="loop-code-side-title">C Code</span>
          <span class="loop-phase-badge" id="lv-phase-badge">READY</span>
        </div>
        <div class="loop-code-side-body" id="lv-code-body"></div>
      </div>
      <div class="loop-expl-panel">
        <div class="loop-expl-label">Execution State</div>
        <div class="loop-phase-display">Phase: <span class="loop-phase-name" id="lv-phase-name">READY</span></div>
        <div class="loop-expl-msg" id="lv-expl-msg">Hit <strong>Step</strong> or <strong>Play</strong> to watch the loop execute phase by phase.</div>
      </div>
    </div>`;
}

function seedCodeLines() {
  const codeBody = document.getElementById('lv-code-body');
  if (!codeBody) return;
  codeBody.innerHTML = getCodeLines(curLoop).map((line, i) =>
    `<div class="lc-line" id="lv-cl-${i}"><span class="lc-ln">${i+1}</span><span class="lc-code">${tokenizeLine(line)}</span></div>`
  ).join('');
}

function setPhaseNote(msg, phase) {
  initLoopVizPanel();

  const phaseLabels = { init:'INIT', check:'CONDITION', body:'BODY', step:'UPDATE', done:'DONE', '':'READY' };
  const phaseLabel = phaseLabels[phase] || 'READY';
  const stateMsg = msg || 'Hit <strong>Step</strong> or <strong>Play</strong> to watch the loop execute phase by phase.';

  /* 1 — flowchart: only replace inner HTML of the fixed-size panel */
  const fcPanel = document.getElementById('lv-fc-panel');
  if (fcPanel) fcPanel.innerHTML = buildLoopFlowchart(curLoop, phase, loopState, LOOP_PARAMS[curLoop]);

  /* 2 — phase badge: swap class + text, never rebuild the container */
  const badge = document.getElementById('lv-phase-badge');
  if (badge) { badge.className = `loop-phase-badge loop-phase-${phase || 'ready'}`; badge.textContent = phaseLabel; }

  /* 3 — code lines: just toggle lc-active on existing rows */
  const phaseLineMap = {
    for:    { init:0, check:0, body:1, step:0, done:null },
    while:  { init:0, check:1, body:2, step:3, done:null },
    dowhile:{ init:0, body:2, step:3, check:4, done:null },
  };
  const activeLine = phase ? (phaseLineMap[curLoop]?.[phase] ?? null) : null;
  const codeBody = document.getElementById('lv-code-body');
  if (codeBody) {
    if (!codeBody.children.length) seedCodeLines();
    Array.from(codeBody.children).forEach((row, i) => row.classList.toggle('lc-active', i === activeLine));
  }

  /* 4 — explanation text */
  const phaseName = document.getElementById('lv-phase-name');
  if (phaseName) phaseName.textContent = phaseLabel;
  const explMsg = document.getElementById('lv-expl-msg');
  if (explMsg) explMsg.innerHTML = stateMsg;

}

function flashVar(v){
  const el=document.getElementById('lv-'+v+'-val');
  if(!el) return;
  el.classList.add('flash');
  setTimeout(()=>el.classList.remove('flash'),400);
}

function executeStep(){
  if(loopDone) return;
  const prev={...loopState,out:[...loopState.out]};
  let codeLine=0;
  const p=LOOP_PARAMS[curLoop];
  const isAsc=p.dir==='up';

  if(curLoop==='for'){
    if(loopPhase==='init'){ loopState.i=p.start; codeLine=0; loopPhase='check'; setPhaseNote(phaseNote('for','init',loopState,isAsc,p.start,p.end),'init'); }
    else if(loopPhase==='check'){ loopState.cond=isAsc?(loopState.i<=p.end):(loopState.i>=p.end); codeLine=0; setPhaseNote(phaseNote('for','check',loopState,isAsc,p.start,p.end),'check'); if(loopState.cond) loopPhase='body'; else loopPhase='done'; }
    else if(loopPhase==='body'){ loopState.out=[...loopState.out,loopState.i]; codeLine=1; loopPhase='step'; setPhaseNote(phaseNote('for','body',loopState,isAsc,p.start,p.end),'body'); }
    else if(loopPhase==='step'){ setPhaseNote(phaseNote('for','step',loopState,isAsc,p.start,p.end),'step'); if(isAsc) loopState.i++; else loopState.i--; codeLine=0; loopState.iter++; loopPhase='check'; }
  } else if(curLoop==='while'){
    if(loopPhase==='init'){ loopState.n=p.start; codeLine=0; loopPhase='check'; setPhaseNote(phaseNote('while','init',loopState,isAsc,p.start,p.end),'init'); }
    else if(loopPhase==='check'){ loopState.cond=isAsc?(loopState.n<=p.end):(loopState.n>=p.end); codeLine=1; setPhaseNote(phaseNote('while','check',loopState,isAsc,p.start,p.end),'check'); if(loopState.cond) loopPhase='body'; else loopPhase='done'; }
    else if(loopPhase==='body'){ loopState.out=[...loopState.out,loopState.n]; codeLine=2; loopPhase='step'; setPhaseNote(phaseNote('while','body',loopState,isAsc,p.start,p.end),'body'); }
    else if(loopPhase==='step'){ setPhaseNote(phaseNote('while','step',loopState,isAsc,p.start,p.end),'step'); if(isAsc) loopState.n++; else loopState.n--; codeLine=3; loopState.iter++; loopPhase='check'; }
  } else {
    if(loopPhase==='init'){ loopState.n=p.start; codeLine=0; loopPhase='body'; setPhaseNote(phaseNote('dowhile','init',loopState,isAsc,p.start,p.end),'init'); }
    else if(loopPhase==='body'){ loopState.out=[...loopState.out,loopState.n]; codeLine=2; loopPhase='step'; setPhaseNote(phaseNote('dowhile','body',loopState,isAsc,p.start,p.end),'body'); }
    else if(loopPhase==='step'){ setPhaseNote(phaseNote('dowhile','step',loopState,isAsc,p.start,p.end),'step'); if(isAsc) loopState.n++; else loopState.n--; codeLine=3; loopPhase='check'; }
    else if(loopPhase==='check'){ loopState.cond=isAsc?(loopState.n<=p.end):(loopState.n>=p.end); codeLine=4; setPhaseNote(phaseNote('dowhile','check',loopState,isAsc,p.start,p.end),'check'); if(loopState.cond){ loopState.iter++; loopPhase='body'; } else loopPhase='done'; }
  }

  if(loopPhase==='done'){
    loopDone=true; clearInterval(loopTimer); loopTimer=null;
    const pb=document.getElementById('btn-play'); if(pb) pb.textContent='Play ▶';
    updateLoopUI(null);
    const out=document.getElementById('loop-output');
    if(out) out.innerHTML+=(loopState.out.length?'\n':'')+'<span style="color:var(--text3);font-size:11px">─── loop finished ───</span>';
    setPhaseNote(phaseNote(curLoop,'done',loopState,true,0,0),'done');
    return;
  }
  ['i','n'].forEach(v=>{ if(loopState[v]!==undefined&&prev[v]!==loopState[v]) flashVar(v); });
  updateLoopUI(codeLine);
}

function loopStep(){ if(!loopDone) executeStep(); }
function loopPlay(){
  if(loopTimer){ clearInterval(loopTimer); loopTimer=null; const b=document.getElementById('btn-play'); if(b) b.textContent='Play ▶'; return; }
  if(loopDone) loopReset();
  const b=document.getElementById('btn-play'); if(b) b.textContent='Pause ⏸';
  function tick(){ if(loopDone){ const bx=document.getElementById('btn-play'); if(bx) bx.textContent='Play ▶'; return; } executeStep(); const spd=1500-parseInt(document.getElementById('loop-spd').value); loopTimer=setTimeout(tick,spd); }
  loopTimer=setTimeout(tick,1500-parseInt(document.getElementById('loop-spd').value));
}
function loopReset(){
  clearInterval(loopTimer); loopTimer=null;
  loopState=getInitState(); loopPhase='init'; loopDone=false;
  buildLoopCode(); renderLoopParams(); updateLoopUI(null);
  const b=document.getElementById('btn-play'); if(b) b.textContent='Play ▶';
  /* clear the persistent code panel so seedCodeLines rebuilds it for the new loop type */
  const codeBody=document.getElementById('lv-code-body');
  if(codeBody) codeBody.innerHTML='';
  setPhaseNote('','');
}
loopReset();

/* ═══════════════════════════════════
   ARRAYS
═══════════════════════════════════ */
let arrData=new Array(8).fill(0), arrSel=null;
const BASE=0x1000;

function renderArr(){
  const mem=document.getElementById('arr-mem'); if(!mem) return;
  mem.innerHTML='';
  arrData.forEach((v,i)=>{
    const slot=document.createElement('div'); slot.className='arr-slot';
    const addr='0x'+(BASE+i*4).toString(16).toUpperCase();
    slot.innerHTML=
      '<div class="arr-addr">'+addr+'</div>'+
      '<div class="arr-box'+(i===arrSel?' sel':'')+'" id="ab-'+i+'" onclick="arrClick('+i+')">'+v+'</div>'+
      '<div class="arr-idx">['+i+']</div>';
    mem.appendChild(slot);
  });
}
function arrClick(i){
  arrSel=i; renderArr();
  const addr='0x'+(BASE+i*4).toString(16).toUpperCase();
  const isLast = i === arrData.length - 1;
  const nextInfo = isLast
    ? `<span style="font-size:11px;color:var(--red)">arr[${i+1}] would be OUT OF BOUNDS — valid indices are 0–${arrData.length-1}</span>`
    : `<span style="font-size:11px;color:var(--text3)">Next: 0x${(BASE+(i+1)*4).toString(16).toUpperCase()} (i+1 = +4 bytes)</span>`;
  document.getElementById('arr-info').innerHTML=
    '<strong>arr['+i+']</strong> = <strong style="color:var(--cyan)">'+arrData[i]+'</strong>'+
    ' &nbsp;|&nbsp; index: <strong>'+i+'</strong>'+
    ' &nbsp;|&nbsp; address: <code>'+addr+'</code>'+
    ' &nbsp;|&nbsp; '+nextInfo;
  document.getElementById('arr-edit-lbl').style.display='inline';
  document.getElementById('arr-edit-idx').textContent=i;
  const inp=document.getElementById('arr-edit-val');
  inp.style.display='inline'; inp.value=arrData[i]; inp.focus();
  renderArrCode();
}
function arrResize(){
  const size=Math.max(1,Math.min(16,parseInt(document.getElementById('arr-size').value)||1));
  while(arrData.length<size) arrData.push(0);
  while(arrData.length>size) arrData.pop();
  if(arrSel>=arrData.length) arrSel=null;
  renderArr(); renderArrCode();
}
function arrEditVal(){
  if(arrSel===null) return;
  arrData[arrSel]=parseInt(document.getElementById('arr-edit-val').value)||0;
  renderArr(); renderArrCode();
}
function renderArrCode(){
  const c=document.getElementById('arr-code'); if(!c) return;
  const items=arrData.map(v=>`<span style="color:#b5cea8">${v}</span>`).join(', ');
  const n=arrData.length;
  c.innerHTML=
    `<span style="color:#6a9955">// array of ${n} ints = ${n*4} bytes in memory</span>\n`+
    `<span style="color:#569cd6">int</span> arr[<span style="color:#b5cea8">${n}</span>] = {${items}};\n\n`+
    `<span style="color:#6a9955">// access elements by index (0 to ${n-1})</span>\n`+
    `<span style="color:#569cd6">int</span> first  = arr[<span style="color:#b5cea8">0</span>];   <span style="color:#6a9955">// = ${arrData[0]}</span>\n`+
    `<span style="color:#569cd6">int</span> last   = arr[<span style="color:#b5cea8">${n-1}</span>];  <span style="color:#6a9955">// = ${arrData[n-1]}</span>\n\n`+
    `<span style="color:#6a9955">// loop through entire array</span>\n`+
    `<span style="color:#c586c0">for</span> (<span style="color:#569cd6">int</span> i = <span style="color:#b5cea8">0</span>; i < <span style="color:#b5cea8">${n}</span>; i++) {\n`+
    `    <span style="color:#dcdcaa">printf</span>(<span style="color:#ce9178">"%d\\n"</span>, arr[i]);\n}`;
}
renderArr(); renderArrCode();

/* ═══════════════════════════════════
   2D ARRAYS
═══════════════════════════════════ */
let MAT=[[1,2,3,4],[5,6,7,8],[9,10,11,12]], matSel=null;

function renderMat(){
  const c=document.getElementById('mat-container'); if(!c) return;
  c.innerHTML='';
  const rows=MAT.length, cols=MAT[0].length;
  const chRow=document.createElement('div'); chRow.className='mat-ch-row';
  for(let col=0;col<cols;col++){ const l=document.createElement('div'); l.className='mat-ch'; l.textContent='['+col+']'; l.onmouseenter=()=>hiCol(col,true); l.onmouseleave=()=>hiCol(col,false); chRow.appendChild(l); }
  c.appendChild(chRow);
  MAT.forEach((row,r)=>{
    const rowEl=document.createElement('div'); rowEl.className='mat-row';
    const rl=document.createElement('div'); rl.className='mat-rl'; rl.textContent='['+r+']'; rl.onmouseenter=()=>hiRow(r,true); rl.onmouseleave=()=>hiRow(r,false); rowEl.appendChild(rl);
    row.forEach((v,col)=>{
      const cell=document.createElement('div'); cell.className='mat-cell'; cell.id='mc-'+r+'-'+col;
      cell.textContent=v;
      cell.onmouseenter=()=>{ hiRow(r,true); hiCol(col,true); };
      cell.onmouseleave=()=>{ hiRow(r,false); hiCol(col,false); };
      cell.onclick=()=>matClick(r,col,v);
      if(matSel&&matSel[0]===r&&matSel[1]===col) cell.classList.add('sel');
      rowEl.appendChild(cell);
    });
    c.appendChild(rowEl);
  });
}
function matResize(){
  const rows=Math.max(1,Math.min(6,parseInt(document.getElementById('mat-rows').value)||1));
  const cols=Math.max(1,Math.min(8,parseInt(document.getElementById('mat-cols').value)||1));
  while(MAT.length<rows) MAT.push(new Array(MAT[0]?MAT[0].length:cols).fill(0));
  while(MAT.length>rows) MAT.pop();
  MAT.forEach(row=>{ while(row.length<cols) row.push(0); while(row.length>cols) row.pop(); });
  if(matSel&&(matSel[0]>=rows||matSel[1]>=cols)) matSel=null;
  renderMat(); renderMatCode();
}
function hiRow(r,on){ for(let col=0;col<MAT[0].length;col++){ const el=document.getElementById('mc-'+r+'-'+col); if(el&&!(matSel&&matSel[0]===r&&matSel[1]===col)) el.classList.toggle('row-hi',on); } }
function hiCol(col,on){ for(let r=0;r<MAT.length;r++){ const el=document.getElementById('mc-'+r+'-'+col); if(el&&!(matSel&&matSel[0]===r&&matSel[1]===col)) el.classList.toggle('col-hi',on); } }
function matClick(r,col,v){
  matSel=[r,col];
  document.querySelectorAll('.mat-cell').forEach(el=>el.classList.remove('sel','row-hi','col-hi'));
  const cell=document.getElementById('mc-'+r+'-'+col); if(cell) cell.classList.add('sel');
  const flatIdx=r*MAT[0].length+col;
  document.getElementById('mat-info').innerHTML=
    '<strong>mat['+r+']['+col+']</strong> = <strong style="color:var(--cyan)">'+v+'</strong>'+
    ' &nbsp;|&nbsp; row <strong>'+r+'</strong>, col <strong>'+col+'</strong>'+
    ' &nbsp;|&nbsp; <span style="font-size:11px;color:var(--text3)">flat index: '+flatIdx+' ('+r+'×'+MAT[0].length+' + '+col+' = '+flatIdx+')</span>';
  const ed=document.getElementById('mat-edit'); if(ed) ed.style.display='flex';
  document.getElementById('mat-edit-r').textContent=r;
  document.getElementById('mat-edit-c').textContent=col;
  const inp=document.getElementById('mat-edit-val'); if(inp){ inp.value=v; inp.focus(); }
}
function matEditVal(){
  if(!matSel) return;
  const [r,col]=matSel;
  const val=parseInt(document.getElementById('mat-edit-val').value)||0;
  MAT[r][col]=val; renderMat(); renderMatCode();
}
function renderMatCode(){
  const c=document.getElementById('mat-code'); if(!c) return;
  const rows=MAT.length, cols=MAT[0].length;
  const body=MAT.map(row=>{ const items=row.map(v=>`<span style="color:#b5cea8">${v}</span>`).join(', '); return `    {${items}}`; }).join(',\n');
  c.innerHTML=
    `<span style="color:#6a9955">// ${rows} rows × ${cols} cols = ${rows*cols} elements, ${rows*cols*4} bytes</span>\n`+
    `<span style="color:#569cd6">int</span> mat[<span style="color:#b5cea8">${rows}</span>][<span style="color:#b5cea8">${cols}</span>] = {\n${body}\n};\n\n`+
    `<span style="color:#6a9955">// access: mat[row][col] — zero-indexed</span>\n`+
    `<span style="color:#6a9955">// flat index = row × ${cols} + col</span>`;
}
renderMat(); renderMatCode();

/* ═══════════════════════════════════
   CONCEPTS
═══════════════════════════════════ */
function showConcept(key,btn){
  document.querySelectorAll('.ctab').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const d=CONCEPT_DATA[key]; if(!d) return;
  const area=document.getElementById('concept-area'); if(!area) return;
  area.innerHTML=
    `<div class="demo"><div class="demo-label">${d.title}</div>`+
    d.rows.map(r=>`<div class="bk-row"><div class="bk-code">${r.code}</div><div class="bk-text">${r.text}</div></div>`).join('')+
    `<div class="warn-box"><span class="warn-title">Common Mistake</span><p>${d.mistake}</p></div></div>`;
}

/* ═══════════════════════════════════
   MODE TOGGLE
═══════════════════════════════════ */
let mode='detailed';
function setMode(m){
  mode=m;
  const tog=document.getElementById('tog');
  const ld=document.getElementById('lbl-det');
  const lb=document.getElementById('lbl-brief');
  const main=document.querySelector('.main');
  if(m==='brief'){
    tog.classList.add('brief');
    lb.classList.add('on'); ld.classList.remove('on');
    document.querySelectorAll('.prose').forEach(el=>el.style.display='none');
  } else {
    tog.classList.remove('brief');
    ld.classList.add('on'); lb.classList.remove('on');
    document.querySelectorAll('.prose').forEach(el=>el.style.display='');
  }
}
function toggleMode(){ setMode(mode==='detailed'?'brief':'detailed'); }

/* ═══════════════════════════════════
   PROGRESS / SCROLL SPY / BTT
═══════════════════════════════════ */
const sectionIds=['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11'];
const viewed=new Set();
sectionIds.forEach(id=>{
  const el=document.getElementById(id);
  if(!el) return;
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        viewed.add(id);
        updateProg();
        // update sidebar
        document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
        const a=document.querySelector('.nav-item[href="#'+id+'"]');
        if(a) a.classList.add('active');
      }
    });
  },{rootMargin:'-30% 0px -60% 0px'}).observe(el);
});
function updateProg(){
  const pct=viewed.size/11*100;
  const fill=document.getElementById('prog-fill');
  const lbl=document.getElementById('prog-label');
  if(fill) fill.style.width=pct+'%';
  if(lbl) lbl.textContent=viewed.size+' / 11 viewed';
}

/* ═══════════════════════════════════
   ORDER OF OPERATIONS (S4)
═══════════════════════════════════ */
const PREC_EXAMPLES = [
  {
    label: 'Pre-increment has highest priority',
    expr:  '++x * 2  where x = 3',
    steps: [
      { op: '++x',    result: 'x becomes 4',  note: 'Pre-increment fires first — x is now 4' },
      { op: '4 * 2',  result: '8',             note: 'Then multiplication' },
    ],
    final: '8',
    code:  'int x = 3;\nint r = ++x * 2;  // r = 8  (x is 4 first, then 4*2)'
  },
  {
    label: '* and % before +',
    expr:  '2 + 3 * 4 % 5',
    steps: [
      { op: '3 * 4',  result: '12',  note: '* and % have equal priority — go left to right' },
      { op: '12 % 5', result: '2',   note: 'Remainder of 12 ÷ 5' },
      { op: '2 + 2',  result: '4',   note: '+ is last' },
    ],
    final: '4',
    code:  'int r = 2 + 3 * 4 % 5;\n// step 1: 3*4 = 12\n// step 2: 12%5 = 2\n// step 3: 2+2 = 4  →  r = 4'
  },
  {
    label: 'Addition left to right',
    expr:  '10 - 3 + 2',
    steps: [
      { op: '10 - 3', result: '7',  note: 'Same priority — evaluate left to right' },
      { op: '7 + 2',  result: '9',  note: 'Then add 2' },
    ],
    final: '9',
    code:  'int r = 10 - 3 + 2;\n// step 1: 10-3 = 7\n// step 2: 7+2  = 9  →  r = 9'
  },
  {
    label: 'Arithmetic before comparison',
    expr:  'x + 1 > 5  where x = 4',
    steps: [
      { op: 'x + 1',  result: '5',      note: 'Arithmetic runs before comparison operators' },
      { op: '5 > 5',  result: '0 (false)', note: 'Comparison runs after arithmetic is resolved' },
    ],
    final: '0 (false)',
    code:  'int x = 4;\nif (x + 1 > 5)   // 4+1=5, then 5>5 → false (0)\n    printf("yes");\nelse\n    printf("no");  // prints "no"'
  },
  {
    label: 'Comparison before equality',
    expr:  '3 < 5 == 1',
    steps: [
      { op: '3 < 5',  result: '1 (true)', note: '< has higher priority than ==' },
      { op: '1 == 1', result: '1 (true)', note: 'Then equality check' },
    ],
    final: '1 (true)',
    code:  'int r = 3 < 5 == 1;\n// step 1: 3<5  → 1 (true)\n// step 2: 1==1 → 1 (true)  →  r = 1'
  },
  {
    label: '&& before ||',
    expr:  '0 || 1 && 1',
    steps: [
      { op: '1 && 1', result: '1 (true)',  note: '&& binds tighter than || — evaluated first' },
      { op: '0 || 1', result: '1 (true)',  note: '|| is evaluated last among logical operators' },
    ],
    final: '1 (true)',
    code:  'int r = 0 || 1 && 1;\n// step 1: 1&&1 → 1\n// step 2: 0||1 → 1  →  r = 1\n\n// Compare: (0||1) && 1 → 1&&1 → 1  (same here)\n// But:     0 || (0&&1) → 0||0 → 0  (different!)'
  },
  {
    label: '|| is lowest logical operator',
    expr:  '1 && 0 || 1 && 1',
    steps: [
      { op: '1 && 0', result: '0 (false)', note: 'Left && first (left to right)' },
      { op: '1 && 1', result: '1 (true)',  note: 'Right && next' },
      { op: '0 || 1', result: '1 (true)',  note: '|| last' },
    ],
    final: '1 (true)',
    code:  'int r = 1&&0 || 1&&1;\n// step 1: 1&&0 → 0\n// step 2: 1&&1 → 1\n// step 3: 0||1 → 1  →  r = 1'
  },
  {
    label: 'Assignment is always last',
    expr:  'x = 2 + 3 * 4',
    steps: [
      { op: '3 * 4',  result: '12', note: 'Multiplication first' },
      { op: '2 + 12', result: '14', note: 'Then addition' },
      { op: 'x = 14', result: 'x is 14', note: 'Assignment stores the final result' },
    ],
    final: 'x = 14',
    code:  'int x;\nx = 2 + 3 * 4;\n// step 1: 3*4  = 12\n// step 2: 2+12 = 14\n// step 3: x=14  →  x is now 14'
  },
];

function showPrecEx(idx) {
  const rows = document.querySelectorAll('.prec-row:not(.prec-hdr)');
  rows.forEach((r, i) => r.classList.toggle('prec-row-active', i === idx));

  const ex = PREC_EXAMPLES[idx];
  const box = document.getElementById('prec-ex-box');
  const label = document.getElementById('prec-ex-label');
  const steps = document.getElementById('prec-steps');
  const result = document.getElementById('prec-result');

  label.textContent = ex.label + ' — evaluating: ' + ex.expr;

  steps.innerHTML = ex.steps.map((s, i) =>
    `<div class="prec-step">
      <span class="prec-step-num">${i + 1}</span>
      <span class="prec-step-op"><code>${s.op}</code></span>
      <span class="prec-step-arrow">→</span>
      <span class="prec-step-res">${s.result}</span>
      <span class="prec-step-note">${s.note}</span>
    </div>`
  ).join('');

  result.innerHTML =
    `<div class="prec-final-label">Final result</div>` +
    `<div class="prec-final-val">${ex.final}</div>` +
    `<div class="cb prec-code-block">${ex.code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;

  box.style.display = 'block';
}

/* ═══════════════════════════════════
   FUNCTIONS (S8)
═══════════════════════════════════ */
const FN_TYPES = [
  {
    title: 'Type 1 — void, no parameters',
    tag: 'void fn(void)',
    expl: 'This function does a job and exits. It receives nothing from the caller and sends nothing back. The keyword <code>void</code> as the return type means "I return nothing". The keyword <code>void</code> in the parameter list means "I take no input".',
    anatomy: [
      { part: 'void',    role: 'Return type — this function returns nothing' },
      { part: 'greet',   role: 'Function name — describes what it does' },
      { part: '(void)',  role: 'Parameter list — empty, no input needed' },
      { part: 'return;', role: 'Optional early exit — no value needed with void' },
    ],
    tip: 'Use void functions for side effects: printing output, drawing a line, playing a sound. They change the world but don\'t compute a value.',
    code:
`#include <stdio.h>

void greet(void) {
    printf("Hello, student!\\n");
    printf("Good luck on your exam.\\n");
}   /* no return needed */

int main() {
    greet();   /* call it — no arguments, no result */
    greet();   /* call it again — reuse for free */
    return 0;
}`
  },
  {
    title: 'Type 2 — void, with parameters',
    tag: 'void fn(int a, int b)',
    expl: 'This function receives data through its parameters and acts on it, but does not hand anything back. The caller passes values in; the function uses them internally. Parameters are local copies — changing them inside the function does not affect the original variables.',
    anatomy: [
      { part: 'void',         role: 'Return type — still returns nothing' },
      { part: 'printSum',     role: 'Function name' },
      { part: '(int a, int b)', role: 'Two parameters — the function receives two integers' },
      { part: 'a + b',        role: 'Uses the parameters internally' },
    ],
    tip: 'Parameters are local copies. If you do <code>a = 99</code> inside the function, the original variable in main() is unchanged. This is called pass-by-value.',
    code:
`#include <stdio.h>

void printSum(int a, int b) {
    int sum = a + b;
    printf("%d + %d = %d\\n", a, b, sum);
}

int main() {
    printSum(3, 7);    /* prints: 3 + 7 = 10 */
    printSum(10, 20);  /* prints: 10 + 20 = 30 */
    return 0;
}`
  },
  {
    title: 'Type 3 — has return, no parameters',
    tag: 'int fn(void)',
    expl: 'This function computes or reads something and hands the result back to the caller using <code>return</code>. It needs no input — it figures out the value on its own. The return type tells the compiler (and the reader) exactly what type of value comes back.',
    anatomy: [
      { part: 'int',       role: 'Return type — this function sends back an int' },
      { part: 'getScore',  role: 'Function name' },
      { part: '(void)',    role: 'No parameters — needs no input' },
      { part: 'return val;', role: 'Sends the value back to whoever called the function' },
    ],
    tip: 'The <code>return</code> statement immediately exits the function and sends the value back. Any code after <code>return</code> in the same block is unreachable.',
    code:
`#include <stdio.h>

int getScore(void) {
    int score;
    printf("Enter your score: ");
    scanf("%d", &score);
    return score;   /* send it back */
}

int main() {
    int s = getScore();   /* s receives the returned value */
    printf("You scored: %d\\n", s);
    return 0;
}`
  },
  {
    title: 'Type 4 — has return, has parameters',
    tag: 'int fn(int a, int b)',
    expl: 'The most common function type. It takes input through parameters, processes it, and returns a result. This is the closest thing to a mathematical function: you give it values, it gives you back an answer. The caller can use the return value directly in expressions.',
    anatomy: [
      { part: 'int',          role: 'Return type — sends back an int' },
      { part: 'add',          role: 'Function name — a verb describing the operation' },
      { part: '(int a, int b)', role: 'Two inputs — the function works on these' },
      { part: 'return a + b;', role: 'Computes and returns the result in one line' },
    ],
    tip: 'You can use the return value directly: <code>printf("%d", add(3,5));</code> — no need to store it in a variable first.',
    code:
`#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

float average(int x, int y) {
    return (x + y) / 2.0f;
}

int main() {
    int sum = add(4, 6);          /* sum = 10 */
    float avg = average(4, 6);    /* avg = 5.0 */
    printf("Sum: %d\\n", sum);
    printf("Avg: %.1f\\n", avg);
    return 0;
}`
  },
];

function showFnType(idx, card) {
  document.querySelectorAll('.fn-card').forEach((c, i) =>
    c.classList.toggle('fn-card-active', i === idx)
  );

  const fn = FN_TYPES[idx];
  const detail = document.getElementById('fn-detail');
  document.getElementById('fn-detail-title').textContent = fn.title;

  document.getElementById('fn-detail-expl').innerHTML =
    `<p class="expl">${fn.expl}</p>`;

  document.getElementById('fn-detail-anatomy').innerHTML =
    `<div class="fn-anatomy-mini">` +
    fn.anatomy.map(a =>
      `<div class="fn-anat-row">
        <code class="fn-anat-part">${a.part}</code>
        <span class="fn-anat-role">${a.role}</span>
      </div>`
    ).join('') +
    `</div>`;

  // Tokenize the raw code string into highlighted HTML
  // Works character-by-character so escaping never conflicts with span injection
  function highlightC(src) {
    const KW   = ['return','void','int','float','char','double','if','else','while','for','do'];
    const FNS  = ['printf','scanf','greet','printSum','getScore','add','average'];
    let out = '', i = 0;

    while (i < src.length) {
      // Line comment
      if (src[i] === '/' && src[i+1] === '/') {
        let end = src.indexOf('\n', i);
        if (end === -1) end = src.length;
        out += `<span class="cm">${esc2(src.slice(i, end))}</span>`;
        i = end; continue;
      }
      // Block comment
      if (src[i] === '/' && src[i+1] === '*') {
        let end = src.indexOf('*/', i + 2);
        end = end === -1 ? src.length : end + 2;
        out += `<span class="cm">${esc2(src.slice(i, end))}</span>`;
        i = end; continue;
      }
      // String literal
      if (src[i] === '"') {
        let end = i + 1;
        while (end < src.length && src[end] !== '"') {
          if (src[end] === '\\') end++; // skip escape
          end++;
        }
        end++;
        out += `<span class="str">${esc2(src.slice(i, end))}</span>`;
        i = end; continue;
      }
      // Preprocessor directive
      if (src[i] === '#') {
        let end = src.indexOf('\n', i);
        if (end === -1) end = src.length;
        out += `<span class="kw">${esc2(src.slice(i, end))}</span>`;
        i = end; continue;
      }
      // Word — keyword, function name, or identifier
      if (/[a-zA-Z_]/.test(src[i])) {
        let end = i;
        while (end < src.length && /\w/.test(src[end])) end++;
        const word = src.slice(i, end);
        if (KW.includes(word))  out += `<span class="tp">${word}</span>`;
        else if (FNS.includes(word)) out += `<span class="fn">${word}</span>`;
        else out += esc2(word);
        i = end; continue;
      }
      // Number
      if (/\d/.test(src[i])) {
        let end = i;
        while (end < src.length && /[\d.f]/.test(src[end])) end++;
        out += `<span class="num">${esc2(src.slice(i, end))}</span>`;
        i = end; continue;
      }
      // Regular character
      out += esc2(src[i]);
      i++;
    }
    return out;
  }
  function esc2(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  document.getElementById('fn-code-block').innerHTML = highlightC(fn.code);

  document.getElementById('fn-detail-tip').innerHTML =
    `<div class="tip"><span>💡</span><div>${fn.tip}</div></div>`;

  detail.style.display = 'block';
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>{ if(btt) btt.classList.toggle('vis',window.scrollY>380); });

// auto-show first concept
window.addEventListener('DOMContentLoaded',()=>{
  const fb=document.querySelector('.ctab');
  if(fb) fb.click();
});