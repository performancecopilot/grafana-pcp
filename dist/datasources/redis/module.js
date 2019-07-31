define(["lodash","app/plugins/sdk"],function(t,e){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=199)}([function(e,n){e.exports=t},function(t,e,n){"use strict";var r;n.d(e,"a",function(){return r}),function(t){t.TimeSeries="time_series",t.Table="table",t.Heatmap="heatmap"}(r||(r={}))},,,,,,,,,function(t,n){t.exports=e},function(t,e,n){var r=n(96),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();t.exports=i},function(t,e){var n=Array.isArray;t.exports=n},,,,,function(t,e,n){"use strict";n.d(e,"a",function(){return c});var r,o=n(0),i=n.n(o),u=n(10),a=(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),c=function(t){function e(e,n,r){void 0===r&&(r=1e3);var o=t.call(this,e,n)||this;return o.typingDebounceTime=r,o.stopTypingDebounced=i.a.debounce(o.stopTyping,o.typingDebounceTime),o}return a(e,t),e.prototype.stopTyping=function(){delete this.target.isTyping},e.prototype.startTyping=function(){this.target.isTyping=!0,this.stopTypingDebounced()},e.prototype.targetChanged=function(){this.stopTyping(),this.panelCtrl.refresh()},e}(u.QueryCtrl)},,,,,,,function(t,e,n){var r=n(124),o=n(129);t.exports=function(t,e){var n=o(t,e);return r(n)?n:void 0}},function(t,e,n){var r=n(54),o=n(125),i=n(126),u="[object Null]",a="[object Undefined]",c=r?r.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?a:u:c&&c in Object(t)?o(t):i(t)}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t}},,,,,,,,,,,,,,,,,,,,,,,function(t,e){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},,function(t,e,n){var r=n(114),o=n(115),i=n(116),u=n(117),a=n(118);function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}c.prototype.clear=r,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=u,c.prototype.set=a,t.exports=c},function(t,e,n){var r=n(94);t.exports=function(t,e){for(var n=t.length;n--;)if(r(t[n][0],e))return n;return-1}},function(t,e,n){var r=n(11).Symbol;t.exports=r},function(t,e,n){var r=n(24)(Object,"create");t.exports=r},function(t,e,n){var r=n(138);t.exports=function(t,e){var n=t.__data__;return r(e)?n["string"==typeof e?"string":"hash"]:n.map}},function(t,e,n){var r=n(64),o=1/0;t.exports=function(t){if("string"==typeof t||r(t))return t;var e=t+"";return"0"==e&&1/t==-o?"-0":e}},function(t,e,n){var r=n(24)(n(11),"Map");t.exports=r},function(t,e,n){var r=n(130),o=n(137),i=n(139),u=n(140),a=n(141);function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}c.prototype.clear=r,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=u,c.prototype.set=a,t.exports=c},function(t,e,n){var r=n(159),o=n(166),i=n(62);t.exports=function(t){return i(t)?r(t):o(t)}},function(t,e){var n=9007199254740991;t.exports=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=n}},function(t,e,n){var r=n(95),o=n(61);t.exports=function(t){return null!=t&&o(t.length)&&!r(t)}},function(t,e,n){var r=n(12),o=n(64),i=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,u=/^\w*$/;t.exports=function(t,e){if(r(t))return!1;var n=typeof t;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!o(t))||u.test(t)||!i.test(t)||null!=e&&t in Object(e)}},function(t,e,n){var r=n(25),o=n(27),i="[object Symbol]";t.exports=function(t){return"symbol"==typeof t||o(t)&&r(t)==i}},,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}},function(t,e,n){var r=n(52),o=n(119),i=n(120),u=n(121),a=n(122),c=n(123);function s(t){var e=this.__data__=new r(t);this.size=e.size}s.prototype.clear=o,s.prototype.delete=i,s.prototype.get=u,s.prototype.has=a,s.prototype.set=c,t.exports=s},function(t,e){t.exports=function(t,e){return t===e||t!=t&&e!=e}},function(t,e,n){var r=n(25),o=n(50),i="[object AsyncFunction]",u="[object Function]",a="[object GeneratorFunction]",c="[object Proxy]";t.exports=function(t){if(!o(t))return!1;var e=r(t);return e==u||e==a||e==i||e==c}},function(t,e,n){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n}).call(this,n(26))},function(t,e){var n=Function.prototype.toString;t.exports=function(t){if(null!=t){try{return n.call(t)}catch(t){}try{return t+""}catch(t){}}return""}},function(t,e,n){var r=n(142),o=n(27);t.exports=function t(e,n,i,u,a){return e===n||(null==e||null==n||!o(e)&&!o(n)?e!=e&&n!=n:r(e,n,i,u,t,a))}},function(t,e,n){var r=n(143),o=n(146),i=n(147),u=1,a=2;t.exports=function(t,e,n,c,s,f){var p=n&u,l=t.length,h=e.length;if(l!=h&&!(p&&h>l))return!1;var v=f.get(t);if(v&&f.get(e))return v==e;var y=-1,d=!0,b=n&a?new r:void 0;for(f.set(t,e),f.set(e,t);++y<l;){var g=t[y],x=e[y];if(c)var _=p?c(x,g,y,e,t,f):c(g,x,y,t,e,f);if(void 0!==_){if(_)continue;d=!1;break}if(b){if(!o(e,function(t,e){if(!i(b,e)&&(g===t||s(g,t,n,c,f)))return b.push(e)})){d=!1;break}}else if(g!==x&&!s(g,x,n,c,f)){d=!1;break}}return f.delete(t),f.delete(e),d}},function(t,e,n){var r=n(161),o=n(27),i=Object.prototype,u=i.hasOwnProperty,a=i.propertyIsEnumerable,c=r(function(){return arguments}())?r:function(t){return o(t)&&u.call(t,"callee")&&!a.call(t,"callee")};t.exports=c},function(t,e,n){(function(t){var r=n(11),o=n(162),i=e&&!e.nodeType&&e,u=i&&"object"==typeof t&&t&&!t.nodeType&&t,a=u&&u.exports===i?r.Buffer:void 0,c=(a?a.isBuffer:void 0)||o;t.exports=c}).call(this,n(102)(t))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e){var n=9007199254740991,r=/^(?:0|[1-9]\d*)$/;t.exports=function(t,e){var o=typeof t;return!!(e=null==e?n:e)&&("number"==o||"symbol"!=o&&r.test(t))&&t>-1&&t%1==0&&t<e}},function(t,e,n){var r=n(163),o=n(164),i=n(165),u=i&&i.isTypedArray,a=u?o(u):r;t.exports=a},function(t,e,n){var r=n(50);t.exports=function(t){return t==t&&!r(t)}},function(t,e){t.exports=function(t,e){return function(n){return null!=n&&n[t]===e&&(void 0!==e||t in Object(n))}}},function(t,e,n){var r=n(108),o=n(57);t.exports=function(t,e){for(var n=0,i=(e=r(e,t)).length;null!=t&&n<i;)t=t[o(e[n++])];return n&&n==i?t:void 0}},function(t,e,n){var r=n(12),o=n(63),i=n(178),u=n(181);t.exports=function(t,e){return r(t)?t:o(t,e)?[t]:i(u(t))}},function(t,e,n){var r=n(92),o=n(111),i=n(190),u=n(12);t.exports=function(t,e){return(u(t)?r:i)(t,o(e,3))}},function(t,e){t.exports=function(t){return void 0===t}},function(t,e,n){var r=n(112),o=n(176),i=n(186),u=n(12),a=n(187);t.exports=function(t){return"function"==typeof t?t:null==t?i:"object"==typeof t?u(t)?o(t[0],t[1]):r(t):a(t)}},function(t,e,n){var r=n(113),o=n(175),i=n(106);t.exports=function(t){var e=o(t);return 1==e.length&&e[0][2]?i(e[0][0],e[0][1]):function(n){return n===t||r(n,t,e)}}},function(t,e,n){var r=n(93),o=n(98),i=1,u=2;t.exports=function(t,e,n,a){var c=n.length,s=c,f=!a;if(null==t)return!s;for(t=Object(t);c--;){var p=n[c];if(f&&p[2]?p[1]!==t[p[0]]:!(p[0]in t))return!1}for(;++c<s;){var l=(p=n[c])[0],h=t[l],v=p[1];if(f&&p[2]){if(void 0===h&&!(l in t))return!1}else{var y=new r;if(a)var d=a(h,v,l,t,e,y);if(!(void 0===d?o(v,h,i|u,a,y):d))return!1}}return!0}},function(t,e){t.exports=function(){this.__data__=[],this.size=0}},function(t,e,n){var r=n(53),o=Array.prototype.splice;t.exports=function(t){var e=this.__data__,n=r(e,t);return!(n<0||(n==e.length-1?e.pop():o.call(e,n,1),--this.size,0))}},function(t,e,n){var r=n(53);t.exports=function(t){var e=this.__data__,n=r(e,t);return n<0?void 0:e[n][1]}},function(t,e,n){var r=n(53);t.exports=function(t){return r(this.__data__,t)>-1}},function(t,e,n){var r=n(53);t.exports=function(t,e){var n=this.__data__,o=r(n,t);return o<0?(++this.size,n.push([t,e])):n[o][1]=e,this}},function(t,e,n){var r=n(52);t.exports=function(){this.__data__=new r,this.size=0}},function(t,e){t.exports=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n}},function(t,e){t.exports=function(t){return this.__data__.get(t)}},function(t,e){t.exports=function(t){return this.__data__.has(t)}},function(t,e,n){var r=n(52),o=n(58),i=n(59),u=200;t.exports=function(t,e){var n=this.__data__;if(n instanceof r){var a=n.__data__;if(!o||a.length<u-1)return a.push([t,e]),this.size=++n.size,this;n=this.__data__=new i(a)}return n.set(t,e),this.size=n.size,this}},function(t,e,n){var r=n(95),o=n(127),i=n(50),u=n(97),a=/^\[object .+?Constructor\]$/,c=Function.prototype,s=Object.prototype,f=c.toString,p=s.hasOwnProperty,l=RegExp("^"+f.call(p).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(t){return!(!i(t)||o(t))&&(r(t)?l:a).test(u(t))}},function(t,e,n){var r=n(54),o=Object.prototype,i=o.hasOwnProperty,u=o.toString,a=r?r.toStringTag:void 0;t.exports=function(t){var e=i.call(t,a),n=t[a];try{t[a]=void 0;var r=!0}catch(t){}var o=u.call(t);return r&&(e?t[a]=n:delete t[a]),o}},function(t,e){var n=Object.prototype.toString;t.exports=function(t){return n.call(t)}},function(t,e,n){var r,o=n(128),i=(r=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"";t.exports=function(t){return!!i&&i in t}},function(t,e,n){var r=n(11)["__core-js_shared__"];t.exports=r},function(t,e){t.exports=function(t,e){return null==t?void 0:t[e]}},function(t,e,n){var r=n(131),o=n(52),i=n(58);t.exports=function(){this.size=0,this.__data__={hash:new r,map:new(i||o),string:new r}}},function(t,e,n){var r=n(132),o=n(133),i=n(134),u=n(135),a=n(136);function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}c.prototype.clear=r,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=u,c.prototype.set=a,t.exports=c},function(t,e,n){var r=n(55);t.exports=function(){this.__data__=r?r(null):{},this.size=0}},function(t,e){t.exports=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}},function(t,e,n){var r=n(55),o="__lodash_hash_undefined__",i=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;if(r){var n=e[t];return n===o?void 0:n}return i.call(e,t)?e[t]:void 0}},function(t,e,n){var r=n(55),o=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;return r?void 0!==e[t]:o.call(e,t)}},function(t,e,n){var r=n(55),o="__lodash_hash_undefined__";t.exports=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=r&&void 0===e?o:e,this}},function(t,e,n){var r=n(56);t.exports=function(t){var e=r(this,t).delete(t);return this.size-=e?1:0,e}},function(t,e){t.exports=function(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}},function(t,e,n){var r=n(56);t.exports=function(t){return r(this,t).get(t)}},function(t,e,n){var r=n(56);t.exports=function(t){return r(this,t).has(t)}},function(t,e,n){var r=n(56);t.exports=function(t,e){var n=r(this,t),o=n.size;return n.set(t,e),this.size+=n.size==o?0:1,this}},function(t,e,n){var r=n(93),o=n(99),i=n(148),u=n(152),a=n(170),c=n(12),s=n(101),f=n(104),p=1,l="[object Arguments]",h="[object Array]",v="[object Object]",y=Object.prototype.hasOwnProperty;t.exports=function(t,e,n,d,b,g){var x=c(t),_=c(e),j=x?h:a(t),m=_?h:a(e),w=(j=j==l?v:j)==v,O=(m=m==l?v:m)==v,S=j==m;if(S&&s(t)){if(!s(e))return!1;x=!0,w=!1}if(S&&!w)return g||(g=new r),x||f(t)?o(t,e,n,d,b,g):i(t,e,j,n,d,b,g);if(!(n&p)){var T=w&&y.call(t,"__wrapped__"),P=O&&y.call(e,"__wrapped__");if(T||P){var A=T?t.value():t,z=P?e.value():e;return g||(g=new r),b(A,z,n,d,g)}}return!!S&&(g||(g=new r),u(t,e,n,d,b,g))}},function(t,e,n){var r=n(59),o=n(144),i=n(145);function u(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new r;++e<n;)this.add(t[e])}u.prototype.add=u.prototype.push=o,u.prototype.has=i,t.exports=u},function(t,e){var n="__lodash_hash_undefined__";t.exports=function(t){return this.__data__.set(t,n),this}},function(t,e){t.exports=function(t){return this.__data__.has(t)}},function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(e(t[n],n,t))return!0;return!1}},function(t,e){t.exports=function(t,e){return t.has(e)}},function(t,e,n){var r=n(54),o=n(149),i=n(94),u=n(99),a=n(150),c=n(151),s=1,f=2,p="[object Boolean]",l="[object Date]",h="[object Error]",v="[object Map]",y="[object Number]",d="[object RegExp]",b="[object Set]",g="[object String]",x="[object Symbol]",_="[object ArrayBuffer]",j="[object DataView]",m=r?r.prototype:void 0,w=m?m.valueOf:void 0;t.exports=function(t,e,n,r,m,O,S){switch(n){case j:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case _:return!(t.byteLength!=e.byteLength||!O(new o(t),new o(e)));case p:case l:case y:return i(+t,+e);case h:return t.name==e.name&&t.message==e.message;case d:case g:return t==e+"";case v:var T=a;case b:var P=r&s;if(T||(T=c),t.size!=e.size&&!P)return!1;var A=S.get(t);if(A)return A==e;r|=f,S.set(t,e);var z=u(T(t),T(e),r,m,O,S);return S.delete(t),z;case x:if(w)return w.call(t)==w.call(e)}return!1}},function(t,e,n){var r=n(11).Uint8Array;t.exports=r},function(t,e){t.exports=function(t){var e=-1,n=Array(t.size);return t.forEach(function(t,r){n[++e]=[r,t]}),n}},function(t,e){t.exports=function(t){var e=-1,n=Array(t.size);return t.forEach(function(t){n[++e]=t}),n}},function(t,e,n){var r=n(153),o=1,i=Object.prototype.hasOwnProperty;t.exports=function(t,e,n,u,a,c){var s=n&o,f=r(t),p=f.length;if(p!=r(e).length&&!s)return!1;for(var l=p;l--;){var h=f[l];if(!(s?h in e:i.call(e,h)))return!1}var v=c.get(t);if(v&&c.get(e))return v==e;var y=!0;c.set(t,e),c.set(e,t);for(var d=s;++l<p;){var b=t[h=f[l]],g=e[h];if(u)var x=s?u(g,b,h,e,t,c):u(b,g,h,t,e,c);if(!(void 0===x?b===g||a(b,g,n,u,c):x)){y=!1;break}d||(d="constructor"==h)}if(y&&!d){var _=t.constructor,j=e.constructor;_!=j&&"constructor"in t&&"constructor"in e&&!("function"==typeof _&&_ instanceof _&&"function"==typeof j&&j instanceof j)&&(y=!1)}return c.delete(t),c.delete(e),y}},function(t,e,n){var r=n(154),o=n(156),i=n(60);t.exports=function(t){return r(t,i,o)}},function(t,e,n){var r=n(155),o=n(12);t.exports=function(t,e,n){var i=e(t);return o(t)?i:r(i,n(t))}},function(t,e){t.exports=function(t,e){for(var n=-1,r=e.length,o=t.length;++n<r;)t[o+n]=e[n];return t}},function(t,e,n){var r=n(157),o=n(158),i=Object.prototype.propertyIsEnumerable,u=Object.getOwnPropertySymbols,a=u?function(t){return null==t?[]:(t=Object(t),r(u(t),function(e){return i.call(t,e)}))}:o;t.exports=a},function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length,o=0,i=[];++n<r;){var u=t[n];e(u,n,t)&&(i[o++]=u)}return i}},function(t,e){t.exports=function(){return[]}},function(t,e,n){var r=n(160),o=n(100),i=n(12),u=n(101),a=n(103),c=n(104),s=Object.prototype.hasOwnProperty;t.exports=function(t,e){var n=i(t),f=!n&&o(t),p=!n&&!f&&u(t),l=!n&&!f&&!p&&c(t),h=n||f||p||l,v=h?r(t.length,String):[],y=v.length;for(var d in t)!e&&!s.call(t,d)||h&&("length"==d||p&&("offset"==d||"parent"==d)||l&&("buffer"==d||"byteLength"==d||"byteOffset"==d)||a(d,y))||v.push(d);return v}},function(t,e){t.exports=function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}},function(t,e,n){var r=n(25),o=n(27),i="[object Arguments]";t.exports=function(t){return o(t)&&r(t)==i}},function(t,e){t.exports=function(){return!1}},function(t,e,n){var r=n(25),o=n(61),i=n(27),u={};u["[object Float32Array]"]=u["[object Float64Array]"]=u["[object Int8Array]"]=u["[object Int16Array]"]=u["[object Int32Array]"]=u["[object Uint8Array]"]=u["[object Uint8ClampedArray]"]=u["[object Uint16Array]"]=u["[object Uint32Array]"]=!0,u["[object Arguments]"]=u["[object Array]"]=u["[object ArrayBuffer]"]=u["[object Boolean]"]=u["[object DataView]"]=u["[object Date]"]=u["[object Error]"]=u["[object Function]"]=u["[object Map]"]=u["[object Number]"]=u["[object Object]"]=u["[object RegExp]"]=u["[object Set]"]=u["[object String]"]=u["[object WeakMap]"]=!1,t.exports=function(t){return i(t)&&o(t.length)&&!!u[r(t)]}},function(t,e){t.exports=function(t){return function(e){return t(e)}}},function(t,e,n){(function(t){var r=n(96),o=e&&!e.nodeType&&e,i=o&&"object"==typeof t&&t&&!t.nodeType&&t,u=i&&i.exports===o&&r.process,a=function(){try{var t=i&&i.require&&i.require("util").types;return t||u&&u.binding&&u.binding("util")}catch(t){}}();t.exports=a}).call(this,n(102)(t))},function(t,e,n){var r=n(167),o=n(168),i=Object.prototype.hasOwnProperty;t.exports=function(t){if(!r(t))return o(t);var e=[];for(var n in Object(t))i.call(t,n)&&"constructor"!=n&&e.push(n);return e}},function(t,e){var n=Object.prototype;t.exports=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||n)}},function(t,e,n){var r=n(169)(Object.keys,Object);t.exports=r},function(t,e){t.exports=function(t,e){return function(n){return t(e(n))}}},function(t,e,n){var r=n(171),o=n(58),i=n(172),u=n(173),a=n(174),c=n(25),s=n(97),f=s(r),p=s(o),l=s(i),h=s(u),v=s(a),y=c;(r&&"[object DataView]"!=y(new r(new ArrayBuffer(1)))||o&&"[object Map]"!=y(new o)||i&&"[object Promise]"!=y(i.resolve())||u&&"[object Set]"!=y(new u)||a&&"[object WeakMap]"!=y(new a))&&(y=function(t){var e=c(t),n="[object Object]"==e?t.constructor:void 0,r=n?s(n):"";if(r)switch(r){case f:return"[object DataView]";case p:return"[object Map]";case l:return"[object Promise]";case h:return"[object Set]";case v:return"[object WeakMap]"}return e}),t.exports=y},function(t,e,n){var r=n(24)(n(11),"DataView");t.exports=r},function(t,e,n){var r=n(24)(n(11),"Promise");t.exports=r},function(t,e,n){var r=n(24)(n(11),"Set");t.exports=r},function(t,e,n){var r=n(24)(n(11),"WeakMap");t.exports=r},function(t,e,n){var r=n(105),o=n(60);t.exports=function(t){for(var e=o(t),n=e.length;n--;){var i=e[n],u=t[i];e[n]=[i,u,r(u)]}return e}},function(t,e,n){var r=n(98),o=n(177),i=n(183),u=n(63),a=n(105),c=n(106),s=n(57),f=1,p=2;t.exports=function(t,e){return u(t)&&a(e)?c(s(t),e):function(n){var u=o(n,t);return void 0===u&&u===e?i(n,t):r(e,u,f|p)}}},function(t,e,n){var r=n(107);t.exports=function(t,e,n){var o=null==t?void 0:r(t,e);return void 0===o?n:o}},function(t,e,n){var r=n(179),o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,i=/\\(\\)?/g,u=r(function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(o,function(t,n,r,o){e.push(r?o.replace(i,"$1"):n||t)}),e});t.exports=u},function(t,e,n){var r=n(180),o=500;t.exports=function(t){var e=r(t,function(t){return n.size===o&&n.clear(),t}),n=e.cache;return e}},function(t,e,n){var r=n(59),o="Expected a function";function i(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError(o);var n=function(){var r=arguments,o=e?e.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var u=t.apply(this,r);return n.cache=i.set(o,u)||i,u};return n.cache=new(i.Cache||r),n}i.Cache=r,t.exports=i},function(t,e,n){var r=n(182);t.exports=function(t){return null==t?"":r(t)}},function(t,e,n){var r=n(54),o=n(92),i=n(12),u=n(64),a=1/0,c=r?r.prototype:void 0,s=c?c.toString:void 0;t.exports=function t(e){if("string"==typeof e)return e;if(i(e))return o(e,t)+"";if(u(e))return s?s.call(e):"";var n=e+"";return"0"==n&&1/e==-a?"-0":n}},function(t,e,n){var r=n(184),o=n(185);t.exports=function(t,e){return null!=t&&o(t,e,r)}},function(t,e){t.exports=function(t,e){return null!=t&&e in Object(t)}},function(t,e,n){var r=n(108),o=n(100),i=n(12),u=n(103),a=n(61),c=n(57);t.exports=function(t,e,n){for(var s=-1,f=(e=r(e,t)).length,p=!1;++s<f;){var l=c(e[s]);if(!(p=null!=t&&n(t,l)))break;t=t[l]}return p||++s!=f?p:!!(f=null==t?0:t.length)&&a(f)&&u(l,f)&&(i(t)||o(t))}},function(t,e){t.exports=function(t){return t}},function(t,e,n){var r=n(188),o=n(189),i=n(63),u=n(57);t.exports=function(t){return i(t)?r(u(t)):o(t)}},function(t,e){t.exports=function(t){return function(e){return null==e?void 0:e[t]}}},function(t,e,n){var r=n(107);t.exports=function(t){return function(e){return r(e,t)}}},function(t,e,n){var r=n(191),o=n(62);t.exports=function(t,e){var n=-1,i=o(t)?Array(t.length):[];return r(t,function(t,r,o){i[++n]=e(t,r,o)}),i}},function(t,e,n){var r=n(192),o=n(195)(r);t.exports=o},function(t,e,n){var r=n(193),o=n(60);t.exports=function(t,e){return t&&r(t,e,o)}},function(t,e,n){var r=n(194)();t.exports=r},function(t,e){t.exports=function(t){return function(e,n,r){for(var o=-1,i=Object(e),u=r(e),a=u.length;a--;){var c=u[t?a:++o];if(!1===n(i[c],c,i))break}return e}}},function(t,e,n){var r=n(62);t.exports=function(t,e){return function(n,o){if(null==n)return n;if(!r(n))return t(n,o);for(var i=n.length,u=e?i:-1,a=Object(n);(e?u--:++u<i)&&!1!==o(a[u],u,a););return n}}},,,,function(t,e,n){"use strict";n.r(e);var r,o=n(0),i=n.n(o),u=n(109),a=n.n(u),c=n(50),s=n.n(c),f=n(110),p=n.n(f),l=function(t,e,n,r){return new(n||(n=Promise))(function(o,i){function u(t){try{c(r.next(t))}catch(t){i(t)}}function a(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){t.done?o(t.value):new n(function(e){e(t.value)}).then(u,a)}c((r=r.apply(t,e||[])).next())})},h=function(t,e){var n,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=(o=u.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=e.call(t,u)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}},v=function(){function t(t,e,n,r){this.$q=e,this.name=t.name,this.url=t.url,this.q=e,this.backendSrv=n,this.templateSrv=r,this.withCredentials=t.withCredentials,this.headers={"Content-Type":"application/json"},"string"==typeof t.basicAuth&&t.basicAuth.length>0&&(this.headers.Authorization=t.basicAuth)}return t.$inject=["instanceSettings","$q","backendSrv","templateSrv"],t.prototype.query=function(t){return l(this,void 0,void 0,function(){var e,n,r,o,u,a,c,s,f,p,l,v,y,d,b,g,x,_,j=this;return h(this,function(h){switch(h.label){case 0:if(e=[],(n=t).targets=this.buildQueryTargets(t),r="UTC",n.targets.length<=0)return[2,this.q.when({data:[]})];for(o=0;o<n.targets.length;o++)e.push(n.targets[o]);for(this.templateSrv.getAdhocFilters?n.adhocFilters=this.templateSrv.getAdhocFilters(this.name):n.adhocFilters=[],"browser"==n.timezone&&(r=Intl.DateTimeFormat().resolvedOptions().timeZone),u=[],a=0,c=n.targets;a<c.length;a++)s=c[a],u.push(this.doRequest({url:this.url+"/series/query?expr="+s.target}).then(function(t){return t.data}));return[4,Promise.all(u)];case 1:return f=h.sent(),f=i.a.flatten(f),p=Math.round(n.range.from/1e3),Math.round(n.range.to/1e3),l=Math.round((n.range.to-n.range.from)/n.intervalMs),v=n.interval,y=n.targets[0].refId,d=n.maxDataPoints,b=this.url+"/series/values?series="+f.join(",")+"&refId="+y+"&start="+p+"&samples="+l+"&interval="+v+"&maxdatapoints="+d+"&zone="+r,console.log("DEBUG URL "+JSON.stringify(b)),[4,this.doRequest({url:b})];case 2:return g=(g=h.sent()).data,x={target:n.targets[0].target,datapoints:g.map(function(t){return[parseFloat(t.value),j.round(t.timestamp,1)]})},_={data:[x]},console.log("DEBUG returning "+JSON.stringify(_)),[2,_]}})})},t.prototype.round=function(t,e){var n=Math.pow(10,e||0);return Math.round(t*n)/n},t.prototype.fetchURL=function(t){return console.log("fetchURL="+t),this.doRequest({url:t,method:"GET"}).then(function(t){return t.data})},t.prototype.testDatasource=function(){return this.doRequest({url:this.url+"/series/ping",method:"GET"}).then(function(t){return 200===t.status?{status:"success",message:"PCP Data source is working",title:"Success"}:{status:"error",message:"PCP Data source is not working: "+t.message,title:"Error"}})},t.prototype.annotationQuery=function(t){var e={annotation:{query:this.templateSrv.replace(t.annotation.query,{},"glob"),name:t.annotation.name,datasource:t.annotation.datasource,enable:t.annotation.enable,iconColor:t.annotation.iconColor},range:t.range,rangeRaw:t.rangeRaw,variables:this.getVariables()};return this.doRequest({url:this.url+"/grafana/annotations",method:"POST",data:e}).then(function(t){return t.data})},t.prototype.metricFindQuery=function(t){this.templateSrv.replace(t,null,"regex");return this.doRequest({url:this.url+"/grafana/search?target="+t+"*",method:"GET"}).then(function(t){return t.data})},t.prototype.mapToTextValue=function(t){return a()(t.data,function(t,e){return t&&t.text&&t.value?{text:t.text,value:t.value}:s()(t)?{text:t,value:e}:{text:t,value:t}})},t.prototype.doRequest=function(t){return t.withCredentials=this.withCredentials,t.headers=this.headers,this.backendSrv.datasourceRequest(t)},t.prototype.buildQueryTargets=function(t){var e=this;return t.targets.filter(function(t){return"select metric"!==t.target}).map(function(n){var r=n.data;return"string"==typeof r&&""===r.trim()&&(r=null),r&&(r=JSON.parse(r)),{data:r,target:e.templateSrv.replace(n.target,t.scopedVars,"regex"),refId:n.refId,hide:n.hide,type:n.type,isCounter:n.isCounter,legend:n.legend}})},t.prototype.getVariables=function(){var t=p()(this.templateSrv.index)?{}:this.templateSrv.index,e={};return Object.keys(t).forEach(function(n){var r=t[n];e[r.name]={text:r.current.text,value:r.current.value}}),e},t.prototype.getTagKeys=function(t){var e=this;return new Promise(function(n,r){e.doRequest({url:e.url+"/grafana/tag-keys",method:"POST",data:t}).then(function(t){return n(t.data)})})},t.prototype.getTagValues=function(t){var e=this;return new Promise(function(n,r){e.doRequest({url:e.url+"/grafana/tag-values",method:"POST",data:t}).then(function(t){return n(t.data)})})},t}(),y=n(1),d=n(17),b=(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),g=function(t){function e(e,n){var r=t.call(this,e,n)||this;return r.formats=[],r.target.expr=r.target.expr||"",r.target.format=r.target.format||r.getDefaultFormat(),r.formats=[{text:"Time series",value:y.a.TimeSeries},{text:"Table",value:y.a.Table},{text:"Heatmap",value:y.a.Heatmap}],r}return b(e,t),e.$inject=["$scope","$injector"],e.prototype.getDefaultFormat=function(){return"table"===this.panelCtrl.panel.type?y.a.Table:"heatmap"===this.panelCtrl.panel.type?y.a.Heatmap:y.a.TimeSeries},e.templateUrl="datasources/redis/partials/query.editor.html",e}(d.a);n.d(e,"ConfigCtrl",function(){return x}),n.d(e,"AnnotationsQueryCtrl",function(){return _}),n.d(e,"Datasource",function(){return v}),n.d(e,"QueryCtrl",function(){return g});var x=function(){function t(){}return t.templateUrl="datasources/redis/partials/config.html",t}(),_=function(){function t(){}return t.templateUrl="datasources/redis/partials/annotations.editor.html",t}()}])});
//# sourceMappingURL=module.js.map