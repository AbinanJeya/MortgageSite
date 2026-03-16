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
});

function renderNavigation() {
    const logoContainer = document.getElementById('brand-logo-container');
    const linksContainer = document.getElementById('nav-links-container');

    const nameParts = agentConfig.branding.companyName.split(' ');
    const firstPart = nameParts[0] || 'CHOLAN';
    const restPart = nameParts.slice(1).join('') || 'MORTGAGES';

    logoContainer.innerHTML = `<a href="index.html">${firstPart}<span class="text-brand-sage">${restPart}</span></a>`;

    linksContainer.innerHTML = `
        <a class="text-sm font-medium hover:text-brand-sage transition-colors" href="#services">Services</a>
        <a class="text-sm font-medium hover:text-brand-sage transition-colors" href="#features">Why Us</a>
        <a class="text-sm font-medium hover:text-brand-sage transition-colors" href="#booking">Book Consultation</a>
        <a class="text-sm font-medium hover:text-brand-sage transition-colors" href="calculators.html">Calculators</a>
        <a class="bg-brand-navy text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-accent transition-all shadow-md" href="#contact">Get a Free Quote</a>
    `;
}

function renderHero() {
    return `
        <header class="relative bg-brand-warm overflow-hidden">
            <div class="max-w-7xl mx-auto">
                <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 lg:pt-32 pt-12 px-4 sm:px-6 lg:px-8">
                    <main class="mx-auto max-w-7xl">
                        <div class="sm:text-center lg:text-left">
                            <h1 class="text-4xl tracking-tight font-extrabold text-brand-navy sm:text-5xl md:text-6xl">
                                <span class="block">Your Path to</span>
                                <span class="block text-brand-sage">Homeownership</span>
                                <span class="block">Starts Here</span>
                            </h1>
                            <p class="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                ${agentConfig.agent.fullBio}
                            </p>
                            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                                <a class="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-navy hover:bg-brand-accent md:py-4 md:text-lg md:px-10 shadow-lg" href="#booking">
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
                <img alt="Professional Mortgage Agent" class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="${agentConfig.agent.photoUrl}"/>
            </div>
        </header>
    `;
}

function renderServices() {
    return `
        <section class="py-24 bg-white" id="services">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-base text-brand-sage font-semibold tracking-wide uppercase">Expertise</h2>
                    <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-brand-navy sm:text-4xl">Comprehensive Financing Solutions</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    ${agentConfig.services.map(service => `
                        <div class="group p-8 rounded-2xl bg-brand-warm hover-lift shadow-sm border border-gray-100">
                            <div class="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-brand-sage shadow-md">
                                <i class="ph ph-${service.icon} text-3xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-brand-navy mb-4">${service.title}</h3>
                            <p class="text-gray-600 mb-6">${service.description}</p>
                            <ul class="space-y-2 text-brand-navy/80 mb-8">
                                ${service.details ? service.details.map(detail => `
                                    <li class="flex items-center">
                                        <i class="ph ph-check-circle mr-2 text-brand-sage"></i> ${detail}
                                    </li>
                                `).join('') : ''}
                            </ul>
                            <a class="font-semibold text-brand-sage hover:text-brand-navy transition-colors" href="#">Learn More →</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderFeatures() {
    return `
        <section class="py-24 bg-brand-navy text-white" id="features">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="lg:flex lg:items-center lg:gap-16">
                    <div class="lg:w-1/2 mb-12 lg:mb-0">
                        <img alt="Happy family in front of new home" class="rounded-3xl shadow-2xl" src="assets/hero.png"/>
                    </div>
                    <div class="lg:w-1/2">
                        <h2 class="text-3xl font-extrabold mb-8 text-white">Why Work With Cholan?</h2>
                        <div class="space-y-10">
                            ${agentConfig.features.map(feature => `
                                <div class="flex items-start">
                                    <div class="flex-shrink-0">
                                        <div class="flex items-center justify-center h-12 w-12 rounded-md bg-brand-sage text-white">
                                            <i class="ph ph-${feature.icon} text-2xl"></i>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                         <h3 class="text-lg font-bold text-white">${feature.title}</h3>
                                        <p class="mt-2 text-brand-warm/80">${feature.description}</p>
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
        <section class="py-24 bg-brand-warm" id="booking">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="lg:flex lg:items-center lg:justify-between gap-12">
                    <div class="lg:w-1/2 mb-12 lg:mb-0">
                        <h2 class="text-base text-brand-sage font-semibold tracking-wide uppercase mb-2">Schedule Now</h2>
                        <h3 class="text-4xl font-extrabold text-brand-navy mb-6">Expert Guidance is Just a Click Away</h3>
                        <p class="text-lg text-gray-600 mb-8">
                            Pick a time that works for you. Our expert consultants are ready to walk you through your options, answer your questions, and help you build a clear path to homeownership. 
                        </p>
                        <div class="space-y-4">
                            <div class="flex items-center text-brand-navy">
                                <i class="ph ph-check-circle mr-3 text-brand-sage text-xl"></i>
                                <span class="font-medium">Free 15-minute Discovery Call</span>
                            </div>
                            <div class="flex items-center text-brand-navy">
                                <i class="ph ph-check-circle mr-3 text-brand-sage text-xl"></i>
                                <span class="font-medium">No obligation, just expert advice</span>
                            </div>
                            <div class="flex items-center text-brand-navy">
                                <i class="ph ph-check-circle mr-3 text-brand-sage text-xl"></i>
                                <span class="font-medium">Get your questions answered live</span>
                            </div>
                        </div>
                    </div>
                    <div class="lg:w-1/2">
                        <div class="bg-white rounded-3xl shadow-xl p-4 border border-gray-100 min-h-[600px]">
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
        <section class="py-24 bg-white overflow-hidden" id="testimonials">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="relative">
                    <div class="text-center max-w-3xl mx-auto">
                        <i class="ph ph-quotes text-6xl text-brand-sage opacity-25"></i>
                        <p class="text-2xl italic font-medium text-brand-navy mb-8">
                            "${agentConfig.agent.shortQuote}"
                        </p>
                        <div class="flex items-center justify-center">
                            <div class="ml-4 text-center">
                                <div class="text-base font-bold">The Miller Family</div>
                                <div class="text-sm text-gray-500">First-time Homebuyers</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-center mt-12 gap-2">
                        <button class="w-3 h-3 rounded-full bg-brand-sage"></button>
                        <button class="w-3 h-3 rounded-full bg-gray-300"></button>
                        <button class="w-3 h-3 rounded-full bg-gray-300"></button>
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
                <div class="bg-white rounded-3xl shadow-xl overflow-hidden lg:flex">
                    <div class="lg:w-1/2 p-12 bg-brand-navy text-white">
                        <h2 class="text-3xl font-bold mb-6 text-white">Get a Free Quote</h2>
                        <p class="text-brand-warm/80 mb-8 text-lg">Tell us a little about your goals, and we'll provide a no-obligation mortgage estimate tailored to your needs.</p>
                        <div class="space-y-6">
                            <div class="flex items-center">
                                <i class="ph ph-phone mr-4 text-brand-sage text-2xl"></i>
                                <span>${agentConfig.contact.phone}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="ph ph-envelope-simple mr-4 text-brand-sage text-2xl"></i>
                                <span>${agentConfig.contact.email}</span>
                            </div>
                        </div>
                    </div>
                    <div class="lg:w-1/2 p-12">
                        <form action="#" class="grid grid-cols-1 gap-y-6" onsubmit="event.preventDefault(); alert('Request sent!');">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">First Name</label>
                                    <input class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-sage focus:ring-brand-sage" type="text"/>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-sage focus:ring-brand-sage" type="text"/>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Email Address</label>
                                <input class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-sage focus:ring-brand-sage" type="email"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">I am interested in...</label>
                                <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-sage focus:ring-brand-sage">
                                    <option>New Home Purchase</option>
                                    <option>Refinancing</option>
                                    <option>Debt Consolidation</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Message (Optional)</label>
                                <textarea class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-sage focus:ring-brand-sage" rows="4"></textarea>
                            </div>
                            <button class="w-full bg-brand-sage text-white font-bold py-4 rounded-lg hover:bg-brand-accent transition-colors shadow-lg" type="submit">Submit Request</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderFooter() {
    return `
        <footer class="bg-white border-t border-gray-100 py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div class="mb-8">
                    <span class="text-xl font-bold tracking-tight text-brand-navy">CHOLAN<span class="text-brand-sage">MORTGAGES</span></span>
                </div>
                <p class="text-gray-500 text-sm max-w-md mx-auto mb-8">
                    Providing expert mortgage advice and financing solutions to help you achieve your homeownership dreams. 
                </p>
                <div class="flex justify-center space-x-6 mb-8">
                    <a class="text-gray-400 hover:text-brand-navy text-2xl" href="${agentConfig.social.facebook}"><i class="ph ph-facebook-logo"></i></a>
                    <a class="text-gray-400 hover:text-brand-navy text-2xl" href="${agentConfig.social.instagram}"><i class="ph ph-instagram-logo"></i></a>
                    <a class="text-gray-400 hover:text-brand-navy text-2xl" href="${agentConfig.social.linkedin}"><i class="ph ph-linkedin-logo"></i></a>
                </div>
                <div class="text-xs text-gray-400">
                    © ${new Date().getFullYear()} Cholan Mortgages. All rights reserved. ${agentConfig.agent.licenseNumber}. Equal Housing Lender.
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
    // Simple alert for legacy behavior or add real toggle logic here
    alert('Mobile menu toggle - Integration pending');
}
