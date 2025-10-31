const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./main-CJFjn01Q.js","./wattage-calculator-aI2XEFfd.js","./main-CIFhb_5M.css"])))=>i.map(i=>d[i]);
import{d as u,g as h,a as f,b as g,e as y,_ as p}from"./main-CJFjn01Q.js";import"./wattage-calculator-aI2XEFfd.js";async function $(t,n){var c;const e=document.createElement("div");if(e.className="modal-overlay",!((c=u.getState().devices.get(t))==null?void 0:c.status)){console.error("Device not found:",t);return}let a=null;try{const o=await h(t);a={id:o.id,name:o.name,autoReconnect:o.autoReconnect,headNames:o.headNames,createdAt:o.createdAt,updatedAt:o.updatedAt}}catch(o){console.error("Failed to load device configuration:",o)}const d=(a==null?void 0:a.name)||t;e.innerHTML=`
    <div class="modal-content device-config-modal" style="max-width: 600px; max-height: 90vh; overflow-y: auto;" data-device-id="${t}" data-device-type="${n}">
      <div class="modal-header">
        <h2>Device Configuration: ${d}</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove();">×</button>
      </div>

      <div class="modal-body">
        ${b(t,n,a)}
      </div>
    </div>
  `,document.body.appendChild(e),e.addEventListener("click",o=>{o.target===e&&e.remove()}),window.saveDeviceConfig=async()=>{await D(t,n,e)},window.showImportExportModal=async(o,m)=>{await f(o,m)}}function b(t,n,e){const l=(e==null?void 0:e.name)||"",r=(e==null?void 0:e.autoReconnect)||!1;return`
    <div class="settings-section">
      <h3>Device Information</h3>

      <div class="form-group">
        <label for="device-nickname">Device Nickname</label>
        <input
          type="text"
          id="device-nickname"
          class="form-control"
          value="${l}"
          placeholder="Device Name"
        />
        <small class="form-text">Custom name displayed in the interface</small>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            id="auto-reconnect"
            ${r?"checked":""}
          />
          <span>Auto Connect on Startup</span>
        </label>
        <small class="form-text">Automatically connect to this device when the service starts</small>
      </div>

      ${n==="doser"?w(e):""}

      <div class="form-actions">
        <button class="btn btn-primary" onclick="saveDeviceConfig()">
          Save Settings
        </button>
        <button class="btn btn-secondary" onclick="showImportExportModal('${t}', '${n}')">
          Import/Export
        </button>
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove();">
          Cancel
        </button>
      </div>
    </div>
  `}function w(t){const n=(t==null?void 0:t.headNames)||{};return`
    <div class="form-group">
      <h4>Head Names</h4>
      <p class="form-text">Customize the names for each dosing head</p>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px;">
        ${[1,2,3,4].map(e=>`
          <div>
            <label for="head-name-${e}">Head ${e}</label>
            <input
              type="text"
              id="head-name-${e}"
              class="form-control"
              value="${n[e]||""}"
              placeholder="Head ${e}"
            />
          </div>
        `).join("")}
      </div>
    </div>
  `}async function D(t,n,e){var l,r;try{const a=((l=document.getElementById("device-nickname"))==null?void 0:l.value)||"",d=((r=document.getElementById("auto-reconnect"))==null?void 0:r.checked)||!1,c={id:t,name:a||void 0,autoReconnect:d};if(n==="doser"){const i={};for(let s=1;s<=4;s++){const v=document.getElementById(`head-name-${s}`);v&&v.value.trim()&&(i[s]=v.value.trim())}Object.keys(i).length>0&&(c.headNames=i)}await g(t,{name:c.name,headNames:c.headNames}),await y(t,{autoReconnect:c.autoReconnect}),u.getState().actions.addNotification({type:"success",message:"Settings saved successfully"});const{invalidateMetadataCache:o}=await p(async()=>{const{invalidateMetadataCache:i}=await import("./cache-service-BKX54X_n.js");return{invalidateMetadataCache:i}},[],import.meta.url);o();const{loadAllDashboardData:m}=await p(async()=>{const{loadAllDashboardData:i}=await import("./main-CJFjn01Q.js").then(s=>s.f);return{loadAllDashboardData:i}},__vite__mapDeps([0,1,2]),import.meta.url);await m(),e.remove()}catch(a){console.error("Failed to save settings:",a),u.getState().actions.addNotification({type:"error",message:`Failed to save settings: ${a instanceof Error?a.message:"Unknown error"}`})}}export{$ as showDeviceConfigModal};
//# sourceMappingURL=device-config-modal-DG5pdQpf.js.map
