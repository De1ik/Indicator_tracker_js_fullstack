import {jwtDecode} from "jwt-decode";

const getUserEmail = () => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const email = decoded.email
    return email
}


export default getUserEmail