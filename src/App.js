import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import GiftExchangesPage from "./pages/GiftExchangesPage";
import ExchangePage from "./pages/ExchangePage";
import DrawPage from "./pages/DrawPage";
import ParticipantPage from "./pages/ParticipantPage";
import ProtectedComponent from "./auth/ProtectedComponent";
import { useAuth0 } from "@auth0/auth0-react";

// TODO: Add window.confirm to all Deletes

function App() {
    const [userData, setUserData] = useState([]);
    const [giftExchanges, setGiftExchanges] = useState([]);
    const [draws, setDraws] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [restrictions, setRestrictions] = useState([]);
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();

    useEffect(() => {
        const getData = async () => {
            const paths = {
                users: "users",
                giftExchanges: "giftExchanges",
                draws: "draws",
                participants: "participants",
                restrictions: "restrictions",
            };

            const data = await fetchData(paths);
            setUserData(...data.users);
            setGiftExchanges(data.giftExchanges);
            setDraws(data.draws);
            setParticipants(data.participants);
            setRestrictions(data.restrictions);
        };

        getData();
    }, []);

    // Fetch data from server
    const fetchData = async (paths) => {
        const data = {};

        for (const path in paths) {
            const res = await fetch(`http://localhost:5000/${paths[path]}`);
            const resJson = await res.json();
            data[path] = resJson;
        }

        return data;
    };

    // Add new gift exchange
    // TODO: Add functionality to bring in participants from previous drawing if it exists.
    const addExchange = async (exchange) => {
        const res = await fetch("http://localhost:5000/giftexchanges", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(exchange),
        });

        const data = await res.json();

        setGiftExchanges([...giftExchanges, data]);
    };

    // Add a new drawing
    const addNewDrawing = async (drawing) => {
        const res = await fetch("http://localhost:5000/draws", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(drawing),
        });

        const data = await res.json();

        setDraws([...draws, data]);
    };

    // Add a new participant
    const addNewParticipant = async (participant) => {
        const res = await fetch("http://localhost:5000/participants", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(participant),
        });
        const data = await res.json();
        setParticipants([...participants, data]);
    };

    // Add a new restriction
    const addNewRestriction = async (restriction) => {
        const res = await fetch("http://localhost:5000/restrictions", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(restriction),
        });
        const data = await res.json();
        setRestrictions([...restrictions, data]);
    };

    // Remove a gift exchange
    const removeExchange = async (id) => {
        await fetch(`http://localhost:5000/giftexchanges/${id}`, {
            method: "DELETE",
        });

        setGiftExchanges(
            giftExchanges.filter((exchange) => exchange.id !== id)
        );
    };

    // Remove a drawing
    const removeDrawing = async (drawingId) => {
        await fetch(`http://localhost:5000/draws/${drawingId}`, {
            method: "DELETE",
        });

        setDraws(draws.filter((draw) => draw.id !== drawingId));
    };

    // Remove a participant
    const removeParticipant = async (participantId) => {
        await fetch(`http://localhost:5000/participants/${participantId}`, {
            method: "DELETE",
        });

        setParticipants(
            participants.filter(
                (participant) => participant.id !== participantId
            )
        );
    };

    // Remove restrictions
    const removeRestriction = async (restrictionId) => {
        await fetch(`http://localhost:5000/restrictions/${restrictionId}`, {
            method: "DELETE",
        });

        setRestrictions(
            restrictions.filter(
                (restriction) => restriction.id !== restrictionId
            )
        );
    };

    // Update gift exchange name
    const updateGiftExchange = async (giftExchangeId, updateObj) => {
        const res = await fetch(
            `http://localhost:5000/giftexchanges/${giftExchangeId}`,
            {
                method: "PATCH",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(updateObj),
            }
        );

        const data = await res.json();

        setGiftExchanges(
            giftExchanges.map((exchange) =>
                exchange.id === data.id ? data : exchange
            )
        );
    };

    // Update participant with new name/email
    const updateParticipant = async (participantId, updateObj) => {
        const res = await fetch(
            `http://localhost:5000/participants/${participantId}`,
            {
                method: "PATCH",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(updateObj),
            }
        );

        const data = await res.json();

        let result = participants.map((participant) =>
            participant.id === data.id ? data : participant
        );

        setParticipants(result);
    };

    // Update multiple participants with new name/email
    const updateMultParticipants = async (updateObjs) => {
        const updatedParticipants = [];

        for (const obj of updateObjs) {
            const res = await fetch(
                `http://localhost:5000/participants/${obj.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({
                        id: obj.id,
                        secretDraw: obj.secretDraw,
                    }),
                }
            );

            const data = await res.json();

            updatedParticipants.push(data);
        }

        let tempParticipants = [...participants];

        for (const newPart of updatedParticipants) {
            let tempArr = [];

            for (const oldPart of tempParticipants) {
                if (oldPart.id === newPart.id) {
                    tempArr.push(newPart);
                } else {
                    tempArr.push(oldPart);
                }
            }

            tempParticipants = [...tempArr];
        }

        setParticipants(tempParticipants);
    };

    return (
        <div className="App">
            <div className="App-header">
                <Router>
                    <Routes>
                        <Route
                            path="/"
                            exact
                            element={<HomePage userId={userData.id} />}
                        />
                        <Route
                            path="/:userId"
                            element={
                                <ProtectedComponent
                                    Component={GiftExchangesPage}
                                    userData={userData}
                                    giftExchanges={giftExchanges}
                                    addExchange={addExchange}
                                    onDelete={removeExchange}
                                />
                            }
                        />
                        <Route
                            path="/:userId/:xchgId"
                            element={
                                <ExchangePage
                                    draws={draws}
                                    giftExchanges={giftExchanges}
                                    onDelete={removeDrawing}
                                    addNewDrawing={addNewDrawing}
                                    updateGiftExchange={updateGiftExchange}
                                />
                            }
                        />
                        <Route
                            path="/:userId/:xchgId/:drawId"
                            element={
                                <DrawPage
                                    draws={draws}
                                    giftExchanges={giftExchanges}
                                    participants={participants}
                                    restrictions={restrictions}
                                    addNewParticipant={addNewParticipant}
                                    onDelete={removeParticipant}
                                    updateMultParticipants={
                                        updateMultParticipants
                                    }
                                    setParticipants={setParticipants}
                                />
                            }
                        />
                        <Route
                            path="/:userId/:xchgId/:drawId/:participantId"
                            element={
                                <ParticipantPage
                                    draws={draws}
                                    giftExchanges={giftExchanges}
                                    participants={participants}
                                    restrictions={restrictions}
                                    updateParticipant={updateParticipant}
                                    addNewRestriction={addNewRestriction}
                                    onDelete={removeRestriction}
                                />
                            }
                        />
                    </Routes>
                </Router>
            </div>
        </div>
    );
}

export default App;
