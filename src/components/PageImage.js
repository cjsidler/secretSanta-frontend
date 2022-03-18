import React from "react";

const PageImage = ({ image }) => {
    return (
        <div className="row">
            <div className="col-4"></div>
            <div className="col-4">
                <img src={image} style={{ width: "100%" }} alt="logo" />
            </div>
            <div className="col-4"></div>
        </div>
    );
};

export default PageImage;
