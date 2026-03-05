// ===== خلفية موبايلات طايرة =====
function createFloatingPhones() {
  const container = document.getElementById('floatingPhones');
  const emojis = ['📱', '📲', '💻', '🔋', '📷', '🔌', '💾', '📡', '🖥️', '⌨️'];
  
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div');
    el.className = 'phone-icon';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (Math.random() * 20 + 15) + 's';
    el.style.animationDelay = (Math.random() * 20) + 's';
    el.style.fontSize = (Math.random() * 20 + 15) + 'px';
    container.appendChild(el);
  }
}

createFloatingPhones();

// ===== Parallax =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const bg = document.querySelector('.bg-animation');
  if (bg) bg.style.transform = `translateY(${scrolled * 0.3}px)`;

  // Header scroll effect
  const header = document.getElementById('header');
  if (scrolled > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// ===== مودال =====
window.openModal = function(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
};

window.switchModal = function(from, to) {
  closeModal(from);
  setTimeout(() => openModal(to), 150);
};

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }
});

// ===== إشعارات =====
window.showNotification = function(msg, type = 'info') {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.className = `notification ${type} show`;
  setTimeout(() => el.classList.remove('show'), 4000);
};

// ===== لوحة تحكم الأدمن =====
const ADMIN_PASSWORD = "@#$%&*-+()19399";
let adminBlocked = false;
let adminAttempts = 0;

// فتح صفحة الأدمن
if (window.location.pathname.includes('/admin') || window.location.hash === '#admin') {
  loadAdminPanel();
}

async function loadAdminPanel() {
  if (adminBlocked) {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0f1e;color:#ef4444;font-family:Cairo,sans-serif;text-align:center;flex-direction:column;gap:20px;">
        <div style="font-size:60px">🚫</div>
        <h1>تم حظرك!</h1>
        <p>حاولت تدخل بكلمة سر غلط</p>
      </div>`;
    return;
  }

  const pass = prompt('أدخل كلمة سر لوحة التحكم:');
  
  if (!pass) return;
  
  if (pass !== ADMIN_PASSWORD) {
    adminBlocked = true;
    localStorage.setItem('adminBlocked', Date.now().toString());
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0f1e;color:#ef4444;font-family:Cairo,sans-serif;text-align:center;flex-direction:column;gap:20px;">
        <div style="font-size:60px">🚫</div>
        <h1>تم حظرك!</h1>
        <p>كلمة السر غلط - تم حظر جهازك</p>
      </div>`;
    return;
  }

  showAdminPanel();
}

window.goToAdmin = function() {
  // Check if blocked
  const blockedAt = localStorage.getItem('adminBlocked');
  if (blockedAt) {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0f1e;color:#ef4444;font-family:Cairo,sans-serif;text-align:center;flex-direction:column;gap:20px;">
        <div style="font-size:60px">🚫</div>
        <h1>تم حظرك!</h1>
        <p>حاولت تدخل بكلمة سر غلط</p>
      </div>`;
    return;
  }
  loadAdminPanel();
};

function showAdminPanel() {
  document.body.innerHTML = `
    <style>
      * { margin:0;padding:0;box-sizing:border-box; }
      body { font-family:'Cairo',sans-serif;background:#0a0f1e;color:#f9fafb;min-height:100vh; }
      .admin-header { background:#111827;padding:20px;border-bottom:1px solid #374151;display:flex;align-items:center;justify-content:space-between; }
      .admin-title { font-size:22px;font-weight:900;color:#f97316; }
      .admin-container { max-width:1000px;margin:0 auto;padding:30px 20px; }
      .admin-tabs { display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap; }
      .tab-btn { padding:10px 20px;border-radius:10px;border:1px solid #374151;background:#1f2937;color:#9ca3af;cursor:pointer;font-family:Cairo,sans-serif;font-size:14px;font-weight:700;transition:all 0.2s; }
      .tab-btn.active { background:#1a56db;border-color:#1a56db;color:white; }
      .listings-admin { display:grid;gap:16px; }
      .admin-card { background:#1f2937;border:1px solid #374151;border-radius:14px;padding:20px;display:flex;gap:16px;align-items:flex-start; }
      .admin-card img { width:80px;height:80px;object-fit:cover;border-radius:8px;flex-shrink:0; }
      .admin-card-info { flex:1; }
      .admin-card-name { font-size:16px;font-weight:700;margin-bottom:4px; }
      .admin-card-meta { font-size:13px;color:#9ca3af;margin-bottom:8px; }
      .admin-card-actions { display:flex;gap:8px;flex-wrap:wrap; }
      .btn-approve { background:#10b981;color:white;border:none;padding:8px 16px;border-radius:8px;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer; }
      .btn-reject { background:#ef4444;color:white;border:none;padding:8px 16px;border-radius:8px;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer; }
      .badge-pending { background:rgba(249,115,22,0.2);color:#f97316;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700; }
      .badge-approved { background:rgba(16,185,129,0.2);color:#10b981;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700; }
      .badge-rejected { background:rgba(239,68,68,0.2);color:#ef4444;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700; }
      .admin-stat-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;margin-bottom:24px; }
      .admin-stat { background:#1f2937;border:1px solid #374151;border-radius:12px;padding:20px;text-align:center; }
      .admin-stat-num { font-size:32px;font-weight:900;color:#f97316; }
      .admin-stat-label { font-size:14px;color:#9ca3af;margin-top:4px; }
      .back-btn { background:#374151;color:white;border:none;padding:10px 20px;border-radius:8px;font-family:Cairo,sans-serif;font-size:14px;cursor:pointer; }
      .loading { text-align:center;padding:40px;color:#9ca3af; }
      .empty { text-align:center;padding:60px;color:#9ca3af; }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
    <div class="admin-header">
      <div class="admin-title">🔧 لوحة تحكم موب قليوب</div>
      <button class="back-btn" onclick="window.location.href='/'">← الموقع</button>
    </div>
    <div class="admin-container">
      <div class="admin-stat-grid" id="adminStats">
        <div class="loading">جاري التحميل...</div>
      </div>
      <div class="admin-tabs">
        <button class="tab-btn active" onclick="adminTab('pending')">⏳ قيد المراجعة</button>
        <button class="tab-btn" onclick="adminTab('approved')">✅ معتمدة</button>
        <button class="tab-btn" onclick="adminTab('rejected')">❌ مرفوضة</button>
        <button class="tab-btn" onclick="adminTab('all')">📋 الكل</button>
      </div>
      <div class="listings-admin" id="adminListings">
        <div class="loading">جاري التحميل...</div>
      </div>
    </div>
  `;

  loadAdminData('pending');
  loadAdminStats();
}

let currentAdminTab = 'pending';

window.adminTab = function(tab) {
  currentAdminTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  loadAdminData(tab);
};

async function loadAdminStats() {
  // Will be loaded via firebase in the module
  document.getElementById('adminStats').innerHTML = `
    <div class="admin-stat"><div class="admin-stat-num" id="aStat1">-</div><div class="admin-stat-label">إجمالي الإعلانات</div></div>
    <div class="admin-stat"><div class="admin-stat-num" id="aStat2">-</div><div class="admin-stat-label">قيد المراجعة</div></div>
    <div class="admin-stat"><div class="admin-stat-num" id="aStat3">-</div><div class="admin-stat-label">معتمدة</div></div>
    <div class="admin-stat"><div class="admin-stat-num" id="aStat4">-</div><div class="admin-stat-label">المستخدمين</div></div>
  `;
}

async function loadAdminData(status) {
  const container = document.getElementById('adminListings');
  if (!container) return;
  container.innerHTML = '<div class="loading">جاري التحميل...</div>';

  // Load via firebase module
  window.adminLoadListings(status);
}

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Add admin link =====
// Secret admin access: type 'admin' anywhere
let adminTyped = '';
document.addEventListener('keypress', (e) => {
  adminTyped += e.key;
  if (adminTyped.length > 5) adminTyped = adminTyped.slice(-5);
  if (adminTyped === 'admin') {
    window.goToAdmin();
    adminTyped = '';
  }
});
