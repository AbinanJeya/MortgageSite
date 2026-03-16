// calculators.js

function getAffordabilityCalculatorHTML() {
    let amortOptions = '';
    for(let i=1; i<=30; i++) {
        amortOptions += `<option value="${i}" ${i === 25 ? 'selected' : ''}>${i}-year</option>`;
    }

    return `
        <div class="aff-calculator">
            <div class="aff-header" style="padding: 15px 0; border-bottom: 1px solid #eee; margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background: #00877a; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
                    <span style="font-weight: 500;">Calculate your maximum affordability</span>
                    <i class="ph ph-caret-up" style="margin-left: auto;"></i>
                </div>
            </div>

            <!-- Annual Income -->
            <div class="aff-row">
                <div class="aff-label-col">
                    <span class="aff-row-title">Annual income</span>
                    <p class="aff-row-desc">Your gross income before-tax, including any bonuses and supplementary income.</p>
                </div>
                <div class="aff-input-col">
                    <input type="text" id="aff-inc-1" class="calc-input outlined-soft mb-2" placeholder="Your income">
                    <input type="text" id="aff-inc-2" class="calc-input outlined-soft" placeholder="Co-applicant's income">
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
                        <input type="text" id="aff-dp" class="calc-input outlined-soft" placeholder="Enter amount">
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
                    <input type="text" id="aff-loc" class="calc-input outlined-soft" value="Toronto, ON">
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
                    <input type="text" id="aff-tax" class="calc-input outlined-soft mb-2" placeholder="Annual property tax">
                    <input type="text" id="aff-condo" class="calc-input outlined-soft mb-2" placeholder="Monthly condo fees">
                    <input type="text" id="aff-heat" class="calc-input outlined-soft" placeholder="Monthly heating costs">
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
                    <input type="text" id="aff-cc" class="calc-input outlined-soft mb-2" placeholder="Credit card debt payment">
                    <input type="text" id="aff-car" class="calc-input outlined-soft mb-2" placeholder="Car payment">
                    <input type="text" id="aff-loan" class="calc-input outlined-soft" placeholder="Other loan expenses">
                </div>
            </div>

            <!-- Results Banner -->
            <div class="aff-results-banner" style="background: #f8fcfb; border: 1px solid #d3eeeb; padding: 25px; border-radius: 8px; margin-top: 20px; text-align: center;">
                <h4 style="color: #333; margin-bottom: 10px; font-weight: 500;">Maximum affordable house price</h4>
                <div id="aff-max-price" style="font-size: 2.5rem; font-weight: 700; color: #00877a;">$-</div>
                
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px; font-size: 0.95rem; color: #666;">
                    <div>Estimated monthly mortgage: <span id="aff-max-payment" style="font-weight: 600; color: #333;">$-</span></div>
                </div>
            </div>
        </div>
    `;
}

function getLandTransferTaxCalculatorHTML() {
    return `
        <div class="ltt-calculator">
            <div class="ltt-top-row" style="display: flex; gap: 20px; margin-bottom: 20px;">
                <div class="calc-input-group outlined" style="flex: 1;">
                    <label class="floating-label">Price</label>
                    <input type="text" id="ltt-price" placeholder="$ Enter amount" class="fw-bold">
                </div>
                <div class="calc-input-group outlined" style="flex: 1;">
                    <label class="floating-label">Location</label>
                    <input type="text" id="ltt-location" value="Toronto, ON">
                </div>
            </div>

            <div class="ltt-checkbox-row" style="margin-bottom: 30px; display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" id="ltt-ftb" style="width:18px; height:18px; cursor:pointer;" checked>
                <label for="ltt-ftb" style="cursor:pointer; font-size: 0.95rem;">I'm a first time home buyer</label>
            </div>

            <div class="calc-tax-breakdown ltt-results-box">
                <div class="tax-row">
                    <span class="tax-label">Provincial</span>
                    <i class="ph ph-question info-icon" style="margin-left:auto; margin-right:10px;"></i>
                    <span class="tax-val" id="ltt-prov">$-</span>
                </div>
                <div class="tax-row mt-3">
                    <span class="tax-label"><span class="text-blue">+</span> Municipal</span>
                    <i class="ph ph-question info-icon" style="margin-left:auto; margin-right:10px;"></i>
                    <span class="tax-val" id="ltt-muni">$-</span>
                </div>
                <div class="tax-row mt-3">
                    <span class="tax-label"><span class="text-blue">-</span> Rebate</span>
                    <i class="ph ph-question info-icon" style="margin-left:auto; margin-right:10px;"></i>
                    <span class="tax-val" id="ltt-rebate">$-</span>
                </div>
                <div class="tax-row fw-bold highlight-row bg-light-blue mt-4 pt-3 pb-3 border-top" style="display:flex; justify-content:space-between;">
                    <span class="tax-label text-blue"><span class="text-blue">=</span> Land transfer tax</span>
                    <span class="tax-val text-blue" id="ltt-total">$-</span>
                </div>
            </div>
        </div>
    `;
}

function getRefinanceCalculatorHTML() {
    let amortOptions = '';
    for(let i=1; i<=30; i++) {
        amortOptions += `<option value="${i}" ${i === 25 ? 'selected' : ''}>${i}-year</option>`;
    }

    return `
        <div class="calc-grid payment-grid">
            <!-- Row 1: Start Here -->
            <div class="calc-cell label-cell" style="display:flex;align-items:center;">
                <span style="font-weight:600;margin-right:0.5rem;">Start here</span> 
                <i class="ph ph-arrow-right"></i>
            </div>
            <div class="calc-cell calc-span-2">
                <div class="calc-input-group outlined border-red">
                    <label class="floating-label text-red">Mortgage amount</label>
                    <input type="text" id="ref-amount" class="text-red">
                </div>
            </div>
            <div class="calc-cell calc-span-2" style="display:flex; gap:10px;">
                <div class="calc-input-group outlined" style="flex:1;">
                    <label class="floating-label">Location</label>
                    <input type="text" id="ref-location" value="Toronto, ON">
                </div>
                <div class="calc-input-group outlined" style="flex:1;">
                    <label class="floating-label">Original down payment %</label>
                    <select id="ref-orig-dp">
                        <option value="less_20">Less than 20%</option>
                        <option value="more_20">20% or more</option>
                    </select>
                </div>
            </div>

            <div class="calc-divider calc-span-5"></div>

            <!-- Row 2: Amortization -->
            <div class="calc-cell label-cell">
                Amortization
                <i class="ph ph-question info-icon"></i>
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell">
                    <select class="calc-input" id="ref-amort-${i}">
                        ${amortOptions}
                    </select>
                </div>
            `).join('')}

            <!-- Row 3: Mortgage rate -->
            <div class="calc-cell label-cell">
                Mortgage rate
                <i class="ph ph-question info-icon"></i>
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell">
                    <div class="calc-input-wrapper with-symbol">
                        <input type="text" class="calc-input" id="ref-rate-${i}" placeholder="Rate">
                        <span class="symbol">%</span>
                    </div>
                </div>
            `).join('')}

            <!-- Row 4: Payment frequency -->
            <div class="calc-cell label-cell">
                Payment frequency
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell">
                    <select class="calc-input" id="ref-freq-${i}">
                        <option value="monthly">Monthly</option>
                        <option value="semi-monthly">Semi-monthly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            `).join('')}

            <!-- Row 5: Mortgage payment -->
            <div class="calc-cell label-cell highlight-row bg-light-blue border-bottom-0">
                <span class="text-blue">=</span> <span class="text-blue">Mortgage payment</span>
                <i class="ph ph-question info-icon"></i>
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell highlight-row bg-light-blue calc-readonly text-blue fw-bold border-bottom-0" id="ref-payment-${i}">$-</div>
            `).join('')}
        </div>
        
        <div class="calc-collapsible-list" style="margin-top: 2rem;">
            <div class="calc-collapsible disabled">Monthly expenses</div>
            <div class="calc-collapsible disabled">Interest rate risk</div>
            <div class="calc-collapsible disabled">Amortization schedule</div>
        </div>
    `;
}

function getPaymentCalculatorHTML() {
    return `
        <div class="calc-grid payment-grid">
            <!-- Row 1: Start Here -->
            <div class="calc-cell label-cell" style="display:flex;align-items:center;">
                <span style="font-weight:600;margin-right:0.5rem;">Start here</span> 
                <i class="ph ph-arrow-right"></i>
            </div>
            <div class="calc-cell calc-span-2">
                <div class="calc-input-group outlined border-red">
                    <label class="floating-label text-red">Price</label>
                    <input type="text" id="pay-price" class="text-red">
                </div>
                <div class="error-badge bg-red text-white" style="display:none;">Please enter a valid number</div>
            </div>
            <div class="calc-cell calc-span-2">
                <div class="calc-input-group outlined">
                    <label class="floating-label">Location</label>
                    <input type="text" id="pay-location" value="Toronto, ON">
                </div>
            </div>

            <div class="calc-divider calc-span-5"></div>

            <!-- Row 2: Down Payment -->
            <div class="calc-cell label-cell">
                <span class="text-blue">-</span> Down payment
                <i class="ph ph-question info-icon"></i>
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell flex-col">
                    <div class="calc-input-wrapper with-symbol mb-2">
                        <input type="text" class="calc-input" id="pay-dp-pct-${i}">
                        <span class="symbol">%</span>
                    </div>
                    <div class="calc-input-wrapper with-symbol text-red">
                        <span class="symbol">$</span>
                        <input type="text" class="calc-input" id="pay-dp-amt-${i}" placeholder="Enter amount">
                    </div>
                </div>
            `).join('')}

            <!-- Row 3: CMHC -->
            <div class="calc-cell label-cell">
                <span class="text-blue">+</span> CMHC insurance
                <i class="ph ph-question info-icon"></i>
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell calc-readonly text-blue fw-bold" id="pay-cmhc-${i}">$-</div>
            `).join('')}

            <!-- Row 4: Total Mortgage -->
            <div class="calc-cell label-cell highlight-row bg-light-blue calc-span-1">
                <span class="text-blue">=</span> <span class="text-blue">Total mortgage</span>
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell highlight-row bg-light-blue calc-readonly text-blue fw-bold" id="pay-total-${i}">$-</div>
            `).join('')}

            <!-- Row 5: Amortization -->
            <div class="calc-cell label-cell">
                Amortization
                <i class="ph ph-question info-icon"></i>
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell">
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
                <div class="calc-cell">
                    <div class="calc-input-wrapper with-symbol">
                        <input type="text" class="calc-input" id="pay-rate-${i}" placeholder="Rate">
                        <span class="symbol">%</span>
                    </div>
                </div>
            `).join('')}

            <!-- Row 7: Payment Frequency -->
            <div class="calc-cell label-cell">
                Payment frequency
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell">
                    <select class="calc-input" id="pay-freq-${i}">
                        <option value="monthly">Monthly</option>
                        <option value="biweekly">Bi-weekly</option>
                    </select>
                </div>
            `).join('')}

            <!-- Row 8: Mortgage Payment -->
            <div class="calc-cell label-cell highlight-row bg-light-blue border-bottom-0">
                <span class="text-blue">=</span> <span class="text-blue">Mortgage payment</span>
                <i class="ph ph-question info-icon"></i>
            </div>
            ${[...Array(4)].map((_, i) => `
                <div class="calc-cell highlight-row bg-light-blue calc-readonly text-blue fw-bold border-bottom-0" id="pay-payment-${i}">$-</div>
            `).join('')}
        </div>
        
        <div class="calc-bottom-section">
            <div class="calc-bottom-left">
                <p class="fw-bold mb-2" style="font-size: 0.95rem;">Are you a first time home buyer?</p>
                <div class="toggle-group">
                    <button class="toggle-btn">Yes</button>
                    <button class="toggle-btn active">No</button>
                </div>
            </div>
            <div class="calc-bottom-right calc-tax-breakdown">
                <div class="tax-row">
                    <span class="tax-label">Provincial</span>
                    <span class="tax-dots"></span>
                    <span class="tax-val">$-</span>
                </div>
                <div class="tax-row">
                    <span class="tax-label"><span class="text-blue">+</span> Municipal</span>
                    <span class="tax-dots"></span>
                    <span class="tax-val">$-</span>
                </div>
                <div class="tax-row">
                    <span class="tax-label"><span class="text-blue">-</span> Rebate</span>
                    <span class="tax-dots"></span>
                    <span class="tax-val">$-</span>
                </div>
                <div class="tax-row fw-bold mt-2 pt-2 border-top">
                    <span class="tax-label">Land transfer tax</span>
                    <span class="tax-dots"></span>
                    <span class="tax-val">$-</span>
                </div>
            </div>
        </div>

        <div class="calc-collapsible-list">
            <div class="calc-collapsible">Cash needed to close</div>
            <div class="calc-collapsible">Monthly expenses</div>
            <div class="calc-collapsible">Interest rate risk</div>
            <div class="calc-collapsible">Amortization schedule</div>
        </div>
    `;
}

// Function exposed to main.js to generate the HTML structure
window.renderCalculators = function() {
    return `
        <section class="section calculators-section" id="calculators">
            <div class="container">
                <h2 class="section-title">Mortgage Calculators</h2>
                <p class="section-subtitle">Use our interactive tools to estimate your payments, affordability, and more.</p>
                
                <div class="calculator-container">
                    <!-- Tab Navigation -->
                    <div class="calculator-tabs">
                        <button class="calc-tab active" onclick="switchCalculator('payment')">
                            <i class="ph-fill ph-calculator"></i>
                            <span>Payment Calculator</span>
                        </button>
                        <button class="calc-tab" onclick="switchCalculator('refinance')">
                            <i class="ph-fill ph-house-line"></i>
                            <span>Refinance Calculator</span>
                        </button>
                        <button class="calc-tab" onclick="switchCalculator('land-transfer')">
                            <i class="ph-fill ph-tree"></i>
                            <span>Land Transfer Tax Calculator</span>
                        </button>
                        <button class="calc-tab" onclick="switchCalculator('affordability')">
                            <i class="ph-fill ph-piggy-bank"></i>
                            <span>Affordability Calculator</span>
                        </button>
                    </div>

                    <!-- Calculator Bodies -->
                    <div class="calculator-bodies">
                        <!-- Payment Calculator -->
                        <div id="calc-payment" class="calc-body active">
                            ${getPaymentCalculatorHTML()}
                        </div>

                        <!-- Refinance Calculator -->
                        <div id="calc-refinance" class="calc-body">
                            ${getRefinanceCalculatorHTML()}
                        </div>

                        <!-- Land Transfer Tax Calculator -->
                        <div id="calc-land-transfer" class="calc-body">
                            ${getLandTransferTaxCalculatorHTML()}
                        </div>

                        <!-- Affordability Calculator -->
                        <div id="calc-affordability" class="calc-body">
                            ${getAffordabilityCalculatorHTML()}
                        </div>
                    </div>
                </div>
            </div>
        </section>
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

// --- Calculator Logic & Math --- \\

function formatCurrency(num) {
    if (isNaN(num) || num === null) return '$-';
    return '$' + Math.round(num).toLocaleString('en-CA');
}

function parseCurrency(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/[\$,,\s]/g, '')) || 0;
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
        
        // Let's assume user interacts with DP%. Calculate DP$ if valid price.
        if (price > 0 && !isNaN(dpPct) && document.activeElement === dpPctInput) {
            dpAmt = price * (dpPct / 100);
            dpAmtInput.value = formatCurrency(dpAmt).replace('$', '');
        } else if (price > 0 && !isNaN(dpAmt) && document.activeElement === dpAmtInput) {
            dpPct = (dpAmt / price) * 100;
            dpPctInput.value = dpPct.toFixed(2);
        } else if (price > 0 && isNaN(dpPct) && !isNaN(dpAmt)) {
            dpPct = (dpAmt / price) * 100;
            dpPctInput.value = dpPct.toFixed(2);
        } else if (price > 0 && !isNaN(dpPct) && isNaN(dpAmt)) {
            dpAmt = price * (dpPct / 100);
            dpAmtInput.value = formatCurrency(dpAmt).replace('$', '');
        }

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
                cmhcOutput.innerText = '$-';
                totalOutput.innerText = '$-';
                paymentOutput.innerText = '$-';
                continue;
            }

            const totalMortgage = (price - dpAmt) + cmhc;
            const payment = computePayment(totalMortgage, rate, amort, freq);

            cmhcOutput.innerText = formatCurrency(cmhc);
            totalOutput.innerText = formatCurrency(totalMortgage);
            paymentOutput.innerText = formatCurrency(payment);
        } else {
            cmhcOutput.innerText = '$-';
            totalOutput.innerText = '$-';
            paymentOutput.innerText = '$-';
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
            paymentOutput.innerText = formatCurrency(payment);
        } else {
            paymentOutput.innerText = '$-';
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

    document.getElementById('ltt-total').innerText = formatCurrency(totalTax);
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
    
    const amort = parseInt(document.getElementById('aff-amort')?.value) || 25;
    
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
            priceEl.innerText = formatCurrency(maxPrice);
            paymentEl.innerText = formatCurrency(maxPayment);
        } else {
            priceEl.innerText = '$-';
            paymentEl.innerText = '$-';
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
