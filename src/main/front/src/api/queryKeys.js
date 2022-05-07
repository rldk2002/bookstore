export const queryKeywords = {
    all: "todos",
    principal: "principal",
    member: "member",
    book: "book",
    bookList: "bookList",
    bookLike: "bookLike",
    bookCart: "bookCart",
    bookReview: "bookReview",
    shippingAddress: "shippingAddress"
};

export const queryKeys = {
    all: ['todos'],
    members: () => [...queryKeys.all, queryKeywords.member],
    member: params => [...queryKeys.members(), ...params],
    books: () => [...queryKeys.all, queryKeywords.book],
    book: params => [...queryKeys.books(), ...params],
    bookLists: () => [...queryKeys.all, queryKeywords.bookList],
    bookList: params => [...queryKeys.bookLists(), ...params],
    bookLikes: () => [...queryKeys.all, queryKeywords.bookLike],
    bookLike: params => [...queryKeys.bookLikes(), ...params],
    bookCarts: () => [...queryKeys.all, queryKeywords.bookCart],
    bookCart: params => [...queryKeys.bookCarts(), ...params],
    bookReviews: () => [...queryKeys.all, queryKeywords.bookReview],
    bookReview: params => [...queryKeys.bookReviews(), ...params],
    shippingAddresses: () => [...queryKeys.all, queryKeywords.shippingAddress],
    shippingAddress: params => [...queryKeys.shippingAddresses(), ...params],
    
};