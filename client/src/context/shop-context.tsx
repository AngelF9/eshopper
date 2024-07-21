import { createContext, useEffect, useState } from "react";
import { useGetProducts } from "../hooks/useGetProducts";
import { IProduct } from "../models/interface";
import { useGetToken } from "../hooks/useGetToken";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

// Interface: Defines the shape of an object.
// They describe the structure that objects should adhere to.
export interface IShopContext {
  // IShopContext should have the following functions
  // addToCart should have the following structure: itemId as argument and return void
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemCount: (newAmount: number, itemId: string) => void;
  getCartItemCount: (itemId: string) => number;
  getTotalCartAmount: () => number;
  checkout: () => void;
  availableMoney: number;
  // IProduct array
  purchasedItems: IProduct[];
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// Creates a constant and asigns an empty object.
// The type of 'deafaultVal' is specified as IShopContext.
// Ensuring that 'deafaultVal' adheres to the strucutre define by IShopContext.
const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  getCartItemCount: () => 0,
  getTotalCartAmount: () => 0,
  checkout: () => null,
  availableMoney: 0,
  purchasedItems: [],
  isAuthenticated: false,
  setIsAuthenticated: () => null,
};

// 'createContext' function creates a new context of type IShopContext, which
// indicates that this context will provide values conforming to IShopContext interface.
// 'defaultVal' is passed as default value.
// This value will be used if component tries to consume the context but is not within Provider
export const ShopContext = createContext<IShopContext>(defaultVal);

// Creating provider.
export const ShopContextProvider = (props) => {
  // importing cookies
  const [cookies, setCookies] = useCookies(["access_token"]);
  // type is an object, which has a key(string) and value(number)
  // we added the possibility that there is nothing inside the cart
  // initially we have an empty cart
  const [cartItems, setCartItems] = useState<{ string: number } | {}>({});
  // to display users money
  // <> defines the type and () sets the default value
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  // state to hold purchased items
  // the type is defined by <>
  // type is of IProduct... because each items is a product. However we want a list of purchased items, thus []
  // <type>(default_value) Here the parenthiese defines the initial value, which is just an empty list
  const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]);
  // when loggin out
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    cookies.access_token !== null,
  );

  const { products } = useGetProducts();

  // vertify token
  const { headers } = useGetToken();
  // once checkout navigate back home
  const navigate = useNavigate();

  // async function bc we are making an api request
  const fetchAvailableMoney = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/user/available-money/${localStorage.getItem("userID")}`,
        { headers },
      );
      setAvailableMoney(res.data.availableMoney);
    } catch (error) {
      alert("ERROR: Something went wrong.");
    }
  };

  // async function bc we are making an api request
  const fetchPurchasedItems = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/product/purchased-items/${localStorage.getItem("userID")}`,
        { headers },
      );
      setPurchasedItems(res.data.purchasedItems);
    } catch (error) {
      alert("ERROR: Something went wrong.");
    }
  };

  // to get the count of an item
  // using the itemId to specify
  const getCartItemCount = (itemId: string) => {
    if (itemId in cartItems) {
      // where itemId is our key and
      // value being accessed is count
      return cartItems[itemId];
    }
    return 0;
  };

  // add item to cart
  const addToCart = (itemId: string) => {
    // if itemId not inside cartItems
    if (!cartItems[itemId]) {
      // set the cartItems to be eqaul to previous value + new item
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      // if item is already in cart just increase count
      // [itemId] allows us to access the value of 'itemId'...
      // without [] we would just have itemId be our key...which is not what we want
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  // remove item from cart
  const removeFromCart = (itemId: string) => {
    // if item not in cart, dont remove it...
    if (!cartItems[itemId]) return;
    // checking to see if zero, dont want to go below zero
    if (cartItems[itemId] == 0) return;
    // prev[itemId] is accessing the previous amount and updating by 1
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  // updating the amount of an item we want to buy
  const updateCartItemCount = (newAmount: number, itemId: string) => {
    // dont want a negative count
    if (newAmount < 0) return;
    // updating itemId with totatally new amount.
    setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
  };

  // total cart amout
  const getTotalCartAmount = (): number => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo: IProduct = products.find(
          (product) => product._id === item,
        );
        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return totalAmount;
  };

  const checkout = async () => {
    // getting useID from local storage... this is where it was saved.
    // using 'localStorage' API
    const body = { customerID: localStorage.getItem("userID"), cartItems };
    try {
      await axios.post("http://localhost:3001/product/checkout", body, {
        headers,
      });
      // once purchased clear the cart.
      setCartItems({});
      // call function to update money on navbar
      fetchAvailableMoney();
      fetchPurchasedItems();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // whenever we render the component, make the api call
  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableMoney();
      fetchPurchasedItems();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.clear();
      setCookies("access_token", null);
    }
  }, [isAuthenticated]);

  const contextValue: IShopContext = {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getCartItemCount,
    getTotalCartAmount,
    checkout,
    availableMoney,
    purchasedItems,
    isAuthenticated,
    setIsAuthenticated,
  };
  return (
    // Wrapping with a context provider.
    // This will tell React: if any component inside this provider asks for ShopContext, give them 'contextValue'
    // 'ShopContext.Provider' component is used to wrap any child component that needs access to the context
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
