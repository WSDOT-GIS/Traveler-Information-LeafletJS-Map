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
	public class GetAlerts : IHttpHandler
	{

		public void ProcessRequest(HttpContext context)
		{
			string url = string.Format("http://www.wsdot.wa.gov/Traffic/api/HighwayAlerts/HighwayAlertsREST.svc/GetAlertsAsJson?AccessCode={0}", ConfigurationManager.AppSettings["accessCode"]);
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
					
					////int currentByte = stream.ReadByte();
					////while (currentByte != -1)
					////{
					////	context.Response.OutputStream.WriteByte(Convert.ToByte(currentByte));
					////	currentByte = stream.ReadByte();
					////}
				}
			}
			context.Response.ContentType = "application/json";
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