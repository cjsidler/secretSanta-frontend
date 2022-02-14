import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import DrawingRow from "../components/DrawingRow";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useEffect, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";

const ExchangePage = ({
    draws,
    giftExchanges,
    onDelete,
    addNewDrawing,
    updateGiftExchange,
}) => {
    const { userId, xchgId } = useParams();

    const [curDraws, setCurDraws] = useState([]);
    const [curExchange, setCurExchange] = useState([]);
    const [editName, setEditName] = useState(false);
    const [newExchangeName, setNewExchangeName] = useState("");

    const clickHandler = () => {
        const curYear = new Date().getFullYear();

        // see if drawing for current year already exists
        if (curDraws.some((draw) => draw.year === curYear)) {
            alert("A drawing for the current year already exists!");
            return;
        }

        const newDrawing = {
            year: curYear,
            giftExchangeId: xchgId,
            userId: userId,
        };

        addNewDrawing(newDrawing);
    };

    useEffect(() => {
        setCurDraws(
            draws.filter(
                (draw) =>
                    draw.userId === userId && draw.giftExchangeId === xchgId
            )
        );
        setCurExchange(
            giftExchanges.filter(
                (exchange) =>
                    exchange.userId === userId && exchange.id === xchgId
            )
        );
    }, [draws, giftExchanges]);

    useEffect(() => {
        curExchange[0] && setNewExchangeName(curExchange[0].name);
    }, [curExchange]);

    const updateNameHandler = () => {
        if (!newExchangeName) {
            alert("Please enter a new name for the exchange!");
            return;
        }

        if (curExchange[0]) {
            updateGiftExchange(curExchange[0].id, {
                name: newExchangeName,
            });
            alert("Exchange name updated!");
        } else {
            alert("Exchange name not updated.");
        }

        setEditName(!editName);
    };

    return (
        <>
            <Breadcrumb className="small">
                <Link className="breadcrumb-item" to={`/${userId}`}>
                    Gift Exchanges
                </Link>
                <Breadcrumb.Item active>
                    {curExchange[0] && curExchange[0].name}
                </Breadcrumb.Item>
            </Breadcrumb>

            <Link to="/">
                <Button variant="warning">Logout</Button>
            </Link>

            <h1 className="font-weight-bold">
                {curExchange[0] && curExchange[0].name}
                {editName ? (
                    <Button
                        variant="warning"
                        onClick={() => {
                            updateNameHandler();
                        }}
                    >
                        <FaSave />
                    </Button>
                ) : (
                    <Button
                        variant="warning"
                        onClick={() => {
                            setEditName(!editName);
                        }}
                    >
                        <FaEdit />
                    </Button>
                )}
            </h1>
            {editName && (
                <>
                    <label htmlFor="newExchangeField">
                        Edit exchange name:
                    </label>
                    <input
                        id="newExchangeField"
                        type="text"
                        value={newExchangeName}
                        onChange={(e) => {
                            setNewExchangeName(e.target.value);
                        }}
                    />
                </>
            )}
            <h4>Drawings</h4>

            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {curDraws[0] &&
                        curDraws
                            .sort((a, b) => b.year - a.year)
                            .map((draw, i) => {
                                return (
                                    <DrawingRow
                                        year={draw.year}
                                        id={draw.id}
                                        key={i}
                                        onDelete={onDelete}
                                    />
                                );
                            })}
                </tbody>
            </Table>

            <Link to={`/${userId}`}>
                <Button variant="secondary">Back</Button>
            </Link>

            <Button onClick={() => clickHandler()}>New Drawing</Button>
        </>
    );
};

export default ExchangePage;
