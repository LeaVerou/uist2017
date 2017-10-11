if (new Date().getFullYear() <= 2017 && $("table.dates")) {
	$.include("js/countdown.js").then(function(){
		$$("table.dates").forEach(function(datesTable) {
			var times = $$("time", datesTable);

			for (var time of times) {
				var td = time.closest("td");
				var date = new Date(time.getAttribute("datetime"));
				var diff = time._.data.diff = time._.data.diff || new CountDown(date);

				var countdown = time.nextElementSibling || $.create("em", {
					className: "countdown",
					after: time
				});

				diff.animate(countdown, {
					callback: function(){
						if (this.past) {
							time.closest("tr").classList.add("passed");
							$.remove(countdown);
							return false;
						}
					}
				});
			}
		});
	});
}

// Which page are we on?
var page = (location.pathname.match(/\/(\w+)\/$/) || [])[1];

if (page) {
	document.body.classList.add("page-" + page);
}

if (page == "sponsor") {
	$$("#platinum, #gold, #silver, #bronze, #friends").forEach(function(section) {
		$.create("a", {
			className: "sponsor",
			textContent: "You?",
			href: "mailto:sponsorship@uist.org?subject=Interested in a " + section.id + " sponsorship for UIST 2017",
			inside: section
		});
	});
}

// Facilitate deep linking: Give every section an id and make its heading a link
$$("main section > h1").forEach(function (h1) {
	var section = h1.parentNode;
	var title = h1.textContent;

	if (!section.id) {
		var parentSection = section.parentNode.closest("section");

		section.id = (parentSection? parentSection.id + "-" : "") + title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
	}

	h1.innerHTML = "";

	var url = (new URL("#" + section.id, location) + "").replace(document.baseURI, "");

	$.create("a", {
		textContent: title,
		href: url,
		inside: h1
	});
});

// Page Table of Contents
var toc = $("#toc");
if (toc) {
	$$("main > section > h1 > a").forEach(function(a) {
		toc.appendChild(a.cloneNode(true));
	});
}

// Highlight current menu item
function isCurrentURL(url) {
	return (!url.hash || url.hash == location.hash)
		&& url.pathname.replace(/\/$/, "") == location.pathname.replace(/\/$/, "");
}

function highlightCurrentItem() {
	$$("nav li a").forEach(function(a) {
		a.parentNode[(isCurrentURL(a)? "set" : "remove") + "Attribute"]("aria-current", "page");
	});
}

highlightCurrentItem();
addEventListener("hashchange", highlightCurrentItem);

// Make Youtube embeds responsive
(function(){
	var iframes = $$('iframe[src^="https://www.youtube.com/embed/"]');

	iframes.forEach(function(iframe, i) {
		var width = iframe.width || 560;
		var height = iframe.height || 325;
		var div = $.create("div", {
			className: "embed-container",
			style: {
				"--width": width,
				"--height": height
			},
			around: iframe
		});

		iframe.id = "youtube-" + (i + 1);
	});

	if (iframes.length) {
		$.include(self.YT, "https://www.youtube.com/iframe_api");
	}

	window.onYouTubeIframeAPIReady = function() {
		iframes.forEach(function(iframe, i) {
			new YT.Player("youtube-" + (i + 1), {
				events: {
					onStateChange: function(evt) {
						if (evt.data <= YT.PlayerState.PAUSED) {
							iframe.parentNode.classList.toggle("playing", evt.data == YT.PlayerState.PLAYING);
							console.log(iframe.parentNode, evt.data == YT.PlayerState.PLAYING);
						}
					}
				}
			})
		});
	}
})();
