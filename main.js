/**
 * Main application logic for AskJuthis Mortgages
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
    let calendlyRetries = 0;
    function initCalendly() {
        const calendlyEl = document.querySelector('.calendly-inline-widget');
        if (calendlyEl && typeof Calendly !== 'undefined') {
            Calendly.initInlineWidget({
                url: calendlyEl.getAttribute('data-url'),
                parentElement: calendlyEl
            });
        } else if (calendlyRetries < 20) {
            calendlyRetries++;
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
    const ctaContainer = document.getElementById('nav-cta-container');

    logoContainer.innerHTML = `<a href="index.html">Ask<span class="text-brand-gold">Juthis</span></a>`;

    linksContainer.innerHTML = `
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#services">Services</a>
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#why-choose">Why Us</a>
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="#booking">Book Consultation</a>
        <a class="text-sm font-medium hover:text-brand-gold transition-colors text-white glass-nav-link px-3 py-2 rounded-lg" href="calculators.html">Calculators</a>
    `;

    if (ctaContainer) {
        ctaContainer.innerHTML = `
            <a class="text-sm font-semibold text-brand-gold hover:text-white transition-colors px-4 py-2 border border-brand-gold/30 rounded-full cursor-pointer" onclick="window.togglePortal(true)">Borrower Portal</a>
            <a class="bg-brand-slate text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-md" href="#contact">Get a Free Quote</a>
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
            <a class="text-lg font-semibold text-brand-gold border-b border-white/10 pb-2" onclick="window.togglePortal(true); toggleMobileMenu()">Borrower Portal</a>
            <a class="bg-brand-navy text-white px-6 py-4 rounded-xl text-center font-bold text-lg hover:bg-white hover:text-brand-navy transition-all shadow-lg mt-4" href="#contact" onclick="toggleMobileMenu()">Get a Free Quote</a>
        `;
    }
}

// Global state for brochure content
let brochureHTML = '';
let loanCompleted = false;

window.togglePortal = function(showPortal) {
    const appContent = document.getElementById('app-content');
    
    if (showPortal) {
        if (!brochureHTML) brochureHTML = appContent.innerHTML;
        // Start at Login
        appContent.innerHTML = renderLogin();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        initScrollReveal();
    } else {
        if (brochureHTML) {
            appContent.innerHTML = brochureHTML;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            initScrollReveal();
            initTestimonialSlider();
        }
    }
}

// State transition functions
window.submitLogin = function() {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = renderMFA();
    initScrollReveal();
}

window.verifyMFA = function() {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = renderPortal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initScrollReveal();
}

window.startWizard = function(step = 1) {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = renderWizard(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initScrollReveal();
}

window.nextWizardStep = function(currentStep) {
    if (currentStep < 3) {
        window.startWizard(currentStep + 1);
    } else {
        loanCompleted = true; // Set success state
        window.verifyMFA(); // Return to dashboard
    }
}

window.showSyncProcessing = function() {
    const container = document.getElementById('sync-status-container');
    const uploadDiv = document.querySelector('div[onclick="window.showSyncProcessing()"]');
    const nextBtn = document.getElementById('wizard-next-btn');
    
    if (container && uploadDiv) {
        uploadDiv.classList.add('hidden');
        container.classList.remove('hidden');
        
        container.innerHTML = `
            <div class="flex flex-col items-center py-10">
                <div class="relative w-20 h-20 mb-6">
                    <div class="absolute inset-0 border-4 border-brand-gold/20 rounded-full"></div>
                    <div class="absolute inset-0 border-4 border-brand-gold rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p class="text-brand-gold font-black uppercase tracking-[0.2em] text-xs animate-pulse">Establishing Secure API Connection...</p>
                <p class="text-white/30 text-[10px] mt-2 font-bold uppercase tracking-widest">Syncing Verified Payroll & Tax Data</p>
            </div>
        `;

        setTimeout(() => {
            container.innerHTML = renderSyncResult();
            if (nextBtn) {
                nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                nextBtn.removeAttribute('disabled');
            }
        }, 3000);
    }
}

function renderSyncResult() {
    return `
        <div class="w-full bg-white/5 rounded-3xl p-8 border border-green-500/30 text-left mb-8 reveal reveal-up">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <i class="ph-bold ph-check"></i>
                </div>
                <span class="text-[10px] font-black text-white uppercase tracking-widest">Direct Sync Verified (API Key: AUTH-8829)</span>
            </div>
            
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <span class="block text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Payroll Provider</span>
                    <span class="text-white font-bold">ADP Global</span>
                </div>
                <div>
                    <span class="block text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Sync Date</span>
                    <span class="text-white font-bold">Mar 21, 2026</span>
                </div>
                <div>
                    <span class="block text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Avg. Gross Pay</span>
                    <span class="text-brand-gold font-black">$4,582.50</span>
                </div>
                <div>
                    <span class="block text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Status</span>
                    <span class="text-white font-bold">Fully Verified</span>
                </div>
            </div>
            
            <div class="mt-6 pt-4 border-t border-white/10">
                <div class="flex items-center justify-between">
                     <span class="text-[9px] font-black text-white/30 uppercase tracking-widest">YTD Earnings (Verified)</span>
                     <span class="text-white/60 font-bold">$22,912.50</span>
                </div>
            </div>
        </div>
    `;
}

function renderWizard(step) {
    const steps = [
        { id: 1, title: 'Identity', icon: 'ph-identification-card', desc: 'Secure ID Verification' },
        { id: 2, title: 'Payroll', icon: 'ph-briefcase', desc: 'Direct Employer Sync' },
        { id: 3, title: 'Assets', icon: 'ph-bank', desc: 'Direct Bank Link' }
    ];

    const currentStep = steps.find(s => s.id === step);

    return `
        <section class="min-h-screen bg-brand-navy pt-32 pb-24 relative overflow-hidden">
             <!-- Background Image with Overlay -->
            <div class="absolute inset-0 z-0 opacity-10">
                <img src="assets/modern.jpg" alt="Wizard Background" class="w-full h-full object-cover">
            </div>
            <div class="absolute inset-0 bg-brand-navy/90 z-0"></div>

            <div class="max-w-4xl mx-auto px-4 relative z-10">
                <!-- Wizard Header -->
                <div class="flex flex-col items-center text-center mb-16 reveal reveal-up">
                    <div class="flex items-center gap-4 mb-8">
                        ${steps.map(s => `
                            <div class="flex items-center gap-2">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${s.id === step ? 'bg-brand-gold text-brand-navy shadow-lg shadow-brand-gold/20' : (s.id < step ? 'bg-green-500 text-white' : 'bg-white/10 text-white/30')}">
                                    ${s.id < step ? '<i class="ph-bold ph-check"></i>' : s.id}
                                </div>
                                <span class="hidden md:block text-[10px] font-black uppercase tracking-widest ${s.id === step ? 'text-white' : 'text-white/20'}">${s.title}</span>
                                ${s.id < 3 ? `<div class="w-8 h-px ${s.id < step ? 'bg-green-500/50' : 'bg-white/10'}"></div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <h2 class="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Step ${step}: <span class="text-brand-gold">${currentStep.title}</span></h2>
                    <p class="text-white/40 font-bold uppercase tracking-[0.2em] text-sm">${currentStep.desc}</p>
                </div>

                <!-- Wizard Content Card -->
                <div class="p-10 md:p-16 rounded-[4rem] glass-card border-white/10 shadow-2xl reveal reveal-up">
                    ${step === 1 ? `
                        <div class="flex flex-col items-center text-center">
                            <div class="w-32 h-32 rounded-[2rem] bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-10">
                                <i class="ph-fill ph-identification-card text-brand-gold text-6xl"></i>
                            </div>
                            <h3 class="text-2xl font-black text-white mb-6 uppercase tracking-tight">Drivers License or Passport</h3>
                            <p class="text-white/40 mb-12 max-w-md mx-auto leading-relaxed">Please ensure your ID is within the frame and the text is clearly visible. We use bank-grade encryption to verify your identity instantly.</p>
                            
                            <div class="w-full max-w-sm aspect-[3/2] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group mb-12">
                                <i class="ph ph-camera text-4xl text-white/20 group-hover:text-brand-gold mb-4 transition-colors"></i>
                                <span class="text-white/40 font-bold uppercase tracking-widest text-xs group-hover:text-white transition-colors">Open Camera or Upload</span>
                            </div>

                            <button onclick="window.nextWizardStep(1)" class="w-full max-w-xs py-5 rounded-3xl bg-brand-gold text-brand-navy font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-xl active:scale-95">
                                Identification Verified
                            </button>
                        </div>
                    ` : step === 2 ? `
                        <div class="flex flex-col items-center text-center">
                            <div class="w-32 h-32 rounded-[2rem] bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-10">
                                <i class="ph-fill ph-briefcase text-brand-gold text-6xl"></i>
                            </div>
                            <h3 class="text-2xl font-black text-white mb-6 uppercase tracking-tight">Financial Sync: Income</h3>
                            <p class="text-white/40 mb-12 max-w-md mx-auto leading-relaxed">Connect directly to your payroll provider (ADP, Workday) or pull verified tax data from the CRA. This is the most secure method for serious financing.</p>
                            
                            <div onclick="window.showSyncProcessing()" class="w-full max-w-sm py-12 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group mb-12">
                                <i class="ph ph-shield-check text-4xl text-white/20 group-hover:text-brand-gold mb-4 transition-colors"></i>
                                <span class="text-white/40 font-bold uppercase tracking-widest text-xs group-hover:text-white transition-colors">Connect Payroll Account</span>
                            </div>

                            <div id="sync-status-container" class="hidden w-full max-w-xs">
                                <!-- Sync Processing UI will be injected here -->
                            </div>

                            <button id="wizard-next-btn" onclick="window.nextWizardStep(2)" class="w-full max-w-xs py-5 rounded-3xl bg-brand-gold text-brand-navy font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-xl active:scale-95 opacity-50 cursor-not-allowed" disabled>
                                Confirm Synced Data
                            </button>
                        </div>
                    ` : `
                        <div class="flex flex-col items-center text-center">
                            <div class="w-32 h-32 rounded-[2rem] bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-10">
                                <i class="ph-fill ph-bank text-brand-gold text-6xl"></i>
                            </div>
                            <h3 class="text-2xl font-black text-white mb-6 uppercase tracking-tight">Asset Verification (Plaid)</h3>
                            <p class="text-white/40 mb-12 max-w-md mx-auto leading-relaxed">Securely link your primary bank account to verify your down payment and closing funds. This is the fastest, safest way to complete your application.</p>
                            
                            <div class="w-full max-w-md p-8 rounded-3xl bg-brand-navy border border-white/10 mb-12 text-left">
                                <div class="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                                    <div class="w-8 h-8 rounded bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                        <i class="ph-bold ph-shield-check"></i>
                                    </div>
                                    <span class="text-[10px] font-black text-white uppercase tracking-widest">Bank-Grade 256-bit Security</span>
                                </div>
                                <div class="space-y-4">
                                     <div class="flex items-center justify-between text-white/60 hover:text-white transition-colors cursor-pointer group">
                                        <span class="font-bold">TD Canada Trust</span>
                                        <i class="ph ph-caret-right opacity-0 group-hover:opacity-100 transition-all"></i>
                                     </div>
                                     <div class="flex items-center justify-between text-white/60 hover:text-white transition-colors cursor-pointer group">
                                        <span class="font-bold">RBC Royal Bank</span>
                                        <i class="ph ph-caret-right opacity-0 group-hover:opacity-100 transition-all"></i>
                                     </div>
                                     <div class="flex items-center justify-between text-white/60 hover:text-white transition-colors cursor-pointer group">
                                        <span class="font-bold">Scotiabank</span>
                                        <i class="ph ph-caret-right opacity-0 group-hover:opacity-100 transition-all"></i>
                                     </div>
                                </div>
                            </div>

                            <button onclick="window.nextWizardStep(3)" class="w-full max-w-xs py-5 rounded-3xl bg-brand-gold text-brand-navy font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-xl active:scale-95">
                                Accounts Linked
                            </button>
                        </div>
                    `}
                </div>

                <button onclick="window.togglePortal(true)" class="mt-12 w-full text-center text-white/20 hover:text-white transition-colors uppercase font-black tracking-widest text-xs">
                    Cancel & Return to Dashboard
                </button>
            </div>
        </section>
    `;
}

function renderLogin() {
    return `
        <section class="min-h-screen bg-brand-navy flex items-center justify-center pt-24 pb-12 relative overflow-hidden">
             <!-- Background Image with Overlay -->
            <div class="absolute inset-0 z-0 opacity-20">
                <img src="assets/modern.jpg" alt="Login Background" class="w-full h-full object-cover">
            </div>
            <div class="absolute inset-0 bg-brand-navy/80 z-0"></div>

            <div class="max-w-md w-full px-6 relative z-10 reveal reveal-up">
                <div class="p-10 md:p-12 rounded-[3.5rem] glass-card border-white/10 shadow-2xl text-center">
                    <div class="w-20 h-20 rounded-3xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-8 mx-auto">
                        <i class="ph-fill ph-lock-key text-brand-gold text-4xl"></i>
                    </div>
                    <h2 class="text-3xl font-black text-white mb-2 uppercase tracking-tight">Secure Access</h2>
                    <p class="text-white/40 text-sm mb-10 font-bold uppercase tracking-[0.2em]">Borrower Portal 2026</p>

                    <div class="space-y-6 text-left">
                        <div>
                            <label class="block text-[10px] font-black text-brand-gold uppercase tracking-widest mb-3 px-2">Broker Assigned Email</label>
                            <input type="email" placeholder="client@example.com" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-brand-gold/50 outline-none transition-all font-medium">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-brand-gold uppercase tracking-widest mb-3 px-2">Access Key</label>
                            <input type="password" placeholder="••••••••" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-brand-gold/50 outline-none transition-all font-medium">
                        </div>
                        <button onclick="window.submitLogin()" class="w-full py-5 rounded-3xl bg-brand-gold text-brand-navy font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-xl active:scale-95 mt-4">
                            Log In & Authenticate
                        </button>
                    </div>
                    
                    <button onclick="window.togglePortal(false)" class="mt-8 text-white/40 text-xs font-bold hover:text-white transition-colors uppercase tracking-[0.1em]">
                        Cancel & Return to Site
                    </button>
                </div>
            </div>
        </section>
    `;
}

function renderMFA() {
    return `
        <section class="min-h-screen bg-brand-navy flex items-center justify-center pt-24 pb-12 relative overflow-hidden">
             <!-- Background Image with Overlay -->
            <div class="absolute inset-0 z-0 opacity-10">
                <img src="assets/modern.jpg" alt="MFA Background" class="w-full h-full object-cover">
            </div>
            <div class="absolute inset-0 bg-brand-navy/90 z-0"></div>

            <div class="max-w-md w-full px-6 relative z-10 reveal reveal-up">
                <div class="p-10 md:p-12 rounded-[3.5rem] glass-card border-white/10 shadow-2xl text-center">
                    <div class="w-20 h-20 rounded-3xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-8 mx-auto">
                        <i class="phph-device-mobile-speaker text-brand-gold text-4xl animate-bounce"></i>
                    </div>
                    <h2 class="text-3xl font-black text-white mb-2 uppercase tracking-tight">Check Your Phone</h2>
                    <p class="text-white/40 text-sm mb-10 leading-relaxed font-bold uppercase tracking-widest px-4">We've sent a 6-digit verification code to (***) ***-8829</p>

                    <div class="flex justify-center gap-3 mb-10">
                        <input type="text" maxlength="1" value="7" class="w-12 h-16 bg-white/5 border border-white/20 rounded-xl text-2xl font-black text-brand-gold text-center outline-none">
                        <input type="text" maxlength="1" value="4" class="w-12 h-16 bg-white/5 border border-white/20 rounded-xl text-2xl font-black text-brand-gold text-center outline-none focus:border-brand-gold">
                        <input type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-brand-gold rounded-xl text-2xl font-black text-white text-center outline-none">
                        <input type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-white/10 rounded-xl text-2xl font-black text-white text-center outline-none">
                        <input type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-white/10 rounded-xl text-2xl font-black text-white text-center outline-none">
                        <input type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-white/10 rounded-xl text-2xl font-black text-white text-center outline-none">
                    </div>

                    <button onclick="window.verifyMFA()" class="w-full py-5 rounded-3xl bg-brand-gold text-brand-navy font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-xl active:scale-95">
                        Verify Identity
                    </button>
                    
                    <div class="mt-8 flex flex-col gap-4">
                        <button class="text-brand-gold text-xs font-bold uppercase tracking-widest hover:underline">Resend SMS Code</button>
                        <button onclick="window.togglePortal(true)" class="text-white/40 text-xs font-bold hover:text-white transition-colors uppercase tracking-[0.1em]">
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderPortal() {
    return `
        <section class="min-h-screen bg-brand-navy pt-32 pb-24 relative overflow-hidden">
            <!-- Background Image with Overlay -->
            <div class="absolute inset-0 z-0 opacity-20">
                <img src="assets/modern.jpg" alt="Portal Background" class="w-full h-full object-cover">
            </div>
            <div class="absolute inset-0 bg-brand-navy/60 z-0"></div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div class="reveal reveal-right">
                        <div class="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                            <span class="text-brand-gold text-xs font-black uppercase tracking-[0.3em] leading-none">Borrower Portal</span>
                        </div>
                        <h2 class="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">My Home<br><span class="text-hero-accent">Journey</span></h2>
                    </div>
                    <div class="flex items-center gap-4 reveal reveal-left">
                        <button onclick="window.togglePortal(false)" class="px-8 py-3 rounded-full border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2">
                            <i class="ph ph-arrow-left"></i> Back to Site
                        </button>
                        <div class="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy shadow-lg overflow-hidden">
                             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" class="w-full h-full object-cover" alt="User">
                        </div>
                    </div>
                </div>

                <!-- Dashboard Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <!-- Left: Progress & AI Score -->
                    <div class="lg:col-span-2 space-y-8">
                        <!-- Loan Tracker Card -->
                        <div class="group p-8 md:p-12 rounded-[3.5rem] ${loanCompleted ? 'bg-green-500/90 text-white' : 'bg-brand-gold/85 text-brand-navy'} backdrop-blur-xl border-white/20 shadow-2xl reveal reveal-up">
                            <div class="flex items-center justify-between mb-12">
                                <h3 class="text-3xl font-black uppercase tracking-tight">${loanCompleted ? 'Approval Issued' : 'Application Status'}</h3>
                                <span class="px-6 py-2 rounded-full ${loanCompleted ? 'bg-white text-green-600' : 'bg-brand-navy text-brand-gold'} text-sm font-black uppercase tracking-widest">${loanCompleted ? 'Finalized' : 'In Review'}</span>
                            </div>
                            
                            <!-- Tracker Visual -->
                            <div class="relative py-8">
                                <div class="absolute top-1/2 left-0 w-full h-1.5 ${loanCompleted ? 'bg-white/20' : 'bg-brand-navy/10'} -translate-y-1/2 rounded-full"></div>
                                <div class="absolute top-1/2 left-0 ${loanCompleted ? 'w-full' : 'w-3/4'} h-1.5 ${loanCompleted ? 'bg-white' : 'bg-brand-navy'} -translate-y-1/2 rounded-full"></div>
                                
                                <div class="relative flex justify-between">
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="w-8 h-8 rounded-full ${loanCompleted ? 'bg-white text-green-600' : 'bg-brand-navy text-brand-gold'} flex items-center justify-center">
                                            <i class="ph-bold ph-check text-sm"></i>
                                        </div>
                                        <span class="text-[10px] font-black uppercase tracking-tighter">${loanCompleted ? 'Verified' : 'Applied'}</span>
                                    </div>
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="w-8 h-8 rounded-full ${loanCompleted ? 'bg-white text-green-600' : 'bg-brand-navy text-brand-gold'} flex items-center justify-center">
                                             <i class="ph-bold ph-check text-sm"></i>
                                        </div>
                                        <span class="text-[10px] font-black uppercase tracking-tighter">${loanCompleted ? 'Verified' : 'Documented'}</span>
                                    </div>
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="w-8 h-8 rounded-full ${loanCompleted ? 'bg-white text-green-600' : 'bg-brand-navy text-brand-gold'} flex items-center justify-center">
                                             <i class="ph-bold ph-check text-sm"></i>
                                        </div>
                                        <span class="text-[10px] font-black uppercase tracking-tighter">${loanCompleted ? 'Verified' : 'Underwriting'}</span>
                                    </div>
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="w-10 h-10 rounded-full ${loanCompleted ? 'bg-white text-green-600' : 'bg-brand-navy/10 text-brand-navy/30'} border-4 border-brand-navy flex items-center justify-center shadow-lg transform scale-125">
                                             <i class="ph-bold ${loanCompleted ? 'ph-check' : 'ph-lock-key'} text-sm"></i>
                                        </div>
                                        <span class="text-[10px] font-black uppercase tracking-tighter">${loanCompleted ? 'Approved' : 'Approval'}</span>
                                    </div>
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="w-8 h-8 rounded-full ${loanCompleted ? 'bg-white/20' : 'bg-brand-navy/10'} flex items-center justify-center">
                                             <i class="ph ph-house-bold text-sm"></i>
                                        </div>
                                        <span class="text-[10px] font-black uppercase tracking-tighter">${loanCompleted ? 'Funding Ready' : 'Funded'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <p class="mt-12 text-lg ${loanCompleted ? 'text-white/90' : 'text-brand-navy/70'} leading-relaxed font-medium">
                                ${loanCompleted 
                                    ? `Direct verification successful. Your financial data has been synced from **ADP** and **CRA** with 100% data integrity. Your commitment letter is ready.`
                                    : `Our <span class="font-black underline decoration-brand-navy/20">Direct Sync Engine</span> has verified your last 24 months of income. We've synced 70% of your required data. Complete the payroll link to finalize.`
                                }
                            </p>
                        </div>

                        <!-- Document Snap (API-First vs AI) -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div class="group p-8 md:p-10 rounded-[3rem] glass-card border-white/10 hover:border-brand-gold/30 transition-all duration-700 reveal reveal-up">
                                <div class="w-16 h-16 rounded-full bg-brand-navy flex items-center justify-center text-brand-gold mb-8 transform group-hover:rotate-[15deg] transition-transform duration-700">
                                    <i class="ph ph-address-book-fill text-3xl"></i>
                                </div>
                                <h4 class="text-2xl font-black text-white mb-4 uppercase tracking-tight">Payroll Connect</h4>
                                <p class="text-white/60 mb-8 leading-relaxed font-medium">Direct sync with your employer (ADP, Workday, etc.). This ensures 100% accurate, tamper-proof income data.</p>
                                <button onclick="window.startWizard(2)" class="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-brand-gold hover:text-brand-navy transition-all">Connect Payroll</button>
                             </div>

                             <div class="group p-8 md:p-10 rounded-[3rem] glass-card border-white/10 hover:border-brand-gold/30 transition-all duration-700 reveal reveal-up" style="transition-delay: 100ms;">
                                <div class="w-16 h-16 rounded-full bg-brand-navy flex items-center justify-center text-brand-gold mb-8 transform group-hover:rotate-[15deg] transition-transform duration-700">
                                    <i class="ph ph-bank-fill text-3xl"></i>
                                </div>
                                <h4 class="text-2xl font-black text-white mb-4 uppercase tracking-tight">Secure Bank Link</h4>
                                <p class="text-white/60 mb-8 leading-relaxed font-medium">Link your primary bank account (Plaid) for verified down payment and tax verification. No document uploads required.</p>
                                <button onclick="window.startWizard(3)" class="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-brand-gold hover:text-brand-navy transition-all">Link Bank Account</button>
                             </div>
                        </div>
                    </div>

                    <!-- Right: Advisor & Compliance -->
                    <div class="space-y-8">
                        <!-- AI Score Badge -->
                        <div class="p-8 rounded-[3rem] ${loanCompleted ? 'bg-green-500/20 border-green-500/30' : 'bg-brand-slate/30 border-white/10'} backdrop-blur-md reveal reveal-left">
                            <div class="flex flex-col items-center text-center">
                                <div class="relative w-32 h-32 flex items-center justify-center mb-6">
                                    <svg class="w-full h-full -rotate-90">
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" stroke-width="8" fill="transparent" class="text-white/10"></circle>
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" stroke-width="8" fill="transparent" stroke-dasharray="364" stroke-dashoffset="${loanCompleted ? '0' : '109'}" class="${loanCompleted ? 'text-green-500' : 'text-brand-gold'} transition-all duration-1000"></circle>
                                    </svg>
                                    <span class="absolute text-3xl font-black text-white">${loanCompleted ? '100%' : '70%'}</span>
                                </div>
                                <h4 class="text-xl font-black text-white uppercase tracking-wider mb-2">Sync Verification</h4>
                                <p class="text-white/50 text-sm">Verified via Direct Bank & Payroll API Integrations</p>
                            </div>
                        </div>

                         <!-- Advisor Card -->
                        <div class="p-8 rounded-[3rem] glass-card border-white/10 reveal reveal-left" style="transition-delay: 100ms;">
                            <h4 class="text-lg font-black text-brand-gold uppercase tracking-[0.2em] mb-8">Your Lead Expert</h4>
                            <div class="flex items-center gap-4 mb-8">
                                <div class="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center overflow-hidden border-2 border-brand-gold/20">
                                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop" class="w-full h-full object-cover" alt="Advisor">
                                </div>
                                <div>
                                    <div class="text-white font-black text-lg leading-none mb-1">Juthi Akhy</div>
                                    <div class="text-brand-gold text-xs font-bold uppercase tracking-widest">Master Broker</div>
                                </div>
                            </div>
                            <button class="w-full py-4 rounded-2xl bg-brand-gold text-brand-navy font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg active:scale-95">Message Advisor</button>
                        </div>

                        <!-- Compliance Badge -->
                        <div class="p-8 rounded-[3rem] bg-brand-navy/50 border border-white/5 reveal reveal-left" style="transition-delay: 200ms;">
                             <div class="flex items-center gap-3 text-white/40 mb-2">
                                <i class="ph ph-shield-check-fill text-brand-gold"></i>
                                <span class="text-[10px] font-bold uppercase tracking-[0.2em]">Automated Compliance</span>
                             </div>
                             <p class="text-[10px] text-white/20 uppercase tracking-tighter leading-tight">
                                TRID, HMDA, and State-Level regulatory monitoring active. All data encrypted via 256-bit AES protocol.
                             </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    `;
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
        <header class="relative min-h-screen flex items-start lg:items-center pt-12 sm:pt-44 pb-12 sm:pb-24 bg-brand-navy">
            <!-- Background Image with Overlay -->
            <div class="absolute inset-0 z-0">
                <img src="assets/modern.jpg" alt="Home background" class="w-full h-full object-cover opacity-40">
                <div class="absolute inset-0 bg-brand-navy/60"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-brand-navy via-transparent to-brand-navy"></div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-16 sm:pt-0">
                <div class="grid grid-cols-1 xl:grid-cols-12 gap-16 items-center">
                    <!-- Left: Content -->
                    <div class="xl:col-span-7 text-center xl:text-left reveal reveal-left">
                        <!-- Mobile-only Circular Headshot -->
                        <div class="flex justify-center xl:justify-start mb-8 sm:mb-10 xl:hidden">
                            <div class="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full border-4 border-brand-gold shadow-[0_20px_50px_-10px_rgba(211,189,115,0.4)] overflow-hidden bg-brand-navy ring-4 ring-white/10">
                                <img src="${agentConfig.agent.photoUrl}" alt="${agentConfig.agent.name}" class="w-full h-full object-cover object-top">
                            </div>
                        </div>
                        <div class="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-8 reveal reveal-up">
                            <span class="text-brand-gold text-xs font-black uppercase tracking-[0.3em] leading-none">Expert Mortgage Guidance</span>
                        </div>
                        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tight font-extrabold text-white reveal reveal-up mb-10">
                            <span class="block">Your Path to</span>
                            <span class="text-hero-accent">Homeownership</span>
                            <span class="block mt-2">Starts Here<span class="text-brand-gold">.</span></span>
                        </h1>
                        <p class="mt-4 sm:mt-8 text-base sm:text-lg md:text-xl lg:text-3xl text-white/90 max-w-3xl mx-auto xl:mx-0 font-medium leading-relaxed mb-8 sm:mb-16 reveal reveal-up" style="transition-delay: 200ms;">
                            ${agentConfig.agent.fullBio}
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center xl:justify-start items-center">
                            <a class="w-full sm:w-auto flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 border border-transparent text-base sm:text-xl font-bold rounded-xl text-brand-navy bg-brand-gold hover:bg-white transform hover:scale-105 transition-all shadow-[0_20px_50px_-10px_rgba(211,189,115,0.4)]" href="#booking">
                                Book a Consultation
                            </a>
                            <a class="w-full sm:w-auto flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 border-2 border-white/30 backdrop-blur-sm text-base sm:text-xl font-bold rounded-xl text-white bg-white/10 hover:bg-white hover:text-brand-navy transform hover:scale-105 transition-all" href="#services">
                                Our Services
                            </a>
                        </div>
                    </div>

                    <!-- Right: Profile Card (Desktop Only) -->
                    <div class="hidden xl:flex xl:col-span-5 justify-center xl:justify-end reveal reveal-right" style="transition-delay: 200ms;">
                        <div class="w-[340px] glass-card p-3 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/20 backdrop-blur-2xl bg-white/5">
                            <div class="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden">
                                <img src="${agentConfig.agent.photoUrl}" alt="${agentConfig.agent.name}" class="w-full h-full object-cover object-top">
                                <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent"></div>
                                <div class="absolute bottom-8 left-0 right-0 text-center px-6">
                                    <p class="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] mb-2">Expert Guidance</p>
                                    <p class="text-white text-3xl font-black tracking-tight">${agentConfig.agent.name}</p>
                                </div>
                            </div>
                        </div>
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
        <section class="py-16 sm:py-32 bg-rich text-white overflow-hidden" id="about">
            <img src="assets/helena.jpg" alt="Homeownership lifestyle" class="bg-rich-image opacity-40" loading="lazy">
            <div class="absolute inset-0 bg-brand-navy/60"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-brand-navy via-transparent to-brand-navy"></div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-20 items-center">
                    <!-- Left Column - Stats & Info -->
                    <div class="order-2 lg:order-1 lg:col-span-1 reveal reveal-right">
                        <div class="glass-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/10 shadow-2xl bg-brand-navy/60 backdrop-blur-3xl">
                            <div class="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                                <span class="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] leading-none">Our Mission</span>
                            </div>
                            <h2 class="text-3xl sm:text-5xl font-black mb-6 sm:mb-8 text-brand-gold tracking-tight leading-tight">${about.title}</h2>
                            <div class="space-y-4 sm:space-y-6 text-white/60 mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed">
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
                            <div class="relative w-64 h-[24rem] sm:w-80 sm:h-[32rem] lg:w-[26rem] lg:h-[36rem] overflow-hidden rounded-[3rem] sm:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(15,30,46,0.4)] border-[8px] sm:border-[12px] border-white backdrop-blur-md bg-white/40">
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
                        <div class="glass-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/10 bg-brand-navy/60 backdrop-blur-3xl shadow-2xl">
                            <h2 class="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 text-brand-gold tracking-tight leading-tight">${about.meetBroker.title}</h2>
                            <div class="relative mb-10">
                                <i class="ph ph-quotes absolute -left-8 -top-8 text-6xl text-brand-gold/10"></i>
                                <p class="text-xl italic font-semibold text-white/90 leading-relaxed">
                                    ${about.meetBroker.quote}
                                </p>
                            </div>
                            <p class="text-white/60 leading-relaxed mb-10 text-lg">
                                ${about.meetBroker.description}
                            </p>
                            <a href="${about.meetBroker.linkUrl}" class="inline-flex items-center px-8 py-4 rounded-full bg-brand-gold text-brand-navy font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 group">
                                ${about.meetBroker.linkText}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            ${renderDivider('curve', 'fill-brand-navy')}
        </section>
    `;
}

function renderServices() {
    return `
        <section class="py-16 sm:py-32 bg-rich relative overflow-hidden" id="services">
            <img src="assets/puzzle.jpg" alt="Consultation background" class="bg-rich-image opacity-40" loading="lazy">
            <div class="absolute inset-0 bg-brand-navy/60"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-brand-navy via-transparent to-brand-navy"></div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-center mb-24 reveal reveal-up">
                    <div class="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                        <span class="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] leading-none">Our Expertise</span>
                    </div>
                    <h2 class="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">Comprehensive<br><span class="text-hero-accent">Financing Solutions</span></h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    ${agentConfig.services.map((service, index) => `
                        <div class="group p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] glass-card border-white/10 hover:border-brand-gold/30 transition-all duration-700 reveal ${index % 2 === 0 ? 'reveal-right' : 'reveal-left'}">
                            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
                                <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/50 flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(211,189,115,0.4)] transform group-hover:rotate-[10deg] transition-transform duration-700">
                                    <i class="ph ph-${service.icon} text-3xl sm:text-4xl"></i>
                                </div>
                                <div class="flex-grow">
                                    <h3 class="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 group-hover:text-brand-gold transition-colors">${service.title}</h3>
                                    <p class="text-white/60 text-lg leading-relaxed mb-8">${service.description}</p>
                                    
                                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                        ${service.details ? service.details.map(detail => `
                                            <li class="flex items-center text-sm font-medium text-white/80">
                                                <div class="w-2 h-2 rounded-full bg-brand-gold mr-3 shadow-[0_0_10px_rgba(211,189,115,0.8)]"></div>
                                                ${detail}
                                            </li>
                                        `).join('') : ''}
                                    </ul>
                                    
                                    <a class="inline-flex items-center text-sm font-black text-brand-gold uppercase tracking-widest hover:text-white transition-all group/btn" href="#contact">
                                        Explore Scope 
                                        <div class="ml-3 w-8 h-[2px] bg-brand-gold transform group-hover/btn:w-12 transition-all"></div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}



function renderBooking() {
    return `
        <section class="py-32 bg-brand-navy relative overflow-hidden" id="booking">
            <img src="assets/arch.jpg" alt="Booking background" class="bg-rich-image opacity-40" loading="lazy">
            <div class="absolute inset-0 bg-brand-navy/60"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-brand-navy via-transparent to-brand-navy"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="lg:flex lg:items-center lg:justify-between gap-12">
                    <div class="lg:w-1/2 mb-16 lg:mb-0 reveal reveal-right flex flex-col h-full">
                        <div class="group p-10 md:p-14 rounded-[3rem] bg-brand-gold/85 backdrop-blur-xl border-brand-gold/20 hover:border-brand-navy/30 shadow-[0_40px_80px_-15px_rgba(211,189,115,0.3)] transition-all duration-700 h-full flex flex-col">
                            <div>
                                <div class="inline-block px-4 py-1.5 rounded-full bg-brand-navy/10 border border-brand-navy/20 mb-6">
                                    <span class="text-brand-navy text-xs font-black uppercase tracking-[0.3em] leading-none">Consultation</span>
                                </div>
                                <h3 class="text-5xl md:text-6xl font-black text-brand-navy mb-8 tracking-tight leading-tight group-hover:opacity-80 transition-opacity">Expert Guidance<br><span class="text-hero-accent !text-brand-navy">One Click Away</span></h3>
                                <p class="text-xl text-brand-navy/70 mb-12 leading-relaxed font-medium">
                                    Pick a time that works for you. Our expert consultants are ready to walk you through your options, answer your questions, and help you build a clear path to homeownership. 
                                </p>
                            </div>
                            <div class="space-y-10">
                                <div class="flex items-center group/item reveal reveal-up">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(15,30,46,0.2)] transform group-hover/item:rotate-[10deg] transition-transform duration-700 relative">
                                        <div class="absolute inset-0 rounded-full bg-brand-navy animate-pulse opacity-10"></div>
                                        <i class="ph ph-calendar-check text-4xl text-brand-gold relative z-10"></i>
                                    </div>
                                    <div class="ml-8">
                                        <span class="text-lg font-black text-brand-navy uppercase tracking-wider">Free 15-minute Discovery Call</span>
                                    </div>
                                </div>
                                <div class="flex items-center group/item reveal reveal-up" style="transition-delay: 100ms;">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(15,30,46,0.2)] transform group-hover/item:rotate-[10deg] transition-transform duration-700 relative">
                                        <div class="absolute inset-0 rounded-full bg-brand-navy animate-pulse opacity-10"></div>
                                        <i class="ph ph-shield-check text-4xl text-brand-gold relative z-10"></i>
                                    </div>
                                    <div class="ml-8">
                                        <span class="text-lg font-black text-brand-navy uppercase tracking-wider">No obligation, just expert advice</span>
                                    </div>
                                </div>
                                <div class="flex items-center group/item reveal reveal-up" style="transition-delay: 200ms;">
                                    <div class="flex-shrink-0 w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center text-brand-navy shadow-[0_20px_40px_-10px_rgba(15,30,46,0.2)] transform group-hover/item:rotate-[10deg] transition-transform duration-700 relative">
                                        <div class="absolute inset-0 rounded-full bg-brand-navy animate-pulse opacity-10"></div>
                                        <i class="ph ph-chat-text text-4xl text-brand-gold relative z-10"></i>
                                    </div>
                                    <div class="ml-8">
                                        <span class="text-lg font-black text-brand-navy uppercase tracking-wider">Get your questions answered live</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lg:w-1/2 reveal reveal-left">
                        <div class="group p-6 rounded-[3rem] bg-brand-gold/85 backdrop-blur-xl border-brand-gold/20 hover:border-brand-navy/30 transition-all duration-700 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] min-h-[600px] relative overflow-hidden">
                           
                            <div class="calendly-inline-widget relative z-10" data-url="${agentConfig.contact.bookingWidgetUrl}?hide_landing_page_details=1&hide_gdpr_banner=1" style="min-width:320px;height:600px;"></div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderTestimonials() {
    return `
        <section class="py-24 overflow-hidden bg-brand-navy/90 glass-section relative" id="testimonials">
            ${renderDivider('curve', 'fill-brand-navy')}
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <img src="assets/house.jpg" alt="Contact background" class="bg-rich-image opacity-40">
            <div class="absolute inset-0 bg-brand-navy/60"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-brand-navy via-transparent to-brand-navy"></div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-center mb-24 reveal reveal-up">
                    <div class="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                        <span class="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] leading-none">Get Started</span>
                    </div>
                    <h2 class="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">Secure Your<br><span class="text-hero-accent">Free Quote Today</span></h2>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- Contact Info Card -->
                    <div class="group p-10 md:p-14 rounded-[3rem] glass-card border-white/10 hover:border-brand-gold/30 transition-all duration-700 reveal reveal-right flex flex-col justify-between">
                        <div>
                            <h3 class="text-4xl font-black text-white mb-6 tracking-tight leading-tight group-hover:text-brand-gold transition-colors">Direct Access to<br><span class="text-brand-gold">Expert Advice</span></h3>
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
                                    Direct Underwriter Access
                                </li>
                            </ul>
                            
                            <a class="inline-flex items-center text-sm font-black text-brand-gold uppercase tracking-widest hover:text-white transition-all group/btn" href="mailto:${agentConfig.contact.email}">
                                Send Message 
                                <div class="ml-3 w-8 h-[2px] bg-brand-gold transform group-hover/btn:w-12 transition-all"></div>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Form Card -->
                    <div class="group p-10 md:p-14 rounded-[3rem] glass-card border-white/10 hover:border-brand-gold/30 transition-all duration-700 reveal reveal-left">
                        <form action="#" class="grid grid-cols-1 gap-y-6" onsubmit="event.preventDefault(); alert('Request sent!');">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-black text-brand-gold uppercase tracking-widest mb-2 px-1">First Name</label>
                                    <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold" type="text" placeholder="John" required/>
                                </div>
                                <div>
                                    <label class="block text-sm font-black text-brand-gold uppercase tracking-widest mb-2 px-1">Last Name</label>
                                    <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold" type="text" placeholder="Doe" required/>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-black text-brand-gold uppercase tracking-widest mb-2 px-1">Email Address</label>
                                <input class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold" type="email" placeholder="john@example.com" required/>
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
                    <a class="text-white/60 hover:text-white text-2xl" href="${agentConfig.social.x}" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X"><i class="ph ph-x-logo"></i></a>
                    <a class="text-white/60 hover:text-white text-2xl" href="${agentConfig.social.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram"><i class="ph ph-instagram-logo"></i></a>
                    <a class="text-white/60 hover:text-white text-2xl" href="${agentConfig.social.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn"><i class="ph ph-linkedin-logo"></i></a>
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
