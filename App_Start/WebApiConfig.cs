using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace TravelerLeafletMap
{
	public class WebApiConfig
	{
		public static void Register(HttpConfiguration config)
		{
			config.MapHttpAttributeRoutes();
			var serviceToFunctionDict = new Dictionary<string, string>();
			serviceToFunctionDict.Add("BorderCrossings", "BorderCrossings");
			serviceToFunctionDict.Add("CVRestrictions", "CommercialVehicleRestrictions");
			serviceToFunctionDict.Add("HighwayAlerts", "Alerts");
			serviceToFunctionDict.Add("HighwayCameras", "Cameras");
			serviceToFunctionDict.Add("MountainPassConditions", "MountainPassConditions");
			serviceToFunctionDict.Add("TrafficFlow", "TrafficFlows");
			serviceToFunctionDict.Add("TravelTimes", "TravelTimes");
			config.Properties.TryAdd("services", serviceToFunctionDict);
		}
	}
}