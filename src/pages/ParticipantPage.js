import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Table } from "react-bootstrap";
import { Stack, Button, Container } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import NewRestForm from "../components/NewRestForm";
import { FaTrashAlt } from "react-icons/fa";

const ParticipantPage = ({ userData, updateParticipant, addNewRestriction, onDelete }) => {
    const { xchgId, drawId, participantId } = useParams();

    const [curExchange, setCurExchange] = useState();
    const [curDraw, setCurDraw] = useState();
    const [curParticipant, setCurParticipant] = useState();
    const [curRestrictions, setCurRestrictions] = useState([]);

    const [partName, setPartName] = useState("");
    const [partEmail, setPartEmail] = useState("");

    const [showNewRestForm, setShowNewRestForm] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        if (!partName) {
            alert("Please enter a name for the participant!");
            return;
        }

        const updateObj = {
            userId: userData._id,
            giftExchangeId: xchgId,
            drawingId: drawId,
            participantId: participantId,
            updates: { name: partName, email: partEmail },
        };

        if (curParticipant) {
            updateParticipant(updateObj);
            alert("Participant updated!");
        } else {
            alert("Participant was not updated.");
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            const giftExchanges = userData.giftExchanges;
            const foundExchange = giftExchanges.find((exchange) => exchange._id === xchgId);
            const foundDraw = foundExchange.draws.find((draw) => draw._id === drawId);
            const foundParticipant = foundDraw.participants.find((participant) => participant._id === participantId);

            setCurExchange(foundExchange);
            setCurDraw(foundDraw);
            setCurParticipant(foundParticipant);
            setCurRestrictions(foundParticipant.restrictions);
            setPartName(foundParticipant.name);
            setPartEmail(foundParticipant.email);
        }
    }, [userData]);

    return (
        <>
            <Breadcrumb className="small">
                <Link className="breadcrumb-item" to={"/giftexchanges"}>
                    Gift Exchanges
                </Link>
                <Link className="breadcrumb-item" to={`/giftexchanges/${xchgId}`}>
                    {curExchange && curExchange.name}
                </Link>
                <Link className="breadcrumb-item" to={`/giftexchanges/${xchgId}/${drawId}`}>
                    {curDraw && `${curDraw.year.toString()} Drawing`}
                </Link>

                <Breadcrumb.Item active>{curParticipant && curParticipant.name}</Breadcrumb.Item>
            </Breadcrumb>
            <Container>
                <div className="col-sm"></div>
                <div className="col-md">
                    <h1>Edit Participant: {curParticipant && curParticipant.name}</h1>

                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="newPartName">
                            <Form.Label>Edit name:</Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={partName}
                                onChange={(e) => setPartName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="newPartName">
                            <Form.Label>Edit email:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={partEmail}
                                onChange={(e) => setPartEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Stack direction="horizontal">
                            <div className="ms-auto"></div>
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => navigate(`/giftexchanges/${xchgId}/${drawId}`)}
                            >
                                Back
                            </Button>

                            <div className="ms-auto"></div>

                            <Button variant="warning" type="submit">
                                Save
                            </Button>
                            <div className="ms-auto"></div>
                        </Stack>
                    </Form>
                </div>
                <div className="col-sm"></div>

                <div className="col">
                    <h5>Restrictions</h5>
                    {curRestrictions.length > 0 ? (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {curRestrictions.map((restriction, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{restriction}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        onDelete({
                                                            userId: userData._id,
                                                            giftExchangeId: xchgId,
                                                            drawingId: drawId,
                                                            participantId: participantId,
                                                            restrictionName: restriction,
                                                        })
                                                    }
                                                >
                                                    <FaTrashAlt />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    ) : (
                        <p>none</p>
                    )}
                </div>

                {showNewRestForm ? (
                    <NewRestForm
                        userData={userData}
                        setShowNewRestForm={setShowNewRestForm}
                        showNewRestForm={showNewRestForm}
                        addNewRestriction={addNewRestriction}
                    />
                ) : (
                    <Button onClick={() => setShowNewRestForm(!showNewRestForm)}>New Restriction</Button>
                )}
            </Container>
        </>
    );
};

export default ParticipantPage;
