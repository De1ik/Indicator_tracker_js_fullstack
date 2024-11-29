const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");
  
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  
    return fetch(url, { ...options, headers });
  };
  
  export default authFetch;
  