const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./main-CJFjn01Q.js","./wattage-calculator-aI2XEFfd.js","./main-CIFhb_5M.css"])))=>i.map(i=>d[i]);
import{s as l,c as v,u as o,_ as u}from"./main-CJFjn01Q.js";import"./wattage-calculator-aI2XEFfd.js";async function S(){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
    <div class="modal-content scan-connect-modal" style="max-width: 500px;">
      <div class="modal-header">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove();">×</button>
      </div>
      <div class="modal-body">
        ${y()}
      </div>
    </div>
  `,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.remove()}),await r(e)}function y(){return`
    <div class="scan-interface">
      <div class="scan-status">
        <div class="scan-spinner" style="display: none;"></div>
        <div class="scan-message">Click "Scan" to search for nearby devices</div>
      </div>

      <div class="scan-actions">
        <button class="btn btn-primary scan-button">
          Scan for Devices
        </button>
      </div>

      <div class="devices-list" style="display: none;">
        <h3>Found Devices</h3>
        <div class="devices-container">
          <!-- Devices will be populated here -->
        </div>
      </div>
    </div>
  `}async function r(e){const t=e.querySelector(".scan-button"),n=e.querySelector(".scan-spinner"),a=e.querySelector(".scan-message"),c=e.querySelector(".devices-list"),i=e.querySelector(".devices-container");try{t.disabled=!0,t.innerHTML='<span class="scan-spinner"></span> Scanning...',n.style.display="inline-block",a.textContent="Scanning for nearby aquarium devices...";const s=await l(5);t.disabled=!1,t.innerHTML="Scan Again",n.style.display="none",s.length===0?(a.textContent="No aquarium devices found. Try moving closer or check device power.",c.style.display="none"):(a.textContent=`Found ${s.length} device${s.length!==1?"s":""}`,i.innerHTML=s.map(d=>b(d)).join(""),c.style.display="block",p(e))}catch(s){t.disabled=!1,t.innerHTML="Try Again",n.style.display="none",a.textContent=`Scan failed: ${s instanceof Error?s.message:"Unknown error"}`,c.style.display="none",console.error("Scan failed:",s)}}function b(e){return`
    <div class="device-card" data-address="${e.address}">
      <div class="device-info">
        <div class="device-name">${e.product}</div>
        <div class="device-address">${e.address}</div>
      </div>
      <div class="device-actions">
        <button class="btn btn-success btn-sm connect-button" data-address="${e.address}">
          Connect
        </button>
      </div>
    </div>
  `}async function f(e,t){const n=t.querySelector(`[data-address="${e}"] .connect-button`),a=n.textContent;try{n.disabled=!0,n.innerHTML='<span class="scan-spinner"></span> Connecting...',await v(e),n.className="btn btn-success btn-sm",n.innerHTML="✓ Connected",o().addNotification({type:"success",message:`Successfully connected to ${e}`});const{refreshDeviceStatusOnly:c}=await u(async()=>{const{refreshDeviceStatusOnly:i}=await import("./main-CJFjn01Q.js").then(s=>s.f);return{refreshDeviceStatusOnly:i}},__vite__mapDeps([0,1,2]),import.meta.url);await c(),setTimeout(()=>{t.remove()},1500)}catch(c){n.disabled=!1,n.textContent=a,n.className="btn btn-danger btn-sm",o().addNotification({type:"error",message:`Failed to connect to ${e}: ${c instanceof Error?c.message:"Unknown error"}`}),console.error("Connection failed:",c)}}function p(e){const t=e.querySelector(".scan-button");t&&t.addEventListener("click",()=>r(e));const n=e.querySelector(".devices-container");n&&n.addEventListener("click",a=>{const i=a.target.closest(".connect-button");if(i){const s=i.dataset.address;s&&f(s,e)}})}export{S as showScanConnectModal};
//# sourceMappingURL=scan-connect-modal-CMaK3J6i.js.map
