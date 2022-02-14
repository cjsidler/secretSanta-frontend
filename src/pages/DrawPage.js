import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { Link, useParams } from "react-router-dom";
import ParticipantRow from "../components/ParticipantRow";
import NewPartForm from "../components/NewPartForm";
import { FaQuestionCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

import { generate_arrays, generate_secret_draw } from "../helpers/generator";

const DrawPage = ({
    draws,
    giftExchanges,
    participants,
    restrictions,
    addNewParticipant,
    updateParticipant,
    onDelete,
}) => {
    const { userId, xchgId, drawId } = useParams();

    const [curDraw, setCurDraw] = useState([]);
    const [curExchange, setCurExchange] = useState([]);
    const [curParticipants, setCurParticipants] = useState([]);
    const [pyParticipants, setPyParticipants] = useState([]);
    const [curRestrictions, setCurRestrictions] = useState([]);

    const [secretDrawing, setSecretDrawing] = useState([]);

    const [showNewPartForm, setShowNewPartForm] = useState(false);

    // TODO: Fix problem where after Generate Drawing button is pressed,
    // recipients appear to be picked correctly, but not all on the page,
    // will be updated and a refresh will be necessary

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

        setCurParticipants(
            participants.filter(
                (participant) =>
                    participant.userId === userId &&
                    participant.giftExchangeId === xchgId &&
                    participant.drawId === drawId
            )
        );

        setCurRestrictions(
            restrictions.filter(
                (restriction) =>
                    restriction.userId === userId &&
                    restriction.giftExchangeId === xchgId &&
                    restriction.drawId === drawId
            )
        );
    }, [draws, giftExchanges, participants, restrictions]);

    useEffect(() => {
        // We need pyParticipants to be an array of the
        // curParticipants that also participated last year.
        if (curParticipants[0] && curDraw[0]) {
            const pyPartArray = [];
            curParticipants.forEach((part) => pyPartArray.push([]));

            const priorYear = curDraw[0].year - 1;

            // look in draws to see if one exists for current user/exchange/year
            const pyDraw = draws.find(
                (draw) =>
                    draw.userId === userId &&
                    draw.giftExchangeId === xchgId &&
                    draw.year === priorYear
            );

            let pyParts = [];

            // get all users from pyDraw if there is a pyDraw
            if (pyDraw) {
                pyParts = participants.filter(
                    (participant) => participant.drawId === pyDraw.id
                );
            }

            setPyParticipants(pyParts);
        }
    }, [curDraw, draws, participants]);

    useEffect(() => {
        console.log("useEffect run");
        if (secretDrawing[0]) {
            console.log("useEffect run inside if statement");
            let index = 0;

            // Send a participant update to the server for each element in secretDrawing.draw array
            function callUpdateParticipant() {
                setTimeout(function () {
                    const curPart = secretDrawing[0].draw[index];

                    updateParticipant(curPart.id, {
                        secretDraw: curPart.secretDraw,
                    });

                    index++;

                    if (index < secretDrawing[0].draw.length) {
                        callUpdateParticipant();
                    }
                }, 750);
            }

            callUpdateParticipant();

            // If clean drawing was not possible, alert the user
            if (!secretDrawing[0].cleanDraw) {
                alert(
                    "A clean drawing was unfortunately not possible. Each participant's recipient will be updated but a participant may have drawn one of their restrictions or drawn somebody they got a gift for last year. You can try clicking Generate Drawing again or remove some restrictions from the current year's participants."
                );
            }
        }
    }, [secretDrawing]);

    const generateHandler = async () => {
        const res_obj = generate_arrays(
            curParticipants,
            pyParticipants,
            curRestrictions
        );

        const { part_names, part_ids, valid_draws } = res_obj;

        const secretDrawResult = generate_secret_draw(
            { part_names, part_ids, valid_draws },
            100
        );

        const myPromise = new Promise((resolve, reject) => {
            let index = 0;

            while (index < secretDrawResult.draw.length) {
                const curPart = secretDrawResult.draw[index];

                updateParticipant(curPart.id, {
                    secretDraw: curPart.secretDraw,
                });

                index++;
            }

            resolve(secretDrawResult);
        });

        myPromise.then((data) => setSecretDrawing([data]));
    };

    return (
        <>
            <Breadcrumb className="small">
                <Link className="breadcrumb-item" to={`/${userId}`}>
                    Gift Exchanges
                </Link>
                <Link className="breadcrumb-item" to={`/${userId}/${xchgId}`}>
                    {curExchange[0] && curExchange[0].name}
                </Link>
                <Breadcrumb.Item active>
                    {curDraw[0] && curDraw[0].year} Drawing
                </Breadcrumb.Item>
            </Breadcrumb>

            <Link to="/">
                <Button variant="warning">Logout</Button>
            </Link>

            <h1 className="font-weight-bold">
                {curDraw[0] && curDraw[0].year} Drawing
            </h1>
            <h4>{curExchange[0] && curExchange[0].name}</h4>

            <Table>
                <thead>
                    <tr>
                        <th>Participant</th>
                        <th>Email</th>
                        <th>Recipient</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {console.log({ curParticipants })}
                    {curParticipants.map((participant, i) => {
                        return (
                            <ParticipantRow
                                name={participant.name}
                                email={participant.email}
                                secretDraw={participant.secretDraw}
                                participantId={participant.id}
                                onDelete={onDelete}
                                key={i}
                            />
                        );
                    })}
                </tbody>
            </Table>

            <Link to={`/${userId}/${xchgId}`}>
                <Button variant="secondary">Back</Button>
            </Link>

            {curExchange[0] && showNewPartForm ? (
                <NewPartForm
                    drawYear={curDraw[0].year}
                    showNewPartForm={showNewPartForm}
                    setShowNewPartForm={setShowNewPartForm}
                    addNewParticipant={addNewParticipant}
                />
            ) : (
                <Button onClick={() => setShowNewPartForm(!showNewPartForm)}>
                    Add Participant
                </Button>
            )}

            <ButtonGroup>
                <Button variant="warning" onClick={() => generateHandler()}>
                    Generate Drawing
                </Button>

                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={"tooltip-top"}>
                            Click 'Generate Drawing' to Randomize the recipient
                            for each participant! A warning will appear
                            notifying you if a clean drawing was not possible.
                        </Tooltip>
                    }
                >
                    <Button variant="secondary">
                        <FaQuestionCircle />
                    </Button>
                </OverlayTrigger>
            </ButtonGroup>

            <ButtonGroup>
                <Button variant="danger">Email Participants</Button>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={"tooltip-top"}>
                            Click 'Email Participants' to notify all
                            participants who they are getting a gift for! You
                            will have to accept a confirmation before emails go
                            out.
                        </Tooltip>
                    }
                >
                    <Button variant="secondary">
                        <FaQuestionCircle />
                    </Button>
                </OverlayTrigger>
            </ButtonGroup>
        </>
    );
};

export default DrawPage;
