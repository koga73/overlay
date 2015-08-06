##Overlay##
*By: AJ Savino*

Overlay.js - A simple responsive modal system for the web. Works down to IE8. Easy to customize. jQuery not required.


###Implementation###
Include JS and CSS files on your page

```html
<!-- This container serves as a place for your overlays to live when they are not open -->
<div id="overlays">
	<!-- Each overlay needs an id -->
	<div id="myOverlay1">
		<h1>TEST CONTENT 1</h1>
	</div>
	<div id="myOverlay2">
		<h1>TEST CONTENT 2</h1>
	</div>
</div>
```

```css
/* By default an overlay will size to the content */
/* However you can choose to explicitly set the width and/or height */
/* The overlay system will apply these dimensions to the frame. The content becomes 100%. */
#myOverlay1 {
	width:50%;
	height:400px;
}
```

```javascript
//Show an overlay. Parameters optional. See below for parameter list
Overlay.show("myOverlay1", {
	containerClass:"slide-up"
});

//Hide the current overlay. No parameters needed.
Overlay.hide();
```

----------

####Events####
```javascript
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

----------

####API####
```javascript
/* Events */
Overlay.EVENT_BEFORE_SHOW
Overlay.EVENT_AFTER_SHOW
Overlay.EVENT_BEFORE_HIDE
Overlay.EVENT_AFTER_HIDE

/* Properties */
//By default the overlay container gets appended to the body
//Set this property to an html element to change where the overlay container is appended
Overlay.container = document.getElementById("newContainer");

/* Methods */

//Called automatically
Overlay.initialize()

//Destroys the Overlay instance and will need to be reinitialized
Overlay.destroy()

//Hides the current overlay
Overlay.hide()

//Shows an overlay. Parameters are optional
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
});
```