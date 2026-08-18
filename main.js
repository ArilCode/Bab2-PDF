// Theme toggle: default DARK. Cuma set data-theme="light" kalau user pilih light
const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

const icons = {
  light: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.04 2.05l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM20 11v2h3v-2h-3zM13 23h-2v-3h2v3zm4.24-2.84l1.8 1.79 1.8-1.79-1.79-1.79-1.81 1.79zM4.22 19.78l1.8-1.79-1.79-1.79-1.8 1.79 1.79 1.79zM12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" 
    fill="#FFC107"/></svg>`, // KUNING MATAHARI - muncul pas dark
  
  dark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
    fill="#90CAF9"/></svg>` // BIRU MUDA BULAN - muncul pas light
};

function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light'); // cuma set kalau light
    toggleBtn.innerHTML = icons.dark; // show moon to switch to dark
    toggleBtn.title = 'Mode Malam';
  } else {
    root.removeAttribute('data-theme'); // default dark = hapus atribut
    toggleBtn.innerHTML = icons.light; // show sun to switch to light
    toggleBtn.title = 'Mode Siang';
  }
}

function initTheme() {
  const saved = localStorage.getItem('site-theme');
  if (saved) {
    applyTheme(saved); // pakai yg terakhir user pilih
    return;
  }
  // jika belum ada preferensi, default langsung DARK
  applyTheme('dark');
}

toggleBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('site-theme', next);
});

// inisialisasi
initTheme();

// SISA KODE KAMU TETAP SAMA
const navLinks = document.querySelectorAll('.nav-links a');
const aboutSection = document.querySelector('.about');
const btnTentang = document.querySelector('.nav-links a[href="#about"]');

function resetAbout() {
  aboutSection.classList.remove('active');
  navLinks.forEach(l => l.classList.remove('active'));
}

btnTentang.addEventListener('click', (e) => {
  e.preventDefault();
  resetAbout();
  e.target.classList.add('active');
  aboutSection.classList.add('active');
  aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('.nav-links a:not([href="#about"])').forEach(link => {
  link.addEventListener('click', (e) => {
    resetAbout();
    e.target.classList.add('active');
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

aboutSection.addEventListener('click', () => {
  resetAbout();
  document.querySelector('.nav-links a[href="#home"]').classList.add('active');
});

document.querySelector('.nav-links a[href="#home"]').classList.add('active');



// CEK FILE PDF SEBELUM DOWNLOAD
const popup = document.getElementById('popup');
const popupText = document.getElementById('popup-text');
const popupClose = document.querySelector('.popup-close');
const downloadBtns = document.querySelectorAll('.btn-outline[href$=".pdf"]');
const body = document.body; // TAMBAH INI

function showPopup(message) {
  popupText.textContent = message;
  popup.classList.remove('hidden');
  body.classList.add('no-scroll'); // KUNCI SCROLL
}

function hidePopup() {
  popup.classList.add('hidden');
  body.classList.remove('no-scroll'); // BUKA SCROLL LAGI
}

popupClose.addEventListener('click', hidePopup);
popup.addEventListener('click', (e) => {
  if (e.target === popup) hidePopup(); // klik di luar juga nutup + buka scroll
});

downloadBtns.forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const url = btn.getAttribute('href');
    
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) {
        e.preventDefault();
        showPopup('file belum bisa di akses');
      }
    } catch (err) {
      e.preventDefault();
      showPopup('file belum ada / gagal memuat');
    }
  });
});