import { useGetProducts } from "../../hooks/useGetProducts";
import { Product } from "./product";
import "./style.css";

export const ShopPage = () => {
  // grabbing products
  const { products } = useGetProducts();
  return (
    <div className="shop">
      <div className="products">
        {products.map((product) => (
          // display componet 'Product'
          // passing product as a prop
          <Product product={product} />
        ))}
      </div>
    </div>
  );
};
