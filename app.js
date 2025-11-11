/* ============== CRYODONI Frontend (χωρίς token, 2 φόρμες) ============== */
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycby1BydlteCIrcOgertcoeOS1MvzBaXyEiB4W3OiKp9BU2muEYlfV-YgB1YewTafquTJOw/exec' // /exec
};

// BASE (Επέμβαση)
const FIELDS_BASE = [
  {key:'ΝΠΣ',label:'ΝΠΣ',type:'text',required:true},
  {key:'ΟΝΟΜΑ',label:'ΟΝΟΜΑ',type:'text'},
  {key:'ΕΠΩΝΥΜΟ',label:'ΕΠΩΝΥΜΟ',type:'text'},
  {key:'ΗΜΕΡΟΜΗΝΙΑ ΕΠΕΜΒΑΣΗΣ',label:'ΗΜΕΡΟΜΗΝΙΑ ΕΠΕΜΒΑΣΗΣ',type:'date'},
  {key:'ΗΛΙΚΙΑ',label:'ΗΛΙΚΙΑ',type:'number'},
  {key:'ΦΥΛΟ',label:'ΦΥΛΟ',type:'select',options:['Άνδρας','Γυναίκα','Άλλο','Μη διαθέσιμο']},
  {key:'ΚΑΠΝΙΣΜΑ',label:'ΚΑΠΝΙΣΜΑ',type:'select',options:['Ποτέ','Πρώην','Ενεργός','Άγνωστο']},
  {key:'ΘΕΣΗ ΒΛΑΒΗΣ',label:'ΘΕΣΗ ΒΛΑΒΗΣ',type:'text'},
  {key:'ΔΙΑΜΕΤΡΟΣ ΒΛΑΒΗΣ',label:'ΔΙΑΜΕΤΡΟΣ ΒΛΑΒΗΣ (mm)',type:'number'},
  {key:'ΑΠΟΣΤΑΣΗ',label:'ΑΠΟΣΤΑΣΗ',type:'number'},
  {key:'SUV',label:'SUV',type:'number'},
  {key:'BRONCHUS SIGN',label:'BRONCHUS SIGN',type:'select',options:['Ναι','Όχι','Άγνωστο']},
  {key:'Εικόνα_radial_EBUS',label:'Εικόνα radial EBUS',type:'select',options:['Ομόκεντρη','Έκκεντρη','Παρακείμενη','Δεν_φάνηκε']},
  {key:'RADIAL SHEATH',label:'RADIAL SHEATH',type:'select',options:['Ναι','Όχι','Both']},
  {key:'Εργαλεία',label:'Εργαλεία',type:'text'},
  {key:'Συνολικές_λήψεις',label:'Συνολικές λήψεις',type:'number'},
  {key:'FREEZING TIME CRYO',label:'FREEZING TIME CRYO',type:'select',options:['Ναι','Όχι']},
  {key:'Επιπλοκή',label:'Επιπλοκή',type:'select',options:['Καμία','Αιμορραγία','Πνευμοθώρακας','Άλλη']}
];

// RESULTS (Αποτελέσματα)
const FIELDS_RESULTS = [
  {key:'ΝΠΣ',label:'ΝΠΣ',type:'text',required:true},
  {key:'Τελικό_αποτέλεσμα',label:'Τελικό αποτέλεσμα',type:'select',
    options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'Ιστολογικός_τύπος',label:'Ιστολογικός τύπος',type:'select',
    options:['—','Adeno','SCC','SCLC','Άλλο','N/A']},
  {key:'EBB_Αποτέλεσμα',label:'EBB — Αποτέλεσμα',type:'select',
    options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'Brushing_Αποτέλεσμα',label:'Brushing — Αποτέλεσμα',type:'select',
    options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'Forceps_Αποτέλεσμα',label:'Forceps — Αποτέλεσμα',type:'select',
    options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'Cryo_Αποτέλεσμα',label:'Cryo — Αποτέλεσμα',type:'select',
    options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'BAL_Αποτέλεσμα',label:'BAL — Αποτέλεσμα',type:'select',
    options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']}
];

// DOM
const toast = document.getElementById('toast');
const tabBase = document.getElementById('tab-base');
const tabResults = document.getElementById('tab-results');
const formBase = document.getElementById('form-base');
const formResults = document.getElementById('form-results');
const actionsBase = document.getElementById('actions-base');
const actionsResults = document.getElementById('actions-results');
const saveBaseBtn = document.getElementById('saveBase');
const saveResultsBtn = document.getElementById('saveResults');
const resetBaseBtn = document.getElementById('resetBase');
const resetResultsBtn = document.getElementById('resetResults');

// Helpers
function el(tag, attrs={}, children=[]){
  const e=document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') e.className=v;
    else if(k==='text') e.textContent=v;
    else e.setAttribute(k,v);
  });
  children.forEach(c=>e.appendChild(c));
  return e;
}

function renderForm(container, fields){
  container.innerHTML='';
  fields.forEach(p=>{
    const wrap=el('div',{class:'field'});
    wrap.appendChild(el('label',{for:p.key, text:p.label}));
    let input;
    if(p.type==='select'){
      input=el('select',{name:p.key, autocomplete:'off'});
      (p.options||[]).forEach(opt=> input.appendChild(el('option',{value:String(opt), text:String(opt)})));
    } else {
      input=el('input',{name:p.key, type:p.type||'text', autocomplete:'off'});
    }
    if(p.required) input.required = true;
    wrap.appendChild(input);
    container.appendChild(wrap);
  });
}

function showToast(msg='Αποθηκεύτηκε'){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 1800);
}

// ⬇️ ΣΗΜΑΝΤΙΚΟ: Διαβάζουμε ΜΟΝΟ από τη δοθείσα φόρμα (ΟΧΙ document.getElementById)
async function saveSection(container, fields){
  const payload = {};
  fields.forEach(p=>{
    const n = container.querySelector(`[name="${p.key}"]`);
    if(!n) return;
    let v = n.value;
    if(p.type==='number' && v!=='') v = Number(v);
    payload[p.key] = v;
  });

  if(!payload['ΝΠΣ'] || String(payload['ΝΠΣ']).trim()===''){
    showToast('Συμπλήρωσε ΝΠΣ');
    return;
  }

  try{
    const res = await fetch(CONFIG.API_URL, {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'}, // αποφεύγει preflight
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(!data.ok) throw new Error(data.error || 'Σφάλμα');
    showToast('Αποθηκεύτηκε');
    setTimeout(()=> location.reload(), 800);
  }catch(err){
    console.error(err);
    showToast('Αποτυχία: ' + err.message);
  }
}

// Tabs
function showBase(){
  tabBase.classList.add('active'); tabResults.classList.remove('active');
  formBase.style.display='grid'; actionsBase.style.display='flex';
  formResults.style.display='none'; actionsResults.style.display='none';
}
function showResults(){
  tabResults.classList.add('active'); tabBase.classList.remove('active');
  formResults.style.display='grid'; actionsResults.style.display='flex';
  formBase.style.display='none'; actionsBase.style.display='none';
}

// Init
renderForm(formBase, FIELDS_BASE);
renderForm(formResults, FIELDS_RESULTS);
tabBase.addEventListener('click', showBase);
tabResults.addEventListener('click', showResults);
saveBaseBtn.addEventListener('click', e=>{ e.preventDefault(); saveSection(formBase, FIELDS_BASE); });
saveResultsBtn.addEventListener('click', e=>{ e.preventDefault(); saveSection(formResults, FIELDS_RESULTS); });
resetBaseBtn.addEventListener('click', ()=> formBase.reset());
resetResultsBtn.addEventListener('click', ()=> formResults.reset());
