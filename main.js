/**
 * Public site logic for AskJuthis Mortgages
 * Portfolio brochure pages only. Portal is at /portal/
 */

// Global Analytics Utility
window.trackEvent = function(category, action, label = '') {
    console.log('📊 [Analytics] ' + category + ' > ' + action + (label ? ' (' + label + ')' : ''));
}

// Global Smooth Scroll Engine
let lenis;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Setup Navigation & Top Bar
    renderNavigation();
    const topBarContainer = document.getElementById('top-bar-container');
    if (topBarContainer) {
        topBarContainer.innerHTML = renderTopBar();
    }

    // 2. Build all sections
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = [
        renderHero(),
        renderMarquee(),
        '<div class="animated-bg-wrapper">',
        renderServices(),
        renderAbout(),
        renderCredentials(),
        renderProcess(),
        renderBooking(),
        renderTestimonials(),
        renderContact(),
        renderFooter(),
        '</div>'
    ].join('');

    // 3. Initialize interactions
    initLenis();
    initSmoothScroll();
    initTestimonialSlider();
    initScrollReveal();
    initMagneticButtons();
    initStatCounters();
    initLiveCounter();

    // 4. Initialize Calendly
    let calendlyRetries = 0;
    function initCalendly() {
        const calendlyEl = document.querySelector('.calendly-inline-widget');
        if (calendlyEl && typeof Calendly !== 'undefined') {
            Calendly.initInlineWidget({ url: calendlyEl.getAttribute('data-url'), parentElement: calendlyEl });
        } else if (calendlyRetries < 20) { calendlyRetries++; setTimeout(initCalendly, 500); }
    }
    initCalendly();
});

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;
    const intervalTime = 5000;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            dots[i].classList.toggle('bg-secondary-fixed', i === index);
            dots[i].classList.toggle('bg-white/20', i !== index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) {
        let slideInterval = setInterval(nextSlide, intervalTime);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                currentSlide = index;
                showSlide(currentSlide);
                slideInterval = setInterval(nextSlide, intervalTime);
            });
        });

        showSlide(0);
    }
}

function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Calculate cursor position relative to the center of the button
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            
            // Move the button slightly towards the cursor. 
            // The 0.3 factor controls the magnetic strength.
            btn.style.setProperty('--tw-translate-x', `${x * 0.3}px`);
            btn.style.setProperty('--tw-translate-y', `${y * 0.3}px`);
        });

        btn.addEventListener('mouseleave', () => {
            // Reset to center smoothly
            btn.style.setProperty('--tw-translate-x', '0px');
            btn.style.setProperty('--tw-translate-y', '0px');
        });
    });
}

function initLenis() {
    if (typeof window.Lenis !== 'undefined') {
        lenis = new window.Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // 3D Parallax target elements 
        const glassCards = document.querySelectorAll('.glass-card');
        
        function raf(time) {
            lenis.raf(time);
            
            // Subtly float the glass cards along the Y axis based on scroll depth
            if (glassCards.length) {
                const scrollY = window.scrollY;
                glassCards.forEach((card, i) => {
                    // Staggering the depth using the index
                    const speed = 0.04 * (1 + (i % 3) * 0.4); 
                    // Tailwind uses --tw-translate-y for its transform classes
                    card.style.setProperty('--tw-translate-y', `-${scrollY * speed}px`);
                });
            }

            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }
}

function initStatCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const rawVal = el.getAttribute('data-value');
                const match = rawVal.match(/^([^0-9]*)([0-9,.]+)([^0-9]*)$/);
                
                if (match) {
                    const prefix = match[1];
                    let numStr = match[2].replace(/,/g, '');
                    const isFloat = numStr.includes('.');
                    const target = parseFloat(numStr);
                    const suffix = match[3];
                    
                    let start = 0;
                    const duration = 2500;
                    const startTime = performance.now();
                    
                    function update(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        const currentVal = start + (target - start) * easeProgress;
                        
                        if (isFloat) {
                            el.textContent = prefix + currentVal.toFixed(1) + suffix;
                        } else {
                            el.textContent = prefix + Math.floor(currentVal) + suffix;
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            el.textContent = rawVal;
                        }
                    }
                    requestAnimationFrame(update);
                }
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => {
        if (c.getAttribute('data-value') && c.getAttribute('data-value').match(/[0-9]/)) {
            c.textContent = "0"; 
        }
        observer.observe(c);
    });
}

function renderNavigation() {
    const logoContainer = document.getElementById('brand-logo-container');
    const linksContainer = document.getElementById('nav-links-container');
    const ctaContainer = document.getElementById('nav-cta-container');

    logoContainer.innerHTML = `<a href="index.html">Ask<span class="text-secondary-fixed">Juthis</span></a>`;

    linksContainer.innerHTML = `
        <a class="text-sm font-medium hover:text-secondary-fixed transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#services">Services</a>
        <a class="text-sm font-medium hover:text-secondary-fixed transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#why-choose">Why Us</a>
        <a class="text-sm font-medium hover:text-secondary-fixed transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#booking">Book Consultation</a>
        <a class="text-sm font-medium hover:text-secondary-fixed transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="calculators.html">Calculators</a>
    `;

    if (ctaContainer) {
        ctaContainer.innerHTML = `
            <a class="text-sm font-semibold text-secondary-fixed hover:text-white transition-colors px-4 py-2 border border-secondary-fixed/30 rounded-full" href="/portal/">Borrower Portal</a>
            <a class="bg-primary-container text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary-fixed hover:text-primary transition-all shadow-md transform magnetic-btn" href="#contact">Get a Free Quote</a>
        `;
    }

    // Populate Mobile Menu
    const mobileLinksContainer = document.getElementById('mobile-links-container');
    if (mobileLinksContainer) {
        mobileLinksContainer.innerHTML = `
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="#services" onclick="toggleMobileMenu()">Services</a>
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="#why-choose" onclick="toggleMobileMenu()">Why Us</a>
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="#booking" onclick="toggleMobileMenu()">Book Consultation</a>
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="calculators.html" onclick="toggleMobileMenu()">Calculators</a>
            <a class="text-lg font-semibold text-secondary-fixed border-b border-white/10 pb-2" href="/portal/" onclick="toggleMobileMenu()">Borrower Portal</a>
            <a class="bg-primary text-white px-6 py-4 rounded-xl text-center font-bold text-lg hover:bg-white hover:text-primary transition-all shadow-lg mt-4" href="#contact" onclick="toggleMobileMenu()">Get a Free Quote</a>
        `;
    }
}

function renderDivider(type, colorClass, isTop = false, hasGoldStroke = false) {
    const positionClass = isTop ? 'section-divider-top' : 'section-divider-bottom';
    let path = '';
    let strokePath = '';
    
    // Professional, static geometric paths
    if (type === 'curve') {
        path = `<path d="M0,64 C480,128 960,0 1440,64 L1440,128 L0,128 Z" class="${colorClass}"></path>`;
        if (hasGoldStroke) strokePath = `<path d="M0,64 C480,128 960,0 1440,64" stroke="#d3bd73" stroke-width="2" fill="none" opacity="0.5"/>`;
    } else if (type === 'slant') {
        path = `<path d="M0,0 L1440,96 L1440,128 L0,128 Z" class="${colorClass}"></path>`;
        if (hasGoldStroke) strokePath = `<path d="M0,0 L1440,96" stroke="#d3bd73" stroke-width="2" fill="none" opacity="0.5"/>`;
    } else if (type === 'step') {
        path = `<path d="M0,64 L720,64 L720,0 L1440,0 L1440,128 L0,128 Z" class="${colorClass}"></path>`;
        if (hasGoldStroke) strokePath = `<path d="M0,64 L720,64 L720,0 L1440,0" stroke="#d3bd73" stroke-width="2" fill="none" opacity="0.5"/>`;
    }

    return `
        <div class="section-divider ${positionClass}">
            <svg viewBox="0 0 1440 128" preserveAspectRatio="none">
                ${path}
                ${strokePath}
            </svg>
        </div>
    `;
}

function renderMarquee() {
    const logos = [
        "TD Bank", "Scotiabank", "RBC", "BMO", "CIBC", "First National", "MCAP", "Merix", "Equitable Bank", "Home Trust",
        "TD Bank", "Scotiabank", "RBC", "BMO", "CIBC", "First National", "MCAP", "Merix", "Equitable Bank", "Home Trust"
    ];
    
    return `
        <div class="w-full bg-primary py-8 border-b border-white/5 overflow-hidden relative z-10 flex items-center">
            <div class="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-primary to-transparent z-20"></div>
            <div class="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-primary to-transparent z-20"></div>
            
            <div class="flex whitespace-nowrap animate-marquee items-center opacity-40 hover:opacity-100 transition-opacity duration-700">
                ${logos.map(logo => `<span class="mx-8 sm:mx-16 text-xl sm:text-2xl font-black text-white tracking-[0.2em] uppercase">${logo}</span>`).join('')}
                ${logos.map(logo => `<span class="mx-8 sm:mx-16 text-xl sm:text-2xl font-black text-white tracking-[0.2em] uppercase">${logo}</span>`).join('')}
            </div>
        </div>
    `;
}

function renderHero() {
    return `
        <header class="relative min-h-screen flex items-start lg:items-center pt-12 sm:pt-44 pb-12 sm:pb-24 bg-primary">
            <!-- Background Image with Overlay -->
            <div class="absolute inset-0 z-0 overflow-hidden">
                <img src="assets/modern.webp" alt="Home background" class="w-full h-full object-cover opacity-60 hero-bg-alive">
                <div class="absolute inset-0 bg-primary/60"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-primary via-transparent to-primary"></div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-16 sm:pt-0">
                <div class="grid grid-cols-1 xl:grid-cols-12 gap-16 items-center">
                    <!-- Left: Content -->
                    <div class="xl:col-span-7 text-center xl:text-left reveal reveal-left">
                        <!-- Mobile-only Circular Headshot -->
                        <div class="flex justify-center xl:justify-start mb-8 sm:mb-10 xl:hidden">
                            <div class="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full border-4 border-secondary-fixed shadow-[0_20px_50px_-10px_rgba(211,189,115,0.4)] overflow-hidden bg-primary ring-4 ring-white/10">
                                <img src="${agentConfig.agent.photoUrl}" alt="${agentConfig.agent.name}" class="w-full h-full object-cover object-top">
                            </div>
                        </div>
                        <div class="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed/10 border border-secondary-fixed/20 mb-8 reveal reveal-up">
                            <span class="text-secondary-fixed text-xs font-black uppercase tracking-[0.3em] leading-none">Expert Mortgage Guidance</span>
                        </div>
                        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tight font-extrabold text-white reveal reveal-up mb-10">
                            <span class="block">Your Path to</span>
                            <span class="text-hero-accent">Homeownership</span>
                            <span class="block mt-2">Starts Here<span class="text-secondary-fixed">.</span></span>
                        </h1>
                        <p class="mt-4 sm:mt-8 text-base sm:text-lg md:text-xl lg:text-3xl text-white/90 max-w-3xl mx-auto xl:mx-0 font-medium leading-relaxed mb-8 sm:mb-16 reveal reveal-up" style="transition-delay: 200ms;">
                            ${agentConfig.agent.fullBio}
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center xl:justify-start items-center">
                            <a class="w-full sm:w-auto flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 border border-transparent text-base sm:text-xl font-bold rounded-xl text-primary bg-secondary-fixed hover:bg-white transform hover:scale-105 transition-all shadow-[0_20px_50px_-10px_rgba(211,189,115,0.4)] magnetic-btn" href="#booking">
                                Book a Consultation
                            </a>
                            <a class="w-full sm:w-auto flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 border-2 border-white/30  text-base sm:text-xl font-bold rounded-xl text-white bg-white/10 hover:bg-white hover:text-primary transform hover:scale-105 transition-all magnetic-btn" href="#services">
                                Our Services
                            </a>
                        </div>
                    </div>

                    <!-- Right: Profile Card (Desktop Only) -->
                    <div class="hidden xl:flex xl:col-span-5 justify-center xl:justify-end reveal reveal-right" style="transition-delay: 200ms;">
                        <div class="w-[340px] glass-card p-3 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/20  bg-white/5">
                            <div class="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden">
                                <img src="${agentConfig.agent.photoUrl}" alt="${agentConfig.agent.name}" class="w-full h-full object-cover object-top">
                                <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>
                                <div class="absolute bottom-8 left-0 right-0 text-center px-6">
                                    <p class="text-secondary-fixed text-xs font-bold uppercase tracking-[0.3em] mb-2">Expert Guidance</p>
                                    <p class="text-white text-3xl font-black tracking-tight">${agentConfig.agent.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${renderDivider('curve', 'fill-primary', false, true)}
        </header>
    `;
}

function renderAbout() {
    const { about } = agentConfig;
    return `
        <section class="py-16 sm:py-32 text-white overflow-hidden relative bg-primary" id="about">

            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-20 items-center">
                    <!-- Left Column - Stats & Info -->
                    <div class="order-2 lg:order-1 lg:col-span-1 reveal reveal-right">
                        <div class="glass-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/10 shadow-2xl bg-primary/60 ">
                            <div class="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed/10 border border-secondary-fixed/20 mb-6">
                                <span class="text-secondary-fixed text-xs font-bold uppercase tracking-[0.3em] leading-none">Our Mission</span>
                            </div>
                            <h2 class="text-3xl sm:text-5xl font-black mb-6 sm:mb-8 text-secondary-fixed tracking-tight leading-tight">${about.title}</h2>
                            <div class="space-y-4 sm:space-y-6 text-white/60 mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed">
                                <p>${about.description1}</p>
                                <p>${about.description2}</p>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-x-8 gap-y-10">
                                ${about.stats.map(stat => `
                                    <div class="flex flex-col items-center lg:items-start group/stat">
                                        <div class="text-secondary-fixed mb-3 transform transition-transform group-hover/stat:scale-110">
                                            <span class="material-symbols-outlined text-3xl">${stat.icon}</span>
                                        </div>
                                        <div class="text-3xl font-black text-white tracking-tight stat-counter" data-value="${stat.value}">${stat.value}</div>
                                        <div class="text-xs text-white/60 font-bold uppercase tracking-[0.2em]">${stat.label}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Middle Column - Broker Photo -->
                    <div class="order-1 lg:order-2 flex justify-center reveal reveal-up">
                        <div class="relative group">
                            <div class="absolute -inset-10 bg-secondary-fixed/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div class="relative w-64 h-[24rem] sm:w-80 sm:h-[32rem] lg:w-[26rem] lg:h-[36rem] overflow-hidden rounded-[3rem] sm:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(15,30,46,0.4)] border-[8px] sm:border-[12px] border-white  bg-white/40">
                                <img src="${agentConfig.agent.photoUrl}" alt="${agentConfig.agent.name}" class="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105">
                                <div class="absolute bottom-8 left-0 right-0 text-center">
                                    <div class="inline-block bg-primary/90  px-6 py-2 rounded-full border border-white/20 shadow-xl">
                                        <span class="text-white text-xs font-bold uppercase tracking-[0.2em]">Dedicated to You</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Bio -->
                    <div class="order-3 lg:col-span-1 reveal reveal-left">
                        <div class="glass-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/10 bg-primary/60  shadow-2xl">
                            <h2 class="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 text-secondary-fixed tracking-tight leading-tight">${about.meetBroker.title}</h2>
                            <div class="relative mb-10">
                                <span class="material-symbols-outlined absolute -left-8 -top-8 text-6xl text-secondary-fixed/10">format_quote</span>
                                <p class="text-xl italic font-semibold text-white/90 leading-relaxed">
                                    ${about.meetBroker.quote}
                                </p>
                            </div>
                            <p class="text-white/60 leading-relaxed mb-10 text-lg">
                                ${about.meetBroker.description}
                            </p>
                            <a href="${about.meetBroker.linkUrl}" class="inline-flex items-center px-8 py-4 rounded-full bg-secondary-fixed text-primary font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 group">
                                ${about.meetBroker.linkText}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            ${renderDivider('curve', 'fill-primary')}
        </section>
    `;
}

function renderCredentials() {
    return `
        <section class="py-16 sm:py-24 bg-primary relative overflow-hidden" id="credentials">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-center mb-16 reveal reveal-up">
                    <div class="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed/10 border border-secondary-fixed/20 mb-6">
                        <span class="text-secondary-fixed text-xs font-bold uppercase tracking-[0.3em] leading-none">${agentConfig.credentials.subtitle}</span>
                    </div>
                    <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">${agentConfig.credentials.title}</h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${agentConfig.credentials.items.map((cred, index) => {
                        return `
                            <div class="glass-card p-8 rounded-[1.5rem] border-white/5 hover:border-secondary-fixed/30 hover:bg-secondary-fixed/5 transition-all duration-500 reveal reveal-up group" style="transition-delay: ${index * 100}ms;">
                                <div class="w-12 h-12 rounded-xl bg-secondary-fixed/10 flex items-center justify-center text-secondary-fixed mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <span class="material-symbols-outlined text-2xl">${cred.icon}</span>
                                </div>
                                <h3 class="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-secondary-fixed transition-colors">${cred.title}</h3>
                                <p class="text-white/60 text-sm leading-relaxed">${cred.description}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderProcess() {
    return `
        <section class="py-20 sm:py-32 bg-primary relative overflow-hidden" id="process">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-center mb-20 reveal reveal-up">
                    <div class="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed/10 border border-secondary-fixed/20 mb-6">
                        <span class="text-secondary-fixed text-xs font-bold uppercase tracking-[0.3em] leading-none">The Roadmap</span>
                    </div>
                    <h2 class="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">Your Path to<br><span class="text-hero-accent">Homeownership</span></h2>
                </div>
                
                <div class="relative">
                    <!-- Vertical Main Line -->
                    <div class="absolute left-8 sm:left-1/2 top-8 bottom-0 w-[2px] bg-gradient-to-b from-secondary-fixed via-secondary-fixed/20 to-transparent transform sm:-translate-x-1/2 rounded-full hidden sm:block"></div>
                    
                    <div class="space-y-12 sm:space-y-24">
                        ${agentConfig.processSteps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return `
                                <div class="relative flex flex-col sm:flex-row items-center reveal ${isEven ? 'reveal-right' : 'reveal-left'}">
                                    <!-- Center Node -->
                                    <div class="hidden sm:flex absolute left-1/2 w-14 h-14 rounded-full bg-primary border-4 border-secondary-fixed shadow-[0_0_30px_rgba(211,189,115,0.4)] items-center justify-center transform -translate-x-1/2 z-10">
                                        <span class="text-secondary-fixed font-black text-lg">${index + 1}</span>
                                    </div>
                                    
                                    <!-- Card Content -->
                                    <div class="w-full sm:w-1/2 ${isEven ? 'sm:pr-16 text-left sm:text-right' : 'sm:pl-16 sm:ml-auto text-left'}">
                                        <div class="glass-card p-8 sm:p-10 rounded-[2rem] border-white/10 hover:border-secondary-fixed/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
                                            
                                            <!-- Subtle Hover Glow -->
                                            <div class="absolute -inset-20 bg-secondary-fixed/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                            
                                            <div class="flex items-center gap-5 mb-5 ${isEven ? 'sm:flex-row-reverse' : ''}">
                                                <div class="w-14 h-14 flex-shrink-0 rounded-2xl bg-primary/80 border border-secondary-fixed/20 flex items-center justify-center text-secondary-fixed shadow-inner">
                                                    <span class="material-symbols-outlined text-2xl">${step.icon}</span>
                                                </div>
                                                <div>
                                                    <span class="text-secondary-fixed text-xs font-bold uppercase tracking-widest block mb-1 sm:hidden">Phase ${index + 1}</span>
                                                    <h3 class="text-2xl font-bold text-white group-hover:text-secondary-fixed transition-colors">${step.title}</h3>
                                                </div>
                                            </div>
                                            <p class="text-white/60 text-lg leading-relaxed relative z-10">${step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            ${renderDivider('slant', 'fill-primary', false, true)}
        </section>
    `;
}

function renderServices() {
    return `
        <section class="py-16 sm:py-32 relative overflow-hidden bg-primary" id="services">

            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-center mb-24 reveal reveal-up">
                    <div class="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed/10 border border-secondary-fixed/20 mb-6">
                        <span class="text-secondary-fixed text-xs font-bold uppercase tracking-[0.3em] leading-none">Our Expertise</span>
                    </div>
                    <h2 class="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">Comprehensive<br><span class="text-hero-accent">Financing Solutions</span></h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    ${agentConfig.services.map((service, index) => `
                        <div class="group p-8 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] glass-card border-white/10 hover:border-secondary-fixed/30 transition-all duration-700 reveal ${index % 2 === 0 ? 'reveal-right' : 'reveal-left'}">
                            <div class="flex flex-col items-start gap-6 sm:gap-8">
                                <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/80 border border-secondary-fixed/30 flex items-center justify-center text-secondary-fixed shadow-lg transform group-hover:scale-110 transition-transform duration-700">
                                    <span class="material-symbols-outlined text-2xl sm:text-3xl">${service.icon}</span>
                                </div>
                                <div class="flex-grow">
                                    <h3 class="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 group-hover:text-secondary-fixed transition-colors">${service.title}</h3>
                                    <p class="text-white/60 text-lg leading-relaxed mb-8">${service.description}</p>
                                    
                                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                        ${service.details ? service.details.map(detail => `
                                            <li class="flex items-center text-sm font-medium text-white/80">
                                                <div class="w-2 h-2 rounded-full bg-secondary-fixed mr-3 shadow-[0_0_10px_rgba(211,189,115,0.8)]"></div>
                                                ${detail}
                                            </li>
                                        `).join('') : ''}
                                    </ul>
                                    
                                    <a class="inline-flex items-center text-sm font-black text-secondary-fixed uppercase tracking-widest hover:text-white transition-all group/btn" href="#contact">
                                        Explore Scope 
                                        <div class="ml-3 w-8 h-[2px] bg-secondary-fixed transform group-hover/btn:w-12 transition-all"></div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${renderDivider('curve', 'fill-primary', false, true)}
        </section>
    `;
}



function renderBooking() {
    return `
        <section class="py-32 bg-primary relative overflow-hidden" id="booking">

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="lg:flex lg:items-center lg:justify-between gap-12">
                    <div class="lg:w-1/2 mb-16 lg:mb-0 reveal reveal-right flex flex-col h-full">
                        <div class="group p-10 md:p-14 rounded-[3rem] bg-secondary-fixed/85  border-secondary-fixed/20 hover:border-primary/30 shadow-[0_40px_80px_-15px_rgba(211,189,115,0.3)] transition-all duration-700 h-full flex flex-col">
                            <div>
                                <div class="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                                    <span class="text-primary text-xs font-black uppercase tracking-[0.3em] leading-none">Consultation</span>
                                </div>
                                <h3 class="text-5xl md:text-6xl font-black text-primary mb-8 tracking-tight leading-tight group-hover:opacity-80 transition-opacity">Expert Guidance<br><span class="text-hero-accent !text-primary">One Click Away</span></h3>
                                <p class="text-xl text-primary/70 mb-12 leading-relaxed font-medium">
                                    Pick a time that works for you. Our expert consultants are ready to walk you through your options, answer your questions, and help you build a clear path to homeownership. 
                                </p>
                            </div>
                            <div class="space-y-10">
                                <div class="flex items-center group/item reveal reveal-up">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary shadow-[0_20px_40px_-10px_rgba(15,30,46,0.2)] transform group-hover/item:rotate-[10deg] transition-transform duration-700 relative">
                                        <div class="absolute inset-0 rounded-full bg-primary animate-pulse opacity-10"></div>
                                        <span class="material-symbols-outlined text-4xl text-secondary-fixed relative z-10">event_available</span>
                                    </div>
                                    <div class="ml-8">
                                        <span class="text-lg font-black text-primary uppercase tracking-wider">Free 15-minute Discovery Call</span>
                                    </div>
                                </div>
                                <div class="flex items-center group/item reveal reveal-up" style="transition-delay: 100ms;">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary shadow-[0_20px_40px_-10px_rgba(15,30,46,0.2)] transform group-hover/item:rotate-[10deg] transition-transform duration-700 relative">
                                        <div class="absolute inset-0 rounded-full bg-primary animate-pulse opacity-10"></div>
                                        <span class="material-symbols-outlined text-4xl text-secondary-fixed relative z-10">verified_user</span>
                                    </div>
                                    <div class="ml-8">
                                        <span class="text-lg font-black text-primary uppercase tracking-wider">No obligation, just expert advice</span>
                                    </div>
                                </div>
                                <div class="flex items-center group/item reveal reveal-up" style="transition-delay: 200ms;">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary shadow-[0_20px_40px_-10px_rgba(15,30,46,0.2)] transform group-hover/item:rotate-[10deg] transition-transform duration-700 relative">
                                        <div class="absolute inset-0 rounded-full bg-primary animate-pulse opacity-10"></div>
                                        <span class="material-symbols-outlined text-4xl text-secondary-fixed relative z-10">chat</span>
                                    </div>
                                    <div class="ml-8">
                                        <span class="text-lg font-black text-primary uppercase tracking-wider">Get your questions answered live</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lg:w-1/2 reveal reveal-left">
                        <div class="group p-6 rounded-[3rem] bg-secondary-fixed/85  border-secondary-fixed/20 hover:border-primary/30 transition-all duration-700 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] min-h-[600px] relative overflow-hidden">
                           
                            <div class="calendly-inline-widget relative z-10" data-url="${agentConfig.contact.bookingWidgetUrl}?hide_landing_page_details=1&hide_gdpr_banner=1" style="min-width:320px;height:600px;"></div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderTestimonials() {
    return `
        <section class="py-24 overflow-hidden bg-primary relative" id="testimonials">

            ${renderDivider('curve', 'fill-primary')}
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="relative testimonial-container">
                    <div class="text-center max-w-3xl mx-auto">
                        <span class="material-symbols-outlined text-6xl text-secondary-fixed opacity-50 mx-auto mb-6">format_quote</span>
                        <div class="relative h-64 md:h-48">
                            ${agentConfig.agent.testimonials.map((t, i) => `
                                <div class="testimonial-slide absolute inset-0 transition-all duration-700 opacity-0 transform translate-x-8 ${i === 0 ? 'active' : ''}">
                                    <p class="text-2xl italic font-black mb-8 text-secondary-fixed tracking-tight leading-relaxed">
                                        "${t.quote}"
                                    </p>
                                    <div class="flex items-center justify-center">
                                        <div class="ml-4 text-center">
                                            <div class="text-base font-black text-white tracking-tight uppercase tracking-[0.1em]">${t.author}</div>
                                            <div class="text-sm text-secondary-fixed/60 font-bold uppercase tracking-[0.2em]">${t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="flex justify-center mt-12 gap-2">
                        ${agentConfig.agent.testimonials.map((_, i) => `
                            <button class="testimonial-dot w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? 'bg-secondary-fixed' : 'bg-white/20'}" data-index="${i}"></button>
                        `).join('')}
                    </div>
                </div>
            </div>
            ${renderDivider('slant', 'fill-primary')}
        </section>
    `;
}

function renderContact() {
    return `
        <section class="py-32 bg-primary relative overflow-hidden" id="contact">

            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-center mb-24 reveal reveal-up">
                    <div class="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed/10 border border-secondary-fixed/20 mb-6">
                        <span class="text-secondary-fixed text-xs font-bold uppercase tracking-[0.3em] leading-none">Get Started</span>
                    </div>
                    <h2 class="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">Secure Your<br><span class="text-hero-accent">Free Quote Today</span></h2>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- Contact Info Card -->
                    <div class="group p-10 md:p-14 rounded-[3rem] glass-card border-white/10 hover:border-secondary-fixed/30 transition-all duration-700 reveal reveal-right flex flex-col justify-between">
                        <div>
                            <h3 class="text-4xl font-black text-white mb-6 tracking-tight leading-tight group-hover:text-secondary-fixed transition-colors">Direct Access to<br><span class="text-secondary-fixed">Expert Advice</span></h3>
                            <p class="text-white/60 text-xl leading-relaxed mb-12">
                                Skip the robots. Reach out directly for a personalized consultation tailored to your unique financial goals.
                            </p>
                            
                            <div class="space-y-10">
                                <div class="flex items-center group/item transform hover:translate-x-3 transition-transform duration-500">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-secondary-fixed to-secondary-fixed/50 flex items-center justify-center text-primary shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transform group-hover/item:rotate-[10deg] transition-transform duration-700">
                                        <span class="material-symbols-outlined text-4xl">phone_iphone</span>
                                    </div>
                                    <div class="ml-8">
                                        <p class="text-secondary-fixed/60 text-sm font-black uppercase tracking-[0.2em] mb-1">Call Anytime</p>
                                        <p class="text-2xl font-black text-white tracking-tight">${agentConfig.contact.phone}</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center group/item transform hover:translate-x-3 transition-transform duration-500">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-secondary-fixed to-secondary-fixed/50 flex items-center justify-center text-primary shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transform group-hover/item:rotate-[10deg] transition-transform duration-700">
                                        <span class="material-symbols-outlined text-4xl">mail</span>
                                    </div>
                                    <div class="ml-8">
                                        <p class="text-secondary-fixed/60 text-sm font-black uppercase tracking-[0.2em] mb-1">Email Us</p>
                                        <p class="text-2xl font-black text-white tracking-tight">${agentConfig.contact.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-16">
                            <ul class="space-y-4 mb-10">
                                <li class="flex items-center text-sm font-medium text-white/80">
                                    <div class="w-2 h-2 rounded-full bg-secondary-fixed mr-3 shadow-[0_0_10px_rgba(211,189,115,0.8)]"></div>
                                    No-Obligation Financial Review
                                </li>
                                <li class="flex items-center text-sm font-medium text-white/80">
                                    <div class="w-2 h-2 rounded-full bg-secondary-fixed mr-3 shadow-[0_0_10px_rgba(211,189,115,0.8)]"></div>
                                    Direct Underwriter Access
                                </li>
                            </ul>
                            
                            <a class="inline-flex items-center text-sm font-black text-secondary-fixed uppercase tracking-widest hover:text-white transition-all group/btn" href="mailto:${agentConfig.contact.email}">
                                Send Message 
                                <div class="ml-3 w-8 h-[2px] bg-secondary-fixed transform group-hover/btn:w-12 transition-all"></div>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Lead Capture Form -->
                    <div class="group p-8 md:p-12 rounded-[3rem] glass-card border-white/10 hover:border-secondary-fixed/30 transition-all duration-700 reveal reveal-left relative overflow-hidden">
                        <div class="mb-8">
                            <span class="text-secondary-fixed text-xs font-black uppercase tracking-[0.2em] mb-2 block">Take Action</span>
                            <h3 class="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">${agentConfig.leadCapture.title}</h3>
                            <p class="text-white/60 mt-3 text-base md:text-lg">${agentConfig.leadCapture.description}</p>
                        </div>
                        <form id="lead-capture-form" class="space-y-4 md:space-y-5" onsubmit="event.preventDefault(); const btn = this.querySelector('button'); btn.innerHTML = '<span class=\\'material-symbols-outlined mr-2 animate-spin\\'>refresh</span> Processing...'; btn.disabled = true; setTimeout(() => { this.innerHTML = '<div class=\\'flex flex-col items-center justify-center h-full text-center py-10\\'><div class=\\'w-24 h-24 rounded-full bg-gradient-to-br from-secondary-fixed/20 to-secondary-fixed/5 border border-secondary-fixed/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(211,189,115,0.2)]\\'><span class=\\'material-symbols-outlined text-5xl text-secondary-fixed\\'>check_circle</span></div><h3 class=\\'text-3xl md:text-4xl font-black text-white tracking-tight mb-4\\'>Request Received</h3><p class=\\'text-white/60 text-lg max-w-sm mx-auto\\'>Our underwriting team is analyzing your profile and will contact you shortly.</p></div>'; }, 1500);">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                                <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-secondary-fixed/50 focus:ring-1 focus:ring-secondary-fixed/50 transition-all font-bold" type="text" placeholder="First Name" required />
                                <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-secondary-fixed/50 focus:ring-1 focus:ring-secondary-fixed/50 transition-all font-bold" type="text" placeholder="Last Name" required />
                            </div>
                            <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-secondary-fixed/50 focus:ring-1 focus:ring-secondary-fixed/50 transition-all font-bold" type="email" placeholder="Email Address" required />
                            <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-secondary-fixed/50 focus:ring-1 focus:ring-secondary-fixed/50 transition-all font-bold" type="tel" placeholder="Phone Number" required />
                            <button class="w-full mt-4 bg-gradient-to-r from-secondary-fixed to-yellow-600 text-primary font-black py-4 md:py-5 rounded-full hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2 group/btn" type="submit">
                                Get Custom Rate Matrix
                                <span class="material-symbols-outlined transition-transform duration-300 group-hover/btn:translate-x-1">arrow_forward</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            ${renderDivider('curve', 'fill-secondary-fixed')}
        </section>
    `;
}

function renderFooter() {
    return `
        <footer class="bg-primary relative overflow-hidden border-t border-white/10 py-12">

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div class="mb-8">
                    <span class="text-xl font-bold tracking-tight text-white uppercase">Ask<span class="text-secondary-fixed">Juthis</span></span>
                </div>
                <p class="text-secondary-fixed text-sm max-w-md mx-auto mb-8">
                    Providing expert mortgage advice and financing solutions to help you achieve your homeownership dreams. 
                </p>
                <div class="flex justify-center space-x-6 mb-8">
                    <a class="text-white/60 hover:text-white text-2xl" href="${agentConfig.social.x}" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X"><span class="material-symbols-outlined">close</span></a>
                    <a class="text-white/60 hover:text-white text-2xl" href="${agentConfig.social.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram"><span class="material-symbols-outlined">photo_camera</span></a>
                    <a class="text-white/60 hover:text-white text-2xl" href="${agentConfig.social.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn"><span class="material-symbols-outlined">work</span></a>

                </div>
                <div class="text-xs text-secondary-fixed/60">
                    © ${new Date().getFullYear()} AskJuthis. All rights reserved. ${agentConfig.agent.licenseNumber}. Equal Housing Lender.
                </div>
            </div>
        </footer>
    `;
}


function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                if (typeof lenis !== 'undefined' && lenis) {
                    lenis.scrollTo(target, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden') && window.toggleMobileMenu) {
                     window.toggleMobileMenu();
                }
            }
        });
    });
}

window.toggleMobileMenu = function () {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        } else {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    }
}


function renderTopBar() {
    return `
        <div class="bg-secondary-fixed text-primary py-2 px-4 text-xs sm:text-sm font-bold tracking-wide flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 relative z-[60]">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[1rem] animate-pulse">trending_down</span>
                <span class="uppercase tracking-widest">Today's Elite Rates:</span>
            </div>
            <div class="flex items-center gap-4 sm:gap-6 opacity-90">
                ${agentConfig.liveRates.rates.map(rate => `
                    <span>${rate.label}: <span class="font-black text-black">${rate.value}</span></span>
                `).join('<span class="text-primary/30 hidden sm:inline">|</span>')}
            </div>
        </div>
    `;
}

function initLiveCounter() {
    const counterDiv = document.createElement('div');
    counterDiv.className = 'fixed bottom-6 left-6 z-[100] bg-primary/95 backdrop-blur-md border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] rounded-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-3 cursor-default hover:border-secondary-fixed/50 transition-all duration-300 group';
    
    counterDiv.innerHTML = `
        <div class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <span class="text-white text-xs sm:text-sm font-bold tracking-wide"><span id="live-user-count" class="text-white transition-colors duration-300 font-black">1</span> Active Viewers</span>
    `;

    document.body.appendChild(counterDiv);

    // Connect to the real backend WebSocket
    if (typeof io !== 'undefined') {
        // Use localhost:3000 if running locally (e.g., Live Server), else use origin
        const socketUrl = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
            ? 'http://localhost:3000' 
            : window.location.origin;
            
        const socket = io(socketUrl);
        
        socket.on('viewer_count_update', (count) => {
            const countSpan = document.getElementById('live-user-count');
            if (countSpan) {
                // Ensure count is at least 1 (the current user)
                const displayCount = Math.max(1, count);
                countSpan.textContent = displayCount;
                countSpan.classList.add('text-secondary-fixed');
                setTimeout(() => {
                    countSpan.classList.remove('text-secondary-fixed');
                }, 600);
            }
        });
    }
}



