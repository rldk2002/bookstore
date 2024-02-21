import { atom } from "recoil";

const bookCartCheckListState = atom({
    key: 'bookCartCheckListState',
    default: [],
});

export { bookCartCheckListState };