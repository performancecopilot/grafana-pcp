define(["app/plugins/sdk"],function(t){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=36)}([function(t,e,r){var n=r(23),o="object"==typeof self&&self&&self.Object===Object&&self,i=n||o||Function("return this")();t.exports=i},function(t,e){var r=Array.isArray;t.exports=r},function(t,e,r){var n=r(52),o=r(58);t.exports=function(t,e){var r=o(t,e);return n(r)?r:void 0}},function(t,e,r){var n=r(7),o=r(54),i=r(55),u="[object Null]",a="[object Undefined]",c=n?n.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?a:u:c&&c in Object(t)?o(t):i(t)}},function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t}},function(t,e,r){var n=r(42),o=r(43),i=r(44),u=r(45),a=r(46);function c(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}c.prototype.clear=n,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=u,c.prototype.set=a,t.exports=c},function(t,e,r){var n=r(21);t.exports=function(t,e){for(var r=t.length;r--;)if(n(t[r][0],e))return r;return-1}},function(t,e,r){var n=r(0).Symbol;t.exports=n},function(t,e){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},function(t,e,r){var n=r(2)(Object,"create");t.exports=n},function(t,e,r){var n=r(67);t.exports=function(t,e){var r=t.__data__;return n(e)?r["string"==typeof e?"string":"hash"]:r.map}},function(t,e,r){var n=r(18),o=1/0;t.exports=function(t){if("string"==typeof t||n(t))return t;var e=t+"";return"0"==e&&1/t==-o?"-0":e}},function(t,e,r){var n=r(2)(r(0),"Map");t.exports=n},function(t,e,r){var n=r(59),o=r(66),i=r(68),u=r(69),a=r(70);function c(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}c.prototype.clear=n,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=u,c.prototype.set=a,t.exports=c},function(t,e,r){var n=r(88),o=r(95),i=r(16);t.exports=function(t){return i(t)?n(t):o(t)}},function(t,e){var r=9007199254740991;t.exports=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=r}},function(t,e,r){var n=r(22),o=r(15);t.exports=function(t){return null!=t&&o(t.length)&&!n(t)}},function(t,e,r){var n=r(1),o=r(18),i=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,u=/^\w*$/;t.exports=function(t,e){if(n(t))return!1;var r=typeof t;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=t&&!o(t))||u.test(t)||!i.test(t)||null!=e&&t in Object(e)}},function(t,e,r){var n=r(3),o=r(4),i="[object Symbol]";t.exports=function(t){return"symbol"==typeof t||o(t)&&n(t)==i}},function(t,e){t.exports=function(t,e){for(var r=-1,n=null==t?0:t.length,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}},function(t,e,r){var n=r(5),o=r(47),i=r(48),u=r(49),a=r(50),c=r(51);function s(t){var e=this.__data__=new n(t);this.size=e.size}s.prototype.clear=o,s.prototype.delete=i,s.prototype.get=u,s.prototype.has=a,s.prototype.set=c,t.exports=s},function(t,e){t.exports=function(t,e){return t===e||t!=t&&e!=e}},function(t,e,r){var n=r(3),o=r(8),i="[object AsyncFunction]",u="[object Function]",a="[object GeneratorFunction]",c="[object Proxy]";t.exports=function(t){if(!o(t))return!1;var e=n(t);return e==u||e==a||e==i||e==c}},function(t,e,r){(function(e){var r="object"==typeof e&&e&&e.Object===Object&&e;t.exports=r}).call(this,r(53))},function(t,e){var r=Function.prototype.toString;t.exports=function(t){if(null!=t){try{return r.call(t)}catch(t){}try{return t+""}catch(t){}}return""}},function(t,e,r){var n=r(71),o=r(4);t.exports=function t(e,r,i,u,a){return e===r||(null==e||null==r||!o(e)&&!o(r)?e!=e&&r!=r:n(e,r,i,u,t,a))}},function(t,e,r){var n=r(72),o=r(75),i=r(76),u=1,a=2;t.exports=function(t,e,r,c,s,f){var l=r&u,p=t.length,h=e.length;if(p!=h&&!(l&&h>p))return!1;var v=f.get(t);if(v&&f.get(e))return v==e;var d=-1,y=!0,b=r&a?new n:void 0;for(f.set(t,e),f.set(e,t);++d<p;){var g=t[d],x=e[d];if(c)var _=l?c(x,g,d,e,t,f):c(g,x,d,t,e,f);if(void 0!==_){if(_)continue;y=!1;break}if(b){if(!o(e,function(t,e){if(!i(b,e)&&(g===t||s(g,t,r,c,f)))return b.push(e)})){y=!1;break}}else if(g!==x&&!s(g,x,r,c,f)){y=!1;break}}return f.delete(t),f.delete(e),y}},function(t,e,r){var n=r(90),o=r(4),i=Object.prototype,u=i.hasOwnProperty,a=i.propertyIsEnumerable,c=n(function(){return arguments}())?n:function(t){return o(t)&&u.call(t,"callee")&&!a.call(t,"callee")};t.exports=c},function(t,e,r){(function(t){var n=r(0),o=r(91),i="object"==typeof e&&e&&!e.nodeType&&e,u=i&&"object"==typeof t&&t&&!t.nodeType&&t,a=u&&u.exports===i?n.Buffer:void 0,c=(a?a.isBuffer:void 0)||o;t.exports=c}).call(this,r(29)(t))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e){var r=9007199254740991,n=/^(?:0|[1-9]\d*)$/;t.exports=function(t,e){var o=typeof t;return!!(e=null==e?r:e)&&("number"==o||"symbol"!=o&&n.test(t))&&t>-1&&t%1==0&&t<e}},function(t,e,r){var n=r(92),o=r(93),i=r(94),u=i&&i.isTypedArray,a=u?o(u):n;t.exports=a},function(t,e,r){var n=r(8);t.exports=function(t){return t==t&&!n(t)}},function(t,e){t.exports=function(t,e){return function(r){return null!=r&&r[t]===e&&(void 0!==e||t in Object(r))}}},function(t,e,r){var n=r(35),o=r(11);t.exports=function(t,e){for(var r=0,i=(e=n(e,t)).length;null!=t&&r<i;)t=t[o(e[r++])];return r&&r==i?t:void 0}},function(t,e,r){var n=r(1),o=r(17),i=r(107),u=r(110);t.exports=function(t,e){return n(t)?t:o(t,e)?[t]:i(u(t))}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.AnnotationsQueryCtrl=e.QueryOptionsCtrl=e.ConfigCtrl=e.QueryCtrl=e.Datasource=void 0;var n=r(37),o=r(126),i=function(){function t(){}return t.templateUrl="partials/config.html",t}(),u=function(){function t(){}return t.templateUrl="partials/query.options.html",t}(),a=function(){function t(){}return t.templateUrl="partials/annotations.editor.html",t}();e.Datasource=n.PCPDatasource,e.QueryCtrl=o.PCPDatasourceQueryCtrl,e.ConfigCtrl=i,e.QueryOptionsCtrl=u,e.AnnotationsQueryCtrl=a},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.PCPDatasource=void 0;var n=u(r(38)),o=u(r(8)),i=u(r(125));function u(t){return t&&t.__esModule?t:{default:t}}var a=function(t,e,r,n){return new(r||(r=Promise))(function(o,i){function u(t){try{c(n.next(t))}catch(t){i(t)}}function a(t){try{c(n.throw(t))}catch(t){i(t)}}function c(t){t.done?o(t.value):new r(function(e){e(t.value)}).then(u,a)}c((n=n.apply(t,e||[])).next())})},c=function(t,e){var r,n,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,n=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=(o=u.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=e.call(t,u)}catch(t){i=[6,t],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}},s=function(){function t(t,e,r,n){this.$q=e,this.name=t.name,this.url=t.url,this.q=e,this.backendSrv=r,this.templateSrv=n,this.withCredentials=t.withCredentials,this.headers={"Content-Type":"application/json"},"string"==typeof t.basicAuth&&t.basicAuth.length>0&&(this.headers.Authorization=t.basicAuth)}return t.$inject=["instanceSettings","$q","backendSrv","templateSrv"],t.prototype.queryPost=function(t){var e=t;return e.targets=this.buildQueryTargets(t),e.targets.length<=0?this.q.when({data:[]}):(this.templateSrv.getAdhocFilters?e.adhocFilters=this.templateSrv.getAdhocFilters(this.name):e.adhocFilters=[],this.doRequest({url:this.url+"/grafana/query",data:e,method:"POST"}))},t.prototype.query=function(t){return a(this,void 0,void 0,function(){var e,r,n,o,i,u,a,s=this;return c(this,function(c){switch(c.label){case 0:if(e=[],(r=t).targets=this.buildQueryTargets(t),n="UTC",r.targets.length<=0)return[2,this.q.when({data:[]})];for(i=0;i<r.targets.length;i++)e.push(r.targets[i]);for(this.templateSrv.getAdhocFilters?r.adhocFilters=this.templateSrv.getAdhocFilters(this.name):r.adhocFilters=[],"browser"==r.timezone&&(n=Intl.DateTimeFormat().resolvedOptions().timeZone),o=new Array(r.targets.length),i=0;i<r.targets.length;i++)o[i]=this.url+"/grafana/query?refId="+r.targets[i].refId+"&panelId="+r.panelId+"&dashboardId="+r.dashboardId+"&timezone="+n+"&maxdatapoints="+r.maxDataPoints+"&start="+Math.round(r.range.from/1e3)+"&finish="+Math.round(r.range.to/1e3)+"&interval="+r.interval+"&expr="+r.targets[i].target;return u=[],a=o.map(function(t){return s.fetchURL(t)}),[4,Promise.all(a).then(function(t){for(var e=0,r=t;e<r.length;e++){var n=r[e];u.push(n[0])}})];case 1:return c.sent(),console.log("results len="+u.length+" value="+JSON.stringify(u)),[2,{data:u}]}})})},t.prototype.fetchURL=function(t){return console.log("fetchURL="+t),this.doRequest({url:t,method:"GET"}).then(function(t){return t.data})},t.prototype.testDatasource=function(){return this.doRequest({url:this.url+"/grafana",method:"GET"}).then(function(t){return 200===t.status?{status:"success",message:"PCP Data source is working",title:"Success"}:{status:"error",message:"PCP Data source is not working: "+t.message,title:"Error"}})},t.prototype.annotationQuery=function(t){var e={annotation:{query:this.templateSrv.replace(t.annotation.query,{},"glob"),name:t.annotation.name,datasource:t.annotation.datasource,enable:t.annotation.enable,iconColor:t.annotation.iconColor},range:t.range,rangeRaw:t.rangeRaw,variables:this.getVariables()};return this.doRequest({url:this.url+"/grafana/annotations",method:"POST",data:e}).then(function(t){return t.data})},t.prototype.metricFindQuery=function(t){this.templateSrv.replace(t,null,"regex");return this.doRequest({url:this.url+"/grafana/search?target="+t+"*",method:"GET"}).then(function(t){return t.data})},t.prototype.mapToTextValue=function(t){return(0,n.default)(t.data,function(t,e){return t&&t.text&&t.value?{text:t.text,value:t.value}:(0,o.default)(t)?{text:t,value:e}:{text:t,value:t}})},t.prototype.doRequest=function(t){return t.withCredentials=this.withCredentials,t.headers=this.headers,this.backendSrv.datasourceRequest(t)},t.prototype.buildQueryTargets=function(t){var e=this;return t.targets.filter(function(t){return"select metric"!==t.target}).map(function(r){var n=r.data;return"string"==typeof n&&""===n.trim()&&(n=null),n&&(n=JSON.parse(n)),{data:n,target:e.templateSrv.replace(r.target,t.scopedVars,"regex"),refId:r.refId,hide:r.hide,type:r.type}})},t.prototype.getVariables=function(){var t=(0,i.default)(this.templateSrv.index)?{}:this.templateSrv.index,e={};return Object.keys(t).forEach(function(r){var n=t[r];e[n.name]={text:n.current.text,value:n.current.value}}),e},t.prototype.getTagKeys=function(t){var e=this;return new Promise(function(r,n){e.doRequest({url:e.url+"/grafana/tag-keys",method:"POST",data:t}).then(function(t){return r(t.data)})})},t.prototype.getTagValues=function(t){var e=this;return new Promise(function(r,n){e.doRequest({url:e.url+"/grafana/tag-values",method:"POST",data:t}).then(function(t){return r(t.data)})})},t}();e.PCPDatasource=s},function(t,e,r){var n=r(19),o=r(39),i=r(119),u=r(1);t.exports=function(t,e){return(u(t)?n:i)(t,o(e,3))}},function(t,e,r){var n=r(40),o=r(105),i=r(115),u=r(1),a=r(116);t.exports=function(t){return"function"==typeof t?t:null==t?i:"object"==typeof t?u(t)?o(t[0],t[1]):n(t):a(t)}},function(t,e,r){var n=r(41),o=r(104),i=r(33);t.exports=function(t){var e=o(t);return 1==e.length&&e[0][2]?i(e[0][0],e[0][1]):function(r){return r===t||n(r,t,e)}}},function(t,e,r){var n=r(20),o=r(25),i=1,u=2;t.exports=function(t,e,r,a){var c=r.length,s=c,f=!a;if(null==t)return!s;for(t=Object(t);c--;){var l=r[c];if(f&&l[2]?l[1]!==t[l[0]]:!(l[0]in t))return!1}for(;++c<s;){var p=(l=r[c])[0],h=t[p],v=l[1];if(f&&l[2]){if(void 0===h&&!(p in t))return!1}else{var d=new n;if(a)var y=a(h,v,p,t,e,d);if(!(void 0===y?o(v,h,i|u,a,d):y))return!1}}return!0}},function(t,e){t.exports=function(){this.__data__=[],this.size=0}},function(t,e,r){var n=r(6),o=Array.prototype.splice;t.exports=function(t){var e=this.__data__,r=n(e,t);return!(r<0||(r==e.length-1?e.pop():o.call(e,r,1),--this.size,0))}},function(t,e,r){var n=r(6);t.exports=function(t){var e=this.__data__,r=n(e,t);return r<0?void 0:e[r][1]}},function(t,e,r){var n=r(6);t.exports=function(t){return n(this.__data__,t)>-1}},function(t,e,r){var n=r(6);t.exports=function(t,e){var r=this.__data__,o=n(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}},function(t,e,r){var n=r(5);t.exports=function(){this.__data__=new n,this.size=0}},function(t,e){t.exports=function(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}},function(t,e){t.exports=function(t){return this.__data__.get(t)}},function(t,e){t.exports=function(t){return this.__data__.has(t)}},function(t,e,r){var n=r(5),o=r(12),i=r(13),u=200;t.exports=function(t,e){var r=this.__data__;if(r instanceof n){var a=r.__data__;if(!o||a.length<u-1)return a.push([t,e]),this.size=++r.size,this;r=this.__data__=new i(a)}return r.set(t,e),this.size=r.size,this}},function(t,e,r){var n=r(22),o=r(56),i=r(8),u=r(24),a=/^\[object .+?Constructor\]$/,c=Function.prototype,s=Object.prototype,f=c.toString,l=s.hasOwnProperty,p=RegExp("^"+f.call(l).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(t){return!(!i(t)||o(t))&&(n(t)?p:a).test(u(t))}},function(t,e){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){var n=r(7),o=Object.prototype,i=o.hasOwnProperty,u=o.toString,a=n?n.toStringTag:void 0;t.exports=function(t){var e=i.call(t,a),r=t[a];try{t[a]=void 0;var n=!0}catch(t){}var o=u.call(t);return n&&(e?t[a]=r:delete t[a]),o}},function(t,e){var r=Object.prototype.toString;t.exports=function(t){return r.call(t)}},function(t,e,r){var n=r(57),o=function(){var t=/[^.]+$/.exec(n&&n.keys&&n.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();t.exports=function(t){return!!o&&o in t}},function(t,e,r){var n=r(0)["__core-js_shared__"];t.exports=n},function(t,e){t.exports=function(t,e){return null==t?void 0:t[e]}},function(t,e,r){var n=r(60),o=r(5),i=r(12);t.exports=function(){this.size=0,this.__data__={hash:new n,map:new(i||o),string:new n}}},function(t,e,r){var n=r(61),o=r(62),i=r(63),u=r(64),a=r(65);function c(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}c.prototype.clear=n,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=u,c.prototype.set=a,t.exports=c},function(t,e,r){var n=r(9);t.exports=function(){this.__data__=n?n(null):{},this.size=0}},function(t,e){t.exports=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}},function(t,e,r){var n=r(9),o="__lodash_hash_undefined__",i=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;if(n){var r=e[t];return r===o?void 0:r}return i.call(e,t)?e[t]:void 0}},function(t,e,r){var n=r(9),o=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;return n?void 0!==e[t]:o.call(e,t)}},function(t,e,r){var n=r(9),o="__lodash_hash_undefined__";t.exports=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=n&&void 0===e?o:e,this}},function(t,e,r){var n=r(10);t.exports=function(t){var e=n(this,t).delete(t);return this.size-=e?1:0,e}},function(t,e){t.exports=function(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}},function(t,e,r){var n=r(10);t.exports=function(t){return n(this,t).get(t)}},function(t,e,r){var n=r(10);t.exports=function(t){return n(this,t).has(t)}},function(t,e,r){var n=r(10);t.exports=function(t,e){var r=n(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}},function(t,e,r){var n=r(20),o=r(26),i=r(77),u=r(81),a=r(99),c=r(1),s=r(28),f=r(31),l=1,p="[object Arguments]",h="[object Array]",v="[object Object]",d=Object.prototype.hasOwnProperty;t.exports=function(t,e,r,y,b,g){var x=c(t),_=c(e),j=x?h:a(t),m=_?h:a(e),w=(j=j==p?v:j)==v,O=(m=m==p?v:m)==v,P=j==m;if(P&&s(t)){if(!s(e))return!1;x=!0,w=!1}if(P&&!w)return g||(g=new n),x||f(t)?o(t,e,r,y,b,g):i(t,e,j,r,y,b,g);if(!(r&l)){var S=w&&d.call(t,"__wrapped__"),A=O&&d.call(e,"__wrapped__");if(S||A){var C=S?t.value():t,T=A?e.value():e;return g||(g=new n),b(C,T,r,y,g)}}return!!P&&(g||(g=new n),u(t,e,r,y,b,g))}},function(t,e,r){var n=r(13),o=r(73),i=r(74);function u(t){var e=-1,r=null==t?0:t.length;for(this.__data__=new n;++e<r;)this.add(t[e])}u.prototype.add=u.prototype.push=o,u.prototype.has=i,t.exports=u},function(t,e){var r="__lodash_hash_undefined__";t.exports=function(t){return this.__data__.set(t,r),this}},function(t,e){t.exports=function(t){return this.__data__.has(t)}},function(t,e){t.exports=function(t,e){for(var r=-1,n=null==t?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}},function(t,e){t.exports=function(t,e){return t.has(e)}},function(t,e,r){var n=r(7),o=r(78),i=r(21),u=r(26),a=r(79),c=r(80),s=1,f=2,l="[object Boolean]",p="[object Date]",h="[object Error]",v="[object Map]",d="[object Number]",y="[object RegExp]",b="[object Set]",g="[object String]",x="[object Symbol]",_="[object ArrayBuffer]",j="[object DataView]",m=n?n.prototype:void 0,w=m?m.valueOf:void 0;t.exports=function(t,e,r,n,m,O,P){switch(r){case j:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case _:return!(t.byteLength!=e.byteLength||!O(new o(t),new o(e)));case l:case p:case d:return i(+t,+e);case h:return t.name==e.name&&t.message==e.message;case y:case g:return t==e+"";case v:var S=a;case b:var A=n&s;if(S||(S=c),t.size!=e.size&&!A)return!1;var C=P.get(t);if(C)return C==e;n|=f,P.set(t,e);var T=u(S(t),S(e),n,m,O,P);return P.delete(t),T;case x:if(w)return w.call(t)==w.call(e)}return!1}},function(t,e,r){var n=r(0).Uint8Array;t.exports=n},function(t,e){t.exports=function(t){var e=-1,r=Array(t.size);return t.forEach(function(t,n){r[++e]=[n,t]}),r}},function(t,e){t.exports=function(t){var e=-1,r=Array(t.size);return t.forEach(function(t){r[++e]=t}),r}},function(t,e,r){var n=r(82),o=1,i=Object.prototype.hasOwnProperty;t.exports=function(t,e,r,u,a,c){var s=r&o,f=n(t),l=f.length;if(l!=n(e).length&&!s)return!1;for(var p=l;p--;){var h=f[p];if(!(s?h in e:i.call(e,h)))return!1}var v=c.get(t);if(v&&c.get(e))return v==e;var d=!0;c.set(t,e),c.set(e,t);for(var y=s;++p<l;){var b=t[h=f[p]],g=e[h];if(u)var x=s?u(g,b,h,e,t,c):u(b,g,h,t,e,c);if(!(void 0===x?b===g||a(b,g,r,u,c):x)){d=!1;break}y||(y="constructor"==h)}if(d&&!y){var _=t.constructor,j=e.constructor;_!=j&&"constructor"in t&&"constructor"in e&&!("function"==typeof _&&_ instanceof _&&"function"==typeof j&&j instanceof j)&&(d=!1)}return c.delete(t),c.delete(e),d}},function(t,e,r){var n=r(83),o=r(85),i=r(14);t.exports=function(t){return n(t,i,o)}},function(t,e,r){var n=r(84),o=r(1);t.exports=function(t,e,r){var i=e(t);return o(t)?i:n(i,r(t))}},function(t,e){t.exports=function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}},function(t,e,r){var n=r(86),o=r(87),i=Object.prototype.propertyIsEnumerable,u=Object.getOwnPropertySymbols,a=u?function(t){return null==t?[]:(t=Object(t),n(u(t),function(e){return i.call(t,e)}))}:o;t.exports=a},function(t,e){t.exports=function(t,e){for(var r=-1,n=null==t?0:t.length,o=0,i=[];++r<n;){var u=t[r];e(u,r,t)&&(i[o++]=u)}return i}},function(t,e){t.exports=function(){return[]}},function(t,e,r){var n=r(89),o=r(27),i=r(1),u=r(28),a=r(30),c=r(31),s=Object.prototype.hasOwnProperty;t.exports=function(t,e){var r=i(t),f=!r&&o(t),l=!r&&!f&&u(t),p=!r&&!f&&!l&&c(t),h=r||f||l||p,v=h?n(t.length,String):[],d=v.length;for(var y in t)!e&&!s.call(t,y)||h&&("length"==y||l&&("offset"==y||"parent"==y)||p&&("buffer"==y||"byteLength"==y||"byteOffset"==y)||a(y,d))||v.push(y);return v}},function(t,e){t.exports=function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}},function(t,e,r){var n=r(3),o=r(4),i="[object Arguments]";t.exports=function(t){return o(t)&&n(t)==i}},function(t,e){t.exports=function(){return!1}},function(t,e,r){var n=r(3),o=r(15),i=r(4),u={};u["[object Float32Array]"]=u["[object Float64Array]"]=u["[object Int8Array]"]=u["[object Int16Array]"]=u["[object Int32Array]"]=u["[object Uint8Array]"]=u["[object Uint8ClampedArray]"]=u["[object Uint16Array]"]=u["[object Uint32Array]"]=!0,u["[object Arguments]"]=u["[object Array]"]=u["[object ArrayBuffer]"]=u["[object Boolean]"]=u["[object DataView]"]=u["[object Date]"]=u["[object Error]"]=u["[object Function]"]=u["[object Map]"]=u["[object Number]"]=u["[object Object]"]=u["[object RegExp]"]=u["[object Set]"]=u["[object String]"]=u["[object WeakMap]"]=!1,t.exports=function(t){return i(t)&&o(t.length)&&!!u[n(t)]}},function(t,e){t.exports=function(t){return function(e){return t(e)}}},function(t,e,r){(function(t){var n=r(23),o="object"==typeof e&&e&&!e.nodeType&&e,i=o&&"object"==typeof t&&t&&!t.nodeType&&t,u=i&&i.exports===o&&n.process,a=function(){try{var t=i&&i.require&&i.require("util").types;return t||u&&u.binding&&u.binding("util")}catch(t){}}();t.exports=a}).call(this,r(29)(t))},function(t,e,r){var n=r(96),o=r(97),i=Object.prototype.hasOwnProperty;t.exports=function(t){if(!n(t))return o(t);var e=[];for(var r in Object(t))i.call(t,r)&&"constructor"!=r&&e.push(r);return e}},function(t,e){var r=Object.prototype;t.exports=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||r)}},function(t,e,r){var n=r(98)(Object.keys,Object);t.exports=n},function(t,e){t.exports=function(t,e){return function(r){return t(e(r))}}},function(t,e,r){var n=r(100),o=r(12),i=r(101),u=r(102),a=r(103),c=r(3),s=r(24),f=s(n),l=s(o),p=s(i),h=s(u),v=s(a),d=c;(n&&"[object DataView]"!=d(new n(new ArrayBuffer(1)))||o&&"[object Map]"!=d(new o)||i&&"[object Promise]"!=d(i.resolve())||u&&"[object Set]"!=d(new u)||a&&"[object WeakMap]"!=d(new a))&&(d=function(t){var e=c(t),r="[object Object]"==e?t.constructor:void 0,n=r?s(r):"";if(n)switch(n){case f:return"[object DataView]";case l:return"[object Map]";case p:return"[object Promise]";case h:return"[object Set]";case v:return"[object WeakMap]"}return e}),t.exports=d},function(t,e,r){var n=r(2)(r(0),"DataView");t.exports=n},function(t,e,r){var n=r(2)(r(0),"Promise");t.exports=n},function(t,e,r){var n=r(2)(r(0),"Set");t.exports=n},function(t,e,r){var n=r(2)(r(0),"WeakMap");t.exports=n},function(t,e,r){var n=r(32),o=r(14);t.exports=function(t){for(var e=o(t),r=e.length;r--;){var i=e[r],u=t[i];e[r]=[i,u,n(u)]}return e}},function(t,e,r){var n=r(25),o=r(106),i=r(112),u=r(17),a=r(32),c=r(33),s=r(11),f=1,l=2;t.exports=function(t,e){return u(t)&&a(e)?c(s(t),e):function(r){var u=o(r,t);return void 0===u&&u===e?i(r,t):n(e,u,f|l)}}},function(t,e,r){var n=r(34);t.exports=function(t,e,r){var o=null==t?void 0:n(t,e);return void 0===o?r:o}},function(t,e,r){var n=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,o=/\\(\\)?/g,i=r(108)(function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(n,function(t,r,n,i){e.push(n?i.replace(o,"$1"):r||t)}),e});t.exports=i},function(t,e,r){var n=r(109),o=500;t.exports=function(t){var e=n(t,function(t){return r.size===o&&r.clear(),t}),r=e.cache;return e}},function(t,e,r){var n=r(13),o="Expected a function";function i(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError(o);var r=function(){var n=arguments,o=e?e.apply(this,n):n[0],i=r.cache;if(i.has(o))return i.get(o);var u=t.apply(this,n);return r.cache=i.set(o,u)||i,u};return r.cache=new(i.Cache||n),r}i.Cache=n,t.exports=i},function(t,e,r){var n=r(111);t.exports=function(t){return null==t?"":n(t)}},function(t,e,r){var n=r(7),o=r(19),i=r(1),u=r(18),a=1/0,c=n?n.prototype:void 0,s=c?c.toString:void 0;t.exports=function t(e){if("string"==typeof e)return e;if(i(e))return o(e,t)+"";if(u(e))return s?s.call(e):"";var r=e+"";return"0"==r&&1/e==-a?"-0":r}},function(t,e,r){var n=r(113),o=r(114);t.exports=function(t,e){return null!=t&&o(t,e,n)}},function(t,e){t.exports=function(t,e){return null!=t&&e in Object(t)}},function(t,e,r){var n=r(35),o=r(27),i=r(1),u=r(30),a=r(15),c=r(11);t.exports=function(t,e,r){for(var s=-1,f=(e=n(e,t)).length,l=!1;++s<f;){var p=c(e[s]);if(!(l=null!=t&&r(t,p)))break;t=t[p]}return l||++s!=f?l:!!(f=null==t?0:t.length)&&a(f)&&u(p,f)&&(i(t)||o(t))}},function(t,e){t.exports=function(t){return t}},function(t,e,r){var n=r(117),o=r(118),i=r(17),u=r(11);t.exports=function(t){return i(t)?n(u(t)):o(t)}},function(t,e){t.exports=function(t){return function(e){return null==e?void 0:e[t]}}},function(t,e,r){var n=r(34);t.exports=function(t){return function(e){return n(e,t)}}},function(t,e,r){var n=r(120),o=r(16);t.exports=function(t,e){var r=-1,i=o(t)?Array(t.length):[];return n(t,function(t,n,o){i[++r]=e(t,n,o)}),i}},function(t,e,r){var n=r(121),o=r(124)(n);t.exports=o},function(t,e,r){var n=r(122),o=r(14);t.exports=function(t,e){return t&&n(t,e,o)}},function(t,e,r){var n=r(123)();t.exports=n},function(t,e){t.exports=function(t){return function(e,r,n){for(var o=-1,i=Object(e),u=n(e),a=u.length;a--;){var c=u[t?a:++o];if(!1===r(i[c],c,i))break}return e}}},function(t,e,r){var n=r(16);t.exports=function(t,e){return function(r,o){if(null==r)return r;if(!n(r))return t(r,o);for(var i=r.length,u=e?i:-1,a=Object(r);(e?u--:++u<i)&&!1!==o(a[u],u,a););return r}}},function(t,e){t.exports=function(t){return void 0===t}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.PCPDatasourceQueryCtrl=void 0;var n=r(127),o=function(){var t=function(e,r){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(e,r)};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}(),i=function(t){function e(e,r){var n=t.call(this,e,r)||this;return n.target.hide=!1,n.target.target=n.target.target||"select metric",n.target.type||(n.target.type="table"===n.panelCtrl.panel.type?"table":"timeseries"),n.target.data=n.target.data||"",n.types=[{text:"Time series",value:"timeseries"},{text:"Table",value:"table"}],n.showJSON=!1,n}return o(e,t),e.$inject=["$scope","$injector"],e.prototype.getOptions=function(t){return this.datasource.metricFindQuery(t||"")},e.prototype.toggleEditorMode=function(){this.target.rawQuery=!this.target.rawQuery},e.prototype.onChangeInternal=function(){this.panelCtrl.refresh()},e.templateUrl="partials/query.editor.html",e}(n.QueryCtrl);e.PCPDatasourceQueryCtrl=i},function(e,r){e.exports=t}])});
//# sourceMappingURL=module.js.map