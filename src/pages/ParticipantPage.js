import { useEffect, useState } from "react";
import { Stack, Button, Container, Form, Row, Breadcrumb } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import NewRestForm from "../components/NewRestForm";
import Heading from "../components/Heading";
import PageImage from "../components/PageImage";

const ParticipantPage = ({ userData, updateParticipant, addNewRestriction, onDelete }) => {
    const { xchgId, drawId, participantId } = useParams();
    const badge = require("../assets/badge.png");

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
            <Container>
                <Heading />

                <Row>
                    <div className="col-1"></div>
                    <div className="col-10">
                        <Breadcrumb className="small" style={{ fontSize: "16px" }}>
                            <Link className="breadcrumb-item" to={"/giftexchanges"}>
                                Gift Exchanges
                            </Link>
                            <Link className="breadcrumb-item" to={`/giftexchanges/${xchgId}`}>
                                {curExchange && curExchange.name}
                            </Link>
                            <Link className="breadcrumb-item" to={`/giftexchanges/${xchgId}/${drawId}`}>
                                {curDraw && curDraw.year} Drawing
                            </Link>
                            <Breadcrumb.Item active>{curParticipant && curParticipant.name}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-1"></div>
                </Row>

                <Row className="mt-3">
                    <PageImage image={badge} />
                </Row>

                <Row className="mt-4">
                    <div className="col">
                        <h1 style={{ fontWeight: 700 }}>{curParticipant && curParticipant.name}</h1>
                        <h4>Edit Participant</h4>

                        <Row>
                            <div className="col-2"></div>
                            <div className="col-8">
                                <Form onSubmit={onSubmit}>
                                    <Form.Group className="mb-3" controlId="newPartName" style={{ textAlign: "left" }}>
                                        <Form.Label>Name:</Form.Label>

                                        <Form.Control
                                            type="text"
                                            placeholder="Enter name"
                                            value={partName}
                                            onChange={(e) => setPartName(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="newPartName" style={{ textAlign: "left" }}>
                                        <Form.Label>Email:</Form.Label>

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
                                            variant="warning"
                                            type="button"
                                            onClick={() => navigate(`/giftexchanges/${xchgId}/${drawId}`)}
                                        >
                                            Back
                                        </Button>

                                        <div className="ms-auto"></div>

                                        <Button style={{ color: "white", fontWeight: "bold" }} type="submit">
                                            Save
                                        </Button>
                                        <div className="ms-auto"></div>
                                    </Stack>
                                </Form>
                            </div>
                            <div className="col-2"></div>
                        </Row>
                    </div>
                </Row>

                <Row className="mt-4">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <span style={{ fontWeight: "bold", display: "inline" }}>Restrictions</span>
                        <p style={{ fontWeight: "400", fontSize: "1rem" }}>
                            Prevent {curParticipant && curParticipant.name} from drawing specific names in the gift
                            exchange by adding restrictions here.
                        </p>

                        {curRestrictions.length > 0 ? (
                            <Table className="table-bordered" style={{ color: "#391400", fontSize: "24px" }}>
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
                            <p style={{ fontSize: "18px" }}>No restrictions currently.</p>
                        )}
                    </div>
                    <div className="col-2"></div>
                </Row>

                <div className="row mt-4">
                    <div className="col-3"></div>
                    <div className="col-6">
                        {showNewRestForm ? (
                            <NewRestForm
                                userData={userData}
                                setShowNewRestForm={setShowNewRestForm}
                                showNewRestForm={showNewRestForm}
                                addNewRestriction={addNewRestriction}
                            />
                        ) : (
                            <Button
                                style={{ color: "white", fontWeight: "bold", marginBottom: "40px" }}
                                onClick={() => setShowNewRestForm(!showNewRestForm)}
                            >
                                New Restriction
                            </Button>
                        )}
                    </div>
                    <div className="col-3"></div>
                </div>
            </Container>
        </>
    );
};

export default ParticipantPage;
