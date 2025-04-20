// Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.querySelector('.theme-switch');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const navLinks = document.querySelector('.nav-links');

    // Function to set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            themeSwitch.title = 'Switch to light mode';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            themeSwitch.title = 'Switch to dark mode';
        }

        document.documentElement.classList.add('theme-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    }

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    setTheme(savedTheme);

    // Theme switch event listener
    themeSwitch.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Add theme transition styles
    const themeStyle = document.createElement('style');
    themeStyle.textContent = `
        .theme-transition,
        .theme-transition *,
        .theme-transition *:before,
        .theme-transition *:after {
            transition: all 0.3s ease-in-out !important;
            transition-delay: 0 !important;
        }
    `;
    document.head.appendChild(themeStyle);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade animations styles
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        .fade-out {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
            .fade-out {
                transition: none;
            }
        }
    `;
    document.head.appendChild(fadeStyle);

    // Scroll to top functionality
    const scrollToTop = document.querySelector('.scroll-to-top');
    if (scrollToTop) {
        window.addEventListener('scroll', () => {
            scrollToTop.classList.toggle('visible', window.pageYOffset > 300);
        });

        scrollToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Active navigation state
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`a[href="#${sectionId}"]`);

            if (navLink) {
                navLink.classList.toggle('active', 
                    scrollY > sectionTop && scrollY <= sectionTop + sectionHeight
                );
            }
        });
    });

    // Responsive navigation
    window.addEventListener('resize', () => {
        navLinks.style.display = window.innerWidth > 768 ? 'flex' : 'none';
    });

    // Loading animation for download buttons
    document.querySelectorAll('.download-card .btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('loading');
            setTimeout(() => this.classList.remove('loading'), 2000);
        });
    });

    // Initialize animations
    document.querySelectorAll('.feature-card, .service-card, .download-card, section').forEach(el => {
        el.classList.add('fade-out');
        observer.observe(el);
    });
});
