import{c,g as a,a as n,f as t}from"./wattage-calculator-aI2XEFfd.js";function o(){window.calculateWattageFunc=c,window.getMaxWattageFunc=a,window.getTheoreticalMaxWattageFunc=n,window.formatWattageFunc=t,document.body.insertAdjacentHTML("beforeend",`
                <div class="calculator">
                    <h2>Device Specifications</h2>
                    <p><strong>Actual Maximum Wattage:</strong> ${t(a())} (power supply limited)</p>
                    <p><strong>Theoretical Maximum:</strong> ${t(n())} (if no power limiting)</p>
                    <p><strong>Model:</strong> WRGB Pro II</p>
                    <p><strong>Power Limiting:</strong> Channels scaled down proportionally when total exceeds 138W</p>
                </div>
            `),["red","green","blue","white"].forEach(i=>{const e=document.getElementById(i);e&&e.addEventListener("input",calculateWattage)}),calculateWattage(),console.log("Page initialized successfully with wattage calculator functions")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o):o();
//# sourceMappingURL=wattage-test-DAj2zeK2.js.map
