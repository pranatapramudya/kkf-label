"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./middleware.ts":
/*!***********************!*\
  !*** ./middleware.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(middleware)/./node_modules/@clerk/nextjs/dist/esm/server/routeMatcher.js\");\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(middleware)/./node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js\");\n\n// 1. Kunci pintu khusus rute /admin dan semua halaman di dalamnya\nconst isProtectedRoute = (0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__.createRouteMatcher)([\n    \"/admin(.*)\"\n]);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_1__.clerkMiddleware)((auth, req)=>{\n    if (isProtectedRoute(req)) {\n        // 🔥 FIX: Ini cara resmi Clerk V5!\n        // Otomatis ngecek KTP. Kalau lu Owner, dibiarin masuk. Kalau tamu, ditendang ke Sign-In.\n        auth().protect();\n    }\n}));\nconst config = {\n    matcher: [\n        \"/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)\",\n        \"/(api|trpc)(.*)\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJFO0FBRTNFLGtFQUFrRTtBQUNsRSxNQUFNRSxtQkFBbUJELHdFQUFrQkEsQ0FBQztJQUFDO0NBQWE7QUFFMUQsaUVBQWVELHFFQUFlQSxDQUFDLENBQUNHLE1BQU1DO0lBQ3BDLElBQUlGLGlCQUFpQkUsTUFBTTtRQUN6QixtQ0FBbUM7UUFDbkMseUZBQXlGO1FBQ3pGRCxPQUFPRSxPQUFPO0lBQ2hCO0FBQ0YsRUFBRSxFQUFDO0FBRUksTUFBTUMsU0FBUztJQUNwQkMsU0FBUztRQUNQO1FBQ0E7S0FDRDtBQUNILEVBQUUiLCJzb3VyY2VzIjpbIkQ6XFxQcm9qZWN0c1xca2tmLWxhYmVsXFxtaWRkbGV3YXJlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsZXJrTWlkZGxld2FyZSwgY3JlYXRlUm91dGVNYXRjaGVyIH0gZnJvbSBcIkBjbGVyay9uZXh0anMvc2VydmVyXCI7XHJcblxyXG4vLyAxLiBLdW5jaSBwaW50dSBraHVzdXMgcnV0ZSAvYWRtaW4gZGFuIHNlbXVhIGhhbGFtYW4gZGkgZGFsYW1ueWFcclxuY29uc3QgaXNQcm90ZWN0ZWRSb3V0ZSA9IGNyZWF0ZVJvdXRlTWF0Y2hlcihbXCIvYWRtaW4oLiopXCJdKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsZXJrTWlkZGxld2FyZSgoYXV0aCwgcmVxKSA9PiB7XHJcbiAgaWYgKGlzUHJvdGVjdGVkUm91dGUocmVxKSkge1xyXG4gICAgLy8g8J+UpSBGSVg6IEluaSBjYXJhIHJlc21pIENsZXJrIFY1IVxyXG4gICAgLy8gT3RvbWF0aXMgbmdlY2VrIEtUUC4gS2FsYXUgbHUgT3duZXIsIGRpYmlhcmluIG1hc3VrLiBLYWxhdSB0YW11LCBkaXRlbmRhbmcga2UgU2lnbi1Jbi5cclxuICAgIGF1dGgoKS5wcm90ZWN0KCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XHJcbiAgbWF0Y2hlcjogW1xyXG4gICAgXCIvKCg/IV9uZXh0fFteP10qXFxcXC4oPzpodG1sP3xjc3N8anMoPyFvbil8anBlP2d8d2VicHxwbmd8Z2lmfHN2Z3x0dGZ8d29mZjI/fGljb3xjc3Z8ZG9jeD98eGxzeD98emlwfHdlYm1hbmlmZXN0KSkuKilcIixcclxuICAgIFwiLyhhcGl8dHJwYykoLiopXCIsXHJcbiAgXSxcclxufTtcclxuIl0sIm5hbWVzIjpbImNsZXJrTWlkZGxld2FyZSIsImNyZWF0ZVJvdXRlTWF0Y2hlciIsImlzUHJvdGVjdGVkUm91dGUiLCJhdXRoIiwicmVxIiwicHJvdGVjdCIsImNvbmZpZyIsIm1hdGNoZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

});