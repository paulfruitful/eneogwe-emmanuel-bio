/**
 * Eneogwe I.N. Emmanuel — Executive Bio & Complimentary Card Site
 * Vanilla JavaScript:
 * 1. Classic Royal Loader
 * 2. Minimalist IntersectionObserver Scroll Animations
 * 3. Hero Portrait Crossfade Slider
 * 4. Executive Sector Spotlights Carousel Slider (with swipe & auto-play)
 * 5. Mobile Navigation, Scroll Spy, Full Bio Modal & vCard Download
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================== 1. CLASSIC ROYAL LOADER ====================
  const royalLoader = document.getElementById('royal-loader');
  const revealItems = document.querySelectorAll('.reveal-item');

  function initScrollReveal() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: '0px 0px -24px 0px' }
      );

      revealItems.forEach((el) => observer.observe(el));
    } else {
      revealItems.forEach((el) => el.classList.add('is-visible'));
    }
  }

  setTimeout(() => {
    if (royalLoader) {
      royalLoader.classList.add('loader-hidden');
    }
    initScrollReveal();
  }, 1150);

  // ==================== 2. HERO PORTRAIT SLIDER ====================
  const heroSlides = document.querySelectorAll('[data-hero-slide]');
  const heroDots = document.querySelectorAll('[data-hero-dot]');
  const heroPrev = document.getElementById('hero-prev');
  const heroNext = document.getElementById('hero-next');
  let currentHeroSlide = 0;
  let heroInterval = null;

  function setHeroSlide(index) {
    if (!heroSlides.length) return;
    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentHeroSlide);
    });

    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentHeroSlide);
    });
  }

  function startHeroAutoPlay() {
    stopHeroAutoPlay();
    heroInterval = setInterval(() => {
      setHeroSlide(currentHeroSlide + 1);
    }, 5500);
  }

  function stopHeroAutoPlay() {
    if (heroInterval) clearInterval(heroInterval);
  }

  if (heroPrev) {
    heroPrev.addEventListener('click', () => {
      setHeroSlide(currentHeroSlide - 1);
      startHeroAutoPlay();
    });
  }

  if (heroNext) {
    heroNext.addEventListener('click', () => {
      setHeroSlide(currentHeroSlide + 1);
      startHeroAutoPlay();
    });
  }

  heroDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-hero-dot'), 10);
      setHeroSlide(idx);
      startHeroAutoPlay();
    });
  });

  startHeroAutoPlay();

  // ==================== 3. EXECUTIVE SECTOR SPOTLIGHTS SLIDER ====================
  const sliderTrack = document.getElementById('slider-track');
  const sliderDots = document.querySelectorAll('[data-slide]');
  const sliderPrev = document.getElementById('slider-prev');
  const sliderNext = document.getElementById('slider-next');
  const sliderViewport = document.getElementById('highlights-slider');
  const totalSlides = sliderDots.length;
  let currentSlide = 0;
  let sliderTimer = null;

  function goToSlide(index) {
    if (!sliderTrack || !totalSlides) return;
    currentSlide = (index + totalSlides) % totalSlides;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    sliderDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startSliderAutoPlay() {
    stopSliderAutoPlay();
    sliderTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 4800);
  }

  function stopSliderAutoPlay() {
    if (sliderTimer) clearInterval(sliderTimer);
  }

  if (sliderPrev) {
    sliderPrev.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startSliderAutoPlay();
    });
  }

  if (sliderNext) {
    sliderNext.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startSliderAutoPlay();
    });
  }

  sliderDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      goToSlide(idx);
      startSliderAutoPlay();
    });
  });

  if (sliderViewport) {
    sliderViewport.addEventListener('mouseenter', stopSliderAutoPlay);
    sliderViewport.addEventListener('mouseleave', startSliderAutoPlay);

    // Touch Swipe Support
    let touchStartX = 0;
    sliderViewport.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    sliderViewport.addEventListener(
      'touchend',
      (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
          goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
          startSliderAutoPlay();
        }
      },
      { passive: true }
    );
  }

  startSliderAutoPlay();

  // ==================== 4. MOBILE NAVIGATION ====================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileMenu || !mobileMenuBtn) return;
    const isHidden = mobileMenu.classList.contains('hidden');
    const shouldClose = forceClose || !isHidden;

    if (shouldClose) {
      mobileMenu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.classList.remove('hidden');
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  // ==================== 5. ACTIVE NAVIGATION ON SCROLL ====================
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id], footer[id]');

  function updateActiveNav() {
    let currentSectionId = 'home';
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ==================== 6. FULL BIOGRAPHY MODAL ====================
  const bioModal = document.getElementById('bio-modal');
  const openModalBtn = document.getElementById('open-bio-modal');
  const closeModalBtn = document.getElementById('close-bio-modal');
  const closeModalBottomBtn = document.getElementById('close-bio-modal-bottom');

  function openBioModal() {
    if (!bioModal) return;
    bioModal.classList.remove('hidden');
    bioModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeBioModal() {
    if (!bioModal) return;
    bioModal.classList.add('hidden');
    bioModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openBioModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeBioModal);
  if (closeModalBottomBtn) closeModalBottomBtn.addEventListener('click', closeBioModal);

  if (bioModal) {
    bioModal.addEventListener('click', (e) => {
      if (e.target === bioModal) {
        closeBioModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bioModal && !bioModal.classList.contains('hidden')) {
      closeBioModal();
    }
  });

  // ==================== 7. COMPLIMENTARY CARD vCard (.vcf) ====================
  const downloadVcardBtn = document.getElementById('download-vcard-btn');
  if (downloadVcardBtn) {
    downloadVcardBtn.addEventListener('click', () => {
      const vcardContent = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Eneogwe;Emmanuel;I.N.;;',
        'FN:Eneogwe I.N. Emmanuel',
        'TITLE:President - International Human Rights Protection Service (Nigeria)',
        'ORG:International Human Rights Protection Service (Nigeria)',
        'NOTE:Entrepreneur, Human Capacity Development Advocate, Champion of Youth Empowerment, and Board Member across 11+ Corporate Entities including Bokans Engineering and Construction Ltd., Eastern Keys Ltd., Emmanetic Energy Ltd., Eastern Volume Ltd., The Truth Channel Inc., and Eastern Technologies Ltd.',
        `URL:${window.location.href}`,
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Eneogwe-IN-Emmanuel.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});
