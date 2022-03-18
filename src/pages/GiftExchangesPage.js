import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import GiftExchangeRow from "../components/GiftExchangeRow";
import NewExchangeForm from "../components/NewExchangeForm";
import { useState, useEffect } from "react";
import Heading from "../components/Heading";
import PageImage from "../components/PageImage";

const GiftExchangesPage = ({ userData, addExchange, onDelete }) => {
    const [showNewExchange, setShowNewExchange] = useState(false);
    const [giftExchanges, setGiftExchanges] = useState();
    const gifts = require("../assets/gifts.png");

    useEffect(() => {
        if (userData) {
            setGiftExchanges(userData.giftExchanges);
        }
    }, [userData]);

    return (
        <>
            <div className="container">
                <Heading />
                <PageImage image={gifts} />

                <div className="row mb-3">
                    <h1 className="font-weight-bold" style={{ fontWeight: 700 }}>
                        giftExchanges
                    </h1>
                </div>

                <div className="row mt-4">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <Table className="table-bordered" style={{ color: "#391400" }}>
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

                <div className="row mt-4">
                    <div className="col-3"></div>
                    <div className="col-6">
                        {showNewExchange ? (
                            <NewExchangeForm
                                userData={userData}
                                setShowNewExchange={setShowNewExchange}
                                showNewExchange={showNewExchange}
                                addExchange={addExchange}
                            />
                        ) : (
                            <Button
                                className="mb-5"
                                style={{ color: "white", fontWeight: "bold" }}
                                onClick={() => setShowNewExchange(!showNewExchange)}
                            >
                                New Exchange
                            </Button>
                        )}
                    </div>

                    <div className="col-3"></div>
                </div>
            </div>
        </>
    );
};

export default GiftExchangesPage;
