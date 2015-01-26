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
			content.css("width", Overlay.content.data("width"));
			content.css("height", Overlay.content.data("height"));
			content.remove();
			hiddenContainer.append(content);
		}
		Overlay.content = null;
		
		var frame = Overlay.frame;
		if (frame){
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
	
	show:function(contentID, offsetX, offsetY, width, height){
		if (Overlay.content != null){
			Overlay.hide();
		}
		if (Overlay.onBeforeShow){
			Overlay.onBeforeShow();
		}
		var hiddenContainer = Overlay.hiddenContainer;
		
		var container = Overlay.container;
		if (!container){
			container = $("<div id='overlayContainer'></div>");
			Overlay.container = container;
		}
		
		var background = Overlay.background;
		if (!background){
			background = $("<div id='overlayBackground'></div>");
			Overlay.background = background;
		}
		background.on("click", Overlay.handler_background_click);
		
		var frame = Overlay.frame;
		if (!frame){
			frame = $("<div id='overlayFrame'></div>");
			Overlay.frame = frame;
		}
		
		var close = Overlay.close;
		if (!close){
			close = $("<a id='btnClose' href='#close'></a>");
			Overlay.close = close;		
		}
		close.on("click", Overlay.handler_close_clicked);
		
		var content = $("#" + contentID);
		if (typeof width === typeof undefined){
			width = content.css("width");
			content.data("width", width);
			if (parseInt(width) == 0){
				content.data("width", "");
				hiddenContainer.show();
				width = content.width();
				if (width == parseInt(width)){
					width += "px";
				}
				hiddenContainer.hide();
			}
		}
		frame.css("width", width);
		content.css("width", "100%");
		
		var fixedHeight = false;
		if (typeof height === typeof undefined){
			height = content.css("height");
			content.data("height", height);
			if (parseInt(height) == 0){
				content.data("height", "");
				hiddenContainer.show();
				height = content.height();
				if (height == parseInt(height)){
					height += "px";
				}
				hiddenContainer.hide();
			} else {
				fixedHeight = true;
			}
		} else {
			fixedHeight = true;
		}
		if (fixedHeight){
			frame.css("height", height);
		}
		content.css("height", "100%");
		Overlay.content = content;
		
		frame.append(close);
		frame.append(content);
		container.append(background);
		container.append(frame);
		$("body").append(container);
		
		if (typeof offsetX === typeof undefined){
			var w = parseInt(width);
			offsetX = width.toString().replace(w, (w * -0.5));
		}
		frame.css("margin-left", offsetX);
		if (typeof offsetY === typeof undefined){
			var h = parseInt(height);
			offsetY = height.toString().replace(h, (h * -0.5));
		}
		frame.css("margin-top", offsetY);
		
		if (Overlay.onAfterShow){
			Overlay.onAfterShow();
		}
	},
	
	hide:function(){
		if (Overlay.onBeforeHide){
			Overlay.onBeforeHide();
		}
		var hiddenContainer = Overlay.hiddenContainer;
		
		var close = Overlay.close;
		if (close){
			close.off("click", Overlay.handler_close_clicked);
			close.remove();
		}
		
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
		
		var background = Overlay.background;
		if (background){
			background.off("click", Overlay.handler_background_click);
			background.remove();
		}
		
		var container = Overlay.container;
		if (container){
			container.remove();
		}
		
		if (Overlay.onAfterHide){
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