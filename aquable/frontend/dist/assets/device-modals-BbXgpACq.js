import{executeCommand as y}from"./commands-BJ6ojNfp.js";import{d as b}from"./main-CJFjn01Q.js";import"./wattage-calculator-aI2XEFfd.js";function p(e){const a=b.getState().configurations.lights.get(e);return a&&a.channels&&a.channels.length>0?a.channels.map(s=>s.label||s.key):["Channel 1","Channel 2","Channel 3","Channel 4"]}function S(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
    <div class="modal-content doser-config-modal" style="max-width: 600px; max-height: 90vh; overflow-y: auto;" data-device-id="${e.id}">
      <div class="modal-header">
        <h2>Doser Settings: ${e.name||e.id}</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove();">×</button>
      </div>
      <div class="modal-body">
        ${D(e)}
      </div>
    </div>
  `,document.body.appendChild(t);const a=t.querySelector(".modal-content.doser-config-modal");a&&(a._doserDeviceData=e),t.addEventListener("click",s=>{s.target===t&&t.remove()})}function C(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
    <div class="modal-content light-settings-modal" style="max-width: 540px; max-height: 90vh; overflow-y: auto;" data-device-id="${e.id}" data-address="${e.id}">
      <div class="modal-header">
        <h2>Light Settings: ${e.name||e.id}</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove();">×</button>
      </div>
      <div class="modal-body">
        ${L(e)}
      </div>
    </div>
  `,document.body.appendChild(t);const a=t.querySelector(".modal-content.light-settings-modal");a&&(a._lightDeviceData=e),t.addEventListener("click",s=>{s.target===t&&t.remove()})}function D(e){return`
    <div class="doser-config-interface">
      <!-- Head Selector Section -->
      <div class="config-section">
        <div class="heads-grid">
          ${k(e)}
        </div>
      </div>

      <!-- Command Interface Section -->
      <div class="config-section">
        <div id="command-interface">
          <div class="no-head-selected">
            <h4>No Head Selected</h4>
            <p>Select a dosing head above to configure its schedule and settings.</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove();">
          Close
        </button>
      </div>
    </div>
  `}function k(e){var s;let t=[];try{if(e.configurations&&e.configurations.length>0){const o=e.configurations.find(n=>n.id===e.activeConfigurationId)||e.configurations[0];if(o&&o.revisions&&o.revisions.length>0){const n=o.revisions[o.revisions.length-1];n.heads&&Array.isArray(n.heads)&&(t=n.heads)}}}catch(o){console.warn("Error extracting configured heads, will use defaults:",o),t=[]}const a=[];for(let o=1;o<=4;o++){const n=t.find(r=>r.index===o),l=((s=e.headNames)==null?void 0:s[o])||`Head ${o}`;n?(n.label=l,a.push(n)):a.push({index:o,label:l,active:!1,schedule:{mode:"single",dailyDoseMl:10,startTime:"09:00"},recurrence:{days:["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]},missedDoseCompensation:!1,calibration:{mlPerSecond:1,lastCalibratedAt:new Date().toISOString()}})}return`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
      ${a.map(o=>M(o)).join("")}
    </div>
  `}function M(e){var n,l,r,u,m,i,d;const t=e.label||`Head ${e.index}`,a=e.active?"Active":"Disabled",s=e.active?"var(--success)":"var(--gray-400)",o=T((n=e.schedule)==null?void 0:n.mode);return`
    <div class="dose-head-card ${e.active?"active":"inactive"}" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; cursor: pointer; transition: all 0.2s ease;" onclick="selectDoseHead(${e.index})">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${t}</div>
          <div style="font-size: 11px; color: ${s}; font-weight: 600; padding: 3px 6px; background: ${s}20; border-radius: 12px; white-space: nowrap;">${a}</div>
        </div>
        <div style="font-size: 11px; color: var(--primary); font-weight: 500; white-space: nowrap;">Configure →</div>
      </div>

      <div style="font-size: 12px; color: var(--text-secondary);">
        ${e.active?`${o} • ${((l=e.schedule)==null?void 0:l.mode)==="single"?`${e.schedule.dailyDoseMl||0}ml at ${e.schedule.startTime||"00:00"}`:((r=e.schedule)==null?void 0:r.mode)==="every_hour"?`${e.schedule.dailyDoseMl||0}ml total`:"Custom schedule"}`:`${o}${((m=(u=e.recurrence)==null?void 0:u.days)==null?void 0:m.length)===7?" • Daily":(d=(i=e.recurrence)==null?void 0:i.days)!=null&&d.length?` • ${e.recurrence.days.length}d/w`:""}`}
      </div>
    </div>
  `}function T(e){switch(e){case"single":return"Daily Dose";case"every_hour":return"24 Hour";case"custom_periods":return"Custom Periods";case"timer":return"Timer";default:return"Disabled"}}function A(e){var u,m;const t=document.querySelector(".doser-config-modal");if(!t)return;const a=t.querySelector("#command-interface");if(!a)return;const s=t.getAttribute("data-device-id");if(!s)return;const o=b.getState();let n=o.configurations.dosers.get(s);if(!n){const i=o.devices.get(s);if(i!=null&&i.status)n={id:s,name:i.status.address,kind:"doser",headNames:{}};else{console.error("No device found in store for:",s);return}}let l=null;try{if(n.configurations&&n.configurations.length>0){const i=n.configurations.find(d=>d.id===n.activeConfigurationId)||n.configurations[0];if(i&&i.revisions&&i.revisions.length>0){const d=i.revisions[i.revisions.length-1];d.heads&&Array.isArray(d.heads)&&(l=d.heads.find(f=>f.index===e)||null)}}}catch(i){console.warn("Error extracting head data, will use defaults:",i),l=null}if(l){const i=(m=n.headNames)==null?void 0:m[e];i&&(l.label=i)}else{const i=((u=n.headNames)==null?void 0:u[e])||`Head ${e}`;l={index:e,label:i,active:!1,schedule:{mode:"single",dailyDoseMl:10,startTime:"09:00"},recurrence:{days:["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]},missedDoseCompensation:!1,calibration:{mlPerSecond:1,lastCalibratedAt:new Date().toISOString()}}}a.innerHTML=H(e,l,s),t.querySelectorAll(".dose-head-card").forEach((i,d)=>{d===e-1?i.classList.add("selected"):i.classList.remove("selected")})}function L(e){return`
    <div class="light-config-interface">
      <!-- Tab Navigation -->
      <div class="modal-tabs">
        <button class="tab-button" onclick="switchLightSettingsTab('manual')">
          Manual Mode
        </button>
        <button class="tab-button active" onclick="switchLightSettingsTab('auto')">
          Auto Mode
        </button>
      </div>

      <!-- Tab Content -->
      <div id="light-settings-tab-content" style="min-height: 600px;">
        ${$(e)}
      </div>
    </div>
  `}function x(e){return`
    <div class="settings-section">
      <div class="channel-controls">
        ${p(e.id).map((a,s)=>`
          <div class="form-group">
            <label for="manual-channel-${s}">${a}</label>
            <input
              type="number"
              id="manual-channel-${s}"
              min="0"
              max="100"
              value="50"
              class="form-control"
            />
          </div>
        `).join("")}
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" onclick="sendLightManualModeCommand('${e.id}')">
          Send Command
        </button>
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove();">
          Close
        </button>
      </div>
    </div>
  `}function $(e){const t=p(e.id),a=t.length;let s="";return a===1?s="channel-grid-1":a===3?s="channel-grid-3":a===4?s="channel-grid-2x2":s="channel-grid-default",`
    <div class="settings-section">
      <div class="form-group">
        <label for="schedule-label">Schedule Label</label>
        <input
          type="text"
          id="schedule-label"
          class="form-control"
          placeholder="e.g., Morning, Weekend"
          maxlength="50"
        />
      </div>

      <div class="form-group">
        <label>Active Days:</label>
        <div class="weekday-selector">
          ${[{name:"monday",label:"Mon"},{name:"tuesday",label:"Tue"},{name:"wednesday",label:"Wed"},{name:"thursday",label:"Thu"},{name:"friday",label:"Fri"},{name:"saturday",label:"Sat"},{name:"sunday",label:"Sun"}].map(o=>`
            <label class="weekday-option">
              <input type="checkbox" value="${o.name}" checked id="weekday-auto-${o.name}">
              <span class="weekday-label">${o.label}</span>
            </label>
          `).join("")}
        </div>
      </div>

      <div class="time-controls-row">
        <div class="form-group">
          <label for="sunrise-time">Sunrise</label>
          <input
            type="time"
            id="sunrise-time"
            class="form-control"
            value="08:00"
          />
        </div>

        <div class="form-group">
          <label for="sunset-time">Sunset</label>
          <input
            type="time"
            id="sunset-time"
            class="form-control"
            value="20:00"
          />
        </div>

        <div class="form-group">
          <label for="ramp-time">Ramp</label>
          <input
            type="number"
            id="ramp-time"
            class="form-control"
            value="60"
            min="1"
            max="300"
          />
        </div>
      </div>

      <div class="channel-controls ${s}">
        ${t.map((o,n)=>`
          <div class="form-group channel-item">
            <label for="auto-channel-${n}">${o}</label>
            <input
              type="number"
              id="auto-channel-${n}"
              min="0"
              max="100"
              value="50"
              class="form-control"
            />
          </div>
        `).join("")}
      </div>

      <div class="form-group">
        <button class="btn btn-danger" onclick="sendLightResetAutoModeCommand('${e.id}')">
          Reset Auto Mode Settings
        </button>
        <small class="form-text">This will reset all auto mode settings to factory defaults</small>
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" onclick="sendLightAutoModeCommand('${e.id}')">
          Send Command
        </button>
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove();">
          Close
        </button>
      </div>
    </div>
  `}function H(e,t,a){const s=t.schedule||{mode:"single",dailyDoseMl:10,startTime:"09:00"},o=t.recurrence||{days:["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]};return`
    <div class="head-command-interface">
      <div class="form-section">
        <div class="form-group">
          <label for="schedule-mode-${e}">Mode:</label>
          <select id="schedule-mode-${e}" class="form-select">
            <option value="disabled" ${t.active?"":"selected"}>Disabled</option>
            <option value="single" ${s.mode==="single"?"selected":""}>Daily - Single dose at set time</option>
            <option value="every_hour" ${s.mode==="every_hour"?"selected":""}>24 Hour - Hourly dosing</option>
            <option value="custom_periods" ${s.mode==="custom_periods"?"selected":""}>Custom - Custom time periods</option>
            <option value="timer" ${s.mode==="timer"?"selected":""}>Timer - Multiple specific times</option>
          </select>
        </div>

        <div id="schedule-details-${e}">
          ${N(e,s)}
        </div>

        <div class="form-group">
          <label>Active Days:</label>
          <div class="weekday-selector">
            ${[{name:"monday",label:"Mon"},{name:"tuesday",label:"Tue"},{name:"wednesday",label:"Wed"},{name:"thursday",label:"Thu"},{name:"friday",label:"Fri"},{name:"saturday",label:"Sat"},{name:"sunday",label:"Sun"}].map(n=>`
              <label class="weekday-option">
                <input type="checkbox" value="${n.name}"
                       ${o.days.includes(n.name)?"checked":""}
                       id="weekday-${e}-${n.name}">
                <span class="weekday-label">${n.label}</span>
              </label>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Command Actions -->
      <div class="command-actions">
        <button class="btn btn-success btn-large" onclick="sendDoserScheduleCommand('${a}', ${e})">
          Send Command
        </button>
      </div>
    </div>
  `}function N(e,t){switch(t.mode){case"single":return`
        <div class="schedule-single">
          <div class="schedule-mode-description">
            <p><strong>Daily Mode:</strong> Dose once per day at a specific time</p>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="dose-amount-${e}">Dose Amount (ml):</label>
              <input type="number" id="dose-amount-${e}"
                     value="${t.dailyDoseMl||10}"
                     min="0.1" max="6553.5" step="0.1" class="form-input">
            </div>
            <div class="form-group">
              <label for="dose-time-${e}">Time:</label>
              <input type="time" id="dose-time-${e}"
                     value="${t.startTime||"09:00"}"
                     class="form-input">
            </div>
          </div>
        </div>
      `;case"every_hour":return`
        <div class="schedule-every-hour">
          <div class="schedule-mode-description">
            <p><strong>24 Hour Mode:</strong> Dose every hour starting at a specific time</p>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="daily-total-${e}">Total Daily Amount (ml):</label>
              <input type="number" id="daily-total-${e}"
                     value="${t.dailyDoseMl||24}"
                     min="0.1" max="6553.5" step="0.1" class="form-input">
            </div>
            <div class="form-group">
              <label for="start-time-${e}">Start Time:</label>
              <input type="time" id="start-time-${e}"
                     value="${t.startTime||"08:00"}"
                     class="form-input">
            </div>
          </div>
          <div class="hourly-info">
            <p>Hourly dose: <span id="hourly-dose-${e}">${((t.dailyDoseMl||24)/24).toFixed(1)}ml</span></p>
          </div>
        </div>
      `;default:return'<div class="schedule-disabled"><p>Head is disabled. Select a mode to configure.</p></div>'}}function _(e){console.log("switchLightSettingsTab called with mode:",e);const t=document.querySelectorAll(".modal-tabs .tab-button"),a=document.getElementById("light-settings-tab-content");if(!a){console.error("Content container not found");return}t.forEach(l=>{l.classList.remove("active")});const s=Array.from(t).find(l=>{var r;return(r=l.textContent)==null?void 0:r.toLowerCase().includes(e)});s&&s.classList.add("active");const o=document.querySelector(".modal-content.light-settings-modal");if(!o){console.error("Modal element not found");return}let n=o._lightDeviceData;if(!n){const l=o.getAttribute("data-device-id");if(!l){console.error("Device ID not found on modal element");return}if(n=b.getState().configurations.lights.get(l),!n){console.error("No device configuration found in store for:",l);return}}console.log("Rendering tab for mode:",e),a.innerHTML=e==="manual"?x(n):$(n),console.log("Tab content updated")}async function E(e){try{const t=document.querySelectorAll('[id^="manual-channel-"]'),a=Array.from(t).map(o=>parseInt(o.value,10));if(console.log("Sending manual mode commands:",{address:e,channelValues:a}),a.some(o=>isNaN(o)||o<0||o>100)){alert("Please enter valid brightness values (0-100) for all channels");return}let s=null;for(let o=0;o<a.length;o++){const n={action:"set_brightness",args:{brightness:a[o],color:o},timeout:15};if(console.log(`Sending brightness command for channel ${o}:`,n),s=await y(e,n),s.status==="failed"){alert(`Channel ${o} command failed: ${s.error||"Unknown error"}`);return}}(s==null?void 0:s.status)==="success"?alert("Manual brightness set successfully! Device switched to manual mode."):alert(`Final command status: ${(s==null?void 0:s.status)||"unknown"}`)}catch(t){console.error("Failed to send manual mode commands:",t),alert(`Failed to send command: ${t instanceof Error?t.message:String(t)}`)}}async function F(e){var t,a,s,o;try{const n=(t=document.getElementById("schedule-label"))==null?void 0:t.value.trim(),l=(a=document.getElementById("sunrise-time"))==null?void 0:a.value,r=(s=document.getElementById("sunset-time"))==null?void 0:s.value,u=parseInt(((o=document.getElementById("ramp-time"))==null?void 0:o.value)||"60",10),m=document.querySelectorAll('[id^="auto-channel-"]'),i=Array.from(m).map(c=>parseInt(c.value,10)),d=document.querySelectorAll('[id^="weekday-auto-"]'),f=Array.from(d).filter(c=>c.checked).map(c=>c.value);if(console.log("Sending auto mode command:",{address:e,scheduleLabel:n,sunriseTime:l,sunsetTime:r,rampTime:u,channelValues:i,weekdays:f}),!l||!r){alert("Please enter both sunrise and sunset times");return}if(i.some(c=>isNaN(c)||c<0||c>100)){alert("Please enter valid brightness values (0-100) for all channels");return}if(f.length===0){alert("Please select at least one active day");return}const v={};i.forEach((c,w)=>{v[w.toString()]=c});const h={action:"add_auto_setting",args:{sunrise:l,sunset:r,channels:v,ramp_up_minutes:u,weekdays:f,...n&&{label:n}},timeout:20},g=await y(e,h);g.status==="success"?alert("Auto mode schedule set successfully! Device configured for auto mode."):g.status==="failed"?alert(`Command failed: ${g.error||"Unknown error"}`):alert(`Command status: ${g.status}`)}catch(n){console.error("Failed to send auto mode command:",n),alert(`Failed to send command: ${n instanceof Error?n.message:String(n)}`)}}async function q(e){try{if(!confirm("Are you sure you want to reset all auto mode settings to factory defaults? This cannot be undone."))return;console.log("Sending reset auto mode command:",{address:e});const a=await y(e,{action:"reset_auto_settings",args:{}});console.log("Reset command result:",a),a.status==="success"?alert("Auto mode settings reset successfully"):alert(`Reset failed: ${a.error||"Unknown error"}`)}catch(t){console.error("Failed to send reset command:",t),alert("Failed to reset auto mode settings. Check console for details.")}}async function P(e,t){try{console.log("Sending doser schedule command:",{address:e,headIndex:t});const a=document.getElementById(`dose-amount-${t}`),s=document.getElementById(`dose-time-${t}`);if(!a||!s){alert("Form inputs not found. Please refresh the page and try again.");return}const o=parseFloat(a.value),n=s.value;if(isNaN(o)||o<=0){alert("Please enter a valid dose amount greater than 0.");return}if(!n){alert("Please select a dose time.");return}const[l,r]=n.split(":"),u=parseInt(l,10),m=parseInt(r,10),i=document.querySelectorAll(`input[id^="weekday-${t}-"]:checked`),d=Array.from(i).map(g=>g.value),f=Math.round(o*10),v={head_index:t,volume_tenths_ml:f,hour:u,minute:m,weekdays:d.length>0?d:void 0};console.log("Command args:",v);const h=await y(e,{action:"set_schedule",args:v});console.log("Doser schedule command result:",h),h.status==="success"?alert(`Schedule set successfully for Head ${t}!`):alert(`Schedule command failed: ${h.error||"Unknown error"}`)}catch(a){console.error("Failed to send doser schedule command:",a),alert("Failed to set schedule. Check console for details.")}}window.selectDoseHead=A;window.switchLightSettingsTab=_;window.sendLightManualModeCommand=E;window.sendLightAutoModeCommand=F;window.sendLightResetAutoModeCommand=q;window.sendDoserScheduleCommand=P;window.showDoserDeviceSettingsModal=S;window.showLightDeviceSettingsModal=C;export{H as renderHeadCommandInterface,S as showDoserDeviceSettingsModal,C as showLightDeviceSettingsModal};
//# sourceMappingURL=device-modals-BbXgpACq.js.map
