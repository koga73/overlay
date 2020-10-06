/*
 * Overlay v3.0.0 Copyright (c) 2020 AJ Savino
 * https://github.com/koga73/overlay
 * MIT License
 */
(function() {
	var _class = "Overlay";
	var _classPrefix = _class.toLowerCase() + "-";

	var _events = {
		EVENT_BEFORE_SHOW: "beforeshow",
		EVENT_AFTER_SHOW: "aftershow",
		EVENT_BEFORE_HIDE: "beforehide",
		EVENT_AFTER_HIDE: "afterhide"
	};

	var _consts = {
		CLASS_CONTAINER: _classPrefix + "container",
		CLASS_BACKGROUND: _classPrefix + "background",
		CLASS_FRAME: _classPrefix + "frame",
		CLASS_CLOSE: _classPrefix + "close",
		CLASS_FRAME_VISIBLE: _classPrefix + "visible",
		CLASS_BODY_VISIBLE: _classPrefix + "visible",
		CLASS_CONTENT: _classPrefix + "content",

		DATA_CONTAINER: "data-" + _classPrefix + "container",
		DATA_PAGE_WRAP: "data-" + _classPrefix + "page-wrap",
		DATA_TRIGGER: "data-" + _classPrefix + "trigger",
		DATA_WIDTH: "data-" + _classPrefix + "width",
		DATA_HEIGHT: "data-" + _classPrefix + "height",
		DATA_OFFSET_X: "data-" + _classPrefix + "offset-x",
		DATA_OFFSET_Y: "data-" + _classPrefix + "offset-y",
		DATA_CONTAINER_CLASS: "data-" + _classPrefix + "container-class",
		DATA_USER_CLOSABLE: "data-" + _classPrefix + "user-closable",
		DATA_AUTO_FOCUS: "data-" + _classPrefix + "auto-focus",
		DATA_IMMEDIATE: "data-" + _classPrefix + "immediate",

		FOCUSABLE: "a[href],input,select,textarea,button,[tabindex]",
		DEFAULT_ARIA_LABEL: _class
	};

	//Methods for listening when transition is complete
	var TransitionHelper = (function() {
		var transitionEvent = null;
		var transitionPrefix = null;

		var transitionEvents = [
			["webkitTransition", "webkitTransitionEnd", "-webkit-"],
			["transition", "transitionend", ""]
		];
		var transitionEventsLen = transitionEvents.length;
		for (var i = 0; i < transitionEventsLen; i++) {
			if (typeof document.documentElement.style[transitionEvents[i][0]] !== typeof undefined) {
				break;
			}
		}
		if (i != transitionEventsLen) {
			transitionEvent = transitionEvents[i][1];
			transitionPrefix = transitionEvents[i][2];
		} //else not supported

		return {
			hasTransition: function(element) {
				if (typeof document.documentElement.currentStyle !== typeof undefined) {
					//IE
					return parseFloat(element.currentStyle[transitionPrefix + "transition-duration"]) > 0;
				} else {
					return parseFloat(window.getComputedStyle(element)[transitionPrefix + "transition-duration"]) > 0;
				}
			},
			onTransitionComplete: function(element, callback) {
				if (transitionEvent) {
					EventHelper.addEventListener(element, transitionEvent, callback);
				} else {
					callback();
				}
			},
			offTransitionComplete: function(element, callback) {
				if (transitionEvent) {
					if (typeof callback !== typeof undefined) {
						EventHelper.removeEventListener(element, transitionEvent, callback);
					} else {
						EventHelper.removeEventListener(element, transitionEvent);
					}
				}
			}
		};
	})();

	//Methods for add/remove/has class for IE8
	var ClassHelper = (function() {
		//Trim shim
		if (typeof String.prototype.trim !== "function") {
			String.prototype.trim = function() {
				return this.replace(/^\s+|\s+$/g, "");
			};
		}

		return {
			addClass: function(element, classes) {
				var elementClasses = (element.getAttribute("class") || "").split(" ");
				classes = classes.split(" ");
				for (var className in classes) {
					elementClasses.push(classes[className].trim());
				}
				element.setAttribute("class", elementClasses.join(" ").trim());
			},

			removeClass: function(element, classes) {
				var elementClasses = (element.getAttribute("class") || "").split(" ");
				classes = classes.split(" ");
				for (var className in classes) {
					var elementClassesLen = elementClasses.length;
					for (var i = 0; i < elementClassesLen; i++) {
						if (elementClasses[i] == classes[className].trim()) {
							elementClasses.splice(i, 1);
							elementClassesLen--;
							i--;
						}
					}
				}
				element.setAttribute("class", elementClasses.join(" ").trim());
			},

			hasClass: function(element, classes) {
				var elementClasses = (element.getAttribute("class") || "").split(" ");
				classes = classes.split(" ");
				var hasCount = 0;
				for (var className in classes) {
					var elementClassesLen = elementClasses.length;
					for (var i = 0; i < elementClassesLen; i++) {
						if (elementClasses[i] == classes[className].trim()) {
							hasCount++;
							break;
						}
					}
				}
				if (hasCount == classes.length) {
					return true;
				} else {
					return false;
				}
			}
		};
	})();

	//Cross-browser custom object events supported down to IE8
	//From: https://github.com/koga73/oop
	var EventHelper = (function() {
		var _methods = {
			//Safe cross-browser event (use 'new EventHelper.Event()')
			Event: function(type, detail) {
				var event = null;
				try {
					//IE catch
					event = new CustomEvent(type, {
						detail: detail
					}); //Non-IE
				} catch (ex) {
					if (typeof document !== typeof undefined && document.createEventObject) {
						//IE
						event = document.createEventObject("Event");
						if (event.initCustomEvent) {
							event.initCustomEvent(type, true, true);
						}
					} else {
						//Custom
						event = {};
					}
				}
				event.type = type;
				event.detail = detail;
				return event;
			},

			//Adds event system to object
			addEvents: function(obj, noAlias) {
				noAlias = noAlias === true;
				if (!obj._eventHandlers) {
					obj._eventHandlers = {};
				}
				if (!obj.addEventListener) {
					obj.addEventListener = _methods._addEventListener;
					if (!noAlias) {
						obj.on = _methods._addEventListener; //Alias
					}
				}
				if (!obj.removeEventListener) {
					obj.removeEventListener = _methods._removeEventListener;
					if (!noAlias) {
						obj.off = _methods._removeEventListener; //Alias
					}
				}
				if (!obj.dispatchEvent) {
					obj.dispatchEvent = _methods._dispatchEvent;
					if (!noAlias) {
						obj.trigger = _methods._dispatchEvent; //Alias
						obj.emit = _methods._dispatchEvent; //Alias
					}
				}
				return obj;
			},

			//Removes event system from object
			removeEvents: function(obj, noAlias) {
				noAlias = noAlias === true;
				if (obj._eventHandlers) {
					delete obj._eventHandlers;
				}
				if (obj.addEventListener) {
					delete obj.addEventListener;
					if (!noAlias) {
						delete obj.on; //Alias
					}
				}
				if (obj.removeEventListener) {
					delete obj.removeEventListener;
					if (!noAlias) {
						delete obj.off; //Alias
					}
				}
				if (obj.dispatchEvent) {
					delete obj.dispatchEvent;
					if (!noAlias) {
						delete obj.trigger; //Alias
						delete obj.emit; //Alias
					}
				}
				return obj;
			},

			//Safe cross-browser way to listen for one or more events
			//Pass obj, comma or whitespace delimeted event types, and a handler
			addEventListener: function(obj, types, handler) {
				//For some reason IE8 in compatibility mode calls addEventListener
				if (typeof obj === typeof "") {
					return;
				}
				if (!obj._eventHandlers) {
					obj._eventHandlers = {};
				}
				types = types.split(/,|\s/);
				var typesLen = types.length;
				for (var i = 0; i < typesLen; i++) {
					var type = types[i];
					if (obj.addEventListener) {
						//Standard
						handler = _methods._addEventHandler(obj, type, handler);
						obj.addEventListener(type, handler);
					} else if (obj.attachEvent) {
						//IE
						var attachHandler = function() {
							handler(window.event);
						};
						attachHandler.handler = handler; //Store reference to original handler
						attachHandler = _methods._addEventHandler(obj, type, attachHandler);
						obj.attachEvent("on" + type, attachHandler);
					} else if (typeof jQuery !== typeof undefined) {
						//jQuery
						handler = _methods._addEventHandler(obj, type, handler);
						jQuery.on(type, handler);
					} else {
						//Custom
						obj.addEventListener = _methods._addEventListener;
						obj.addEventListener(type, handler);
					}
				}
			},

			//This is the custom method that gets added to objects
			_addEventListener: function(type, handler) {
				handler._isCustom = true;
				_methods._addEventHandler(this, type, handler);
			},

			//Stores and returns handler reference
			_addEventHandler: function(obj, type, eventHandler) {
				if (!obj._eventHandlers[type]) {
					obj._eventHandlers[type] = [];
				}
				var eventHandlers = obj._eventHandlers[type];
				var eventHandlersLen = eventHandlers.length;
				for (var i = 0; i < eventHandlersLen; i++) {
					if (eventHandlers[i] === eventHandler) {
						return eventHandler;
					} else if (eventHandlers[i].handler && eventHandlers[i].handler === eventHandler) {
						return eventHandlers[i];
					}
				}
				eventHandlers.push(eventHandler);
				return eventHandler;
			},

			//Safe cross-browser way to listen for one or more events
			//Pass obj, comma or whitespace delimeted event types, and optionally handler
			//If no handler is passed all handlers for each event type will be removed
			removeEventListener: function(obj, types, handler) {
				//For some reason IE8 in compatibility mode calls addEventListener
				if (typeof obj === typeof "") {
					return;
				}
				if (!obj._eventHandlers) {
					obj._eventHandlers = {};
				}
				types = types.split(/,|\s/);
				var typesLen = types.length;
				for (var i = 0; i < typesLen; i++) {
					var type = types[i];
					var handlers;
					if (typeof handler === typeof undefined) {
						handlers = obj._eventHandlers[type] || [];
					} else {
						handlers = [handler];
					}
					var handlersLen = handlers.length;
					for (var j = 0; j < handlersLen; j++) {
						var handler = handlers[j];
						if (obj.removeEventListener) {
							//Standard
							handler = _methods._removeEventHandler(obj, type, handler);
							obj.removeEventListener(type, handler);
						} else if (obj.detachEvent) {
							//IE
							handler = _methods._removeEventHandler(obj, type, handler);
							obj.detachEvent("on" + type, handler);
						} else if (typeof jQuery !== typeof undefined) {
							//jQuery
							handler = _methods._removeEventHandler(obj, type, handler);
							jQuery.off(type, handler);
						} else {
							//Custom
							obj.removeEventListener = _methods._removeEventListener;
							obj.removeEventListener(type, handler);
						}
					}
				}
			},

			//This is the custom method that gets added to objects
			//Pass comma or whitespace delimeted event types, and optionally handler
			//If no handler is passed all handlers for each event type will be removed
			_removeEventListener: function(types, handler) {
				types = types.split(/,|\s/);
				var typesLen = types.length;
				for (var i = 0; i < typesLen; i++) {
					var type = types[i];
					var handlers;
					if (typeof handler === typeof undefined) {
						handlers = this._eventHandlers[type] || [];
					} else {
						handlers = [handler];
					}
					var handlersLen = handlers.length;
					for (var j = 0; j < handlersLen; j++) {
						var handler = handlers[j];
						handler._isCustom = false;
						_methods._removeEventHandler(this, type, handler);
					}
				}
			},

			//Removes and returns handler reference
			_removeEventHandler: function(obj, type, eventHandler) {
				if (!obj._eventHandlers[type]) {
					obj._eventHandlers[type] = [];
				}
				var eventHandlers = obj._eventHandlers[type];
				var eventHandlersLen = eventHandlers.length;
				for (var i = 0; i < eventHandlersLen; i++) {
					if (eventHandlers[i] === eventHandler) {
						return eventHandlers.splice(i, 1)[0];
					} else if (eventHandlers[i].handler && eventHandlers[i].handler === eventHandler) {
						return eventHandlers.splice(i, 1)[0];
					}
				}
			},

			//Safe cross-browser way to dispatch an event
			dispatchEvent: function(obj, event) {
				if (!obj._eventHandlers) {
					obj._eventHandlers = {};
				}
				if (obj.dispatchEvent) {
					//Standard
					obj.dispatchEvent(event);
				} else if (obj.fireEvent) {
					//IE
					obj.fireEvent("on" + type, event);
				} else if (typeof jQuery !== typeof undefined) {
					jQuery(obj).trigger(
						jQuery.Event(event.type, {
							type: event.type,
							data: event.detail
						})
					);
				} else {
					//Custom
					obj.dispatchEvent = _methods._dispatchEvent;
					obj.dispatchEvent(event);
				}
			},

			//This is the custom method that gets added to objects
			_dispatchEvent: function(event) {
				_methods._dispatchEventHandlers(this, event);
			},

			//Dispatches an event to handler references
			_dispatchEventHandlers: function(obj, event) {
				var eventHandlers = obj._eventHandlers[event.type];
				if (!eventHandlers) {
					return;
				}
				var eventHandlersLen = eventHandlers.length;
				for (var i = 0; i < eventHandlersLen; i++) {
					eventHandlers[i](event, event.detail);
				}
			}
		};

		return {
			Event: _methods.Event,

			addEvents: _methods.addEvents,
			removeEvents: _methods.removeEvents,

			addEventListener: _methods.addEventListener,
			removeEventListener: _methods.removeEventListener,
			dispatchEvent: _methods.dispatchEvent
		};
	})();

	//With multiple instances only the top-most gets focus/key events!
	var _static = {
		_singleton: null,
		_focusin_handlerStack: [],
		_keyup_handlerStack: [],

		_init: function() {
			//Create singleton and expose methods statically on class
			var singleton = new window[_class]();
			singleton.init();
			for (var prop in singleton) {
				window[_class][prop] = singleton[prop];
			}
			_static._singleton = singleton;
		},
		_destory: function() {
			if (_static._singleton) {
				_static._singleton.destroy();
			}
			_static._singleton = null;
		},

		//Map back options set on static class to singleton
		_update: function() {
			if (_static._singleton){
				_static._singleton.classPrefix = window[_class].classPrefix;
				_static._singleton.container = window[_class].container;
				_static._singleton.pageWrap = window[_class].pageWrap;
				_static._singleton.requestCloseCallback = window[_class].requestCloseCallback;
			}
		},

		_addFocusin: function(method) {
			var focusinStack = _static._focusin_handlerStack;
			var previousStackLen = focusinStack.length;
			focusinStack.push(method);

			//Add listener first time we get a method in the stack
			if (!previousStackLen) {
				EventHelper.addEventListener(document, "focusin", _static._handler_document_focusin);
			}
		},
		_removeFocusin: function(method) {
			var focusinStack = _static._focusin_handlerStack;
			var focusinStackLen = focusinStack.length;
			for (var i = 0; i < focusinStackLen; i++) {
				if (focusinStack[i] === method) {
					focusinStack.splice(i, 1);
					break;
				}
			}

			//Remove listener if stack is empty
			if (!focusinStack.length) {
				EventHelper.removeEventListener(document, "focusin", _static._handler_document_focusin);
			}
		},
		_handler_document_focusin: function(evt) {
			var focusinStack = _static._focusin_handlerStack;
			var focusinStackLen = focusinStack.length;
			if (focusinStackLen) {
				focusinStack[focusinStackLen - 1].call(this, evt);
			}
		},

		_addKeyup: function(method) {
			var keyupStack = _static._keyup_handlerStack;
			var previousStackLen = keyupStack.length;
			keyupStack.push(method);

			//Add listener first time we get a method in the stack
			if (!previousStackLen) {
				EventHelper.addEventListener(document, "keyup", _static._handler_document_keyup);
			}
		},
		_removeKeyup: function(method) {
			var keyupStack = _static._keyup_handlerStack;
			var keyupStackLen = keyupStack.length;
			for (var i = 0; i < keyupStackLen; i++) {
				if (keyupStack[i] === method) {
					keyupStack.splice(i, 1);
					break;
				}
			}

			//Remove listener if stack is empty
			if (!keyupStack.length) {
				EventHelper.removeEventListener(document, "keyup", _static._handler_document_keyup);
			}
		},
		_handler_document_keyup: function(evt) {
			var keyupStack = _static._keyup_handlerStack;
			var keyupStackLen = keyupStack.length;
			if (keyupStackLen) {
				keyupStack[keyupStackLen - 1].call(this, evt);
			}
		}
	};

	//Instance!
	window[_class] = function() {
		var _instance;

		var _vars = {
			classPrefix:null,
			container: null,
			pageWrap: null,
			requestCloseCallback: null,

			_initialized: false,

			_scopeElement: null,
			_container: null,
			_background: null,
			_content: null,
			_frame: null,
			_close: null,

			_showCallback: null,
			_hideCallback: null,

			_lastFocus: null,
			_immediate: false
		};

		var _methods = {
			//Create our DOM elements
			init: function(scopeElement) {
				if (typeof scopeElement === typeof undefined) {
					scopeElement = document.body || null;
				}
				_static._update();

				//Container
				var container = document.createElement("div");
				var classContainer = _instance.classPrefix ? _consts.CLASS_CONTAINER.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_CONTAINER;
				container.setAttribute("class", classContainer);
				_vars._container = container;

				//Background
				var background = document.createElement("div");
				var classBackground = _instance.classPrefix ? _consts.CLASS_BACKGROUND.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_BACKGROUND;
				background.setAttribute("class", classBackground);
				_vars._background = background;

				//Frame
				var frame = document.createElement("div");
				var classFrame = _instance.classPrefix ? _consts.CLASS_FRAME.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_FRAME;
				frame.setAttribute("class", classFrame);
				_vars._frame = frame;

				//Close
				var close = document.createElement("button");
				var classClose = _instance.classPrefix ? _consts.CLASS_CLOSE.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_CLOSE;
				close.setAttribute("class", classClose);
				close.setAttribute("type", "button");
				close.innerHTML = "Close";
				_vars._close = close;

				//Append
				frame.appendChild(close);
				container.appendChild(background);
				container.appendChild(frame);

				//Add event methods
				EventHelper.addEvents(_instance);

				//Auto-wire container, page wrap, triggers based on data attributes
				if (scopeElement) {
					var container = scopeElement.querySelector("[" + _consts.DATA_CONTAINER + "]");
					if (container) {
						_instance.container = container;
					}
					var pageWrap = scopeElement.querySelector("[" + _consts.DATA_PAGE_WRAP + "]");
					if (pageWrap) {
						_instance.pageWrap = pageWrap;
					}

					var anchorTriggers = scopeElement.querySelectorAll("[" + _consts.DATA_TRIGGER + "]");
					var anchorTriggersLen = anchorTriggers.length;
					for (var i = 0; i < anchorTriggersLen; i++) {
						_instance.addTrigger(anchorTriggers[i]);
					}
				}
				_vars._scopeElement = scopeElement;

				//Complete!
				_vars._initialized = true;
			},

			//Remove our DOM elements
			destroy: function() {
				_vars._initialized = false;

				//Remove document events
				_static._removeFocusin(_methods._handler_document_focusin);
				_static._removeKeyup(_methods._handler_document_keyup);

				//Unwire triggers
				var scopeElement = _vars._scopeElement;
				if (scopeElement) {
					var anchorTriggers = scopeElement.querySelectorAll("[" + _consts.DATA_TRIGGER + "]");
					var anchorTriggersLen = anchorTriggers.length;
					for (var i = 0; i < anchorTriggersLen; i++) {
						_instance.removeTrigger(anchorTriggers[i]);
					}
				}
				_vars._scopeElement = null;

				//Restore state
				var classBodyVisible = _instance.classPrefix ? _consts.CLASS_BODY_VISIBLE.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_BODY_VISIBLE;
				ClassHelper.removeClass(document.body, classBodyVisible);
				_methods._focusRestore();
				_methods._resetContent();
				_vars._showCallback = null;
				_vars._hideCallback = null;
				_vars._lastFocus = false;
				_vars._immediate = false;

				//Remove event methods
				EventHelper.removeEvents(_instance);

				//Close
				var close = _vars._close;
				if (close) {
					EventHelper.removeEventListener(close, "click", _methods._handler_close_click);
					close.removeAttribute("disabled");
				}
				_vars._close = null;

				//Frame
				_vars._frame = null;

				//Background
				var background = _vars._background;
				if (background) {
					EventHelper.removeEventListener(background, "click", _methods._handler_background_click);
				}
				_vars._background = null;

				//Container
				var container = _vars._container;
				if (container) {
					container.setAttribute("class", "");
					if (container.parentNode) {
						container.parentNode.removeChild(container);
					}
				}
				_vars._container = null;
			},

			//Make element trigger show
			addTrigger: function(element, targetId) {
				targetId = targetId || null;
				if (!targetId) {
					//Grab target from _consts.DATA_TRIGGER or href
					var dataTargetId = element.getAttribute(_consts.DATA_TRIGGER);
					if (dataTargetId.length) {
						targetId = element.getAttribute(_consts.DATA_TRIGGER);
					} else if (element.hasAttribute("href")) {
						targetId = element.getAttribute("href");
					} else {
						throw new Error("Trigger must have " + _consts.DATA_TRIGGER + " or href");
					}
				}
				//Add event listener
				EventHelper.addEventListener(element, "click", function(evt) {
					if (typeof evt.preventDefault !== typeof undefined) {
						evt.preventDefault();
					} else {
						evt.returnValue = false;
					}
					_instance.show(targetId);
					return false;
				});
			},

			//Remove element triggering show
			removeTrigger: function(element) {
				EventHelper.removeEventListener(element, "click");
			},

			//Show an id or DOM element
			show: function(content, options, callback) {
				if (!_vars._initialized) {
					throw new Error(_class + " is not initialized. To fix call init()");
				}
				_static._update();

				//If string then grab from DOM otherwise it is a dynamic element passed in
				var isStatic = typeof content === typeof "";
				//Remove # if present
				if (isStatic && content.indexOf("#") != -1) {
					content = content.replace(/.*#/, "");
				}
				if (typeof options == typeof undefined) {
					options = {};
				}
				_vars._showCallback = callback;
				var classBodyVisible = _instance.classPrefix ? _consts.CLASS_BODY_VISIBLE.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_BODY_VISIBLE;
				ClassHelper.addClass(document.body, classBodyVisible);
				EventHelper.dispatchEvent(_instance, new EventHelper.Event(_instance.EVENT_BEFORE_SHOW, {content: content.id || content}));

				//Hide current
				if (_vars._content != null) {
					_instance.hide(function() {
						//Callback chaining
						_instance.show(content, options, callback);
					});
					return;
				}

				//Parse parameters. Method parameters take priority over data attributes on content
				var content = isStatic ? document.getElementById(content) : content;
				if (!content) {
					throw new Error("Invalid content");
				}
				var width, height, offsetX, offsetY;
				var containerClass = "";
				var userClosable = true;
				var autoFocus = false;
				var immediate = false;
				if (typeof options.width !== typeof undefined) {
					width = options.width;
				} else {
					var dataWidth = content.getAttribute(_consts.DATA_WIDTH);
					if (dataWidth && dataWidth.length) {
						width = dataWidth;
					}
				}
				if (typeof options.height !== typeof undefined) {
					height = options.height;
				} else {
					var dataHeight = content.getAttribute(_consts.DATA_HEIGHT);
					if (dataHeight && dataHeight.length) {
						height = dataHeight;
					}
				}
				if (typeof options.offsetX !== typeof undefined) {
					offsetX = options.offsetX;
				} else {
					var dataOffsetX = content.getAttribute(_consts.DATA_OFFSET_X);
					if (dataOffsetX && dataOffsetX.length) {
						offsetX = dataOffsetX;
					}
				}
				if (typeof options.offsetY !== typeof undefined) {
					offsetY = options.offsetY;
				} else {
					var dataOffsetY = content.getAttribute(_consts.DATA_OFFSET_Y);
					if (dataOffsetY && dataOffsetY.length) {
						offsetY = dataOffsetY;
					}
				}
				if (typeof options.containerClass !== typeof undefined) {
					containerClass = options.containerClass;
				} else {
					var dataContainerClass = content.getAttribute(_consts.DATA_CONTAINER_CLASS);
					if (dataContainerClass && dataContainerClass.length) {
						containerClass = dataContainerClass;
					}
				}
				if (typeof options.userClosable !== typeof undefined) {
					userClosable = options.userClosable === true;
				} else if (content.hasAttribute(_consts.DATA_USER_CLOSABLE)) {
					var dataUserClosable = content.getAttribute(_consts.DATA_USER_CLOSABLE) || "true";
					userClosable = dataUserClosable.toLowerCase() !== "false";
				}
				if (typeof options.autoFocus !== typeof undefined) {
					autoFocus = options.autoFocus === true;
				} else if (content.hasAttribute(_consts.DATA_AUTO_FOCUS)) {
					var dataAutoFocus = content.getAttribute(_consts.DATA_AUTO_FOCUS) || "true";
					autoFocus = dataAutoFocus.toLowerCase() !== "false";
				}
				if (typeof options.immediate !== typeof undefined) {
					immediate = options.immediate === true;
				} else if (content.hasAttribute(_consts.DATA_IMMEDIATE)) {
					var dataImmediate = content.getAttribute(_consts.DATA_IMMEDIATE) || "true";
					immediate = dataImmediate && dataImmediate.toLowerCase() !== "false";
				}

				//Cache
				var container = _vars._container;
				var background = _vars._background;
				var frame = _vars._frame;
				var close = _vars._close;

				//Set content attributes
				var classContent = _instance.classPrefix ? _consts.CLASS_CONTENT.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_CONTENT;
				ClassHelper.addClass(content, classContent);
				content.setAttribute("tabindex", "0");
				//Add aria-label if missing
				if (!content.hasAttribute("aria-label") && !content.hasAttribute("aria-labelled-by")) {
					content.setAttribute("aria-label", _consts.DEFAULT_ARIA_LABEL);
				}

				//Set frame dimensions to content dimensions and apply parameter overrides
				content["_" + _classPrefix + "data"] = content["_" + _classPrefix + "data"] || {};
				if (typeof width === typeof undefined) {
					if (typeof document.documentElement.currentStyle !== typeof undefined) {
						//IE
						width = content.currentStyle.width;
					} else {
						width = window.getComputedStyle(content).width;
					}
				}
				if (parseInt(width)) {
					frame.style.width = width;
					content["_" + _classPrefix + "data"].width = width;
					content.style.width = "100%";
				} else {
					frame.style.width = "";
				}
				if (typeof height === typeof undefined) {
					if (typeof document.documentElement.currentStyle !== typeof undefined) {
						//IE
						height = content.currentStyle.height;
					} else {
						height = window.getComputedStyle(content).height;
					}
				}
				if (parseInt(height)) {
					frame.style.height = height;
					content["_" + _classPrefix + "data"].height = height;
					content.style.height = "100%";
				} else {
					frame.style.height = "";
				}
				if (typeof offsetX !== typeof undefined) {
					frame.style.left = offsetX;
				} else {
					frame.style.left = "";
				}
				if (typeof offsetY !== typeof undefined) {
					frame.style.top = offsetY;
				} else {
					frame.style.top = "";
				}
				_vars._content = content;

				//Wire events
				if (userClosable) {
					_static._addKeyup(_methods._handler_document_keyup);
					EventHelper.addEventListener(background, "click", _methods._handler_background_click);
					EventHelper.addEventListener(close, "click", _methods._handler_close_click);
				} else {
					close.setAttribute("disabled", "disabled");
				}

				//Append content
				content["_" + _classPrefix + "data"].parent = content.parentNode;
				if (isStatic) {
					content.parentNode.removeChild(content);
				}
				frame.insertBefore(content, close);

				//Append container
				if (!_instance.container) {
					if (document.body) {
						_instance.container = document.body;
					} else {
						throw new Error("Container is undefined");
					}
				}
				var appendContainer = _instance.container;
				if (_instance.container.length) {
					appendContainer = _instance.container[0];
				}
				appendContainer.appendChild(container);

				//Accessibility focus trap
				_methods._focusTrap(appendContainer, content, autoFocus);

				//Add containerClass
				ClassHelper.addClass(container, containerClass);
				var timeout = setTimeout(function() {
					//Delay needed for transition to render
					clearTimeout(timeout);
					var classFrameVisible = _instance.classPrefix ? _consts.CLASS_FRAME_VISIBLE.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_FRAME_VISIBLE;
					ClassHelper.addClass(container, classFrameVisible);
				}, 50);

				//Wait for transition before completing show
				_vars._immediate = immediate;
				if (immediate) {
					_methods._handler_show_complete();
				} else if (TransitionHelper.hasTransition(background) || TransitionHelper.hasTransition(frame)) {
					TransitionHelper.offTransitionComplete(container);
					TransitionHelper.onTransitionComplete(container, _methods._handler_show_complete);
				} else {
					_methods._handler_show_complete();
				}
			},

			//Hide what is currently shown
			hide: function(callback) {
				if (!_vars._initialized) {
					throw new Error(_class + " is not initialized. To fix call init()");
				}
				_vars._hideCallback = callback;

				var content = _vars._content;
				EventHelper.dispatchEvent(_instance, new EventHelper.Event(_instance.EVENT_BEFORE_HIDE, {content: content.id || content}));

				//Remove document events
				_static._removeFocusin(_methods._handler_document_focusin);
				_static._removeKeyup(_methods._handler_document_keyup);

				var close = _vars._close;
				if (close) {
					EventHelper.removeEventListener(close, "click", _methods._handler_close_click);
					close.removeAttribute("disabled");
				}
				var background = _vars._background;
				if (background) {
					EventHelper.removeEventListener(background, "click", _methods._handler_background_click);
				}

				//Wait for transition before completing hide
				var frame = _vars._frame;
				var container = _vars._container;
				if (container) {
					if (_vars._immediate) {
						_methods._handler_hide_complete();
					} else if (TransitionHelper.hasTransition(background) || TransitionHelper.hasTransition(frame)) {
						TransitionHelper.offTransitionComplete(container);
						TransitionHelper.onTransitionComplete(container, _methods._handler_hide_complete);
					} else {
						_methods._handler_hide_complete();
					}
					var classFrameVisible = _instance.classPrefix ? _consts.CLASS_FRAME_VISIBLE.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_FRAME_VISIBLE;
					ClassHelper.removeClass(container, classFrameVisible);
				}
			},

			//Save focus, accessibility focus trap, set focus to first focusable item
			_focusTrap: function(appendContainer, content, autoFocus) {
				autoFocus = autoFocus === true;

				//Events
				_static._addFocusin(_methods._handler_document_focusin);

				//Store last focus
				_vars._lastFocus = document.activeElement;

				//Prevent pageWrap from gaining focus
				var pageWrap = _instance.pageWrap;
				if (pageWrap) {
					if (pageWrap.contains(appendContainer)) {
						throw "Error: The page wrapper [" + _consts.DATA_PAGE_WRAP + "] should not contain the container. They should be siblings instead.";
					} else {
						pageWrap.setAttribute("aria-hidden", "true");
						pageWrap.setAttribute("tabindex", "-1");
					}
				}

				//Auto-focus
				var focusable = autoFocus ? content.querySelector(_consts.FOCUSABLE) : null;
				if (!focusable) {
					focusable = content;
				}
				focusable.focus();
			},

			//Remove accessibility focus trap and restore focus
			_focusRestore: function() {
				//Events
				_static._removeFocusin(_methods._handler_document_focusin);

				//Restore pageWrap to be able to gain focus
				var pageWrap = _instance.pageWrap;
				if (pageWrap) {
					pageWrap.removeAttribute("aria-hidden", "true");
					pageWrap.removeAttribute("tabindex", "-1");
				}

				//Restore last focus
				var lastFocus = _vars._lastFocus;
				if (lastFocus) {
					lastFocus.focus();
				}
				_vars._lastFocus = null;
			},

			//Put the content back where it used to be after hiding
			_resetContent: function() {
				var content = _vars._content;
				if (content) {
					content.parentNode.removeChild(content);

					var data = content["_" + _classPrefix + "data"];
					if (typeof data.width !== typeof undefined) {
						content.style.width = ""; //data.width;
					}
					if (typeof data.height !== typeof undefined) {
						content.style.height = ""; //data.height;
					}
					if (typeof data.parent !== typeof undefined) {
						if (data.parent) {
							data.parent.appendChild(content);
						}
					}
					data = null;

					content.removeAttribute("tabindex");
					var classContent = _instance.classPrefix ? _consts.CLASS_CONTENT.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_CONTENT;
					ClassHelper.removeClass(content, classContent);
				}
				_vars._content = null;
			},

			//Called when show transition is complete
			_handler_show_complete: function() {
				TransitionHelper.offTransitionComplete(_vars._container);

				var content = _vars._content;
				EventHelper.dispatchEvent(_instance, new EventHelper.Event(_instance.EVENT_AFTER_SHOW, {content: content.id || content}));
				var showCallback = _vars._showCallback;
				if (typeof showCallback !== typeof undefined) {
					showCallback();
					_vars._showCallback = null;
				}
			},

			//Called when hide transition is complete
			_handler_hide_complete: function() {
				var container = _vars._container;
				TransitionHelper.offTransitionComplete(container);

				//Reset content
				var content = _vars._content;
				_methods._resetContent();

				//Remove container
				var classContainer = _instance.classPrefix ? _consts.CLASS_CONTAINER.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_CONTAINER;
				container.setAttribute("class", classContainer);
				container.parentNode.removeChild(container);

				//Restore focus
				_methods._focusRestore();

				var classBodyVisible = _instance.classPrefix ? _consts.CLASS_BODY_VISIBLE.replace(_classPrefix, _instance.classPrefix) : _consts.CLASS_BODY_VISIBLE;
				ClassHelper.removeClass(document.body, classBodyVisible);
				EventHelper.dispatchEvent(_instance, new EventHelper.Event(_instance.EVENT_AFTER_HIDE, {content: content.id || content}));
				var hideCallback = _vars._hideCallback;
				if (typeof hideCallback !== typeof undefined) {
					hideCallback();
					_vars._hideCallback = null;
				}
			},

			//On click close button
			_handler_close_click: function(evt) {
				if (typeof evt.preventDefault !== typeof undefined) {
					evt.preventDefault();
				} else {
					evt.returnValue = false;
				}
				_methods._requestClose();
				return false;
			},

			//On click background
			_handler_background_click: function(evt) {
				if (typeof evt.preventDefault !== typeof undefined) {
					evt.preventDefault();
				} else {
					evt.returnValue = false;
				}
				_methods._requestClose();
				return false;
			},

			//On escape key
			_handler_document_keyup: function(evt) {
				//Escape
				if (evt.keyCode == 27) {
					_methods._requestClose();
				}
			},

			//The user has requested closing, notify our callback if present
			_requestClose: function() {
				if (_instance.requestCloseCallback) {
					var content = _vars._content;
					var result = _instance.requestCloseCallback(content.id || content);
					if (result !== false && result !== 0) {
						_instance.hide();
					}
				} else {
					_instance.hide();
				}
			},

			//When an element gets focus, make sure we trap to currently shown
			_handler_document_focusin: function(evt) {
				var target = evt.target || evt.srcElement;
				var frame = _vars._frame;
				if (target != frame && !frame.contains(target)) {
					if (typeof evt.stopPropagation !== typeof undefined) {
						evt.stopPropagation();
					} else {
						evt.cancelBubble = true;
					}
					var content = _vars._content;
					if (content) {
						content.focus();
					}
				}
			}
		};

		_instance = {
			EVENT_BEFORE_SHOW: _events.EVENT_BEFORE_SHOW,
			EVENT_AFTER_SHOW: _events.EVENT_AFTER_SHOW,
			EVENT_BEFORE_HIDE: _events.EVENT_BEFORE_HIDE,
			EVENT_AFTER_HIDE: _events.EVENT_AFTER_HIDE,

			container: _vars.container,
			pageWrap: _vars.pageWrap,
			requestCloseCallback: _vars.requestCloseCallback,

			init: _methods.init,
			destroy: _methods.destroy,
			addTrigger: _methods.addTrigger,
			removeTrigger: _methods.removeTrigger,
			hide: _methods.hide,
			show: _methods.show
		};
		return _instance;
	};

	_static._init();
})();
