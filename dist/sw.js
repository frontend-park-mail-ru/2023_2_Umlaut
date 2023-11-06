var serviceWorkerOption = {
  "assets": [
    "/main.js"
  ]
};
        
        /*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/sw.js":
/*!**********************!*\
  !*** ./public/sw.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const {assets} = __webpack_require__.g.serviceWorkerOption;\nconst CACHE_NAME = 'umlaut-cache-v1';\n\nself.addEventListener('install', (event) => {\n    event.waitUntil(\n        caches.open(CACHE_NAME)\n            .then((cache) => {\n                return cache.addAll([\n                    ...assets,\n                ]);\n            }),\n    );\n});\n\n\nself.addEventListener('fetch', (event) => {\n    event.respondWith((() => {\n        if (navigator.onLine === true) {\n            return fetch(event.request)\n                .then((response) => {\n                    if (event.request.method !== 'GET') {\n                        return response;\n                    }\n\n                    const responseClone = response.clone();\n                    caches.open(CACHE_NAME)\n                        .then((cache) => {\n                            cache.put(event.request, responseClone);\n                        });\n\n                    return response;\n                });\n        }\n\n\n        return caches.match(event.request)\n            .then((response) => {\n                return response || new Response({status: 500}, {status: 500});\n            });\n    })());\n});\n\n\nself.addEventListener('activate', (event) => {\n    event.waitUntil(\n        caches.keys().then((keys) => Promise.all(\n            keys.map((key) => {\n                if (key !== CACHE_NAME) {\n                    caches.delete(key)\n                        .then(() => console.log(`Deleted cache: ${key}`));\n                }\n            }),\n        )),\n    );\n});\n\n//# sourceURL=webpack://2023_2_umlaut/./public/sw.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/sw.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;