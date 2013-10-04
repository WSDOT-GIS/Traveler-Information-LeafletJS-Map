/*global require, exports*/
(function () {
	"use strict";

	// Module format as described at {@link http://wiki.commonjs.org/wiki/Modules/ScriptModules}

	var mod = function (require, exports) {
		exports.priorityValues = {
			"Unknown": 5,
			"Lowest": 4,
			"Low": 3,
			"Medium": 2,
			"High": 1,
			"Highest": 1
		};
		exports.categories = {
			"Construction": [
				"Construction",
				"Ferry",
				"Lane Closure",
				"Maintenance"
			],
			"Alert": [
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
			"Closure": [
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
	};

	require.install ? require.install("categories", mod) : mod(require, exports);
}());