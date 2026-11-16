import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const require=createRequire(import.meta.url);
const {localDate,validTask,byDeadline,isOverdue}=require('../assets/app.js');
const task={id:'test',title:'複習',course:'數學',type:'exam',due:'2026-11-16',progress:40};
assert(validTask(task));assert(!validTask({...task,due:'2026-02-30'}));assert(!validTask({...task,title:' '}));assert(!validTask({...task,progress:101}));assert(!validTask({...task,type:'other'}));assert(!isOverdue(task,'2026-11-16'));assert(isOverdue(task,'2026-11-17'));assert(!isOverdue({...task,progress:100},'2026-11-17'));assert.equal(localDate(new Date(2026,0,1)),'2026-01-01');
assert.deepEqual([{...task,id:'done',due:'2026-01-01',progress:100},{...task,id:'later',due:'2026-11-20'},{...task,id:'first'}].sort(byDeadline).map(t=>t.id),['first','later','done']);
const pages=['index.html',...readdirSync(resolve(root,'guides')).filter(f=>f.endsWith('.html')).map(f=>'guides/'+f)];
for(const file of pages){const path=resolve(root,file);const html=readFileSync(path,'utf8');assert(html.includes('lang="zh-Hant"'),file);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file);for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){if(/^(https?:|mailto:)/.test(match[1]))continue;assert(existsSync(resolve(dirname(path),match[1])),`${file}: missing ${match[1]}`);}}
const app=readFileSync(resolve(root,'assets/app.js'),'utf8');assert(!app.includes('innerHTML'));console.log(`PASS: task validation, date boundaries, sorting, and links across ${pages.length} pages.`);
