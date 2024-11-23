import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the App!</h1>
      <Link to="/register">Go to Registration</Link>
    </div>
  );
};

export default HomePage;
