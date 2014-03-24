using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace TravelerLeafletMap
{
	public class TrafficController : ApiController
	{
		const string fmt = "http://www.wsdot.wa.gov/Traffic/api/{0}/{0}REST.svc/Get{1}AsJson?AccessCode={2}";

		// GET api/<controller>
		[Route("api/traffic/{type}")]
		public HttpResponseMessage Get(string type)
		{
			Dictionary<string, string> services = null;
			object o;
			if (GlobalConfiguration.Configuration.Properties.TryGetValue("services", out o))
			{
				services = o as Dictionary<string, string>;
			}
			else
			{
				return this.Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Could not retrieve list of services");
			}

			string functionName = services[type];
			if (functionName == null)
			{
				return this.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid type parameter");
			}

			string url = string.Format(fmt, type, functionName, ConfigurationManager.AppSettings["accessCode"]);

			HttpResponseMessage output = null;

			using (var client = new HttpClient())
			{
				client.GetAsync(url).ContinueWith(t =>
				{
					output = t.Result;
				}).Wait();
			}

			if (output == null)
			{
				output = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error calling Traffic API.");
			}

			return output;
		}
	}
}