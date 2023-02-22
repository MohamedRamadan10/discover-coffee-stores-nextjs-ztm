import Image from "next/image";
import Link from "next/link";
import { card, cardTitle, cardImg } from "./card.module.scss";

const CardCoffee = ({ cardHeading, cardImgURL, cardHrefLink }) => {
  return (
    <div className="card">
      <Link href={cardHrefLink} className={card}>
        <div className={cardTitle}>{cardHeading}</div>
        <Image
          src={cardImgURL}
          width={450}
          height={260}
          alt={cardHeading}
          className={cardImg}
        />
      </Link>
    </div>
  );
};

export default CardCoffee;
