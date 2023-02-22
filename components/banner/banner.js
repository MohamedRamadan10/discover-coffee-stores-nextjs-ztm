import Image from "next/image";
import { banner, brief, btn, img } from "./banner.module.scss";

const Banner = ({
  title,
  secondTitle,
  description,
  handleOnClick,
  btnText,
}) => {
  return (
    <div className={banner}>
      <div className="heading">
        <h1>
          {title} <span>{secondTitle}</span>
        </h1>
      </div>
      <div className={brief}>{description}</div>
      <button className={`${btn} btn`} onClick={handleOnClick}>
        {btnText}
      </button>
      <div className={img}>
        <Image
          src="/images/banner.png"
          width={1200}
          height={831}
          alt="Coffee"
          priority
        />
      </div>
    </div>
  );
};

export default Banner;
