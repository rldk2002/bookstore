export const queryKeywords = {
    all: "all",
    principal: "principal",
    book: "book",
    bookSearch: "bookSearch",
    bookDibs: "bookDibs",
    bookCart: "bookCart"
};

export const queryKeys = {
    all: [queryKeywords.all],
    books: () => [...queryKeys.all, queryKeywords.book],
    bookSearches: () => [...queryKeys.books(), queryKeywords.bookSearch],
    bookSearch: params => [...queryKeys.bookSearches(), ...params],
    bookDibses: () => [...queryKeys.books(), queryKeywords.bookDibs],
    bookDibs: params => [...queryKeys.bookDibses(), ...params],
    bookCarts: () => [...queryKeys.books(), queryKeywords.bookCart],
    bookCart: params => [...queryKeys.bookCarts(), ...params]
};