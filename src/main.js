document.addEventListener('DOMContentLoaded', () => {

  // --- 1. МОБИЛЬНОЕ МЕНЮ ---
  const burger = document.getElementById('burger');
  const burgerClose = document.getElementById('burger-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');

  const toggleMenu = () => mobileMenu.classList.toggle('active');

  if(burger) burger.addEventListener('click', toggleMenu);
  if(burgerClose) burgerClose.addEventListener('click', toggleMenu);
  if(menuBackdrop) menuBackdrop.addEventListener('click', toggleMenu);

  menuLinks.forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('active'));
  });

  // --- 2. COOKIE POPUP ---
  const cookiePopup = document.getElementById('cookie-popup');
  const acceptBtn = document.getElementById('accept-cookies');

  if (!localStorage.getItem('cookies-accepted')) {
      setTimeout(() => cookiePopup.classList.add('active'), 2000);
  }

  acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'true');
      cookiePopup.classList.remove('active');
  });

  // --- 3. REVEAL ANIMATION (Intersection Observer) ---
  const observerOptions = { threshold: 0.15 };
  const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('active');
          }
      });
  }, observerOptions);

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  // --- 4. HEADER SCROLL EFFECT ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      window.scrollY > 50 ? header.classList.add('header--scrolled') : header.classList.remove('header--scrolled');
  });

  // --- 5. COUNTER ANIMATION ---
  const animateNumbers = (entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseInt(el.getAttribute('data-val'));
              let count = 0;
              const step = target / 100;
              const update = () => {
                  count += step;
                  if (count < target) {
                      el.innerText = (el.innerText.includes('€') ? '€' : '') + Math.ceil(count) + (el.innerText.includes('%') ? '%' : (el.innerText.includes('k') ? 'k' : ''));
                      requestAnimationFrame(update);
                  } else {
                      el.innerText = el.getAttribute('data-val');
                  }
              };
              update();
              observer.unobserve(el);
          }
      });
  };
  const statsObserver = new IntersectionObserver(animateNumbers, { threshold: 0.5 });
  document.querySelectorAll('.stats-box__value').forEach(val => {
      val.setAttribute('data-val', val.innerText);
      val.innerText = '0';
      statsObserver.observe(val);
  });

  // --- 6. CONTACT FORM & CAPTCHA ---
  let captchaResult;
  const generateCaptcha = () => {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      captchaResult = a + b;
      const qEl = document.getElementById('captcha-question');
      if(qEl) qEl.innerText = `${a} + ${b}`;
  };
  generateCaptcha();

  const phoneInput = document.getElementById('phone-input');
  if(phoneInput) phoneInput.addEventListener('input', (e) => e.target.value = e.target.value.replace(/\D/g, ''));

  const contactForm = document.getElementById('contact-form');
  if(contactForm) {
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const ans = document.getElementById('captcha-answer').value;
          if (parseInt(ans) !== captchaResult) {
              alert('Ошибка капчи');
              generateCaptcha();
              return;
          }
          const btn = contactForm.querySelector('button');
          btn.innerText = 'Отправка...';
          setTimeout(() => {
              document.getElementById('form-success').classList.add('active');
              contactForm.reset();
              btn.innerText = 'Отправить запрос';
              generateCaptcha();
          }, 1500);
      });
  }
});

// Глобальная функция закрытия успеха
function closeSuccess() {
  document.getElementById('form-success').classList.remove('active');
}