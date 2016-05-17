Traveler Information LeafletJS Map
===========================================

Displays information from the [WSDOT Traveler Information API] on a [LeafletJS] map.

## Requirements ##

* A web server running ASP.NET 4.5. (Other versions of .NET may work, but haven't been tested.)
* Visual Studio 2015
* Git client
* Bower
 
If you want to use a different environment, you may need to write your own version of `proxy.ashx`.

## Getting started ##

1. Clone this repository using this command: `git clone https://github.com/WSDOT-GIS/Traveler-Information-LeafletJS-Map`
3. Run `bower install`
2. Create a copy of `Sample.Web.config` called `Web.config`.
3. Put your [WSDOT Traveler Information API] access code in the `accessCode` section of `Web.config`.

## External resources / libraries used ##

* [WSDOT Traveler Info Icons]
* [RequireJS]
* [LeafletJS]
* [Leaflet.markercluster]

[Set up Git]:https://help.github.com/articles/set-up-git
[WSDOT Traveler Information API]:http://www.wsdot.wa.gov/Traffic/api/
[LeafletJS]:http://leafletjs.com
[Leaflet.markercluster]:https://github.com/Leaflet/Leaflet.markercluster
[RequireJS]://requirejs.org/
[WSDOT Traveler Info Icons]:https://github.com/WSDOT-GIS/WSDOT-Traveler-Info-Icons
