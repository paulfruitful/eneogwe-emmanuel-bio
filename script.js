/**
 * Eneogwe I.N. Emmanuel — Executive Bio & Complimentary Card Site
 * Vanilla JavaScript interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Toggle
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

  // 3. Active Navigation Highlight on Scroll
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id], footer[id]');

  function updateActiveNav() {
    let currentSectionId = 'home';
    const scrollPos = window.scrollY + 140;

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

  // 4. Full Biography Modal
  const bioModal = document.getElementById('bio-modal');
  const openModalBtn = document.getElementById('open-bio-modal');
  const openModalFooterBtn = document.getElementById('open-bio-modal-footer');
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
  if (openModalFooterBtn) openModalFooterBtn.addEventListener('click', openBioModal);
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

  // 5. Complimentary Card vCard (.vcf) Generator
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

  // 6. Share / Copy Profile Link
  const shareBtn = document.getElementById('share-profile-btn');
  const shareBtnText = document.getElementById('share-btn-text');

  if (shareBtn && shareBtnText) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Eneogwe I.N. Emmanuel — Executive Bio',
        text: 'President, International Human Rights Protection Service (Nigeria) & Entrepreneur.',
        url: window.location.href
      };

      if (navigator.share && window.location.protocol.startsWith('http')) {
        try {
          await navigator.share(shareData);
          return;
        } catch {
          // Fallback to clipboard copy
        }
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        const originalText = shareBtnText.textContent;
        shareBtnText.textContent = 'Profile Link Copied!';
        setTimeout(() => {
          shareBtnText.textContent = originalText;
        }, 2200);
      } catch {
        shareBtnText.textContent = 'Link Ready';
      }
    });
  }
});
