import React from "react";
import ReactDOM from "react-dom";

import Overlay from "../../../js/module.js"; //"@koga73/overlay";

class Example extends React.Component {
	componentDidMount() {
		/* Trigger overlay programmatically on load */
		var div = document.createElement("div");
		div.innerHTML = "Triggered programmatically";
		Overlay.show(div, {
			containerClass: "slide-up"
			//width:"50%",
			//height:"50%",
			//userClosable:false
		});
	}

	render() {
		return (
			<div>
				{/* Page content. Buttons to trigger overlays. "data-overlay-page-wrap" is used for trapping focus inside the overlay as an accessibility enhancement */}
				<div id="container" data-overlay-page-wrap>
					<a href="#myOverlay1" data-overlay-trigger>
						Slide Down
					</a>
					<a href="#myOverlay2" data-overlay-trigger>
						Slide Left
					</a>
					<a href="#myOverlay3" data-overlay-trigger>
						Open Immediately
					</a>
					<a href="#myOverlay4" data-overlay-trigger>
						User can't close
					</a>
				</div>

				{/* This container serves as a place for your overlays to live when they are not open */}
				<div style={{display: "none"}}>
					{/* Each overlay needs an id */}
					<div id="myOverlay1" data-overlay-container-class="slide-down">
						<h1>Slide Down</h1>
					</div>
					<div id="myOverlay2" data-overlay-container-class="slide-left">
						<h1>Slide Left</h1>
					</div>
					<div id="myOverlay3" data-overlay-immediate>
						<h1>Open Immediately</h1>
					</div>
					<div id="myOverlay4" data-overlay-user-closable="false">
						<h1>User cannot close this, most be closed programmatically</h1>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Example />, document.getElementById("root"));
