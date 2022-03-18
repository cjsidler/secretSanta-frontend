import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import DrawingRow from "../components/DrawingRow";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import PageImage from "../components/PageImage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ExchangePage = ({ userData, onDelete, addNewDrawing, updateGiftExchange }) => {
    const { xchgId } = useParams();
    const giftList = require("../assets/gift-list.png");

    const [curExchange, setCurExchange] = useState();

    const [editName, setEditName] = useState(false);
    const [newExchangeName, setNewExchangeName] = useState("");

    const clickHandler = () => {
        const curYear = new Date().getFullYear();

        // see if drawing for current year already exists
        if (curExchange.draws.some((draw) => draw.year === curYear)) {
            alert("A drawing for the current year already exists!");
            return;
        }

        const newDrawing = {
            drawingYear: curYear,
            giftExchangeId: curExchange._id,
            userId: userData._id,
        };

        addNewDrawing(newDrawing);
    };

    useEffect(() => {
        if (userData) {
            const giftExchanges = userData.giftExchanges;

            setCurExchange(giftExchanges.find((exchange) => exchange._id === xchgId));
        }
    }, [userData]);

    useEffect(() => {
        curExchange && setNewExchangeName(curExchange.name);
    }, [curExchange]);

    const updateNameHandler = () => {
        if (!newExchangeName) {
            alert("Please enter a new name for the exchange!");
            return;
        }

        if (curExchange) {
            updateGiftExchange({
                userId: userData._id,
                giftExchangeId: curExchange._id,
                newName: newExchangeName,
            });
            alert("Exchange name updated!");
        } else {
            alert("Exchange name not updated.");
        }

        setEditName(!editName);
    };

    return (
        <>
            <div className="container">
                <Heading />

                <Row>
                    <div className="col-1"></div>
                    <div className="col-10">
                        <Breadcrumb className="small" style={{ fontSize: "16px" }}>
                            <Link className="breadcrumb-item" to={"/giftexchanges"}>
                                Gift Exchanges
                            </Link>
                            <Breadcrumb.Item active>{curExchange && curExchange.name}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-1"></div>
                </Row>

                <PageImage image={giftList} />

                {editName ? (
                    <>
                        <Row>
                            <Col>
                                <label htmlFor="newExchangeField" hidden>
                                    Edit exchange name:
                                </label>
                                <input
                                    id="newExchangeField"
                                    type="text"
                                    value={newExchangeName}
                                    style={{ fontFamily: "Epilogue", fontWeight: "bold", textAlign: "center" }}
                                    onChange={(e) => {
                                        setNewExchangeName(e.target.value);
                                    }}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col className="mt-3">
                                <Button
                                    size="sm"
                                    className="mb-5"
                                    variant="warning"
                                    style={{ color: "white", fontWeight: "bold" }}
                                    onClick={() => {
                                        setEditName(!editName);
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    size="sm"
                                    className="mb-5"
                                    style={{ color: "white", fontWeight: "bold", marginLeft: "25px" }}
                                    onClick={() => {
                                        updateNameHandler();
                                    }}
                                >
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <>
                        <h1 style={{ fontWeight: 700 }}>{curExchange && curExchange.name}</h1>
                        <Button
                            size="sm"
                            className="mb-2"
                            style={{ color: "white", fontWeight: "bold" }}
                            onClick={() => {
                                setEditName(!editName);
                            }}
                        >
                            Edit Name
                        </Button>
                    </>
                )}

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
                                {curExchange &&
                                    curExchange.draws
                                        .sort((a, b) => b.year - a.year)
                                        .map((draw, i) => {
                                            return (
                                                <DrawingRow
                                                    userData={userData}
                                                    year={draw.year}
                                                    id={draw._id}
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

                <Row>
                    <Col>
                        <Link to={"/giftexchanges"}>
                            <Button variant="warning" style={{ color: "white", fontWeight: "bold" }}>
                                Back
                            </Button>
                        </Link>

                        <Button
                            style={{ color: "white", fontWeight: "bold", marginLeft: "25px" }}
                            onClick={() => clickHandler()}
                        >
                            New Drawing
                        </Button>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ExchangePage;
