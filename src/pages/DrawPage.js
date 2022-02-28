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

const santaEmail = process.env.REACT_APP_SANTAGMAILLOGIN;
const santaPassword = process.env.REACT_APP_SANTAGMAILPASSWORD;

const DrawPage = ({
    draws,
    giftExchanges,
    participants,
    restrictions,
    addNewParticipant,
    onDelete,
    updateMultParticipants,
}) => {
    const { userId, xchgId, drawId } = useParams();

    const [curDraw, setCurDraw] = useState([]);
    const [curExchange, setCurExchange] = useState([]);
    const [curParticipants, setCurParticipants] = useState([]);
    const [pyParticipants, setPyParticipants] = useState([]);
    const [curRestrictions, setCurRestrictions] = useState([]);

    const [showNewPartForm, setShowNewPartForm] = useState(false);

    useEffect(() => {
        setCurDraw(
            draws.filter(
                (draw) =>
                    draw.userId === userId &&
                    draw.giftExchangeId === xchgId &&
                    draw.id === drawId
            )
        );
    }, [draws]);

    useEffect(() => {
        setCurExchange(
            giftExchanges.filter(
                (exchange) =>
                    exchange.userId === userId && exchange.id === xchgId
            )
        );
    }, [giftExchanges]);

    useEffect(() => {
        setCurParticipants(
            participants.filter(
                (participant) =>
                    participant.userId === userId &&
                    participant.giftExchangeId === xchgId &&
                    participant.drawId === drawId
            )
        );
    }, [participants]);

    useEffect(() => {
        setCurRestrictions(
            restrictions.filter(
                (restriction) =>
                    restriction.userId === userId &&
                    restriction.giftExchangeId === xchgId &&
                    restriction.drawId === drawId
            )
        );
    }, [restrictions]);

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

        updateMultParticipants(secretDrawResult.draw);
    };

    const callEmailMicroservice = async (emails) => {
        // takes an array of email objects and sends an email for each
        console.log("Sending emails!");

        if (emails.length) {
            for (const email of emails) {
                const emailReqObj = {
                    senderEmail: santaEmail,
                    password: santaPassword,
                    senderName: "Secret Santa",
                    subject: "Your Secret Santa Gift Recipient!",
                    body: `You are getting ${email.secretDraw} a gift!`,
                    htmlTemplate: "Placeholder HTML Template",
                    recipients: [
                        {
                            name: `${email.name}`,
                            email: `${email.email}`,
                        },
                    ],
                };

                try {
                    const res = await fetch(
                        `https://cryptic-basin-36672.herokuapp.com/email`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                            body: JSON.stringify(emailReqObj),
                        }
                    );
                    console.log(res);
                } catch (e) {
                    console.log(e);
                }
            }
        }

        console.log("Emails sent!");
    };

    const emailHandler = () => {
        const emails = [];
        let count = 0;

        if (curParticipants[0]) {
            for (const participant of curParticipants) {
                if (participant.email && participant.secretDraw) {
                    count += 1;
                    emails.push({
                        name: participant.name,
                        email: participant.email,
                        secretDraw: participant.secretDraw,
                    });
                }
            }
        }

        console.log({ emails });

        if (
            count > 0 &&
            window.confirm(
                `You are about to send ${count} emails. Are you sure you want to email ${count} participants? Note: Any participants without an email address or a recipient will not be emailed.`
            )
        ) {
            // fetch POST request to https://cryptic-basin-36672.herokuapp.com/email
            // use emails array (has attributes name, email, and secretDraw)
            // alert that the users were emailed
            callEmailMicroservice(emails);

            console.log(
                "Request to send emails has been sent! Check with participants to make sure they received their emails!"
            );
        } else {
            // alert that the users were not emailed
            alert(
                "Emails were not sent. You may have pressed cancel, participants may not have email addresses, or recipients have not been generated by clicking Generate Drawing."
            );
            console.log("Users were NOT emailed!");
        }
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
                    {curParticipants.map((participant, id) => {
                        return (
                            <ParticipantRow
                                name={participant.name}
                                email={participant.email}
                                secretDraw={participant.secretDraw}
                                participantId={participant.id}
                                onDelete={onDelete}
                                key={id}
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
                <Button variant="danger" onClick={() => emailHandler()}>
                    Email Participants
                </Button>
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
