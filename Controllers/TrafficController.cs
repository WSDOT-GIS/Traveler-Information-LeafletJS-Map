using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace TravelerLeafletMap
{
    /// <summary>
    /// Proxy for the WSDOT Traveler API to work around its lack of CORS support.
    /// </summary>
    public class TrafficController : ApiController
    {
        // Common format for traffic API requests.
        const string fmt = "http://www.wsdot.wa.gov/Traffic/api/{0}/{0}REST.svc/Get{1}AsJson?AccessCode={2}";

        // GET api/<controller>
        [Route("api/traffic/{type}")]
        public async Task<HttpResponseMessage> Get(string type)
        {
            // Get the list of valid services. Return server error if this fails.
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

            // Get the function name based on the "type" parameter. Return "Bad Request" error if type is invalid.
            string functionName;
            if (!services.TryGetValue(type, out functionName))
            {
                return this.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid type parameter");
            }

            // Build the URL.
            string url = string.Format(fmt, type, functionName, ConfigurationManager.AppSettings["accessCode"]);

            // Initialize the response message.
            HttpResponseMessage output = null;

            // Make the API request and store the response in output variable.
            using (var client = new HttpClient())
            {
                await client.GetAsync(url).ContinueWith(t =>
                {
                    output = t.Result;
                });
            }

            // Return server error if response is null.
            if (output == null)
            {
                output = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error calling Traffic API.");
            }

            // Return the response that was returned from the API request.
            return output;
        }
    }
}