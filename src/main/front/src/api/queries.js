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
            cacheTime: Infinity,
            useErrorBoundary: false,
            onError: err => { console.log(err) }
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
        queryKeys.book([{ itemId: itemId }]),
        () => ajax.get("/books/item/" + itemId), {
            staleTime: Infinity,
            cacheTime: Infinity
        }
    );
}
export const useFetchBookCart = () => {
    return useQuery(
        queryKeys.bookCart([queryKeywords.principal]),
        () => ajax.get("/books/cart"), {
            staleTime: 0,
            cacheTime: 0
        }
    );
};
export const useFetchBookCartSize = () => {
    return useQuery(
        queryKeys.bookCart([queryKeywords.principal, "size"]),
        () => ajax.get("/books/cart/size"), {
            staleTime: 0,
            cacheTime: 0
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
export const useUpdateBookCartCount = () => {
    return useMutation(
        ({ itemId, count }) => ajax.patch("/books/cart/count", null, {
            params: {
                itemId: itemId,
                count: count
            }
        })
    );
}
export const useRemoveBookCart = () => {
    return useMutation(
        ({ itemIds }) => ajax.delete("/books/cart", {
            params: {
                itemIds: itemIds.join(",")
            }
        })
    );
}
export const useToggleBookLike = () => {
    return useMutation(
        ({ itemId }) => ajax.post("/books/like", null, {
            params: {
                itemId: itemId
            }
        })
    );
}
export const useFetchBookLike = (itemId, option) => {
    return useQuery(
        queryKeys.bookLike([queryKeywords.principal, { itemId: itemId }]),
        () => ajax.get("/books/like", {
            params: {
                itemId: itemId
            }
        }), {
            staleTime: 0,
            cacheTime: 0,
            ...option
        }
    );
}
export const useUpdateShippingPlace = () => {
    return useMutation(
        form => ajax.post("/shipping/place", null, {
            params: form
        })
    );
}
export const useFetchShippingPlace = shippingAddressNo => {
    return useQuery(
        queryKeys.shippingAddress([queryKeywords.principal, { shippingAddressNo: shippingAddressNo }]),
        () => ajax.get("/shipping/place", {
            params: {
                no: shippingAddressNo
            }
        }), {
            staleTime: 0,
            cacheTime: 0
        }
    );
}
export const useRemoveShippingPlace = () => {
    return useMutation(
        shippingPlaceNo => ajax.delete("/shipping/place", {
            params: {
                no: shippingPlaceNo
            }
        })
    );
}
export const useFetchShippingPlaces = () => {
    return useQuery(
        queryKeys.shippingAddress([queryKeywords.principal]),
        () => ajax.get("/shipping/place"), {
            staleTime: 0,
            cacheTime: 0
        }
    );
}
export const useFetchShippingPlaceBasicNo = () => {
    return useQuery(
        queryKeys.shippingAddress([queryKeywords.principal, "basic"]),
        () => ajax.get("/shipping/place/basic"), {
            staleTime: 0,
            cacheTime: 0
        }
    );
}