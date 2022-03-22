import { useMutation, useQuery } from "react-query";
import ajax from "./axiosInterceptor";
import { queryKeys, queryKeywords } from "./queryKeys";

/** 회원 로그인 */
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

/** 회원 로그인 여부 확인 및 기본 정보 조회 */
export const useAuthentication = () => {
    return useQuery(
        queryKeys.member([queryKeywords.principal]),
        () => ajax.get("/authenticated")
    );
}

/** 회원 로그아웃 */
export const useLogout = () => {
    return useMutation(() => ajax.post("/logout"));
}