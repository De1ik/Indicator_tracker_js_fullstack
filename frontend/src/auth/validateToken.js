const validateToken = async () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      return false;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/validateToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        return true; // Токен валиден
      } else {
        localStorage.removeItem("authToken"); // Удаляем недействительный токен
        return false;
      }
    } catch (err) {
      console.error("Error validating token:", err);
      localStorage.removeItem("authToken");
      return false;
    }
  };

export default validateToken

