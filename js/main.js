let restaurants,
    neighborhoods,
    cuisines;
var newMap;
var markers = [];

//Fetch neighborhoods and cuisines as soon as the page is loaded.
document.addEventListener('DOMContentLoaded', () => {
    initMap(); // added 
    fetchNeighborhoods();
    fetchCuisines();
});

//Fetch all neighborhoods and set their HTML.
let fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            const dropdown = document.getElementById('neighborhoods-select');
            //fill in filter options for neighborhoods dropdown
            if (dropdown)
                fillDropdown(self.neighborhoods, dropdown);
        }
    });
};

// Fetch all cuisines and set their HTML.
let fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            const dropdown = document.getElementById('cuisines-select');
            //fill in filter options for cuisines dropdown
            if (dropdown)
                fillDropdown(self.cuisines, dropdown);
        }
    });
};

let fillDropdown = function (options, dropdown) {
    options.forEach(item => {
        const option = document.createElement('option');
        option.innerHTML = item;
        option.value = item;
        option.setAttribute('role', 'option');
        dropdown.append(option);
    });
};


/**
 * Initialize leaflet map, called from HTML.
 */

let initMap = () => {
    self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false,
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1Ijoic25vd3dvbGYzNSIsImEiOiJjamt1ZDhnanYwNXd0M2tycmx0NmY4NGRiIn0.4Y9hG-a0faSdafIauJCXVw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(newMap);

    if (document.getElementById('cuisines-select'))
        updateRestaurants();
};

let updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
let resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    if (self.markers) {
        self.markers.forEach(marker => marker.remove());
    }
    self.markers = [];
    self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
let fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
let createRestaurantHTML = (restaurant) => {
    const li = document.createElement('li');

    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.setAttribute('alt', `Photo of the restaurant "${restaurant.name}"`);
    li.append(image);

    const name = document.createElement('h3');
    name.innerHTML = restaurant.name;
    name.className = 'restaurant-titles';
    li.append(name);

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    neighborhood.className = 'restaurant-neighborhood';
    li.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    address.className = 'restaurant-address';
    li.append(address);

    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.href = DBHelper.urlForRestaurant(restaurant);
    more.className = 'view-details';
    li.append(more);

    return li;
};

//Add markers for current restaurants to the map.
let addMarkersToMap = (restaurants = self.restaurants) => {
    restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
        marker.on("click", onClick);
        function onClick() {
            window.location.href = marker.options.url;
        }
        self.markers.push(marker);
    });

};


