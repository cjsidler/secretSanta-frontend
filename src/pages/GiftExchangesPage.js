import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import GiftExchangeRow from "../components/GiftExchangeRow";
import NewExchangeForm from "../components/NewExchangeForm";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const GiftExchangesPage = ({ userData, addExchange, onDelete }) => {
    const [showNewExchange, setShowNewExchange] = useState(false);
    const [giftExchanges, setGiftExchanges] = useState();
    const { logout } = useAuth0();

    useEffect(() => {
        if (userData) {
            setGiftExchanges(userData.giftExchanges);
        }
    }, [userData]);

    return (
        <>
            <Breadcrumb className="small">
                <Breadcrumb.Item active>Gift Exchanges</Breadcrumb.Item>
            </Breadcrumb>

            <Button variant="warning" onClick={() => logout({ returnTo: window.location.origin })}>
                Logout
            </Button>

            <h1 className="font-weight-bold">giftExchanges</h1>

            <Table>
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

            {showNewExchange ? (
                <NewExchangeForm
                    userData={userData}
                    setShowNewExchange={setShowNewExchange}
                    showNewExchange={showNewExchange}
                    addExchange={addExchange}
                />
            ) : (
                <Button onClick={() => setShowNewExchange(!showNewExchange)}>New Exchange</Button>
            )}
        </>
    );
};

export default GiftExchangesPage;
