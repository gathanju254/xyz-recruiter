document.addEventListener("DOMContentLoaded", function() {
  console.log("XYZ Recruiter site loaded successfully.");
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });
  
  // Form validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.prototype.slice.call(forms).forEach(function(form) {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
  
  // Counter animation
  const counters = document.querySelectorAll('.counter h2');
  const speed = 200;
  
  if (counters.length > 0) {
    const animateCounters = () => {
      counters.forEach(counter => {
        const target = parseInt(counter.innerText.replace(/\D/g, ''), 10);
        const count = parseInt(counter.innerText.replace(/\D/g, ''), 10);
        const increment = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + increment) + (counter.innerText.includes('+') ? '+' : '');
          setTimeout(animateCounters, 1);
        } else {
          counter.innerText = target + (counter.innerText.includes('+') ? '+' : '');
        }
      });
    };
    
    // Start animation when counter is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }
});

// Load includes with error handling
function loadInclude(elementId, url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      document.getElementById(elementId).innerHTML = html;
    })
    .catch(error => {
      console.error(error);
      // Fallback content if include fails to load
      if (elementId === 'navbar-placeholder') {
        document.getElementById(elementId).innerHTML = `
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
              <a class="navbar-brand" href="index.html">XYZ Recruiter</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarBasic">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarBasic">
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
          <footer class="bg-dark text-white text-center py-3">
            <div class="container">
              <p class="mb-0">&copy; 2025 XYZ Recruiter. All rights reserved.</p>
            </div>
          </footer>
        `;
      }
    });
}

// Initialize includes when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadInclude("navbar-placeholder", "includes/navbar.html");
  loadInclude("footer-placeholder", "includes/footer.html");
});