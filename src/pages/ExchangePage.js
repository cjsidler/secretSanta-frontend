import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import DrawingRow from "../components/DrawingRow";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useEffect, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";

const ExchangePage = ({ userData, onDelete, addNewDrawing, updateGiftExchange }) => {
    const { xchgId } = useParams();
    const { logout } = useAuth0();

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

        //userId, giftExchangeId, drawingYear

        const newDrawing = {
            drawingYear: curYear,
            giftExchangeId: curExchange._id,
            userId: userData._id,
        };

        addNewDrawing(newDrawing);
    };

    console.log("Exchange Page: ", { userData });

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
            <Breadcrumb className="small">
                <Link className="breadcrumb-item" to={"/giftexchanges"}>
                    Gift Exchanges
                </Link>
                <Breadcrumb.Item active>{curExchange && curExchange.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Button variant="warning" onClick={() => logout({ returnTo: window.location.origin })}>
                Logout
            </Button>

            <h1 className="font-weight-bold">
                {curExchange && curExchange.name}
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
                    <label htmlFor="newExchangeField">Edit exchange name:</label>
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

            <Link to={"/giftexchanges"}>
                <Button variant="secondary">Back</Button>
            </Link>

            <Button onClick={() => clickHandler()}>New Drawing</Button>
        </>
    );
};

export default ExchangePage;
