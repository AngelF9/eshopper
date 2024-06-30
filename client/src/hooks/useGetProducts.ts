import { useState } from "react";

export const useGetProducts = () => {
  const [products, setProducts] = useState();

  const fetchProducts = async () => {
    const fetchedProducts = await axios.get("http://localhost:3001/product");
    setProducts(fetchedProducts);
  };
  useEffect(() => {});
};
