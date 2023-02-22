import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import Banner from "../components/banner/banner";
import CardCoffee from "../components/card/card";
import Seo from "../components/head/head";
import useTrackLocation from "../hooks/track-location";
import { ACTION_TYPES, StoreContext } from "../context/store-context";

export default function Home({ coffeeStoresData }) {
  const router = useRouter();
  const [coffeeStoresNearbyError, setCoffeeStoresNearbyError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  useEffect(() => {
    async function coffeeStoresNearby() {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetch(
            `/api/getCoffeeStoresByLocation?latLong${latLong}&limit=30`
          );
          const coffeeStores = await fetchedCoffeeStores.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores: coffeeStores.coffeeStores },
          });
        } catch (err) {
          setCoffeeStoresNearbyError(err.message);
        }
      }
    }
    coffeeStoresNearby();
  }, [latLong, dispatch]);

  const handleBannerOnClick = () => handleTrackLocation();

  if (router.isFallback) return <div>Loading...</div>;

  return (
    <>
      <Seo title="Coffee Connoisseur" />
      <div className="container">
        <Banner
          title="Coffee"
          secondTitle="Connoisseur"
          description="Discover your local coffee shops!"
          btnText={isFindingLocation ? "Locating..." : "Views stores nearby"}
          handleOnClick={handleBannerOnClick}
          errMsg={
            locationErrorMsg && `Something goes wrong: ${locationErrorMsg}`
          }
        />
        {coffeeStores.length > 0 && (
          <>
            {coffeeStoresNearbyError && (
              <p className="error">Something goes wrong...</p>
            )}
            <div className="heading">
              <h2>Coffee Stores Nearby</h2>
            </div>
            <div className="card__layout">
              {coffeeStores.map(({ id, name, imgUrl }) => (
                <CardCoffee
                  key={id}
                  cardHeading={name}
                  cardImgURL={imgUrl}
                  cardHrefLink={`/coffee-store/${id}`}
                />
              ))}
            </div>
          </>
        )}
        {coffeeStoresData.length > 0 && (
          <>
            <div className="heading">
              <h2>California, USA</h2>
            </div>
            <div className="card__layout">
              {coffeeStoresData.map(({ id, name, imgUrl }) => (
                <CardCoffee
                  key={id}
                  cardHeading={name}
                  cardImgURL={imgUrl}
                  cardHrefLink={`/coffee-store/${id}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export const getStaticProps = async (ctx) => {
  const coffeeStoresData = await fetchCoffeeStores();
  return {
    props: { coffeeStoresData },
  };
};
