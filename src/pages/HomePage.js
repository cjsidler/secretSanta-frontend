import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const santaLogo = require("../assets/santa-logo.png");
    const { user, isLoading, loginWithRedirect, logout } = useAuth0();
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm">
                    <img src={santaLogo} className="App-logo" alt="logo" />
                    <h1 className="font-weight-bold">secretSanta</h1>
                    <h4>gift exchange manager</h4>

                    {!isLoading && !user && <Button onClick={() => loginWithRedirect()}>Login</Button>}
                    {!isLoading && user && <Button onClick={() => navigate("/giftexchanges")}>Gift Exchanges</Button>}
                    {!isLoading && user && (
                        <Button variant="warning" onClick={() => logout()}>
                            Logout
                        </Button>
                    )}
                </div>
                <div className="col-sm"></div>
            </div>
        </div>
    );
};

export default HomePage;
