import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import GiftExchangeRow from "../components/GiftExchangeRow";
import NewExchangeForm from "../components/NewExchangeForm";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { useState } from "react";

const GiftExchangesPage = ({ user, giftExchanges, addExchange, onDelete }) => {
    const [showNewExchange, setShowNewExchange] = useState(false);

    return (
        <>
            <Breadcrumb className="small">
                <Breadcrumb.Item active>Gift Exchanges</Breadcrumb.Item>
            </Breadcrumb>

            <Link to="/">
                <Button variant="warning">Logout</Button>
            </Link>

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
                    {giftExchanges.map((exchange, i) => {
                        return (
                            <GiftExchangeRow
                                user={user}
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
                    user={user}
                    setShowNewExchange={setShowNewExchange}
                    showNewExchange={showNewExchange}
                    addExchange={addExchange}
                />
            ) : (
                <Button onClick={() => setShowNewExchange(!showNewExchange)}>
                    New Exchange
                </Button>
            )}
        </>
    );
};

export default GiftExchangesPage;
