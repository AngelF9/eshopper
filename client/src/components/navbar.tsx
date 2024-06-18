import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbarTitle">
        <h1>Pushkin Shop</h1>
      </div>
      <div className="navbarLinks">
        <Link to="/"> Shop </Link>

        <Link to="/purchased-items"> Purchased </Link>
        <Link to="/checkout">
          <FontAwesomeIcon icon={faShoppingCart} />
        </Link>
      </div>
    </div>
  );
};
