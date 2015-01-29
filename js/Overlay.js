/*
* Overlay v1.0.0 Copyright (c) 2015 AJ Savino
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
var Overlay = {
	hiddenContainer:null,
	container:null,
	background:null,
	content:null,
	frame:null,
	close:null,
	
	onBeforeShow:null,
	onAfterShow:null,
	onBeforeHide:null,
	onAfterHide:null,
	
	initialize:function(hiddenContainerID){
		var hiddenContainer = $("#" + hiddenContainerID);
		hiddenContainer.hide();
		Overlay.hiddenContainer = hiddenContainer;
		
		Overlay.container = $("<div id='overlayContainer'></div>");
		Overlay.background = $("<div id='overlayBackground'></div>");
		Overlay.frame = $("<div id='overlayFrame'></div>");
		Overlay.close = $("<a id='btnClose' href='#close'></a>");
		
		Overlay.frame.append(Overlay.close);
		Overlay.container.append(Overlay.background);
		Overlay.container.append(Overlay.frame);
	},
	
	destroy:function(){
		Overlay.hiddenContainer = null;
		
		var close = Overlay.close;
		if (close){
			close.off("click", Overlay.handler_close_clicked);
			close.remove();
		}
		Overlay.close = null;
		
		var content = Overlay.content;
		if (content){
			content.css("width", content.data("width"));
			content.css("height", content.data("height"));
			content.remove();
			hiddenContainer.append(content);
		}
		Overlay.content = null;
		
		var frame = Overlay.frame;
		if (frame){
			frame.css("margin-top", "");
			frame.css("margin-left", "");
			frame.css("width", "");
			frame.css("height", "");
			frame.remove();
		}
		Overlay.frame = null;
		
		var background = Overlay.background;
		if (background){
			background.off("click", Overlay.handler_background_click);
			background.remove();
		}
		Overlay.background = null;
		
		var container = Overlay.container;
		if (container){
			container.remove();
		}
		Overlay.container = null;
		
		Overlay.onBeforeShow = null;
		Overlay.onAfterShow = null;
		Overlay.onBeforeHide = null;
		Overlay.onAfterHide = null;
	},
	
	show:function(contentID, options){
		if (Overlay.content != null){
			Overlay.hide();
		}
		if (Overlay.onBeforeShow){
			Overlay.onBeforeShow();
		}
		
		var width, height, offsetX, offsetY;
		if (typeof options !== typeof undefined){
			if (typeof options.width !== typeof undefined){
				width = options.width;
			}
			if (typeof options.height !== typeof undefined){
				height = options.height;
			}
			if (typeof options.offsetX !== typeof undefined){
				offsetX = options.offsetX;
			}
			if (typeof options.offsetY !== typeof undefined){
				offsetY = options.offsetY;
			}
		}
		
		var hiddenContainer = Overlay.hiddenContainer;
		var container = Overlay.container;
		var background = Overlay.background;
		var frame = Overlay.frame;
		var close = Overlay.close;
		var content = $("#" + contentID);
		
		if (typeof width === typeof undefined){
			if (typeof document.documentElement.currentStyle !== typeof undefined){ //IE
				width = content[0].currentStyle.width;
			} else {
				width = content.css("width");
			}
		}
		if (parseInt(width)){
			frame.css("width", width);
			content.data("width", width);
			content.css("width", "100%");
		}
		if (typeof height === typeof undefined){
			if (typeof document.documentElement.currentStyle !== typeof undefined){ //IE
				height = content[0].currentStyle.height;
			} else {
				height = content.css("height");
			}
		}
		if (parseInt(height)){
			frame.css("height", height);
			content.data("height", height);
			content.css("height", "100%");
		}
		if (typeof offsetX !== typeof undefined){
			frame.css("left", offsetX);
		}
		if (typeof offsetY !== typeof undefined){
			frame.css("top", offsetY);
		}
		
		Overlay.content = content;
		background.on("click", Overlay.handler_background_click);
		close.on("click", Overlay.handler_close_clicked);
		
		frame.append(content);
		$("body").append(container);
		
		if (Overlay.onAfterShow){
			Overlay.onAfterShow();
		}
	},
	
	hide:function(ignoreCallbacks){
		if (Overlay.onBeforeHide && ignoreCallbacks !== true){
			Overlay.onBeforeHide();
		}
		var hiddenContainer = Overlay.hiddenContainer;
		
		var close = Overlay.close;
		if (close){
			close.off("click", Overlay.handler_close_clicked);
		}
		
		var frame = Overlay.frame;
		if (frame){
			frame.css("margin-top", "");
			frame.css("margin-left", "");
			frame.css("width", "");
			frame.css("height", "");
		}
		
		var content = Overlay.content;
		if (content){
			content.css("width", content.data("width"));
			content.css("height", content.data("height"));
			content.remove();
			hiddenContainer.append(content);
		}
		Overlay.content = null;
		
		var background = Overlay.background;
		if (background){
			background.off("click", Overlay.handler_background_click);
		}
		
		var container = Overlay.container;
		if (container){
			container.remove();
		}
		
		if (Overlay.onAfterHide && ignoreCallbacks !== true){
			Overlay.onAfterHide();
		}
	},
	
	handler_close_clicked:function(evt){
		evt.stopImmediatePropagation();
		Overlay.hide();
		return false;
	},
	
	handler_background_click:function(evt){
		evt.stopImmediatePropagation();
		Overlay.hide();
		return false;
	}
};