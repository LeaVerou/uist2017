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
		&& url.pathname.replace(/\/$/, "") == location.pathname.replace(/\/$/, "")
		&& url.origin == location.origin;
}

function highlightCurrentItem() {
	$$("nav li a").forEach(function(a) {
		a.parentNode[(isCurrentURL(a)? "set" : "remove") + "Attribute"]("aria-current", "page");
	});
}

highlightCurrentItem();
addEventListener("hashchange", highlightCurrentItem);
