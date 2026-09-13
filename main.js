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

document.addEventListener("DOMContentLoaded", () => {
  const CODE1_PERMANENT = "377d5f728ea650492e175b762912e0bdb3e94ea0e42428824c40419531fdcea3";
  const CODE2_BURN = "83ddf99bad01119a253b475dfe25ac22a3aef62de5aae568e399f470caab806c";
  const CODE3_RESET = "c670799c644ac177a66842637b507c6b80991319c716df11d702ea33306ed810";
  const accessCode = document.getElementById("accessCode");
  const errorMsg = document.getElementById("errorMsg");
  const togglePassword = document.getElementById('togglePassword');
  const submitBtn = document.getElementById('submitBtn');
  const body = document.body;
  
  function checkAccess() {
    const perm = localStorage.getItem("access_perm");
    const burn = sessionStorage.getItem("burn_session");
    if (perm || burn) { openWebsite(); } else { showLockScreen(); }
  }
  checkAccess();
  
  if(togglePassword && accessCode) {
    togglePassword.addEventListener('click', function() {
      const type = accessCode.getAttribute('type') === 'password' ? 'text' : 'password';
      accessCode.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  }
  
  async function hashCode(code) {
    const msgBuffer = new TextEncoder().encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  async function validateCode() {
    if(!accessCode) return;
    const input = accessCode.value.trim();
    if (input === "") { showError("Kode tidak boleh kosong!"); return; }
    const inputHash = await hashCode(input);
    let usedCodes = JSON.parse(localStorage.getItem("used_codes")) || [];
    if (inputHash === CODE1_PERMANENT) {
      localStorage.setItem("access_perm", "true"); openWebsite(); accessCode.value = ""; return;
    }
    if (inputHash === CODE2_BURN) {
      if (usedCodes.includes(CODE2_BURN)) { showError("Kode ini sudah hangus!"); accessCode.value = ""; return; }
      usedCodes.push(CODE2_BURN); localStorage.setItem("used_codes", JSON.stringify(usedCodes));
      sessionStorage.setItem("burn_session", "true"); openWebsite(); accessCode.value = ""; return;
    }
    if (inputHash === CODE3_RESET) { openWebsite(); accessCode.value = ""; return; }
    showError("", input); accessCode.value = "";
  }

  function showError(msg, wrongCode = "") {
    if (wrongCode !== "") { errorMsg.innerHTML = ` "${wrongCode}" kode akses salah`; } 
    else { errorMsg.innerHTML = ` ${msg}`; }
    errorMsg.classList.add("show");
    setTimeout(() => { errorMsg.classList.remove("show"); }, 2500);
  }
  if(submitBtn) submitBtn.addEventListener('click', validateCode);
  if(accessCode) accessCode.addEventListener('keyup', (e) => { if(e.key === 'Enter') validateCode() });

  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const icons = {
  light: `<svg class="icon-sun" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="4" fill="#FFC107"/><g stroke="#FFC107" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22"/><path d="M5.5 5.5l1.77 1.77M16.73 16.73l1.77 1.77M5.5 18.5l1.77-1.77M16.73 7.27l1.77-1.77"/></g></svg>`,
  dark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#90CAF9"/></svg>`
};
  function applyTheme(theme) {
    if (!root || !toggleBtn) return;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light'); toggleBtn.innerHTML = icons.dark; toggleBtn.title = 'Mode Malam';
    } else {
      root.removeAttribute('data-theme'); toggleBtn.innerHTML = icons.light; toggleBtn.title = 'Mode Siang';
    }
  }
  function initTheme() {
    const saved = localStorage.getItem('site-theme');
    if (saved) { applyTheme(saved); return; } applyTheme('dark');
  }
  if(toggleBtn){
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next); localStorage.setItem('site-theme', next);
    });
  }
  initTheme();

  const popup = document.getElementById('popup');
  const popupText = document.getElementById('popup-text');
  const popupClose = document.querySelector('.popup-close');
  function showPopup(message) { 
    if(popup && popupText){ 
      popupText.textContent = message; 
      popup.classList.remove('hidden'); 
      body.classList.add('no-scroll'); 
    } 
  }
  function hidePopup() { 
    if(popup){ 
      popup.classList.add('hidden'); 
      body.classList.remove('no-scroll'); 
    } 
  }
  if(popupClose) popupClose.addEventListener('click', hidePopup);
  if(popup) popup.addEventListener('click', (e) => { if (e.target === popup) hidePopup(); });

  /* ============================================
     FITUR KODE PER KELOMPOK 1-5 - DENGAN CEK FILE
  ============================================ */
  const secureBtns = document.querySelectorAll('.secure-btn');
  const kodePopup = document.getElementById('kodePopup');
  const kodePopupClose = document.getElementById('kodePopupClose');
  const kodeInput = document.getElementById('kodeInput');
  const kodeSubmitBtn = document.getElementById('kodeSubmitBtn');
  const kodeError = document.getElementById('kodeError');
  const kodePopupText = document.getElementById('kodePopupText');
  let currentBtn = null;
  const KODE_KELOMPOK = { "1": "1", "2": "2", "3": "3", "4": "4", "5": "5" };

  secureBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentBtn = btn;
      const kodeKelompok = btn.getAttribute('data-kode');
      kodePopupText.innerText = `Masukkan kode untuk Kelompok ${kodeKelompok}`;
      kodeInput.value = '';
      kodeError.innerText = '';
      kodeError.classList.remove('show');
      kodePopup.classList.remove('hidden');
      body.classList.add('no-scroll');
    });
  });

  kodeSubmitBtn.addEventListener('click', async () => {
    const input = kodeInput.value.trim();
    if(!currentBtn) return;
    const url = currentBtn.getAttribute('href');
    const isDownload = currentBtn.hasAttribute('download');
    const kodeBenar = KODE_KELOMPOK[ currentBtn.getAttribute('data-kode') ];
    
    // TAMBAHAN: CEK KOSONG DULU
    if (input === "") {
      kodeError.innerText = `Kode tidak boleh kosong!`;
      kodeError.classList.add('show');
      kodeInput.focus();
      setTimeout(() => kodeError.classList.remove('show'), 2000);
      return; // stop disini
    }

    if(input === kodeBenar){
      hideKodePopup();
      if(isDownload){
        // INI LOGIC DARI JS:2 PINDAH KE SINI
        try { 
          const res = await fetch(url, { method: 'GET', cache: 'no-store' }); 
          if (!res.ok) { 
            throw new Error('404'); // kalau 404 langsung masuk catch
          } 
          // KALAU 200 BARU DOWNLOAD
          const blob = await res.blob();
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = url.split('/').pop();
          document.body.appendChild(link); link.click(); document.body.removeChild(link);
        }
        catch (err) { 
          showPopup('File belum bisa di akses'); // INI DARI JS:2
        }
      } else {
        // Untuk link eksternal kelompok 2 "Tampilkan"
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else {
      kodeError.innerText = `Kode salah, silahkan coba lagi`;
      kodeError.classList.add('show');
      kodeInput.value = '';
      kodeInput.focus();
      setTimeout(() => kodeError.classList.remove('show'), 2000);
    }
  });

  function hideKodePopup(){
    kodePopup.classList.add('hidden');
    body.classList.remove('no-scroll');
    currentBtn = null;
  }
  if(kodePopupClose) kodePopupClose.addEventListener('click', hideKodePopup);
  if(kodePopup) kodePopup.addEventListener('click', (e) => { if (e.target === kodePopup) hideKodePopup(); });
  if(kodeInput) kodeInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') kodeSubmitBtn.click() });
});