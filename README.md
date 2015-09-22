##Overlay##
*By: AJ Savino*

Overlay.js - A simple responsive modal system for the web. Works down to IE8. Accessible by screen readers. Easy to customize. jQuery not required.

###Implementation###
Include JS and CSS files on your page

HTML
```html
<!-- This container serves as a place for your overlays to live when they are not open -->
<div style="display:none;">
	<!-- Each overlay needs an id -->
	<div id="myOverlay1" data-overlay-container-class="slide-up">
		<h1>TEST CONTENT 1</h1>
	</div>
	<div id="myOverlay2" data-overlay-container-class="slide-down">
		<h1>TEST CONTENT 2</h1>
	</div>
</div>
```
```html
<!-- Page content. Buttons to trigger overlays. "data-overlay-page-wrap" is used for trapping focus inside the overlay as an accessibility enhancement -->
<div id="container" data-overlay-page-wrap>
	<a id="overlayTrigger1" href="#myOverlay1" data-overlay-trigger>OPEN OVERLAY 1</a>
	<a id="overlayTrigger2" href="#myOverlay2" data-overlay-trigger>OPEN OVERLAY 2</a>
	<a id="overlayTrigger3" href="#myOverlay3" data-overlay-trigger>OPEN OVERLAY 3</a>
</div>
```
```html
<!-- Optional data attributes for each overlay -->
<div id="myOverlay1"
	 data-overlay-width="600px"
	 data-overlay-height="50%"
	 data-overlay-offset-x="-200px"
	 data-overlay-offset-y="20%"
	 data-overlay-container-class="slide-down"
	 data-overlay-user-closable="false"
>
	<h1>TEST CONTENT 1</h1>
</div>
```

CSS
```css
/* By default an overlay will size to the content */
/* However you can choose to explicitly set the width and/or height */
/* The overlay system will apply these dimensions to the frame. The content becomes 100%. */
#myOverlay1 {
	width:50%;
	height:400px;
}
```

----------

####JavaScript API####
JavaScript
```javascript
//Show an overlay. Second and third parameters optional. See below for parameter info
Overlay.show("myOverlay1", {
	containerClass:"slide-up"
}, myCallback);

//Hide the current overlay. Parameters optional
Overlay.hide(myCallback);
```
```javascript
/* Events */
Overlay.EVENT_BEFORE_SHOW
Overlay.EVENT_AFTER_SHOW
Overlay.EVENT_BEFORE_HIDE
Overlay.EVENT_AFTER_HIDE

/* Properties */
//By default the overlayContainer gets appended to the body
//Set this to an html element to change where the overlayContainer is appended
Overlay.container = document.getElementById("newContainer");

/* Methods */

//Called automatically
Overlay.initialize()

//Destroys the Overlay instance and will need to be reinitialized
Overlay.destroy()

//Hides the current overlay
//Optional callback will fire after hidden
Overlay.hide(callback)

//Shows an overlay. Second and third parameters are optional
//Optional callback will fire after shown
Overlay.show("{ID}", {
	//Override width
	width:"500px",
	//Override height
	height:"100%",
	//Offset x from center
	offsetX:"-100px",
	//Offset y from center
	offsetY:"300px",
	//Add classes to the container. Useful for animation and styling
	containerClass:"slide-up my-special-modal"
}, callback);
```

----------

####Events####
```javascript
/* With jQuery */

$("#triggerLink").on("click", function(evt){
	Overlay.show("myOverlay1", {
		containerClass:"slide-up"
	});
	return false;
});
$(Overlay).on(Overlay.EVENT_BEFORE_SHOW, function(evt){
	console.log("BEFORE SHOW");
});

/* - OR - */

/* Without jQuery you can use the built in OOP object for events */

var triggerLink = document.getElementById("triggerLink");
OOP.addEventListener(triggerLink, "click", function(evt){
	Overlay.show("myOverlay1", {
		containerClass:"slide-up"
	});
	return false;
});
OOP.addEventListener(Overlay, Overlay.EVENT_BEFORE_SHOW, function(evt){
	console.log("BEFORE SHOW");
});
OOP.addEventListener(Overlay, Overlay.EVENT_AFTER_SHOW, function(evt){
	console.log("AFTER SHOW");
});
OOP.addEventListener(Overlay, Overlay.EVENT_BEFORE_HIDE, function(evt){
	console.log("BEFORE HIDE");
});
OOP.addEventListener(Overlay, Overlay.EVENT_AFTER_HIDE, function(evt){
	console.log("AFTER HIDE");
});
```