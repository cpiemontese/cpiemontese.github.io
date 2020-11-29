webpackHotUpdate_N_E("pages/index",{

/***/ "./components/cv-element.js":
/*!**********************************!*\
  !*** ./components/cv-element.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return CVElement; });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n\nvar _jsxFileName = \"/home/cristiano/personal-projects/cpiemontese.github.io/components/cv-element.js\";\nfunction CVElement(_ref) {\n  var _this = this;\n\n  var className = _ref.className,\n      lang = _ref.lang,\n      title = _ref.title,\n      subtitle = _ref.subtitle,\n      period = _ref.period,\n      list = _ref.list,\n      grade = _ref.grade,\n      children = _ref.children;\n  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(\"div\", {\n    className: className,\n    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(\"div\", {\n      className: \"mb-2\",\n      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(\"h3\", {\n        className: \"text-2xl font-bold text-green-600 dark:text-green-500\",\n        children: title\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 5,\n        columnNumber: 9\n      }, this), subtitle && /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(\"h4\", {\n        className: \"text-md\",\n        children: subtitle\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 7,\n        columnNumber: 23\n      }, this), period && /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(\"p\", {\n        className: \"text-sm uppercase text-green-600 dark:text-green-500\",\n        children: period\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 10,\n        columnNumber: 21\n      }, this)]\n    }, void 0, true, {\n      fileName: _jsxFileName,\n      lineNumber: 4,\n      columnNumber: 7\n    }, this), list && /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(\"ul\", {\n      className: \"mt-4 list-disc list-inside\",\n      children: list.map(function (element, index) {\n        return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(\"li\", {\n          className: \"\".concat(index + 1 < list.length ? 'mb-2' : ''),\n          children: element[lang]\n        }, index, false, {\n          fileName: _jsxFileName,\n          lineNumber: 16,\n          columnNumber: 13\n        }, _this);\n      })\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 13,\n      columnNumber: 17\n    }, this), children !== undefined ? children : null, grade && /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__[\"jsxDEV\"])(\"p\", {\n      className: \"mt-2 text-sm text-green-600 dark:text-green-500\",\n      children: grade\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 24,\n      columnNumber: 18\n    }, this)]\n  }, void 0, true, {\n    fileName: _jsxFileName,\n    lineNumber: 3,\n    columnNumber: 5\n  }, this);\n}\n_c = CVElement;\n\nvar _c;\n\n$RefreshReg$(_c, \"CVElement\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9jdi1lbGVtZW50LmpzP2U2YzUiXSwibmFtZXMiOlsiQ1ZFbGVtZW50IiwiY2xhc3NOYW1lIiwibGFuZyIsInRpdGxlIiwic3VidGl0bGUiLCJwZXJpb2QiLCJsaXN0IiwiZ3JhZGUiLCJjaGlsZHJlbiIsIm1hcCIsImVsZW1lbnQiLCJpbmRleCIsImxlbmd0aCIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWUsU0FBU0EsU0FBVCxPQUF3RjtBQUFBOztBQUFBLE1BQW5FQyxTQUFtRSxRQUFuRUEsU0FBbUU7QUFBQSxNQUF4REMsSUFBd0QsUUFBeERBLElBQXdEO0FBQUEsTUFBbERDLEtBQWtELFFBQWxEQSxLQUFrRDtBQUFBLE1BQTNDQyxRQUEyQyxRQUEzQ0EsUUFBMkM7QUFBQSxNQUFqQ0MsTUFBaUMsUUFBakNBLE1BQWlDO0FBQUEsTUFBekJDLElBQXlCLFFBQXpCQSxJQUF5QjtBQUFBLE1BQW5CQyxLQUFtQixRQUFuQkEsS0FBbUI7QUFBQSxNQUFaQyxRQUFZLFFBQVpBLFFBQVk7QUFDckcsc0JBQ0U7QUFBSyxhQUFTLEVBQUVQLFNBQWhCO0FBQUEsNEJBQ0U7QUFBSyxlQUFTLEVBQUMsTUFBZjtBQUFBLDhCQUNFO0FBQUksaUJBQVMsRUFBQyx1REFBZDtBQUFBLGtCQUF1RUU7QUFBdkU7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQURGLEVBR0lDLFFBQVEsaUJBQUk7QUFBSSxpQkFBUyxFQUFDLFNBQWQ7QUFBQSxrQkFBeUJBO0FBQXpCO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FIaEIsRUFNSUMsTUFBTSxpQkFBSTtBQUFHLGlCQUFTLEVBQUMsc0RBQWI7QUFBQSxrQkFBcUVBO0FBQXJFO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FOZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFERixFQVVJQyxJQUFJLGlCQUFJO0FBQUksZUFBUyxFQUFDLDRCQUFkO0FBQUEsZ0JBRU5BLElBQUksQ0FBQ0csR0FBTCxDQUFTLFVBQUNDLE9BQUQsRUFBVUMsS0FBVjtBQUFBLDRCQUNQO0FBQWdCLG1CQUFTLFlBQUtBLEtBQUssR0FBRyxDQUFSLEdBQVlMLElBQUksQ0FBQ00sTUFBakIsR0FBMEIsTUFBMUIsR0FBbUMsRUFBeEMsQ0FBekI7QUFBQSxvQkFDR0YsT0FBTyxDQUFDUixJQUFEO0FBRFYsV0FBU1MsS0FBVDtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURPO0FBQUEsT0FBVDtBQUZNO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFWWixFQW1CSUgsUUFBUSxLQUFLSyxTQUFiLEdBQXlCTCxRQUF6QixHQUFvQyxJQW5CeEMsRUFxQklELEtBQUssaUJBQUk7QUFBRyxlQUFTLEVBQUMsaURBQWI7QUFBQSxnQkFBZ0VBO0FBQWhFO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFyQmI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBREY7QUEwQkQ7S0EzQnVCUCxTIiwiZmlsZSI6Ii4vY29tcG9uZW50cy9jdi1lbGVtZW50LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ1ZFbGVtZW50KHsgY2xhc3NOYW1lLCBsYW5nLCB0aXRsZSwgc3VidGl0bGUsIHBlcmlvZCwgbGlzdCwgZ3JhZGUsIGNoaWxkcmVuIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMlwiPlxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ib2xkIHRleHQtZ3JlZW4tNjAwIGRhcms6dGV4dC1ncmVlbi01MDBcIj57dGl0bGV9PC9oMz5cbiAgICAgICAge1xuICAgICAgICAgIHN1YnRpdGxlICYmIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LW1kXCI+e3N1YnRpdGxlfTwvaDQ+XG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIHBlcmlvZCAmJiA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHVwcGVyY2FzZSB0ZXh0LWdyZWVuLTYwMCBkYXJrOnRleHQtZ3JlZW4tNTAwXCI+e3BlcmlvZH08L3A+XG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgICAgeyBsaXN0ICYmIDx1bCBjbGFzc05hbWU9XCJtdC00IGxpc3QtZGlzYyBsaXN0LWluc2lkZVwiPlxuICAgICAgICB7XG4gICAgICAgICAgbGlzdC5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PlxuICAgICAgICAgICAgPGxpIGtleT17aW5kZXh9IGNsYXNzTmFtZT17YCR7aW5kZXggKyAxIDwgbGlzdC5sZW5ndGggPyAnbWItMicgOiAnJ31gfT5cbiAgICAgICAgICAgICAge2VsZW1lbnRbbGFuZ119XG4gICAgICAgICAgICA8L2xpPiBcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIDwvdWw+IH1cbiAgICAgIHsgY2hpbGRyZW4gIT09IHVuZGVmaW5lZCA/IGNoaWxkcmVuIDogbnVsbCB9XG4gICAgICB7XG4gICAgICAgIGdyYWRlICYmIDxwIGNsYXNzTmFtZT1cIm10LTIgdGV4dC1zbSB0ZXh0LWdyZWVuLTYwMCBkYXJrOnRleHQtZ3JlZW4tNTAwXCI+e2dyYWRlfTwvcD5cbiAgICAgIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/cv-element.js\n");

/***/ })

})