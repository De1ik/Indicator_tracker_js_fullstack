import {jwtDecode} from "jwt-decode";

const getUserId = () => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const id = decoded.id
    return id
}


export default getUserId