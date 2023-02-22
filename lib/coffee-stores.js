import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.API_UNSPLASH_KEY,
});

const getUrlForCoffeeStore = (latLong, query, categories, limit) =>
  `https://api.foursquare.com/v3/places/search?ll=${latLong}&query=${query}&categories=${categories}&limit=${limit}`;

const fetchCoffeePhoto = async () => {
  const unsplash = await unsplashApi.search.getPhotos({
    query: "coffee restaurant",
    orientation: "landscape",
    perPage: 40,
  });
  const photos = unsplash.response.results.map((photo) => photo.urls);

  return photos;
};

export const fetchCoffeeStores = async (
  latLong = "30.285346,31.749376",
  limit = 6
) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.API_FOURSQUARE_KEY,
    },
  };
  const photos = await fetchCoffeePhoto();
  const res = await fetch(
    getUrlForCoffeeStore(latLong, "coffee-stores", 13000, limit),
    options
  );
  const data = await res.json();

  return data.results.map((coffee, i) => {
    return {
      id: coffee.fsq_id,
      name: coffee.name,
      distance: coffee.distance,
      location: coffee.location.formatted_address,
      imgUrl: photos.length > 0 ? photos[i].regular : null,
    };
  });
};
