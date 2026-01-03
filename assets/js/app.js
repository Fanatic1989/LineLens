
let data=[], windowSel='L10', sortAsc=false;
async function load(){
  data = await fetch('data/nba_props.json').then(r=>r.json());
  const ts = await fetch('data/last_update.json').then(r=>r.json()).catch(()=>null);
  if(ts?.last_updated){ document.getElementById('last-updated').innerText='Last updated: '+ts.last_updated; }
  render();
}
function render(){
  const tbody=document.getElementById('rows'); tbody.innerHTML='';
  const s=document.getElementById('search').value.toLowerCase();
  const p=document.getElementById('prop-filter').value;
  let rows=data.filter(r=>{
    if(s && !(`${r.player} ${r.team}`.toLowerCase().includes(s))) return false;
    if(p && r.prop!==p) return false;
    return true;
  });
  rows.sort((a,b)=>{
    const da=a.windows[windowSel].avg-a.line, db=b.windows[windowSel].avg-b.line;
    return sortAsc? da-db : db-da;
  });
  rows.forEach(r=>{
    const w=r.windows[windowSel], diff=(w.avg-r.line).toFixed(2);
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.player}</td><td>${r.team}</td><td>${r.prop}</td>
      <td>${r.line}</td><td>${w.avg}</td>
      <td class="${diff>=0?'diff-pos':'diff-neg'}">${diff}</td>
      <td>${w.hit_pct}%</td><td>${w.streak}</td>`;
    tbody.appendChild(tr);
  });
}
document.getElementById('search').oninput=render;
document.getElementById('prop-filter').onchange=render;
document.getElementById('window').onchange=e=>{windowSel=e.target.value; render();};
document.getElementById('sort').onclick=()=>{sortAsc=!sortAsc; render();};
load();
