document.addEventListener("DOMContentLoaded", function() {
  console.log("XYZ Recruiter site loaded successfully.");

  // Initialize tooltips
  function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  initTooltips();

  // Smooth scrolling with fixed navbar offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  // Form validation
  document.querySelectorAll('.needs-validation').forEach(form => {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Counter animation with special characters fix
  const counters = document.querySelectorAll('.counter h2');
  const speed = 200;
  if (counters.length > 0) {
    const animateCounters = () => {
      counters.forEach(counter => {
        const originalText = counter.textContent;
        // Skip animation for values like 24/7
        if (originalText.includes('/')) {
          counter.textContent = originalText;
          return;
        }
        const target = parseInt(originalText.replace(/\D/g, ''), 10);
        const current = parseInt(counter.dataset.current || '0', 10);
        const increment = target / speed;
        if (current < target) {
          const newValue = Math.ceil(current + increment);
          counter.dataset.current = newValue;
          if (originalText.includes('%')) {
            counter.textContent = newValue + '%';
          } else if (originalText.includes('+')) {
            counter.textContent = newValue + '+';
          } else {
            counter.textContent = newValue;
          }
          setTimeout(animateCounters, 1);
        } else {
          counter.textContent = originalText;
        }
      });
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => {
      counter.dataset.current = '0';
      observer.observe(counter);
    });
  }

  // Load includes with error handling
  function loadInclude(elementId, url) {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
        return response.text();
      })
      .then(html => {
        document.getElementById(elementId).innerHTML = html;
        initTooltips();
      })
      .catch(error => {
        console.error(error);
        if (elementId === 'navbar-placeholder') {
          document.getElementById(elementId).innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
              <div class="container">
                <a class="navbar-brand" href="index.html">
                  <i class="fas fa-globe-africa me-2"></i>
                  XYZ Recruiter
                </a>
                <div class="collapse navbar-collapse">
                  <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="jobs.html">Jobs</a></li>
                    <li class="nav-item"><a class="nav-link" href="requirements.html">Requirements</a></li>
                    <li class="nav-item"><a class="nav-link" href="status.html">Status</a></li>
                    <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
                  </ul>
                </div>
              </div>
            </nav>
          `;
        } else if (elementId === 'footer-placeholder') {
          document.getElementById(elementId).innerHTML = `
            <footer class="bg-dark text-white pt-5 pb-4">
              <div class="container">
                <div class="row">
                  <div class="col-md-6">
                    <h3 class="text-warning mb-3">XYZ Recruiter</h3>
                    <p>Connecting Kenyan talent with Gulf opportunities</p>
                  </div>
                  <div class="col-md-6 text-end">
                    <a href="tel:+254700123456" class="text-white me-3"><i class="fas fa-phone-alt"></i></a>
                    <a href="#" class="text-white me-3"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="text-white"><i class="fab fa-twitter"></i></a>
                  </div>
                </div>
                <hr class="my-4">
                <p class="mb-0 text-center">&copy; 2025 XYZ Recruiter. All rights reserved.</p>
              </div>
            </footer>
          `;
        }
        // Load Font Awesome if not already loaded
        if (!document.querySelector('#font-awesome-css')) {
          const faCSS = document.createElement('link');
          faCSS.id = 'font-awesome-css';
          faCSS.rel = 'stylesheet';
          faCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
          document.head.appendChild(faCSS);
        }
      });
  }

  // Initialize includes
  loadInclude("navbar-placeholder", "includes/navbar.html");
  loadInclude("footer-placeholder", "includes/footer.html");
});
