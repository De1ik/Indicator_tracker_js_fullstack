import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validateToken from "./validateToken";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await validateToken();

      if (!isValid) {
        // navigate("/registration");
        window.location.replace("/login");
      } else {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  if (isLoading) {
    return <p>Loading...</p>; 
  }

  return <>{children}</>;
};

export default ProtectedRoute;
