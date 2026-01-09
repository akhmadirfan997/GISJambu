// Smooth scroll untuk anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

// Image fallback handling
const backgroundImage = document.getElementById('backgroundImage');
if (backgroundImage) {
    backgroundImage.addEventListener('error', () => {
        // Fallback gradient jika gambar gagal dimuat
        const imageBackground = document.querySelector('.image-background');
        if (imageBackground) {
            imageBackground.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            const img = imageBackground.querySelector('img');
            if (img) img.style.display = 'none';
        }
    });
}

