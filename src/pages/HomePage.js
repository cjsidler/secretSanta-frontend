import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const HomePage = () => {
    const santaLogo = require("../assets/santa-logo.png");
    const { user, isLoading, loginWithRedirect, logout } = useAuth0();
    const navigate = useNavigate();

    return (
        <>
            <Row>
                <Col>
                    <img src={santaLogo} className="App-logo" style={{ height: "425px" }} alt="logo" />

                    <h1 className="mt-4 mb-0" style={{ fontWeight: "800", fontSize: "50px" }}>
                        secretSanta
                    </h1>
                    <h4 style={{ fontWeight: "400", fontSize: "18px" }}>gift exchange manager</h4>

                    <div className="mt-4">
                        {!isLoading && !user && (
                            <Row>
                                <Col>
                                    <Button
                                        style={{ color: "white", fontWeight: "bold" }}
                                        onClick={() => loginWithRedirect()}
                                    >
                                        Login
                                    </Button>
                                </Col>
                            </Row>
                        )}

                        {!isLoading && user && (
                            <Row>
                                <Col>
                                    <Button
                                        style={{ color: "white", fontWeight: "bold" }}
                                        onClick={() => navigate("/giftexchanges")}
                                    >
                                        Gift Exchanges
                                    </Button>
                                </Col>
                            </Row>
                        )}

                        {!isLoading && user && (
                            <Row>
                                <Col>
                                    <Button size="sm" variant="warning" onClick={() => logout()}>
                                        Logout
                                    </Button>
                                </Col>
                            </Row>
                        )}
                    </div>
                </Col>
            </Row>
            <Row>
                <p className="mt-5" style={{ fontSize: "12px" }}>
                    Illustrations by <a href="https://icons8.com/illustrations/author/zD2oqC8lLBBA">Icons 8</a> from{" "}
                    <a href="https://icons8.com/illustrations">Ouch!</a>
                </p>
            </Row>
        </>
    );
};

export default HomePage;
