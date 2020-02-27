const apiKey = "4e6d3e72a1dbf70cdfe7c88719a34218"; //todo env file
const cityId = 82; //Lisbon
const cuisineId = 83; //Seafood
const url = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&cuisines=${cuisineId}`;
const restaurantContainer = document.getElementById("restaurants");
const priceLow = document.getElementById("lowPrice");
const priceMedium = document.getElementById("mediumPrice");
const priceHigh = document.getElementById("highPrice");
const buttonFilter = document.getElementById("filterButton");
const ratingButton = document.getElementById("rating-button");
let filteredList;
const bookTable = "Book";
const noTableBooking = "";
let newFilteredList

//Fetches data from API
//Look into using Axios instead of fetch
fetch(url, {
  headers: { "user-key": apiKey }
})
  .then(response => {
    return response.json()
  })
  .then(json => {
    filteredList = json.restaurants
    newFilteredList = json.restaurants

    showRestaurants();

    buttonFilter.addEventListener("click", filterPrice)
    ratingButton.addEventListener("click", sortByRating)
  })

// Declare functions for reuse at bottom of file


//Show restaurants
const showRestaurants = () => {
  restaurantContainer.innerHTML = " ";

  filteredList.forEach(resto => {
    restaurantContainer.innerHTML +=
      `<a href= ${resto.restaurant.url} class="resturant-card"> 
      <img class="restaurant-image" src= ${
      resto.restaurant.photos[0].photo.thumb_url
      }>
    <h3>${resto.restaurant.name}</h3> 
    <div class="b-a-container">
    <p class="address">${resto.restaurant.location.address}</p>
    <button class="booking-button" id="booking-button">${tableBooking(
        resto.restaurant.has_table_booking
      )}</button>
    </div>
    <br>
    <p class="average-cost">${priceSymbol(
        resto.restaurant.average_cost_for_two
      )} <img class="smiley" src="${smileIcon(
        resto.restaurant.user_rating.aggregate_rating
      )}" alt="smiley">${resto.restaurant.user_rating.aggregate_rating}</p>
    </a>`;
  });
};

//filters restaurants on price range
const filterPrice = () => {

  if (priceLow.checked) {
    filteredList = newFilteredList.filter(
      item => item.restaurant.average_cost_for_two <= 35
    );
  } else if (priceMedium.checked) {
    filteredList = newFilteredList.filter(
      item =>
        item.restaurant.average_cost_for_two > 35 &&
        item.restaurant.average_cost_for_two < 60
    );
  } else if (priceHigh.checked) {
    filteredList = newFilteredList.filter(
      item => item.restaurant.average_cost_for_two >= 60
    );
  }
  showRestaurants();
};

//sort restaurants by aggregated rating
const sortByRating = () => {
  filteredList.sort(
    (a, b) =>
      b.restaurant.user_rating.aggregate_rating -
      a.restaurant.user_rating.aggregate_rating
  );
  showRestaurants();
};


//Choosing euro sign/-s from average cost
const priceSymbol = cost => {
  if (cost <= 35) {
    return "€";
  } else if (cost >= 60) {
    return "€€€";
  } else {
    return "€€";
  }
};

//Choosing smiley from rating
//Replace multiple elseifs with switch statement
const smileIcon = ratingScore => {
  if (ratingScore <= 0.9) {
    iconPath = "smileyicons/1.svg";
  } else if (ratingScore <= 1.9) {
    iconPath = "smileyicons/2.svg";
  } else if (ratingScore <= 2.9) {
    iconPath = "smileyicons/3.svg";
  } else if (ratingScore <= 3.9) {
    iconPath = "smileyicons/4.svg";
  } else if (ratingScore <= 5) {
    iconPath = "smileyicons/5.svg";
  } else {
    iconPath = "smileyicons/cool.svg";
  }
  return iconPath;
};

const tableBooking = booking => {
  if (booking === 1) {
    booking = bookTable;
  } else {
    booking = noTableBooking;
  }
  return booking;
};
