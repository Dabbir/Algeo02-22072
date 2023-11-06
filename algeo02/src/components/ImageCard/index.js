import Image from "next/image";

const ImageCard = ({ images }) => {
  return (
    <div className="bg-indigo-500">
      <Image src={images} alt="..." width={350} height={350} />
    </div>
  );
};

export default ImageCard;
