import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useState } from "react";
import { useParams } from "react-router-dom";

const NewPartForm = ({
    drawYear,
    showNewPartForm,
    setShowNewPartForm,
    addNewParticipant,
}) => {
    const { userId, xchgId, drawId } = useParams();

    const [newPartName, setNewPartName] = useState("");
    const [newPartEmail, setNewPartEmail] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();

        if (!newPartName) {
            alert("Please enter a name for the new participant!");
            return;
        }

        const newParticipant = {
            name: newPartName,
            email: newPartEmail,
            userId: userId,
            giftExchangeId: xchgId,
            year: drawYear,
            drawId: drawId,
            secretDraw: "",
        };

        addNewParticipant(newParticipant);

        setShowNewPartForm(!showNewPartForm);
        setNewPartName("");
        setNewPartEmail("");
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="newPartName">
                <Form.Label>New Participant:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter name"
                    onChange={(e) => setNewPartName(e.target.value)}
                />
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
                <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setShowNewPartForm(!showNewPartForm)}
                >
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
