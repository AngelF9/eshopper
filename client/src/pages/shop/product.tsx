import { useContext } from "react";
import { IShopContext, ShopContext } from "../../context/shop-context";
import { IProduct } from "../../models/interface";

interface Props {
  product: IProduct;
}

export const Product = (props: Props) => {
  const { _id, productName, description, price, stockQuantity, imageURL } =
    props.product;

  const { addToCart, getCartItemCount } = useContext<IShopContext>(ShopContext);

  const count = getCartItemCount(_id);
  console.log(count);

  return (
    <div className="product">
      <img src={imageURL} />
      <div className="description">
        <h3>{productName}</h3>
        <p>{description}</p>
        <p>${price}</p>
        <button className="addToCartBttn" onClick={() => addToCart(_id)}>
          Add To Cart {count > 0 && <> ({count}) </>}
        </button>
        <div className="stock-quantity">
          {stockQuantity === 0 && <h1>OUT OF STOCK</h1>}
        </div>
      </div>
    </div>
  );
};
