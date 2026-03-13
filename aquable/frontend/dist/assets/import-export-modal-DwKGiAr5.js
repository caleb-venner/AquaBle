import{d as f}from"./main-DFOxvOhe.js";import{exportDeviceConfiguration as m,importDeviceConfiguration as p}from"./configurations-BzOxCh-6.js";import"./wattage-calculator-aI2XEFfd.js";async function C(o,c){var i,n,s;const t=document.createElement("div");t.className="modal-overlay";const e=f.getState();if(!((i=e.devices.get(o))==null?void 0:i.status)){console.error("Device not found:",o);return}(s=(n=e.devices.get(o))==null?void 0:n.configuration)!=null&&s.name,t.innerHTML=`
    <div class="modal-content import-export-modal" style="max-width: 500px; max-height: 90vh; overflow-y: auto;" data-device-id="${o}" data-device-type="${c}">
      <div class="modal-header">
        <h2>Import/Export Configuration</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove();">×</button>
      </div>

      <div class="modal-body">
        <div class="settings-section">
          <h3>Export Configuration</h3>
          <p style="color: #666; font-size: 0.9em; margin-bottom: 12px;">
            Download the current configuration as a JSON file. You can edit this file and import it back later.
          </p>
          <button class="btn btn-primary" onclick="window.handleExportConfig('${o}', '${c}')">
            Download Configuration
          </button>
        </div>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;">

        <div class="settings-section">
          <h3>Import Configuration</h3>
          <p style="color: #666; font-size: 0.9em; margin-bottom: 12px;">
            Select a JSON file previously exported from this device. The current configuration will be replaced.
          </p>
          <div class="file-input-wrapper">
            <input
              type="file"
              id="config-file-input"
              accept=".json"
              style="display: none;"
              onchange="window.handleImportFile('${o}', '${c}')"
            />
            <button class="btn btn-secondary" onclick="document.getElementById('config-file-input').click()">
              Choose File
            </button>
            <span id="file-name" style="margin-left: 12px; color: #666;"></span>
          </div>
          <div id="import-status" style="margin-top: 12px; display: none;">
            <div id="import-message" style="padding: 8px; border-radius: 4px;"></div>
          </div>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),t.addEventListener("click",l=>{l.target===t&&t.remove()})}async function u(o,c){try{const t=event==null?void 0:event.currentTarget,e=t==null?void 0:t.textContent;t&&(t.textContent="Exporting..."),t&&(t.disabled=!0);const r=await m(o),i={address:o,deviceType:c,config:r,exportedAt:new Date().toISOString()},n=JSON.stringify(i,null,2),s=new Blob([n],{type:"application/json"}),l=URL.createObjectURL(s),d=document.createElement("a");d.href=l,d.download=`${o.replace(/:/g,"-")}-config.json`,document.body.appendChild(d),d.click(),document.body.removeChild(d),URL.revokeObjectURL(l),t&&(t.textContent=e,t.disabled=!1),console.log("Configuration exported successfully")}catch(t){console.error("Export failed:",t);const e=event==null?void 0:event.currentTarget;e&&(e.textContent="Export failed",e.disabled=!1,setTimeout(()=>{e.textContent="Download Configuration"},3e3))}}async function g(o,c){var t;try{const e=document.getElementById("config-file-input"),r=(t=e==null?void 0:e.files)==null?void 0:t[0];if(!r)return;const i=document.getElementById("file-name");i&&(i.textContent=`Selected: ${r.name}`);const n=document.getElementById("import-status");n&&(n.style.display="block",n.style.opacity="0.5");const s=await r.text();let l;try{l=JSON.parse(s)}catch{throw new Error("Invalid JSON format in file")}if(!l.config||!l.address)throw new Error("File does not appear to be a valid AquaBle export");if(!confirm(`Replace configuration for ${o}?

This will overwrite the current settings.`)){n&&(n.style.display="none"),e.value="",i&&(i.textContent="");return}const a=document.getElementById("import-message");a&&(a.textContent="Importing...",a.style.backgroundColor="#e3f2fd",a.style.color="#1976d2");const y=await p(o,r);a&&(a.textContent="Configuration imported successfully!",a.style.backgroundColor="#e8f5e9",a.style.color="#388e3c"),e.value="",i&&setTimeout(()=>{i&&(i.textContent=""),n&&(n.style.display="none")},3e3),await f.getState().actions.refreshDeviceConfig(o,c),console.log("Configuration imported successfully")}catch(e){console.error("Import failed:",e);const r=document.getElementById("import-message");r&&(r.textContent=`Import failed: ${e instanceof Error?e.message:"Unknown error"}`,r.style.backgroundColor="#ffebee",r.style.color="#c62828");const i=document.getElementById("config-file-input");setTimeout(()=>{i.value="";const n=document.getElementById("file-name");n&&(n.textContent="")},3e3)}}window.handleExportConfig=u;window.handleImportFile=g;export{C as showImportExportModal};
//# sourceMappingURL=import-export-modal-DwKGiAr5.js.map
