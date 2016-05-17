/*global define*/
/*jslint browser:true*/

define(["leaflet"], function (L) {
	"use strict";

	var priorities, categories, SignIcon;

	priorities = {
			Unknown: 5,
			Lowest: 4,
			Low: 3,
			Medium: 2,
			High: 1,
			Highest: 1
	};
	categories = {
		"Construction": [
			"Construction",
			"Ferry",
			"Lane Closure",
			"Maintenance"
		],
		"AccidentAlert": [
			"Abandoned Vehicle",
			"Alarm",
			"AMBER Alert",
			"Bridge",
			"Brush fire",
			"Cable Barrier",
			"Chain Enforcement",
			"Collision",
			"Collision fatality",
			"Complaint",
			"Dead Animal",
			"Debris",
			"Debris blocking",
			"Disabled vehicle",
			"Hazardous material",
			"Fatality or Possible Fatality",
			"Fire",
			"Flammable Restriction",
			"HCB Motor Open",
			"ITS & IT",
			"Other",
			"Pass Report",
			"Pierce Co. Roads",
			"Pierce Co. Signs/Signals",
			"Rocks",
			"Signals",
			"Signs",
			"Special Event",
			"",
			"Administrative",
			"Boat Traffic",
			"Bridge Lift",
			"Heavy Traffic",
			"In Service",
			"Lakewood",
			"MBT",
			"MIL",
			"ODOT",
			"Out of Service",
			"P-1 Sand / Plowing / Deicing",
			"Pedestrian",
			"Power Lines",
			"Road Report",
			"Sand / Plowing / Deicing",
			"Shift Change",
			"Toll",
			"Utilities"
		],
		"RoadClosure": [
			"Avalanche Control",
			"Bomb",
			"Bridge Closed",
			"Closure",
			"Emergency closure",
			"Pass Closure",
			"Rollover",
			"Multi-vehicle collision",
			"Chemical Spill",
			"Vehicle fire",
			"Medical emergency",
			"Major incident",
			"Semi Truck Involved",
			"Incident",
			"Two or more lanes closed",
			"Rock Slide",
			"Snow slide",
			"Hazmat",
			"HCB Closed Maint",
			"HCB Closed Marine",
			"HCB Closed Police",
			"HCB Closed Winds",
			"Slide",
			"Slides",
			"Water over Roadway",
			"Rocks - Closure",
			"Trees",
			"Hood Canal Bridge"
		],
		"Weather": [
			"Traction Advisory",
			"Weather",
			"Weather event"
		]
	};

	SignIcon = L.Icon.extend({
		options: {
			iconUrl: "bower_components/wsdot-traveler-info-icons/alert/RoadClosure.png",
			shadowUrl: "bower_components/wsdot-traveler-info-icons/alert/shadow.png",
			iconSize: [25, 25],
			iconAnchor: [13, 25],
			shadowAnchor: [0, 5],
			shadowSize: [25, 9]
		}
	});

	function createSignIcon(url, folder) {
		var shadowUrl;
		if (!url) {
			throw new TypeError("url is undefined.");
		}
		if (!folder) {
			folder = "bower_components/wsdot-traveler-info-icons/alert/";
		}
		shadowUrl = folder + "shadow.png";
		return new SignIcon({
			iconUrl: folder + url,
			shadowUrl: shadowUrl,
		});
	}

	function createClosureIcon() {
		return L.icon({
			iconUrl: "bower_components/wsdot-traveler-info-icons/alert/RoadClosure.png",
			////iconAnchor: [13, 25],
			iconSize: [25, 25]
		});
	}

	/** Detects URLs in text and surrounds them with <a> tags.
	 * @returns {string}
	 */
	function replaceUrlsWithLinks(/**{string}*/ text) {
		var urlRe, output;
		if (typeof text === "string") {
			urlRe = /(?:(https?:\/\/)?www.wsdot.wa.gov)\S+/ig;
			output = text.replace(urlRe, function (match, p1 /*, offset, string*/) {
				var a;
				if (p1) {
					a = match;
				} else {
					a = "http://" + match;
				}
				a = ["<a href='", a, "' target='wsdotproject'>link</a>"].join("");
				return a;
			});
		} else {
			output = text;
		}
		return output;
	}

	/** Splits Pascal case names into words separated by spaces.
	 * @returns {string}
	 */
	function formatName(/**{string}*/ key) {
		var re = /[A-Z][a-z]+/g, match, output;

		if (key) {
			match = key.match(re);
			output = match.join(" ");
		}

		return output;
	}

	function SignIcons() {
		var types, i, l, p, type;
		types = ["AccidentAlert", "Construction", "Weather"];

		for (i = 0, l = types.length; i < l; i += 1) {
			type = types[i];
			// Create new property for the current type.
			this[type] = {};
			for (p in priorities) {
				if (priorities.hasOwnProperty(p)) {
					this[type][p] = createSignIcon([type, priorities[p], ".png"].join(""));
				}
			}
		}

		this.RoadClosure = createClosureIcon();
	}

	SignIcons.prototype.GetIcon = function (feature) {
		var category, icon, categoryName, categoryList, i, l;
		if (!(feature && feature.properties)) {
			throw new TypeError("The feature either is not defined or has no properties.");
		}
		// Get the appropriate category for the feature's EventCategory property...
		for (categoryName in categories) {
			if (categories.hasOwnProperty(categoryName)) {
				categoryList = categories[categoryName];
				for (i = 0, l = categoryList.length; i < l; i += 1) {
					if (feature.properties.EventCategory === categoryList[i]) {
						category = categoryName;
						// Break out of category list loop once match has been found.
						break;
					}
				}
				// Break out of for in loop if category has been determined.
				if (category) {
					break;
				}
			}
		}

		// Default to AccidentAlert if no appropriate category exists.
		if (!category) {
			category = "AccidentAlert";
		}

		if (category === "RoadClosure") {
			icon = this.RoadClosure;
		} else {
			icon = this[category][feature.properties.Priority];
		}

		return icon;
	};

	function createParagraphs(s) {
		var frag;
		if (s) {
			frag = document.createDocumentFragment();
			s = s.split(/\n/ig).forEach(function (part) {
				var p = document.createElement("p");
				p.textContent = replaceUrlsWithLinks(part);
				frag.appendChild(p);
			});
		}
		return frag;
	}

	return {
		categories: categories,
		priorities: priorities,

		/** Formats the alert content into a div element for a popup.
		 * @returns {HTMLDivElement}
		 */
		createAlertContent: function (feature) {
			var name, frag, table, row, cell, section;
			frag = document.createElement("div");
			table = document.createElement("table");
			for (name in feature.properties) {
				if (feature.properties.hasOwnProperty(name) && !/Description/i.test(name)) {
					if (feature.properties[name]) {
						row = document.createElement("tr");
						cell = document.createElement("th");
						cell.textContent = formatName(name);
						row.appendChild(cell);
						cell = document.createElement("td");
						cell.textContent = feature.properties[name];
						row.appendChild(cell);
						table.appendChild(row);
					}
				}
			}

			section = document.createElement("section");
			section.classList.add("headline-description");
			section.appendChild(createParagraphs(feature.properties.HeadlineDescription));
			frag.appendChild(section);

			if (feature.properties.ExtendedDescription) {
				section = document.createElement("section");
				section.classList.add("extended-description");
				section.appendChild(createParagraphs(feature.properties.ExtendedDescription));
				frag.appendChild(section);
			}
			frag.appendChild(table);

			return frag;

		},

		SignIcons: SignIcons
	};
});