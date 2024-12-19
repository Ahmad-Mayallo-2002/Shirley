import Link from "next/link";

export type Product = {
  title: string;
  _id: string;
  image: string;
  price: number;
  category: string;
  description?: string;
  quantity: number;
  author?: string;
};

export default function ProductCard({
  title,
  _id,
  image,
  price,
  category,
  quantity,
}: Product) {
  return (
    <div className="card border-2 p-2 shadow-sm">
      <div className="relative">
        {!quantity && (
          <div
            className="absolute bg-red-500 text-white w-full py-4 text-center text-3xl top-1/2 left-1/2"
            style={{ transform: "translate(-50%,-50%)" }}
          >
            Sold Out
          </div>
        )}
        <img
          src={image}
          alt="Product Image"
          className="w-full h-[200px] mb-2"
        />
      </div>
      <div className="body grid gap-2">
        <h4 className="min-h-[60px]">{title}</h4>
        <p>Category: {category}</p>
        <p>Price: {price}$</p>
        <p>Quantity: {quantity}</p>
      </div>
      <div className="footer mt-2">
        <Link
          href={`/Books/${_id}`}
          className="w-full text-center border-2 px-6 py-2 block special-button w-fit"
        >
          Show More
        </Link>
      </div>
    </div>
  );
}
