using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace WebWorkerTest
{
	/// <summary>
	/// Summary description for GetAlerts
	/// </summary>
	public class proxy : IHttpHandler
	{

		const string fmt = "http://www.wsdot.wa.gov/Traffic/api/{0}/{0}REST.svc/Get{1}AsJson?AccessCode={2}";

		public void ProcessRequest(HttpContext context)
		{
			context.Response.ContentType = "application/json";

			// Try to get the "type" parameter from the query string. End the request with a "Bad Request" error if no type was provided.
			string type = context.Request.Params["type"];
			if (string.IsNullOrEmpty(type))
			{
				context.Response.StatusCode = 400;
				context.Response.Write("{\"error\": \"type not specified\"}");
				context.Response.End();
				return;
			}

			// Get the partial method name from the web.config.  End the request with a "Bad Request" response if there is no corresponding 
			// setting in web.config.
			string methodName = ConfigurationManager.AppSettings[type];
			if (string.IsNullOrEmpty(methodName))
			{
				context.Response.StatusCode = 400;
				context.Response.Write("{\"error\": \"Unsupported type.\"}");
				context.Response.End();
				return;
			}

			// Build the URL.
			string url = string.Format(fmt, type, methodName, ConfigurationManager.AppSettings["accessCode"]);
			var request = WebRequest.CreateHttp(url);
			string data;
			using (var response = (HttpWebResponse)request.GetResponse())
			{
				using (var stream = response.GetResponseStream())
				{
					using (var reader = new StreamReader(stream))
					{
						data = reader.ReadToEnd();
					}
				}
			}
			
			context.Response.Write(data);
			context.Response.End();
		}

		public bool IsReusable
		{
			get
			{
				return false;
			}
		}
	}
}