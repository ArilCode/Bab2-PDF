document.addEventListener('DOMContentLoaded', function() {
    
    const downloadBtns = document.querySelectorAll('.download-btn');
    
    downloadBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            const fileName = btn.getAttribute('href').split('/').pop();
            
            // efek klik opacity
            btn.style.opacity = '0.7';
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
            }, 300);
            
            // kasih notif kecil
            btn.innerHTML = '<span>✅</span> Mendownload...';
            setTimeout(() => {
                btn.innerHTML = '<span>⬇️</span> Download';
            }, 1500);
        });
    });
    
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
    });
    
    const pdfCards = document.querySelectorAll('.pdf-card');
    pdfCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = 'slideUp 0.6s ease-out ' + (index * 0.1) + 's forwards';
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
        .download-btn {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});