import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const santaLogo = require("../assets/santa-logo.png");

const HomePage = ({ userId }) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm">
                    <img src={santaLogo} className="App-logo" alt="logo" />
                    <h1 className="font-weight-bold">secretSanta</h1>
                    <h4>gift exchange manager</h4>

                    <Link to={`/${userId}`}>
                        <Button>Login</Button>
                    </Link>
                    <small>
                        <p className="text-muted">
                            Forgot password? <strong>Reset</strong>
                        </p>
                        <p className="text-muted">
                            Don't have an account? <strong>Signup</strong>
                        </p>
                    </small>
                </div>
                <div className="col-sm"></div>
            </div>
        </div>
    );
};

export default HomePage;
