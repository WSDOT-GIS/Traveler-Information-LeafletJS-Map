Traveler Information LeafletJS Map
===========================================

Displays information from the [WSDOT Traveler Information API] on a [LeafletJS] map.

## Requirements ##

* A web server running ASP.NET 4.5. (Other versions of .NET may work, but haven't been tested.)

## Getting started ##

1. [Set up Git].
1. Clone this repository and initialize submodules using this command: `git clone --recurse-submodule https://github.com/WSDOT-GIS/Traveler-Information-LeafletJS-Map`
2. Create a copy of `Sample.Web.config` called `Web.config`.
3. Put your [WSDOT Traveler Information API] access code in the `accessCode` section of `Web.config`.

[Set up Git]:https://help.github.com/articles/set-up-git
[WSDOT Traveler Information API]:http://www.wsdot.wa.gov/Traffic/api/
[LeafletJS]:http://leafletjs.com
