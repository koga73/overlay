# Overlay

-   A simple responsive modal system for the web
-   Fully accessible
-   Easy to style
-   No dependencies
-   Works down to IE8

---

## Accessibility

Overlay has been designed to be completely accessible. Features are as follows:

-   Fallback text for "X" icon reads "Close"
-   Escape key closes the Overlay
-   Focus is given to top-most Overlay shown if there are multiple
-   Traps keyboard focus so the user can't tab to the page behind the Overlay
-   Focus is restored to original element after Overlay is closed
-   Traps screen-reader in Overlay by giving page content z-index="-1" and aria-hidden="true"
-   Overlay is announced via "Dialog Start" when shown
-   Default aria-label "Overlay" is added unless element has aria-label or aria-labelledby

---

## Basic Implementation

Include JS and CSS files on your page. Then create a trigger and your Overlay content

### HTML

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Overlay</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1" />

		<!-- Include overlay.css -->
		<link href="../css/overlay.css" type="text/css" rel="stylesheet" />

		<!-- Page styles -->
		<style type="text/css">
			#myOverlay1 {
				width: 600px;
				height: 400px;
			}
		</style>
	</head>
	<body>
		<!-- Page content container should have "data-overlay-page-wrap" -->
		<!-- "data-overlay-page-wrap" attribute allows Overlay to trap focus when Overlay is open for accessibility -->
		<div data-overlay-page-wrap>
			<h1>Some Page Content</h1>
			<a href="#myOverlay1" data-overlay-trigger>Open Overlay</a>
		</div>

		<!-- This container serves as a place for your overlays to live when they are not open -->
		<div style="display:none;">
			<!-- Each overlay needs an id -->
			<div id="myOverlay1">
				<h1>Overlay Content</h1>
			</div>
		</div>

		<!-- Include overlay.js -->
		<script src="js/overlay.js"></script>
	</body>
</html>
```

###### Optional data attributes

The following data attributes can be specified on any Overlay element

```html
<!-- Optional data attributes for each overlay -->
<div
	id="myOverlay1"
	data-overlay-width="600px"
	data-overlay-height="50%"
	data-overlay-offset-x="-200px"
	data-overlay-offset-y="20%"
	data-overlay-container-class="slide-down"
	data-overlay-user-closable="true"
	data-overlay-auto-focus="true"
	data-overlay-immediate="false"
>
	<h1>TEST CONTENT 1</h1>
</div>
```

### CSS

```css
/* By default an overlay will size to the content */
/* However you can choose to explicitly set the width and/or height */
/* The overlay system will apply these dimensions to the frame. The content becomes 100%. */
#myOverlay1 {
	width: 50%;
	height: 400px;
}
```

---

## JS API

The JS API can be used to show/hide an Overlay, listen for events, and create new Overlay instances (multi-modal)

### Full API

Events

-   **EVENT_BEFORE_SHOW** | String | Value: _"beforeshow"_ | Fires when Overlay begins to show but before transitions are complete
-   **EVENT_AFTER_SHOW** | String | Value: _"aftershow"_ | Fires when Overlay is fully shown after transitions are complete
-   **EVENT_BEFORE_HIDE** | String | Value: _"beforehide"_ | Fires when Overlay begins to hide but before transitions are complete
-   **EVENT_AFTER_HIDE** | String | Value: _"afterhide"_ | Fires when Overlay is fully hidden after transitions are complete

Properties

-   **classPrefix** | String | Default: _"overlay-"_ | Appended to all generated classes. For example: "overlay-container"
-   **container** | Element | Default: _undefined_ | Container to put Overlays in when not shown
-   **pageWrap** | Element | Default: _undefined_ | Container of main page content to disallow focus when Overlay is shown
-   **requestCloseCallback** | Function | Default: _undefined_ | Called when a user attempts to close an Overlay. Return false to cancel

Methods

-   **init** | Function | Initializes the Overlay system
-   **destroy** | Function | Destroys the Overlay system
-   **show** | Function | Show an Overlay
-   **hide** | Function | Hide the currently shown Overlay
-   **addTrigger** | Function | Add events to a DOM element to show an Overlay on click
-   **removeTrigger** | Function | Remove events from a DOM element Overlay trigger

### Methods

The following methods can be called statically on the default Overlay instance or on any new Overlay instance

###### init

Initializes the Overlay system. This is called automatically if document.body is available when Overlay is loaded

-   Note: If you decide to include _overlay.js_ in the &lt;head&gt; you will need to call `Overlay.init()` at the bottom of the body or when the DOM is ready. This is because Overlay tries to automatically wire up triggers based on data attributes however document.body doesn't exist yet when included in the head

###### destroy

Destroys the Overlay system. It will need to be re-initialized before use again

###### show

Show an Overlay - Only **content** parameter is required, all other parameters are optional

-   **content** | String element id or Element | Default: _undefined_ | Specify which id to show or pass a DOM element
-   **options** | Object | Default: _undefined_ | Options object takes precedent over data attributes
-   **callback** | Function | Default: _undefined_ | Callback is called after the Overlay is shown including transitions

```js
//Show an overlay. Second and third parameters optional. See below for parameter info
//First parameter can be a String id or an HTML element (document.createElement)
Overlay.show(
	"myOverlay1",
	{
		width: "600px",
		height: "50%",
		offsetX: "-200px",
		offsetY: "20%",
		containerClass: "slide-down",
		userClosable: "true",
		autoFocus: "true",
		immediate: "false"
	},
	myCallback
);
```

OR

```js
var div = document.createElement("div");
div.innerHTML = "Dynamic content";
Overlay.show(div);
```

###### hide

Hide the currently shown Overlay - Parameters are optional

-   **callback** | Function | Default: _undefined_ | Callback is called after the Overlay is hidden including transitions

```js
//Hide the current overlay. Parameters optional
Overlay.hide(myCallback);
```

###### addTrigger

Add events to a DOM element to show an Overlay on click - Only **element** parameter is required, all other parameters are optional

-   **element** | DOM element | Default: _undefined_ | The element to trigger showing an Overlay on click
-   **targetId** | String | Default: _undefined_ | The Overlay id to show, if left undefined will use _data-overlay-trigger_ or _href_ from the element

###### removeTrigger

Remove events from a DOM element Overlay trigger - Parameters are required

-   **element** | DOM element | Default: _undefined_ | The element to trigger showing an Overlay on click

###### events

If _immediate_ is set to true then these events will fire immediately rather than waiting for transitions

```js
Overlay.addEventListener(Overlay.EVENT_BEFORE_SHOW, function(evt, detail) {
	console.log("BEFORE SHOW", detail);
});
Overlay.addEventListener(Overlay.EVENT_AFTER_SHOW, function(evt, detail) {
	console.log("AFTER SHOW", detail);
});
Overlay.addEventListener(Overlay.EVENT_BEFORE_HIDE, function(evt, detail) {
	console.log("BEFORE HIDE", detail);
});
Overlay.addEventListener(Overlay.EVENT_AFTER_HIDE, function(evt, detail) {
	console.log("AFTER HIDE", detail);
});
```

###### new instance

Overlay uses a singleton pattern and by-default an instance is created and its methods are mapped statically to the Overlay object. However if you wish to show multiple Overlays layered on top of one another you can create other instances.

```js
var div = document.createElement("div");
div.innerHTML = "Dynamic content - Lorem Ipsum Dolar";
//Show single
Overlay.show(div);

//Multi-modal!
var div2 = document.createElement("div");
div2.innerHTML = "Some other content";
//Show multiple
var Overlay2 = new Overlay();
Overlay2.init();
Overlay2.show(div2);
```

---

### Notes on specific properties

###### classPrefix

You can change the classPrefix for all Overlay classes. This needs to be set before init, otherwise you will need to re-initialize. Because init is called automatically when Overlay is loaded you will need to re-initialize if you want to change this on the default Overlay instance

```js
Overlay.destroy();
Overlay.classPrefix = "my-prefix-";
Overlay.init();
```

OR

```js
var overlay2 = new Overlay();
overlay2.classPrefix = "my-prefix-";
overlay2.init();
```

###### requestCloseCallback

Set this to a function. When the user attempts to close an Overlay this method will be called. Return false to prevent the Overlay from closing

```js
Overlay.requestCloseCallback = function(detail) {
	console.log("requestCloseCallback", detail);

	//Some logic
	if (detail === "myOverlay1") {
		return false; //Prevent the Overlay from closing
	}
	return true;
};
```
