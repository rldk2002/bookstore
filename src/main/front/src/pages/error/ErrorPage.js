import React from 'react';
import NotFound from "./NotFound";
import InternalServerError from "./InternalServerError";
import BadRequest from "./BadRequest";
import Forbidden from "./Forbidden";
import Unauthorized from "./Unauthorized";

const ErrorPage = ({ error }) => {
    const { status } = error;
    
    if (status === 400) {
        return <BadRequest />;
    }
    if (status === 401) {
        return <Unauthorized />;
    }
    if (status === 403) {
        return <Forbidden />;
    }
    if (status === 404) {
        return <NotFound />;
    }
    if (status === 500) {
        return <InternalServerError />;
    }
    
    return (
        <div>
            에러
        </div>
    );
};

export default ErrorPage;