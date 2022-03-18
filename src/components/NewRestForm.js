import { useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Stack, Button, Row } from "react-bootstrap";

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
        <Row className="mt-2 mb-5">
            <div className="col-2"></div>
            <div className="col-8">
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="newRestrictionName">
                        <Form.Label>New restriction:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            onChange={(e) => setNewRestName(e.target.value)}
                        />
                    </Form.Group>
                    <Stack direction="horizontal">
                        <div className="ms-auto"></div>
                        <Button variant="warning" type="button" onClick={() => setShowNewRestForm(!showNewRestForm)}>
                            Cancel
                        </Button>
                        <div className="ms-auto"></div>
                        <Button type="submit" style={{ color: "white", fontWeight: "bold", marginLeft: "25px" }}>
                            Add
                        </Button>
                        <div className="ms-auto"></div>
                    </Stack>
                </Form>
            </div>
            <div className="col-2"></div>
        </Row>
    );
};

export default NewRestForm;
