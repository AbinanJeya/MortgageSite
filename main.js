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

    // 4. Build Why Choose Us (Features) Section
    const featuresHTML = renderFeatures();

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
        ${featuresHTML}
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
});

function renderNavigation() {
    const logoContainer = document.getElementById('brand-logo-container');
    const linksContainer = document.getElementById('nav-links-container');

    logoContainer.innerHTML = `<a href="index.html">Ask<span class="text-brand-gold">Juthis</span></a>`;

    linksContainer.innerHTML = `
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#services">Services</a>
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#features">Why Us</a>
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#booking">Book Consultation</a>
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="calculators.html">Calculators</a>
        <a class="bg-brand-slate text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-md" href="#contact">Get a Free Quote</a>
    `;

    // Populate Mobile Menu
    const mobileLinksContainer = document.getElementById('mobile-links-container');
    if (mobileLinksContainer) {
        mobileLinksContainer.innerHTML = `
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="#services" onclick="toggleMobileMenu()">Services</a>
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="#features" onclick="toggleMobileMenu()">Why Us</a>
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="#booking" onclick="toggleMobileMenu()">Book Consultation</a>
            <a class="text-lg font-semibold text-white border-b border-white/10 pb-2" href="calculators.html" onclick="toggleMobileMenu()">Calculators</a>
            <a class="bg-brand-navy text-white px-6 py-4 rounded-xl text-center font-bold text-lg hover:bg-white hover:text-brand-navy transition-all shadow-lg mt-4" href="#contact" onclick="toggleMobileMenu()">Get a Free Quote</a>
        `;
    }
}

function renderHero() {
    return `
        <header class="relative bg-brand-warm overflow-hidden">
            <div class="max-w-7xl mx-auto">
                <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-48 xl:pb-64 lg:pt-48 xl:pt-64 pt-12 px-4 sm:px-6 lg:px-8">
                    <main class="mx-auto max-w-7xl">
                        <div class="sm:text-center lg:text-left">
                            <h1 class="text-4xl tracking-tight font-extrabold text-brand-navy sm:text-5xl md:text-6xl">
                                <span class="block">Your Path to</span>
                                <span class="block text-brand-gold">Homeownership</span>
                                <span class="block">Starts Here</span>
                            </h1>
                            <p class="mt-3 text-base text-gray-700 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                ${agentConfig.agent.fullBio}
                            </p>
                            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                                <a class="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-navy hover:bg-brand-slate md:py-4 md:text-lg md:px-10 shadow-lg" href="#booking">
                                    Book a Consultation
                                </a>
                                <a class="flex items-center justify-center px-8 py-3 border border-brand-navy text-base font-medium rounded-md text-brand-navy bg-transparent hover:bg-white md:py-4 md:text-lg md:px-10" href="#services">
                                    Our Services
                                </a>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img alt="Professional Mortgage Agent" class="h-56 w-full object-cover object-top sm:h-72 md:h-96 lg:w-full lg:h-full lg:object-top" src="${agentConfig.agent.photoUrl}"/>
            </div>
        </header>
    `;
}

function renderServices() {
    return `
        <section class="py-24 bg-brand-slate" id="services">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-base text-brand-gold font-semibold tracking-wide uppercase">Expertise</h2>
                    <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Comprehensive Financing Solutions</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    ${agentConfig.services.map(service => `
                        <div class="group p-8 rounded-2xl glass-card hover-lift shadow-lg">
                            <div class="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold text-brand-navy shadow-md">
                                <i class="ph ph-${service.icon} text-3xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-4">${service.title}</h3>
                            <p class="text-brand-gold mb-6">${service.description}</p>
                            <ul class="space-y-2 text-brand-gold mb-8">
                                ${service.details ? service.details.map(detail => `
                                    <li class="flex items-center">
                                        <i class="ph ph-check-circle mr-2 text-brand-gold"></i> ${detail}
                                    </li>
                                `).join('') : ''}
                            </ul>
                            <a class="font-semibold text-brand-gold hover:text-white transition-colors" href="#">Learn More →</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderFeatures() {
    return `
        <section class="py-24 bg-brand-navy text-white relative overflow-hidden" id="features">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="lg:flex lg:items-center lg:gap-16">
                    <div class="lg:w-1/2 mb-12 lg:mb-0">
                        <img alt="Happy family in front of new home" class="rounded-3xl shadow-2xl" src="assets/hero.png"/>
                    </div>
                    <div class="lg:w-1/2 p-10 glass-card rounded-3xl" style="background: #4A5D73;">
                        <h2 class="text-3xl font-extrabold mb-8 text-white">Why Work With Juthis?</h2>
                        <div class="space-y-10">
                            ${agentConfig.features.map(feature => `
                                <div class="flex items-start">
                                    <div class="flex-shrink-0">
                                        <div class="flex items-center justify-center h-12 w-12 rounded-md bg-brand-gold text-brand-navy">
                                            <i class="ph ph-${feature.icon} text-2xl"></i>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg font-bold text-white">${feature.title}</h3>
                                        <p class="mt-2 text-brand-gold">${feature.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderBooking() {
    return `
        <section class="py-24 bg-brand-warm relative" id="booking">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="lg:flex lg:items-center lg:justify-between gap-12">
                    <div class="lg:w-1/2 mb-12 lg:mb-0">
                        <h2 class="text-base text-brand-navy font-semibold tracking-wide uppercase mb-2">Schedule Now</h2>
                        <h3 class="text-4xl font-extrabold text-brand-navy mb-6">Expert Guidance is Just a Click Away</h3>
                        <p class="text-lg text-gray-700 mb-8">
                            Pick a time that works for you. Our expert consultants are ready to walk you through your options, answer your questions, and help you build a clear path to homeownership. 
                        </p>
                        <div class="space-y-4">
                            <div class="flex items-center text-brand-navy">
                                <i class="ph ph-check-circle mr-3 text-brand-gold text-xl"></i>
                                <span class="font-medium">Free 15-minute Discovery Call</span>
                            </div>
                            <div class="flex items-center text-brand-navy">
                                <i class="ph ph-check-circle mr-3 text-brand-gold text-xl"></i>
                                <span class="font-medium">No obligation, just expert advice</span>
                            </div>
                            <div class="flex items-center text-brand-navy">
                                <i class="ph ph-check-circle mr-3 text-brand-gold text-xl"></i>
                                <span class="font-medium">Get your questions answered live</span>
                            </div>
                        </div>
                    </div>
                    <div class="lg:w-1/2">
                        <div class="glass-card-light rounded-3xl shadow-xl p-4 border border-white/40 min-h-[600px]">
                            <div class="calendly-inline-widget" data-url="${agentConfig.contact.bookingWidgetUrl}?hide_landing_page_details=1&hide_gdpr_banner=1" style="min-width:320px;height:600px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderTestimonials() {
    return `
        <section class="py-24 overflow-hidden" id="testimonials" style="background: #0F1E2E;">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="relative">
                    <div class="text-center max-w-3xl mx-auto">
                        <i class="ph ph-quotes text-6xl text-brand-gold opacity-50 mx-auto mb-6"></i>
                        <p class="text-2xl italic font-medium mb-8" style="color: #D3BD73;">
                            "${agentConfig.agent.shortQuote}"
                        </p>
                        <div class="flex items-center justify-center">
                            <div class="ml-4 text-center">
                                <div class="text-base font-bold text-white">The Miller Family</div>
                                <div class="text-sm text-brand-gold/70">First-time Homebuyers</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-center mt-12 gap-2">
                        <button class="w-3 h-3 rounded-full bg-brand-gold"></button>
                        <button class="w-3 h-3 rounded-full bg-white/20"></button>
                        <button class="w-3 h-3 rounded-full bg-white/20"></button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderContact() {
    return `
        <section class="py-24 bg-brand-warm" id="contact">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="glass-card-dark rounded-3xl shadow-2xl overflow-hidden lg:flex">
                    <div class="lg:w-1/2 p-12 text-white flex flex-col justify-center">
                        <h2 class="text-3xl font-bold mb-6 text-white">Get a Free Quote</h2>
                        <p class="text-brand-gold mb-8 text-lg">Tell us a little about your goals, and we'll provide a no-obligation mortgage estimate tailored to your needs.</p>
                        <div class="space-y-6">
                            <div class="flex items-center">
                                <div class="w-12 h-12 rounded-full glass-card flex items-center justify-center mr-4">
                                    <i class="ph ph-phone text-brand-gold text-2xl"></i>
                                </div>
                                <span class="text-lg font-medium">${agentConfig.contact.phone}</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-12 h-12 rounded-full glass-card flex items-center justify-center mr-4">
                                    <i class="ph ph-envelope-simple text-brand-gold text-2xl"></i>
                                </div>
                                <span class="text-lg font-medium">${agentConfig.contact.email}</span>
                            </div>
                        </div>
                    </div>
                    <div class="lg:w-1/2 p-12 bg-white/95">
                        <form action="#" class="grid grid-cols-1 gap-y-6" onsubmit="event.preventDefault(); alert('Request sent!');">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-bold text-brand-navy">First Name</label>
                                    <input class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-gold focus:ring-brand-gold text-brand-navy" type="text"/>
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-brand-navy">Last Name</label>
                                    <input class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-gold focus:ring-brand-gold text-brand-navy" type="text"/>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-brand-navy">Email Address</label>
                                <input class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-gold focus:ring-brand-gold text-brand-navy" type="email"/>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-brand-navy">I am interested in...</label>
                                <select class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-gold focus:ring-brand-gold text-brand-navy">
                                    <option>New Home Purchase</option>
                                    <option>Refinancing</option>
                                    <option>Debt Consolidation</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-brand-navy">Message (Optional)</label>
                                <textarea class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-gold focus:ring-brand-gold text-brand-navy" rows="4"></textarea>
                            </div>
                            <button class="w-full bg-brand-gold text-brand-navy font-bold py-4 rounded-lg hover:bg-brand-navy hover:text-white transition-all shadow-lg" type="submit">Submit Request</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderFooter() {
    return `
        <footer style="background: #0F1E2E;" class="border-t border-white/10 py-12">
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

window.toggleMobileMenu = function() {
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
