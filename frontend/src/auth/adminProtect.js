import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validateToken from "./validateToken";

import {jwtDecode} from "jwt-decode";

const AdminProtect = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await validateToken();

      if (!isValid) {
        // navigate("/registration");
        window.location.replace("/login");
      } else {
        const token = localStorage.getItem("authToken");
        const decoded = jwtDecode(token);
        const role = decoded.role
        if (role !== 'admin'){
            window.location.replace("/");
        }
        else{
            setIsLoading(false);
        }
      }
    };

    checkToken();
  }, [navigate]);

  if (isLoading) {
    return <p>Loading...</p>; 
  }

  return <>{children}</>;
};

export default AdminProtect;
