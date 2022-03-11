import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useState } from "react";
import { useParams } from "react-router-dom";

const NewPartForm = ({ userData, curDraw, showNewPartForm, setShowNewPartForm, addNewParticipant }) => {
    const { xchgId, drawId } = useParams();

    const [newPartName, setNewPartName] = useState("");
    const [newPartEmail, setNewPartEmail] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();

        if (!newPartName) {
            alert("Please enter a name for the new participant!");
            return;
        }

        // check to see if name already exists in participant list
        const participantExists = curDraw.participants.some((participant) => participant.name === newPartName);

        if (participantExists) {
            alert("A participant by that name already exists in this drawing! Please try a different name.");
            return;
        }

        //userId, giftExchangeId, drawingId, and newParticipant (object with name and email)
        const newParticipantObj = {
            userId: userData._id,
            giftExchangeId: xchgId,
            drawingId: drawId,
            newParticipant: {
                name: newPartName,
                email: newPartEmail,
            },
        };

        addNewParticipant(newParticipantObj);

        setShowNewPartForm(!showNewPartForm);
        setNewPartName("");
        setNewPartEmail("");
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="newPartName">
                <Form.Label>New Participant:</Form.Label>
                <Form.Control type="text" placeholder="Enter name" onChange={(e) => setNewPartName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPartName">
                <Form.Label>Email address:</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    onChange={(e) => setNewPartEmail(e.target.value)}
                />
            </Form.Group>

            <Stack direction="horizontal" gap={5}>
                <Button variant="secondary" type="button" onClick={() => setShowNewPartForm(!showNewPartForm)}>
                    Cancel
                </Button>

                <div className="ms-auto"></div>

                <Button variant="primary" type="submit">
                    Add
                </Button>
            </Stack>
        </Form>
    );
};

export default NewPartForm;
