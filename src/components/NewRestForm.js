import { useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Stack, Button } from "react-bootstrap";

const NewRestForm = ({ userData, setShowNewRestForm, showNewRestForm, addNewRestriction }) => {
    const { xchgId, drawId, participantId } = useParams();

    const [newRestName, setNewRestName] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();

        if (!newRestName) {
            alert("Please enter a name for the restriction!");
            return;
        }

        const newRestriction = {
            userId: userData._id,
            giftExchangeId: xchgId,
            drawingId: drawId,
            participantId: participantId,
            restrictionName: newRestName,
        };

        addNewRestriction(newRestriction);

        setShowNewRestForm(!showNewRestForm);
        setNewRestName("");
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="newRestrictionName">
                <Form.Label>New restriction name:</Form.Label>
                <Form.Control type="text" placeholder="Enter name" onChange={(e) => setNewRestName(e.target.value)} />
            </Form.Group>

            <Stack direction="horizontal" gap={5}>
                <Button variant="secondary" type="button" onClick={() => setShowNewRestForm(!showNewRestForm)}>
                    Cancel
                </Button>

                <div className="ms-auto"></div>

                <Button variant="warning" type="submit">
                    Add
                </Button>
            </Stack>
        </Form>
    );
};

export default NewRestForm;
