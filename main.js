/* ============================================
   UTILITY FUNCTIONS
============================================ */
function getWIBDate() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 7));
}

function openWebsite() {
  document.documentElement.classList.remove('locked'); 
  const lockScreen = document.getElementById("lockScreen");
  const mainContent = document.getElementById("mainContent");
  if(lockScreen) lockScreen.style.display = "none";
  if(mainContent) mainContent.style.display = "block";
}

function showLockScreen() {
  document.documentElement.classList.add('locked');
  const lockScreen = document.getElementById("lockScreen");
  const mainContent = document.getElementById("mainContent");
  if(lockScreen) lockScreen.style.display = "flex";
  if(mainContent) mainContent.style.display = "none";
}

/* ============================================
   MAIN APPLICATION LOGIC
============================================ */
document.addEventListener("DOMContentLoaded", () => {
  
  const OPEN_DATE_WIB = new Date('2026-09-04T10:00:00+07:00');
  
  const CODE1_PERMANENT = "377d5f728ea650492e175b762912e0bdb3e94ea0e42428824c40419531fdcea3";
  const CODE2_BURN = "83ddf99bad01119a253b475dfe25ac22a3aef62de5aae568e399f470caab806c";
  const CODE3_RESET = "c670799c644ac177a66842637b507c6b80991319c716df11d702ea33306ed810";

  const accessCode = document.getElementById("accessCode");
  const errorMsg = document.getElementById("errorMsg");
  const togglePassword = document.getElementById('togglePassword');
  const submitBtn = document.getElementById('submitBtn');
  const body = document.body;
  
  /* ============================================
     TAMBAHAN: DETEKSI TUTUP TAB
  ============================================ */
  window.addEventListener('pagehide', () => {
    if(!sessionStorage.getItem('justLoggedIn')){
      sessionStorage.setItem("wasClosed", "1");
    }
  });

  /* ============================================
     INITIAL LOAD CHECK - FIX F5 VS TUTUP TAB
  ============================================ */
  function handlePageState() {
    if (new Date() >= OPEN_DATE_WIB) {
      openWebsite();
      return;
    }

    const loginType = localStorage.getItem("loginType");
    const burnUsed = localStorage.getItem("burnUsed") === "1";
    const sessionFlag = sessionStorage.getItem("sessionActive");
    const wasClosed = sessionStorage.getItem("wasClosed");

    sessionStorage.removeItem("wasClosed");
    sessionStorage.removeItem("justLoggedIn");

    if (loginType === "perm") {
      openWebsite(); 
      return;
    }

    if (loginType === "burn") {
      if(burnUsed && wasClosed){
        localStorage.removeItem("loginType");
        localStorage.removeItem("burnUsed");
        showLockScreen();
        return;
      }
      if(burnUsed && !wasClosed){
        sessionStorage.setItem("sessionActive", "1");
        openWebsite();
        return;
      }
      if (!burnUsed) {
        sessionStorage.setItem("sessionActive", "1");
        openWebsite();
      }
      return;
    }

    if (loginType === "temp") {
      localStorage.removeItem("loginType");
      showLockScreen(); 
      return;
    }

    showLockScreen(); 
  }
  
  handlePageState(); 

  /* ============================================
     COUNTDOWN TIMER
  ============================================ */
  function updateTimer() {
    const now = getWIBDate();
    const diff = OPEN_DATE_WIB - now;
    if (diff <= 0) {
      openWebsite();
      clearInterval(timerInterval);
      const timerEl = document.getElementById("timer");
      if(timerEl) timerEl.innerHTML = `<span>WEB</span> <span>SUDAH</span> <span>BUKA</span>`;
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const timerEl = document.getElementById("timer");
    if(timerEl) timerEl.innerHTML = `<span>${d}H</span> <span>${h}J</span> <span>${m}M</span> <span>${s}D</span>`;
  }
  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
  
  /* ============================================
     PASSWORD VISIBILITY TOGGLE
  ============================================ */
  if(togglePassword && accessCode) {
    togglePassword.addEventListener('click', function() {
      const type = accessCode.getAttribute('type') === 'password' ? 'text' : 'password';
      accessCode.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  }
  
  /* ============================================
     HASHING FUNCTION - SHA256
  ============================================ */
  async function hashCode(code) {
    const msgBuffer = new TextEncoder().encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  /* ============================================
     ACCESS CODE VALIDATION
  ============================================ */
  async function checkCode() {
    if(!accessCode) return;
    const kodeInput = accessCode.value.trim();
    if(kodeInput === "") {
      if(errorMsg){ errorMsg.innerText = "Kode tidak boleh kosong!"; errorMsg.classList.add("show"); setTimeout(() => errorMsg.classList.remove("show"), 2500); }
      return;
    }

    const inputHash = await hashCode(kodeInput);
    const burnUsed = localStorage.getItem("burnUsed") === "1";

    if (inputHash === CODE1_PERMANENT) {
      localStorage.setItem("loginType", "perm");
      sessionStorage.setItem('justLoggedIn', '1');
      openWebsite();
      return;
    }

    if (inputHash === CODE2_BURN) {
      if (burnUsed) { 
        if(errorMsg){ 
          errorMsg.innerText = "Kode ini sudah hangus dan tidak bisa dipakai lagi!"; 
          errorMsg.classList.add("show"); 
          accessCode.value = ""; 
          accessCode.focus();
          setTimeout(() => { errorMsg.innerText = ""; errorMsg.classList.remove("show"); }, 2500); 
        }
        return; 
      } else {
        localStorage.setItem("loginType", "burn");
        localStorage.setItem("burnUsed", "1");
        sessionStorage.setItem("sessionActive", "1");
        sessionStorage.setItem('justLoggedIn', '1');
        openWebsite();
        return;
      }
    }
    
    if (inputHash === CODE3_RESET) {
      localStorage.setItem("loginType", "temp");
      sessionStorage.setItem('justLoggedIn', '1');
      openWebsite();
      return;
    }

    if(errorMsg){
      errorMsg.innerText = `"${kodeInput}" kode akses salah`;
      errorMsg.classList.add("show");
      accessCode.value = "";
      accessCode.focus();
      setTimeout(() => { errorMsg.innerText = ""; errorMsg.classList.remove("show"); }, 2500);
    }
  }
  
  if(submitBtn) submitBtn.addEventListener('click', checkCode);
  if(accessCode) accessCode.addEventListener('keyup', (e) => { if(e.key === 'Enter') checkCode() });
  
  /* ============================================
     THEME TOGGLE
  ============================================ */
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const icons = {
    light: `<svg class="icon-sun" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="4" fill="#FFC107"/><g stroke="#FFC107" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22"/><path d="M5.5 5.5l1.77 1.77M16.73 16.73l1.77 1.77M5.5 18.5l1.77-1.77M16.73 7.27l1.77-1.77"/></g></svg>`,
    dark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#90CAF9"/></svg>`
  };
  function applyTheme(theme) {
    if (!root || !toggleBtn) return;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      toggleBtn.innerHTML = icons.dark;
      toggleBtn.title = 'Mode Malam';
    } else {
      root.removeAttribute('data-theme');
      toggleBtn.innerHTML = icons.light;
      toggleBtn.title = 'Mode Siang';
    }
  }
  function initTheme() {
    const saved = localStorage.getItem('site-theme');
    if (saved) { applyTheme(saved); return; }
    applyTheme('dark');
  }
  if(toggleBtn){
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('site-theme', next);
    });
  }
  initTheme();

  /* ============================================
     NAVIGATION & ABOUT & POPUP & PDF
  ============================================ */
  const navLinks = document.querySelectorAll('.nav-links a');
  const aboutSection = document.querySelector('.about');
  const btnTentang = document.querySelector('.nav-links a[href="#about"]');
  function resetAll() {
    if(aboutSection) aboutSection.classList.remove('active');
    navLinks.forEach(l => l.classList.remove('active'));
  }
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (link.getAttribute('href') === '#about') {
        resetAll(); link.classList.add('active'); if(aboutSection) aboutSection.classList.add('active');
        if(aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        resetAll(); link.classList.add('active');
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  document.addEventListener('click', (e) => {
    if (aboutSection && !aboutSection.contains(e.target) && btnTentang && !btnTentang.contains(e.target)) resetAll();
  });
  if(aboutSection) aboutSection.addEventListener('click', (e) => { e.stopPropagation(); resetAll(); });

  const popup = document.getElementById('popup');
  const popupText = document.getElementById('popup-text');
  const popupClose = document.querySelector('.popup-close');
  function showPopup(message) { if(popup && popupText){ popupText.textContent = message; popup.classList.remove('hidden'); body.classList.add('no-scroll'); } }
  function hidePopup() { if(popup){ popup.classList.add('hidden'); body.classList.remove('no-scroll'); } }
  if(popupClose) popupClose.addEventListener('click', hidePopup);
  if(popup) popup.addEventListener('click', (e) => { if (e.target === popup) hidePopup(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hidePopup(); });

  const downloadBtns = document.querySelectorAll('.btn-outline[href$=".pdf"]');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const url = btn.getAttribute('href');
      try { 
        const res = await fetch(url, { method: 'GET' }); 
        if (!res.ok) { e.preventDefault(); showPopup('File belum bisa di akses'); } 
      }
      catch (err) { e.preventDefault(); showPopup('File belum bisa di akses'); }
    });
  });
});