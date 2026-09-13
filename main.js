/* ============================================
   AUTHENTICATION & ACCESS CONTROL SYSTEM
   Purpose: Handle lock screen, access codes, and session management
============================================ */

/**
 * Opens the main website content and hides lock screen
 */
function openWebsite() {
  document.documentElement.classList.remove('locked'); 
  const lockScreen = document.getElementById("lockScreen");
  const mainContent = document.getElementById("mainContent");
  if(lockScreen) lockScreen.style.display = "none";
  if(mainContent) mainContent.style.display = "block";
}

/**
 * Displays the lock screen and hides main content
 */
function showLockScreen() {
  document.documentElement.classList.add('locked');
  const lockScreen = document.getElementById("lockScreen");
  const mainContent = document.getElementById("mainContent");
  if(lockScreen) lockScreen.style.display = "flex";
  if(mainContent) mainContent.style.display = "none";
}

/* ============================================
   DOM CONTENT LOADED - INITIALIZATION
============================================ */
document.addEventListener("DOMContentLoaded", () => {

  /* ============================================
     ACCESS CODE CONFIGURATION
     Purpose: SHA-256 hashed codes for different access levels
     CODE1: Permanent access - stored in localStorage
     CODE2: Burn code - single use, stored in used_codes array
     CODE3: Session reset code - temporary access
  ============================================ */
  const CODE1_PERMANENT = "377d5f728ea650492e175b762912e0bdb3e94ea0e42428824c40419531fdcea3";
  const CODE2_BURN = "83ddf99bad01119a253b475dfe25ac22a3aef62de5aae568e399f470caab806c";
  const CODE3_RESET = "c670799c644ac177a66842637b507c6b80991319c716df11d702ea33306ed810";

  /* DOM Element References */
  const accessCode = document.getElementById("accessCode");
  const errorMsg = document.getElementById("errorMsg");
  const togglePassword = document.getElementById('togglePassword');
  const submitBtn = document.getElementById('submitBtn');
  const body = document.body;
  
  /* ============================================
     ACCESS VERIFICATION ON PAGE LOAD
     Purpose: Check existing session before showing content
  ============================================ */
  function checkAccess() {
    const perm = localStorage.getItem("access_perm");
    const burn = sessionStorage.getItem("burn_session");
    
    if (perm || burn) {
      openWebsite();
    } else {
      showLockScreen();
    }
  }

  checkAccess();
  
  /* ============================================
     PASSWORD VISIBILITY TOGGLE
     Purpose: Show/hide password input
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
     CRYPTOGRAPHIC HASHING FUNCTION
     Purpose: Hash input code using SHA-256 for secure comparison
  ============================================ */
  async function hashCode(code) {
    const msgBuffer = new TextEncoder().encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  /* ============================================
     CODE VALIDATION LOGIC
     Purpose: Verify access code and manage access permissions
  ============================================ */
  async function validateCode() {
    if(!accessCode) return;
    const input = accessCode.value.trim();
    if (input === "") {
      showError("Kode tidak boleh kosong!");
      return;
    }
    
    const inputHash = await hashCode(input);
    let usedCodes = JSON.parse(localStorage.getItem("used_codes")) || [];
    
    // Permanent Access Code
    if (inputHash === CODE1_PERMANENT) {
      localStorage.setItem("access_perm", "true");
      openWebsite();
      accessCode.value = "";
      return;
    }
    
    // Burn Code - Single Use Only
    if (inputHash === CODE2_BURN) {
      if (usedCodes.includes(CODE2_BURN)) {
        showError("Kode ini sudah hangus dan tidak bisa dipakai lagi!");
        accessCode.value = "";
        return;
      }
      usedCodes.push(CODE2_BURN);
      localStorage.setItem("used_codes", JSON.stringify(usedCodes));
      sessionStorage.setItem("burn_session", "true");
      openWebsite();
      accessCode.value = "";
      return;
    }
    
    // Reset/Session Code
    if (inputHash === CODE3_RESET) {
      openWebsite();
      accessCode.value = "";
      return;
    }
    
    // Invalid Code
    showError("", input);
    accessCode.value = "";
  }

  /* ============================================
     ERROR MESSAGE DISPLAY
     Purpose: Show validation errors with auto-hide
  ============================================ */
  function showError(msg, wrongCode = "") {
    if (wrongCode !== "") {
      errorMsg.innerHTML = ` "${wrongCode}" kode akses salah`;
    } else {
      errorMsg.innerHTML = `️ ${msg}`;
    }
    errorMsg.classList.add("show");

    setTimeout(() => {
      errorMsg.classList.remove("show");
    }, 2500);
  }
  
  /* Event Listeners for Login */
  if(submitBtn) submitBtn.addEventListener('click', validateCode);
  if(accessCode) accessCode.addEventListener('keyup', (e) => { if(e.key === 'Enter') validateCode() });

  /* ============================================
     THEME MANAGEMENT SYSTEM
     Purpose: Dark/Light theme toggle with localStorage persistence
  ============================================ */
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const icons = {
    light: `<svg class="icon-sun" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="4" fill="#FFC107"/><g stroke="#FFC107" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22"/><path d="M5.5 5.5l1.77 1.77M16.73 16.73l1.77 1.77M5.5 18.5l1.77-1.77M16.73 7.27l1.77-1.77"/></g></svg>`,
    dark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#90CAF9"/></svg>`
  };
  
  /**
   * Applies theme to document and updates toggle button
   */
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
  
  /**
   * Initialize theme from localStorage or default to dark
   */
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
     NAVIGATION & SECTION HIGHLIGHTING
     Purpose: Smooth scrolling and active state management
  ============================================ */
  const navLinks = document.querySelectorAll('.nav-links a');
  const aboutSection = document.querySelector('.about');
  const btnTentang = document.querySelector('.nav-links a[href="#about"]');
  
  /**
   * Reset all active states
   */
  function resetAll() {
    if(aboutSection) aboutSection.classList.remove('active');
    navLinks.forEach(l => l.classList.remove('active'));
  }
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (link.getAttribute('href') === '#about') {
        resetAll(); 
        link.classList.add('active'); 
        if(aboutSection) aboutSection.classList.add('active');
        if(aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        resetAll(); 
        link.classList.add('active');
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  /* Click outside to reset about section */
  document.addEventListener('click', (e) => {
    if (aboutSection && !aboutSection.contains(e.target) && btnTentang && !btnTentang.contains(e.target)) resetAll();
  });
  
  if(aboutSection) aboutSection.addEventListener('click', (e) => { e.stopPropagation(); resetAll(); });

  /* ============================================
     POPUP MODAL SYSTEM
     Purpose: Display notifications and handle user interactions
  ============================================ */
  const popup = document.getElementById('popup');
  const popupText = document.getElementById('popup-text');
  const popupClose = document.querySelector('.popup-close');
  
  /**
   * Show popup with custom message
   */
  function showPopup(message) { 
    if(popup && popupText){ 
      popupText.textContent = message; 
      popup.classList.remove('hidden'); 
      body.classList.add('no-scroll'); 
    } 
  }
  
  /**
   * Hide popup and restore scrolling
   */
  function hidePopup() { 
    if(popup){ 
      popup.classList.add('hidden'); 
      body.classList.remove('no-scroll'); 
    } 
  }
  
  if(popupClose) popupClose.addEventListener('click', hidePopup);
  if(popup) popup.addEventListener('click', (e) => { if (e.target === popup) hidePopup(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hidePopup(); });

  /* ============================================
     FILE DOWNLOAD VALIDATION
     Purpose: Check PDF availability before downloading
  ============================================ */
  const downloadBtns = document.querySelectorAll('.btn-outline[href$=".pdf"]');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const url = btn.getAttribute('href');
      try { 
        const res = await fetch(url, { method: 'GET' }); 
        if (!res.ok) { 
          e.preventDefault(); 
          showPopup('File belum bisa di akses'); 
        } 
      }
      catch (err) { 
        e.preventDefault(); 
        showPopup('File belum bisa di akses'); 
      }
    });
  });
});