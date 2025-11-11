/* ================= CRYODONI Frontend (χωρίς token) ================= */
const CONFIG = {
  // Βάλε εδώ το Web App URL από το Apps Script (να τελειώνει σε /exec)
  API_URL: 'https://script.google.com/macros/s/AKfycbx2i0uidQehObeNOk52Vo1kucj3vdvhCCZMMsi04nS5kF_wbQFXm0CdXnkLhD-8kFHn/exec'
};

// Παράμετροι (ίδιοι με τους HEADERS, εκτός από Ημερομηνία_καταχώρισης που μπαίνει αυτόματα)
const PARAMETERS = [
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
  {key:'Επιπλοκή',label:'Επιπλοκή',type:'select',options:['Καμία','Αιμορραγία','Πνευμοθώρακας','Άλλη']},
  {key:'Τελικό_αποτέλεσμα',label:'Τελικό αποτέλεσμα',type:'select',options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'Ιστολογικός_τύπος',label:'Ιστολογικός τύπος',type:'select',options:['—','Adeno','SCC','SCLC','Άλλο','N/A']},
  {key:'EBB_Αποτέλεσμα',label:'EBB — Αποτέλεσμα',type:'select',options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'Brushing_Αποτέλεσμα',label:'Brushing — Αποτέλεσμα',type:'select',options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'Forceps_Αποτέλεσμα',label:'Forceps — Αποτέλεσμα',type:'select',options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'Cryo_Αποτέλεσμα',label:'Cryo — Αποτέλεσμα',type:'select',options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']},
  {key:'BAL_Αποτέλεσμα',label:'BAL — Αποτέλεσμα',type:'select',options:['—','Κακοήθεια','Καλοήθεια_μη_ειδική','Ειδική_καλοήθης','Φλεγμονώδες','Μη_διαγνωστικό']}
];

const form  = document.getElementById('case-form');
const toast = document.getElementById('toast');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');

function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v);
  });
  children.forEach(c => e.appendChild(c));
  return e;
}

function renderForm() {
  form.innerHTML = '';
  PARAMETERS.forEach(p => {
    const wrap = el('div', { class: 'field' });
    wrap.appendChild(el('label', { for: p.key, text: p.label }));
    let input;
    if (p.type === 'select') {
      input = el('select', { id: p.key, name: p.key });
      (p.options || []).forEach(opt => input.appendChild(el('option', { value: String(opt), text: String(opt) })));
    } else {
      input = el('input', { id: p.key, name: p.key, type: p.type || 'text' });
    }
    if (p.required) input.required = true;
    wrap.appendChild(input);
    form.appendChild(wrap);
  });
}

function showToast(msg = 'Αποθηκεύτηκε') {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

async function saveCase() {
  const payload = {};
  PARAMETERS.forEach(p => {
    const node = document.getElementById(p.key);
    if (!node) return;
    let v = node.value;
    if (p.type === 'number' && v !== '') v = Number(v);
    payload[p.key] = v;
  });

  if (!payload['ΝΠΣ'] || String(payload['ΝΠΣ']).trim() === '') {
    showToast('Συμπλήρωσε ΝΠΣ');
    return;
  }

  saveBtn.disabled = true;
  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // ΧΩΡΙΣ preflight
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Σφάλμα αποθήκευσης');

    showToast('Αποθηκεύτηκε');
    setTimeout(() => location.reload(), 900);
  } catch (err) {
    console.error(err);
    showToast('Αποτυχία: ' + err.message);
    saveBtn.disabled = false;
  }
}

renderForm();
saveBtn.addEventListener('click', e => { e.preventDefault(); saveCase(); });
resetBtn.addEventListener('click', () => form.reset());
