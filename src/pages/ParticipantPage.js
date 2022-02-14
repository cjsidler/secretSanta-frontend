import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Table } from "react-bootstrap";
import { Stack, Button, Container } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import NewRestForm from "../components/NewRestForm";
import { FaTrashAlt } from "react-icons/fa";

const ParticipantPage = ({
    draws,
    giftExchanges,
    participants,
    restrictions,
    updateParticipant,
    addNewRestriction,
    onDelete,
}) => {
    const { userId, xchgId, drawId, participantId } = useParams();

    const [curDraw, setCurDraw] = useState([]);
    const [curExchange, setCurExchange] = useState([]);
    const [curParticipant, setCurParticipant] = useState([]);
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
            name: partName,
            email: partEmail,
        };

        if (curParticipant[0]) {
            updateParticipant(curParticipant[0].id, updateObj);
            alert("Participant updated!");
        } else {
            alert("Participant was not updated.");
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        setCurExchange(
            giftExchanges.filter(
                (exchange) =>
                    exchange.userId === userId && exchange.id === xchgId
            )
        );
        setCurDraw(
            draws.filter(
                (draw) =>
                    draw.userId === userId &&
                    draw.giftExchangeId === xchgId &&
                    draw.id === drawId
            )
        );
        setCurParticipant(
            participants.filter(
                (participant) =>
                    participant.userId === userId &&
                    participant.giftExchangeId === xchgId &&
                    participant.drawId === drawId &&
                    participant.id === participantId
            )
        );
        setCurRestrictions(
            restrictions.filter(
                (restriction) =>
                    restriction.userId === userId &&
                    restriction.giftExchangeId === xchgId &&
                    restriction.drawId === drawId &&
                    restriction.participantId === participantId
            )
        );
    }, [draws, giftExchanges, participants, restrictions]);

    useEffect(() => {
        curParticipant[0] && setPartName(curParticipant[0].name);
        curParticipant[0] && setPartEmail(curParticipant[0].email);
    }, [curParticipant]);

    return (
        <>
            <Container>
                <Breadcrumb className="small">
                    <Link className="breadcrumb-item" to={`/${userId}`}>
                        Gift Exchanges
                    </Link>
                    <Link
                        className="breadcrumb-item"
                        to={`/${userId}/${xchgId}`}
                    >
                        {curExchange[0] && curExchange[0].name}
                    </Link>
                    <Link
                        className="breadcrumb-item"
                        to={`/${userId}/${xchgId}/${drawId}`}
                    >
                        {curDraw[0] && `${curDraw[0].year.toString()} Drawing`}
                    </Link>

                    <Breadcrumb.Item active>
                        {curParticipant[0] && curParticipant[0].name}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div className="col-sm"></div>
                <div className="col-md">
                    <h1>
                        Edit Participant:{" "}
                        {curParticipant[0] && curParticipant[0].name}
                    </h1>

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
                                onClick={() =>
                                    navigate(`/${userId}/${xchgId}/${drawId}`)
                                }
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
                    {curRestrictions[0] ? (
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
                                            <td>{restriction.name}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        onDelete(restriction.id)
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
                        drawYear={curDraw[0].year}
                        setShowNewRestForm={setShowNewRestForm}
                        showNewRestForm={showNewRestForm}
                        addNewRestriction={addNewRestriction}
                    />
                ) : (
                    <Button
                        onClick={() => setShowNewRestForm(!showNewRestForm)}
                    >
                        New Restriction
                    </Button>
                )}
            </Container>
        </>
    );
};

export default ParticipantPage;
