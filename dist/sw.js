var serviceWorkerOption = {
  "assets": [
    "/main.js",
    "/main.js.LICENSE.txt"
  ]
};
        
        (()=>{var e={};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}();const{assets:t}=e.g.serviceWorkerOption,n="umlaut-cache-v1";self.addEventListener("install",(e=>{e.waitUntil(caches.open(n).then((e=>e.addAll([...t]))))})),self.addEventListener("fetch",(e=>{e.respondWith(!0===navigator.onLine?fetch(e.request).then((t=>{if("GET"!==e.request.method)return t;const s=t.clone();return caches.open(n).then((t=>{t.put(e.request,s)})),t})):caches.match(e.request).then((e=>e||new Response({status:500},{status:500}))))})),self.addEventListener("activate",(e=>{e.waitUntil(caches.keys().then((e=>Promise.all(e.map((e=>{e!==n&&caches.delete(e).then((()=>console.log(`Deleted cache: ${e}`)))}))))))}))})();