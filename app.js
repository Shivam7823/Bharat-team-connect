// ----------------------------------------------------
// 1. Data Models & Priority User Roster
// ----------------------------------------------------
const PRIORITY_USERS = [
  {
    id: 1,
    name: "Shivam Saket",
    username: "shivam_saket",
    email: "shivam.saket@techcorp.in",
    phone: "+91 98260 11401",
    website: "shivamsaket.dev",
    role: "Lead Software Architect",
    address: {
      street: "101, Vijay Nagar Ring Road",
      suite: "Skyline Heights, Flat 402",
      city: "Indore",
      state: "Madhya Pradesh",
      zipcode: "452010"
    },
    company: {
      name: "Tata Consultancy Services (TCS)",
      department: "Core AI & Cloud Architecture"
    }
  },
  {
    id: 2,
    name: "Arpana Tiwari",
    username: "arpana_tiwari",
    email: "arpana.tiwari@techcorp.in",
    phone: "+91 98260 11402",
    website: "arpanatiwari.dev",
    role: "Senior Data Scientist",
    address: {
      street: "204, Palasia Main Road",
      suite: "Silver Arch, Flat 301",
      city: "Indore",
      state: "Madhya Pradesh",
      zipcode: "452001"
    },
    company: {
      name: "Infosys Technologies",
      department: "Machine Learning & Analytics"
    }
  },
  {
    id: 3,
    name: "Sahil Tiwari",
    username: "sahil_tiwari",
    email: "sahil.tiwari@techcorp.in",
    phone: "+91 98260 11403",
    website: "sahiltiwari.dev",
    role: "Full-Stack Engineer",
    address: {
      street: "305, AB Road, Scheme 54",
      suite: "Apollo Tower, Suite 502",
      city: "Indore",
      state: "Madhya Pradesh",
      zipcode: "452010"
    },
    company: {
      name: "Zomato Engineering",
      department: "Platform Infrastructure"
    }
  },
  {
    id: 4,
    name: "Prashant Tiwari",
    username: "prashant_tiwari",
    email: "prashant.tiwari@techcorp.in",
    phone: "+91 98260 11404",
    website: "prashanttiwari.dev",
    role: "DevOps & Systems Lead",
    address: {
      street: "412, Bhawarkua Main Road",
      suite: "Emerald Enclave, Flat 204",
      city: "Indore",
      state: "Madhya Pradesh",
      zipcode: "452014"
    },
    company: {
      name: "Reliance Jio Platforms",
      department: "Distributed Cloud Infrastructure"
    }
  }
];

const INDIAN_FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Sneha', 'Aditya', 'Pooja',
  'Rajesh', 'Neha', 'Arjun', 'Kavita', 'Manish', 'Shreya', 'Kabir', 'Divya',
  'Siddharth', 'Tanvi', 'Varun', 'Meera', 'Nikhil', 'Rhea', 'Karan'
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Patel', 'Verma', 'Iyer', 'Malhotra', 'Kulkarni', 'Joshi', 'Nair',
  'Gupta', 'Reddy', 'Mehta', 'Singh', 'Deshmukh', 'Chopra', 'Banerjee'
];

const CITIES = [
  { city: 'Indore', state: 'Madhya Pradesh', pin: '452001' },
  { city: 'Bengaluru', state: 'Karnataka', pin: '560001' },
  { city: 'Mumbai', state: 'Maharashtra', pin: '400001' },
  { city: 'Pune', state: 'Maharashtra', pin: '411001' },
  { city: 'Delhi', state: 'Delhi NCR', pin: '110001' }
];

const COMPANIES = [
  'Tata Consultancy Services (TCS)', 'Infosys Technologies', 'Reliance Jio Platforms',
  'Zomato Engineering', 'Wipro Digital', 'Zoho Corporation', 'Flipkart Cloud'
];

function buildFullDataset() {
  const list = [...PRIORITY_USERS];
  for (let i = 5; i <= 50; i++) {
    const fn = INDIAN_FIRST_NAMES[(i - 5) % INDIAN_FIRST_NAMES.length];
    const ln = INDIAN_LAST_NAMES[(i * 3) % INDIAN_LAST_NAMES.length];
    const c = CITIES[i % CITIES.length];
    const comp = COMPANIES[i % COMPANIES.length];
    list.push({
      id: i,
      name: `${fn} ${ln}`,
      username: `${fn.toLowerCase()}_${ln.toLowerCase()}${i}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${comp.split(' ')[0].toLowerCase()}.in`,
      phone: `+91 ${98200 + i * 13} ${11000 + i * 17}`,
      website: `${fn.toLowerCase()}${ln.toLowerCase()}.dev`,
      role: 'Software Consultant',
      address: {
        street: `${100 + i}, M.G. Road`,
        suite: `Tower B, Flat ${200 + i}`,
        city: c.city,
        state: c.state,
        zipcode: c.pin
      },
      company: {
        name: comp,
        department: 'Enterprise Application Solutions'
      }
    });
  }
  return list;
}

const ALL_USERS = buildFullDataset();

// ----------------------------------------------------
// 2. Central State Store
// ----------------------------------------------------
const State = {
  allData: ALL_USERS,
  filteredData: [...ALL_USERS],
  currentPage: 1,
  pageSize: 5,
  searchQuery: '',
  selectedCity: 'ALL',
  sortColumn: 'id',
  sortDirection: 'asc'
};

// ----------------------------------------------------
// 3. Filtering & Sorting Logic
// ----------------------------------------------------
function applyFilters() {
  let data = [...State.allData];

  // 1. City Filter
  if (State.selectedCity !== 'ALL') {
    data = data.filter(u => u.address.city === State.selectedCity);
  }

  // 2. Search Query Matching
  const q = State.searchQuery.trim().toLowerCase();
  if (q) {
    data = data.filter(u => 
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.address.city.toLowerCase().includes(q) ||
      u.company.name.toLowerCase().includes(q) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  }

  // 3. Sorting
  data.sort((a, b) => {
    let valA = a[State.sortColumn];
    let valB = b[State.sortColumn];

    if (State.sortColumn === 'city') {
      valA = a.address.city;
      valB = b.address.city;
    } else if (State.sortColumn === 'company') {
      valA = a.company.name;
      valB = b.company.name;
    }

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB || '').toLowerCase();
    }

    if (valA < valB) return State.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return State.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  State.filteredData = data;

  const maxPages = Math.max(1, Math.ceil(data.length / State.pageSize));
  if (State.currentPage > maxPages) State.currentPage = maxPages;
  if (State.currentPage < 1) State.currentPage = 1;

  render();
}

// ----------------------------------------------------
// 4. DOM Rendering Engine
// ----------------------------------------------------
function render() {
  const total = State.filteredData.length;
  const startIdx = (State.currentPage - 1) * State.pageSize;
  const endIdx = Math.min(startIdx + State.pageSize, total);
  const pageRows = State.filteredData.slice(startIdx, endIdx);

  // Telemetry Counters
  document.getElementById('statTotalItems').textContent = State.allData.length;
  document.getElementById('statFilteredItems').textContent = total;
  const totalPages = Math.max(1, Math.ceil(total / State.pageSize));
  document.getElementById('statTotalPages').textContent = totalPages;
  document.getElementById('statCurrentPage').textContent = total === 0 ? 0 : State.currentPage;

  document.getElementById('summaryStart').textContent = total === 0 ? 0 : startIdx + 1;
  document.getElementById('summaryEnd').textContent = endIdx;
  document.getElementById('summaryTotal').textContent = total;

  const hasActiveFilters = State.searchQuery !== '' || State.selectedCity !== 'ALL';
  document.getElementById('btnResetFilters').classList.toggle('hidden', !hasActiveFilters);

  // Table Body Rendering
  const tbody = document.getElementById('tableBody');
  if (pageRows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-10 text-center">
          <div class="text-3xl mb-2">🔍</div>
          <p class="font-bold text-slate-800 text-sm">No members found</p>
          <p class="text-xs text-slate-500 mb-3">No matching records for your query.</p>
          <button id="btnEmptyRestore" class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
            Restore All Data
          </button>
        </td>
      </tr>
    `;
    const emptyBtn = document.getElementById('btnEmptyRestore');
    if (emptyBtn) emptyBtn.onclick = restoreAllData;
  } else {
    tbody.innerHTML = pageRows.map(u => {
      const isTopPriority = u.id <= 4;
      const isIndore = u.address.city === 'Indore';

      return `
        <tr class="hover:bg-indigo-50/40 transition ${isTopPriority ? 'bg-amber-50/20' : ''}">
          <td class="py-3 px-3">
            <span class="font-mono text-xs font-bold px-2 py-0.5 rounded ${isTopPriority ? 'bg-indigo-100 text-indigo-800 font-extrabold' : 'bg-slate-100 text-slate-700'}">
              #${u.id}
            </span>
          </td>
          <td class="py-3 px-4">
            <div class="font-bold text-slate-900 flex items-center gap-1.5">
              ${highlight(u.name, State.searchQuery)}
              ${isTopPriority ? '<span class="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">⭐ Priority</span>' : ''}
            </div>
            <div class="text-[11px] text-indigo-600 font-medium">${u.role || 'Member'}</div>
          </td>
          <td class="py-3 px-4">
            <div class="text-xs font-medium text-slate-800">${highlight(u.email, State.searchQuery)}</div>
            <div class="text-[11px] text-slate-500 font-mono">📞 ${highlight(u.phone, State.searchQuery)}</div>
          </td>
          <td class="py-3 px-4">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${isIndore ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'}">
              📍 ${highlight(u.address.city, State.searchQuery)}
            </span>
          </td>
          <td class="py-3 px-4">
            <div class="text-xs font-semibold text-slate-800">${highlight(u.company.name, State.searchQuery)}</div>
            <div class="text-[11px] text-slate-500">${u.company.department || ''}</div>
          </td>
          <td class="py-3 px-4 text-right">
            <button data-id="${u.id}" class="btn-view-drawer px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition">
              View
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row button handlers
    document.querySelectorAll('.btn-view-drawer').forEach(btn => {
      btn.onclick = () => openDrawer(parseInt(btn.getAttribute('data-id'), 10));
    });
  }

  renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
  document.getElementById('btnPrev').disabled = State.currentPage <= 1;
  document.getElementById('btnNext').disabled = State.currentPage >= totalPages;

  const container = document.getElementById('pageNumbersContainer');
  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= State.currentPage - 1 && i <= State.currentPage + 1)) {
      const btn = document.createElement('button');
      btn.className = `w-7 h-7 rounded-lg text-xs font-bold transition ${
        i === State.currentPage 
          ? 'bg-indigo-600 text-white shadow-xs' 
          : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200'
      }`;
      btn.textContent = i;
      btn.onclick = () => { State.currentPage = i; applyFilters(); };
      container.appendChild(btn);
    } else if (i === State.currentPage - 2 || i === State.currentPage + 2) {
      const dots = document.createElement('span');
      dots.className = 'text-slate-400 text-xs px-1';
      dots.textContent = '...';
      container.appendChild(dots);
    }
  }
}

function changePage(delta) {
  State.currentPage += delta;
  applyFilters();
}

function toggleSort(col) {
  if (State.sortColumn === col) {
    State.sortDirection = State.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    State.sortColumn = col;
    State.sortDirection = 'asc';
  }

  ['name', 'email', 'city', 'company'].forEach(c => {
    const icon = document.getElementById(`sort-${c}-icon`);
    if (c === State.sortColumn) {
      icon.textContent = State.sortDirection === 'asc' ? '↑' : '↓';
      icon.className = 'text-indigo-600 font-bold';
    } else {
      icon.textContent = '↕';
      icon.className = 'text-slate-400';
    }
  });

  applyFilters();
}

function highlight(text, query) {
  if (!query || !text) return text || '';
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return String(text).replace(regex, '<mark class="highlight">$1</mark>');
}

function setCityFilter(city) {
  State.selectedCity = city;
  document.getElementById('cityFilter').value = city;
  State.currentPage = 1;

  document.querySelectorAll('.city-pill').forEach(btn => {
    btn.className = 'city-pill px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200';
  });
  const activePill = document.getElementById(`pill-${city}`);
  if (activePill) {
    activePill.className = 'city-pill px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600 text-white';
  }

  applyFilters();
}

function restoreAllData() {
  State.searchQuery = '';
  State.selectedCity = 'ALL';
  State.currentPage = 1;
  State.sortColumn = 'id';
  State.sortDirection = 'asc';

  document.getElementById('searchInput').value = '';
  document.getElementById('btnClearSearch').classList.add('hidden');
  document.getElementById('cityFilter').value = 'ALL';
  setCityFilter('ALL');

  showToast('All 50 Indian Directory records restored!', 'info');
}

// ----------------------------------------------------
// 5. Smart AI Directory Assistant
// ----------------------------------------------------
async function askAiAssistant(query) {
  if (!query) return;

  const respContainer = document.getElementById('aiResponseContainer');
  const respText = document.getElementById('aiResponseText');
  respContainer.classList.remove('hidden');
  respText.innerHTML = '<span class="animate-pulse">Thinking & analyzing team directory...</span>';

  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const systemPrompt = `You are the smart directory AI assistant for Bharat Team Connect.
The directory highlights 4 primary leaders at the top:
1. Shivam Saket (Indore, Lead Software Architect at TCS)
2. Arpana Tiwari (Indore, Senior Data Scientist at Infosys)
3. Sahil Tiwari (Indore, Full-Stack Engineer at Zomato)
4. Prashant Tiwari (Indore, DevOps Lead at Reliance Jio)
It also contains 46 other team members in Indore, Bengaluru, Mumbai, Pune, and Delhi.

Respond in 1-2 friendly, concise sentences (English or Hinglish).
If the user asks to filter or find someone, describe who was found.`;

  try {
    const payload = {
      contents: [{ parts: [{ text: `User request: "${query}"` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      respText.textContent = text;
    } else {
      fallbackAiResponse(query);
    }
  } catch (err) {
    fallbackAiResponse(query);
  }

  // Automatic filter trigger
  const lower = query.toLowerCase();
  if (lower.includes('indore')) {
    setCityFilter('Indore');
  } else if (lower.includes('tiwari')) {
    State.searchQuery = 'Tiwari';
    document.getElementById('searchInput').value = 'Tiwari';
    applyFilters();
  } else if (lower.includes('shivam')) {
    State.searchQuery = 'Shivam';
    document.getElementById('searchInput').value = 'Shivam';
    applyFilters();
  } else if (lower.includes('arpana')) {
    State.searchQuery = 'Arpana';
    document.getElementById('searchInput').value = 'Arpana';
    applyFilters();
  }
}

function fallbackAiResponse(q) {
  const respText = document.getElementById('aiResponseText');
  const lower = q.toLowerCase();
  if (lower.includes('shivam')) {
    respText.textContent = "Shivam Saket is the Lead Software Architect at TCS based in Indore. He is record #1!";
  } else if (lower.includes('tiwari')) {
    respText.textContent = "Found 3 key Tiwari members: Arpana Tiwari (Infosys), Sahil Tiwari (Zomato), and Prashant Tiwari (Reliance Jio) in Indore.";
  } else if (lower.includes('indore')) {
    respText.textContent = "Filtered the directory to show all team members residing in Indore.";
  } else {
    respText.textContent = `Applied filter for "${q}". Found matching records in the directory table below.`;
  }
}

function handleQuickAiAction(text) {
  document.getElementById('aiInput').value = text;
  askAiAssistant(text);
}

function closeAiResponse() {
  document.getElementById('aiResponseContainer').classList.add('hidden');
}

// ----------------------------------------------------
// 6. CSV Exporter & Slide Drawer
// ----------------------------------------------------
function exportToCsv() {
  const list = State.filteredData;
  if (list.length === 0) {
    showToast('No records available to export', 'error');
    return;
  }

  const headers = ['ID', 'Name', 'Role', 'Email', 'Phone', 'City', 'State', 'Company'];
  const rows = [headers.join(',')];

  list.forEach(u => {
    const vals = [
      u.id,
      `"${u.name}"`,
      `"${u.role || ''}"`,
      `"${u.email}"`,
      `"${u.phone}"`,
      `"${u.address.city}"`,
      `"${u.address.state}"`,
      `"${u.company.name}"`
    ];
    rows.push(vals.join(','));
  });

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bharat_team_directory_${State.selectedCity}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Exported ${list.length} records to CSV!`, 'success');
}

function openDrawer(id) {
  const u = State.allData.find(x => x.id === id);
  if (!u) return;

  document.getElementById('drawerName').textContent = u.name;
  document.getElementById('drawerRole').textContent = u.role || 'Team Member';
  document.getElementById('drawerEmail').textContent = u.email;
  document.getElementById('drawerPhone').textContent = u.phone;
  document.getElementById('drawerWebsite').textContent = u.website;
  document.getElementById('drawerCityState').textContent = `${u.address.city}, ${u.address.state}`;
  document.getElementById('drawerAddress').textContent = `${u.address.suite}, ${u.address.street}`;
  document.getElementById('drawerZip').textContent = u.address.zipcode;
  document.getElementById('drawerCompany').textContent = u.company.name;
  document.getElementById('drawerDepartment').textContent = u.company.department || '';

  const avatar = document.getElementById('drawerAvatar');
  avatar.textContent = u.name.split(' ').map(n => n[0]).join('');

  const bd = document.getElementById('drawerBackdrop');
  const drawer = document.getElementById('userDrawer');
  bd.classList.remove('hidden');
  requestAnimationFrame(() => {
    bd.classList.remove('opacity-0');
    drawer.classList.remove('translate-x-full');
  });
}

function closeDrawer() {
  const bd = document.getElementById('drawerBackdrop');
  const drawer = document.getElementById('userDrawer');
  bd.classList.add('opacity-0');
  drawer.classList.add('translate-x-full');
  setTimeout(() => bd.classList.add('hidden'), 300);
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `px-4 py-2 rounded-lg text-xs font-semibold shadow-lg text-white transition-all transform duration-300 translate-y-2 opacity-0 ${
    type === 'success' ? 'bg-emerald-700' : 'bg-slate-800'
  }`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ----------------------------------------------------
// 7. Event Bindings & Lifecycle Init
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Populate Cities
  const citySelect = document.getElementById('cityFilter');
  const cities = Array.from(new Set(State.allData.map(u => u.address.city))).sort();
  cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    citySelect.appendChild(opt);
  });
  citySelect.onchange = (e) => setCityFilter(e.target.value);

  // Quick City Pills
  document.querySelectorAll('.city-pill').forEach(btn => {
    btn.onclick = () => setCityFilter(btn.getAttribute('data-city'));
  });

  // Search input listeners
  const searchInput = document.getElementById('searchInput');
  const btnClear = document.getElementById('btnClearSearch');

  searchInput.oninput = (e) => {
    State.searchQuery = e.target.value;
    btnClear.classList.toggle('hidden', !State.searchQuery);
    State.currentPage = 1;
    applyFilters();
  };

  btnClear.onclick = () => {
    searchInput.value = '';
    btnClear.classList.add('hidden');
    State.searchQuery = '';
    State.currentPage = 1;
    applyFilters();
  };

  // Pagination triggers
  document.getElementById('btnPrev').onclick = () => changePage(-1);
  document.getElementById('btnNext').onclick = () => changePage(1);

  document.getElementById('pageSizeSelect').onchange = (e) => {
    State.pageSize = parseInt(e.target.value, 10);
    State.currentPage = 1;
    applyFilters();
  };

  // Column Sort Header triggers
  document.getElementById('th-name').onclick = () => toggleSort('name');
  document.getElementById('th-email').onclick = () => toggleSort('email');
  document.getElementById('th-city').onclick = () => toggleSort('city');
  document.getElementById('th-company').onclick = () => toggleSort('company');

  // AI Assistant triggers
  document.getElementById('btnAiSend').onclick = () => {
    const val = document.getElementById('aiInput').value;
    askAiAssistant(val);
  };
  document.getElementById('aiInput').onkeydown = (e) => {
    if (e.key === 'Enter') askAiAssistant(e.target.value);
  };
  document.getElementById('btnCloseAi').onclick = closeAiResponse;

  document.getElementById('quickIndore').onclick = () => handleQuickAiAction('Show Indore team');
  document.getElementById('quickTiwari').onclick = () => handleQuickAiAction('Find Tiwari family');
  document.getElementById('quickShivam').onclick = () => handleQuickAiAction('Find Shivam Saket');

  // Drawer triggers
  document.getElementById('drawerBackdrop').onclick = closeDrawer;
  document.getElementById('btnCloseDrawer').onclick = closeDrawer;

  // Header button actions
  document.getElementById('btnExport').onclick = exportToCsv;
  document.getElementById('btnRestoreData').onclick = restoreAllData;
  document.getElementById('btnResetFilters').onclick = restoreAllData;

  // Initial render
  applyFilters();
});