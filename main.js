/**
 * Main application logic for Cholan Mortgages
 * Reads from config.js and injects Tailwind-based UI into the DOM.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Branding & Navigation
    renderNavigation();

    // 2. Build Hero Section
    const heroHTML = renderHero();

    // 3. Build Services Section
    const servicesHTML = renderServices();

    // 4. Build About / Why Choose Section (New Design)
    const aboutHTML = renderAbout();

    // 5. Build Appointment Booking Section
    const bookingHTML = renderBooking();

    // 6. Build Testimonials Section
    const testimonialsHTML = renderTestimonials();

    // 7. Build Contact / Quote Section
    const contactHTML = renderContact();

    // 8. Build Footer
    const footerHTML = renderFooter();

    // Combine and Inject
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = `
        ${heroHTML}
        ${servicesHTML}
        ${aboutHTML}
        ${bookingHTML}
        ${testimonialsHTML}
        ${contactHTML}
        ${footerHTML}
    `;

    // Smooth Scroll Initialization
    initSmoothScroll();

    // Re-initialize Calendly widget (script loads async, may not be ready yet)
    function initCalendly() {
        const calendlyEl = document.querySelector('.calendly-inline-widget');
        if (calendlyEl && typeof Calendly !== 'undefined') {
            Calendly.initInlineWidget({
                url: calendlyEl.getAttribute('data-url'),
                parentElement: calendlyEl
            });
        } else {
            setTimeout(initCalendly, 500);
        }
    }
    initCalendly();
    initTestimonialSlider();
    initScrollReveal();
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
            dots[i].classList.toggle('bg-brand-gold', i === index);
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

function renderNavigation() {
    const logoContainer = document.getElementById('brand-logo-container');
    const linksContainer = document.getElementById('nav-links-container');

    logoContainer.innerHTML = `<a href="index.html">Ask<span class="text-brand-gold">Juthis</span></a>`;

    linksContainer.innerHTML = `
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#services">Services</a>
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#why-choose">Why Us</a>
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#booking">Book Consultation</a>
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="calculators.html">Calculators</a>
        <a class="bg-brand-slate text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-md" href="#contact">Get a Free Quote</a>
    `;

    // Populate Mobile Menu
    const mobileLinksContainer = document.getElementById('mobile-links-container');
    if (mobileLinksContainer) {
        mobileLinksContainer.innerHTML = `
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="#services" onclick="toggleMobileMenu()">Services</a>
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="#why-choose" onclick="toggleMobileMenu()">Why Us</a>
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="#booking" onclick="toggleMobileMenu()">Book Consultation</a>
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="calculators.html" onclick="toggleMobileMenu()">Calculators</a>
            <a class="bg-brand-navy text-white px-6 py-4 rounded-xl text-center font-bold text-lg hover:bg-white hover:text-brand-navy transition-all shadow-lg mt-4" href="#contact" onclick="toggleMobileMenu()">Get a Free Quote</a>
        `;
    }
}

function renderDivider(type, colorClass, isTop = false) {
    const positionClass = isTop ? 'section-divider-top' : 'section-divider-bottom';
    let path = '';
    
    // Professional, static geometric paths
    if (type === 'curve') {
        path = `<path d="M0,64 C480,128 960,0 1440,64 L1440,128 L0,128 Z" class="${colorClass}"></path>`;
    } else if (type === 'slant') {
        path = `<path d="M0,0 L1440,96 L1440,128 L0,128 Z" class="${colorClass}"></path>`;
    } else if (type === 'step') {
        path = `<path d="M0,64 L720,64 L720,0 L1440,0 L1440,128 L0,128 Z" class="${colorClass}"></path>`;
    }

    return `
        <div class="section-divider ${positionClass}">
            <svg viewBox="0 0 1440 128" preserveAspectRatio="none">
                ${path}
            </svg>
        </div>
    `;
}

function renderHero() {
    return `
        <header class="relative min-h-screen flex items-center pt-44 pb-24 bg-brand-navy">
            <!-- Background Image with Overlay -->
            <div class="absolute inset-0 z-0">
                <img src="assets/hero.png" alt="Home background" class="w-full h-full object-cover opacity-40">
                <div class="absolute inset-0 bg-brand-navy/60"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-transparent to-brand-navy/80"></div>
            </div>

            <!-- Permanent Broker Profile Card - Top Right of Header -->
            <div class="absolute top-6 right-10 z-30 hidden lg:block">
                <div class="w-64 glass-card p-2 rounded-[2.5rem] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.6)] border border-white/30 backdrop-blur-2xl bg-brand-navy/60">
                    <div class="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden">
                        <img src="${agentConfig.agent.photoUrl}" alt="${agentConfig.agent.name}" class="w-full h-full object-cover object-top">
                        <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent"></div>
                        <div class="absolute bottom-6 left-0 right-0 text-center px-4">
                            <p class="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Expert Guidance</p>
                            <p class="text-white text-xl font-extrabold tracking-tight">${agentConfig.agent.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                <div class="max-w-4xl mx-auto text-center">
                    <h1 class="text-6xl md:text-8xl tracking-tight font-extrabold text-white mb-10">
                        <span class="block">Your Path to</span>
                        <span class="block text-brand-gold my-2">Homeownership</span>
                        <span class="block">Starts Here</span>
                    </h1>
                    <p class="mt-8 text-xl md:text-3xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed mb-16 px-4">
                        ${agentConfig.agent.fullBio}
                    </p>
                    <div class="flex flex-col sm:flex-row gap-8 justify-center items-center">
                        <a class="w-full sm:w-auto flex items-center justify-center px-12 py-5 border border-transparent text-xl font-bold rounded-xl text-brand-navy bg-brand-gold hover:bg-white transform hover:scale-105 transition-all shadow-[0_20px_50px_-10px_rgba(211,189,115,0.4)]" href="#booking">
                            Book a Consultation
                        </a>
                        <a class="w-full sm:w-auto flex items-center justify-center px-12 py-5 border-2 border-white/30 backdrop-blur-sm text-xl font-bold rounded-xl text-white bg-white/10 hover:bg-white hover:text-brand-navy transform hover:scale-105 transition-all" href="#services">
                            Our Services
                        </a>
                    </div>
                </div>
            </div>
            ${renderDivider('curve', 'fill-brand-navy')}
        </header>
    `;
}

function renderAbout() {
    const { about } = agentConfig;
    return `
        <section class="py-32 bg-rich text-white overflow-hidden" id="about">
            <img src="assets/about_bg.png" alt="Homeownership lifestyle" class="bg-rich-image opacity-20">
            <div class="bg-rich-overlay opacity-50"></div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-20 items-center">
                    <!-- Left Column - Stats & Info -->
                    <div class="order-2 lg:order-1 lg:col-span-1 reveal reveal-right">
                        <div class="glass-card p-10 rounded-[3rem] border-white/10 shadow-2xl bg-brand-navy/60 backdrop-blur-3xl">
                            <div class="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                                <span class="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] leading-none">Our Mission</span>
                            </div>
                            <h2 class="text-5xl font-black mb-8 text-brand-gold tracking-tight leading-tight">${about.title}</h2>
                            <div class="space-y-6 text-white/60 mb-12 text-lg leading-relaxed">
                                <p>${about.description1}</p>
                                <p>${about.description2}</p>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-x-8 gap-y-10">
                                ${about.stats.map(stat => `
                                    <div class="flex flex-col items-center lg:items-start group/stat">
                                        <div class="text-brand-gold mb-3 transform transition-transform group-hover/stat:scale-110">
                                            <i class="ph ph-${stat.icon} text-3xl"></i>
                                        </div>
                                        <div class="text-3xl font-black text-white tracking-tight">${stat.value}</div>
                                        <div class="text-xs text-white/60 font-bold uppercase tracking-[0.2em]">${stat.label}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Middle Column - Broker Photo -->
                    <div class="order-1 lg:order-2 flex justify-center reveal reveal-up">
                        <div class="relative group">
                            <div class="absolute -inset-10 bg-brand-gold/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div class="relative w-80 h-[32rem] lg:w-[26rem] lg:h-[36rem] overflow-hidden rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(15,30,46,0.4)] border-[12px] border-white backdrop-blur-md bg-white/40">
                                <img src="${agentConfig.agent.photoUrl}" alt="${agentConfig.agent.name}" class="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105">
                                <div class="absolute bottom-8 left-0 right-0 text-center">
                                    <div class="inline-block bg-brand-navy/90 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl">
                                        <span class="text-white text-xs font-bold uppercase tracking-[0.2em]">Dedicated to You</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Bio -->
                    <div class="order-3 lg:col-span-1 reveal reveal-left">
                        <div class="glass-card p-10 rounded-[3rem] border-white/10 bg-brand-navy/60 backdrop-blur-3xl shadow-2xl">
                            <h2 class="text-3xl font-black mb-8 text-brand-gold tracking-tight leading-tight">${about.meetBroker.title}</h2>
                            <div class="relative mb-10">
                                <i class="ph ph-quotes absolute -left-8 -top-8 text-6xl text-brand-gold/10"></i>
                                <p class="text-xl italic font-semibold text-white/90 leading-relaxed">
                                    "${about.meetBroker.quote}"
                                </p>
                            </div>
                            <p class="text-white/60 leading-relaxed mb-10 text-lg">
                                ${about.meetBroker.description}
                            </p>
                            <a href="${about.meetBroker.linkUrl}" class="inline-flex items-center px-8 py-4 rounded-full bg-brand-gold text-brand-navy font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 group">
                                ${about.meetBroker.linkText}
                                <i class="ph ph-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            ${renderDivider('slant', 'fill-brand-navy')}
        </section>
    `;
}

function renderServices() {
    return `
        <section class="py-32 bg-rich overflow-hidden" id="services">
            <img src="assets/services_bg.png" alt="Consultation background" class="bg-rich-image">
            <div class="bg-rich-overlay"></div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-center mb-24 reveal reveal-up">
                    <div class="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                        <span class="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] leading-none">Our Expertise</span>
                    </div>
                    <h2 class="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">Comprehensive<br><span class="text-brand-gold">Financing Solutions</span></h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    ${agentConfig.services.map((service, index) => `
                        <div class="group p-10 rounded-[3rem] glass-card border-white/10 hover:border-brand-gold/30 transition-all duration-700 reveal ${index % 2 === 0 ? 'reveal-right' : 'reveal-left'}">
                            <div class="flex items-start gap-8">
                                <div class="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/50 flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transform group-hover:rotate-[10deg] transition-transform duration-700">
                                    <i class="ph ph-${service.icon} text-4xl"></i>
                                </div>
                                <div class="flex-grow">
                                    <h3 class="text-3xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors">${service.title}</h3>
                                    <p class="text-white/60 text-lg leading-relaxed mb-8">${service.description}</p>
                                    
                                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                        ${service.details ? service.details.map(detail => `
                                            <li class="flex items-center text-sm font-medium text-white/80">
                                                <div class="w-2 h-2 rounded-full bg-brand-gold mr-3 shadow-[0_0_10px_rgba(211,189,115,0.8)]"></div>
                                                ${detail}
                                            </li>
                                        `).join('') : ''}
                                    </ul>
                                    
                                    <a class="inline-flex items-center text-sm font-black text-brand-gold uppercase tracking-widest hover:text-white transition-all group/btn" href="#">
                                        Explore Scope 
                                        <div class="ml-3 w-8 h-[2px] bg-brand-gold transform group-hover/btn:w-12 transition-all"></div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${renderDivider('curve', 'fill-brand-navy')}
        </section>
    `;
}



function renderBooking() {
    return `
        <section class="py-32 bg-rich glass-section relative overflow-hidden" id="booking">
            <div class="bg-rich-image" style="background-image: url('assets/booking_bg.png'); opacity: 0.15; filter: grayscale(20%);"></div>
            <div class="absolute inset-0 bg-brand-navy/60"></div>
            
            <!-- Decorative Elements -->
            <div class="absolute -top-24 -left-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] reveal reveal-scale"></div>
            <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-navy/20 rounded-full blur-[120px] reveal reveal-scale"></div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="lg:flex lg:items-center lg:justify-between gap-12">
                    <div class="lg:w-1/2 mb-16 lg:mb-0 reveal reveal-right flex flex-col h-full">
                        <div class="group p-10 md:p-14 rounded-[3rem] glass-card border-white/10 hover:border-brand-gold/30 transition-all duration-700 h-full flex flex-col">
                            <div>
                                <div class="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                                    <span class="text-brand-gold text-xs font-black uppercase tracking-[0.3em] leading-none">Consultation</span>
                                </div>
                                <h3 class="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">Expert Guidance<br><span class="text-brand-gold">One Click Away</span></h3>
                                <p class="text-xl text-white/70 mb-12 leading-relaxed font-medium">
                                    Pick a time that works for you. Our expert consultants are ready to walk you through your options, answer your questions, and help you build a clear path to homeownership. 
                                </p>
                            </div>
                            <div class="space-y-10">
                                <div class="flex items-center group/item reveal reveal-up">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/50 flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transition-transform duration-700 relative">
                                        <div class="absolute inset-0 rounded-full bg-brand-gold animate-pulse opacity-20"></div>
                                        <i class="ph ph-calendar-check text-4xl relative z-10"></i>
                                    </div>
                                    <div class="ml-8">
                                        <span class="text-lg font-black text-white tracking-tight uppercase tracking-wider">Free 15-minute Discovery Call</span>
                                    </div>
                                </div>
                                <div class="flex items-center group/item reveal reveal-up" style="transition-delay: 100ms;">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/50 flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transition-transform duration-700 relative">
                                        <div class="absolute inset-0 rounded-full bg-brand-gold animate-pulse opacity-20"></div>
                                        <i class="ph ph-shield-check text-4xl relative z-10"></i>
                                    </div>
                                    <div class="ml-8">
                                        <span class="text-lg font-black text-white tracking-tight uppercase tracking-wider">No obligation, just expert advice</span>
                                    </div>
                                </div>
                                <div class="flex items-center group/item reveal reveal-up" style="transition-delay: 200ms;">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/50 flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transition-transform duration-700 relative">
                                        <div class="absolute inset-0 rounded-full bg-brand-gold animate-pulse opacity-20"></div>
                                        <i class="ph ph-chat-text text-4xl relative z-10"></i>
                                    </div>
                                    <div class="ml-8">
                                        <span class="text-lg font-black text-white tracking-tight uppercase tracking-wider">Get your questions answered live</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lg:w-1/2 reveal reveal-left">
                        <div class="group p-6 rounded-[3rem] glass-card border-white/10 hover:border-brand-gold/30 transition-all duration-700 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] min-h-[600px] relative overflow-hidden">
                           <div class="absolute inset-0 bg-brand-gold/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
                            <div class="calendly-inline-widget relative z-10" data-url="${agentConfig.contact.bookingWidgetUrl}?hide_landing_page_details=1&hide_gdpr_banner=1" style="min-width:320px;height:600px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            ${renderDivider('curve', 'fill-white')}
        </section>
    `;
}

function renderTestimonials() {
    return `
        <section class="py-24 overflow-hidden bg-brand-navy/90 glass-section" id="testimonials">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="relative testimonial-container">
                    <div class="text-center max-w-3xl mx-auto">
                        <i class="ph ph-quotes text-6xl text-brand-gold opacity-50 mx-auto mb-6"></i>
                        <div class="relative h-64 md:h-48">
                            ${agentConfig.agent.testimonials.map((t, i) => `
                                <div class="testimonial-slide absolute inset-0 transition-all duration-700 opacity-0 transform translate-x-8 ${i === 0 ? 'active' : ''}">
                                    <p class="text-2xl italic font-black mb-8 text-brand-gold tracking-tight leading-relaxed">
                                        "${t.quote}"
                                    </p>
                                    <div class="flex items-center justify-center">
                                        <div class="ml-4 text-center">
                                            <div class="text-base font-black text-white tracking-tight uppercase tracking-[0.1em]">${t.author}</div>
                                            <div class="text-sm text-brand-gold/60 font-bold uppercase tracking-[0.2em]">${t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="flex justify-center mt-12 gap-2">
                        ${agentConfig.agent.testimonials.map((_, i) => `
                            <button class="testimonial-dot w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? 'bg-brand-gold' : 'bg-white/20'}" data-index="${i}"></button>
                        `).join('')}
                    </div>
                </div>
            </div>
            ${renderDivider('slant', 'fill-brand-navy')}
        </section>
    `;
}

function renderContact() {
    return `
        <section class="py-32 bg-rich overflow-hidden" id="contact">
            <img src="assets/contact_bg.png" alt="Contact background" class="bg-rich-image">
            <div class="bg-rich-overlay"></div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-center mb-24 reveal reveal-up">
                    <div class="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                        <span class="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] leading-none">Get Started</span>
                    </div>
                    <h2 class="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">Secure Your<br><span class="text-brand-gold">Free Quote Today</span></h2>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- Contact Info Card -->
                    <div class="group p-10 md:p-14 rounded-[3rem] glass-card border-white/10 hover:border-brand-gold/30 transition-all duration-700 reveal reveal-right flex flex-col justify-between">
                        <div>
                            <h3 class="text-4xl font-black text-white mb-6 tracking-tight leading-tight">Direct Access to<br><span class="text-brand-gold">Expert Advice</span></h3>
                            <p class="text-white/60 text-xl leading-relaxed mb-12">
                                Skip the robots. Reach out directly for a personalized consultation tailored to your unique financial goals.
                            </p>
                            
                            <div class="space-y-10">
                                <div class="flex items-center group/item transform hover:translate-x-3 transition-transform duration-500">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/50 flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transform group-hover/item:rotate-[10deg] transition-transform duration-700">
                                        <i class="ph ph-phone text-4xl"></i>
                                    </div>
                                    <div class="ml-8">
                                        <p class="text-brand-gold/60 text-sm font-black uppercase tracking-[0.2em] mb-1">Call Anytime</p>
                                        <p class="text-2xl font-black text-white tracking-tight">${agentConfig.contact.phone}</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center group/item transform hover:translate-x-3 transition-transform duration-500">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/50 flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transform group-hover/item:rotate-[10deg] transition-transform duration-700">
                                        <i class="ph ph-envelope-simple text-4xl"></i>
                                    </div>
                                    <div class="ml-8">
                                        <p class="text-brand-gold/60 text-sm font-black uppercase tracking-[0.2em] mb-1">Email Us</p>
                                        <p class="text-2xl font-black text-white tracking-tight">${agentConfig.contact.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-16">
                            <ul class="space-y-4 mb-10">
                                <li class="flex items-center text-sm font-medium text-white/80">
                                    <div class="w-2 h-2 rounded-full bg-brand-gold mr-3 shadow-[0_0_10px_rgba(211,189,115,0.8)]"></div>
                                    No-Obligation Financial Review
                                </li>
                                <li class="flex items-center text-sm font-medium text-white/80">
                                    <div class="w-2 h-2 rounded-full bg-brand-gold mr-3 shadow-[0_0_10px_rgba(211,189,115,0.8)]"></div>
                                    Direct Underwriter Direct Access
                                </li>
                            </ul>
                            
                            <a class="inline-flex items-center text-sm font-black text-brand-gold uppercase tracking-widest hover:text-white transition-all group/btn" href="mailto:${agentConfig.contact.email}">
                                Send Message 
                                <div class="ml-3 w-8 h-[2px] bg-brand-gold transform group-hover/btn:w-12 transition-all"></div>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Form Card -->
                    <div class="p-10 md:p-14 rounded-[3rem] glass-card border-white/10 reveal reveal-left">
                        <form action="#" class="grid grid-cols-1 gap-y-6" onsubmit="event.preventDefault(); alert('Request sent!');">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-black text-brand-gold uppercase tracking-widest mb-2 px-1">First Name</label>
                                    <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold" type="text" placeholder="John"/>
                                </div>
                                <div>
                                    <label class="block text-sm font-black text-brand-gold uppercase tracking-widest mb-2 px-1">Last Name</label>
                                    <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold" type="text" placeholder="Doe"/>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-black text-brand-gold uppercase tracking-widest mb-2 px-1">Email Address</label>
                                <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold" type="email" placeholder="john@example.com"/>
                            </div>
                            <div>
                                <label class="block text-sm font-black text-brand-gold uppercase tracking-widest mb-2 px-1">Interest</label>
                                <select class="w-full bg-brand-navy border border-white/10 rounded-2xl py-4 px-6 text-white appearance-none focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold cursor-pointer">
                                    <option>New Home Purchase</option>
                                    <option>Refinancing</option>
                                    <option>Debt Consolidation</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-black text-brand-gold uppercase tracking-widest mb-2 px-1">Message</label>
                                <textarea class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold" rows="4" placeholder="How can we help?"></textarea>
                            </div>
                            <button class="w-full mt-4 bg-brand-gold text-brand-navy font-black py-5 rounded-[2rem] hover:bg-brand-navy hover:text-white hover:scale-[1.02] transition-all shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] uppercase tracking-[0.2em] text-sm" type="submit">
                                Request Quote
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            ${renderDivider('curve', 'fill-brand-gold')}
        </section>
    `;
}

function renderFooter() {
    return `
        <footer class="bg-brand-navy/90 glass-section border-t border-white/10 py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div class="mb-8">
                    <span class="text-xl font-bold tracking-tight text-white uppercase">Ask<span class="text-brand-gold">Juthis</span></span>
                </div>
                <p class="text-brand-gold text-sm max-w-md mx-auto mb-8">
                    Providing expert mortgage advice and financing solutions to help you achieve your homeownership dreams. 
                </p>
                <div class="flex justify-center space-x-6 mb-8">
                    <a class="text-white/60 hover:text-white text-2xl" href="${agentConfig.social.x}" target="_blank"><i class="ph ph-x-logo"></i></a>
                    <a class="text-white/60 hover:text-white text-2xl" href="${agentConfig.social.instagram}" target="_blank"><i class="ph ph-instagram-logo"></i></a>
                    <a class="text-white/60 hover:text-white text-2xl" href="${agentConfig.social.linkedin}" target="_blank"><i class="ph ph-linkedin-logo"></i></a>
                </div>
                <div class="text-xs text-brand-gold/60">
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
                target.scrollIntoView({
                    behavior: 'smooth'
                });
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
