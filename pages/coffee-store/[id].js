import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Seo from "../../components/head/head";
import useSWR from "swr";
import {
	coffeeStoreDetails,
	img,
	heading,
	boxImg,
	coffeeData,
	addressStyle,
	navigation,
	btn,
} from "../../components/coffee-store/coffee-store.module.scss";
import { ChevronLeft, MapPin, Navigation, Star } from "react-feather";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { isEmpty } from "../../utils";
import { StoreContext } from "../../context/store-context";

export default function CoffeeStore(initialProps) {
	const router = useRouter();

	const id = router.query.id;

	const [coffeeStore, setCoffeeStore] = useState(
		initialProps.coffeeStore || {}
	);

	const {
		state: { coffeeStores },
	} = useContext(StoreContext);

	const handleCreateCoffeeStore = async (coffeeStore) => {
		try {
			const { id, name, vote, imgUrl, location, distance } = coffeeStore;
			const response = await fetch("/api/createCoffeeStore", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					name,
					voting: 0,
					vote,
					imgUrl,
					location: location || "",
					distance: distance || "",
				}),
			});

			const dbCoffeeStore = await response.json();
		} catch (err) {
			console.error("Error creating coffee store", err);
		}
	};

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
					return coffeeStore.id.toString() === id;
				});
				setCoffeeStore(findCoffeeStoreById);
				handleCreateCoffeeStore(findCoffeeStoreById);
			}
		} else {
			handleCreateCoffeeStore(initialProps.coffeeStore);
		}
	}, [id, initialProps.coffeeStore, coffeeStores]);

	const { name = "", distance = "", location = "", imgUrl = "" } = coffeeStore;
	const [votingCount, setVotingCount] = useState(0);

	const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

	useEffect(() => {
		if (data && data.length > 0) {
			setCoffeeStore(data[0]);
			setVotingCount(data[0].voting);
		}
	}, [data]);

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	const handleUpvoteButton = async () => {
		try {
			const response = await fetch("/api/favoriteCoffeeStoreById", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
				}),
			});

			const dbCoffeeStore = await response.json();

			if (dbCoffeeStore && dbCoffeeStore.length > 0) {
				let count = votingCount + 1;
				setVotingCount(count);
			}
		} catch (err) {
			console.error("Error up voting the coffee store", err);
		}
	};

	if (error) {
		return <div>Something went wrong retrieving coffee store page</div>;
	}

	return (
		<>
			<Seo title={`Coffee Connoisseur - ${name}`} />
			<Link href="/" className="back__link">
				<ChevronLeft /> Back
			</Link>

			<div className={coffeeStoreDetails}>
				<div className="container">
					<div className={`${heading} heading`}>
						<h1>
							<span>{name}</span>
						</h1>
					</div>
					<div className={boxImg}>
						<Image
							src={
								imgUrl ||
								"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
							}
							width={1320}
							height={500}
							alt={`Coffee Store - ${name}`}
							className={img}
						/>
						<div className={coffeeData}>
							{location && (
								<div>
									<Link
										href={`https://maps.google.com/?q=${location}`}
										target="_blank"
										className={addressStyle}
									>
										<MapPin /> {location}
									</Link>
								</div>
							)}
							<div className={navigation}>
								<Navigation /> Postal code: {distance}
							</div>
							<button className={`${btn} btn`} onClick={handleUpvoteButton}>
								<Star />
								<span>Up Vote!! ({votingCount})</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export const getStaticProps = async ({ params }) => {
	const coffeeStores = await fetchCoffeeStores();
	const findCoffeeStoreId = coffeeStores.find(
		(coffeeStore) => coffeeStore.id.toString() === params.id
	);
	return {
		props: {
			coffeeStore: findCoffeeStoreId ? findCoffeeStoreId : {},
		},
	};
};

export const getStaticPaths = async (ctx) => {
	const coffeeStores = await fetchCoffeeStores();

	const paths = coffeeStores.map((coffeeStore) => {
		return {
			params: { id: coffeeStore.id.toString() },
		};
	});

	return {
		paths,
		fallback: true,
	};
};
