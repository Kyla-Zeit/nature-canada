/*
 * Client-side scripts for the Nature Canada redesign.
 *
 * Currently this file implements a simple responsive
 * navigation toggle for small screens and provides
 * placeholders for future interactive functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  // Ensure the nav toggle contains an inner span for the middle bar of the
  // hamburger icon. If the markup doesn’t provide one, inject it so the
  // CSS pseudo‑elements can animate correctly.
  if (navToggle && !navToggle.querySelector('span')) {
    const bar = document.createElement('span');
    navToggle.appendChild(bar);
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      // Toggle visibility of the navigation menu on small screens
      navMenu.classList.toggle('show');
      // Toggle the `.open` class on the button itself so CSS can animate
      // the hamburger icon into a close icon and back again.
      navToggle.classList.toggle('open');
    });
  }

  /*
   * Scroll reveal animations
   *
   * Elements with the `.reveal` class will fade in and slide up
   * when they enter the viewport. IntersectionObserver ensures
   * that each element animates only once for a smooth, performant
   * experience. This subtle motion adds an interactive feel to
   * the page without overwhelming users.
   */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerInstance.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /*
   * Interactive tilt effect
   *
   * To add a touch of modern interactivity reminiscent of premium sites, each
   * card and news article tilts slightly toward the cursor. This effect is
   * implemented using mousemove and mouseleave events. It calculates the
   * cursor's position relative to the centre of the element and applies a
   * corresponding rotation using CSS transforms. The perspective is set
   * within the CSS (see style.css). The transform resets on mouse leave
   * for a smooth return to the resting state. This feature is purely
   * cosmetic and does not interfere with keyboard navigation or screen
   * reader users.
   */
  const interactiveElements = document.querySelectorAll('.card, .news-item');
  interactiveElements.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      // Calculate the relative offset from the centre of the element
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 8; // adjust sensitivity
      const tiltY = (x / rect.width) * -8;
      el.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // No hero slider. The hero section remains static on this version.

  /*
   * Transparent navigation on scroll
   *
   * When the page is near the top (within 50 pixels), the header becomes
   * transparent so the hero image shows through. As soon as the user
   * scrolls past this threshold, the header returns to its default
   * background colour. This effect is implemented by toggling the
   * `.transparent` class on the header element.
   */
  const header = document.querySelector('header');
  function updateHeaderTransparency() {
    // Apply the 'transparent' class only after scrolling down a bit. This
    // keeps the header solid at the top and reveals the content behind
    // the bar once you scroll away from the hero.
    if (window.scrollY > 50) {
      header.classList.add('transparent');
    } else {
      header.classList.remove('transparent');
    }
  }
  if (header) {
    window.addEventListener('scroll', updateHeaderTransparency);
    // Initialise on page load
    updateHeaderTransparency();
  }
});


/* === Under-heading subnav (added) === */
(function(){
  const header  = document.querySelector('header');
  if(!header) return;
  const subnav  = document.createElement('div');
  subnav.className = 'subnav';
  subnav.id = 'subnav';
  subnav.setAttribute('aria-live','polite');
  subnav.innerHTML = `
    <div class="subnav-inner">
      <span class="arrow" aria-hidden="true"></span>
      <div class="panel" data-panel="about" aria-hidden="true">
        <a href="history.html">History</a>
        <a href="https://naturecanada.ca/about/people/" target="_blank" rel="noopener">People</a>
        <a href="https://naturecanada.ca/about/legacy-giving/" target="_blank" rel="noopener">Legacy Giving</a>
        <a href="https://naturecanada.ca/about/careers/" target="_blank" rel="noopener">Careers</a>
        <a href="https://naturecanada.ca/about/awards-scholarships/" target="_blank" rel="noopener">Awards & Scholarships</a>
        <a href="contact.html">Contact</a>
      </div>
      <div class="panel" data-panel="discover" aria-hidden="true">
        <a href="endangered-species.html">Endangered Species</a>
        <a href="#">Birds</a>
        <a href="#">Land Wildlife</a>
        <a href="#">Aquatic Wildlife</a>
        <a href="#">Environments</a>
        <a href="#">Lifestyle</a>
      </div>
      <div class="panel" data-panel="enjoy" aria-hidden="true">
        <a href="#">Activities</a>
        <a href="#">Events</a>
        <a href="#">Resources</a>
      </div>
      <div class="panel" data-panel="defend" aria-hidden="true">
        <a href="all-campaigns.html">Campaigns</a>
        <a href="#">Policy</a>
        <a href="donate.html">Take Action</a>
      </div>
    </div>`;
  header.appendChild(subnav);

  // Set triggers on top-level items that declare data-panel
  const topItems = header.querySelectorAll('nav li[data-panel] > a');
  const inner   = subnav.querySelector('.subnav-inner');
  const panels  = inner.querySelectorAll('.panel');

  function show(panelId, trigger){
    panels.forEach(p => p.setAttribute('aria-hidden', p.dataset.panel !== panelId ? 'true' : 'false'));
    const trigRect = trigger.getBoundingClientRect();
    const headRect = header.getBoundingClientRect();
    const arrowLeft = trigRect.left - headRect.left + (trigRect.width/2) - 9;
    subnav.style.setProperty('--arrow-left', `${arrowLeft}px`);
    subnav.classList.add('show');
  }
  function hide(){
    subnav.classList.remove('show');
    panels.forEach(p=>p.setAttribute('aria-hidden','true'));
  }

  topItems.forEach(a => {
    const panel = a.parentElement.getAttribute('data-panel');
    a.addEventListener('mouseenter', ()=>show(panel, a));
    a.addEventListener('focus',      ()=>show(panel, a));
    a.addEventListener('click',      ()=>hide()); // let click navigate
  });
  header.addEventListener('mouseleave', hide);
  header.addEventListener('focusout', (e)=>{ if(!header.contains(e.relatedTarget)) hide(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') hide(); });
})();


// Auto‑detect current page and highlight nav link
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[href], .subnav a[href]').forEach(a => {
    const linkPath = a.getAttribute('href').split('/').pop();
    if (linkPath === current) {
      a.classList.add('current-page');
    }
  });
});
