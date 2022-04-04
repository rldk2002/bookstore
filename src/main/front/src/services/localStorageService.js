export function saveSearchHistory(query) {
    const source = JSON.parse(window.localStorage.getItem("SearchQueryHistory") || "[]");
    const queries = source.filter(element => element !== query);
    queries.push(query);
    window.localStorage.setItem("SearchQueryHistory", JSON.stringify(queries));
};
export function loadSearchHistory() {
    return JSON.parse(window.localStorage.getItem("SearchQueryHistory") || "[]");
};
export function removeSearchHistory(query) {
    const source = JSON.parse(window.localStorage.getItem("SearchQueryHistory") || "[]");
    const queries = source.filter(element => element !== query);
    window.localStorage.setItem("SearchQueryHistory", JSON.stringify(queries));
};