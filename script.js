/* ============================================
   Portfolio Website - Main JavaScript
   Vanilla JS, no external libraries
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────
  // 1. Mobile Hamburger Navigation
  // ──────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    // Toggle mobile menu open/close
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a nav link is clicked
    const navLinkItems = navLinks.querySelectorAll('a');
    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ──────────────────────────────────────────
  // 2. Dark / Light Theme Toggle
  // ──────────────────────────────────────────
  const themeToggle = document.querySelector('.theme-toggle');

  /**
   * Apply the given theme and update the toggle button icon.
   * @param {'dark'|'light'} theme
   */
  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }

    // Swap Font Awesome icon inside the toggle button
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        if (theme === 'light') {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        } else {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      }
    }
  };

  // Load saved preference (default to dark)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isCurrentlyLight = document.body.classList.contains('light-theme');
      const newTheme = isCurrentlyLight ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ──────────────────────────────────────────
  // 3. Smooth Scrolling for Anchor Links
  // ──────────────────────────────────────────
  const navbar = document.querySelector('.navbar');

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ──────────────────────────────────────────
  // 4. Active Navigation State via IntersectionObserver
  // ──────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  if (sections.length > 0 && navItems.length > 0) {
    const activateNavLink = (id) => {
      navItems.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    };

    const sectionObserverOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // triggers when section is roughly in the top-middle
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateNavLink(entry.target.id);
        }
      });
    }, sectionObserverOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ──────────────────────────────────────────
  // 5. Scroll Reveal Animations
  // ──────────────────────────────────────────
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  if (scrollRevealElements.length > 0) {
    const revealObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // only reveal once
        }
      });
    }, revealObserverOptions);

    scrollRevealElements.forEach((el) => revealObserver.observe(el));
  }

  // ──────────────────────────────────────────
  // 6. Project Filtering
  // ──────────────────────────────────────────
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active state on buttons
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');

          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hidden');
            // Small fade-in transition
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            // Wait for fade-out transition to finish before hiding
            setTimeout(() => {
              card.classList.add('hidden');
            }, 300);
          }
        });
      });
    });
  }

  // ──────────────────────────────────────────
  // 7. Contact Form Validation
  // ──────────────────────────────────────────
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    /**
     * Show an inline error message below a form field.
     * Creates the error <span> if it doesn't already exist.
     * @param {HTMLElement} field - The input/textarea element.
     * @param {string} message - The error message to display.
     */
    const showError = (field, message) => {
      field.classList.add('error');
      let errorSpan = field.parentElement.querySelector('.error-message');
      if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.classList.add('error-message');
        field.parentElement.appendChild(errorSpan);
      }
      errorSpan.textContent = message;
    };

    /**
     * Clear the error state from a form field.
     * @param {HTMLElement} field - The input/textarea element.
     */
    const clearError = (field) => {
      field.classList.remove('error');
      const errorSpan = field.parentElement.querySelector('.error-message');
      if (errorSpan) {
        errorSpan.textContent = '';
      }
    };

    /**
     * Validate an email address using a standard regex pattern.
     * @param {string} email
     * @returns {boolean}
     */
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameField = contactForm.querySelector('[name="name"]');
      const emailField = contactForm.querySelector('[name="email"]');
      const subjectField = contactForm.querySelector('[name="subject"]');
      const messageField = contactForm.querySelector('[name="message"]');

      let isValid = true;

      // Validate Name
      if (nameField) {
        const nameValue = nameField.value.trim();
        if (!nameValue) {
          showError(nameField, 'Name is required.');
          isValid = false;
        } else if (nameValue.length < 2) {
          showError(nameField, 'Name must be at least 2 characters.');
          isValid = false;
        } else {
          clearError(nameField);
        }
      }

      // Validate Email
      if (emailField) {
        const emailValue = emailField.value.trim();
        if (!emailValue) {
          showError(emailField, 'Email is required.');
          isValid = false;
        } else if (!isValidEmail(emailValue)) {
          showError(emailField, 'Please enter a valid email address.');
          isValid = false;
        } else {
          clearError(emailField);
        }
      }

      // Validate Subject
      if (subjectField) {
        const subjectValue = subjectField.value.trim();
        if (!subjectValue) {
          showError(subjectField, 'Subject is required.');
          isValid = false;
        } else {
          clearError(subjectField);
        }
      }

      // Validate Message
      if (messageField) {
        const messageValue = messageField.value.trim();
        if (!messageValue) {
          showError(messageField, 'Message is required.');
          isValid = false;
        } else if (messageValue.length < 10) {
          showError(messageField, 'Message must be at least 10 characters.');
          isValid = false;
        } else {
          clearError(messageField);
        }
      }

      // If all fields are valid, show success message and reset form
      if (isValid) {
        // Remove any previous success message
        const existingSuccess = contactForm.querySelector('.success-message');
        if (existingSuccess) existingSuccess.remove();

        const successDiv = document.createElement('div');
        successDiv.classList.add('success-message');
        successDiv.textContent = 'Thank you! Your message has been sent successfully.';
        contactForm.appendChild(successDiv);

        contactForm.reset();

        // Auto-remove the success message after 5 seconds
        setTimeout(() => {
          successDiv.remove();
        }, 5000);
      }
    });
  }

  // ──────────────────────────────────────────
  // 8. Back-to-Top Button
  // ──────────────────────────────────────────
  const backToTopBtn = document.querySelector('.back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ──────────────────────────────────────────
  // 9. Navbar Background Change on Scroll
  // ──────────────────────────────────────────
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ──────────────────────────────────────────
  // 10. Typing Effect (optional enhancement)
  // ──────────────────────────────────────────
  const typedTextElement = document.querySelector('.typed-text');

  if (typedTextElement) {
    const roles = ['Software Engineer', 'Backend Developer', 'Full Stack Developer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typingSpeed = 100;   // ms per character when typing
    const deletingSpeed = 50;  // ms per character when deleting
    const pauseAfterType = 1500; // pause after a word is fully typed
    const pauseAfterDelete = 500; // pause after a word is fully deleted

    const type = () => {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        // Typing forward
        typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
          // Finished typing the full word — pause, then start deleting
          isDeleting = true;
          setTimeout(type, pauseAfterType);
          return;
        }

        setTimeout(type, typingSpeed);
      } else {
        // Deleting backward
        typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Finished deleting — move to next role
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(type, pauseAfterDelete);
          return;
        }

        setTimeout(type, deletingSpeed);
      }
    };

    // Kick off the typing animation
    type();
  }

}); // end DOMContentLoaded
