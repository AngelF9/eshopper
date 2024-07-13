import { useCookies } from "react-cookie";
export const useGetToken = () => {
  // cookies object contains all cookies stored in browser.
  // specifically looking for the 'access_token' cookie.
  const [cookies, _] = useCookies(["access_token"]);

  // returning object with headers property (key) which includes the "authorziation" header
  return { headers: { authorization: cookies.access_token } };
};
