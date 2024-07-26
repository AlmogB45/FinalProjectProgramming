import {auth} from "../Firebase/config";
import { signOut } from "firebase/auth";

export const useLogout = () => {
    const logout = async() => {
        try {
            await signOut(auth);
            console.log("logged out")
        }
        catch (err) {
            console.log(err.message)
        }
    }
    return {logout}
}