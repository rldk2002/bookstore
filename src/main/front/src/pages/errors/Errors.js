import React from 'react';

const Errors = ({ error }) => {
    const { status } = error;

    switch (status) {
        case 400:
            return <div>400</div>;
        case 401:
            return <div>401</div>;
        case 500:
            return <div>500</div>;
        default:
            return <div>에러</div>;
    }
};

export default Errors;