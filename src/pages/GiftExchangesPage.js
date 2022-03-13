import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import GiftExchangeRow from "../components/GiftExchangeRow";
import NewExchangeForm from "../components/NewExchangeForm";
import { Breadcrumb } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const GiftExchangesPage = ({ userData, addExchange, onDelete }) => {
    const [showNewExchange, setShowNewExchange] = useState(false);
    const [giftExchanges, setGiftExchanges] = useState();
    const { logout } = useAuth0();
    const santaLogo = require("../assets/secret-santa-app-logo.png");
    const gifts = require("../assets/gifts.png");

    useEffect(() => {
        if (userData) {
            setGiftExchanges(userData.giftExchanges);
        }
    }, [userData]);

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <img src={santaLogo} style={{ width: "80%" }} alt="logo" />
                    </div>
                    <div className="col-6"></div>
                    <div className="col-3">
                        <Button variant="warning" onClick={() => logout({ returnTo: window.location.origin })}>
                            Logout
                        </Button>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col">
                        <Breadcrumb className="small">
                            <Breadcrumb.Item active>Gift Exchanges</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div> */}
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4">
                        <img src={gifts} style={{ width: "100%" }} alt="logo" />
                    </div>
                    <div className="col-4"></div>
                </div>

                <div className="row mb-3">
                    <h1 className="font-weight-bold" style={{ fontWeight: 700 }}>
                        giftExchanges
                    </h1>
                </div>

                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <Table className="table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {giftExchanges &&
                                    giftExchanges.map((exchange, i) => {
                                        return (
                                            <GiftExchangeRow
                                                userData={userData}
                                                name={exchange.name}
                                                exchange={exchange}
                                                key={i}
                                                onDelete={onDelete}
                                            />
                                        );
                                    })}
                            </tbody>
                        </Table>
                    </div>
                    <div className="col-1"></div>
                </div>
            </div>

            {showNewExchange ? (
                <NewExchangeForm
                    userData={userData}
                    setShowNewExchange={setShowNewExchange}
                    showNewExchange={showNewExchange}
                    addExchange={addExchange}
                />
            ) : (
                <Button className="mb-5" onClick={() => setShowNewExchange(!showNewExchange)}>
                    New Exchange
                </Button>
            )}
        </>
    );
};

export default GiftExchangesPage;
