import { useMutation, useQuery } from "react-query";
import ajax from "./axiosInterceptor";
import { queryKeys, queryKeywords } from "./queryKeys";

/** 회원 로그인 */
export const useLogin = () => {
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

/** 회원 추가 */
export const useAddMember = () => {
    return useMutation(form  => ajax.post("/member", null, {
            params: form
        })
    );

}

/**
 * 인터파크 도서 책 검색
 * @Url http://book.interpark.com/bookPark/html/bookpinion/api_booksearch.html
 * */
export const useFetchBookQuery = params => {
    return useQuery(
        queryKeys.bookList([params]),
        () => ajax.get("/books/search", {
            params: params
        }), {
            staleTime: Infinity,
            cacheTime: Infinity
        }
    );
}
export const useFetchBookSection = (categoryId, section) => {
    return useQuery(
        queryKeys.bookList([{ categoryId: categoryId, section: section }]),
        () => ajax.get("/books/category/" + categoryId, {
            params: {
                section: section
            }
        }), {
            staleTime: Infinity,
            cacheTime: Infinity
        }
    );
}
export const useFetchBookItem = itemId => {
    return useQuery(
        queryKeys.book({ itemId: itemId }),
        () => ajax.get("/books/item/" + itemId), {
            staleTime: Infinity,
            cacheTime: Infinity
        }
    );
}

export const useAddBookToBookCart = () => {
    return useMutation(
        ({ itemId, count }) => ajax.post("/books/cart", null, {
            params: {
                itemId: itemId,
                count: count
            }
        })
    );
}