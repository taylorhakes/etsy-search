!function() {
	"use strict";
	function a(a) {
		if (!a.apiKey)throw new Error("apiKey is required");
		this._apiKey = a.apiKey, this._apiUrl = a.apiUrl ? a.apiUrl : c
	}

	var b = 0, c = "https://openapi.etsy.com/v2/";
	a.prototype = {get: function(a) {
		this._requestJsonp(a)
	}, _requestJsonp: function(a) {
		var c, d, e = a.callbackName || "etsyJsonp" + ++b, f = document.createElement("script"), g = window[e], h = this, i = function(b,
																																	   j) {
			clearTimeout(c), h._removeScriptEvents(f, i);
			var k = null;
			"error" === b.type && (k = "error"), h._executeCallbacks(d, j || k, a), window[e] = g, d && "function" == typeof g && g(d[0]), g = d = void 0
		};
		this._addScriptEvents(f, i), window[e] = function() {
			d = arguments[0]
		};
		var j = a.path.replace(/^\//, "");
		j.match(/\.js$/i) || (j += ".js");
		var k = {};
		if (a.params)for (var l in a.params)a.params.hasOwnProperty(l) && (k[l] = a.params[l]);
		var m = j.match(/:[a-zA-Z_]+/g);
		if (m)for (var n = 0; n < m.length; n++) {
			var o = m[n].replace(/^:/, ""), p = k[o];
			delete k[o], j = j.replace(new RegExp(m[n], "gi"), p)
		}
		k.api_key = this._apiKey, k.callback = e, a.disableCaching !== !0 && (k.___ = this._createRandomString(10)), f.src = this._apiUrl + j + this._objectToQueryString(k), (document.head || document.documentElement).appendChild(f), a.timeout > 0 && (c = setTimeout(function() {
			i({type: "error"}, "timeout")
		}, a.timeout || 5e3))
	}, _executeCallbacks: function(a, b, c) {
		if ("object" == typeof a && a.ok === !0)"function" == typeof c.success && c.success({response: a}); else if ("function" == typeof c.error) {
			var d = "";
			d = "object" == typeof a && a.error ? a.error : null == b ? "Unknown error" : b, c.error({error: d})
		}
		"function" == typeof c.done && c.done()
	}, _objectToQueryString: function(a) {
		var b = [];
		for (var c in a)if (a.hasOwnProperty(c)) {
			var d = a[c], e = encodeURIComponent(c);
			(d || 0 === d) && (e += "=" + encodeURIComponent(d)), b.push(e)
		}
		return"?" + b.join("&")
	}, _createRandomString: function(a) {
		for (var b = "", c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", d = 0; a > d;
			 d++)b += c.charAt(Math.floor(Math.random() * c.length));
		return b
	}, _addScriptEvents: function(a, b) {
		a.addEventListener ? (a.addEventListener("load", b), a.addEventListener("error", b)) : a.detachEvent ? (a.detachEvent("load", b), a.detachEvent("error", b)) : (a.onload = void 0, a.onerror = void 0)
	}, _removeScriptEvents: function(a, b) {
		a.removeEventListener ? (a.removeEventListener("load", b), a.removeEventListener("error", b)) : a.attachEvent ? (a.attachEvent("load", b), a.attachEvent("error", b)) : (a.onload = b, a.onerror = b)
	}}, "function" == typeof define && define.amd ? define(a) : window.EtsyJsonp = a
}();