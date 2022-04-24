import { useEffect } from "react";

const useTitle = (title = "Loading...") => {
    useEffect(() => {
        document.title = title;
    },[title]);
};

export default useTitle;