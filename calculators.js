// calculators.js

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
                    <input type="text" inputmode="numeric" id="aff-inc-1" class="calc-input mb-3" placeholder="e.g. 100,000">
                    <input type="text" inputmode="numeric" id="aff-inc-2" class="calc-input" placeholder="Co-applicant's income (Optional)">
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
                        <span class="symbol" style="color:#666;">$</span>
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
                    <select id="aff-amort" class="calc-input outlined-soft">
                        ${amortOptions}
                    </select>
                </div>
            </div>

            <!-- Location -->
            <div class="aff-row">
                <div class="aff-label-col">
                    <span class="aff-row-title">Location of your future home</span>
                </div>
                <div class="aff-input-col">
                    <input type="text" inputmode="numeric" id="aff-loc" class="calc-input outlined-soft" value="Toronto, ON">
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
                    <input type="text" inputmode="numeric" id="aff-tax" class="calc-input outlined-soft mb-2" placeholder="Annual property tax">
                    <input type="text" inputmode="numeric" id="aff-condo" class="calc-input outlined-soft mb-2" placeholder="Monthly condo fees">
                    <input type="text" inputmode="numeric" id="aff-heat" class="calc-input outlined-soft" placeholder="Monthly heating costs">
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
                    <input type="text" inputmode="numeric" id="aff-cc" class="calc-input outlined-soft mb-2" placeholder="Credit card debt payment">
                    <input type="text" inputmode="numeric" id="aff-car" class="calc-input outlined-soft mb-2" placeholder="Car payment">
                    <input type="text" inputmode="numeric" id="aff-loan" class="calc-input outlined-soft" placeholder="Other loan expenses">
                </div>
            </div>

            <!-- Results Banner -->
            <div class="aff-results-banner glass-card" style="padding: 35px; border-radius: 2rem; margin-top: 30px; text-align: center; background: rgba(15, 30, 46, 0.05); border: 1.5px solid var(--color-primary);">
                <div class="flex items-center justify-center gap-3 mb-3">
                    <i class="ph ph-crown-simple text-brand-gold text-2xl"></i>
                    <h4 style="color: var(--color-navy); margin: 0; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.1em;">Maximum Affordable Home Price</h4>
                </div>
                <div id="aff-max-price" class="text-gold-elite" style="font-size: 3.5rem; line-height: 1;"><span class="skeleton-shimmer">$-</span></div>
                
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
                    <div class="calc-cell calc-span-4">
                        <div class="calc-input-group outlined">
                            <label class="floating-label flex items-center gap-2">
                                 <i class="ph ph-tag-silver text-[10px]"></i> Price
                                 <i class="ph ph-question tooltip-trigger" data-tip="The purchase price of the property."></i>
                            </label>
                            <input type="text" inputmode="numeric" id="ltt-price" placeholder="e.g. 800,000" class="fw-bold text-navy">
                        </div>
                    </div>
                    <div class="calc-input-group outlined">
                        <label class="floating-label flex items-center gap-2">
                            <i class="ph ph-map-pin text-[10px]"></i> Location
                            <i class="ph ph-question tooltip-trigger" data-tip="Toronto has its own municipal land transfer tax in addition to the provincial tax."></i>
                        </label>
                        <input type="text" id="ltt-location" value="Toronto, ON" class="text-navy">
                    </div>
                </div>

                <div class="ltt-checkbox-row" style="margin-bottom: 35px; display: flex; align-items: center; gap: 12px; padding: 15px; background: rgba(15, 30, 46, 0.03); border-radius: 1rem; border: 1px solid rgba(15, 30, 46, 0.05);">
                    <input type="checkbox" id="ltt-ftb" style="width:24px; height:24px; cursor:pointer; accent-color: var(--color-primary);" checked>
                    <label for="ltt-ftb" style="cursor:pointer; font-size: 1rem; font-weight: 700; color: var(--color-navy); font-family: 'Outfit', sans-serif;">I'm a first-time home buyer</label>
                </div>

                <div class="calc-tax-breakdown ltt-results-box" style="border: 2px solid var(--color-primary); background: #fff; border-radius: 2rem; padding: 30px;">
                    <div class="tax-row">
                        <span class="tax-label flex items-center gap-2"><i class="ph ph-bank text-brand-navy/30"></i> Provincial</span>
                        <span class="tax-val font-bold" id="ltt-prov"><span class="skeleton-shimmer">$-</span></span>
                    </div>
                    <div class="tax-row mt-4">
                        <span class="tax-label flex items-center gap-2"><i class="ph ph-city text-brand-navy/30"></i> Municipal</span>
                        <span class="tax-val font-bold" id="ltt-muni"><span class="skeleton-shimmer">$-</span></span>
                    </div>
                    <div class="tax-row mt-4 text-emerald-600">
                        <span class="tax-label flex items-center gap-2"><i class="ph ph-gift text-emerald-500/50"></i> Total Rebate</span>
                        <span class="tax-val font-bold" id="ltt-rebate"><span class="skeleton-shimmer">$-</span></span>
                    </div>
                    <div class="tax-row mt-8 pt-6 border-t flex justify-between items-center">
                        <span class="tax-label text-xl font-black text-brand-navy uppercase tracking-tighter" style="font-family: 'Outfit', sans-serif;">Total Land Transfer Tax</span>
                        <span class="text-3xl text-gold-elite" id="ltt-total"><span class="skeleton-shimmer">$-</span></span>
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
                        <div class="calc-input-group outlined border-red">
                            <label class="floating-label">Refinance Amount</label>
                            <input type="text" inputmode="numeric" id="ref-amount" class="text-navy" placeholder="e.g. 500,000">
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
                            <div class="calc-input-wrapper with-symbol">
                                <input type="text" inputmode="numeric" class="calc-input" id="ref-rate-${i}" placeholder="e.g. 4.5">
                                <span class="symbol">%</span>
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
                        <div class="flex justify-center py-10">
                            <div class="w-64 h-64 relative" id="ref-chart-container">
                                <!-- SVG Donut Chart -->
                                <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                                    <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="rgba(15, 30, 46, 0.05)" stroke-width="3"></circle>
                                    <circle id="ref-chart-interest" cx="18" cy="18" r="15.9" fill="transparent" stroke="var(--color-gold)" stroke-width="3" stroke-dasharray="0 100" stroke-linecap="round"></circle>
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <span class="text-[10px] uppercase tracking-widest text-brand-navy/40 font-bold">Interest %</span>
                                    <span class="text-3xl font-black text-brand-navy" id="ref-chart-pct">0%</span>
                                </div>
                            </div>
                        </div>
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
                        <div class="calc-input-group outlined">
                            <label class="floating-label">Purchase Price</label>
                            <input type="text" inputmode="numeric" id="pay-price" placeholder="e.g. 500,000" class="text-navy">
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
                            <div class="calc-input-wrapper with-symbol mb-2">
                                <input type="text" inputmode="numeric" class="calc-input" id="pay-dp-pct-${i}" placeholder="20">
                                <span class="symbol">%</span>
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
                            <div class="calc-input-wrapper with-symbol">
                                <input type="text" inputmode="numeric" class="calc-input" id="pay-rate-${i}" placeholder="Rate">
                                <span class="symbol">%</span>
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

            <div class="calc-collapsible-list mt-8">
                <div class="calc-collapsible">Cash needed to close</div>
                <div class="calc-collapsible">Monthly expenses</div>
                <div class="calc-collapsible">Interest rate risk</div>
                <div class="calc-collapsible">Amortization schedule</div>
            </div>

            <!-- Elite Features: Visuals & Export -->
            <div class="calc-elite-section mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div class="glass-card p-6 md:p-8 rounded-[2.5rem] border-brand-navy/5 bg-brand-navy/5 shadow-inner">
                    <h4 class="text-xl font-black mb-6 flex items-center gap-3 text-brand-navy">
                        <i class="ph ph-chart-pie text-brand-gold"></i>
                        Visual Analysis
                    </h4>
                    <div class="relative w-full min-h-[320px] max-w-[400px] mx-auto">
                        <div class="flex justify-center py-10">
                            <div class="w-64 h-64 relative" id="pay-chart-container">
                                <!-- SVG Donut Chart -->
                                <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                                    <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="rgba(15, 30, 46, 0.05)" stroke-width="3"></circle>
                                    <circle id="pay-chart-interest" cx="18" cy="18" r="15.9" fill="transparent" stroke="var(--color-gold)" stroke-width="3" stroke-dasharray="0 100" stroke-linecap="round"></circle>
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <span class="text-[10px] uppercase tracking-widest text-brand-navy/40 font-bold">Interest %</span>
                                    <span class="text-3xl font-black text-brand-navy" id="pay-chart-pct">0%</span>
                                </div>
                            </div>
                        </div>
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
            if (this.id.includes('pct') || this.id.includes('rate') || this.id.includes('tax')) {
                return;
            }
            
            let cursor = this.selectionStart;
            let oldLen = this.value.length;
            
            let val = this.value.replace(/[^\d]/g, '');
            if (val) {
                let formatted = parseInt(val).toLocaleString('en-CA');
                this.value = '$ ' + formatted;
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

            // Update visual analysis: Principal vs Total Interest
            const nMonths = amort * 12;
            const r = rate / 100;
            const iMonths = Math.pow(1 + r/2, 2/12) - 1;
            const monthlyPayment = totalMortgage * (iMonths * Math.pow(1 + iMonths, nMonths)) / (Math.pow(1 + iMonths, nMonths) - 1);
            const totalPaid = monthlyPayment * nMonths;
            const totalInterest = Math.max(0, totalPaid - totalMortgage);

            if (i === 0) {
                window.updateDonutChart('pay', totalMortgage, totalInterest, i);
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

            // Update chart for Scenario 1
            if (i === 0) {
                window.updateDonutChart('ref', principal, totalInterest, i);
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

function computeLTT(price, isToronto) {
    let provTax = 0;
    let muniTax = 0;

    // Provincial Tax Brackets
    if (price > 0) {
        provTax += Math.min(price, 55000) * 0.005;
        if (price > 55000) provTax += (Math.min(price, 250000) - 55000) * 0.01;
        if (price > 250000) provTax += (Math.min(price, 400000) - 250000) * 0.015;
        if (price > 400000) provTax += (Math.min(price, 2000000) - 400000) * 0.02;
        if (price > 2000000) provTax += (price - 2000000) * 0.025;
    }

    // Municipal Tax Brackets (Toronto)
    if (isToronto && price > 0) {
        muniTax += Math.min(price, 55000) * 0.005;
        if (price > 55000) muniTax += (Math.min(price, 250000) - 55000) * 0.01;
        if (price > 250000) muniTax += (Math.min(price, 400000) - 250000) * 0.015;
        if (price > 400000) muniTax += (Math.min(price, 2000000) - 400000) * 0.02;
        if (price > 2000000) muniTax += (price - 2000000) * 0.025;
    }

    return { provTax, muniTax };
}

function updateLandTransferTaxCalculator() {
    const priceInput = document.getElementById('ltt-price');
    const locInput = document.getElementById('ltt-location');
    const ftbInput = document.getElementById('ltt-ftb');

    if (!priceInput || !locInput || !ftbInput) return;

    let price = parseCurrency(priceInput.value);
    if (price <= 0) price = 0;

    const isToronto = locInput.value.toLowerCase().includes('toronto');
    const isFTB = ftbInput.checked;

    const { provTax, muniTax } = computeLTT(price, isToronto);

    let provRebate = 0;
    let muniRebate = 0;

    if (isFTB) {
        provRebate = Math.min(provTax, 4000);
        if (isToronto) {
            muniRebate = Math.min(muniTax, 4475);
        }
    }

    const totalRebate = provRebate + muniRebate;
    const totalTax = (provTax + muniTax) - totalRebate;

    document.getElementById('ltt-prov').innerText = formatCurrency(provTax);
    
    // Only show municipal if > 0 or if toronto
    if (isToronto || muniTax > 0) {
        document.getElementById('ltt-muni').innerText = formatCurrency(muniTax);
        document.getElementById('ltt-muni').parentElement.style.display = 'flex';
    } else {
        document.getElementById('ltt-muni').parentElement.style.display = 'none';
    }

    if (totalRebate > 0) {
        document.getElementById('ltt-rebate').innerText = formatCurrency(totalRebate);
        document.getElementById('ltt-rebate').parentElement.style.display = 'flex';
    } else {
        document.getElementById('ltt-rebate').parentElement.style.display = 'none';
    }

    animateValue('ltt-total', totalTax);
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

// Function exposed to main.js to initialize event listeners once DOM is ready
window.initCalculatorLogic = function() {
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
    const lttInputs = ['ltt-price', 'ltt-location', 'ltt-ftb'];
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

    if(payPrice) payPrice.addEventListener('blur', formatOnBlur);
    if(refAmount) refAmount.addEventListener('blur', formatOnBlur);
    if(lttPrice) lttPrice.addEventListener('blur', formatOnBlur);
    
    ['aff-inc-1', 'aff-inc-2', 'aff-dp', 'aff-tax', 'aff-condo', 'aff-heat', 'aff-cc', 'aff-car', 'aff-loan'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('blur', formatOnBlur);
    });

    for(let i=0; i<4; i++) {
        const dpField = document.getElementById(`pay-dp-amt-${i}`);
        if(dpField) dpField.addEventListener('blur', formatOnBlur);
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

window.updateDonutChart = function(type, principal, interest, scenarioIndex = 0) {
    const total = principal + interest;
    if (!total) return;
    const interestPct = (interest / total) * 100;
    const interestEl = document.getElementById(`${type}-chart-interest`);
    const pctEl = document.getElementById(`${type}-chart-pct`);
    const labelEl = document.getElementById(`${type}-chart-label`);
    
    if (interestEl && pctEl) {
        interestEl.setAttribute('stroke-dasharray', `${interestPct.toFixed(1)} 100`);
        pctEl.innerText = `${Math.round(interestPct)}%`;
        if (labelEl) labelEl.innerText = `Principal vs Total Interest (Plan ${scenarioIndex + 1})`;
    }
}

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
    const lttInputs = ['ltt-price', 'ltt-location', 'ltt-ftb'];
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

    if(payPrice) payPrice.addEventListener('blur', formatOnBlur);
    if(refAmount) refAmount.addEventListener('blur', formatOnBlur);
    if(lttPrice) lttPrice.addEventListener('blur', formatOnBlur);
    
    ['aff-inc-1', 'aff-inc-2', 'aff-dp', 'aff-tax', 'aff-condo', 'aff-heat', 'aff-cc', 'aff-car', 'aff-loan'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('blur', formatOnBlur);
    });

    for(let i=0; i<4; i++) {
        const dpField = document.getElementById(`pay-dp-amt-${i}`);
        if(dpField) dpField.addEventListener('blur', formatOnBlur);
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

    // 3. Update Chart Label/Data if applicable
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
