import { useState, SyntheticEvent } from "react";
import axios from "axios";
import { UserErrors } from "../../errors";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const AuthPage = () => {
  return (
    <div className="auth">
      <Register />
      <Login />
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    // refering to server -> src -> routes -> user.ts
    try {
      await axios.post("http://localhost:3001/user/register", {
        username,
        password,
      });
      alert("Registration completed! Now Login.");
    } catch (error) {
      if (error.response?.data?.type === UserErrors.USERNAME_ALREADY_EXISTS) {
        alert("ERROR: Username already in use.");
      } else {
        alert("ERROR: Something went wrong");
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">UserName: </label>
          <input
            type="text"
            id="username"
            value={username}
            // on change captures the changes in an input filed...
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // token used to access
  const [_, setCookies] = useCookies(["access_token"]);

  // naviagate between different routes
  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    // refering to server -> src -> routes -> user.ts
    try {
      const result = await axios.post("http://localhost:3001/user/login", {
        username,
        password,
      });
      //  TODO: testing DELETE ME
      setCookies("access_token", result.data.token);
      localStorage.setItem("userID", result.data.userID);
      // using naviagate to route user to shopping page "home page"
      navigate("/");
    } catch (error) {
      let errorMessage: string = "something went wrong";
      switch (error.response?.data?.type) {
        case UserErrors.NO_USER_FOUND:
          errorMessage = "User doesnt exist";
          break;
        case UserErrors.WRONG_CREDENTIALS:
          errorMessage = "Wrong username/password combination";
          break;
      }
      alert("ERROR: " + errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">UserName: </label>
          <input
            type="text"
            id="username"
            value={username}
            // on change captures the changes in an input filed...
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
