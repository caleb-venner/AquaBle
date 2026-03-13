const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./configurations-BzOxCh-6.js","./wattage-calculator-aI2XEFfd.js","./commands-D_vcGt3q.js","./scan-connect-modal-CFDHfpy4.js","./device-modals-DfXlkiaw.js","./import-export-modal-DwKGiAr5.js"])))=>i.map(i=>d[i]);
var ce=Object.defineProperty;var le=(e,n,t)=>n in e?ce(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var C=(e,n,t)=>le(e,typeof n!="symbol"?n+"":n,t);import{c as de,f as b}from"./wattage-calculator-aI2XEFfd.js";const ue="modulepreload",ge=function(e,n){return new URL(e,n).href},N={},f=function(n,t,o){let i=Promise.resolve();if(t&&t.length>0){const r=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),l=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));i=Promise.allSettled(t.map(c=>{if(c=ge(c,o),c in N)return;N[c]=!0;const u=c.endsWith(".css"),g=u?'[rel="stylesheet"]':"";if(!!o)for(let m=r.length-1;m>=0;m--){const w=r[m];if(w.href===c&&(!u||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${g}`))return;const v=document.createElement("link");if(v.rel=u?"stylesheet":ue,u||(v.as="script"),v.crossOrigin="",v.href=c,l&&v.setAttribute("nonce",l),document.head.appendChild(v),u)return new Promise((m,w)=>{v.addEventListener("load",m),v.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(r){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=r,window.dispatchEvent(s),!s.defaultPrevented)throw r}return i.then(r=>{for(const s of r||[])s.status==="rejected"&&a(s.reason);return n().catch(a)})},O=e=>{let n;const t=new Set,o=(c,u)=>{const g=typeof c=="function"?c(n):c;if(!Object.is(g,n)){const p=n;n=u??(typeof g!="object"||g===null)?g:Object.assign({},n,g),t.forEach(v=>v(n,p))}},i=()=>n,s={setState:o,getState:i,getInitialState:()=>l,subscribe:c=>(t.add(c),()=>t.delete(c))},l=n=e(o,i,s);return s},B=e=>e?O(e):O,fe=e=>(n,t,o)=>{const i=o.subscribe;return o.subscribe=(r,s,l)=>{let c=r;if(s){const u=(l==null?void 0:l.equalityFn)||Object.is;let g=r(o.getState());c=p=>{const v=r(p);if(!u(g,v)){const m=g;s(g=v,m)}},l!=null&&l.fireImmediately&&s(g,g)}return i(c)},e(n,t,o)},ve=fe;function pe(e){if(!e)return"Unknown error occurred";switch(e.code){case"device_not_found":return"Device not found. Please check that the device is powered on and in range.";case"device_disconnected":return"Device is disconnected. Please reconnect and try again.";case"device_busy":return"Device is busy processing another command. Please wait and try again.";case"device_timeout":return"Device communication timed out. Please check the connection and try again.";case"command_timeout":return"Command timed out. The operation may have completed - please check device status.";case"validation_error":return`Invalid input: ${e.message}`;case"invalid_arguments":return`Invalid arguments: ${e.message}`;case"ble_connection_error":return"Bluetooth connection failed. Please check device connectivity.";case"ble_characteristic_missing":return"Device communication error. The device may not be compatible.";case"config_save_error":return"Failed to save configuration. Settings may not persist.";case"internal_error":return"An internal error occurred. Please try again or contact support.";default:return e.message||"An unexpected error occurred."}}const he=(e,n)=>({devices:new Map,configurations:{dosers:new Map,lights:new Map,isLoaded:!1},commandQueue:[],isProcessingCommands:!1,ui:{currentView:"overview",globalError:null,notifications:[]},polling:{isEnabled:!1,intervalId:null,intervalMs:3e4},actions:{loadConfigurations:async()=>{try{console.log("Configuration auto-loading is deprecated; configurations are loaded on-demand")}catch(t){console.error("Failed to load configurations:",t)}},setConfigurations:(t,o)=>{const i=new Map,a=new Map;t.forEach(s=>i.set(s.id,s)),o.forEach(s=>a.set(s.id,s)),e(s=>({configurations:{dosers:i,lights:a,isLoaded:!0}}));const r=new Map(n().devices);r.forEach((s,l)=>{const c=i.get(l)||a.get(l);c&&r.set(l,{...s,configuration:c})}),e({devices:r})},refreshDeviceConfig:async(t,o)=>{try{console.log(`Refreshing ${o} config for ${t}`);const{getDeviceConfiguration:i}=await f(async()=>{const{getDeviceConfiguration:c}=await import("./configurations-BzOxCh-6.js");return{getDeviceConfiguration:c}},__vite__mapDeps([0,1]),import.meta.url),a=await i(t);if(o==="doser"){const c=new Map(n().configurations.dosers);c.set(t,a),e(u=>({configurations:{...u.configurations,dosers:c}}))}else{const c=new Map(n().configurations.lights);c.set(t,a),e(u=>({configurations:{...u.configurations,lights:c}}))}const s=new Map(n().devices),l=s.get(t);return l&&(s.set(t,{...l,configuration:a}),e({devices:s})),a}catch(i){throw console.error(`Failed to refresh ${o} config for ${t}:`,i),i}},getDeviceConfig:(t,o)=>o==="doser"?n().configurations.dosers.get(t)||null:n().configurations.lights.get(t)||null,setDevices:t=>{const o=new Map,{configurations:i}=n();t.forEach(a=>{const r=n().devices.get(a.address),s=i.dosers.get(a.address)||i.lights.get(a.address);o.set(a.address,{address:a.address,status:a,configuration:s||null,lastUpdated:Date.now(),isLoading:(r==null?void 0:r.isLoading)??!1,error:null})}),e({devices:o})},updateDevice:(t,o)=>{const i=new Map(n().devices),a=i.get(t),{configurations:r}=n(),s=r.dosers.get(t)||r.lights.get(t);i.set(t,{address:t,status:o,configuration:s||(a==null?void 0:a.configuration)||null,lastUpdated:Date.now(),isLoading:!1,error:null}),e({devices:i})},setDeviceLoading:(t,o)=>{const i=new Map(n().devices),a=i.get(t);a&&(i.set(t,{...a,isLoading:o}),e({devices:i}))},setDeviceError:(t,o)=>{const i=new Map(n().devices),a=i.get(t);a&&(i.set(t,{...a,error:o,isLoading:!1}),e({devices:i}))},queueCommand:async(t,o)=>{const i=`cmd_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,a={id:i,address:t,request:{...o,id:o.id||i},queuedAt:Date.now(),retryCount:0};return e(r=>({commandQueue:[...r.commandQueue,a]})),n().isProcessingCommands||await n().actions.processCommandQueue(),i},processCommandQueue:async()=>{const{commandQueue:t,isProcessingCommands:o,actions:i}=n();if(!(o||t.length===0)){e({isProcessingCommands:!0});try{for(;n().commandQueue.length>0;){const[a,...r]=n().commandQueue;e({commandQueue:r});try{i.setDeviceLoading(a.address,!0);const{executeCommand:s}=await f(async()=>{const{executeCommand:c}=await import("./commands-D_vcGt3q.js");return{executeCommand:c}},__vite__mapDeps([2,1]),import.meta.url),l=await s(a.address,a.request);if(l.status==="success"){const{invalidateMetadataCache:c}=await f(async()=>{const{invalidateMetadataCache:g}=await import("./cache-service-BKX54X_n.js");return{invalidateMetadataCache:g}},[],import.meta.url);c();const{debouncedRefreshConfigurations:u}=await f(async()=>{const{debouncedRefreshConfigurations:g}=await Promise.resolve().then(()=>x);return{debouncedRefreshConfigurations:g}},void 0,import.meta.url);await u(),await i.refreshDevice(a.address),i.addNotification({type:"success",message:"Command completed successfully",autoHide:!0})}else if(l.status==="failed"||l.status==="timed_out"){const c=pe(l.error_code&&l.error?{code:l.error_code,message:l.error,details:l.result||{}}:null);i.setDeviceError(a.address,c),i.addNotification({type:"error",message:c,autoHide:!1})}}catch(s){const l=s instanceof Error?s.message:"Network error";i.setDeviceError(a.address,l),i.addNotification({type:"error",message:`Network error: ${l}`,autoHide:!1})}finally{i.setDeviceLoading(a.address,!1)}}}finally{e({isProcessingCommands:!1})}}},retryCommand:t=>{const{commandQueue:o}=n(),i=o.find(a=>a.id===t);if(i){const a={...i,retryCount:i.retryCount+1,queuedAt:Date.now()};e({commandQueue:o.filter(r=>r.id!==t).concat(a)})}},cancelCommand:t=>{e(o=>({commandQueue:o.commandQueue.filter(i=>i.id!==t)}))},clearCommandQueue:()=>{e({commandQueue:[]})},setCurrentView:t=>{e(o=>({ui:{...o.ui,currentView:t}}))},setGlobalError:t=>{e(o=>({ui:{...o.ui,globalError:t}}))},addNotification:t=>{const o=`notif_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,i={...t,id:o,timestamp:Date.now()};e(a=>({ui:{...a.ui,notifications:[...a.ui.notifications,i]}})),t.autoHide&&setTimeout(()=>{n().actions.removeNotification(o)},5e3)},removeNotification:t=>{e(o=>({ui:{...o.ui,notifications:o.ui.notifications.filter(i=>i.id!==t)}}))},clearNotifications:()=>{e(t=>({ui:{...t.ui,notifications:[]}}))},initializeStore:async()=>{await n().actions.loadConfigurations(),await n().actions.refreshDevices();const t=n().devices;(Array.from(t.values()).some(i=>i.status&&!i.status.connected)||t.size===0)&&(console.log("⏱️ Starting temporary polling to detect device connections..."),n().actions.startPolling(3e3),setTimeout(()=>{const i=n().devices;Array.from(i.values()).some(r=>r.status&&!r.status.connected)?(console.log("⚠️ Some devices still disconnected after 30s, stopping polling anyway"),n().actions.stopPolling()):(console.log("✅ All devices connected, stopping polling"),n().actions.stopPolling())},3e4))},refreshDevices:async()=>{try{const{fetchJson:t}=await f(async()=>{const{fetchJson:a}=await Promise.resolve().then(()=>_);return{fetchJson:a}},void 0,import.meta.url),o=await t("api/status"),i=Object.values(o);n().actions.setDevices(i),n().actions.setGlobalError(null)}catch(t){const o=t instanceof Error?t.message:"Failed to refresh devices";throw n().actions.setGlobalError(o),t}},refreshDevice:async t=>{try{n().actions.setDeviceLoading(t,!0);const{postJson:o}=await f(async()=>{const{postJson:i}=await Promise.resolve().then(()=>_);return{postJson:i}},void 0,import.meta.url);await o(`api/devices/${encodeURIComponent(t)}/status`,{}),await n().actions.refreshDevices()}catch(o){const i=o instanceof Error?o.message:"Failed to refresh device";throw n().actions.setDeviceError(t,i),o}},connectToDevice:async t=>{try{const{postJson:o}=await f(async()=>{const{postJson:i}=await Promise.resolve().then(()=>_);return{postJson:i}},void 0,import.meta.url);await o(`api/devices/${encodeURIComponent(t)}/connect`,{}),n().actions.addNotification({type:"success",message:`Connected to device ${t}`,autoHide:!0}),await n().actions.refreshDevices()}catch(o){const i=o instanceof Error?o.message:"Failed to connect to device";throw n().actions.addNotification({type:"error",message:`Connection failed: ${i}`,autoHide:!0}),o}},startPolling:(t=3e4)=>{const{polling:o}=n();o.intervalId&&clearInterval(o.intervalId);const i=setInterval(()=>{const{configurations:a,devices:r}=n();a.isLoaded&&r.size>0&&n().actions.refreshDevices().catch(s=>{console.warn("Polling refresh failed:",s)})},t);e(a=>({polling:{...a.polling,isEnabled:!0,intervalId:i,intervalMs:t}}))},stopPolling:()=>{const{polling:t}=n();t.intervalId&&clearInterval(t.intervalId),e(o=>({polling:{...o.polling,isEnabled:!1,intervalId:null}}))},setPollingInterval:t=>{const{polling:o}=n();e(i=>({polling:{...i.polling,intervalMs:t}})),o.isEnabled&&n().actions.startPolling(t)}}}),me=()=>B()(ve(he)),d=me(),q=()=>d.getState().actions,L=()=>d.getState().ui.notifications,W=Object.freeze(Object.defineProperty({__proto__:null,deviceStore:d,useActions:q,useNotifications:L},Symbol.toStringTag,{value:"Module"}));function ye(e){const t=Date.now()/1e3-e;return t<5?"just now":t<60?`${Math.floor(t)}s ago`:t<3600?`${Math.floor(t/60)}m ago`:t<86400?`${Math.floor(t/3600)}h ago`:`${Math.floor(t/86400)}d ago`}function be(e){const t=d.getState().configurations.lights.get(e);if(!(t!=null&&t.configurations))return[];const o=t.configurations.find(r=>r.id===t.activeConfigurationId);if(!(o!=null&&o.revisions)||o.revisions.length===0)return[];const a=o.revisions[o.revisions.length-1].profile;return a.mode!=="auto"||!a.programs?[]:a.programs.map(r=>({...r,channels:t.channels}))}function we(e){const t=d.getState().configurations.lights.get(e.address);if(t!=null&&t.configurations&&t.activeConfigurationId){const o=t.configurations.find(i=>i.id===t.activeConfigurationId);if(o!=null&&o.revisions&&o.revisions.length>0){const a=o.revisions[o.revisions.length-1].profile;if(a.mode==="auto"&&a.programs&&a.programs.length>0)return xe(e)}}return`
    <div style="padding: 24px; text-align: center; color: var(--gray-500); font-size: 14px;">
      <div style="font-size: 16px; color: ${e.connected?"var(--success)":"var(--gray-400)"}; margin-bottom: 8px;">
        ${e.connected?"✓ Connected":"○ Disconnected"}
      </div>
      <div style="font-size: 12px;">
        Last update: ${new Date(e.updated_at*1e3).toLocaleTimeString()}
      </div>
    </div>
  `}function xe(e,n){const t=be(e.address);if(t.length===0)return`
      <div style="padding: 16px; text-align: center; color: var(--gray-500);">
        No auto programs configured
      </div>
    `;const o={current:0,next:1,upcoming:2,disabled:3},a=[...t].sort((r,s)=>{const l=o[r.status]??99,c=o[s.status]??99;return l!==c?l-c:r.sunrise.localeCompare(s.sunrise)}).filter(r=>r.status!=="disabled").slice(0,3);return`
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
      ${a.length>0?`
        <div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${a.map(r=>Se(r)).join("")}
          </div>
        </div>
      `:`
        <div style="text-align: center; color: var(--gray-500); font-size: 13px;">
          No scheduled programs
        </div>
      `}
    </div>
  `}function Se(e){const n=s=>{switch(s){case"current":return"var(--success)";case"next":case"upcoming":return"var(--primary)";case"disabled":return"var(--error)";default:return"var(--gray-400)"}},t=s=>{switch(s){case"current":return"Active";case"next":return"Next";case"upcoming":return"Upcoming";case"disabled":return"Disabled";default:return"Unknown"}},o=n(e.status),i=t(e.status);let a="";e.channels&&Array.isArray(e.channels)?a=e.channels.map(l=>{const c=e.levels[l.key];return`${l.label||l.key.charAt(0).toUpperCase()+l.key.slice(1)}:${c}%`}).filter(l=>l).join(" "):a=Object.entries(e.levels).map(([s,l])=>`${s.charAt(0).toUpperCase()+s.slice(1)}:${l}%`).join(" ");const r=`${e.sunrise} - ${e.sunset}`;return`
    <div style="padding: 8px 12px; background: var(--bg-primary); border-radius: 4px; border-left: 3px solid ${o};">
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">${e.label}</div>
        <div style="font-size: 11px; color: var(--text-secondary);">
          ${i} • ${r} • ${e.rampMinutes}min ramp
        </div>
        <pre style="font-size: 11px; color: var(--text-secondary); margin-top: 2px; margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background: transparent; border: none; white-space: pre-wrap; word-wrap: break-word;">
${a}</pre>
      </div>
    </div>
  `}function De(e,n){const o=d.getState().configurations.dosers.get(e);return o!=null&&o.headNames&&n in o.headNames?o.headNames[n]:null}function Ce(e){if(!e||!Array.isArray(e)||e.length===0)return"None";if(typeof e[0]=="string"){const i={monday:"Mon",tuesday:"Tue",wednesday:"Wed",thursday:"Thu",friday:"Fri",saturday:"Sat",sunday:"Sun"},a=e.map(r=>i[r.toLowerCase()]).filter(Boolean);return a.length===7?"Everyday":a.length===5&&["Mon","Tue","Wed","Thu","Fri"].every(r=>a.includes(r))?"Weekdays":a.length===2&&a.includes("Sat")&&a.includes("Sun")?"Weekends":a.join(", ")}const n=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],t=e.filter(i=>typeof i=="number"&&i>=0&&i<=6);if(t.length===0)return"None";const o=[...t].sort();return o.length===7?"Everyday":o.length===5&&o.every(i=>i>=1&&i<=5)?"Weekdays":o.length===2&&o.includes(0)&&o.includes(6)?"Weekends":o.map(i=>n[i]).join(", ")}function _e(e,n){var u,g;const o=d.getState().configurations.dosers.get(n);if(!o||!o.configurations||o.configurations.length===0)return{setDose:"N/A",schedule:"N/A"};const i=o.configurations.find(p=>p.id===o.activeConfigurationId)||o.configurations[0];if(!i||!i.revisions||i.revisions.length===0)return{setDose:"N/A",schedule:"N/A"};const r=(u=i.revisions[i.revisions.length-1].heads)==null?void 0:u.find(p=>p.index===e);if(!r)return{setDose:"N/A",schedule:"N/A"};let s="N/A";const l=r.schedule;l&&l.dailyDoseMl!==void 0&&l.dailyDoseMl!==null&&(s=`${l.dailyDoseMl}ml`);const c=Ce((g=r.recurrence)==null?void 0:g.days);return{setDose:s,schedule:c}}function $e(e){var o,i;const t=d.getState().configurations.dosers.get(e.address);return(i=(o=t==null?void 0:t.last_status)==null?void 0:o.parsed)!=null&&i.heads?Ee(t.last_status.parsed.heads,t,e.address):`
    <div style="padding: 24px; text-align: center; color: var(--gray-500); font-size: 14px;">
      <div style="font-size: 16px; color: ${e.connected?"var(--success)":"var(--gray-400)"}; margin-bottom: 8px;">
        ${e.connected?"✓ Connected":"○ Disconnected"}
      </div>
      <div style="font-size: 12px;">
        Last update: ${new Date(e.updated_at*1e3).toLocaleTimeString()}
      </div>
    </div>
  `}function Ee(e,n,t){const o=[];for(let i=0;i<4;i++){const a=e[i],r=i+1,s=t?_e(r,t):{setDose:"N/A",schedule:"N/A"},l=t?De(t,r):null,c=a!=null&&a.dosed_tenths_ml?`${(a.dosed_tenths_ml/10).toFixed(1)}mL`:"N/A";o.push({index:r,deviceHead:a,configData:s,customName:l,dosedToday:c})}return`
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      ${o.map(i=>Te(i)).join("")}
    </div>
  `}function Te(e){const{index:n,deviceHead:t,configData:o,customName:i,dosedToday:a}=e;let r="Disabled",s="var(--gray-400)",l="N/A",c=!0;if(t)switch(t.mode){case 0:r="Active",s="var(--success)",l="Daily",c=!1;break;case 1:r="Active",s="var(--success)",l="24H",c=!1;break;case 2:r="Active",s="var(--success)",l="Custom",c=!1;break;case 3:r="Active",s="var(--success)",l="Timer",c=!1;break;case 4:default:r="Disabled",s="var(--gray-400)",l="Disabled",c=!0;break}const u=i||`Head ${n}`;return c?`
      <div style="padding: 8px 12px; background: var(--bg-primary); border-radius: 4px; border-left: 3px solid ${s};">
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center;">
          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${u}</div>
          <div style="font-size: 11px; color: ${s}; font-weight: 600;">${r}</div>
        </div>
      </div>
    `:`
    <div style="padding: 8px 12px; background: var(--bg-primary); border-radius: 4px; border-left: 3px solid ${s};">
      <!-- First Row: Head name, mode, status -->
      <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: center; margin-bottom: 8px;">
        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${u}</div>
        <div style="font-size: 11px; color: var(--text-secondary);">${l}</div>
        <div style="font-size: 11px; color: ${s}; font-weight: 600;">${r}</div>
      </div>

      <!-- Second Row: Set Dose, Schedule, Dosed Today -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 11px;">
        <div style="text-align: center;">
          <div style="color: var(--text-secondary); margin-bottom: 2px;">Set Dose</div>
          <div style="font-weight: 600; color: var(--text-primary);">${o.setDose}</div>
        </div>
        <div style="text-align: center;">
          <div style="color: var(--text-secondary); margin-bottom: 2px;">Schedule</div>
          <div style="font-weight: 600; color: var(--text-primary);">${o.schedule}</div>
        </div>
        <div style="text-align: center;">
          <div style="color: var(--text-secondary); margin-bottom: 2px;">Dosed</div>
          <div style="font-weight: 600; color: var(--text-primary);">${a}</div>
        </div>
      </div>
    </div>
  `}window.toggleDeviceCardFlip=e=>{const n=document.querySelector(`[data-device-address="${e}"]`);n&&n.classList.toggle("flipped")};function k(e,n){return`
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${e}</h2>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="badge badge-info">${n.length}</div>
          <button class="toggle-icon-button" onclick="window.handleScanDevices()" title="Scan & Connect">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="toggle-icon" xmlns="http://www.w3.org/2000/svg">
              <title>bluetooth-connect</title>
              <path d="M19,10L17,12L19,14L21,12M14.88,16.29L13,18.17V14.41M13,5.83L14.88,7.71L13,9.58M17.71,7.71L12,2H11V9.58L6.41,5L5,6.41L10.59,12L5,17.58L6.41,19L11,14.41V22H12L17.71,16.29L13.41,12M7,12L5,10L3,12L5,14L7,12Z" />
            </svg>
          </button>
        </div>
      </div>
      ${n.length===0?`
        <div style="padding: 60px 20px; text-align: center; color: var(--gray-500);">
          <h3 style="margin: 0 0 8px 0; color: var(--gray-700);">No Devices Connected</h3>
          <p style="margin: 0 0 20px 0; color: var(--gray-500);">Click the Bluetooth button above to scan for nearby devices.</p>
        </div>
      `:`
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-top: 16px;">
          ${n.map(t=>Ae(t)).join("")}
        </div>
      `}
    </div>
  `}function Ae(e){const n=e.connected?"var(--success)":"var(--gray-400)",t=e.connected?"Connected":"Disconnected",o=d.getState(),i=e.device_type==="doser"?o.configurations.dosers.get(e.address):o.configurations.lights.get(e.address),a=(i==null?void 0:i.name)||e.address,r=ye(e.updated_at);return`
    <div class="flip-card" data-device-address="${e.address}">
      <div class="flip-card-inner">
        <!-- Front of card -->
        <div class="flip-card-front">
          <div class="card device-card ${e.device_type} ${e.connected?"connected":"disconnected"}" style="padding: 0; border-left: 4px solid ${n}; height: 100%;">
            ${Le(e,a,t,r)}
            ${ke(e)}
            ${Ie(e)}
          </div>
        </div>
        <!-- Back of card -->
        <div class="flip-card-back">
          ${Me(e,a)}
        </div>
      </div>
    </div>
  `}function Le(e,n,t,o){return`
    <div class="device-header" style="padding: 16px; border-bottom: 1px solid var(--border-color);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="status-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: ${e.connected?"var(--success)":"var(--gray-400)"};"></div>
          <h3 style="font-size: 18px; font-weight: 600; margin: 0; color: var(--text-primary);">
            ${n}
          </h3>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <button
            class="btn-icon"
            onclick="window.handleRefreshDevice('${e.address}')"
            title="Refresh Status"
            style="padding: 6px 10px; font-size: 16px; background: transparent; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; color: var(--text-secondary); transition: all 0.2s;"
            onmouseover="this.style.background='var(--gray-100)'; this.style.borderColor='var(--gray-400)'; this.style.color='var(--text-primary)';"
            onmouseout="this.style.background='transparent'; this.style.borderColor='var(--border-color)'; this.style.color='var(--text-secondary)';"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display: block;">
              <path d="M17.65,6.35C16.2,4.9,14.21,4,12,4A8,8,0,0,0,4,12A8,8,0,0,0,12,20C15.73,20,18.84,17.45,19.73,14H17.65C16.83,16.33,14.61,18,12,18A6,6,0,0,1,6,12A6,6,0,0,1,12,6C13.66,6,15.14,6.69,16.22,7.78L13,11H20V4L17.65,6.35Z" />
            </svg>
          </button>
          <button
            class="btn-icon"
            onclick="window.toggleDeviceCardFlip('${e.address}')"
            title="Device Settings"
            style="padding: 6px 10px; font-size: 16px; background: transparent; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; color: var(--text-secondary); transition: all 0.2s;"
            onmouseover="this.style.background='var(--gray-100)'; this.style.borderColor='var(--gray-400)'; this.style.color='var(--text-primary)';"
            onmouseout="this.style.background='transparent'; this.style.borderColor='var(--border-color)'; this.style.color='var(--text-secondary)';"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display: block;"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" /></svg>
          </button>
          <div style="font-size: 11px; color: var(--text-secondary);">${o}</div>
        </div>
      </div>
    </div>
  `}function ke(e){return`
    <div class="device-body" style="padding: 16px;">
      ${Pe(e)}
    </div>
  `}function Pe(e){return e.device_type==="light"?we(e):e.device_type==="doser"?$e(e):`
      <div class="device-status-placeholder">
        <div style="text-align: center; color: var(--gray-500); padding: 20px;">
          <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
          <p>Device status and information will be displayed here</p>
        </div>
      </div>
    `}function Ie(e){const n=e.connected?"Disconnect":"Connect",t=e.connected?"btn-danger":"btn-primary";return`
    <div class="device-footer" style="padding: 16px; border-top: 1px solid var(--border-color); background: var(--bg-secondary);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn btn-outline" onclick="window.openDeviceSettings('${e.address}', '${e.device_type}')">
          Settings
        </button>
        <button class="btn connect-button ${t}" onclick="window.toggleDeviceConnection('${e.address}')">
          ${n}
        </button>
      </div>
    </div>
  `}function Me(e,n){const t=d.getState(),o=e.device_type==="doser"?t.configurations.dosers.get(e.address):t.configurations.lights.get(e.address);return`
    <div class="card device-card-settings" style="padding: 0; height: 100%; display: flex; flex-direction: column; border-left: 4px solid var(--primary);">
      <div class="card-header" style="padding: 16px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 18px; font-weight: 600; margin: 0; color: var(--text-primary);">
          ${n}
        </h3>
        <button 
          class="btn btn-outline" 
          style="font-size: 13px; padding: 6px 12px; white-space: nowrap;"
          onclick="window.handleExportDeviceConfig('${e.address}')"
          title="Import/Export device configuration"
        >
          Import/Export
        </button>
      </div>
      <div style="padding: 0; flex: 1; overflow-y: auto;">
        <div style="padding: 0px 16px 16px 16px;">
          <label style="display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">Device Name</label>
          <input 
            type="text" 
            class="form-input device-name-input"
            value="${(o==null?void 0:o.name)||n}"
            placeholder="Enter device name"
            style="width: 100%; padding: 6px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-primary); color: var(--text-primary); font-size: 14px;"
          />
        </div>

        ${e.device_type==="doser"?`
          <div style="padding: 0 16px 16px 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              ${[1,2,3,4].map(i=>{var a;return`
                <div>
                  <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Head ${i}</label>
                  <input 
                    type="text" 
                    class="form-input head-name-input"
                    data-head="${i}"
                    value="${((a=o==null?void 0:o.headNames)==null?void 0:a[i])||""}"
                    placeholder="Enter name"
                    style="width: 100%; padding: 6px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-primary); color: var(--text-primary); font-size: 14px;"
                  />
                </div>
              `}).join("")}
            </div>
          </div>
        `:""}

        <div style="padding: 0 16px 16px 16px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input 
              type="checkbox" 
              class="auto-reconnect-checkbox"
              ${o!=null&&o.autoReconnect?"checked":""}
              style="cursor: pointer;"
            />
            <span style="font-size: 14px; color: var(--text-primary);">Auto-reconnect when available</span>
          </label>
        </div>
      </div>
      <div style="padding: 16px; border-top: 1px solid var(--border-color); background: var(--bg-secondary);">
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button 
            class="btn btn-outline" 
            onclick="window.toggleDeviceCardFlip('${e.address}')"
          >
            Cancel
          </button>
          <button 
            class="btn btn-primary" 
            onclick="window.saveDeviceCardSettings('${e.address}')"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  `}function ze(){const e=d.getState(),n=Array.from(e.devices.values()).filter(t=>{var o;return(o=t.status)==null?void 0:o.connected}).map(t=>({...t.status,address:t.address}));return`
    ${k("Devices",n)}
  `}const U=B((e,n)=>({available:!1,loading:!1,error:null,entities:[],entityStates:{},checkAvailability:async()=>{try{const o=await(await fetch("api/ha/status")).json();e({available:o.available,error:null})}catch(t){console.error("Error checking HA availability:",t),e({available:!1,error:"Failed to check Home Assistant availability"})}},fetchConfig:async()=>{e({loading:!0,error:null});try{const t=await fetch("api/ha/config");if(!t.ok)throw new Error(`Failed to fetch config: ${t.statusText}`);const o=await t.json();e({entities:o,loading:!1});for(const i of o)i.type==="switch"&&n().fetchEntityState(i.entity_id)}catch(t){console.error("Error fetching HA config:",t),e({error:t instanceof Error?t.message:"Failed to fetch configuration",loading:!1})}},fetchEntityState:async t=>{try{const o=await fetch(`api/ha/entity/${encodeURIComponent(t)}`);if(!o.ok){if(o.status===404){console.warn(`Entity not found: ${t}`);return}throw new Error(`Failed to fetch entity state: ${o.statusText}`)}const i=await o.json();e(a=>({entityStates:{...a.entityStates,[t]:i}}))}catch(o){console.error(`Error fetching state for ${t}:`,o)}},toggleSwitch:async t=>{e({error:null});try{const o=await fetch("api/ha/switch/toggle",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({entity_id:t})});if(!o.ok)throw new Error(`Failed to toggle switch: ${o.statusText}`);const i=await o.json();i.state?e(a=>({entityStates:{...a.entityStates,[t]:i.state}})):await n().fetchEntityState(t)}catch(o){console.error(`Error toggling switch ${t}:`,o),e({error:o instanceof Error?o.message:"Failed to toggle switch"})}},executeScript:async t=>{e({error:null});try{const o=await fetch("api/ha/script/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({entity_id:t})});if(!o.ok)throw new Error(`Failed to execute script: ${o.statusText}`);console.log(`Successfully executed script: ${t}`)}catch(o){console.error(`Error executing script ${t}:`,o),e({error:o instanceof Error?o.message:"Failed to execute script"})}},addEntity:async(t,o,i)=>{e({error:null});try{const a=await fetch("api/ha/config/entity",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({entity_id:t,label:o,type:i})});if(!a.ok)throw new Error(`Failed to add entity: ${a.statusText}`);await n().fetchConfig()}catch(a){console.error(`Error adding entity ${t}:`,a),e({error:a instanceof Error?a.message:"Failed to add entity"})}},removeEntity:async t=>{e({error:null});try{const o=await fetch(`api/ha/config/entity/${encodeURIComponent(t)}`,{method:"DELETE"});if(!o.ok)throw new Error(`Failed to remove entity: ${o.statusText}`);e(i=>{const{[t]:a,...r}=i.entityStates;return{entities:i.entities.filter(s=>s.entity_id!==t),entityStates:r}})}catch(o){console.error(`Error removing entity ${t}:`,o),e({error:o instanceof Error?o.message:"Failed to remove entity"})}},updateEntityState:(t,o)=>{e(i=>({entityStates:{...i.entityStates,[t]:o}}))},setError:t=>{e({error:t})}})),h=U,Ne=Object.freeze(Object.defineProperty({__proto__:null,haStore:U,useHAStore:h},Symbol.toStringTag,{value:"Module"}));function J(e,n){const t=(n==null?void 0:n.state)||"unknown",a=t==="on"?"state-on":t==="off"?"state-off":"state-unknown";return`
    <div class="ha-entity-card switch-control" data-entity-id="${e.entity_id}">
      <div class="entity-header">
        <h3>${e.label}</h3>
      </div>
      <div class="entity-content">
        <div class="state-display ${a}">
          <span class="state-label">State:</span>
          <span class="state-value">${t.toUpperCase()}</span>
        </div>
        <div class="entity-controls">
          <button 
            class="btn-toggle" 
            data-action="toggle"
            data-entity-id="${e.entity_id}"
          >
            Toggle
          </button>
        </div>
      </div>
    </div>
  `}function Q(e){e.querySelectorAll('[data-action="toggle"]').forEach(t=>{t.addEventListener("click",async()=>{const o=t.dataset.entityId;if(o){t.disabled=!0;try{await h.getState().toggleSwitch(o)}finally{t.disabled=!1}}})})}function G(e){return`
    <div class="ha-entity-card script-control" data-entity-id="${e.entity_id}">
      <div class="entity-header">
        <h3>${e.label}</h3>
        <span class="entity-id">${e.entity_id}</span>
      </div>
      <div class="entity-content">
        <div class="state-display">
          <span class="state-label">Type:</span>
          <span class="state-value">SCRIPT</span>
        </div>
        <div class="entity-controls">
          <button 
            class="btn-execute" 
            data-action="execute"
            data-entity-id="${e.entity_id}"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  `}function Z(e){e.querySelectorAll('[data-action="execute"]').forEach(t=>{t.addEventListener("click",async()=>{const o=t.dataset.entityId;if(o){t.disabled=!0,t.textContent="Executing...";try{await h.getState().executeScript(o),t.textContent="Executed!",setTimeout(()=>{t.textContent="Execute"},2e3)}catch{t.textContent="Failed",setTimeout(()=>{t.textContent="Execute"},2e3)}finally{t.disabled=!1}}})})}function T(){return`
    <div class="ha-config-panel">
      <h3>Add Entity</h3>
      <form id="add-entity-form" class="entity-form">
        <div class="form-group">
          <label for="entity-id-input">Entity ID</label>
          <input 
            type="text" 
            id="entity-id-input" 
            placeholder="switch.aquarium_pump"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="entity-label-input">Label</label>
          <input 
            type="text" 
            id="entity-label-input" 
            placeholder="Main Pump"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="entity-type-select">Type</label>
          <select id="entity-type-select" required>
            <option value="switch">Switch</option>
            <option value="script">Script</option>
          </select>
        </div>
        
        <button type="submit" class="btn-primary">Add Entity</button>
      </form>
    </div>
  `}function X(e){const n=e.querySelector("#add-entity-form");n&&n.addEventListener("submit",async t=>{t.preventDefault();const o=n.querySelector("#entity-id-input"),i=n.querySelector("#entity-label-input"),a=n.querySelector("#entity-type-select");if(!o||!i||!a)return;const r=o.value.trim(),s=i.value.trim(),l=a.value;if(!(!r||!s))try{await h.getState().addEntity(r,s,l),o.value="",i.value="",a.selectedIndex=0}catch(c){console.error("Failed to add entity:",c)}})}function K(){const{available:e,loading:n,error:t,entities:o,entityStates:i}=h.getState();if(!e)return`
      <div class="ha-controls-container">
        <div class="ha-header">
          <h2>Home Assistant Controls</h2>
          <button id="refresh-ha-button" class="btn-refresh">Check Connection</button>
        </div>
        
        <div class="ha-unavailable">
          <p>⚠️ Home Assistant integration is not available.</p>
          <p class="note">This feature requires running as a Home Assistant add-on with SUPERVISOR_TOKEN.</p>
          <p class="note">In development mode, the UI is still accessible below for testing purposes.</p>
        </div>
        
        <div class="ha-content">
          <div class="ha-empty">
            <p>No entities configured yet.</p>
            <p class="note">Add your first Home Assistant entity below (UI only - won't work without HA connection).</p>
          </div>
          
          <div class="ha-config-section">
            ${T()}
          </div>
        </div>
      </div>
    `;if(n&&o.length===0)return`
      <div class="ha-controls-container">
        <div class="ha-loading">
          <h2>Home Assistant Controls</h2>
          <p>Loading entities...</p>
        </div>
      </div>
    `;const a=t?`
    <div class="ha-error">
      ${t}
    </div>
  `:"",r=o.length>0?`
    <div class="ha-entities-grid">
      ${o.map(s=>s.type==="switch"?J(s,i[s.entity_id]):G(s)).join("")}
    </div>
  `:`
    <div class="ha-empty">
      <p>No entities configured yet.</p>
      <p class="note">Add your first Home Assistant entity below.</p>
    </div>
  `;return`
    <div class="ha-controls-container">
      <div class="ha-header">
        <h2>Home Assistant Controls</h2>
        <button id="refresh-ha-button" class="btn-refresh">Refresh</button>
      </div>
      
      ${a}
      
      <div class="ha-content">
        ${r}
        
        <div class="ha-config-section">
          ${T()}
        </div>
      </div>
    </div>
  `}function Oe(e){Q(e),Z(e),X(e);const n=e.querySelector("#refresh-ha-button");n&&n.addEventListener("click",async()=>{n.disabled=!0;try{await h.getState().checkAvailability(),h.getState().available&&await h.getState().fetchConfig()}finally{n.disabled=!1}}),e.querySelectorAll('[data-action="delete"]').forEach(o=>{o.addEventListener("click",async()=>{const i=o.dataset.entityId;if(i&&confirm(`Remove entity ${i}?`)){o.disabled=!0;try{await h.getState().removeEntity(i)}finally{o.disabled=!1}}})})}const He=Object.freeze(Object.defineProperty({__proto__:null,attachConfigHandlers:X,attachHAHandlers:Oe,attachScriptHandlers:Z,attachSwitchHandlers:Q,renderEntityConfig:T,renderHAControls:K,renderScriptControl:G,renderSwitchControl:J},Symbol.toStringTag,{value:"Module"}));function Re(){return`
    <div class="ha-tab-container" id="ha-controls-root">
      ${K()}
    </div>
  `}function Fe(){const e=d.getState(),n=Array.from(e.devices.values()).map(t=>({...t.status,address:t.address})).filter(t=>t.address);return`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Raw Device Data -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Raw Device Data</h2>
          <div class="badge badge-info">${n.length}</div>
        </div>
        <div style="padding: 20px;">
          ${n.length===0?`
            <div class="empty-state" style="text-align: center; color: var(--gray-500); padding: 40px 20px;">
              <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
              <h3 style="margin: 0 0 8px 0; color: var(--gray-700);">No Connected Devices</h3>
              <p style="margin: 0; color: var(--gray-500);">Connect to devices to see raw payload data for debugging.</p>
            </div>
          `:`
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${n.map(t=>je(t)).join("")}
            </div>
          `}
        </div>
      </div>
    </div>
  `}function je(e){const n=`device-${e.address.replace(/:/g,"-")}`,t=e.updated_at?new Date(e.updated_at*1e3).toLocaleString():"Unknown";return`
    <div class="device-raw-data-card" style="border: 1px solid var(--gray-200); border-radius: 8px; overflow: hidden;">
      <!-- Collapsible Header -->
      <div class="device-raw-data-header"
           onclick="window.toggleDeviceRawData('${n}')"
           style="padding: 16px; background: var(--gray-50); cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--gray-200);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="collapse-icon" id="${n}-icon" style="transition: transform 0.2s ease;">▶</div>
          <h4 style="margin: 0; color: var(--gray-900); font-size: 16px; font-weight: 600;">
            ${e.address}
          </h4>
          <div class="badge badge-secondary" style="font-size: 11px;">${e.device_type}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: ${e.connected?"var(--success-light)":"var(--gray-100)"}; border-radius: 12px; font-size: 12px; font-weight: 500; color: ${e.connected?"var(--success)":"var(--gray-600)"};">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${e.connected?"var(--success)":"var(--gray-400)"};"></span>
            ${e.connected?"Connected":"Disconnected"}
          </div>
          <div style="font-size: 12px; color: var(--gray-500);">${t}</div>
        </div>
      </div>

      <!-- Collapsible Content -->
      <div class="device-raw-data-content" id="${n}-content" style="display: none; padding: 16px; background: var(--bg-primary);">
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; color: var(--gray-500); margin-bottom: 4px; font-weight: 600;">Status Info</div>
          <div style="color: var(--gray-500); font-style: italic; padding: 12px; background: var(--gray-50); border-radius: 6px; border: 1px solid var(--gray-200);">Ultra-minimal DeviceStatus: only connection state. Parsed data available in device JSON files.</div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; color: var(--gray-500); margin-bottom: 8px; font-weight: 600;">Raw Status</div>
          <pre style="background: var(--gray-50); padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; margin: 0; border: 1px solid var(--gray-200);">${JSON.stringify(e,null,2)}</pre>
        </div>
      </div>
    </div>
  `}function S(){return`
    <div class="production-dashboard">
      ${Ve()}
      ${Be()}
      <main class="prod-main">
        ${qe()}
      </main>
      ${We()}
    </div>
  `}function Ve(){const e=d.getState();return Array.from(e.devices.values()).some(n=>n.isLoading),`
    <header class="prod-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-title">
            <h1>AquaBle</h1>
          </div>
        </div>
        <div class="header-actions">
          <div class="theme-toggle-container">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="toggle-icon sun-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path></svg>
            <div
              class="theme-toggle"
              onclick="window.toggleTheme()"
              title="Toggle Dark Mode"
              role="button"
              tabindex="0"
              aria-label="Toggle dark mode"
            >
              <div id="theme-toggle-knob" class="theme-knob ${(()=>{try{return localStorage.getItem("theme")==="dark"?"on":""}catch{return""}})()}" ></div>
            </div>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="toggle-icon moon-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path></svg>
          </div>
        </div>
      </div>
    </header>
  `}function Be(){const e=d.getState();return`
    <nav class="prod-nav">
      <div class="nav-content">
        <button
          class="nav-tab ${e.ui.currentView==="overview"?"active":""}"
          onclick="window.switchTab('overview')"
        >
          Overview
        </button>
        <button
          class="nav-tab ${e.ui.currentView==="ha"?"active":""}"
          onclick="window.switchTab('ha')"
        >
          Home Assistant
        </button>
      </div>
    </nav>
  `}function qe(){const e=d.getState();return e.ui.globalError?`
      <div class="error-state">
        <div class="error-icon">❌</div>
        <h2>Error Loading Dashboard</h2>
        <p>${e.ui.globalError}</p>
        <button class="btn btn-primary" onclick="window.handleRefreshAll()">
          Try Again
        </button>
      </div>
    `:`
    <div class="tab-panel ${e.ui.currentView==="overview"?"active":""}" id="overview-panel">
      ${ze()}
    </div>
    <div class="tab-panel ${e.ui.currentView==="ha"?"active":""}" id="ha-panel">
      ${Re()}
    </div>
    <div class="tab-panel ${e.ui.currentView==="dev"?"active":""}" id="dev-panel">
      ${Fe()}
    </div>
  `}function We(){return`
    <footer class="prod-footer">
      <div class="footer-content">
        <a href="/tests/test-hub.html" target="_blank" class="footer-link">
          Test
        </a>
      </div>
    </footer>
  `}function P(){const e=document.querySelector(".production-dashboard");if(e){e.outerHTML=S();const n=document.getElementById("ha-controls-root");n&&f(async()=>{const{attachHAHandlers:t}=await Promise.resolve().then(()=>He);return{attachHAHandlers:t}},void 0,import.meta.url).then(({attachHAHandlers:t})=>{t(n)})}}const I=Object.freeze(Object.defineProperty({__proto__:null,refreshDashboard:P,renderProductionDashboard:S},Symbol.toStringTag,{value:"Module"}));async function M(e){const n=await fetch(e,{headers:{Accept:"application/json"}});if(!n.ok){const t=await n.text().catch(()=>"");throw new Error(`Request failed (${n.status}): ${t||n.statusText}`)}return await n.json()}async function D(e,n){const t=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:n===void 0?void 0:JSON.stringify(n)});if(!t.ok){const o=await t.text().catch(()=>"");throw new Error(`Request failed (${t.status}): ${o||t.statusText}`)}return await t.json()}async function Ue(e,n){const t=await fetch(e,{method:"PATCH",headers:{"Content-Type":"application/json",Accept:"application/json"},body:n===void 0?void 0:JSON.stringify(n)});if(!t.ok){const o=await t.text().catch(()=>"");throw new Error(`Request failed (${t.status}): ${o||t.statusText}`)}return await t.json()}const _=Object.freeze(Object.defineProperty({__proto__:null,fetchJson:M,patchJson:Ue,postJson:D},Symbol.toStringTag,{value:"Module"}));async function z(){return M("api/status")}async function Je(e){return D(`api/devices/${encodeURIComponent(e)}/connect`,{})}async function Qe(e){await D(`api/devices/${encodeURIComponent(e)}/disconnect`,{})}async function Ge(e){await D(`api/devices/${encodeURIComponent(e)}/status`,{})}async function Ze(e=5){return M(`api/scan?timeout=${e}`)}const H=Object.freeze(Object.defineProperty({__proto__:null,connectDevice:Je,disconnectDevice:Qe,getDeviceStatus:z,refreshDeviceStatus:Ge,scanDevices:Ze},Symbol.toStringTag,{value:"Module"}));async function Y(){const e=d.getState().actions;e.setGlobalError(null);try{console.log("🔄 Initializing Zustand store..."),await e.initializeStore(),console.log("✅ Zustand store initialized"),console.log("🌐 Fetching device status from API");try{const n=await z(),t=[];for(const[o,i]of Object.entries(n)){e.updateDevice(o,i),console.log(`📥 Fetching configuration for ${o}...`);const a=e.refreshDeviceConfig(o,i.device_type).catch(r=>console.error(`Failed to load config for ${o}:`,r));t.push(a)}await Promise.allSettled(t),console.log("✅ Device status loaded:",Object.keys(n).length,"devices")}catch(n){console.error("❌ Failed to load device status:",n),e.setGlobalError("Failed to load device status")}}catch(n){const t=n instanceof Error?n.message:String(n);console.error("❌ Failed to load dashboard data:",t),e.setGlobalError(`Failed to load dashboard data: ${t}`)}}async function Xe(){try{await d.getState().actions.refreshDevices()}catch(e){console.error("❌ Failed to refresh device status:",e)}}let $=null,R=0;const F=2e3;async function ee(){const e=Date.now(),n=e-R;if(n<F){console.log(`⏱️  Config fetch debounced (last fetch: ${n}ms ago)`),$!==null&&clearTimeout($);const t=F-n;$=window.setTimeout(()=>{console.log("🔄 Running deferred configuration fetch"),ee().catch(o=>console.error("Failed to refresh configs:",o))},t);return}console.log("🔄 Fetching configurations (not debounced)"),R=e;try{const{useActions:t}=await f(async()=>{const{useActions:o}=await Promise.resolve().then(()=>W);return{useActions:o}},void 0,import.meta.url);await t().loadConfigurations()}catch(t){console.error("Failed to load configurations:",t)}}const x=Object.freeze(Object.defineProperty({__proto__:null,debouncedRefreshConfigurations:ee,loadAllDashboardData:Y,refreshDeviceStatusOnly:Xe},Symbol.toStringTag,{value:"Module"}));function te(){const e=document.getElementById("watt-red"),n=document.getElementById("watt-green"),t=document.getElementById("watt-blue"),o=document.getElementById("watt-white"),i=document.getElementById("wattage-results");if(!e||!n||!t||!o||!i)return;const a=parseInt(e.value)||0,r=parseInt(n.value)||0,s=parseInt(t.value)||0,l=parseInt(o.value)||0,c=de({red:a,green:r,blue:s,white:l});Ke(c)}function Ke(e){const n=document.getElementById("wattage-results");n&&(n.innerHTML=`
    <!-- Total Wattage -->
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 36px; font-weight: bold; color: var(--primary); margin-bottom: 8px;">${b(e.totalWattage)}</div>
      <div style="color: var(--gray-600);">Total Power Consumption</div>
      ${e.powerLimited?'<div style="color: var(--warning); font-size: 14px; margin-top: 4px;">⚠️ Power limited from ${formatWattage(result.requestedWattage)}</div>':""}
    </div>

    <!-- Channel Breakdown -->
    <div style="margin-bottom: 20px;">
      <h4 style="margin: 0 0 12px 0; color: var(--gray-900);">Channel Power Distribution</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="color: #ef4444; font-weight: bold; margin-bottom: 4px;">Red</div>
          <div>${b(e.channelWattages.red)}</div>
        </div>
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="color: #22c55e; font-weight: bold; margin-bottom: 4px;">Green</div>
          <div>${b(e.channelWattages.green)}</div>
        </div>
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="color: #3b82f6; font-weight: bold; margin-bottom: 4px;">Blue</div>
          <div>${b(e.channelWattages.blue)}</div>
        </div>
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="color: #64748b; font-weight: bold; margin-bottom: 4px;">White</div>
          <div>${b(e.channelWattages.white)}</div>
        </div>
      </div>
    </div>

    <!-- Technical Details -->
    <div>
      <h4 style="margin: 0 0 12px 0; color: var(--gray-900);">Technical Details</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="font-size: 12px; color: var(--gray-500); margin-bottom: 4px;">Step Sum</div>
          <div style="font-weight: bold; color: var(--gray-900);">${e.stepSum}W</div>
        </div>
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="font-size: 12px; color: var(--gray-500); margin-bottom: 4px;">Embedded Base</div>
          <div style="font-weight: bold; color: var(--gray-900);">${e.embeddedBaseSum}W</div>
        </div>
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="font-size: 12px; color: var(--gray-500); margin-bottom: 4px;">Shared Base</div>
          <div style="font-weight: bold; color: var(--gray-900);">${e.sharedBase}W</div>
        </div>
      </div>
    </div>
  `)}function ne(){window.switchTab=async e=>{d.getState().actions.setCurrentView(e),P()},window.handleScanDevices=async()=>{const{showScanConnectModal:e}=await f(async()=>{const{showScanConnectModal:n}=await import("./scan-connect-modal-CFDHfpy4.js");return{showScanConnectModal:n}},__vite__mapDeps([3,1]),import.meta.url);await e()},window.refreshDashboard=()=>{f(async()=>{const{refreshDashboard:e}=await Promise.resolve().then(()=>I);return{refreshDashboard:e}},void 0,import.meta.url).then(({refreshDashboard:e})=>{e()})},window.toggleTheme=()=>{const e=localStorage.getItem("theme"),n=e==="dark"?"light":"dark";console.log("Toggling theme from",e,"to",n),localStorage.setItem("theme",n),document.documentElement.className=n==="dark"?"dark-theme":"",console.log("Updated document.documentElement.className to:",document.documentElement.className),window.refreshDashboard()},window.toggleDeviceRawData=e=>{const n=document.getElementById(`${e}-content`),t=document.getElementById(`${e}-icon`);if(n&&t){const o=n.style.display!=="none";n.style.display=o?"none":"block",t.style.transform=o?"rotate(0deg)":"rotate(90deg)"}},window.handleRefreshAll=async()=>{const{refreshDeviceStatusOnly:e}=await f(async()=>{const{refreshDeviceStatusOnly:o}=await Promise.resolve().then(()=>x);return{refreshDeviceStatusOnly:o}},void 0,import.meta.url),n=document.querySelector('[onclick*="handleRefreshAll"]'),t=n==null?void 0:n.innerHTML;try{n&&(n.disabled=!0,n.innerHTML='<span class="scan-spinner"></span> Refreshing...'),await e(),d.getState().actions.addNotification({type:"success",message:"Device status refreshed successfully"})}catch(o){d.getState().actions.addNotification({type:"error",message:`Failed to refresh device status: ${o instanceof Error?o.message:String(o)}`})}finally{n&&t&&(n.disabled=!1,n.innerHTML=t)}},window.handleRefreshDevice=async e=>{const{refreshDeviceStatus:n}=await f(async()=>{const{refreshDeviceStatus:a}=await Promise.resolve().then(()=>H);return{refreshDeviceStatus:a}},void 0,import.meta.url),{refreshDeviceStatusOnly:t}=await f(async()=>{const{refreshDeviceStatusOnly:a}=await Promise.resolve().then(()=>x);return{refreshDeviceStatusOnly:a}},void 0,import.meta.url),o=document.querySelector(`[onclick*="handleRefreshDevice('${e}')"]`),i=o==null?void 0:o.innerHTML;try{o&&(o.disabled=!0,o.innerHTML='<span class="scan-spinner"></span>'),await n(e),await t(),d.getState().actions.addNotification({type:"success",message:`Device ${e} status refreshed`,autoHide:!0})}catch(a){d.getState().actions.addNotification({type:"error",message:`Failed to refresh device status: ${a instanceof Error?a.message:String(a)}`})}finally{o&&i&&(o.disabled=!1,o.innerHTML=i)}},setTimeout(()=>{document.getElementById("watt-red")&&te()},100),window.handleDeleteDevice=async(e,n)=>{console.log("Delete device:",e,n)},window.openDeviceSettings=async(e,n)=>{const{showDoserDeviceSettingsModal:t,showLightDeviceSettingsModal:o}=await f(async()=>{const{showDoserDeviceSettingsModal:r,showLightDeviceSettingsModal:s}=await import("./device-modals-DfXlkiaw.js");return{showDoserDeviceSettingsModal:r,showLightDeviceSettingsModal:s}},__vite__mapDeps([4,2,1]),import.meta.url),i=d.getState(),a=n==="doser"?i.configurations.dosers.get(e):i.configurations.lights.get(e);if(!a){d.getState().actions.addNotification({type:"error",message:`Device configuration not found for ${n}`,autoHide:!0});return}n==="doser"?t(a):n==="light"&&o(a)},window.toggleDeviceConnection=async e=>{var a,r,s,l;const{connectDevice:n,disconnectDevice:t}=await f(async()=>{const{connectDevice:c,disconnectDevice:u}=await Promise.resolve().then(()=>H);return{connectDevice:c,disconnectDevice:u}},void 0,import.meta.url),{refreshDeviceStatusOnly:o}=await f(async()=>{const{refreshDeviceStatusOnly:c}=await Promise.resolve().then(()=>x);return{refreshDeviceStatusOnly:c}},void 0,import.meta.url),i=document.querySelector(`[onclick*="toggleDeviceConnection('${e}')"]`);i&&((a=i.textContent)==null||a.trim(),i.disabled=!0,i.classList.add("connecting"),i.textContent="Connecting...");try{const u=(r=d.getState().devices.get(e))==null?void 0:r.status;if(u==null?void 0:u.connected)await t(e),await o(),d.getState().actions.addNotification({type:"success",message:"Successfully disconnected from device"}),i&&(i.disabled=!1,i.classList.remove("connecting"),i.innerHTML="Connect");else{const p=await n(e);d.getState().actions.updateDevice(e,p),await o(),d.getState().actions.addNotification({type:"success",message:"Successfully connected to device"}),i&&(i.disabled=!1,i.innerHTML="Disconnect")}}catch(c){d.getState().actions.addNotification({type:"error",message:`Failed to ${(s=i==null?void 0:i.textContent)!=null&&s.includes("Disconnect")?"disconnect":"connect"} to device: ${c instanceof Error?c.message:"Unknown error"}`}),i&&(i.disabled=!1,i.classList.remove("connecting"),i.innerHTML=(l=i.textContent)!=null&&l.includes("Disconnect")?"Disconnect":"Connect")}},window.saveDeviceCardSettings=async e=>{var s;const{updateDeviceNaming:n,updateDeviceSettings:t}=await f(async()=>{const{updateDeviceNaming:l,updateDeviceSettings:c}=await import("./configurations-BzOxCh-6.js");return{updateDeviceNaming:l,updateDeviceSettings:c}},__vite__mapDeps([0,1]),import.meta.url),o=document.querySelector(`[data-device-address="${e}"]`);if(!o)return;const i=o.querySelector(".device-name-input"),a=o.querySelectorAll(".head-name-input"),r=o.querySelector(".auto-reconnect-checkbox");try{const l=(s=i==null?void 0:i.value)==null?void 0:s.trim(),c={};a.length>0&&a.forEach(g=>{const p=parseInt(g.dataset.head||"0"),v=g.value.trim();v&&(c[p]=v)});const u={name:l||void 0};Object.keys(c).length>0&&(u.headNames=c),await n(e,u),r&&await t(e,{autoReconnect:r.checked}),window.toggleDeviceCardFlip(e),d.getState().actions.addNotification({type:"success",message:"Device settings saved",autoHide:!0})}catch(l){console.error("Failed to save device settings:",l),d.getState().actions.addNotification({type:"error",message:"Failed to save device settings",autoHide:!0})}},window.handleExportDeviceConfig=async e=>{const{showImportExportModal:n}=await f(async()=>{const{showImportExportModal:a}=await import("./import-export-modal-DwKGiAr5.js");return{showImportExportModal:a}},__vite__mapDeps([5,0,1]),import.meta.url),t=d.getState(),o=t.configurations.dosers.get(e);t.configurations.lights.get(e),await n(e,o?"doser":"light")},window.handleImportDeviceConfig=async e=>{const{showImportExportModal:n}=await f(async()=>{const{showImportExportModal:a}=await import("./import-export-modal-DwKGiAr5.js");return{showImportExportModal:a}},__vite__mapDeps([5,0,1]),import.meta.url),t=d.getState(),o=t.configurations.dosers.get(e);t.configurations.lights.get(e),await n(e,o?"doser":"light")}}const Ye=Object.freeze(Object.defineProperty({__proto__:null,calculateWattageFromInputs:te,initializeDashboardHandlers:ne,loadAllDashboardData:Y,refreshDashboard:P,renderProductionDashboard:S},Symbol.toStringTag,{value:"Module"}));function et(){const e=document.createElement("div");e.id="notification-container",e.className="notification-container",document.body.appendChild(e);const n=document.createElement("style");n.textContent=`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
      pointer-events: none;
    }

    .notification {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 12px;
      padding: 16px;
      pointer-events: auto;
      transform: translateX(100%);
      transition: all 0.3s ease;
      border-left: 4px solid #ccc;
    }

    .notification.show {
      transform: translateX(0);
    }

    .notification.info {
      border-left-color: #3b82f6;
    }

    .notification.success {
      border-left-color: #10b981;
    }

    .notification.warning {
      border-left-color: #f59e0b;
    }

    .notification.error {
      border-left-color: #ef4444;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .notification-type {
      font-weight: 600;
      text-transform: capitalize;
      font-size: 14px;
    }

    .notification-close {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-close:hover {
      color: #374151;
    }

    .notification-message {
      color: #374151;
      font-size: 14px;
      line-height: 1.4;
    }

    .notification-time {
      color: #6b7280;
      font-size: 12px;
      margin-top: 8px;
    }
  `,document.head.appendChild(n)}function tt(){const e=document.getElementById("notification-container");if(!e)return;const n=L(),{removeNotification:t}=q();e.innerHTML="",n.forEach(o=>{const i=nt(o,t);e.appendChild(i),requestAnimationFrame(()=>{i.classList.add("show")})})}function nt(e,n){const t=document.createElement("div");t.className=`notification ${e.type}`;const o=oe(e.timestamp);t.innerHTML=`
    <div class="notification-header">
      <span class="notification-type">${e.type}</span>
      <button class="notification-close" data-id="${e.id}">×</button>
    </div>
    <div class="notification-message">${ot(e.message)}</div>
    <div class="notification-time">${o}</div>
  `;const i=t.querySelector(".notification-close"),a=()=>{t.classList.remove("show"),setTimeout(()=>{n(e.id)},300)};return i.addEventListener("click",a),setTimeout(()=>{t.parentNode&&a()},5e3),t}function oe(e){const t=Date.now()-e;return t<1e3?"Just now":t<6e4?`${Math.floor(t/1e3)}s ago`:t<36e5?`${Math.floor(t/6e4)}m ago`:t<864e5?`${Math.floor(t/36e5)}h ago`:new Date(e).toLocaleDateString()}function ot(e){const n=document.createElement("div");return n.textContent=e,n.innerHTML}setInterval(()=>{const e=document.getElementById("notification-container");if(!e)return;const n=e.querySelectorAll(".notification-time"),t=L();n.forEach((o,i)=>{const a=t[i];a&&(o.textContent=oe(a.timestamp))})},3e4);let y=new Map;function it(){d.subscribe(e=>{const n=e.devices;if(!(e.ui.currentView==="overview")){y=new Map(n);return}at(n,y)&&(rt(n),y=new Map(n))}),console.log("Device card updater initialized with intelligent filtering")}function at(e,n){if(e.size!==n.size)return!0;for(const[t,o]of e.entries()){const i=n.get(t);if(!i||ie(i,o))return!0}for(const t of n.keys())if(!e.has(t))return!0;return!1}function rt(e){new Set(y.keys()),new Set(e.keys());const n=Array.from(y.values()).filter(l=>{var c;return(c=l.status)==null?void 0:c.connected}).map(l=>l.address),t=Array.from(e.values()).filter(l=>{var c;return(c=l.status)==null?void 0:c.connected}).map(l=>l.address),o=new Set(n),i=new Set(t),a=t.filter(l=>!o.has(l)),r=n.filter(l=>!i.has(l)),s=t.filter(l=>{if(a.includes(l))return!1;const c=y.get(l),u=e.get(l);return c&&u&&ie(c,u)});if((a.length>0||r.length>0||s.length>0)&&console.log(`🔄 Device card updates: +${a.length} -${r.length} ~${s.length}`),n.length===0&&t.length>0){console.log("Transitioning from empty state to devices, full refresh needed"),A();return}else if(n.length>0&&t.length===0){console.log("Transitioning to empty state, full refresh needed"),A();return}r.length>0&&r.forEach(l=>st(l)),a.length>0&&a.forEach(l=>{const c=e.get(l);c!=null&&c.status&&ae(c)}),s.length>0&&s.forEach(l=>{const c=e.get(l);c!=null&&c.status&&ct(c)}),n.length!==t.length&&lt(t.length)}function ie(e,n){if(!e.status||!n.status||e.status.connected!==n.status.connected||e.isLoading!==n.isLoading||e.error!==n.error)return!0;const t=JSON.stringify(e.status),o=JSON.stringify(n.status);if(t!==o)return!0;const i=JSON.stringify(e.configuration),a=JSON.stringify(n.configuration);return i!==a}function ae(e){if(!e.status)return;const n=dt();if(!n){console.warn("Device card container not found, falling back to full refresh"),A();return}const t={...e.status,address:e.address},o=document.createElement("div");o.innerHTML=k("",[t]);const i=o.querySelector(".device-card");i&&(i.classList.add("device-card-entering"),n.appendChild(i),i.getBoundingClientRect(),setTimeout(()=>{i.classList.remove("device-card-entering")},300))}function st(e){const n=re(e);n&&(n.classList.add("device-card-leaving"),setTimeout(()=>{n.remove()},300))}function ct(e){if(!e.status)return;const n=re(e.address);if(!n){console.warn(`Device card not found for ${e.address}, adding it`),ae(e);return}const t={...e.status,address:e.address},o=document.createElement("div");o.innerHTML=k("",[t]);const i=o.querySelector(".device-card");if(i){if(n.innerHTML===i.innerHTML){console.log(`Device ${e.address} HTML unchanged, skipping update`);return}const a=window.scrollY;n.replaceWith(i),window.scrollTo(0,a),console.log(`Updated device card for ${e.address}`)}}function lt(e){const n=document.querySelector(".card-header .badge");n&&(n.textContent=String(e))}function dt(){const e=document.getElementById("overview-panel");return e?e.querySelector('[style*="display: grid"]'):null}function re(e){const n=document.querySelectorAll(".device-card");for(const t of Array.from(n)){const o=t.querySelectorAll("button[onclick]");for(const i of Array.from(o)){const a=i.getAttribute("onclick");if(a!=null&&a.includes(e))return t}}return null}function A(){f(async()=>{const{refreshDashboard:e}=await Promise.resolve().then(()=>I);return{refreshDashboard:e}},void 0,import.meta.url).then(({refreshDashboard:e})=>{e()}).catch(e=>{console.warn("Could not refresh dashboard:",e)})}function ut(){console.log("Setting up state subscriptions with targeted device card updates"),it();let e=0;d.subscribe(t=>{const o=t.ui.notifications.length;o!==e&&(e=o,tt())});let n=d.getState().ui.currentView;d.subscribe(t=>{t.ui.currentView!==n&&(n=t.ui.currentView,console.log(`📱 View changed to: ${n}`),gt())}),console.log("State subscriptions active with targeted updates")}function gt(){f(async()=>{const{refreshDashboard:e}=await Promise.resolve().then(()=>I);return{refreshDashboard:e}},void 0,import.meta.url).then(({refreshDashboard:e})=>{e()}).catch(e=>{console.warn("Could not refresh dashboard:",e)})}class ft{constructor(){C(this,"state",{isActive:!1,intervalId:null,intervalMs:3e4,lastPollTime:0,failureCount:0,maxFailures:5});C(this,"subscribers",[])}startPolling(n=3e4){if(this.state.isActive){console.log("ℹ️  Polling already active");return}this.state.intervalMs=n,this.state.isActive=!0,this.state.failureCount=0,console.log(`🔄 Starting device status polling (interval: ${n}ms)`),this.poll(),this.state.intervalId=window.setInterval(()=>{this.poll()},n)}stopPolling(){if(!this.state.isActive){console.log("ℹ️  Polling not active");return}this.state.intervalId!==null&&(clearInterval(this.state.intervalId),this.state.intervalId=null),this.state.isActive=!1,this.state.failureCount=0,console.log("⏸️  Device status polling stopped")}setInterval(n){this.state.intervalMs=n,this.state.isActive&&(this.stopPolling(),this.startPolling(n))}subscribe(n){return this.subscribers.push(n),()=>{this.subscribers=this.subscribers.filter(t=>t!==n)}}async poll(){try{this.state.lastPollTime=Date.now();const n=await z();this.state.failureCount=0;const t=d.getState().actions,o=d.getState(),i=o.devices;for(const[a,r]of Object.entries(n))t.updateDevice(a,r),(r.device_type==="doser"?o.configurations.dosers.has(a):o.configurations.lights.has(a))||(console.log(`📥 Fetching configuration for ${a}...`),t.refreshDeviceConfig(a,r.device_type).catch(c=>console.error(`Failed to load config for ${a}:`,c)));this.subscribers.forEach(a=>a(n)),console.log(`✅ Status poll completed (${Object.keys(n).length} devices)`)}catch(n){this.state.failureCount++,console.error(`❌ Status poll failed (${this.state.failureCount}/${this.state.maxFailures}):`,n),this.state.failureCount>=this.state.maxFailures&&(console.error("⚠️  Too many polling failures, stopping polling service"),this.stopPolling())}}getState(){return Object.freeze({...this.state})}async forcePoll(){this.state.isActive||console.log("ℹ️  Polling not active, starting temporary poll"),await this.poll()}}const se=new ft;function vt(e=3e4){se.startPolling(e)}function pt(){se.stopPolling()}let E=!1,j=!1;async function ht(){return new Promise(e=>{const n=document.querySelector("base");n?(console.log(`✅ Base tag found: ${n.href}`),setTimeout(e,0)):(console.log("ℹ️  No base tag found (direct access mode)"),e())})}async function V(){if(console.log("productionMain.init() called"),E){console.warn("Already initializing, skipping duplicate call");return}if(j){console.warn("Already initialized, skipping duplicate call");return}E=!0;try{console.log("Initializing Production Dashboard..."),await ht();const e=document.getElementById("app");if(!e)throw new Error("App element not found");localStorage.getItem("theme")==="dark"&&(document.documentElement.className="dark-theme"),et(),ne(),console.log("Rendering dashboard HTML..."),e.innerHTML=S(),console.log("Loading dashboard data...");const{loadAllDashboardData:t,refreshDashboard:o}=await f(async()=>{const{loadAllDashboardData:r,refreshDashboard:s}=await Promise.resolve().then(()=>Ye);return{loadAllDashboardData:r,refreshDashboard:s}},void 0,import.meta.url);await t(),console.log("Dashboard data loaded"),console.log("Refreshing dashboard with loaded data..."),o(),console.log("Setting up state subscriptions..."),ut(),console.log("Initializing Home Assistant integration...");const{useHAStore:i}=await f(async()=>{const{useHAStore:r}=await Promise.resolve().then(()=>Ne);return{useHAStore:r}},void 0,import.meta.url),{deviceStore:a}=await f(async()=>{const{deviceStore:r}=await Promise.resolve().then(()=>W);return{deviceStore:r}},void 0,import.meta.url);await i.getState().checkAvailability(),i.getState().available&&(console.log("Home Assistant available, loading entities..."),await i.getState().fetchConfig()),i.subscribe(()=>{a.getState().ui.currentView==="ha"&&o()}),console.log("Starting centralized device status polling..."),vt(3e4),window.addEventListener("beforeunload",()=>{pt()}),console.log("Production Dashboard initialized successfully"),j=!0}catch(e){console.error("Failed to initialize Production Dashboard:",e);const n=document.getElementById("app");n&&(n.innerHTML=`
        <div style="padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">Failed to Load Dashboard</h1>
          <p style="color: #64748b;">${e instanceof Error?e.message:String(e)}</p>
          <button
            onclick="location.reload()"
            style="padding: 10px 20px; margin-top: 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;"
          >
            Retry
          </button>
        </div>
      `)}finally{E=!1}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",V):V();export{f as _,D as a,x as b,Je as c,d,M as f,Ue as p,Ze as s,q as u};
//# sourceMappingURL=main-DFOxvOhe.js.map
