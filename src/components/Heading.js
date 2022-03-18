import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/Button";

const Heading = () => {
    const { logout } = useAuth0();
    const santaLogo = require("../assets/secret-santa-app-logo.png");

    return (
        <>
            <div className="row">
                <div className="col-3">
                    <img src={santaLogo} style={{ width: "80%" }} alt="logo" />
                </div>
                <div className="col-6"></div>
                <div className="col-3" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button variant="warning" onClick={() => logout({ returnTo: window.location.origin })}>
                        Logout
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Heading;
