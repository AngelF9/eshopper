import { createContext, useState } from "react";

// Interface: Defines the shape of an object.
// They describe the structure that objects should adhere to.
export interface IShopContext {
  // IShopContext should have the following functions
  // addToCart should have the following structure: itemId as argument and return void
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemCount: (newAmount: number, itemId: string) => void;
  getCartItemCount: (itemId: string) => number;
}

// Creates a constant and asigns an empty object.
// The type of 'deafaultVal' is specified as IShopContext.
// Ensuring that 'deafaultVal' adheres to the strucutre define by IShopContext.
const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  getCartItemCount: () => 0,
};

// 'createContext' function creates a new context of type IShopContext, which
// indicates that this context will provide values conforming to IShopContext interface.
// 'defaultVal' is passed as default value.
// This value will be used if component tries to consume the context but is not within Provider
export const ShopContext = createContext<IShopContext>(defaultVal);

// Creating provider.
export const ShopContextProvider = (props) => {
  // type is an object, which has a key(string) and value(number)
  // we added the possibility that there is nothing inside the cart
  // initially we have an empty cart
  const [cartItems, setCartItems] = useState<{ string: number } | {}>({});

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
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  // remove item from cart
  const removeFromCart = (itemId: string) => {};

  // updating the amount of an item we want to buy
  const updateCartItemCount = (newAmount: number, itemId: string) => {};

  const contextValue: IShopContext = {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getCartItemCount,
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
