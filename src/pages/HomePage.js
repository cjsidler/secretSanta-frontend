import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";

const santaLogo = require("../assets/santa-logo.png");

const HomePage = ({ userId }) => {
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();

    console.log({ user });

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm">
                    <img src={santaLogo} className="App-logo" alt="logo" />
                    <h1 className="font-weight-bold">secretSanta</h1>
                    <h4>gift exchange manager</h4>

                    {!isAuthenticated && (
                        <Button onClick={() => loginWithRedirect()}>
                            Login
                        </Button>
                    )}
                </div>
                <div className="col-sm"></div>
            </div>
        </div>
    );
};

export default HomePage;
