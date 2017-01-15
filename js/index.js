if (new Date().getFullYear() <= 2017 && $("table.dates")) {
	$.include("js/countdown.js").then(function(){
		$$("table.dates").forEach(function(datesTable) {
			let times = $$("time", datesTable);

			for (let time of times) {
				let td = time.closest("td");
				let date = new Date(time.getAttribute("datetime"));
				let diff = time._.data.diff = time._.data.diff || new CountDown(date);

				let countdown = time.nextElementSibling || $.create("em", {
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

// TODO Highlight current menu item
