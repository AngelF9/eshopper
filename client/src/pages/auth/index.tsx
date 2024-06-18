export const AuthPage = () => {
  return (
    <div className="auth">
      <Register />
      <Login />
    </div>
  );
};

const Register = () => {
  return (
    <div className="auth-container">
      <form>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">UserName</label>
          <input type="text" id="username" />
        </div>
      </form>
    </div>
  );
};

const Login = () => {
  return <div>Login</div>;
};
