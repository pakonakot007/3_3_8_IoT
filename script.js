const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const toggleIcon = document.querySelector('.toggle-icon');
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
const revealElements = document.querySelectorAll('.reveal');
const skillBars = document.querySelectorAll('.progress-bar span');
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxClose = document.querySelector('.lightbox-close');

function applyTheme(theme) {
  if (theme === 'dark') {
    root.classList.add('dark-mode');
    toggleIcon.textContent = '🌙';
  } else {
    root.classList.remove('dark-mode');
    toggleIcon.textContent = '☀️';
  }
}

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  applyTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const nextTheme = root.classList.contains('dark-mode') ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem('portfolio-theme', nextTheme);
});

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? scrollTop / height : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  backToTop.style.opacity = scrollTop > 500 ? '1' : '0';
  backToTop.style.pointerEvents = scrollTop > 500 ? 'auto' : 'none';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('load', updateScrollProgress);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skillBars.forEach((bar) => {
          const level = bar.dataset.level;
          bar.style.width = `${level}%`;
        });
        skillObserver.disconnect();
      }
    });
  },
  { threshold: 0.3 }
);

const skillsSection = document.querySelector('.skills-grid');
if (skillsSection) {
  skillObserver.observe(skillsSection);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    galleryItems.forEach((item) => {
      const matches = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !matches);
    });
  });
});

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    openLightbox(img.src, img.alt);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
  }
});

backToTop.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
