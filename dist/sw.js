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

eval("const {assets} = __webpack_require__.g.serviceWorkerOption;\r\nconst CACHE_NAME = 'umlaut-cache-v1';\r\n\r\nself.addEventListener('install', (event) => {\r\n    event.waitUntil(\r\n        caches.open(CACHE_NAME)\r\n            .then((cache) => {\r\n                return cache.addAll([\r\n                    ...assets,\r\n                ]);\r\n            }),\r\n    );\r\n});\r\n\r\n\r\nself.addEventListener('fetch', (event) => {\r\n    event.respondWith((() => {\r\n        if (navigator.onLine === true) {\r\n            return fetch(event.request)\r\n                .then((response) => {\r\n                    if (event.request.method !== 'GET') {\r\n                        return response;\r\n                    }\r\n\r\n                    const responseClone = response.clone();\r\n                    caches.open(CACHE_NAME)\r\n                        .then((cache) => {\r\n                            cache.put(event.request, responseClone);\r\n                        });\r\n\r\n                    return response;\r\n                });\r\n        }\r\n\r\n\r\n        return caches.match(event.request)\r\n            .then((response) => {\r\n                return response || new Response({status: 500}, {status: 500});\r\n            });\r\n    })());\r\n});\r\n\r\n\r\nself.addEventListener('activate', (event) => {\r\n    event.waitUntil(\r\n        caches.keys().then((keys) => Promise.all(\r\n            keys.map((key) => {\r\n                if (key !== CACHE_NAME) {\r\n                    caches.delete(key)\r\n                        .then(() => console.log(`Deleted cache: ${key}`));\r\n                }\r\n            }),\r\n        )),\r\n    );\r\n});\r\n\n\n//# sourceURL=webpack://2023_2_umlaut/./public/sw.js?");

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