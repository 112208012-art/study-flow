'use strict';
const KEY = 'study-flow.tasks.v1';
const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
function validTask(t) { return t && typeof t.id === 'string' && typeof t.title === 'string' && t.title.trim().length > 0 && t.title.length <= 80 && typeof t.course === 'string' && t.course.trim().length > 0 && t.course.length <= 40 && ['exam','assignment'].includes(t.type) && /^\d{4}-\d{2}-\d{2}$/.test(t.due) && !Number.isNaN(new Date(t.due+'T00:00:00').getTime()) && localDate(new Date(t.due+'T00:00:00')) === t.due && Number.isInteger(t.progress) && t.progress >= 0 && t.progress <= 100; }
const byDeadline = (a,b) => Number(a.progress === 100)-Number(b.progress === 100) || a.due.localeCompare(b.due);
const isOverdue = (task,today) => task.progress < 100 && task.due < today;
if (typeof module !== 'undefined') module.exports = {localDate,validTask,byDeadline,isOverdue};
if (typeof document !== 'undefined') {
 const $ = id => document.getElementById(id);
 const today = localDate();
 $('today').textContent = new Intl.DateTimeFormat('zh-TW',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date());
 $('due').value = today;
 const shift = days => {const d=new Date();d.setDate(d.getDate()+days);return localDate(d);};
 let tasks=[]; let blocked=false;
 const say = text => {$('message').textContent=text;};
 try { const raw=localStorage.getItem(KEY); if(raw===null) tasks=[{id:'sample-1',title:'微積分第三章習題',course:'微積分',type:'assignment',due:shift(2),progress:40},{id:'sample-2',title:'期中考複習：陣列與函式',course:'程式設計',type:'exam',due:shift(5),progress:20},{id:'sample-3',title:'閱讀筆記與課堂心得',course:'通識課程',type:'assignment',due:shift(0),progress:100}]; else {const saved=JSON.parse(raw);if(!Array.isArray(saved)||!saved.every(validTask)||new Set(saved.map(t=>t.id)).size!==saved.length)throw Error('Invalid data');tasks=saved;} }
 catch {blocked=true;say('無法讀取儲存資料。為保護原資料，暫停修改；請先備份或檢查瀏覽器儲存設定。');}
 function commit(next){if(blocked){say('目前無法修改資料，請先檢查瀏覽器儲存設定。');return false;}try{localStorage.setItem(KEY,JSON.stringify(next));tasks=next;say('已儲存至此瀏覽器。');render();return true;}catch{say('儲存失敗，這次變更尚未保存。請確認瀏覽器允許本機儲存。');render();return false;}}
 function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
 function render(){
  const completed=tasks.filter(t=>t.progress===100).length;
  $('pending').textContent=tasks.length-completed;
  $('rate').textContent=(tasks.length?Math.round(completed/tasks.length*100):0)+'%';
  $('upcoming').textContent=tasks.filter(t=>t.progress<100&&t.due>=today&&t.due<=shift(6)).length;
  const query=$('search').value.trim().toLocaleLowerCase();const filter=$('filter').value;
  const visible=tasks.filter(t=>(t.title+' '+t.course).toLocaleLowerCase().includes(query)&&(filter==='all'||filter===t.type||filter==='done'&&t.progress===100||filter==='pending'&&t.progress<100)).sort(byDeadline);
  $('count').textContent=visible.length+' 項任務';$('task-list').replaceChildren();
  if(!visible.length)$('task-list').append(el('p','empty',tasks.length?'找不到符合條件的任務。試試其他搜尋或篩選。':'清單是空的，為下一個目標新增一項任務吧。'));
  for(const task of visible){
   const card=el('article','task'+(task.progress===100?' done':''));const top=el('div','task-top');
   top.append(el('span','tag'+(task.type==='exam'?' exam':''),task.type==='exam'?'考試':'作業'),el('span','due'+(isOverdue(task,today)?' overdue':''),task.due+(isOverdue(task,today)?' · 已逾期':task.progress===100?' · 已完成':' 截止')));
   const bottom=el('div','task-bottom');const label=el('label','',`進度 ${task.progress}%`);const range=el('input');range.type='range';range.min='0';range.max='100';range.step='10';range.value=task.progress;range.id='progress-'+task.id;range.disabled=blocked;label.htmlFor=range.id;range.setAttribute('aria-label',task.title+'完成進度');
   range.addEventListener('input',()=>{label.textContent=`進度 ${range.value}%`;});range.addEventListener('change',()=>commit(tasks.map(t=>t.id===task.id?{...t,progress:Number(range.value)}:t)));
   const remove=el('button','remove','刪除');remove.type='button';remove.disabled=blocked;remove.setAttribute('aria-label','刪除'+task.title);remove.addEventListener('click',()=>{if(confirm(`確定刪除「${task.title}」？`))commit(tasks.filter(t=>t.id!==task.id));});bottom.append(label,range,remove);card.append(top,el('h3','',task.title),el('p','',task.course),bottom);$('task-list').append(card);
  }
 }
 $('search').addEventListener('input',render);$('filter').addEventListener('change',render);
 $('task-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.target);const task={id:crypto.randomUUID(),title:String(data.get('title')).trim(),course:String(data.get('course')).trim(),type:data.get('type'),due:data.get('due'),progress:0};if(!validTask(task)){say('請輸入完整的任務名稱、課程與有效日期。');return;}if(commit([...tasks,task])){event.target.reset();$('due').value=today;$('title').focus();}});
 render();
}
