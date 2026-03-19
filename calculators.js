// calculators.js

const LTT_LOCATIONS = [
    'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Ottawa, ON', 'Edmonton, AB',
    'Winnipeg, MB', 'Mississauga, ON', 'Brampton, ON', 'Hamilton, ON', 'Surrey, BC', 'Laval, QC',
    'Halifax, NS', 'London, ON', 'Markham, ON', 'Vaughan, ON', 'Gatineau, QC', 'Saskatoon, SK',
    'Kitchener, ON', 'Longueuil, QC', 'Burnaby, BC', 'Windsor, ON', 'Regina, SK', 'Oakville, ON',
    'Richmond, BC', 'Richmond Hill, ON', 'Burlington, ON', 'Oshawa, ON', 'Sherbrooke, QC',
    'Greater Sudbury, ON', 'Abbotsford, BC', 'Lévis, QC', 'Coquitlam, BC', 'Barrie, ON',
    'Saguenay, QC', 'Kelowna, BC', 'Guelph, ON', 'Terrebonne, QC', 'Whitby, ON', 'Kingston, ON',
    'Milton, ON', 'Langley, BC', 'Ajax, ON', 'Saint John, NB', 'Charlottetown, PE', 'St. John\'s, NL',
    'Yellowknife, NT', 'Whitehorse, YT', 'Iqaluit, NU'
];

const LTT_RATES = {
    'ON': {
        prov: [
            { threshold: 55000, rate: 0.005 },
            { threshold: 250000, rate: 0.01 },
            { threshold: 400000, rate: 0.015 },
            { threshold: 2000000, rate: 0.02 },
            { threshold: Infinity, rate: 0.025 }
        ]
    },
    'BC': {
        prov: [
            { threshold: 200000, rate: 0.01 },
            { threshold: 2000000, rate: 0.02 },
            { threshold: 3000000, rate: 0.03 },
            { threshold: Infinity, rate: 0.05 } // For amounts over 3M
        ]
    },
    'AB': { prov: [] }, // No provincial LTT
    'MB': {
        prov: [
            { threshold: 30000, rate: 0 },
            { threshold: 90000, rate: 0.005 },
            { threshold: 150000, rate: 0.01 },
            { threshold: 250000, rate: 0.015 },
            { threshold: 500000, rate: 0.02 },
            { threshold: Infinity, rate: 0.02 } // Max rate is 2%
        ]
    },
    'NB': { prov: [{ threshold: Infinity, rate: 0.01 }] }, // 1% of fair market value
    'NL': {
        prov: [
            { threshold: 100, rate: 0.004 }, // Minimum fee $100
            { threshold: 500, rate: 0.004 },
            { threshold: Infinity, rate: 0.004 } // 0.4%
        ]
    },
    'NS': { prov: [{ threshold: Infinity, rate: 0.015 }] }, // 1.5%
    'PE': {
        prov: [
            { threshold: 30000, rate: 0 },
            { threshold: 200000, rate: 0.01 },
            { threshold: Infinity, rate: 0.01 } // 1%
        ]
    },
    'QC': {
        prov: [ // "Welcome Tax" - municipal, but provincial framework
            { threshold: 58910, rate: 0.005 },
            { threshold: 294549, rate: 0.01 },
            { threshold: 589098, rate: 0.015 },
            { threshold: 1178196, rate: 0.02 },
            { threshold: Infinity, rate: 0.025 } // Varies by municipality for higher tiers
        ]
    },
    'SK': { prov: [] }, // No provincial LTT
    'YT': { prov: [{ threshold: Infinity, rate: 0.005 }] }, // 0.5%
    'NT': { prov: [{ threshold: Infinity, rate: 0.01 }] }, // 1%
    'NU': { prov: [{ threshold: Infinity, rate: 0.01 }] } // 1%
};

function getScenarioSelectorHTML(type) {
    return `
        <div class="scenario-selector-mobile lg:hidden">
            ${[...Array(4)].map((_, i) => `
                <button class="scenario-btn-mobile ${i === 0 ? 'active' : ''}" 
                        onclick="window.switchScenario('${type}', ${i})" 
                        id="${type}-btn-${i}">
                    Plan ${i + 1}
                </button>
            `).join('')}
        </div>
    `;
}

function getAffordabilityCalculatorHTML() {
    let amortOptions = '';
    for(let i=1; i<=30; i++) {
        amortOptions += `<option value="${i}" ${i === 25 ? 'selected' : ''}>${i}-year</option>`;
    }

    return `
        <div class="aff-calculator">
            <div class="aff-header" style="padding: 20px 0; border-bottom: 1.5px solid var(--color-primary); margin-bottom: 2.5rem;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="ph ph-shield-check-fill text-brand-gold text-2xl"></i>
                    <span style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; color: var(--color-navy); letter-spacing: -0.02em;">Maximum Affordability Analysis</span>
                    <i class="ph ph-caret-right" style="margin-left: auto; color: var(--color-primary);"></i>
                </div>
            </div>

            <!-- Annual Income -->
            <div class="aff-row">
                <div class="aff-label-col">
                    <div class="flex items-center mb-1">
                        <i class="ph ph-identification-card text-brand-navy/30 mr-2 text-xl"></i>
                        <span class="aff-row-title" style="font-family: 'Outfit', sans-serif;">Annual Income</span>
                    </div>
                    <p class="aff-row-desc">Your gross income before-tax, including bonuses and supplementary income.</p>
                </div>
                <div class="aff-input-col">
                    <div class="calc-input-wrapper with-symbol mb-3">
                        <span class="symbol"><i class="ph ph-wallet"></i></span>
                        <input type="text" inputmode="numeric" id="aff-inc-1" class="calc-input" placeholder="Your annual income">
                    </div>
                    <div class="calc-input-wrapper with-symbol">
                        <span class="symbol"><i class="ph ph-plus-circle"></i></span>
                        <input type="text" inputmode="numeric" id="aff-inc-2" class="calc-input" placeholder="Co-applicant (Optional)">
                    </div>
                </div>
            </div>

            <!-- Down payment -->
            <div class="aff-row">
                <div class="aff-label-col">
                    <span class="aff-row-title">Down payment</span>
                    <i class="ph ph-question info-icon"></i>
                </div>
                <div class="aff-input-col">
                    <div class="calc-input-wrapper with-symbol">
                        <span class="symbol">$</span>
                        <input type="text" inputmode="numeric" id="aff-dp" class="calc-input outlined-soft" placeholder="Enter amount">
                    </div>
                </div>
            </div>

            <!-- Maximum amortization -->
            <div class="aff-row">
                <div class="aff-label-col">
                    <span class="aff-row-title">Maximum amortization</span>
                    <i class="ph ph-question info-icon"></i>
                </div>
                <div class="aff-input-col">
                    <div class="calc-input-wrapper with-symbol">
                        <span class="symbol"><i class="ph ph-calendar"></i></span>
                        <select id="aff-amort" class="calc-input outlined-soft" style="appearance: none; background: transparent; width: 100%; border: none; outline: none;">
                            ${amortOptions}
                        </select>
                        <i class="ph ph-caret-down absolute right-4 text-brand-navy/30 pointer-events-none"></i>
                    </div>
                </div>
            </div>

            <!-- Location -->
            <div class="aff-row">
                <div class="aff-label-col">
                    <span class="aff-row-title">Location of your future home</span>
                </div>
                <div class="aff-input-col">
                    <div class="calc-input-wrapper with-symbol">
                        <span class="symbol"><i class="ph ph-map-pin"></i></span>
                        <input type="text" id="aff-loc" class="calc-input outlined-soft" value="Toronto, ON">
                    </div>
                </div>
            </div>

            <!-- Living costs -->
            <div class="aff-row">
                <div class="aff-label-col">
                    <span class="aff-row-title">Living costs of your future home</span>
                    <i class="ph ph-question info-icon"></i>
                    <p class="aff-row-desc"><i>(Optional)</i><br>If you don't know these costs, leave the fields blank and we will estimate for you.</p>
                </div>
                <div class="aff-input-col">
                    <div class="calc-input-wrapper with-symbol mb-2">
                        <span class="symbol"><i class="ph ph-buildings"></i></span>
                        <input type="text" inputmode="numeric" id="aff-tax" class="calc-input outlined-soft" placeholder="Annual property tax">
                    </div>
                    <div class="calc-input-wrapper with-symbol mb-2">
                        <span class="symbol"><i class="ph ph-house-line"></i></span>
                        <input type="text" inputmode="numeric" id="aff-condo" class="calc-input outlined-soft" placeholder="Monthly condo fees">
                    </div>
                    <div class="calc-input-wrapper with-symbol">
                        <span class="symbol"><i class="ph ph-thermometer-hot"></i></span>
                        <input type="text" inputmode="numeric" id="aff-heat" class="calc-input outlined-soft" placeholder="Monthly heating costs">
                    </div>
                </div>
            </div>

            <!-- Debt payments -->
            <div class="aff-row" style="border-bottom: none;">
                <div class="aff-label-col">
                    <span class="aff-row-title">Debt payments</span>
                    <i class="ph ph-question info-icon"></i>
                    <p class="aff-row-desc"><i>(Optional)</i><br>Enter debt payments if applicable. If you have none, you can leave blank.</p>
                </div>
                <div class="aff-input-col">
                    <div class="calc-input-wrapper with-symbol mb-2">
                        <span class="symbol"><i class="ph ph-credit-card"></i></span>
                        <input type="text" inputmode="numeric" id="aff-cc" class="calc-input outlined-soft" placeholder="Credit card debt payment">
                    </div>
                    <div class="calc-input-wrapper with-symbol mb-2">
                        <span class="symbol"><i class="ph ph-car"></i></span>
                        <input type="text" inputmode="numeric" id="aff-car" class="calc-input outlined-soft" placeholder="Car payment">
                    </div>
                    <div class="calc-input-wrapper with-symbol">
                        <span class="symbol"><i class="ph ph-money"></i></span>
                        <input type="text" inputmode="numeric" id="aff-loan" class="calc-input outlined-soft" placeholder="Other loan expenses">
                    </div>
                </div>
            </div>

            <!-- Results Banner -->
            <div class="aff-results-banner glass-card" style="padding: 35px; border-radius: 2rem; margin-top: 30px; text-align: center; background: rgba(15, 30, 46, 0.05); border: 1.5px solid var(--color-primary);">
                <div class="flex items-center justify-center gap-3 mb-3">
                    <i class="ph ph-crown-simple text-brand-gold text-2xl"></i>
                    <h4 style="color: var(--color-navy); margin: 0; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.1em;">Maximum Affordable Home Price</h4>
                </div>
                <div id="aff-max-price" class="text-4xl sm:text-5xl md:text-6xl text-gold-elite font-black tracking-tighter" style="line-height: 1;"><span class="skeleton-shimmer">$-</span></div>
                
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px; font-size: 1rem; color: var(--color-navy); font-weight: 600;">
                    <div class="flex items-center gap-2">
                        <i class="ph ph-chart-line-up text-brand-gold"></i>
                        Monthly Payment: <span id="aff-max-payment" class="text-gold-elite"><span class="skeleton-shimmer">$-</span></span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getLandTransferTaxCalculatorHTML() {
    return `
            <div class="ltt-calculator">
                <div class="ltt-top-row" style="display: flex; gap: 20px; margin-bottom: 25px;">
                    <div class="calc-cell calc-span-4" style="flex: 1;">
                        <div class="calc-input-wrapper with-symbol">
                            <label class="floating-label flex items-center gap-2">
                                 <i class="ph ph-tag-silver text-[10px]"></i> Price
                                 <i class="ph ph-question tooltip-trigger" data-tip="The purchase price of the property."></i>
                            </label>
                            <span class="symbol">$</span>
                            <input type="text" inputmode="numeric" id="ltt-price" placeholder="e.g. 800,000" class="calc-input fw-bold text-navy">
                        </div>
                    </div>
                    <div class="calc-cell calc-span-4" style="flex: 1;">
                        <div class="calc-input-wrapper with-symbol">
                            <label class="floating-label flex items-center gap-1">
                                <i class="ph ph-map-pin text-[10px]"></i> Location
                                <i class="ph ph-question tooltip-trigger" data-tip="Toronto has its own municipal land transfer tax in addition to the provincial tax."></i>
                            </label>
                            <span class="symbol"><i class="ph ph-map-pin"></i></span>
                            <input type="text" id="ltt-location" value="Toronto, ON" class="calc-input text-navy" placeholder="City or Province">
                            <div id="ltt-location-results" class="calc-autocomplete-results"></div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-6 mb-8">
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative flex items-center justify-center">
                            <input type="checkbox" id="ltt-ftb" class="peer hidden">
                            <div class="w-6 h-6 border-2 border-brand-navy/20 rounded-md peer-checked:bg-brand-gold peer-checked:border-brand-gold transition-all"></div>
                            <i class="ph ph-check absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                        </div>
                        <span class="text-sm font-bold text-brand-navy/70 group-hover:text-brand-navy transition-colors">I'm a first time home buyer</span>
                    </label>

                    <label id="ltt-new-home-wrapper" class="flex items-center gap-3 cursor-pointer group" style="display: none;">
                        <div class="relative flex items-center justify-center">
                            <input type="checkbox" id="ltt-new-home" class="peer hidden">
                            <div class="w-6 h-6 border-2 border-brand-navy/20 rounded-md peer-checked:bg-brand-gold peer-checked:border-brand-gold transition-all"></div>
                            <i class="ph ph-check absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                        </div>
                        <span class="text-sm font-bold text-brand-navy/70 group-hover:text-brand-navy transition-colors">I'm buying a newly built home</span>
                    </label>
                </div>

                <div class="ltt-results-box glass-card p-8 rounded-[2rem] border-brand-navy/10 bg-brand-navy/5">
                    <div class="flex flex-col gap-4 mb-8">
                        <div class="flex justify-between items-center text-sm font-bold text-brand-navy/60">
                            <div class="flex items-center gap-2">
                                <span>Provincial</span>
                                <i class="ph ph-question tooltip-trigger" data-tip="Land transfer tax paid to the province."></i>
                            </div>
                            <span id="ltt-prov">$0</span>
                        </div>
                        <div id="ltt-muni-row" class="flex justify-between items-center text-sm font-bold text-brand-navy/60">
                            <div class="flex items-center gap-2">
                                <span class="text-brand-navy/30">+</span>
                                <span>Municipal</span>
                                <i class="ph ph-question tooltip-trigger" data-tip="Land transfer tax paid to the municipality (e.g., Toronto)."></i>
                            </div>
                            <span id="ltt-muni">$0</span>
                        </div>
                        <div id="ltt-rebate-row" class="flex justify-between items-center text-sm font-bold text-brand-navy/60">
                            <div class="flex items-center gap-2">
                                <span class="text-brand-gold">-</span>
                                <span>Rebate</span>
                                <i class="ph ph-question tooltip-trigger" data-tip="Available rebates for first-time buyers or other exemptions."></i>
                            </div>
                            <span id="ltt-rebate" class="text-brand-gold">$0</span>
                        </div>
                    </div>
                    
                    <div class="pt-6 border-t border-brand-navy/10 flex justify-between items-center">
                        <div class="flex items-center gap-2 text-brand-navy font-black text-lg">
                            <span class="text-brand-navy/30">=</span>
                            <span>Land transfer tax</span>
                        </div>
                        <span id="ltt-total" class="text-3xl font-black text-brand-navy">$0</span>
                    </div>
                </div>
            </div>
    `;
}

function getRefinanceCalculatorHTML() {
    return `
        <div id="calc-refinance">
            ${getScenarioSelectorHTML('ref')}
            <div class="calc-scroll-wrapper">
                <div class="calc-grid payment-grid">
                    <!-- Row 1: Start Here -->
                    <div class="calc-cell label-cell" style="display:flex;align-items:center;">
                        <i class="ph ph-house-line text-brand-gold text-xl mr-3"></i>
                        <div>
                            <span style="font-weight:700;">Mortgage Amount</span>
                            <span class="label-sub">How much do you need to borrow?</span>
                        </div>
                    </div>
                    <div class="calc-cell calc-span-4">
                        <div class="calc-input-wrapper with-symbol">
                            <label class="floating-label">Refinance Amount</label>
                            <span class="symbol">$</span>
                            <input type="text" inputmode="numeric" id="ref-amount" class="calc-input text-navy" placeholder="e.g. 500,000">
                        </div>
                    </div>

                    <div class="calc-divider calc-span-5"></div>

                    <!-- Header Row - Desktop Only -->
                    <div class="calc-cell mobile-hide"></div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell mobile-hide text-center py-4" data-type="ref" data-scenario="${i}">
                            <span class="scenario-header-tag">Plan ${i + 1}</span>
                        </div>
                    `).join('')}

                    <!-- Row 2: Amortization -->
                    <div class="calc-cell label-cell flex items-center">
                        <i class="ph ph-calendar text-brand-navy/30 text-xl mr-3"></i>
                        <div class="calc-cell label-cell">
                        <span>Amortization</span>
                        <i class="ph ph-question tooltip-trigger" data-tip="The total length of time it takes to pay off the mortgage in full. Typically 25 or 30 years."></i>
                        <span class="label-sub">Total years to pay off loan</span>
                    </div>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell ${i > 0 ? 'mobile-hide' : ''}" data-type="ref" data-scenario="${i}">
                            <select class="calc-input" id="ref-amort-${i}">
                                <option value="25">25-year</option>
                                <option value="30">30-year</option>
                            </select>
                        </div>
                    `).join('')}

                    <!-- Row 3: Mortgage rate -->
                    <div class="calc-cell label-cell flex items-center">
                        <i class="ph ph-percent text-brand-navy/30 text-xl mr-3"></i>
                        <div class="calc-cell label-cell">
                        <span>Mortgage rate</span>
                        <i class="ph ph-question tooltip-trigger" data-tip="The annual interest rate charged by the lender. Fixed or variable options available."></i>
                        <span class="label-sub">Current annual interest rate</span>
                    </div>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell ${i > 0 ? 'mobile-hide' : ''}" data-type="ref" data-scenario="${i}">
                            <div class="calc-input-wrapper">
                                <input type="text" inputmode="numeric" class="calc-input" id="ref-rate-${i}" placeholder="e.g. 4.5">
                            </div>
                        </div>
                    `).join('')}

                    <!-- Row 4: Payment frequency -->
                    <div class="calc-cell label-cell flex items-center">
                        <i class="ph ph-clock text-brand-navy/30 text-xl mr-3"></i>
                        <div>
                            <span>Payment Frequency</span>
                            <span class="label-sub">How often you pay</span>
                        </div>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell ${i > 0 ? 'mobile-hide' : ''}" data-type="ref" data-scenario="${i}">
                            <select class="calc-input" id="ref-freq-${i}">
                                <option value="monthly">Monthly</option>
                                <option value="biweekly">Bi-weekly</option>
                            </select>
                        </div>
                    `).join('')}

                    <!-- Row 5: Mortgage payment -->
                    <div class="calc-cell label-cell highlight-row border-bottom-0 flex items-center">
                        <i class="ph ph-equals text-brand-gold text-xl mr-3"></i>
                        <div>
                            <span class="text-brand-navy">Mortgage Payment</span>
                            <span class="label-sub">Estimated monthly total</span>
                        </div>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell highlight-row calc-readonly text-gold-elite border-bottom-0 ${i > 0 ? 'mobile-hide' : ''}" data-type="ref" data-scenario="${i}" id="ref-payment-${i}"><span class="skeleton-shimmer">$-</span></div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Sticky Result Bar (Mobile Only) -->
            <div class="sticky-result-bar lg:hidden" id="ref-sticky">
                <div class="flex items-center justify-between w-full">
                    <div class="flex flex-col">
                        <span class="sticky-label" id="ref-sticky-label">Plan 1 Payment</span>
                        <span class="sticky-value" id="ref-sticky-val"><span class="skeleton-shimmer">$-</span></span>
                    </div>
                    <button onclick="downloadPDF('refinance')" class="bg-brand-gold text-brand-navy p-3 rounded-xl shadow-lg">
                        <i class="ph ph-file-pdf text-xl"></i>
                    </button>
                </div>
            </div>
            
            <div class="calc-collapsible-list" style="margin-top: 2rem;">
                <div class="calc-collapsible disabled">Monthly expenses</div>
                <div class="calc-collapsible disabled">Interest rate risk</div>
                <div class="calc-collapsible disabled">Amortization schedule</div>
            </div>

            <!-- Elite Features: Visuals & Export -->
            <div class="calc-elite-section mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div class="glass-card p-6 md:p-8 rounded-[2.5rem] border-brand-navy/5 bg-brand-navy/5 shadow-inner">
                    <h4 class="text-xl font-black mb-6 flex items-center gap-3">
                        <i class="ph ph-chart-pie text-brand-gold"></i>
                        Visual Analysis
                    </h4>
                    <div class="relative w-full min-h-[320px] max-w-[400px] mx-auto">
                        <canvas id="refinanceChart"></canvas>
                    </div>
                    <p class="text-center text-[10px] text-brand-navy/40 mt-6 font-bold uppercase tracking-[0.2em]" id="ref-chart-label">Principal vs Total Interest (Plan 1)</p>
                </div>
                
                <div class="flex flex-col gap-6">
                    <div class="glass-card p-8 rounded-[2.5rem] border-brand-navy/5 bg-brand-navy/5">
                        <h4 class="text-xl font-black mb-6 flex items-center gap-3">
                            <i class="ph ph-file-pdf text-brand-gold"></i>
                            Professional Report
                        </h4>
                        <p class="text-sm text-brand-navy/60 mb-8 leading-relaxed">Download a branded PDF summary of your refinance scenarios to review with your advisor.</p>
                        <button onclick="downloadPDF('refinance')" class="w-full bg-brand-navy text-white font-black py-4 rounded-2xl hover:bg-brand-gold hover:text-brand-navy transition-all shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                            <i class="ph ph-download-simple"></i>
                            Download PDF Report
                        </button>
                    </div>

                    <div class="glass-card p-8 rounded-[2.5rem] border-brand-navy/5 bg-brand-navy/5">
                        <h4 class="text-xl font-black mb-6 flex items-center gap-3">
                            <i class="ph ph-envelope-simple text-brand-gold"></i>
                            Email My Results
                        </h4>
                        <div class="flex flex-col gap-4">
                            <input type="email" placeholder="your@email.com" class="calc-input outlined-soft py-3 px-5 rounded-xl text-sm font-bold">
                            <button onclick="alert('Results shared! We will reach out shortly.')" class="w-full bg-brand-gold text-brand-navy font-black py-4 rounded-2xl hover:bg-brand-navy hover:text-white transition-all shadow-lg uppercase tracking-widest text-xs">
                                Send Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getPaymentCalculatorHTML() {
    return `
        <div id="calc-payment">
            ${getScenarioSelectorHTML('pay')}
            <div class="calc-scroll-wrapper">
                <div class="calc-grid payment-grid">
                    <!-- Row 1: Start Here -->
                    <div class="calc-cell label-cell flex items-center">
                        <i class="ph ph-tag text-brand-gold text-xl mr-3"></i>
                        <div>
                            <span>Purchase Price</span>
                            <span class="label-sub">The total cost of the home</span>
                        </div>
                    </div>
                    <div class="calc-cell calc-span-4">
                        <div class="calc-input-wrapper with-symbol">
                            <label class="floating-label">Purchase Price</label>
                            <span class="symbol">$</span>
                            <input type="text" inputmode="numeric" id="pay-price" placeholder="e.g. 500,000" class="calc-input text-navy">
                        </div>
                    </div>

                    <div class="calc-divider calc-span-5"></div>

                    <!-- Header Row - Desktop Only -->
                    <div class="calc-cell mobile-hide"></div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell mobile-hide text-center py-4" data-type="pay" data-scenario="${i}">
                            <span class="scenario-header-tag">Plan ${i + 1}</span>
                        </div>
                    `).join('')}

                    <!-- Row 2: Down Payment -->
                    <div class="calc-cell label-cell flex items-center">
                        <i class="ph ph-hand-coins text-brand-navy/30 text-xl mr-3"></i>
                        <div>
                            <span>Down Payment</span>
                            <span class="label-sub">Initial cash payment</span>
                        </div>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell flex-col ${i > 0 ? 'mobile-hide' : ''}" data-type="pay" data-scenario="${i}">
                            <div class="calc-input-wrapper mb-2">
                                <input type="text" inputmode="numeric" class="calc-input" id="pay-dp-pct-${i}" placeholder="20">
                            </div>
                            <div class="calc-input-wrapper with-symbol">
                                <span class="symbol">$</span>
                                <input type="text" inputmode="numeric" class="calc-input" id="pay-dp-amt-${i}" placeholder="Amount">
                            </div>
                        </div>
                    `).join('')}

                    <!-- Row 3: CMHC -->
                    <div class="calc-cell label-cell">
                        <span class="text-blue">+</span> CMHC insurance
                        <i class="ph ph-question tooltip-trigger" data-tip="Mandatory for down payments under 20% in Canada. Protects the lender in case of default."></i>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell calc-readonly text-blue fw-bold ${i > 0 ? 'mobile-hide' : ''}" data-type="pay" data-scenario="${i}" id="pay-cmhc-${i}"><span class="skeleton-shimmer">$-</span></div>
                    `).join('')}

                    <!-- Row 4: Total Mortgage -->
                    <div class="calc-cell label-cell highlight-row bg-light-blue calc-span-1">
                        <span class="text-blue">=</span> <span class="text-blue">Total mortgage</span>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell highlight-row bg-light-blue calc-readonly text-blue fw-bold ${i > 0 ? 'mobile-hide' : ''}" data-type="pay" data-scenario="${i}" id="pay-total-${i}"><span class="skeleton-shimmer">$-</span></div>
                    `).join('')}

                    <!-- Row 5: Amortization -->
                    <div class="calc-cell label-cell">
                        Amortization
                        <i class="ph ph-question info-icon"></i>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell ${i > 0 ? 'mobile-hide' : ''}" data-type="pay" data-scenario="${i}">
                            <select class="calc-input" id="pay-amort-${i}">
                                <option value="25">25-year</option>
                                <option value="30">30-year</option>
                            </select>
                        </div>
                    `).join('')}

                    <!-- Row 6: Mortgage Rate -->
                    <div class="calc-cell label-cell">
                        Mortgage rate
                        <i class="ph ph-question info-icon"></i>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell ${i > 0 ? 'mobile-hide' : ''}" data-type="pay" data-scenario="${i}">
                            <div class="calc-input-wrapper">
                                <input type="text" inputmode="numeric" class="calc-input" id="pay-rate-${i}" placeholder="Rate">
                            </div>
                        </div>
                    `).join('')}

                    <!-- Row 7: Payment Frequency -->
                    <div class="calc-cell label-cell">
                        Payment frequency
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell ${i > 0 ? 'mobile-hide' : ''}" data-type="pay" data-scenario="${i}">
                            <select class="calc-input" id="pay-freq-${i}">
                                <option value="monthly">Monthly</option>
                                <option value="biweekly">Bi-weekly</option>
                            </select>
                        </div>
                    `).join('')}

                    <!-- Row 8: Mortgage Payment -->
                    <div class="calc-cell label-cell highlight-row border-bottom-0 flex items-center">
                        <i class="ph ph-equals text-brand-gold text-xl mr-3"></i>
                        <div>
                            <span class="text-brand-navy">Mortgage Payment</span>
                            <span class="label-sub">Estimated monthly total</span>
                        </div>
                    </div>
                    ${[...Array(4)].map((_, i) => `
                        <div class="calc-cell highlight-row calc-readonly text-gold-elite border-bottom-0 ${i > 0 ? 'mobile-hide' : ''}" data-type="pay" data-scenario="${i}" id="pay-payment-${i}"><span class="skeleton-shimmer">$-</span></div>
                    `).join('')}
                </div>
            </div>

            <!-- Sticky Result Bar (Mobile Only) -->
            <div class="sticky-result-bar lg:hidden" id="pay-sticky">
                <div class="flex items-center justify-between w-full">
                    <div class="flex flex-col">
                        <span class="sticky-label" id="pay-sticky-label">Plan 1 Payment</span>
                        <span class="sticky-value" id="pay-sticky-val"><span class="skeleton-shimmer">$-</span></span>
                    </div>
                    <button onclick="downloadPDF('payment')" class="bg-brand-gold text-brand-navy p-3 rounded-xl shadow-lg">
                        <i class="ph ph-file-pdf text-xl"></i>
                    </button>
                </div>
            </div>
                
            <div class="calc-bottom-section mt-8">
                <div class="calc-bottom-left">
                    <p class="fw-bold mb-2" style="font-size: 0.95rem;">Are you a first time home buyer?</p>
                    <div class="toggle-group">
                        <button class="toggle-btn" id="pay-ftb-yes">Yes</button>
                        <button class="toggle-btn active" id="pay-ftb-no">No</button>
                    </div>
                </div>
                <div class="calc-bottom-right calc-tax-breakdown">
                    <div class="tax-row">
                        <span class="tax-label">Land transfer tax</span>
                        <span class="tax-dots"></span>
                        <span class="tax-val" id="pay-ltt"><span class="skeleton-shimmer">$-</span></span>
                    </div>
                </div>
            </div>

            <div class="calc-collapsible-list" style="margin-top: 2rem;">
                <!-- Cash needed to close -->
                <div class="calc-collapsible-item">
                    <button class="calc-collapsible-header" onclick="toggleCollapsible(this)">
                        <div class="calc-collapsible-header-text">
                            <span class="calc-collapsible-header-title">Cash needed to close</span>
                            <span class="calc-collapsible-header-total" id="hdr-close-total">$-</span>
                        </div>
                        <i class="ph ph-caret-down"></i>
                    </button>
                    <div class="calc-collapsible-content">
                        <div class="calc-collapsible-inner split-pane-grid">
                            <div class="split-pane-left">
                                <p class="split-desc">When you purchase a house, there are a number of costs you will need to put aside in addition to your down payment.</p>
                                <div class="mb-6">
                                    <label class="block text-xs font-bold text-brand-navy/60 uppercase tracking-widest mb-2">Down payment options</label>
                                    <div class="relative">
                                        <select class="w-full calc-input outlined-soft py-3 px-4 rounded-xl text-sm font-bold appearance-none bg-white border border-brand-navy/10 text-brand-navy/90" onchange="window.switchScenario('pay', parseInt(this.value))" id="panel-scenario-select-1">
                                            <option value="0">Plan 1</option>
                                            <option value="1">Plan 2</option>
                                            <option value="2">Plan 3</option>
                                            <option value="3">Plan 4</option>
                                        </select>
                                        <i class="ph ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/50"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="split-pane-right border-l-0 lg:border-l border-brand-navy/10 lg:pl-10">
                                <div class="leader-row">
                                    <span class="leader-label">Down payment</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value" id="pay-close-dp">$-</span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Land transfer tax</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value" id="pay-close-ltt">$-</span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Lawyer fees</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-lawyer" class="calc-mini-input" value="$1,000" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Title insurance</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-title" class="calc-mini-input" value="$900" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Home inspection</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-inspect" class="calc-mini-input" value="$500" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Appraisal fees</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-appraisal" class="calc-mini-input" value="$300" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>
                                
                                <div class="leader-row total-row">
                                    <span class="leader-label py-2">Cash needed to close</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value" id="pay-close-total">$-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Monthly expenses -->
                <div class="calc-collapsible-item">
                    <button class="calc-collapsible-header" onclick="toggleCollapsible(this)">
                        <div class="calc-collapsible-header-text">
                            <span class="calc-collapsible-header-title">Monthly expenses</span>
                            <span class="calc-collapsible-header-total" id="hdr-exp-total">$-</span>
                        </div>
                        <i class="ph ph-caret-down"></i>
                    </button>
                    <div class="calc-collapsible-content">
                        <div class="calc-collapsible-inner split-pane-grid">
                            <div class="split-pane-left">
                                <div class="mb-6">
                                    <label class="block text-xs font-bold text-brand-navy/60 uppercase tracking-widest mb-2">Down payment options</label>
                                    <div class="relative">
                                        <select class="w-full calc-input outlined-soft py-3 px-4 rounded-xl text-sm font-bold appearance-none bg-white border border-brand-navy/10 text-brand-navy/90" onchange="window.switchScenario('pay', parseInt(this.value))" id="panel-scenario-select-2">
                                            <option value="0">Plan 1</option>
                                            <option value="1">Plan 2</option>
                                            <option value="2">Plan 3</option>
                                            <option value="3">Plan 4</option>
                                        </select>
                                        <i class="ph ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/50"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="split-pane-right border-l-0 lg:border-l border-brand-navy/10 lg:pl-10">
                                <div class="leader-row">
                                    <span class="leader-label">Mortgage payment</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value" id="pay-exp-mortgage">$-</span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Property tax</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-ptax" class="calc-mini-input" value="$400" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Monthly debt payments</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-debt" class="calc-mini-input" value="$0" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Utilities</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-utils" class="calc-mini-input" value="$185" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Property insurance</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-pins" class="calc-mini-input" value="$50" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Phone</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-phone" class="calc-mini-input" value="$60" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>
                                <div class="leader-row">
                                    <span class="leader-label">Internet / Cable</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value"><input type="text" id="pay-input-net" class="calc-mini-input" value="$80" onblur="formatOnBlurInline.call(this)" oninput="updatePaymentCalculatorInputWait()"></span>
                                </div>

                                <div class="leader-row total-row">
                                    <span class="leader-label py-2">Monthly expenses</span>
                                    <span class="leader-dots"></span>
                                    <span class="leader-value" id="pay-exp-total">$-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Interest rate risk -->
                <div class="calc-collapsible-item">
                    <button class="calc-collapsible-header" onclick="toggleCollapsible(this); renderHistoricalChartTimeout();">
                        <div class="calc-collapsible-header-text">
                            <span class="calc-collapsible-header-title">Interest rate risk</span>
                        </div>
                        <i class="ph ph-caret-down"></i>
                    </button>
                    <div class="calc-collapsible-content">
                        <div class="calc-collapsible-inner split-pane-grid">
                            <div class="split-pane-left">
                                <p class="split-desc">When calculating your mortgage costs, it's important to look at the long-term horizon. The mortgage rate you pay today could be substantially different from the mortgage rates available in the future.<br><br>The calculation below shows how much of your mortgage principal will be left at the end of the term.</p>
                                <div class="mb-6">
                                    <label class="block text-xs font-bold text-brand-navy/60 uppercase tracking-widest mb-2">Down payment options</label>
                                    <div class="relative">
                                        <select class="w-full calc-input outlined-soft py-3 px-4 rounded-xl text-sm font-bold appearance-none bg-white border border-brand-navy/10 text-brand-navy/90" onchange="window.switchScenario('pay', parseInt(this.value))" id="panel-scenario-select-3">
                                            <option value="0">Plan 1</option>
                                            <option value="1">Plan 2</option>
                                            <option value="2">Plan 3</option>
                                            <option value="3">Plan 4</option>
                                        </select>
                                        <i class="ph ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/50"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="split-pane-right border-l-0 lg:border-l border-brand-navy/10 lg:pl-10">
                                <div class="rate-matrix-box">
                                    <div class="flex justify-between items-center text-sm mb-3">
                                        <span>Mortgage amount today</span>
                                        <span class="font-bold" id="risk-start-bal">$-</span>
                                    </div>
                                    <div class="flex justify-between items-center text-sm mb-4 pb-4 border-b border-brand-primary/20">
                                        <span class="flex gap-4"><span class="text-brand-primary">-</span> Principal paid off over term</span>
                                        <span class="font-bold" id="risk-prin-paid">$-</span>
                                    </div>
                                    <div class="flex justify-between items-center font-bold text-brand-primary h-full">
                                        <span class="flex gap-4"><span>=</span> Balance remaining at the end of your current term</span>
                                        <span class="text-xl font-bold font-outfit" id="risk-end-bal">$-</span>
                                    </div>
                                </div>
                                
                                <p class="text-sm text-brand-navy/80 mb-4 px-2">Using the remaining balance above, below we can calculate the mortgage payments you could encounter at renewal based on different interest rates:</p>
                                
                                <div class="overflow-x-auto">
                                    <table class="rate-matrix-table text-sm w-full">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Interest rate</th>
                                                <th>Payment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="font-semibold text-brand-navy/80">Selected Rate</td>
                                                <td id="risk-rate-0">4.50%</td>
                                                <td class="font-bold" id="risk-pmt-0">$-</td>
                                            </tr>
                                            <tr>
                                                <td class="font-semibold text-brand-navy/80">Selected Rate -2%</td>
                                                <td id="risk-rate-minus2">2.50%</td>
                                                <td class="font-bold text-green-600" id="risk-pmt-minus2">$-</td>
                                            </tr>
                                            <tr>
                                                <td class="font-semibold text-brand-navy/80">Selected Rate +2%</td>
                                                <td id="risk-rate-plus2">6.50%</td>
                                                <td class="font-bold text-red-600" id="risk-pmt-plus2">$-</td>
                                            </tr>
                                            <tr>
                                                <td class="font-semibold text-brand-navy/80">Selected Rate +5%</td>
                                                <td id="risk-rate-plus5">9.50%</td>
                                                <td class="font-bold text-red-700" id="risk-pmt-plus5">$-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div class="mt-8 pt-6 border-t border-brand-primary/10 w-full">
                                    <p class="text-sm text-brand-navy mb-4">Below is a graph that displays the approximate values of competitive 5-year fixed mortgage rates since 2006.</p>
                                    <div class="h-[300px] relative w-full pt-4">
                                        <canvas id="historicalRateChart"></canvas>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Amortization schedule -->
                <div class="calc-collapsible-item">
                    <button class="calc-collapsible-header" onclick="toggleCollapsible(this); renderAmortizationChartTimeout();">
                        <div class="calc-collapsible-header-text">
                            <span class="calc-collapsible-header-title">Amortization schedule</span>
                        </div>
                        <i class="ph ph-caret-down"></i>
                    </button>
                    <div class="calc-collapsible-content">
                        <div class="calc-collapsible-inner p-4 md:p-8">
                            <div class="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4 border-b border-brand-navy/10 pb-6">
                                <h4 class="text-xl md:text-2xl font-outfit text-brand-primary">Choose your amortization scenario</h4>
                                <div class="relative w-full md:w-64">
                                    <select class="w-full calc-input outlined-soft py-3 px-4 rounded-xl text-sm font-bold appearance-none bg-white border border-brand-navy/10 text-brand-navy/90" onchange="window.switchScenario('pay', parseInt(this.value))" id="panel-scenario-select-4">
                                        <option value="0">Plan 1</option>
                                        <option value="1">Plan 2</option>
                                        <option value="2">Plan 3</option>
                                        <option value="3">Plan 4</option>
                                    </select>
                                    <i class="ph ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/50"></i>
                                </div>
                            </div>

                            <div class="w-full h-[400px] mb-12 relative chart-container" style="min-height: 400px">
                                <canvas id="amortizationChartBar"></canvas>
                            </div>

                            <div class="overflow-x-auto w-full pt-4">
                                <table class="w-full text-sm text-center">
                                    <thead>
                                        <tr class="border-b-2 border-brand-navy/10 bg-brand-navy/5">
                                            <th class="py-4 px-2 font-bold text-brand-navy">Year</th>
                                            <th class="py-4 px-2 font-bold text-brand-navy">Total paid</th>
                                            <th class="py-4 px-2 font-bold text-brand-navy">Principal paid</th>
                                            <th class="py-4 px-2 font-bold text-brand-navy">Interest paid</th>
                                            <th class="py-4 px-2 font-bold text-brand-navy text-right pr-4">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody id="pay-amort-table">
                                        <!-- Populated by JS -->
                                    </tbody>
                                </table>
                            </div>
                            
                            <p class="text-[0.65rem] md:text-xs text-brand-navy/60 mt-10 mx-auto text-left leading-relaxed">
                                The line above displays the totals at the end of your mortgage term. At this time, you will renew your mortgage and choose among the rates that are available. The following analysis assumes you will lock in the same rate for the remainder of the amortization period, which may not be possible.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Elite Features: Visuals & Export -->
            <div class="calc-elite-section mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div class="glass-card p-6 md:p-8 rounded-[2.5rem] border-brand-navy/5 bg-brand-navy/5 shadow-inner">
                    <h4 class="text-xl font-black mb-6 flex items-center gap-3 text-brand-navy">
                        <i class="ph ph-chart-pie text-brand-gold"></i>
                        Visual Analysis
                    </h4>
                    <div class="relative w-full min-h-[320px] max-w-[400px] mx-auto">
                        <canvas id="paymentChart"></canvas>
                    </div>
                    <p class="text-center text-[10px] text-brand-navy/40 mt-6 font-bold uppercase tracking-[0.2em]" id="pay-chart-label">Principal vs Total Interest (Plan 1)</p>
                </div>
                
                <div class="flex flex-col gap-6">
                    <div class="glass-card p-8 rounded-[2.5rem] border-brand-navy/5 bg-brand-navy/5">
                        <h4 class="text-xl font-black mb-6 flex items-center gap-3 text-brand-navy">
                            <i class="ph ph-file-pdf text-brand-gold"></i>
                            Professional Report
                        </h4>
                        <p class="text-sm text-brand-navy/60 mb-8 leading-relaxed">Download a branded PDF summary of your mortgage scenarios to review with your advisor.</p>
                        <button onclick="downloadPDF('payment')" class="w-full bg-brand-navy text-white font-black py-4 rounded-2xl hover:bg-brand-gold hover:text-brand-navy transition-all shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                            <i class="ph ph-download-simple"></i>
                            Download PDF Report
                        </button>
                    </div>

                    <div class="glass-card p-8 rounded-[2.5rem] border-brand-navy/5 bg-brand-navy/5">
                        <h4 class="text-xl font-black mb-6 flex items-center gap-3 text-brand-navy">
                            <i class="ph ph-envelope-simple text-brand-gold"></i>
                            Email My Results
                        </h4>
                        <div class="flex flex-col gap-4">
                            <input type="email" placeholder="your@email.com" class="calc-input outlined-soft py-3 px-5 rounded-xl text-sm font-bold">
                            <button onclick="alert('Results shared! We will reach out shortly.')" class="w-full bg-brand-gold text-brand-navy font-black py-4 rounded-2xl hover:bg-brand-navy hover:text-white transition-all shadow-lg uppercase tracking-widest text-xs">
                                Send Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function exposed to main.html to generate the HTML structure
window.renderCalculators = function() {
    return `
        <div class="calculator-container bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/5">
            <!-- Tab Navigation -->
            <div class="grid grid-cols-2 lg:grid-cols-4 p-2 gap-2 bg-brand-navy/30 backdrop-blur-xl border-b border-white/10">
                <button class="calc-tab active group relative px-6 py-5 rounded-md transition-all duration-500 overflow-hidden" onclick="switchCalculator('payment')">
                    <div class="absolute inset-0 bg-brand-gold/10 opacity-0 group-[.active]:opacity-100 transition-opacity duration-500"></div>
                    <div class="relative z-10 flex flex-col items-center gap-2">
                        <i class="ph ph-calculator text-2xl group-[.active]:text-brand-gold transition-colors"></i>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] group-[.active]:text-brand-gold transition-colors">Payment</span>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-1 bg-brand-gold scale-x-0 group-[.active]:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
                <button class="calc-tab group relative px-6 py-5 rounded-md transition-all duration-500 overflow-hidden" onclick="switchCalculator('refinance')">
                    <div class="absolute inset-0 bg-brand-gold/10 opacity-0 group-[.active]:opacity-100 transition-opacity duration-500"></div>
                    <div class="relative z-10 flex flex-col items-center gap-2">
                        <i class="ph ph-arrows-merge text-2xl group-[.active]:text-brand-gold transition-colors"></i>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] group-[.active]:text-brand-gold transition-colors">Refinance</span>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-1 bg-brand-gold scale-x-0 group-[.active]:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
                <button class="calc-tab group relative px-6 py-5 rounded-md transition-all duration-500 overflow-hidden" onclick="switchCalculator('land-transfer')">
                    <div class="absolute inset-0 bg-brand-gold/10 opacity-0 group-[.active]:opacity-100 transition-opacity duration-500"></div>
                    <div class="relative z-10 flex flex-col items-center gap-2">
                        <i class="ph ph-stamp text-2xl group-[.active]:text-brand-gold transition-colors"></i>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] group-[.active]:text-brand-gold transition-colors">Tax (LTT)</span>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-1 bg-brand-gold scale-x-0 group-[.active]:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
                <button class="calc-tab group relative px-6 py-5 rounded-md transition-all duration-500 overflow-hidden" onclick="switchCalculator('affordability')">
                    <div class="absolute inset-0 bg-brand-gold/10 opacity-0 group-[.active]:opacity-100 transition-opacity duration-500"></div>
                    <div class="relative z-10 flex flex-col items-center gap-2">
                        <i class="ph ph-piggy-bank text-2xl group-[.active]:text-brand-gold transition-colors"></i>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] group-[.active]:text-brand-gold transition-colors">Affordability</span>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-1 bg-brand-gold scale-x-0 group-[.active]:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
            </div>

            <!-- Calculator Bodies -->
            <div class="calculator-bodies bg-white p-8 md:p-12 text-brand-navy">
                <!-- Payment Calculator -->
                <div id="calc-payment" class="calc-body active revealed">
                    ${getPaymentCalculatorHTML()}
                </div>

                <!-- Refinance Calculator -->
                <div id="calc-refinance" class="calc-body revealed">
                    ${getRefinanceCalculatorHTML()}
                </div>

                <!-- Land Transfer Tax Calculator -->
                <div id="calc-land-transfer" class="calc-body revealed">
                    ${getLandTransferTaxCalculatorHTML()}
                </div>

                <!-- Affordability Calculator -->
                <div id="calc-affordability" class="calc-body revealed">
                    ${getAffordabilityCalculatorHTML()}
                </div>
            </div>
        </div>
    `;
};

// Function to handle tab switching
window.switchCalculator = function(calcId) {
    // 1. Remove active class from all tabs
    const tabs = document.querySelectorAll('.calc-tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // 2. Remove active class from all bodies
    const bodies = document.querySelectorAll('.calc-body');
    bodies.forEach(body => body.classList.remove('active'));

    // 3. Add active class to clicked tab
    const activeTab = document.querySelector(`.calc-tab[onclick="switchCalculator('${calcId}')"]`);
    if (activeTab) activeTab.classList.add('active');

    // 4. Add active class to target body
    const targetBody = document.getElementById(`calc-${calcId}`);
    if (targetBody) targetBody.classList.add('active');
};

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
};

// --- Calculator Logic & Math --- \\

function formatCurrency(num) {
    if (isNaN(num) || num === null) return '<span class="skeleton-shimmer">$-</span>';
    return '$' + Math.round(num).toLocaleString('en-CA');
}

function formatNumber(num) {
    if (isNaN(num) || num === null) return '-';
    return Math.round(num).toLocaleString('en-CA');
}

function parseNumber(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/[^\d.]/g, '')) || 0;
}

function parseCurrency(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/[\$,,\s]/g, '')) || 0;
}

// Live Input Masking
function initInputMasking() {
    const inputs = document.querySelectorAll('.calc-input:not([type="email"])');
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Skip pct inputs for now or handle them differently
            if (this.id.includes('pct') || this.id.includes('rate') || this.id.includes('tax') || this.id === 'ltt-location' || this.id === 'aff-loc') {
                return;
            }
            
            let cursor = this.selectionStart;
            let oldLen = this.value.length;
            
            let val = this.value.replace(/[^\d]/g, '');
            if (val) {
                let formatted = parseInt(val).toLocaleString('en-CA');
                this.value = formatted;
            } else {
                this.value = '';
            }
            
            // Adjust cursor position
            let newLen = this.value.length;
            this.setSelectionRange(cursor + (newLen - oldLen), cursor + (newLen - oldLen));
            
            // Trigger calculation
            if (this.id.startsWith('pay-')) updatePaymentCalculator();
            if (this.id.startsWith('ref-')) updateRefinanceCalculator();
            if (this.id.startsWith('aff-')) updateAffordabilityCalculator();
            if (this.id.startsWith('ltt-')) updateLandTransferTaxCalculator();
        });
    });
}

function computeCMHC(price, dpAmt) {
    const dpPct = dpAmt / price;
    if (dpPct >= 0.2 || price >= 1000000) return 0;
    
    let rate = 0;
    if (dpPct >= 0.15) rate = 0.028;
    else if (dpPct >= 0.1) rate = 0.031;
    else if (dpPct >= 0.05) rate = 0.040;
    else return null; // Invalid DP

    const mortgageBase = price - dpAmt;
    return mortgageBase * rate;
}

function computePayment(principal, annualRate, amortYears, freq) {
    if (principal <= 0 || isNaN(principal)) return 0;
    if (annualRate <= 0) return principal / (amortYears * (freq === 'monthly' ? 12 : 26));

    const r = annualRate / 100;
    // Canadian standard compounding (semi-annual)
    const iMonths = Math.pow(1 + r/2, 2/12) - 1;
    const nMonths = amortYears * 12;
    
    const monthlyPayment = principal * (iMonths * Math.pow(1 + iMonths, nMonths)) / (Math.pow(1 + iMonths, nMonths) - 1);

    if (freq === 'biweekly') {
        return (monthlyPayment * 12) / 26; // Standard bi-weekly
    }
    return monthlyPayment;
}

function updatePaymentCalculator() {
    const priceInput = document.getElementById('pay-price');
    const priceStr = priceInput.value;
    let price = parseCurrency(priceStr);
    if (price <= 0) price = 0;

    for (let i = 0; i < 4; i++) {
        const dpPctInput = document.getElementById(`pay-dp-pct-${i}`);
        const dpAmtInput = document.getElementById(`pay-dp-amt-${i}`);
        const amortInput = document.getElementById(`pay-amort-${i}`);
        const rateInput = document.getElementById(`pay-rate-${i}`);
        const freqInput = document.getElementById(`pay-freq-${i}`);

        // Sync DP percentage and amount based on active input
        // If price is 0, we can't calculate much.
        let dpAmt = parseCurrency(dpAmtInput.value);
        let dpPct = parseFloat(dpPctInput.value);
        
        // Refined sync logic to avoid "jumpy" values while typing
        if (price > 0) {
            if (document.activeElement === dpPctInput && !isNaN(dpPct)) {
                const newAmt = price * (dpPct / 100);
                if (Math.abs(parseCurrency(dpAmtInput.value) - newAmt) > 1) {
                    dpAmtInput.value = Math.round(newAmt).toLocaleString('en-CA');
                }
            } else if (document.activeElement === dpAmtInput && !isNaN(dpAmt)) {
                const newPct = (dpAmt / price) * 100;
                if (Math.abs(parseFloat(dpPctInput.value) - newPct) > 0.01) {
                    dpPctInput.value = newPct.toFixed(2);
                }
            }
        }
        
        // Re-parse after potential sync
        dpAmt = parseCurrency(dpAmtInput.value);

        // Calculate outputs
        const rate = parseFloat(rateInput.value) || 0;
        const amort = parseInt(amortInput.value) || 25;
        const freq = freqInput.value;

        const cmhcOutput = document.getElementById(`pay-cmhc-${i}`);
        const totalOutput = document.getElementById(`pay-total-${i}`);
        const paymentOutput = document.getElementById(`pay-payment-${i}`);

        if (price > 0 && dpAmt > 0 && dpAmt <= price) {
            const cmhc = computeCMHC(price, dpAmt);
            if (cmhc === null) {
                // Invalid DP (e.g., < 5%)
                cmhcOutput.innerHTML = '<span class="skeleton-shimmer">$-</span>';
                totalOutput.innerHTML = '<span class="skeleton-shimmer">$-</span>';
                paymentOutput.innerHTML = '<span class="skeleton-shimmer">$-</span>';
                continue;
            }

            const totalMortgage = (price - dpAmt) + cmhc;
            const payment = computePayment(totalMortgage, rate, amort, freq);

            animateValue(`pay-cmhc-${i}`, cmhc);
            animateValue(`pay-total-${i}`, totalMortgage);
            animateValue(`pay-payment-${i}`, payment);

            // Update visual analysis: Principal vs Total Interest (Scenario 1)
            if (i === 0) {
                updateCharts('payment', totalMortgage, rate, amort);
                updatePaymentBreakdown(price, dpAmt, rate, amort, freq, totalMortgage, payment);
            }

            // Sync Sticky Bar if it's the active scenario on mobile
            const activeBtn = document.querySelector('#pay-btn-' + i + '.active');
            if (activeBtn) {
                window.updateStickyBar('pay', i);
            }
        } else {
            document.getElementById(`pay-cmhc-${i}`).innerHTML = '<span class="skeleton-shimmer">$-</span>';
            document.getElementById(`pay-total-${i}`).innerHTML = '<span class="skeleton-shimmer">$-</span>';
            document.getElementById(`pay-payment-${i}`).innerHTML = '<span class="skeleton-shimmer">$-</span>';
        }
    }
}

function updateRefinanceCalculator() {
    const amountInput = document.getElementById('ref-amount');
    const amountStr = amountInput ? amountInput.value : '';
    let principal = parseCurrency(amountStr);
    if (principal <= 0) principal = 0;

    for (let i = 0; i < 4; i++) {
        const amortInput = document.getElementById(`ref-amort-${i}`);
        const rateInput = document.getElementById(`ref-rate-${i}`);
        const freqInput = document.getElementById(`ref-freq-${i}`);
        const paymentOutput = document.getElementById(`ref-payment-${i}`);

        if (!amortInput || !rateInput || !freqInput || !paymentOutput) continue;

        const amort = parseInt(amortInput.value) || 25;
        const rate = parseFloat(rateInput.value) || 0;
        const freq = freqInput.value;
        if (principal > 0) {
            const payment = computePayment(principal, rate, amort, freq);
            animateValue(`ref-payment-${i}`, payment);
            
            // Calculate total interest for the donut chart
            const r = rate / 100;
            const iMonths = Math.pow(1 + r/2, 2/12) - 1;
            const nMonths = amort * 12;
            const monthlyPayment = principal * (iMonths * Math.pow(1 + iMonths, nMonths)) / (Math.pow(1 + iMonths, nMonths) - 1);
            const totalPaid = monthlyPayment * nMonths;
            const totalInterest = Math.max(0, totalPaid - principal);

            // Update charts
            if (i === 0) {
                updateCharts('refinance', principal, rate, amort);
            }

            // Sync Sticky Bar if it's the active scenario on mobile
            const activeBtn = document.querySelector('#ref-btn-' + i + '.active');
            if (activeBtn) {
                window.updateStickyBar('ref', i);
            }
        } else {
            paymentOutput.innerHTML = '<span class="skeleton-shimmer">$-</span>';
        }
    }
}


function computeLTT(price, province, location, isFTB, isNewHome) {
    let provTax = 0;
    let muniTax = 0;
    let provRebate = 0;
    let muniRebate = 0;

    const rates = LTT_RATES[province];
    if (!rates) return { provTax, muniTax, provRebate, muniRebate };

    // --- Provincial Calculation ---
    if (rates.prov.length > 0) {
        let remainingPrice = price;
        let lastThreshold = 0;
        for (const tier of rates.prov) {
            const currentThreshold = tier.threshold === Infinity ? price : tier.threshold;
            const taxableAmount = Math.max(0, Math.min(remainingPrice, currentThreshold - lastThreshold));
            provTax += taxableAmount * tier.rate;
            remainingPrice -= taxableAmount;
            lastThreshold = currentThreshold;
            if (remainingPrice <= 0) break;
        }
    }

    // --- Municipal (Toronto) ---
    if (location.toLowerCase().includes('toronto')) {
        let rem = price;
        muniTax += Math.min(rem, 55000) * 0.005;
        if (rem > 55000) muniTax += (Math.min(rem, 250000) - 55000) * 0.01;
        if (rem > 250000) muniTax += (Math.min(rem, 400000) - 250000) * 0.015;
        if (rem > 400000) muniTax += (Math.min(rem, 2000000) - 400000) * 0.02;
        if (rem > 2000000) muniTax += (Math.min(rem, 3000000) - 2000000) * 0.025;
        if (rem > 3000000) muniTax += (Math.min(rem, 4000000) - 3000000) * 0.035;
        if (rem > 4000000) muniTax += (Math.min(rem, 5000000) - 4000000) * 0.045;
        if (rem > 5000000) muniTax += (Math.min(rem, 10000000) - 5000000) * 0.055;
        if (rem > 10000000) muniTax += (Math.min(rem, 20000000) - 10000000) * 0.065;
        if (rem > 20000000) muniTax += (price - 20000000) * 0.075;
    }

    // --- Rebates ---
    if (isFTB) {
        if (province === 'ON') {
            provRebate = Math.min(provTax, 4000);
            if (location.toLowerCase().includes('toronto')) {
                muniRebate = Math.min(muniTax, 4475);
            }
        } else if (province === 'BC') {
            // BC FTB Exemption: Full up to 500k, partial to 525k
            if (price <= 500000) provRebate = provTax;
            else if (price < 525000) {
                const proportion = (525000 - price) / 25000;
                provRebate = provTax * proportion;
            }
        } else if (province === 'PE') {
            if (price < 200000) provRebate = provTax;
        }
    }

    // BC New Home Exemption (Effective April 1, 2024: increased to 1.1M)
    if (isNewHome && province === 'BC') {
        if (price <= 1100000) provRebate = Math.max(provRebate, provTax); 
        else if (price < 1150000) { 
            const proportion = (1150000 - price) / 50000;
            provRebate = Math.max(provRebate, provTax * proportion);
        }
    }

    return { provTax, muniTax, provRebate, muniRebate };
}

function updateLandTransferTaxCalculator() {
    const priceInput = document.getElementById('ltt-price');
    const locInput = document.getElementById('ltt-location');
    const ftbInput = document.getElementById('ltt-ftb');
    const newHomeInput = document.getElementById('ltt-new-home');
    const newHomeWrapper = document.getElementById('ltt-new-home-wrapper');

    if (!priceInput || !locInput || !ftbInput) return;

    let price = parseCurrency(priceInput.value);
    if (price <= 0) price = 0;

    const locVal = locInput.value.toUpperCase();
    let province = 'ON'; // Default

    const provMap = {
        'BC': 'BC', 'BRITISH COLUMBIA': 'BC', 'VANCOUVER': 'BC', 'VICTORIA': 'BC',
        'ON': 'ON', 'ONTARIO': 'ON', 'TORONTO': 'ON', 'OTTAWA': 'ON', 'MISSISSAUGA': 'ON',
        'AB': 'AB', 'ALBERTA': 'AB', 'CALGARY': 'AB', 'EDMONTON': 'AB',
        'QC': 'QC', 'QUEBEC': 'QC', 'MONTREAL': 'QC',
        'MB': 'MB', 'MANITOBA': 'MB', 'WINNIPEG': 'MB',
        'SK': 'SK', 'SASKATCHEWAN': 'SK', 'REGINA': 'SK', 'SASKATOON': 'SK',
        'NS': 'NS', 'NOVA SCOTIA': 'NS', 'HALIFAX': 'NS',
        'NB': 'NB', 'NEW BRUNSWICK': 'NB', 'FREDERICTON': 'NB',
        'PE': 'PE', 'PRINCE EDWARD ISLAND': 'PE', 'CHARLOTTETOWN': 'PE',
        'NL': 'NL', 'NEWFOUNDLAND': 'NL', 'ST. JOHN': 'NL',
        'NT': 'NT', 'NORTHWEST TERRITORIES': 'NT', 'YELLOWKNIFE': 'NT',
        'YT': 'YT', 'YUKON': 'YT', 'WHITEHORSE': 'YT',
        'NU': 'NU', 'NUNAVUT': 'NU', 'IQALUIT': 'NU'
    };

    for (const key in provMap) {
        if (locVal.includes(key)) {
            province = provMap[key];
            break;
        }
    }
    
    console.log(`[LTT DEBUG] Price: ${price}, Location: ${locVal}, Province parsed: ${province}`);


    
    // Toggle New Home visibility for BC
    if (province === 'BC') {
        newHomeWrapper.style.display = 'flex';
    } else {
        newHomeWrapper.style.display = 'none';
        if (newHomeInput) newHomeInput.checked = false;
    }

    const isFTB = ftbInput.checked;
    const isNewHome = newHomeInput ? newHomeInput.checked : false;

    const { provTax, muniTax, provRebate, muniRebate } = computeLTT(price, province, locVal, isFTB, isNewHome);

    const totalRebate = provRebate + muniRebate;
    const totalTax = Math.max(0, (provTax + muniTax) - totalRebate);

    document.getElementById('ltt-prov').innerText = formatCurrency(provTax);
    
    // Municipal row
    const muniRow = document.getElementById('ltt-muni-row');
    if (muniTax > 0) {
        document.getElementById('ltt-muni').innerText = formatCurrency(muniTax);
        muniRow.style.display = 'flex';
    } else {
        muniRow.style.display = 'none';
    }

    // Rebate row
    const rebateRow = document.getElementById('ltt-rebate-row');
    if (totalRebate > 0) {
        document.getElementById('ltt-rebate').innerText = formatCurrency(totalRebate);
        rebateRow.style.display = 'flex';
    } else {
        rebateRow.style.display = 'none';
    }

    animateValue('ltt-total', Math.round(totalTax));
}

function computePrincipal(payment, annualRate, amortYears) {
    if (payment <= 0 || annualRate <= 0 || amortYears <= 0) return 0;
    
    // Canadian standard: compounded semi-annually
    let semiAnnualRate = annualRate / 2;
    let monthlyRate = Math.pow(1 + semiAnnualRate, 1/6) - 1;
    let numPayments = amortYears * 12;

    let principal = payment * (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
    return principal;
}

function updateAffordabilityCalculator() {
    const inc1 = parseCurrency(document.getElementById('aff-inc-1')?.value);
    const inc2 = parseCurrency(document.getElementById('aff-inc-2')?.value);
    const dp = parseCurrency(document.getElementById('aff-dp')?.value);
    
    const amort = parseNumber(document.getElementById('aff-amort')?.value) || 25;
    
    const tax = parseCurrency(document.getElementById('aff-tax')?.value);
    const condo = parseCurrency(document.getElementById('aff-condo')?.value);
    const heat = parseCurrency(document.getElementById('aff-heat')?.value) || 175; // default heating
    
    const cc = parseCurrency(document.getElementById('aff-cc')?.value);
    const car = parseCurrency(document.getElementById('aff-car')?.value);
    const loan = parseCurrency(document.getElementById('aff-loan')?.value);

    const totalIncome = inc1 + inc2;
    const monthlyIncome = totalIncome / 12;

    const monthlyTax = tax > 0 ? tax / 12 : 0; // If they don't know, we could estimate, but let's stick to what's entered or 0 for now.
    const monthlyDebts = cc + car + loan;

    // GDS = 39%, TDS = 44%
    const maxGDS = (monthlyIncome * 0.39) - monthlyTax - condo - heat;
    const maxTDS = (monthlyIncome * 0.44) - monthlyTax - condo - heat - monthlyDebts;

    const maxPayment = Math.max(0, Math.min(maxGDS, maxTDS));

    // Stress test rate estimation
    const stressRate = 0.07; // 7%

    const maxMortgage = computePrincipal(maxPayment, stressRate, amort);
    let maxPrice = maxMortgage + dp;

    // Simple heuristic: if we have 0 income, price is just DP.
    if (totalIncome === 0) {
        maxPrice = dp;
    }

    const priceEl = document.getElementById('aff-max-price');
    const paymentEl = document.getElementById('aff-max-payment');

    if (priceEl && paymentEl) {
        if (totalIncome > 0 || dp > 0) {
            animateValue('aff-max-price', maxPrice);
            animateValue('aff-max-payment', maxPayment);
        } else {
            priceEl.innerHTML = '<span class="skeleton-shimmer">$-</span>';
            paymentEl.innerHTML = '<span class="skeleton-shimmer">$-</span>';
        }
    }
}

// --- Calculator Initialization ---


// --- Elite Features Logic --- \\

let chartInstances = {};
let prevValues = {};

/**
 * numerical roll animation for a haptic-like feel
 */
function animateValue(id, end, duration = 800, isCurrency = true) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    // Parse the current value from the text content
    const start = prevValues[id] || 0;
    prevValues[id] = end;

    // If change is too small, just set it
    if (Math.abs(start - end) < 1) {
        obj.innerText = isCurrency ? formatCurrency(end) : end.toLocaleString();
        return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing function (outQuart)
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeProgress * (end - start) + start);
        obj.innerText = isCurrency ? formatCurrency(current) : current.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Update Chart.js visualization for Principal vs Interest
 */
function updateCharts(type, principal, annualRate, amortYears) {
    const canvasId = type === 'payment' ? 'paymentChart' : 'refinanceChart';
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Calculation for total interest over the full amortization
    const r = annualRate / 100;
    if (r <= 0 || amortYears <= 0 || principal <= 0) return;

    // Canadian standard compounding
    const iMonths = Math.pow(1 + r/2, 2/12) - 1;
    const nMonths = amortYears * 12;
    const monthlyPayment = principal * (iMonths * Math.pow(1 + iMonths, nMonths)) / (Math.pow(1 + iMonths, nMonths) - 1);
    const totalPaid = monthlyPayment * nMonths;
    const totalInterest = Math.max(0, totalPaid - principal);

    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [Math.round(principal), Math.round(totalInterest)],
                backgroundColor: ['#0F1E2E', '#D3BD73'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#0F1E2E',
                        font: {
                            family: 'Inter, sans-serif',
                            weight: '700',
                            size: 11
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) label += ': ';
                            label += formatCurrency(context.raw);
                            return label;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

/**
 * Generate a branded PDF report of the calculation results
 */
window.downloadPDF = function(type) {
    // Add a printing class to body
    document.body.classList.add('is-printing');
    window.print();
    document.body.classList.remove('is-printing');
}

// --- Advanced Features Implementation ---


function initStickySummary() {
    const stickyPay = document.getElementById('pay-sticky-bar');
    const stickyRef = document.getElementById('ref-sticky-bar');
    
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 1024) return; // Desktop handled differently
        
        const payCalc = document.getElementById('calc-payment');
        const refCalc = document.getElementById('calc-refinance');
        
        if (payCalc && payCalc.style.display !== 'none') {
            const rect = payCalc.getBoundingClientRect();
            if (rect.top < 0 && rect.bottom > 500) {
                document.getElementById('sticky-mobile-summary').classList.add('visible');
            } else {
                document.getElementById('sticky-mobile-summary').classList.remove('visible');
            }
        }
    });
}

function initAdvancedFeatures() {
    initInputMasking();
    initStickySummary();
    
    // Add sticky summary container to body if it doesn't exist
    if (!document.getElementById('sticky-mobile-summary')) {
        const div = document.createElement('div');
        div.id = 'sticky-mobile-summary';
        div.innerHTML = `
            <div id="pay-mobile-summary" style="display:none;">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="text-[10px] uppercase tracking-widest text-brand-navy/40 font-bold">Monthly Payment</div>
                        <div class="text-xl font-black text-brand-navy" id="mobile-pay-val">$0</div>
                    </div>
                    <button onclick="downloadPDF('payment')" class="bg-brand-gold text-brand-navy px-4 py-2 rounded-lg font-bold text-xs uppercase">Report</button>
                </div>
            </div>
            <div id="ref-mobile-summary" style="display:none;">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="text-[10px] uppercase tracking-widest text-brand-navy/40 font-bold">Monthly Payment</div>
                        <div class="text-xl font-black text-brand-navy" id="mobile-ref-val">$0</div>
                    </div>
                    <button onclick="downloadPDF('refinance')" class="bg-brand-gold text-brand-navy px-4 py-2 rounded-lg font-bold text-xs uppercase">Report</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    }
}

window.initCalculatorLogic = function() {
    // Placeholder for initTabs and initInteractiveGrid if they exist elsewhere
    // initTabs();
    // initInteractiveGrid();
    initAdvancedFeatures();
    
    // --- Payment Calculator Defaults ---
    const payPrice = document.getElementById('pay-price');
    if(payPrice) payPrice.value = '500,000';
    
    const payDp0 = document.getElementById('pay-dp-pct-0');
    if(payDp0) payDp0.value = '20';
    
    const payRate0 = document.getElementById('pay-rate-0');
    if(payRate0) payRate0.value = '4.50';

    // --- Refinance Calculator Defaults ---
    const refAmount = document.getElementById('ref-amount');
    if(refAmount) refAmount.value = '350,000';
    
    const refRate0 = document.getElementById('ref-rate-0');
    if(refRate0) refRate0.value = '4.50';

    // --- LTT Calculator Defaults ---
    const lttPrice = document.getElementById('ltt-price');
    if(lttPrice) lttPrice.value = '800,000';

    // Custom Autocomplete Logic for LTT Location
    const lttLocInput = document.getElementById('ltt-location');
    const lttLocResults = document.getElementById('ltt-location-results');

    if (lttLocInput && lttLocResults) {
        lttLocInput.addEventListener('input', () => {
            const val = lttLocInput.value.toLowerCase();
            lttLocResults.innerHTML = '';
            
            if (!val) {
                lttLocResults.classList.remove('active');
                return;
            }

            const matches = LTT_LOCATIONS.filter(loc => loc.toLowerCase().includes(val)).slice(0, 8);
            
            if (matches.length > 0) {
                matches.forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'autocomplete-item';
                    
                    // Highlight the matching part
                    const index = match.toLowerCase().indexOf(val);
                    const before = match.substring(0, index);
                    const mid = match.substring(index, index + val.length);
                    const after = match.substring(index + val.length);
                    
                    div.innerHTML = `<i class="ph ph-map-pin text-brand-navy/30"></i> <span>${before}<span class="text-brand-gold font-bold">${mid}</span>${after}</span>`;
                    
                    div.addEventListener('click', () => {
                        lttLocInput.value = match;
                        lttLocResults.classList.remove('active');
                        updateLandTransferTaxCalculator();
                    });
                    
                    lttLocResults.appendChild(div);
                });
                lttLocResults.classList.add('active');
            } else {
                lttLocResults.classList.remove('active');
            }
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!lttLocInput.contains(e.target) && !lttLocResults.contains(e.target)) {
                lttLocResults.classList.remove('active');
            }
        });

        // Auto-select text on focus/click for easier replacement
        lttLocInput.addEventListener('focus', () => {
            lttLocInput.select();
        });
    }

    // --- Affordability Calculator Defaults ---
    const affInc1 = document.getElementById('aff-inc-1');
    if(affInc1) affInc1.value = '100,000';
    const affDp = document.getElementById('aff-dp');
    if(affDp) affDp.value = '50,000';

    // Add event listeners to all payment calculator inputs
    const payInputs = [
        'pay-price',
        ...[...Array(4)].map((_, i) => `pay-dp-pct-${i}`),
        ...[...Array(4)].map((_, i) => `pay-dp-amt-${i}`),
        ...[...Array(4)].map((_, i) => `pay-amort-${i}`),
        ...[...Array(4)].map((_, i) => `pay-rate-${i}`),
        ...[...Array(4)].map((_, i) => `pay-freq-${i}`)
    ];

    payInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updatePaymentCalculator);
            el.addEventListener('change', updatePaymentCalculator);
        }
    });

    // Add event listeners to all refinance calculator inputs
    const refInputs = [
        'ref-amount',
        ...[...Array(4)].map((_, i) => `ref-amort-${i}`),
        ...[...Array(4)].map((_, i) => `ref-rate-${i}`),
        ...[...Array(4)].map((_, i) => `ref-freq-${i}`)
    ];

    refInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateRefinanceCalculator);
            el.addEventListener('change', updateRefinanceCalculator);
        }
    });

    // Add event listeners to LTT inputs
    const lttInputs = ['ltt-price', 'ltt-location', 'ltt-ftb', 'ltt-new-home'];
    lttInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateLandTransferTaxCalculator);
            el.addEventListener('change', updateLandTransferTaxCalculator);
        }
    });

    // Add event listeners to Affordability inputs
    const affInputs = [
        'aff-inc-1', 'aff-inc-2', 'aff-dp', 'aff-amort', 'aff-loc',
        'aff-tax', 'aff-condo', 'aff-heat', 'aff-cc', 'aff-car', 'aff-loan'
    ];
    affInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateAffordabilityCalculator);
            el.addEventListener('change', updateAffordabilityCalculator);
        }
    });

    // Format fields on blur
    const formatOnBlur = function() {
        const val = parseCurrency(this.value);
        if(val > 0) this.value = val.toLocaleString('en-US');
    };
    
    // Percent format on blur
    const formatPercentOnBlur = function() {
        let val = parseFloat(this.value.replace(/[^\d.]/g, ''));
        if(!isNaN(val) && val > 0) this.value = val + '%';
    };

    if(payPrice) payPrice.addEventListener('blur', formatOnBlur);
    if(refAmount) refAmount.addEventListener('blur', formatOnBlur);
    if(lttPrice) lttPrice.addEventListener('blur', formatOnBlur);
    
    ['aff-inc-1', 'aff-inc-2', 'aff-dp', 'aff-tax', 'aff-condo', 'aff-heat', 'aff-cc', 'aff-car', 'aff-loan'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('blur', formatOnBlur);
    });

    for(let i=0; i<4; i++) {
        const dpAmtField = document.getElementById(`pay-dp-amt-${i}`);
        if(dpAmtField) dpAmtField.addEventListener('blur', formatOnBlur);
        
        const dpPctField = document.getElementById(`pay-dp-pct-${i}`);
        if(dpPctField) dpPctField.addEventListener('blur', formatPercentOnBlur);
        
        const payRateField = document.getElementById(`pay-rate-${i}`);
        if(payRateField) payRateField.addEventListener('blur', formatPercentOnBlur);
        
        const refRateField = document.getElementById(`ref-rate-${i}`);
        if(refRateField) refRateField.addEventListener('blur', formatPercentOnBlur);
    }

    // Connect toggle buttons
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initial calculation
    updatePaymentCalculator();
    updateRefinanceCalculator();
    updateLandTransferTaxCalculator();
    updateAffordabilityCalculator();
};

/**
 * Mobile UX: Switch between mortgage scenarios (Plan 1-4)
 */
window.switchScenario = function(type, index) {
    // 1. Update Buttons
    const buttons = document.querySelectorAll(`[id^="${type}-btn-"]`);
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById(`${type}-btn-${index}`);
    if (activeBtn) activeBtn.classList.add('active');

    // 2. Update Grid Visibility
    const cells = document.querySelectorAll(`[data-type="${type}"][data-scenario]`);
    cells.forEach(cell => {
        if (parseInt(cell.getAttribute('data-scenario')) === index) {
            cell.classList.remove('mobile-hide');
        } else {
            cell.classList.add('mobile-hide');
        }
    });

    // 3. Sync Panel Dropdowns if Payment Calc
    if (type === 'pay') {
        const panelSelects = [
            document.getElementById('panel-scenario-select-1'),
            document.getElementById('panel-scenario-select-2'),
            document.getElementById('panel-scenario-select-3'),
            document.getElementById('panel-scenario-select-4')
        ];
        panelSelects.forEach(sel => {
            if (sel) sel.value = index;
        });
    }

    // 4. Update Chart Label/Data if applicable
    const chartLabel = document.getElementById(`${type}-chart-label`);
    if (chartLabel) {
        chartLabel.innerText = `Principal vs Total Interest (Plan ${index + 1})`;
    }

    // 4. Update Sticky Bar
    window.updateStickyBar(type, index);

    // 5. Trigger re-calculation for this scenario to update chart
    // This depends on your specific calculation triggered logic
    const priceInput = document.getElementById(`${type === 'pay' ? 'pay-price' : 'ref-amount'}`);
    if (priceInput) priceInput.dispatchEvent(new Event('input'));
};

/**
 * Mobile UX: Update the persistent sticky payment bar
 */
window.updateStickyBar = function(type, scenarioIndex) {
    const stickyBar = document.getElementById(`${type}-sticky`);
    if (!stickyBar) return;

    // Show sticky bar only if we have results
    const paymentVal = document.getElementById(`${type}-${type === 'pay' ? 'payment' : 'payment'}-${scenarioIndex}`);
    const stickyLabel = document.getElementById(`${type}-sticky-label`);
    const stickyVal = document.getElementById(`${type}-sticky-val`);

    if (paymentVal && paymentVal.innerText !== '<span class="skeleton-shimmer">$-</span>') {
        stickyBar.classList.add('active');
        if (stickyLabel) stickyLabel.innerText = `Plan ${scenarioIndex + 1} Monthly Payment`;
        if (stickyVal) stickyVal.innerText = paymentVal.innerText;
    } else {
        stickyBar.classList.remove('active');
    }
};

// Initial state for mobile scenarios
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure renderCalculators ran
    setTimeout(() => {
        if (window.innerWidth < 1024) {
            window.updateStickyBar('pay', 0);
            window.updateStickyBar('ref', 0);
        }
    }, 500);
});

// --- Calculator Breakdown & UI Utils ---
window.toggleCollapsible = function(headerElem) {
    const item = headerElem.parentElement;
    item.classList.toggle('active');
    
    const content = item.querySelector('.calc-collapsible-content');
    if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
    } else {
        content.style.maxHeight = "0";
    }
    
    // Recalculate surrounding max-heights if nested (not needed here but good practice)
};

window.formatOnBlurInline = function() {
    const val = parseCurrency(this.value);
    if(val >= 0) this.value = '$' + val.toLocaleString('en-US');
};

let paymentCalcTimeout = null;
window.updatePaymentCalculatorInputWait = function() {
    if (paymentCalcTimeout) clearTimeout(paymentCalcTimeout);
    paymentCalcTimeout = setTimeout(() => {
        updatePaymentCalculator();
    }, 400); // 400ms debounce
};

function updatePaymentBreakdown(price, dpAmt, rate, amort, freq, totalMortgage, payment) {
    if (!price || !totalMortgage) return;

    // 1. Cash needed to close
    animateValue('pay-close-dp', dpAmt);
    
    // Quick Toronto LTT estimation as placeholder
    let estimatedLTT = 0;
    if (price <= 55000) estimatedLTT = price * 0.005;
    else if (price <= 250000) estimatedLTT = 275 + (price - 55000) * 0.01;
    else if (price <= 400000) estimatedLTT = 2225 + (price - 250000) * 0.015;
    else if (price <= 2000000) estimatedLTT = 4475 + (price - 400000) * 0.02;
    else estimatedLTT = 36475 + (price - 2000000) * 0.025;
    estimatedLTT *= 2; // Approximate with Toronto Municipal added

    animateValue('pay-close-ltt', estimatedLTT);
    
    // Read from inputs
    const lawyerEl = document.getElementById('pay-input-lawyer');
    const titleEl = document.getElementById('pay-input-title');
    const inspectEl = document.getElementById('pay-input-inspect');
    const appraisalEl = document.getElementById('pay-input-appraisal');
    
    const lawyerFees = lawyerEl ? parseCurrency(lawyerEl.value) : 1000;
    const titleFees = titleEl ? parseCurrency(titleEl.value) : 900;
    const inspectFees = inspectEl ? parseCurrency(inspectEl.value) : 500;
    const appraisalFees = appraisalEl ? parseCurrency(appraisalEl.value) : 300;
    
    const totalCash = dpAmt + estimatedLTT + lawyerFees + titleFees + inspectFees + appraisalFees;
    animateValue('pay-close-total', totalCash);
    
    const hdrCloseTotal = document.getElementById('hdr-close-total');
    if (hdrCloseTotal) hdrCloseTotal.innerText = formatCurrency(totalCash);

    // 2. Monthly Expenses
    const monthlyPayment = (freq === 'biweekly') ? (payment * 26) / 12 : payment;
    animateValue('pay-exp-mortgage', monthlyPayment);
    
    const ptaxEl = document.getElementById('pay-input-ptax');
    const debtEl = document.getElementById('pay-input-debt');
    const utilsEl = document.getElementById('pay-input-utils');
    const pinsEl = document.getElementById('pay-input-pins');
    const phoneEl = document.getElementById('pay-input-phone');
    const netEl = document.getElementById('pay-input-net');
    
    // Optional smart default if empty
    if (ptaxEl && !ptaxEl.value && ptaxEl !== document.activeElement) {
        ptaxEl.value = '$' + Math.round((price * 0.0075) / 12).toLocaleString('en-US');
    }
    
    const ptax = ptaxEl ? parseCurrency(ptaxEl.value) : 0;
    const debt = debtEl ? parseCurrency(debtEl.value) : 0;
    const utils = utilsEl ? parseCurrency(utilsEl.value) : 0;
    const pins = pinsEl ? parseCurrency(pinsEl.value) : 0;
    const phone = phoneEl ? parseCurrency(phoneEl.value) : 0;
    const net = netEl ? parseCurrency(netEl.value) : 0;
    
    const totalExp = monthlyPayment + ptax + debt + utils + pins + phone + net;
    animateValue('pay-exp-total', totalExp);
    
    const hdrExpTotal = document.getElementById('hdr-exp-total');
    if (hdrExpTotal) hdrExpTotal.innerText = formatCurrency(totalExp);

    // 3. Interest rate risk Matrix
    const rStartBalEl = document.getElementById('risk-start-bal');
    if (rStartBalEl) animateValue('risk-start-bal', totalMortgage);
    
    // We will populate principal paid & end balance after the 5 year amort calculation below

    const elRate0 = document.getElementById('risk-rate-0');
    if (elRate0) elRate0.innerText = rate.toFixed(2) + '%';
    animateValue('risk-pmt-0', payment);

    const rMinus2 = Math.max(0, rate - 2.00);
    const elRateM2 = document.getElementById('risk-rate-minus2');
    if (elRateM2) elRateM2.innerText = rMinus2.toFixed(2) + '%';
    animateValue('risk-pmt-minus2', computePayment(totalMortgage, rMinus2, amort, freq));

    const rPlus2 = rate + 2.00;
    const elRateP2 = document.getElementById('risk-rate-plus2');
    if (elRateP2) elRateP2.innerText = rPlus2.toFixed(2) + '%';
    animateValue('risk-pmt-plus2', computePayment(totalMortgage, rPlus2, amort, freq));

    const rPlus5 = rate + 5.00;
    const elRateP5 = document.getElementById('risk-rate-plus5');
    if (elRateP5) elRateP5.innerText = rPlus5.toFixed(2) + '%';
    animateValue('risk-pmt-plus5', computePayment(totalMortgage, rPlus5, amort, freq));

    // 4. Amortization Schedule
    const r = rate / 100;
    const iMonths = Math.pow(1 + r/2, 2/12) - 1;
    let currentBalance = totalMortgage;
    let requiredMonthly = computePayment(totalMortgage, rate, amort, 'monthly');
    let tableHTML = '';
    
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    let chartLabels = [];
    let chartPrincipal = [];
    let chartInterest = [];
    let chartBalance = [];

    for (let year = 1; year <= amort; year++) {
        let principalYear = 0;
        let interestYear = 0;
        
        for (let m = 0; m < 12; m++) {
            let interestMonth = currentBalance * iMonths;
            let principalMonth = requiredMonthly - interestMonth;
            
            if (currentBalance < principalMonth) {
                principalMonth = currentBalance;
                interestMonth = currentBalance * iMonths;
            }
            
            principalYear += principalMonth;
            interestYear += interestMonth;
            currentBalance -= principalMonth;
            if (currentBalance < 0) currentBalance = 0;
        }
        
        totalPrincipalPaid += principalYear;
        totalInterestPaid += interestYear;

        // Collect chart data
        chartLabels.push(year);
        chartPrincipal.push(principalYear);
        chartInterest.push(interestYear);
        chartBalance.push(currentBalance);

        if (year === 5) { // Assuming a standard 5-year term for the matrix
            animateValue('risk-prin-paid', totalPrincipalPaid);
            animateValue('risk-end-bal', currentBalance);
        }

        // Show every year or milestone year
        if (year <= 5 || year % 5 === 0 || year === amort) {
            tableHTML += `
                <tr class="border-b border-brand-navy/5 hover:bg-brand-navy/5 transition-colors">
                    <td class="py-3 px-2 font-bold">${year}</td>
                    <td class="py-3 px-2">${formatCurrency(principalYear + interestYear)}</td>
                    <td class="py-3 px-2">${formatCurrency(principalYear)}</td>
                    <td class="py-3 px-2">${formatCurrency(interestYear)}</td>
                    <td class="py-3 px-2 text-right">${formatCurrency(currentBalance)}</td>
                </tr>
            `;
        }
    }
    
    // Store chart data globally for rendering when accordion is opened
    window.currentAmortData = {
        labels: chartLabels,
        principal: chartPrincipal,
        interest: chartInterest,
        balance: chartBalance
    };

    // If chart exists and is visible, auto-update
    if (window.amortChartBarInstance) {
        window.renderAmortizationChartTimeout();
    }
    
    const tableBody = document.getElementById('pay-amort-table');
    if (tableBody) tableBody.innerHTML = tableHTML;
}

// -------------------------------------------------------------
// Amortization Chart.js Logic
// -------------------------------------------------------------
window.amortChartBarInstance = null;
window.renderAmortizationChartTimeout = function() {
    setTimeout(() => {
        const ctx = document.getElementById('amortizationChartBar');
        if (!ctx || !window.currentAmortData) return;

        // Note: Chart.js might have zero height if display:none. The timeout + accordion transition helps.
        
        if (window.amortChartBarInstance) {
            window.amortChartBarInstance.destroy();
        }

        window.amortChartBarInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: window.currentAmortData.labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Balance',
                        data: window.currentAmortData.balance,
                        borderColor: '#0F1E2E',
                        backgroundColor: '#0F1E2E',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        yAxisID: 'y1'
                    },
                    {
                        type: 'bar',
                        label: 'Principal',
                        data: window.currentAmortData.principal,
                        backgroundColor: '#2D7AE0', // brand-primary
                        stacked: true,
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Interest',
                        data: window.currentAmortData.interest,
                        backgroundColor: '#B5D3F8', // lighter blue
                        stacked: true,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: { display: false },
                        ticks: {
                            callback: function(val, index) {
                                // show every 5 years roughly on x-axis
                                return index % 5 === 0 ? this.getLabelForValue(val) : '';
                            }
                        }
                    },
                    y: {
                        stacked: true,
                        position: 'left',
                        grid: { borderDash: [4, 4], color: 'rgba(15,30,46,0.05)' },
                        ticks: {
                            callback: function(value) { return '$' + (value/1000) + 'k'; }
                        }
                    },
                    y1: {
                        position: 'right',
                        grid: { display: false },
                        ticks: {
                            callback: function(value) { return '$' + (value/1000) + 'k'; }
                        }
                    }
                },
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                            padding: 20,
                            font: { family: 'Outfit', size: 12, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 30, 46, 0.9)',
                        padding: 12,
                        titleFont: { family: 'Outfit', size: 14 },
                        bodyFont: { family: 'Inter', size: 13 },
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }, 350); // wait for accordion to open
};

// -------------------------------------------------------------
// Historical Interest Rate Chart.js Logic
// -------------------------------------------------------------
window.historicalChartInstance = null;
window.renderHistoricalChartTimeout = function() {
    setTimeout(() => {
        const ctx = document.getElementById('historicalRateChart');
        if (!ctx) return;

        if (window.historicalChartInstance) {
            window.historicalChartInstance.destroy();
        }

        // Realistic data mapping roughly 2006-2024 from the benchmark graph
        const baseRates = [
            5.2, 5.4, 5.0, 5.6, 5.8, 5.2, 5.4, 3.8, 4.2, 3.8, 4.2, 3.6, 3.2, 3.0, 3.1,
            2.8, 2.6, 3.3, 2.8, 2.7, 2.4, 2.3, 2.4, 2.1, 2.8, 3.1, 3.2, 2.4, 2.5, 1.6,
            1.4, 1.7, 2.5, 4.4, 4.6, 4.3, 5.4, 4.8, 4.0, 3.8, 3.9, 3.8
        ];
        
        const hLabels = [];
        const minArray = [];
        const maxArray = [];
        const avgArray = [];
        const minVal = 1.40;
        const maxVal = 5.89;
        const avgVal = 3.42;

        for(let i=0; i<baseRates.length; i++) {
            // roughly mapping 42 points over 18 years
            let year = 2006 + (i * (18 / (baseRates.length - 1)));
            hLabels.push(Math.round(year));
            minArray.push(minVal);
            maxArray.push(maxVal);
            avgArray.push(avgVal);
        }

        window.historicalChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hLabels,
                datasets: [
                    {
                        label: 'Best 5yr fixed rates',
                        data: baseRates,
                        borderColor: '#0070B8', // Blue line
                        borderWidth: 2,
                        tension: 0.2, // Slight curve to match the graph's jaggy but smooth style
                        pointRadius: 0,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'Best 5yr fixed rates (Min.)',
                        data: minArray,
                        borderColor: '#2BA36A', // Green line
                        borderWidth: 1.5,
                        pointRadius: 0
                    },
                    {
                        label: 'Best 5yr fixed rates (Avg.)',
                        data: avgArray,
                        borderColor: '#FFA000', // Yellow/Orange line
                        borderWidth: 1.5,
                        pointRadius: 0
                    },
                    {
                        label: 'Best 5yr fixed rates (Max.)',
                        data: maxArray,
                        borderColor: '#DE5050', // Red line
                        borderWidth: 1.5,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            maxTicksLimit: 10,
                            callback: function(val, index) {
                                // show labels like '2008', '2010'
                                const lbl = this.getLabelForValue(val);
                                // Prevent duplicates and only show even years if it isn't cluttered
                                if (index % 4 === 0) return lbl; 
                                return '';
                            }
                        }
                    },
                    y: {
                        min: 1,
                        max: 7,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) { return value + '%'; }
                        },
                        grid: {
                            color: 'rgba(15,30,46,0.1)',
                            drawBorder: false,
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: false, // matches screenshot
                            boxWidth: 12,
                            boxHeight: 2
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });

    }, 300); // Wait for accordion animation
};
