import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useState } from "react";

const NewExchangeForm = ({ userData, showNewExchange, setShowNewExchange, addExchange }) => {
    const [newExchangeName, setNewExchangeName] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();

        if (!newExchangeName) {
            alert("Please enter a name for the new gift exchange!");
            return;
        }

        // if gift exchange name already exists, alert and return
        const giftExchangeExists = userData.giftExchanges.some((exchange) => {
            if (exchange.name === newExchangeName) {
                return true;
            } else {
                return false;
            }
        });

        if (giftExchangeExists) {
            alert("A gift exchange by that name already exists! Please choose a new name!");
            return;
        }

        addExchange(newExchangeName);

        setShowNewExchange(!showNewExchange);
        setNewExchangeName("");
    };

    return (
        <Form className="mb-5" onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="newExchangeName">
                <Form.Label>New Gift Exchange:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter name"
                    onChange={(e) => setNewExchangeName(e.target.value)}
                />
            </Form.Group>

            <Stack direction="horizontal" gap={5}>
                <Button variant="warning" type="button" onClick={() => setShowNewExchange(!showNewExchange)}>
                    Cancel
                </Button>

                <div className="ms-auto"></div>

                <Button type="submit" style={{ color: "white" }}>
                    Create
                </Button>
            </Stack>
        </Form>
    );
};

export default NewExchangeForm;
