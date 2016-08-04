/*doc
 ---
 title: Google Maps
 name: 02-google-maps
 category: Maps-Google Maps
 ---

Google maps used for the location pages.

 ```html_example
 
 	<style>
      .large-map {
		height: 400px;
		margin: 1em 0;
	}

	.medium-map {
		height: 400px;
		margin: 1em 0;
	}

	.small-map {
		height: 200px;
		margin: 1em 0;
	}
    </style>


<div class="row">
	<div class="large-map"></div>
</div>
<div class="row">
	<div class="col-md-3"><div class="small-map"></div></div>
	<div class="col-md-3"><div class="small-map"></div></div>
	<div class="col-md-3"><div class="small-map"></div></div>
	<div class="col-md-3"><div class="small-map"></div></div>
</div>




 ```

 ```js_example
var markers = [
	{lat: 34.94841, lng: -81.930392},
	{lat: 35.13755900000001, lng: -81.859742},
	{lat: 35.019708, lng: -81.803915},
	{lat: 35.046423, lng: -82.0928},
	{lat: 35.179237, lng: -82.173985},
	{lat: 34.939363, lng: -82.122854},
	{lat: 34.902319, lng: -81.767056},
	{lat: 34.919875, lng: -82.001704},
	{lat: 34.740023, lng: -82.035148},
	{lat: 34.930905, lng: -81.882552},
	{lat: 35.043285, lng: -81.980855}
]
scpl.locationsMap.new('.large-map', {center: {lat: 34.948315, lng: -81.930379}}, markers);
scpl.locationsMap.new('.small-map', {center: {lat: 34.948315, lng: -81.930379}});
 ```

 */


/**
 * Check to see if we have already made our module container, make it if not
 */

//this creates a namespace to hold our plugins
var scpl = scpl || {};

/**
 * Our library locations plugin
 */
scpl.locationsMap = (function() { 								// creates an iife (immediately invoking function expression)
	'use strict'; 												// JavaScript is loose, this makes it less so.
	
	var activeMaps = [];										// empty array to store our maps in
	var googleSettings = { 										// setting default settings for google maps
		center: {lat: 34.948301, lng: -81.930231},
		zoom: 17
	};

	//Creates new map
	function newMap( selector, googleOptions, markers ) { 		// passing in a selector and options object
		
		var target = document.querySelectorAll( selector ); 	// array containing matching elements
		
		if ( googleOptions ) { 									// if user enters in googleOptions, execute below
			for ( var key in googleOptions ) { 					//overriding anything in googleSettings with what's passed in googleOptions
				googleSettings[key] = googleOptions[key]; 		// replace entry in googleSettings with matching entry in googleOptions
			}
		}
		
		for ( var i = 0; i < target.length; i++ ) { 						// set index to zero, if index is less than # of targets, add one
																			// looping through our number of targets
			var newMap = new google.maps.Map(target[i], googleSettings); 	// Creating new map with googles API. Passing selector & googleSettings

			if ( markers ) newMarker( newMap, markers );					// Create markers

			activeMaps.push( newMap ); 										// making it so we can still access maps we've created
		}

	}

	
	function getActiveMaps() {												//return list of active maps
		console.log(activeMaps);
	}

	function newMarker( map, markers ) {															// Creates newMarkers at given map
		var markerBounds = new google.maps.LatLngBounds();											// Creating lat/long bounds collection

		for (var i = 0; i < markers.length; i++) {	
			var	num = i+1											// Looping through markers
			new google.maps.Marker({																// Google maps API that creates a new marker
				position: markers[i],																// Taking value of markers and assigning position															
				map: map,
				icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + num + '|FF0000|000000'																			// Assigning marker to new created map
			});
			markerBounds.extend( new google.maps.LatLng(markers[i]['lat'], markers[i]['lng']) ); 	// Adding marker to our bounds collection
		}

		map.fitBounds(markerBounds); 																// Tells Google to zoom out to fit bounds to our bounds-collection
	}

	return {
		new: newMap, 		// creating an alias, replacing newMap to new.
		get: getActiveMaps 	// " ", replace getActiveMaps to get.
	}


})();

