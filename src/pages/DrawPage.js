import Button from "react-bootstrap/Button";
import { Table, Tooltip, OverlayTrigger, Row, Col } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import ParticipantRow from "../components/ParticipantRow";
import NewPartForm from "../components/NewPartForm";
import Heading from "../components/Heading";
import { FaQuestionCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { generate_arrays, generate_secret_draw } from "../helpers/generator";
import PageImage from "../components/PageImage";

const DrawPage = ({ userData, addNewParticipant, onDelete, updateParticipant }) => {
    const santaEmail = process.env.REACT_APP_SANTAGMAILLOGIN;
    const santaPassword = process.env.REACT_APP_SANTAGMAILPASSWORD;
    const emailMicroserviceUrl = process.env.REACT_APP_EMAIL_MICROSERVICE_URL;
    const { xchgId, drawId } = useParams();
    const giftsHighFive = require("../assets/gifts-high-five.png");

    const [curDraw, setCurDraw] = useState();
    const [curExchange, setCurExchange] = useState();
    const [showNewPartForm, setShowNewPartForm] = useState(false);

    useEffect(() => {
        if (userData) {
            const giftExchanges = userData.giftExchanges;
            const foundExchange = giftExchanges.find((exchange) => exchange._id === xchgId);

            setCurExchange(foundExchange);
            setCurDraw(foundExchange.draws.find((draw) => draw._id === drawId));
        }
    }, [userData]);

    const generateHandler = async () => {
        // Generates the secret drawing and updates the participant's in the database with their secret drawing.

        const pyDraw = curExchange.draws.find((draw) => draw.year === curDraw.year - 1);
        const pyParticipants = pyDraw ? pyDraw.participants : [];

        const res_obj = generate_arrays(curDraw.participants, pyParticipants);
        const { part_names, part_ids, valid_draws } = res_obj;
        const secretDrawResult = generate_secret_draw({ part_names, part_ids, valid_draws }, 100);

        if (!secretDrawResult.cleanDraw) {
            alert(
                "Note: A clean drawing was not possible. A user may have drawn a restriction, a prior year draw, or themselves. " +
                    "You can try again by clicking Generate Drawing. If multiple attemps are unsuccessful, you may want to reduce " +
                    " restrictions or add more participants!"
            );
        }

        for (const drawResult of secretDrawResult.draw) {
            updateParticipant({
                userId: userData._id,
                giftExchangeId: xchgId,
                drawingId: drawId,
                participantId: drawResult.id,
                updates: { secretDraw: drawResult.secretDraw },
            });
        }
    };

    const callEmailMicroservice = async (emailObjs) => {
        // takes an array of email objects and sends an email for each
        if (emailObjs.length) {
            for (const emailObj of emailObjs) {
                const emailReqObj = {
                    senderEmail: santaEmail,
                    password: santaPassword,
                    senderName: "Secret Santa",
                    subject: "Your Secret Santa Gift Recipient!",
                    body: `You are getting ${emailObj.secretDraw} a gift!`,
                    htmlTemplate: "Placeholder HTML Template",
                    recipients: [
                        {
                            name: `${emailObj.name}`,
                            email: `${emailObj.email}`,
                        },
                    ],
                };
                try {
                    const res = await fetch(emailMicroserviceUrl, {
                        method: "POST",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify(emailReqObj),
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    const emailHandler = () => {
        const emails = [];
        let count = 0;

        if (curDraw.participants.length > 0) {
            for (const participant of curDraw.participants) {
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

        if (
            count > 0 &&
            window.confirm(
                `You are about to send ${count} emails. Are you sure you want to email ${count} participants? Note: Any participants without an email address or a recipient will not be emailed.`
            )
        ) {
            // fetch POST request to https://cryptic-basin-36672.herokuapp.com/email
            // use emails array (has attributes name, email, and secretDraw)
            callEmailMicroservice(emails);
        } else {
            // alert that the users were not emailed
            alert(
                "Emails were not sent. You may have pressed cancel, participants may not have email addresses, or recipients have not been generated by clicking Generate Drawing."
            );
        }
    };

    return (
        <>
            <div className="container">
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
                            <Breadcrumb.Item active>{curDraw && curDraw.year} Drawing</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-1"></div>
                </Row>

                <PageImage image={giftsHighFive} />

                <h1 style={{ fontWeight: 700 }}>{curDraw && curDraw.year} Drawing</h1>
                <h4>{curExchange && curExchange.name}</h4>

                <div className="row mt-4">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <Table className="table-bordered" style={{ color: "#391400", fontSize: "24px" }}>
                            <thead>
                                <tr>
                                    <th style={{ paddingBottom: "0" }}>
                                        <p style={{ margin: "0", padding: "0" }}>Participant</p>
                                    </th>
                                    <th style={{ paddingBottom: "0" }}>
                                        <p style={{ margin: "0", padding: "0" }}>Email</p>
                                    </th>
                                    <th style={{ paddingBottom: "0" }}>
                                        <p style={{ margin: "0", padding: "0" }}>Recipient</p>
                                    </th>
                                    <th style={{ paddingBottom: "0" }}>
                                        <p style={{ margin: "0", padding: "0" }}>Edit</p>
                                    </th>
                                    <th style={{ paddingBottom: "0" }}>
                                        <p style={{ margin: "0", padding: "0" }}>Delete</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {curDraw &&
                                    curDraw.participants.map((participant, id) => {
                                        return (
                                            <ParticipantRow
                                                name={participant.name}
                                                email={participant.email}
                                                secretDraw={participant.secretDraw}
                                                participantId={participant._id}
                                                userId={userData._id}
                                                onDelete={onDelete}
                                                key={id}
                                            />
                                        );
                                    })}
                            </tbody>
                        </Table>
                    </div>
                    <div className="col-1"></div>
                </div>

                <div className="row mt-4">
                    <div className="col-3"></div>
                    <div className="col-6">
                        {curExchange && showNewPartForm ? (
                            <NewPartForm
                                userData={userData}
                                curDraw={curDraw}
                                drawYear={curDraw.year}
                                showNewPartForm={showNewPartForm}
                                setShowNewPartForm={setShowNewPartForm}
                                addNewParticipant={addNewParticipant}
                            />
                        ) : (
                            <Row>
                                <Col>
                                    <Link to={`/giftexchanges/${xchgId}`}>
                                        <Button variant="warning">Back</Button>
                                    </Link>

                                    <Button
                                        style={{ color: "white", fontWeight: "bold", marginLeft: "25px" }}
                                        onClick={() => setShowNewPartForm(!showNewPartForm)}
                                    >
                                        Add Participant
                                    </Button>
                                </Col>
                            </Row>
                        )}
                    </div>
                    <div className="col-3"></div>
                </div>

                {curDraw && (
                    <Row className="mt-5">
                        <Col>
                            <Button style={{ color: "white", fontWeight: "bold" }} onClick={() => generateHandler()}>
                                Generate Drawing
                            </Button>

                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={"tooltip-top"}>
                                        Click 'Generate Drawing' to Randomize the recipient for each participant! A
                                        warning will appear notifying you if a clean drawing was not possible.
                                    </Tooltip>
                                }
                            >
                                <Button variant="light" style={{ color: "#80695c" }}>
                                    <FaQuestionCircle />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                )}

                {curDraw && (
                    <Row className="mt-3 mb-5">
                        <Col>
                            <Button style={{ color: "white", fontWeight: "bold" }} onClick={() => emailHandler()}>
                                Email Participants
                            </Button>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={"tooltip-top"}>
                                        Click 'Email Participants' to notify all participants who they are getting a
                                        gift for! You will have to accept a confirmation before emails go out.
                                    </Tooltip>
                                }
                            >
                                <Button variant="light" style={{ color: "#80695c" }}>
                                    <FaQuestionCircle />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                )}
            </div>
        </>
    );
};

export default DrawPage;
