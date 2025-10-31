const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./commands-BJ6ojNfp.js","./wattage-calculator-aI2XEFfd.js","./scan-connect-modal-CMaK3J6i.js","./device-config-modal-DG5pdQpf.js","./device-modals-BbXgpACq.js"])))=>i.map(i=>d[i]);
var te=Object.defineProperty;var oe=(e,o,t)=>o in e?te(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t;var S=(e,o,t)=>oe(e,typeof o!="symbol"?o+"":o,t);import{c as ne,f as y}from"./wattage-calculator-aI2XEFfd.js";const ie="modulepreload",re=function(e,o){return new URL(e,o).href},z={},f=function(o,t,n){let i=Promise.resolve();if(t&&t.length>0){const a=document.getElementsByTagName("link"),d=document.querySelector("meta[property=csp-nonce]"),c=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));i=Promise.allSettled(t.map(s=>{if(s=re(s,n),s in z)return;z[s]=!0;const l=s.endsWith(".css"),g=l?'[rel="stylesheet"]':"";if(!!n)for(let m=a.length-1;m>=0;m--){const w=a[m];if(w.href===s&&(!l||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${g}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":ie,l||(p.as="script"),p.crossOrigin="",p.href=s,c&&p.setAttribute("nonce",c),document.head.appendChild(p),l)return new Promise((m,w)=>{p.addEventListener("load",m),p.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${s}`)))})}))}function r(a){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=a,window.dispatchEvent(d),!d.defaultPrevented)throw a}return i.then(a=>{for(const d of a||[])d.status==="rejected"&&r(d.reason);return o().catch(r)})},ae=e=>{let o;const t=new Set,n=(s,l)=>{const g=typeof s=="function"?s(o):s;if(!Object.is(g,o)){const v=o;o=l??(typeof g!="object"||g===null)?g:Object.assign({},o,g),t.forEach(p=>p(o,v))}},i=()=>o,d={setState:n,getState:i,getInitialState:()=>c,subscribe:s=>(t.add(s),()=>t.delete(s))},c=o=e(n,i,d);return d},se=e=>ae,ce=e=>(o,t,n)=>{const i=n.subscribe;return n.subscribe=(a,d,c)=>{let s=a;if(d){const l=(c==null?void 0:c.equalityFn)||Object.is;let g=a(n.getState());s=v=>{const p=a(v);if(!l(g,p)){const m=g;d(g=p,m)}},c!=null&&c.fireImmediately&&d(g,g)}return i(s)},e(o,t,n)},de=ce;function le(e){if(!e)return"Unknown error occurred";switch(e.code){case"device_not_found":return"Device not found. Please check that the device is powered on and in range.";case"device_disconnected":return"Device is disconnected. Please reconnect and try again.";case"device_busy":return"Device is busy processing another command. Please wait and try again.";case"device_timeout":return"Device communication timed out. Please check the connection and try again.";case"command_timeout":return"Command timed out. The operation may have completed - please check device status.";case"validation_error":return`Invalid input: ${e.message}`;case"invalid_arguments":return`Invalid arguments: ${e.message}`;case"ble_connection_error":return"Bluetooth connection failed. Please check device connectivity.";case"ble_characteristic_missing":return"Device communication error. The device may not be compatible.";case"config_save_error":return"Failed to save configuration. Settings may not persist.";case"internal_error":return"An internal error occurred. Please try again or contact support.";default:return e.message||"An unexpected error occurred."}}const ue=(e,o)=>({devices:new Map,configurations:{dosers:new Map,lights:new Map,isLoaded:!1},commandQueue:[],isProcessingCommands:!1,ui:{currentView:"overview",globalError:null,notifications:[]},polling:{isEnabled:!1,intervalId:null,intervalMs:3e4},actions:{loadConfigurations:async()=>{try{console.log("Configuration auto-loading is deprecated; configurations are loaded on-demand")}catch(t){console.error("Failed to load configurations:",t)}},setConfigurations:(t,n)=>{const i=new Map,r=new Map;t.forEach(d=>i.set(d.id,d)),n.forEach(d=>r.set(d.id,d)),e(d=>({configurations:{dosers:i,lights:r,isLoaded:!0}}));const a=new Map(o().devices);a.forEach((d,c)=>{const s=i.get(c)||r.get(c);s&&a.set(c,{...d,configuration:s})}),e({devices:a})},refreshDeviceConfig:async(t,n)=>{try{console.log(`Refreshing ${n} config for ${t}`);const{getDeviceConfiguration:i}=await f(async()=>{const{getDeviceConfiguration:s}=await Promise.resolve().then(()=>Q);return{getDeviceConfiguration:s}},void 0,import.meta.url),r=await i(t);if(n==="doser"){const s=new Map(o().configurations.dosers);s.set(t,r),e(l=>({configurations:{...l.configurations,dosers:s}}))}else{const s=new Map(o().configurations.lights);s.set(t,r),e(l=>({configurations:{...l.configurations,lights:s}}))}const d=new Map(o().devices),c=d.get(t);return c&&(d.set(t,{...c,configuration:r}),e({devices:d})),r}catch(i){throw console.error(`Failed to refresh ${n} config for ${t}:`,i),i}},getDeviceConfig:(t,n)=>n==="doser"?o().configurations.dosers.get(t)||null:o().configurations.lights.get(t)||null,setDevices:t=>{const n=new Map,{configurations:i}=o();t.forEach(r=>{const a=o().devices.get(r.address),d=i.dosers.get(r.address)||i.lights.get(r.address);n.set(r.address,{address:r.address,status:r,configuration:d||null,lastUpdated:Date.now(),isLoading:(a==null?void 0:a.isLoading)??!1,error:null})}),e({devices:n})},updateDevice:(t,n)=>{const i=new Map(o().devices),r=i.get(t),{configurations:a}=o(),d=a.dosers.get(t)||a.lights.get(t);i.set(t,{address:t,status:n,configuration:d||(r==null?void 0:r.configuration)||null,lastUpdated:Date.now(),isLoading:!1,error:null}),e({devices:i})},setDeviceLoading:(t,n)=>{const i=new Map(o().devices),r=i.get(t);r&&(i.set(t,{...r,isLoading:n}),e({devices:i}))},setDeviceError:(t,n)=>{const i=new Map(o().devices),r=i.get(t);r&&(i.set(t,{...r,error:n,isLoading:!1}),e({devices:i}))},queueCommand:async(t,n)=>{const i=`cmd_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,r={id:i,address:t,request:{...n,id:n.id||i},queuedAt:Date.now(),retryCount:0};return e(a=>({commandQueue:[...a.commandQueue,r]})),o().isProcessingCommands||await o().actions.processCommandQueue(),i},processCommandQueue:async()=>{const{commandQueue:t,isProcessingCommands:n,actions:i}=o();if(!(n||t.length===0)){e({isProcessingCommands:!0});try{for(;o().commandQueue.length>0;){const[r,...a]=o().commandQueue;e({commandQueue:a});try{i.setDeviceLoading(r.address,!0);const{executeCommand:d}=await f(async()=>{const{executeCommand:s}=await import("./commands-BJ6ojNfp.js");return{executeCommand:s}},__vite__mapDeps([0,1]),import.meta.url),c=await d(r.address,r.request);if(c.status==="success"){const{invalidateMetadataCache:s}=await f(async()=>{const{invalidateMetadataCache:g}=await import("./cache-service-BKX54X_n.js");return{invalidateMetadataCache:g}},[],import.meta.url);s();const{debouncedRefreshConfigurations:l}=await f(async()=>{const{debouncedRefreshConfigurations:g}=await Promise.resolve().then(()=>x);return{debouncedRefreshConfigurations:g}},void 0,import.meta.url);await l(),await i.refreshDevice(r.address),i.addNotification({type:"success",message:"Command completed successfully",autoHide:!0})}else if(c.status==="failed"||c.status==="timed_out"){const s=le(c.error_code&&c.error?{code:c.error_code,message:c.error,details:c.result||{}}:null);i.setDeviceError(r.address,s),i.addNotification({type:"error",message:s,autoHide:!1})}}catch(d){const c=d instanceof Error?d.message:"Network error";i.setDeviceError(r.address,c),i.addNotification({type:"error",message:`Network error: ${c}`,autoHide:!1})}finally{i.setDeviceLoading(r.address,!1)}}}finally{e({isProcessingCommands:!1})}}},retryCommand:t=>{const{commandQueue:n}=o(),i=n.find(r=>r.id===t);if(i){const r={...i,retryCount:i.retryCount+1,queuedAt:Date.now()};e({commandQueue:n.filter(a=>a.id!==t).concat(r)})}},cancelCommand:t=>{e(n=>({commandQueue:n.commandQueue.filter(i=>i.id!==t)}))},clearCommandQueue:()=>{e({commandQueue:[]})},setCurrentView:t=>{e(n=>({ui:{...n.ui,currentView:t}}))},setGlobalError:t=>{e(n=>({ui:{...n.ui,globalError:t}}))},addNotification:t=>{const n=`notif_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,i={...t,id:n,timestamp:Date.now()};e(r=>({ui:{...r.ui,notifications:[...r.ui.notifications,i]}})),t.autoHide&&setTimeout(()=>{o().actions.removeNotification(n)},5e3)},removeNotification:t=>{e(n=>({ui:{...n.ui,notifications:n.ui.notifications.filter(i=>i.id!==t)}}))},clearNotifications:()=>{e(t=>({ui:{...t.ui,notifications:[]}}))},initializeStore:async()=>{await o().actions.loadConfigurations(),await o().actions.refreshDevices();const t=o().devices;(Array.from(t.values()).some(i=>i.status&&!i.status.connected)||t.size===0)&&(console.log("⏱️ Starting temporary polling to detect device connections..."),o().actions.startPolling(3e3),setTimeout(()=>{const i=o().devices;Array.from(i.values()).some(a=>a.status&&!a.status.connected)?(console.log("⚠️ Some devices still disconnected after 30s, stopping polling anyway"),o().actions.stopPolling()):(console.log("✅ All devices connected, stopping polling"),o().actions.stopPolling())},3e4))},refreshDevices:async()=>{try{const{fetchJson:t}=await f(async()=>{const{fetchJson:r}=await Promise.resolve().then(()=>_);return{fetchJson:r}},void 0,import.meta.url),n=await t("api/status"),i=Object.values(n);o().actions.setDevices(i),o().actions.setGlobalError(null)}catch(t){const n=t instanceof Error?t.message:"Failed to refresh devices";throw o().actions.setGlobalError(n),t}},refreshDevice:async t=>{try{o().actions.setDeviceLoading(t,!0);const{postJson:n}=await f(async()=>{const{postJson:i}=await Promise.resolve().then(()=>_);return{postJson:i}},void 0,import.meta.url);await n(`api/devices/${encodeURIComponent(t)}/status`,{}),await o().actions.refreshDevices()}catch(n){const i=n instanceof Error?n.message:"Failed to refresh device";throw o().actions.setDeviceError(t,i),n}},connectToDevice:async t=>{try{const{postJson:n}=await f(async()=>{const{postJson:i}=await Promise.resolve().then(()=>_);return{postJson:i}},void 0,import.meta.url);await n(`api/devices/${encodeURIComponent(t)}/connect`,{}),o().actions.addNotification({type:"success",message:`Connected to device ${t}`,autoHide:!0}),await o().actions.refreshDevices()}catch(n){const i=n instanceof Error?n.message:"Failed to connect to device";throw o().actions.addNotification({type:"error",message:`Connection failed: ${i}`,autoHide:!0}),n}},startPolling:(t=3e4)=>{const{polling:n}=o();n.intervalId&&clearInterval(n.intervalId);const i=setInterval(()=>{const{configurations:r,devices:a}=o();r.isLoaded&&a.size>0&&o().actions.refreshDevices().catch(d=>{console.warn("Polling refresh failed:",d)})},t);e(r=>({polling:{...r.polling,isEnabled:!0,intervalId:i,intervalMs:t}}))},stopPolling:()=>{const{polling:t}=o();t.intervalId&&clearInterval(t.intervalId),e(n=>({polling:{...n.polling,isEnabled:!1,intervalId:null}}))},setPollingInterval:t=>{const{polling:n}=o();e(i=>({polling:{...i.polling,intervalMs:t}})),n.isEnabled&&o().actions.startPolling(t)}}}),ge=()=>se()(de(ue)),u=ge(),B=()=>u.getState().actions,T=()=>u.getState().ui.notifications,fe=Object.freeze(Object.defineProperty({__proto__:null,deviceStore:u,useActions:B,useNotifications:T},Symbol.toStringTag,{value:"Module"}));function pe(e){const t=Date.now()/1e3-e;return t<5?"just now":t<60?`${Math.floor(t)}s ago`:t<3600?`${Math.floor(t/60)}m ago`:t<86400?`${Math.floor(t/3600)}h ago`:`${Math.floor(t/86400)}d ago`}function ve(e){const t=u.getState().configurations.lights.get(e);if(!(t!=null&&t.configurations))return[];const n=t.configurations.find(a=>a.id===t.activeConfigurationId);if(!(n!=null&&n.revisions)||n.revisions.length===0)return[];const r=n.revisions[n.revisions.length-1].profile;return r.mode!=="auto"||!r.programs?[]:r.programs.map(a=>({...a,channels:t.channels}))}function me(e){const t=u.getState().configurations.lights.get(e.address);if(t!=null&&t.configurations&&t.activeConfigurationId){const n=t.configurations.find(i=>i.id===t.activeConfigurationId);if(n!=null&&n.revisions&&n.revisions.length>0){const r=n.revisions[n.revisions.length-1].profile;if(r.mode==="auto"&&r.programs&&r.programs.length>0)return he(e)}}return`
    <div style="padding: 24px; text-align: center; color: var(--gray-500); font-size: 14px;">
      <div style="font-size: 16px; color: ${e.connected?"var(--success)":"var(--gray-400)"}; margin-bottom: 8px;">
        ${e.connected?"✓ Connected":"○ Disconnected"}
      </div>
      <div style="font-size: 12px;">
        Last update: ${new Date(e.updated_at*1e3).toLocaleTimeString()}
      </div>
    </div>
  `}function he(e,o){const t=ve(e.address);if(t.length===0)return`
      <div style="padding: 16px; text-align: center; color: var(--gray-500);">
        No auto programs configured
      </div>
    `;const n={current:0,next:1,upcoming:2,disabled:3},r=[...t].sort((a,d)=>{const c=n[a.status]??99,s=n[d.status]??99;return c!==s?c-s:a.sunrise.localeCompare(d.sunrise)}).filter(a=>a.status!=="disabled").slice(0,3);return`
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
      ${r.length>0?`
        <div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${r.map(a=>ye(a)).join("")}
          </div>
        </div>
      `:`
        <div style="text-align: center; color: var(--gray-500); font-size: 13px;">
          No scheduled programs
        </div>
      `}
    </div>
  `}function ye(e){const o=d=>{switch(d){case"current":return"var(--success)";case"next":case"upcoming":return"var(--primary)";case"disabled":return"var(--error)";default:return"var(--gray-400)"}},t=d=>{switch(d){case"current":return"Active";case"next":return"Next";case"upcoming":return"Upcoming";case"disabled":return"Disabled";default:return"Unknown"}},n=o(e.status),i=t(e.status);let r="";e.channels&&Array.isArray(e.channels)?r=e.channels.map(c=>{const s=e.levels[c.key];return`${c.label||c.key.charAt(0).toUpperCase()+c.key.slice(1)}:${s}%`}).filter(c=>c).join(" "):r=Object.entries(e.levels).map(([d,c])=>`${d.charAt(0).toUpperCase()+d.slice(1)}:${c}%`).join(" ");const a=`${e.sunrise} - ${e.sunset}`;return`
    <div style="padding: 8px 12px; background: var(--bg-primary); border-radius: 4px; border-left: 3px solid ${n};">
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">${e.label}</div>
        <div style="font-size: 11px; color: var(--text-secondary);">
          ${i} • ${a} • ${e.rampMinutes}min ramp
        </div>
        <pre style="font-size: 11px; color: var(--text-secondary); margin-top: 2px; margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background: transparent; border: none; white-space: pre-wrap; word-wrap: break-word;">
${r}</pre>
      </div>
    </div>
  `}function be(e,o){const n=u.getState().configurations.dosers.get(e);return n!=null&&n.headNames&&o in n.headNames?n.headNames[o]:null}function we(e){if(!e||!Array.isArray(e)||e.length===0)return"None";if(typeof e[0]=="string"){const i={monday:"Mon",tuesday:"Tue",wednesday:"Wed",thursday:"Thu",friday:"Fri",saturday:"Sat",sunday:"Sun"},r=e.map(a=>i[a.toLowerCase()]).filter(Boolean);return r.length===7?"Everyday":r.length===5&&["Mon","Tue","Wed","Thu","Fri"].every(a=>r.includes(a))?"Weekdays":r.length===2&&r.includes("Sat")&&r.includes("Sun")?"Weekends":r.join(", ")}const o=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],t=e.filter(i=>typeof i=="number"&&i>=0&&i<=6);if(t.length===0)return"None";const n=[...t].sort();return n.length===7?"Everyday":n.length===5&&n.every(i=>i>=1&&i<=5)?"Weekdays":n.length===2&&n.includes(0)&&n.includes(6)?"Weekends":n.map(i=>o[i]).join(", ")}function xe(e,o){var l,g;const n=u.getState().configurations.dosers.get(o);if(!n||!n.configurations||n.configurations.length===0)return{setDose:"N/A",schedule:"N/A"};const i=n.configurations.find(v=>v.id===n.activeConfigurationId)||n.configurations[0];if(!i||!i.revisions||i.revisions.length===0)return{setDose:"N/A",schedule:"N/A"};const a=(l=i.revisions[i.revisions.length-1].heads)==null?void 0:l.find(v=>v.index===e);if(!a)return{setDose:"N/A",schedule:"N/A"};let d="N/A";const c=a.schedule;c&&c.dailyDoseMl!==void 0&&c.dailyDoseMl!==null&&(d=`${c.dailyDoseMl}ml`);const s=we((g=a.recurrence)==null?void 0:g.days);return{setDose:d,schedule:s}}function De(e){var n,i;const t=u.getState().configurations.dosers.get(e.address);return(i=(n=t==null?void 0:t.last_status)==null?void 0:n.parsed)!=null&&i.heads?Ce(t.last_status.parsed.heads,t,e.address):`
    <div style="padding: 24px; text-align: center; color: var(--gray-500); font-size: 14px;">
      <div style="font-size: 16px; color: ${e.connected?"var(--success)":"var(--gray-400)"}; margin-bottom: 8px;">
        ${e.connected?"✓ Connected":"○ Disconnected"}
      </div>
      <div style="font-size: 12px;">
        Last update: ${new Date(e.updated_at*1e3).toLocaleTimeString()}
      </div>
    </div>
  `}function Ce(e,o,t){const n=[];for(let i=0;i<4;i++){const r=e[i],a=i+1,d=t?xe(a,t):{setDose:"N/A",schedule:"N/A"},c=t?be(t,a):null,s=r!=null&&r.dosed_tenths_ml?`${(r.dosed_tenths_ml/10).toFixed(1)}mL`:"N/A";n.push({index:a,deviceHead:r,configData:d,customName:c,dosedToday:s})}return`
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      ${n.map(i=>Se(i)).join("")}
    </div>
  `}function Se(e){const{index:o,deviceHead:t,configData:n,customName:i,dosedToday:r}=e;let a="Disabled",d="var(--gray-400)",c="N/A",s=!0;if(t)switch(t.mode){case 0:a="Active",d="var(--success)",c="Daily",s=!1;break;case 1:a="Active",d="var(--success)",c="24H",s=!1;break;case 2:a="Active",d="var(--success)",c="Custom",s=!1;break;case 3:a="Active",d="var(--success)",c="Timer",s=!1;break;case 4:default:a="Disabled",d="var(--gray-400)",c="Disabled",s=!0;break}const l=i||`Head ${o}`;return s?`
      <div style="padding: 8px 12px; background: var(--bg-primary); border-radius: 4px; border-left: 3px solid ${d};">
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center;">
          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${l}</div>
          <div style="font-size: 11px; color: ${d}; font-weight: 600;">${a}</div>
        </div>
      </div>
    `:`
    <div style="padding: 8px 12px; background: var(--bg-primary); border-radius: 4px; border-left: 3px solid ${d};">
      <!-- First Row: Head name, mode, status -->
      <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: center; margin-bottom: 8px;">
        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${l}</div>
        <div style="font-size: 11px; color: var(--text-secondary);">${c}</div>
        <div style="font-size: 11px; color: ${d}; font-weight: 600;">${a}</div>
      </div>

      <!-- Second Row: Set Dose, Schedule, Dosed Today -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 11px;">
        <div style="text-align: center;">
          <div style="color: var(--text-secondary); margin-bottom: 2px;">Set Dose</div>
          <div style="font-weight: 600; color: var(--text-primary);">${n.setDose}</div>
        </div>
        <div style="text-align: center;">
          <div style="color: var(--text-secondary); margin-bottom: 2px;">Schedule</div>
          <div style="font-weight: 600; color: var(--text-primary);">${n.schedule}</div>
        </div>
        <div style="text-align: center;">
          <div style="color: var(--text-secondary); margin-bottom: 2px;">Dosed</div>
          <div style="font-weight: 600; color: var(--text-primary);">${r}</div>
        </div>
      </div>
    </div>
  `}window.toggleDeviceCardFlip=e=>{const o=document.querySelector(`[data-device-address="${e}"]`);o&&o.classList.toggle("flipped")};function k(e,o){return`
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${e}</h2>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="badge badge-info">${o.length}</div>
          <button class="toggle-icon-button" onclick="window.handleScanDevices()" title="Scan & Connect">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="toggle-icon" xmlns="http://www.w3.org/2000/svg">
              <title>bluetooth-connect</title>
              <path d="M19,10L17,12L19,14L21,12M14.88,16.29L13,18.17V14.41M13,5.83L14.88,7.71L13,9.58M17.71,7.71L12,2H11V9.58L6.41,5L5,6.41L10.59,12L5,17.58L6.41,19L11,14.41V22H12L17.71,16.29L13.41,12M7,12L5,10L3,12L5,14L7,12Z" />
            </svg>
          </button>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-top: 16px;">
        ${o.map(t=>_e(t)).join("")}
      </div>
    </div>
  `}function _e(e){const o=e.connected?"var(--success)":"var(--gray-400)",t=e.connected?"Connected":"Disconnected",n=u.getState(),i=e.device_type==="doser"?n.configurations.dosers.get(e.address):n.configurations.lights.get(e.address),r=(i==null?void 0:i.name)||e.address,a=pe(e.updated_at);return`
    <div class="flip-card" data-device-address="${e.address}">
      <div class="flip-card-inner">
        <!-- Front of card -->
        <div class="flip-card-front">
          <div class="card device-card ${e.device_type} ${e.connected?"connected":"disconnected"}" style="padding: 0; border-left: 4px solid ${o}; height: 100%;">
            ${$e(e,r,t,a)}
            ${Ee(e)}
            ${Te(e)}
          </div>
        </div>
        <!-- Back of card -->
        <div class="flip-card-back">
          ${ke(e,r)}
        </div>
      </div>
    </div>
  `}function $e(e,o,t,n){return`
    <div class="device-header" style="padding: 16px; border-bottom: 1px solid var(--border-color);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="status-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: ${e.connected?"var(--success)":"var(--gray-400)"};"></div>
          <h3 style="font-size: 18px; font-weight: 600; margin: 0; color: var(--text-primary);">
            ${o}
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
          <div style="font-size: 11px; color: var(--text-secondary);">${n}</div>
        </div>
      </div>
    </div>
  `}function Ee(e){return`
    <div class="device-body" style="padding: 16px;">
      ${Le(e)}
    </div>
  `}function Le(e){return e.device_type==="light"?me(e):e.device_type==="doser"?De(e):`
      <div class="device-status-placeholder">
        <div style="text-align: center; color: var(--gray-500); padding: 20px;">
          <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
          <p>Device status and information will be displayed here</p>
        </div>
      </div>
    `}function Te(e){const o=e.connected?"Disconnect":"Connect",t=e.connected?"btn-danger":"btn-primary";return`
    <div class="device-footer" style="padding: 16px; border-top: 1px solid var(--border-color); background: var(--bg-secondary);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn btn-outline" onclick="window.openDeviceSettings('${e.address}', '${e.device_type}')">
          Settings
        </button>
        <button class="btn connect-button ${t}" onclick="window.toggleDeviceConnection('${e.address}')">
          ${o}
        </button>
      </div>
    </div>
  `}function ke(e,o){const t=u.getState(),n=e.device_type==="doser"?t.configurations.dosers.get(e.address):t.configurations.lights.get(e.address);return`
    <div class="card device-card-settings" style="padding: 0; height: 100%; display: flex; flex-direction: column; border-left: 4px solid var(--primary);">
      <div class="card-header" style="padding: 16px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 18px; font-weight: 600; margin: 0; color: var(--text-primary);">
          ${o}
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
            value="${(n==null?void 0:n.name)||o}"
            placeholder="Enter device name"
            style="width: 100%; padding: 6px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-primary); color: var(--text-primary); font-size: 14px;"
          />
        </div>

        ${e.device_type==="doser"?`
          <div style="padding: 0 16px 16px 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              ${[1,2,3,4].map(i=>{var r;return`
                <div>
                  <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Head ${i}</label>
                  <input 
                    type="text" 
                    class="form-input head-name-input"
                    data-head="${i}"
                    value="${((r=n==null?void 0:n.headNames)==null?void 0:r[i])||""}"
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
              ${n!=null&&n.autoReconnect?"checked":""}
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
  `}function Ie(){const e=u.getState(),o=Array.from(e.devices.values()).filter(t=>{var n;return(n=t.status)==null?void 0:n.connected}).map(t=>({...t.status,address:t.address}));return o.length===0?`
      <div class="empty-state">
        <h2>No Devices Connected</h2>
        <p>This dashboard shows the status of connected aquarium devices. Devices must be connected externally to the backend service.</p>
      </div>
    `:`
    ${k("Devices",o)}
  `}function Ae(){const e=u.getState(),o=Array.from(e.devices.values()).map(t=>({...t.status,address:t.address})).filter(t=>t.address);return`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Raw Device Data -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Raw Device Data</h2>
          <div class="badge badge-info">${o.length}</div>
        </div>
        <div style="padding: 20px;">
          ${o.length===0?`
            <div class="empty-state" style="text-align: center; color: var(--gray-500); padding: 40px 20px;">
              <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
              <h3 style="margin: 0 0 8px 0; color: var(--gray-700);">No Connected Devices</h3>
              <p style="margin: 0; color: var(--gray-500);">Connect to devices to see raw payload data for debugging.</p>
            </div>
          `:`
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${o.map(t=>Pe(t)).join("")}
            </div>
          `}
        </div>
      </div>
    </div>
  `}function Pe(e){const o=`device-${e.address.replace(/:/g,"-")}`,t=e.updated_at?new Date(e.updated_at*1e3).toLocaleString():"Unknown";return`
    <div class="device-raw-data-card" style="border: 1px solid var(--gray-200); border-radius: 8px; overflow: hidden;">
      <!-- Collapsible Header -->
      <div class="device-raw-data-header"
           onclick="window.toggleDeviceRawData('${o}')"
           style="padding: 16px; background: var(--gray-50); cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--gray-200);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="collapse-icon" id="${o}-icon" style="transition: transform 0.2s ease;">▶</div>
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
      <div class="device-raw-data-content" id="${o}-content" style="display: none; padding: 16px; background: var(--bg-primary);">
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
  `}function D(){return`
    <div class="production-dashboard">
      ${Me()}
      ${ze()}
      <main class="prod-main">
        ${Ne()}
      </main>
      ${Oe()}
    </div>
  `}function Me(){const e=u.getState();return Array.from(e.devices.values()).some(o=>o.isLoading),`
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
  `}function ze(){return`
    <nav class="prod-nav">
      <div class="nav-content">
        <button
          class="nav-tab ${u.getState().ui.currentView==="overview"?"active":""}"
          onclick="window.switchTab('overview')"
        >
          Overview
        </button>
      </div>
    </nav>
  `}function Ne(){const e=u.getState();return e.ui.globalError?`
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
      ${Ie()}
    </div>
    <div class="tab-panel ${e.ui.currentView==="dev"?"active":""}" id="dev-panel">
      ${Ae()}
    </div>
  `}function Oe(){return`
    <footer class="prod-footer">
      <div class="footer-content">
        <a href="/tests/test-hub.html" target="_blank" class="footer-link">
          Test
        </a>
      </div>
    </footer>
  `}function I(){const e=document.querySelector(".production-dashboard");e&&(e.outerHTML=D())}const A=Object.freeze(Object.defineProperty({__proto__:null,refreshDashboard:I,renderProductionDashboard:D},Symbol.toStringTag,{value:"Module"}));async function b(e){const o=await fetch(e,{headers:{Accept:"application/json"}});if(!o.ok){const t=await o.text().catch(()=>"");throw new Error(`Request failed (${o.status}): ${t||o.statusText}`)}return await o.json()}async function C(e,o){const t=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:o===void 0?void 0:JSON.stringify(o)});if(!t.ok){const n=await t.text().catch(()=>"");throw new Error(`Request failed (${t.status}): ${n||t.statusText}`)}return await t.json()}async function P(e,o){const t=await fetch(e,{method:"PATCH",headers:{"Content-Type":"application/json",Accept:"application/json"},body:o===void 0?void 0:JSON.stringify(o)});if(!t.ok){const n=await t.text().catch(()=>"");throw new Error(`Request failed (${t.status}): ${n||t.statusText}`)}return await t.json()}const _=Object.freeze(Object.defineProperty({__proto__:null,fetchJson:b,patchJson:P,postJson:C},Symbol.toStringTag,{value:"Module"}));async function M(){return b("api/status")}async function Re(e){return C(`api/devices/${encodeURIComponent(e)}/connect`,{})}async function je(e){await C(`api/devices/${encodeURIComponent(e)}/disconnect`,{})}async function He(e){await C(`api/devices/${encodeURIComponent(e)}/status`,{})}async function Fe(e=5){return b(`api/scan?timeout=${e}`)}const N=Object.freeze(Object.defineProperty({__proto__:null,connectDevice:Re,disconnectDevice:je,getDeviceStatus:M,refreshDeviceStatus:He,scanDevices:Fe},Symbol.toStringTag,{value:"Module"}));async function V(){const e=u.getState().actions;e.setGlobalError(null);try{console.log("🔄 Initializing Zustand store..."),await e.initializeStore(),console.log("✅ Zustand store initialized"),console.log("🌐 Fetching device status from API");try{const o=await M(),t=[];for(const[n,i]of Object.entries(o)){e.updateDevice(n,i),console.log(`📥 Fetching configuration for ${n}...`);const r=e.refreshDeviceConfig(n,i.device_type).catch(a=>console.error(`Failed to load config for ${n}:`,a));t.push(r)}await Promise.allSettled(t),console.log("✅ Device status loaded:",Object.keys(o).length,"devices")}catch(o){console.error("❌ Failed to load device status:",o),e.setGlobalError("Failed to load device status")}}catch(o){const t=o instanceof Error?o.message:String(o);console.error("❌ Failed to load dashboard data:",t),e.setGlobalError(`Failed to load dashboard data: ${t}`)}}async function Be(){try{await u.getState().actions.refreshDevices()}catch(e){console.error("❌ Failed to refresh device status:",e)}}let $=null,O=0;const R=2e3;async function q(){const e=Date.now(),o=e-O;if(o<R){console.log(`⏱️  Config fetch debounced (last fetch: ${o}ms ago)`),$!==null&&clearTimeout($);const t=R-o;$=window.setTimeout(()=>{console.log("🔄 Running deferred configuration fetch"),q().catch(n=>console.error("Failed to refresh configs:",n))},t);return}console.log("🔄 Fetching configurations (not debounced)"),O=e;try{const{useActions:t}=await f(async()=>{const{useActions:n}=await Promise.resolve().then(()=>fe);return{useActions:n}},void 0,import.meta.url);await t().loadConfigurations()}catch(t){console.error("Failed to load configurations:",t)}}const x=Object.freeze(Object.defineProperty({__proto__:null,debouncedRefreshConfigurations:q,loadAllDashboardData:V,refreshDeviceStatusOnly:Be},Symbol.toStringTag,{value:"Module"}));function U(){const e=document.getElementById("watt-red"),o=document.getElementById("watt-green"),t=document.getElementById("watt-blue"),n=document.getElementById("watt-white"),i=document.getElementById("wattage-results");if(!e||!o||!t||!n||!i)return;const r=parseInt(e.value)||0,a=parseInt(o.value)||0,d=parseInt(t.value)||0,c=parseInt(n.value)||0,s=ne({red:r,green:a,blue:d,white:c});Ve(s)}function Ve(e){const o=document.getElementById("wattage-results");o&&(o.innerHTML=`
    <!-- Total Wattage -->
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 36px; font-weight: bold; color: var(--primary); margin-bottom: 8px;">${y(e.totalWattage)}</div>
      <div style="color: var(--gray-600);">Total Power Consumption</div>
      ${e.powerLimited?'<div style="color: var(--warning); font-size: 14px; margin-top: 4px;">⚠️ Power limited from ${formatWattage(result.requestedWattage)}</div>':""}
    </div>

    <!-- Channel Breakdown -->
    <div style="margin-bottom: 20px;">
      <h4 style="margin: 0 0 12px 0; color: var(--gray-900);">Channel Power Distribution</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="color: #ef4444; font-weight: bold; margin-bottom: 4px;">Red</div>
          <div>${y(e.channelWattages.red)}</div>
        </div>
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="color: #22c55e; font-weight: bold; margin-bottom: 4px;">Green</div>
          <div>${y(e.channelWattages.green)}</div>
        </div>
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="color: #3b82f6; font-weight: bold; margin-bottom: 4px;">Blue</div>
          <div>${y(e.channelWattages.blue)}</div>
        </div>
        <div style="text-align: center; padding: 12px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <div style="color: #64748b; font-weight: bold; margin-bottom: 4px;">White</div>
          <div>${y(e.channelWattages.white)}</div>
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
  `)}async function qe(e){return b(`api/devices/${encodeURIComponent(e)}/configurations`)}async function Ue(e,o){return P(`api/devices/${encodeURIComponent(e)}/configurations/naming`,o)}async function We(e,o){return P(`api/devices/${encodeURIComponent(e)}/configurations/settings`,o)}async function W(e){return b(`api/devices/${encodeURIComponent(e)}/configurations/export`)}async function J(e,o){const t=new FormData;t.append("file",o);const n=await fetch(`api/devices/${encodeURIComponent(e)}/configurations/import`,{method:"POST",body:t});if(!n.ok){const i=await n.json().catch(()=>({detail:n.statusText}));throw new Error(i.detail||"Import failed")}return n.json()}const Q=Object.freeze(Object.defineProperty({__proto__:null,exportDeviceConfiguration:W,getDeviceConfiguration:qe,importDeviceConfiguration:J,updateDeviceNaming:Ue,updateDeviceSettings:We},Symbol.toStringTag,{value:"Module"}));async function Je(e,o){var r,a,d;const t=document.createElement("div");t.className="modal-overlay";const n=u.getState();if(!((r=n.devices.get(e))==null?void 0:r.status)){console.error("Device not found:",e);return}(d=(a=n.devices.get(e))==null?void 0:a.configuration)!=null&&d.name,t.innerHTML=`
    <div class="modal-content import-export-modal" style="max-width: 500px; max-height: 90vh; overflow-y: auto;" data-device-id="${e}" data-device-type="${o}">
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
          <button class="btn btn-primary" onclick="window.handleExportConfig('${e}', '${o}')">
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
              onchange="window.handleImportFile('${e}', '${o}')"
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
  `,document.body.appendChild(t),t.addEventListener("click",c=>{c.target===t&&t.remove()})}async function Qe(e,o){try{const t=event==null?void 0:event.currentTarget,n=t==null?void 0:t.textContent;t&&(t.textContent="Exporting..."),t&&(t.disabled=!0);const i=await W(e),r={address:e,deviceType:o,config:i,exportedAt:new Date().toISOString()},a=JSON.stringify(r,null,2),d=new Blob([a],{type:"application/json"}),c=URL.createObjectURL(d),s=document.createElement("a");s.href=c,s.download=`${e.replace(/:/g,"-")}-config.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(c),t&&(t.textContent=n,t.disabled=!1),console.log("Configuration exported successfully")}catch(t){console.error("Export failed:",t);const n=event==null?void 0:event.currentTarget;n&&(n.textContent="Export failed",n.disabled=!1,setTimeout(()=>{n.textContent="Download Configuration"},3e3))}}async function Ge(e,o){var t;try{const n=document.getElementById("config-file-input"),i=(t=n==null?void 0:n.files)==null?void 0:t[0];if(!i)return;const r=document.getElementById("file-name");r&&(r.textContent=`Selected: ${i.name}`);const a=document.getElementById("import-status");a&&(a.style.display="block",a.style.opacity="0.5");const d=await i.text();let c;try{c=JSON.parse(d)}catch{throw new Error("Invalid JSON format in file")}if(!c.config||!c.address)throw new Error("File does not appear to be a valid AquaBle export");if(!confirm(`Replace configuration for ${e}?

This will overwrite the current settings.`)){a&&(a.style.display="none"),n.value="",r&&(r.textContent="");return}const l=document.getElementById("import-message");l&&(l.textContent="Importing...",l.style.backgroundColor="#e3f2fd",l.style.color="#1976d2");const g=await J(e,i);l&&(l.textContent="Configuration imported successfully!",l.style.backgroundColor="#e8f5e9",l.style.color="#388e3c"),n.value="",r&&setTimeout(()=>{r&&(r.textContent=""),a&&(a.style.display="none")},3e3),await u.getState().actions.refreshDeviceConfig(e,o),console.log("Configuration imported successfully")}catch(n){console.error("Import failed:",n);const i=document.getElementById("import-message");i&&(i.textContent=`Import failed: ${n instanceof Error?n.message:"Unknown error"}`,i.style.backgroundColor="#ffebee",i.style.color="#c62828");const r=document.getElementById("config-file-input");setTimeout(()=>{r.value="";const a=document.getElementById("file-name");a&&(a.textContent="")},3e3)}}window.handleExportConfig=Qe;window.handleImportFile=Ge;const j=Object.freeze(Object.defineProperty({__proto__:null,showImportExportModal:Je},Symbol.toStringTag,{value:"Module"}));function G(){window.switchTab=async e=>{u.getState().actions.setCurrentView(e),I()},window.handleScanDevices=async()=>{const{showScanConnectModal:e}=await f(async()=>{const{showScanConnectModal:o}=await import("./scan-connect-modal-CMaK3J6i.js");return{showScanConnectModal:o}},__vite__mapDeps([2,1]),import.meta.url);await e()},window.refreshDashboard=()=>{f(async()=>{const{refreshDashboard:e}=await Promise.resolve().then(()=>A);return{refreshDashboard:e}},void 0,import.meta.url).then(({refreshDashboard:e})=>{e()})},window.toggleTheme=()=>{const e=localStorage.getItem("theme"),o=e==="dark"?"light":"dark";console.log("Toggling theme from",e,"to",o),localStorage.setItem("theme",o),document.documentElement.className=o==="dark"?"dark-theme":"",console.log("Updated document.documentElement.className to:",document.documentElement.className),window.refreshDashboard()},window.toggleDeviceRawData=e=>{const o=document.getElementById(`${e}-content`),t=document.getElementById(`${e}-icon`);if(o&&t){const n=o.style.display!=="none";o.style.display=n?"none":"block",t.style.transform=n?"rotate(0deg)":"rotate(90deg)"}},window.handleRefreshAll=async()=>{const{refreshDeviceStatusOnly:e}=await f(async()=>{const{refreshDeviceStatusOnly:n}=await Promise.resolve().then(()=>x);return{refreshDeviceStatusOnly:n}},void 0,import.meta.url),o=document.querySelector('[onclick*="handleRefreshAll"]'),t=o==null?void 0:o.innerHTML;try{o&&(o.disabled=!0,o.innerHTML='<span class="scan-spinner"></span> Refreshing...'),await e(),u.getState().actions.addNotification({type:"success",message:"Device status refreshed successfully"})}catch(n){u.getState().actions.addNotification({type:"error",message:`Failed to refresh device status: ${n instanceof Error?n.message:String(n)}`})}finally{o&&t&&(o.disabled=!1,o.innerHTML=t)}},window.handleRefreshDevice=async e=>{const{refreshDeviceStatus:o}=await f(async()=>{const{refreshDeviceStatus:r}=await Promise.resolve().then(()=>N);return{refreshDeviceStatus:r}},void 0,import.meta.url),{refreshDeviceStatusOnly:t}=await f(async()=>{const{refreshDeviceStatusOnly:r}=await Promise.resolve().then(()=>x);return{refreshDeviceStatusOnly:r}},void 0,import.meta.url),n=document.querySelector(`[onclick*="handleRefreshDevice('${e}')"]`),i=n==null?void 0:n.innerHTML;try{n&&(n.disabled=!0,n.innerHTML='<span class="scan-spinner"></span>'),await o(e),await t(),u.getState().actions.addNotification({type:"success",message:`Device ${e} status refreshed`,autoHide:!0})}catch(r){u.getState().actions.addNotification({type:"error",message:`Failed to refresh device status: ${r instanceof Error?r.message:String(r)}`})}finally{n&&i&&(n.disabled=!1,n.innerHTML=i)}},setTimeout(()=>{document.getElementById("watt-red")&&U()},100),window.handleDeleteDevice=async(e,o)=>{console.log("Delete device:",e,o)},window.handleDeviceSettings=async(e,o)=>{const{showDeviceConfigModal:t}=await f(async()=>{const{showDeviceConfigModal:n}=await import("./device-config-modal-DG5pdQpf.js");return{showDeviceConfigModal:n}},__vite__mapDeps([3,1]),import.meta.url);t(e,o)},window.openDeviceSettings=async(e,o)=>{const{showDoserDeviceSettingsModal:t,showLightDeviceSettingsModal:n}=await f(async()=>{const{showDoserDeviceSettingsModal:a,showLightDeviceSettingsModal:d}=await import("./device-modals-BbXgpACq.js");return{showDoserDeviceSettingsModal:a,showLightDeviceSettingsModal:d}},__vite__mapDeps([4,0,1]),import.meta.url),i=u.getState(),r=o==="doser"?i.configurations.dosers.get(e):i.configurations.lights.get(e);if(!r){u.getState().actions.addNotification({type:"error",message:`Device configuration not found for ${o}`,autoHide:!0});return}o==="doser"?t(r):o==="light"&&n(r)},window.toggleDeviceConnection=async e=>{var r,a,d,c;const{connectDevice:o,disconnectDevice:t}=await f(async()=>{const{connectDevice:s,disconnectDevice:l}=await Promise.resolve().then(()=>N);return{connectDevice:s,disconnectDevice:l}},void 0,import.meta.url),{refreshDeviceStatusOnly:n}=await f(async()=>{const{refreshDeviceStatusOnly:s}=await Promise.resolve().then(()=>x);return{refreshDeviceStatusOnly:s}},void 0,import.meta.url),i=document.querySelector(`[onclick*="toggleDeviceConnection('${e}')"]`);i&&((r=i.textContent)==null||r.trim(),i.disabled=!0,i.classList.add("connecting"),i.textContent="Connecting...");try{const l=(a=u.getState().devices.get(e))==null?void 0:a.status;if(l==null?void 0:l.connected)await t(e),await n(),u.getState().actions.addNotification({type:"success",message:"Successfully disconnected from device"}),i&&(i.disabled=!1,i.classList.remove("connecting"),i.innerHTML="Connect");else{const v=await o(e);u.getState().actions.updateDevice(e,v),await n(),u.getState().actions.addNotification({type:"success",message:"Successfully connected to device"}),i&&(i.disabled=!1,i.innerHTML="Disconnect")}}catch(s){u.getState().actions.addNotification({type:"error",message:`Failed to ${(d=i==null?void 0:i.textContent)!=null&&d.includes("Disconnect")?"disconnect":"connect"} to device: ${s instanceof Error?s.message:"Unknown error"}`}),i&&(i.disabled=!1,i.classList.remove("connecting"),i.innerHTML=(c=i.textContent)!=null&&c.includes("Disconnect")?"Disconnect":"Connect")}},window.saveDeviceCardSettings=async e=>{var d;const{updateDeviceNaming:o,updateDeviceSettings:t}=await f(async()=>{const{updateDeviceNaming:c,updateDeviceSettings:s}=await Promise.resolve().then(()=>Q);return{updateDeviceNaming:c,updateDeviceSettings:s}},void 0,import.meta.url),n=document.querySelector(`[data-device-address="${e}"]`);if(!n)return;const i=n.querySelector(".device-name-input"),r=n.querySelectorAll(".head-name-input"),a=n.querySelector(".auto-reconnect-checkbox");try{const c=(d=i==null?void 0:i.value)==null?void 0:d.trim(),s={};r.length>0&&r.forEach(g=>{const v=parseInt(g.dataset.head||"0"),p=g.value.trim();p&&(s[v]=p)});const l={name:c||void 0};Object.keys(s).length>0&&(l.headNames=s),await o(e,l),a&&await t(e,{autoReconnect:a.checked}),window.toggleDeviceCardFlip(e),u.getState().actions.addNotification({type:"success",message:"Device settings saved",autoHide:!0})}catch(c){console.error("Failed to save device settings:",c),u.getState().actions.addNotification({type:"error",message:"Failed to save device settings",autoHide:!0})}},window.handleExportDeviceConfig=async e=>{const{showImportExportModal:o}=await f(async()=>{const{showImportExportModal:r}=await Promise.resolve().then(()=>j);return{showImportExportModal:r}},void 0,import.meta.url),t=u.getState(),n=t.configurations.dosers.get(e);t.configurations.lights.get(e),await o(e,n?"doser":"light")},window.handleImportDeviceConfig=async e=>{const{showImportExportModal:o}=await f(async()=>{const{showImportExportModal:r}=await Promise.resolve().then(()=>j);return{showImportExportModal:r}},void 0,import.meta.url),t=u.getState(),n=t.configurations.dosers.get(e);t.configurations.lights.get(e),await o(e,n?"doser":"light")}}const Ze=Object.freeze(Object.defineProperty({__proto__:null,calculateWattageFromInputs:U,initializeDashboardHandlers:G,loadAllDashboardData:V,refreshDashboard:I,renderProductionDashboard:D},Symbol.toStringTag,{value:"Module"}));function Xe(){const e=document.createElement("div");e.id="notification-container",e.className="notification-container",document.body.appendChild(e);const o=document.createElement("style");o.textContent=`
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
  `,document.head.appendChild(o)}function Ye(){const e=document.getElementById("notification-container");if(!e)return;const o=T(),{removeNotification:t}=B();e.innerHTML="",o.forEach(n=>{const i=Ke(n,t);e.appendChild(i),requestAnimationFrame(()=>{i.classList.add("show")})})}function Ke(e,o){const t=document.createElement("div");t.className=`notification ${e.type}`;const n=Z(e.timestamp);t.innerHTML=`
    <div class="notification-header">
      <span class="notification-type">${e.type}</span>
      <button class="notification-close" data-id="${e.id}">×</button>
    </div>
    <div class="notification-message">${et(e.message)}</div>
    <div class="notification-time">${n}</div>
  `;const i=t.querySelector(".notification-close"),r=()=>{t.classList.remove("show"),setTimeout(()=>{o(e.id)},300)};return i.addEventListener("click",r),setTimeout(()=>{t.parentNode&&r()},5e3),t}function Z(e){const t=Date.now()-e;return t<1e3?"Just now":t<6e4?`${Math.floor(t/1e3)}s ago`:t<36e5?`${Math.floor(t/6e4)}m ago`:t<864e5?`${Math.floor(t/36e5)}h ago`:new Date(e).toLocaleDateString()}function et(e){const o=document.createElement("div");return o.textContent=e,o.innerHTML}setInterval(()=>{const e=document.getElementById("notification-container");if(!e)return;const o=e.querySelectorAll(".notification-time"),t=T();o.forEach((n,i)=>{const r=t[i];r&&(n.textContent=Z(r.timestamp))})},3e4);let h=new Map;function tt(){u.subscribe(e=>{const o=e.devices;if(!(e.ui.currentView==="overview")){h=new Map(o);return}ot(o,h)&&(nt(o),h=new Map(o))}),console.log("Device card updater initialized with intelligent filtering")}function ot(e,o){if(e.size!==o.size)return!0;for(const[t,n]of e.entries()){const i=o.get(t);if(!i||X(i,n))return!0}for(const t of o.keys())if(!e.has(t))return!0;return!1}function nt(e){new Set(h.keys()),new Set(e.keys());const o=Array.from(h.values()).filter(c=>{var s;return(s=c.status)==null?void 0:s.connected}).map(c=>c.address),t=Array.from(e.values()).filter(c=>{var s;return(s=c.status)==null?void 0:s.connected}).map(c=>c.address),n=new Set(o),i=new Set(t),r=t.filter(c=>!n.has(c)),a=o.filter(c=>!i.has(c)),d=t.filter(c=>{if(r.includes(c))return!1;const s=h.get(c),l=e.get(c);return s&&l&&X(s,l)});if((r.length>0||a.length>0||d.length>0)&&console.log(`🔄 Device card updates: +${r.length} -${a.length} ~${d.length}`),o.length===0&&t.length>0){console.log("Transitioning from empty state to devices, full refresh needed"),L();return}else if(o.length>0&&t.length===0){console.log("Transitioning to empty state, full refresh needed"),L();return}a.length>0&&a.forEach(c=>it(c)),r.length>0&&r.forEach(c=>{const s=e.get(c);s!=null&&s.status&&Y(s)}),d.length>0&&d.forEach(c=>{const s=e.get(c);s!=null&&s.status&&rt(s)}),o.length!==t.length&&at(t.length)}function X(e,o){if(!e.status||!o.status||e.status.connected!==o.status.connected||e.isLoading!==o.isLoading||e.error!==o.error)return!0;const t=JSON.stringify(e.status),n=JSON.stringify(o.status);if(t!==n)return!0;const i=JSON.stringify(e.configuration),r=JSON.stringify(o.configuration);return i!==r}function Y(e){if(!e.status)return;const o=st();if(!o){console.warn("Device card container not found, falling back to full refresh"),L();return}const t={...e.status,address:e.address},n=document.createElement("div");n.innerHTML=k("",[t]);const i=n.querySelector(".device-card");i&&(i.classList.add("device-card-entering"),o.appendChild(i),i.getBoundingClientRect(),setTimeout(()=>{i.classList.remove("device-card-entering")},300))}function it(e){const o=K(e);o&&(o.classList.add("device-card-leaving"),setTimeout(()=>{o.remove()},300))}function rt(e){if(!e.status)return;const o=K(e.address);if(!o){console.warn(`Device card not found for ${e.address}, adding it`),Y(e);return}const t={...e.status,address:e.address},n=document.createElement("div");n.innerHTML=k("",[t]);const i=n.querySelector(".device-card");if(i){if(o.innerHTML===i.innerHTML){console.log(`Device ${e.address} HTML unchanged, skipping update`);return}const r=window.scrollY;o.replaceWith(i),window.scrollTo(0,r),console.log(`Updated device card for ${e.address}`)}}function at(e){const o=document.querySelector(".card-header .badge");o&&(o.textContent=String(e))}function st(){const e=document.getElementById("overview-panel");return e?e.querySelector('[style*="display: grid"]'):null}function K(e){const o=document.querySelectorAll(".device-card");for(const t of Array.from(o)){const n=t.querySelectorAll("button[onclick]");for(const i of Array.from(n)){const r=i.getAttribute("onclick");if(r!=null&&r.includes(e))return t}}return null}function L(){f(async()=>{const{refreshDashboard:e}=await Promise.resolve().then(()=>A);return{refreshDashboard:e}},void 0,import.meta.url).then(({refreshDashboard:e})=>{e()}).catch(e=>{console.warn("Could not refresh dashboard:",e)})}function ct(){console.log("Setting up state subscriptions with targeted device card updates"),tt();let e=0;u.subscribe(t=>{const n=t.ui.notifications.length;n!==e&&(e=n,Ye())});let o=u.getState().ui.currentView;u.subscribe(t=>{t.ui.currentView!==o&&(o=t.ui.currentView,console.log(`📱 View changed to: ${o}`),dt())}),console.log("State subscriptions active with targeted updates")}function dt(){f(async()=>{const{refreshDashboard:e}=await Promise.resolve().then(()=>A);return{refreshDashboard:e}},void 0,import.meta.url).then(({refreshDashboard:e})=>{e()}).catch(e=>{console.warn("Could not refresh dashboard:",e)})}class lt{constructor(){S(this,"state",{isActive:!1,intervalId:null,intervalMs:3e4,lastPollTime:0,failureCount:0,maxFailures:5});S(this,"subscribers",[])}startPolling(o=3e4){if(this.state.isActive){console.log("ℹ️  Polling already active");return}this.state.intervalMs=o,this.state.isActive=!0,this.state.failureCount=0,console.log(`🔄 Starting device status polling (interval: ${o}ms)`),this.poll(),this.state.intervalId=window.setInterval(()=>{this.poll()},o)}stopPolling(){if(!this.state.isActive){console.log("ℹ️  Polling not active");return}this.state.intervalId!==null&&(clearInterval(this.state.intervalId),this.state.intervalId=null),this.state.isActive=!1,this.state.failureCount=0,console.log("⏸️  Device status polling stopped")}setInterval(o){this.state.intervalMs=o,this.state.isActive&&(this.stopPolling(),this.startPolling(o))}subscribe(o){return this.subscribers.push(o),()=>{this.subscribers=this.subscribers.filter(t=>t!==o)}}async poll(){try{this.state.lastPollTime=Date.now();const o=await M();this.state.failureCount=0;const t=u.getState().actions,n=u.getState(),i=n.devices;for(const[r,a]of Object.entries(o))t.updateDevice(r,a),(a.device_type==="doser"?n.configurations.dosers.has(r):n.configurations.lights.has(r))||(console.log(`📥 Fetching configuration for ${r}...`),t.refreshDeviceConfig(r,a.device_type).catch(s=>console.error(`Failed to load config for ${r}:`,s)));this.subscribers.forEach(r=>r(o)),console.log(`✅ Status poll completed (${Object.keys(o).length} devices)`)}catch(o){this.state.failureCount++,console.error(`❌ Status poll failed (${this.state.failureCount}/${this.state.maxFailures}):`,o),this.state.failureCount>=this.state.maxFailures&&(console.error("⚠️  Too many polling failures, stopping polling service"),this.stopPolling())}}getState(){return Object.freeze({...this.state})}async forcePoll(){this.state.isActive||console.log("ℹ️  Polling not active, starting temporary poll"),await this.poll()}}const ee=new lt;function ut(e=3e4){ee.startPolling(e)}function gt(){ee.stopPolling()}let E=!1,H=!1;async function ft(){return new Promise(e=>{const o=document.querySelector("base");o?(console.log(`✅ Base tag found: ${o.href}`),setTimeout(e,0)):(console.log("ℹ️  No base tag found (direct access mode)"),e())})}async function F(){if(console.log("productionMain.init() called"),E){console.warn("Already initializing, skipping duplicate call");return}if(H){console.warn("Already initialized, skipping duplicate call");return}E=!0;try{console.log("Initializing Production Dashboard..."),await ft();const e=document.getElementById("app");if(!e)throw new Error("App element not found");localStorage.getItem("theme")==="dark"&&(document.documentElement.className="dark-theme"),Xe(),G(),console.log("Rendering dashboard HTML..."),e.innerHTML=D(),console.log("Loading dashboard data...");const{loadAllDashboardData:t,refreshDashboard:n}=await f(async()=>{const{loadAllDashboardData:i,refreshDashboard:r}=await Promise.resolve().then(()=>Ze);return{loadAllDashboardData:i,refreshDashboard:r}},void 0,import.meta.url);await t(),console.log("Dashboard data loaded"),console.log("Refreshing dashboard with loaded data..."),n(),console.log("Setting up state subscriptions..."),ct(),console.log("Starting centralized device status polling..."),ut(3e4),window.addEventListener("beforeunload",()=>{gt()}),console.log("Production Dashboard initialized successfully"),H=!0}catch(e){console.error("Failed to initialize Production Dashboard:",e);const o=document.getElementById("app");o&&(o.innerHTML=`
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
      `)}finally{E=!1}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",F):F();export{f as _,Je as a,Ue as b,Re as c,u as d,We as e,x as f,qe as g,C as p,Fe as s,B as u};
//# sourceMappingURL=main-CJFjn01Q.js.map
