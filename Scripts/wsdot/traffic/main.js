﻿/*global define*/

define(function () {

	/** Returns null if input is null or undefined. Otherwise returns the input 
	 * converted to a number via Number function (or if it was already a number
	 * then the original number is returned.
	 * @param n
	 * @output {(Number|null)}
	 */
	function getNumberOrNull(n) {
		var output;
		if (n == null) { // If null OR undefined. == instead of === is intentional.
			output = null;
		}
		else if (typeof n === "number") {
			output = n;
		} else {
			output = Number(n);
		}

		return output;
	}

	/** Converts a .NET formatted date string into a Date if possible. 
	 * If not possible or if input is not a string, the input is returned.
	 */
	function parseDate(value) {
		var match, output = value, dateRe = /\/Date\((\d+)(-\d+)?\)\//;
		if (typeof value === "string") {
			match = value.match(dateRe);
			if (match) {
				if (match.length >= 3) {
					output = new Date(Number(match[1]) + Number(match[2]));
				} else {
					output = new Date(Number(match[1]));
				}
				//output = formatDate(output);
			}
		}
		return output;
	}

	/** Describes a specific location on a WA State Highway.
	 * @constructor
	 * @param {Object.<string, (string|number)>} [json] An object containing properties to initialize the members.
	 * @member {string} Description A description of the location. This could be a cross street or a nearby landmark.
	 * @member {string} RoadName The name of the road.
	 * @member {string} Direction The side of the road the location is on (Northbound, Southbound). This does not necessarily correspond to an actual compass direction.
	 * @member {number} MilePost The milepost of the location.
	 * @member {number} Latitude Latitude of the location.
	 * @member {number} Longitude Longitude of the location.
	 */
	function RoadwayLocation(json) {
		this.Description = json ? json.Description || null : null;
		this.RoadName = json ? json.RoadName || null : null;
		this.Direction = json ? json.Direction || null : null;
		this.MilePost = json ? getNumberOrNull(json.MilePost) : null;
		this.Latitude = json ? getNumberOrNull(json.Latitude) : null;
		this.Longitude = json ? getNumberOrNull(json.Longitude) : null;
	}

	/** Determines if the longitude and latitude properties are valid. 
	 * Currently only checks to make sure they are both "truthy" (i.e., non-zero, non-null, non-undefined).
	 * @returns {Boolean}
	 */
	RoadwayLocation.prototype.isLocationValid = function () {
		return this.Longitude && this.Latitude;
	};

	/** Converts the input to a {@link:RoadwayLocation}, or returns the original input if it is already a {@link:RoadwayLocation}.
	 * @returns {RoadwayLocation}
	 */
	RoadwayLocation.toRoadwayLocation = function(json)  {
		var output = null;
		if (json) {
			if (json instanceof RoadwayLocation) {
				output = json;
			} else {
				output = new RoadwayLocation(json);
			}
		}
		return output;
	};

	function BorderCrossingData(json) {
		this.Time = json ? json.Time || null : null;
		this.CrossingName = json ? json.CrossingName || null : null;
		this.BorderCrossingLocation = json ? RoadwayLocation.toRoadwayLocation(json.BorderCrossingLocation) : null;
		this.WaitTime = json ? json.WaitTime || null : null;
	}

	/** Represents a Commercial Vehicle Restriction. 
	 * @member {string} StateRouteID
	 * @member {string} State
	 * @member {int} RestrictionWidthInInches
	 * @member {int} RestrictionHeightInInches
	 * @member {int} RestrictionLengthInInches
	 * @member {int} RestrictionWeightInPounds
	 * @member {bool} IsDetourAvailable
	 * @member {bool} IsPermanentRestriction
	 * @member {bool} IsExceptionsAllowed
	 * @member {bool} IsWarning
	 * @member {DateTime} DatePosted
	 * @member {DateTime} DateEffective
	 * @member {DateTime} DateExpires
	 * @member {string} LocationName
	 * @member {string} LocationDescription
	 * @member {string} RestrictionComment
	 * @member {double} Latitude
	 * @member {double} Longitude
	 * @member {string} BridgeNumber
	 * @member {int} MaximumGrossVehicleWeightInPounds
	 * @member {string} BridgeName
	 * @member {int} BLMaxAxle
	 * @member {int} CL8MaxAxle
	 * @member {int} SAMaxAxle
	 * @member {int} TDMaxAxle
	 * @member {string} VehicleType
	 * @member {CommercialVehicleRestrictionType} RestrictionType
	 * @member {RoadwayLocation} EndRoadwayLocation End location for the alert on the roadway
	 * @member {RoadwayLocation} StartRoadwayLocation Start location for the alert on the roadway
	 */
	function CVRestrictionData(/** {object} */ json) {
		this.StateRouteID = json ? json.StateRouteID || null : null;
		this.State = json ? json.State || null : null;
		this.RestrictionWidthInInches = getNumberOrNull(json.RestrictionWidthInInches);
		this.RestrictionHeightInInches = getNumberOrNull(json.RestrictionHeightInInches);
		this.RestrictionLengthInInches = getNumberOrNull(json.RestrictionLengthInInches);
		this.RestrictionWeightInPounds = getNumberOrNull(json.RestrictionWeightInPounds);
		this.IsDetourAvailable = Boolean(json.IsDetourAvailable);
		this.IsPermanentRestriction = Boolean(json.IsPermanentRestriction);
		this.IsExceptionsAllowed = Boolean(json.IsExceptionsAllowed);
		this.IsWarning = json ? json.IsWarning || null : null;
		this.DatePosted = json ? parseDate(json.DatePosted) : null;
		this.DateEffective = json ? parseDate(json.DateEffective) : null;
		this.DateExpires = json ? parseDate(json.DateExpires) : null;
		this.LocationName = json ? json.LocationName || null : null;
		this.LocationDescription = json ? json.LocationDescription || null : null;
		this.RestrictionComment = json ? json.RestrictionComment || null : null;
		this.Latitude = json ? json.Latitude || null : null;
		this.Longitude = json ? json.Longitude || null : null;
		this.BridgeNumber = json ? json.BridgeNumber || null : null;
		this.MaximumGrossVehicleWeightInPounds = getNumberOrNull(json.MaximumGrossVehicleWeightInPounds);
		this.BridgeName = json ? json.BridgeName || null : null;
		this.BLMaxAxle = getNumberOrNull(json.BLMaxAxle);
		this.CL8MaxAxle = getNumberOrNull(json.CL8MaxAxle);
		this.SAMaxAxle = getNumberOrNull(json.SAMaxAxle);
		this.TDMaxAxle = getNumberOrNull(json.TDMaxAxle);
		this.VehicleType = json ? json.VehicleType || null : null;
		this.RestrictionType = json.RestrictionType === 1 ? CVRestrictionData.RESTRICTION_TYPE_ROAD_RESTRICTION
			: json.RestrictionType === 0 ? CVRestrictionData.RESTRICTION_TYPE_BRIDGE_RESTRICTION
			: json.RestrictionType;
		this.StartRoadwayLocation = json ? RoadwayLocation.toRoadwayLocation(json.StartRoadwayLocation) : null;
		this.EndRoadwayLocation = json ? RoadwayLocation.toRoadwayLocation(json.EndRoadwayLocation) : null;
	}

	CVRestrictionData.RESTRICTION_TYPE_BRIDGE_RESTRICTION = "BridgeRestriction";
	CVRestrictionData.RESTRICTION_TYPE_ROAD_RESTRICTION = "RoadRestriction";



	/** A Highway Alert 
	 * @constructor
	 */
	function Alert(json) {
		/** @member {int} AlertID Unique Identifier for the alert */ 
		this.AlertID = json ? json.AlertID : null;
		/** @member {string} County County where alert is located */ 
		this.County = json ? json.County || null : null;
		/** @member {DateTime} StartTime When the impact on traffic began */ 
		this.StartTime = json ? parseDate(json.StartTime) : null;
		/** @member {DateTime} EndTime Estimated end time for alert */ 
		this.EndTime = json ? parseDate(json.EndTime) : null;
		/** @member {string} EventCategory Categorization of alert, i.e. Collision, maintenance, etc.*/ 
		this.EventCategory = json ? json.EventCategory || null : null;
		/** @member {string} EventStatus Current status of alert, open, closed*/ 
		this.EventStatus = json ? json.EventStatus || null : null;
		/** @member {string} ExtendedDescription Optional - Additional information about the alert, used for relaying useful extra information for an alert*/ 
		this.ExtendedDescription = json ? json.ExtendedDescription || null : null;
		/** @member {string} HeadlineDescription Information about what the alert has been issued for*/ 
		this.HeadlineDescription = json ? json.HeadlineDescription || null : null;
		/** @member {DateTime} LastUpdatedTime When was alert was last changed*/ 
		this.LastUpdatedTime = json ? json.LastUpdatedTime || null : null;
		/** @member {string} Priority Expected impact on traffic, highest, high, medium, low*/ 
		this.Priority = json ? json.Priority || null : null;
		/** @member {string} Region WSDOT Region which entered the alert*/ 
		this.Region = json ? json.Region || null : null;
		/** @member {RoadwayLocation} StartRoadwayLocation Start location for the alert on the roadway*/ 
		this.StartRoadwayLocation = json ? json.StartRoadwayLocation || null : null;
		/** @member {RoadwayLocation} EndRoadwayLocation End location for the alert on the roadway */ 
		this.EndRoadwayLocation = json ? json.EndRoadwayLocation || null : null;
	}

	/** Represents a traffic camera */
	function Camera(json) {
		/** @member {int} */
		this.CameraID = json ? json.CameraID || null : null;
		/** @member {string} */
		this.Region = json ? json.Region || null : null;
		/** @member {RoadwayLocation} */
		this.CameraLocation = json ? json.CameraLocation || null : null;
		/** @member {double} */
		this.DisplayLatitude = json ? json.DisplayLatitude || null : null;
		/** @member {double} */
		this.DisplayLongitude = json ? json.DisplayLongitude || null : null;
		/** @member {string} */
		this.Title = json ? json.Title || null : null;
		/** @member {string} */
		this.Description = json ? json.Description || null : null;
		/** @member {string} */
		this.ImageURL = json ? json.ImageURL || null : null;
		/** @member {string} */
		this.CameraOwner = json ? json.CameraOwner || null : null;
		/** @member {string} */
		this.OwnerURL = json ? json.OwnerURL || null : null;
		/** @member {int} */
		this.ImageWidth = json ? json.ImageWidth || null : null;
		/** @member {int} */
		this.ImageHeight = json ? json.ImageHeight || null : null;
		/** @member {bool} */
		this.IsActive = json ? json.IsActive || null : null;
		/** @member {int} */
		this.SortOrder = json ? json.SortOrder || null : null;
	}

	/** A travel restriction for moutain passes. */
	function TravelRestriction(json) {
		/** @member {string} TravelDirection The direction of this restriction.*/
		this.TravelDirection = json ? json.TravelDirection || null : null;
		/** @member {string} RestrictionText The text of this restriction.  */
		this.RestrictionText = json ? json.RestrictionText || null : null;
	}

	/** A data structure that represents the conditions of the mountain pass.
	 * @consructor
	 */
	function PassCondition(json) {
		/** @member {int} MountainPassId A unique identifier for a mountain pass. */
		this.MountainPassId = json ? json.MountainPassId || null : null;
		/** @member {string} MountainPassName A friendly name for a mountain pass. */
		this.MountainPassName = json ? json.MountainPassName || null : null;
		/** @member {double} Latitude The latitude of the mountain pass. */
		this.Latitude = json ? json.Latitude || null : null;
		/** @member {double} Longitude The longitude of the mountain pass. */
		this.Longitude = json ? json.Longitude || null : null;
		/** @member {DateTime} DateUpdated The time the PassCondition was updated. */
		this.DateUpdated = json ? json.DateUpdated || null : null;
		/** @member {int} TemperatureInFahrenheit The temperature reading at the mountain pass in degrees fahrenheit.	 */
		this.TemperatureInFahrenheit = json ? json.TemperatureInFahrenheit || null : null;
		/** @member {int} ElevationInFeet The elevation of the mountain pass in feet. */
		this.ElevationInFeet = json ? json.ElevationInFeet || null : null;
		/** @member {string} WeatherCondition The weather conditions at the pass. */
		this.WeatherCondition = json ? json.WeatherCondition || null : null;
		/** @member {string} RoadCondition The roadway conditions at the pass. */
		this.RoadCondition = json ? json.RoadCondition || null : null;
		/** @member {bool} TravelAdvisoryActive Indicates if a travel advisory is active. */
		this.TravelAdvisoryActive = json ? json.TravelAdvisoryActive || null : null;
		/** @member {TravelRestriction} RestrictionOne The travel restriction in the primary direction. */
		this.RestrictionOne = json ? json.RestrictionOne || null : null;
		/** @member {TravelRestriction} RestrictionTwo The travel restriction in the secondary direction. */
		this.RestrictionTwo = json ? json.RestrictionTwo || null : null;
	}

	/** A data structure that represents a Flow Station 
	 * @constructor
	 */
	function FlowData(json) {
		/** @member {int} FlowDataID A unique ID that identifies a specific station. */
		this.FlowDataID = json ? json.FlowDataID || null : null;
		/** @member {DateTime} Time The time of the station reading. */
		this.Time = json ? json.Time || null : null;
		/** @member {string} StationName The name of the flow station. */
		this.StationName = json ? json.StationName || null : null;
		/** @member {string} Region The region that maintains the flow station. */
		this.Region = json ? json.Region || null : null;
		/** @member {RoadwayLocation} FlowStationLocation The location of the flow station. */
		this.FlowStationLocation = json ? json.FlowStationLocation || null : null;
		/** @member {FlowStationReading} FlowReadingValue The current traffic condition at the flow station.  */
		this.FlowReadingValue = json ? json.FlowReadingValue || null : null;
	}

	/* Data structure that represents a travel time route.
	 * @constructor
	 */
	function TravelTimeRoute(json) {
		/** @member {int} TravelTimeID Unique ID that is specific to a route. */
		this.TravelTimeID = json ? json.TravelTimeID || null : null;
		/** @member {string} Name A friendly name for the route. */
		this.Name = json ? json.Name || null : null;
		/** @member {string} Description A description for the route. */
		this.Description = json ? json.Description || null : null;
		/** @member {DateTime} TimeUpdated The last time that the data for this route was updated. */
		this.TimeUpdated = json ? json.TimeUpdated || null : null;
		/** @member {RoadwayLocation} StartPoint The location where this route begins. */
		this.StartPoint = json ? json.StartPoint || null : null;
		/** @member {RoadwayLocation} EndPoint The location where this route ends. */
		this.EndPoint = json ? json.EndPoint || null : null;
		/** @member {decimal} Distance Total distance of this route in miles. */
		this.Distance = json ? json.Distance || null : null;
		/** @member {int} AverageTime The average time in minutes that it takes to complete this route. */
		this.AverageTime = json ? json.AverageTime || null : null;
		/** @member {int} CurrentTime The current estimated time in minutes that it takes to complete this route.  */
		this.CurrentTime = json ? json.CurrentTime || null : null;
	}

	return {
		RoadwayLocation: RoadwayLocation,
		BorderCrossingData: BorderCrossingData,
		CVRestrictionData: CVRestrictionData,
		Alert: Alert,
		Camera: Camera,
		PassCondition: PassCondition,
		TravelRestriction: TravelRestriction,
		FlowData: FlowData,
		TravelTimeRoute: TravelTimeRoute
	};
});