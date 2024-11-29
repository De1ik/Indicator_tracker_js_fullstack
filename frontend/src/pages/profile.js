import { Link } from "react-router-dom";
import { Container, Row, Col, Image  } from "react-bootstrap";

const Profile = () => {
  return (
    <>
        <h1>Profile</h1>
        <Link to="/registration" className="btn btn-light mt-3">
            Go to Registration
        </Link>
    </>
  );
};

export default Profile;
