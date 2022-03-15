import { useMutation } from "react-query";
import ajax from "./axiosInterceptor";


export const useLoginJWT = () => {
    return useMutation(
        form => ajax.post("/login/jwt", null, {
            params: {
                id: form["id"],
                password: form["password"]
            }
        }).then(response => {
            const { Authorization } = response;
            if (Authorization) {	// Access Token
                window.localStorage.setItem("Authorization", Authorization);
            }
            return response;
        })
    );
}