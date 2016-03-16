/*
	get closure compiler: https://developers.google.com/closure/compiler/?hl=en
	$ java -jar compiler.jar -O SIMPLE singlepagenav.js > singlepagenav.min.js
*/
function newSinglePageNavigation(document, window, offset) {
	function smoothScroll($target, steps, stepTime) {
		var $scrollContainer = $target;

		do {
			$scrollContainer = $scrollContainer.parentNode;
			if (!$scrollContainer) return;
			$scrollContainer.scrollTop += 1;
		} while ($scrollContainer.scrollTop == 0);

		var targetY = 0;
		do {
			if ($target == $scrollContainer) break;
			targetY += $target.offsetTop;
		} while ($target = $target.offsetParent);
		targetY -= offset;

		scroll = function(c, a, b, i) {
			i++; if (i > steps) return;
			c.scrollTop = a + (b - a) / steps * i;
			window.setTimeout(function(){ scroll(c, a, b, i); }, stepTime);
		}
		scroll($scrollContainer, $scrollContainer.scrollTop, targetY, 0);
	}
	function isInView($element) {
		return $element.getBoundingClientRect().bottom > offset;
	}
	return {
		init: function() {
			var $navs = document.querySelectorAll("[data-pagenav]");
			if($navs.length == 0) {
				return;
			}
			var $sections = document.querySelectorAll("[data-pagenav-id]");
			if($sections.length == 0) {
				return;
			}
			for(var i=0; i<$sections.length; i++) {
				var id = $sections[i].getAttribute('data-pagenav-id'),
					name = $sections[i].getAttribute('data-pagenav-name');
				if(!name) {
					name = id;
				}
				for(var e=0; e<$navs.length; e++) {
					var $lielem = document.createElement("li"),
						$navelem = document.createElement("a");
					$navelem.setAttribute("data-pagenav-to", id);
					$navelem.href = "#"+id;
					$navelem.className = "main-bar-a";
					$navelem.innerHTML = name;
					$navelem.onclick = function(e) {
						var id = e.target.getAttribute("data-pagenav-to"),
							$tosec = document.querySelector("[data-pagenav-id='"+id+"']");
						if($tosec) {
							smoothScroll($tosec, 20, 20);
						}
						return false;
					};
					$lielem.appendChild($navelem);
					$navs[e].appendChild($lielem);
				}
			}
			document.onscroll = function() {
				for(var i=0; i<$sections.length; i++) {
					if(isInView($sections[i])) {
						var id = $sections[i].getAttribute('data-pagenav-id'),
							$navelem = document.querySelector("[data-pagenav-to='"+id+"']");
						if($navelem.parentElement.classList.contains("active")) {
							break;
						}
						var $navelems = document.querySelectorAll("[data-pagenav-to]");
						for(var e=0; e<$navelems.length; e++) {
							$navelems[e].className = $navelem == $navelems[e] ?
								"pagenav-active":
								"";
						}
						window.location.hash = "#"+id;
						break;
					}
				}
			};
			var hash = window.location.hash;
			if(hash) {
				var id = hash.substr(1),
					$navelem = document.querySelector("[data-pagenav-to='"+id+"']");
				if($navelem) {
					$navelem.click();
				}
			}
		}
	};
}
var singlePageNavigation = newSinglePageNavigation(document, window, 0);
