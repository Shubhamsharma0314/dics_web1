/* ============================================
   DICS Computer Education - Main JavaScript
   ============================================ */

/* ---- Popup Enquiry Form ---- */
// (function () {
//   const overlay = document.getElementById('popupOverlay');
//   const closeBtn = document.getElementById('popupClose');
//   const popupForm = document.getElementById('popupForm');

//   if (overlay) {
//     if (!sessionStorage.getItem('popupDismissed')) {
//       setTimeout(() => {
//         overlay.classList.remove('hidden');
//       }, 1800);
//     }

//     closeBtn && closeBtn.addEventListener('click', () => {
//       overlay.classList.add('hidden');
//       sessionStorage.setItem('popupDismissed', '1');
//     });

//     overlay.addEventListener('click', (e) => {
//       if (e.target === overlay) {
//         overlay.classList.add('hidden');
//         sessionStorage.setItem('popupDismissed', '1');
//       }
//     });

//     document.addEventListener('keydown', (e) => {
//       if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
//         overlay.classList.add('hidden');
//         sessionStorage.setItem('popupDismissed', '1');
//       }
//     });

//     if (popupForm) {
//       popupForm.addEventListener('submit', (e) => {
//         e.preventDefault();
//         if (validateForm(popupForm)) {
//           const btn = popupForm.querySelector('button[type="submit"]');
//           btn.textContent = '✓ Enquiry Submitted!';
//           btn.style.background = '#22c55e';
//           setTimeout(() => {
//             overlay.classList.add('hidden');
//             sessionStorage.setItem('popupDismissed', '1');
//           }, 1500);
//         }
//       });
//     }
//   }
// })();
// new -
/* ---- Popup Enquiry Form (Always Show) ---- */
(function () {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5JfWheXdIhA13E8_rWLLRuJ_lKUTS_DQLM_xdL2jq84GO48zwrdUiUBQ5gmOUE22X6Q/exec"; 

  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const popupForm = document.getElementById('popupForm');

  if (overlay) {
    // Always show popup after delay
    setTimeout(() => {
      overlay.classList.remove('hidden');
    }, 1800);

    // Close button
    closeBtn && closeBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
    });

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
        overlay.classList.add('hidden');
      }
    });

    // Form submit
    if (popupForm) {
      popupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm(popupForm)) return;

        const btn = popupForm.querySelector('button[type="submit"]');

        // --- Collect form field values ---
        // Adjust these selectors to match your actual input field names/IDs
        const formData = {
          name:    popupForm.querySelector('[name="name"]')?.value.trim()    || '',
          email:   popupForm.querySelector('[name="email"]')?.value.trim()   || '',
          phone:   popupForm.querySelector('[name="phone"]')?.value.trim()   || '',
          course : popupForm.querySelector('[name="course"]')?.value.trim() || '',
          branch: popupForm.querySelector('[name="branch"]')?.value.trim() || '',
        };

        // --- Loading state ---
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        btn.style.background = '#f59e0b';

        try {
          await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          // --- Success (no-cors won't return a readable response, so reaching here = success) ---
          btn.textContent = '✓ Enquiry Submitted!';
          btn.style.background = '#22c55e';
          btn.disabled = false;
          popupForm.reset();

          setTimeout(() => {
            overlay.classList.add('hidden');
            // Reset button in case popup reopens
            btn.textContent = originalText;
            btn.style.background = '';
          }, 1800);

        } catch (error) {
          // --- Error state ---
          btn.textContent = '✗ Failed. Try Again.';
          btn.style.background = '#ef4444';
          btn.disabled = false;

          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
          }, 2500);
        }
      });
    }
  }
})();

/* ---- Navbar: Hamburger Full Sidebar ---- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const navbar    = document.querySelector('.navbar');

  if (!hamburger || !navLinks) return;

  // Inject a contact/footer strip at the bottom of the sidebar
  const sidebarFooter = document.createElement('div');
  sidebarFooter.className = 'nav-sidebar-footer';
  // sidebarFooter.innerHTML = `
  //   <strong>📍 Janakpuri &amp; Punjabi Bagh</strong>
  //   <span>📞 +91 98765 43210</span>
  //   <span>✉️ admissions@nexusinstitute.in</span>
  //   <span>🕐 Mon–Sat: 9 AM – 7 PM</span>
  // `;
  navLinks.appendChild(sidebarFooter);

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    navbar && navbar.classList.add('nav-expanded');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    navbar && navbar.classList.remove('nav-expanded');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when any nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
  });

  // Close if resized above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820 && navLinks.classList.contains('open')) closeMenu();
  });

  // Active nav link highlight based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
})();

/* ---- Navbar: Scroll Shadow ---- */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 50
      ? '0 4px 30px rgba(0,0,0,0.3)'
      : 'none';
  }
});

/* ---- Countdown Timer ---- */
(function () {
  const timerEl = document.getElementById('countdown');
  if (!timerEl) return;

  let deadline = localStorage.getItem('nexus_deadline');
  if (!deadline || Date.now() > Number(deadline)) {
    deadline = Date.now() + 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem('nexus_deadline', deadline);
  }

  function updateTimer() {
    const diff = Math.max(0, Number(deadline) - Date.now());
    const pad  = n => String(n).padStart(2, '0');

    const d = document.getElementById('t-days');
    const h = document.getElementById('t-hours');
    const m = document.getElementById('t-mins');
    const s = document.getElementById('t-secs');

    if (d) d.textContent = pad(Math.floor(diff / 86400000));
    if (h) h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    if (m) m.textContent = pad(Math.floor((diff % 3600000) / 60000));
    if (s) s.textContent = pad(Math.floor((diff % 60000) / 1000));
  }

  updateTimer();
  setInterval(updateTimer, 1000);
})();

/* ---- Form Validation (shared) ---- */
function validateForm(form) {
  let valid = true;

  form.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.style.borderColor = '';
  });

  form.querySelectorAll('[required]').forEach(field => {
    const val   = field.value.trim();
    const errEl = form.querySelector(`[data-error="${field.name}"]`);

    if (!val) {
      markInvalid(field, errEl, 'This field is required.');
      valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      markInvalid(field, errEl, 'Enter a valid email address.');
      valid = false;
    } else if (field.type === 'tel' && !/^[0-9+\-\s]{7,15}$/.test(val)) {
      markInvalid(field, errEl, 'Enter a valid phone number.');
      valid = false;
    }
  });

  return valid;
}

function markInvalid(field, errEl, msg) {
  field.style.borderColor = '#ff6b6b';
  if (errEl) {
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }
}

/* ---- Contact Form Submission ---- */
(function () {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5JfWheXdIhA13E8_rWLLRuJ_lKUTS_DQLM_xdL2jq84GO48zwrdUiUBQ5gmOUE22X6Q/exec";

  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(contactForm)) return;

    const success      = document.getElementById('contactSuccess');
    const btn          = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Matched exactly to your name attributes: name, phone, email, course, branch
    const formData = {
      name:              contactForm.querySelector('[name="name"]').value.trim(),
      phone:             contactForm.querySelector('[name="phone"]').value.trim(),
      email:             contactForm.querySelector('[name="email"]').value.trim(),
      course: contactForm.querySelector('[name="course"]').value,
      branch:            contactForm.querySelector('[name="branch"]').value,
    
    };

    // Loading state
    btn.textContent      = 'Sending...';
    btn.disabled         = true;
    btn.style.background = '#f59e0b';

    try {
      await fetch(SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });

      // Success
      btn.textContent      = '✓ Message Sent!';
      btn.style.background = '#22c55e';
      if (success) success.style.display = 'block';
      contactForm.reset();

      setTimeout(() => {
        btn.disabled         = false;
        btn.textContent      = originalText;
        btn.style.background = '';
        if (success) success.style.display = 'none';
      }, 2000);

    } catch (error) {

      // Error
      btn.textContent      = '✗ Failed. Try Again.';
      btn.style.background = '#ef4444';
      btn.disabled         = false;

      setTimeout(() => {
        btn.textContent      = originalText;
        btn.style.background = '';
      }, 2500);
    }
  });
})();
/* ---- Smooth Scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Animate elements on scroll (IntersectionObserver) ---- */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.course-card, .blog-card, .value-card, .team-card, .feature-item'
  ).forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();
const searchInput = document.getElementById("courseSearch");
const courses = document.querySelectorAll(".course-card");

searchInput.addEventListener("keyup", function () {
  const value = this.value.toLowerCase();

  courses.forEach(course => {
    const text = course.textContent.toLowerCase();

    if (text.includes(value)) {
      course.style.display = "block";
    } else {
      course.style.display = "none";
    }
  });
});
