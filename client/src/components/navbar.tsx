import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import { useContext } from "react";
import { IShopContext, ShopContext } from "../context/shop-context";

export const Navbar = () => {
  const { availableMoney, isAuthenticated, setIsAuthenticated } =
    useContext<IShopContext>(ShopContext);
  const logout = () => {
    setIsAuthenticated(false);
  };
  return (
    <div className="navbar">
      <div className="navbarTitle">
        <h1>Pushkin Shop</h1>
      </div>
      <div className="navbarLinks">
        {isAuthenticated && (
          <>
            <Link to="/"> Shop </Link>
            <Link to="/purchased-items"> Purchased </Link>
            <Link to="/checkout">
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
            <Link to="/auth" onClick={logout}>
              Logout
            </Link>
            <span>${availableMoney.toFixed(2)}</span>
          </>
        )}
      </div>
    </div>
  );
};
