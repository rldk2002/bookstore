import axios from "axios";


const ajax = axios.create({
    baseURL: "https://localhost:3000"
});

ajax.interceptors.request.use(
    config => {
        // 요청을 보내기 전에 수행할 일
        const token = window.localStorage.getItem("Authorization");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 오류 요청을 보내기전 수행할 일
        return Promise.reject(error);
    }
);

ajax.interceptors.response.use(
    response => {
        const { authorization } = response.headers;
        if (authorization) {
            window.localStorage.setItem("Authorization", authorization);
        }
        // 응답 데이터를 가공
        return response.data;
    },
    async error => {
        const response = error.response;
        // 오류 응답을 처리
        return Promise.reject(response);
    }
);

export default ajax;