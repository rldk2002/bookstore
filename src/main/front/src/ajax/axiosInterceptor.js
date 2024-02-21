import axios from "axios";

const BEARER_PREFIX = "Bearer";

const instance = axios.create({
    baseURL: "https://localhost:3000"
});

instance.interceptors.request.use(config =>
    {
        console.log("Request");

        const accessToken = window.localStorage.getItem("Authorization");

        if (accessToken) {
            config.headers["Authorization"] = `${BEARER_PREFIX} ${accessToken}`;
        }

        return config;
    },
    error => {
        // 오류 요청을 보내기전 수행할 일
        return Promise.reject(error);
    }
);
instance.interceptors.response.use(response =>
    {
        const { url } = response.config;

        if (url === "/members/login") {
            const { Authorization } = response.data;
            window.localStorage.setItem("Authorization", Authorization);
        }

        console.log("Response");

        const { authorization } = response.headers;
        if (authorization) {
            window.localStorage.setItem("Authorization", authorization);
        }

        return response.data;
    },
    async error => {
        const response = error.response;
        // 오류 응답을 처리
        return Promise.reject(response);
    }
);

export default instance;
