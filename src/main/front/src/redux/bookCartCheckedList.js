const INIT = "bookCart/INIT";
const ADD = "bookCart/ADD";
const REMOVE = "bookCart/REMOVE";

export const init = itemIdList => ({ type: INIT, itemIdList });
export const add = itemId => ({ type: ADD, itemId });
export const remove = itemId => ({ type: REMOVE, itemId });

const initialState = [];

const bookCartCheckedList = (state = initialState, action) => {
    switch (action.type) {
        case INIT:
            return [...action.itemIdList];
        case ADD:
            state = state.slice();
            state.push(action.itemId);
            return state;
        case REMOVE:
            state = state.slice();
            return state.filter(itemId => itemId !== action.itemId);
        default: return state;
    }
}

export default bookCartCheckedList;