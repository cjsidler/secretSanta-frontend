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

function App() {
    const { user } = useAuth0();
    const dbUrl = process.env.REACT_APP_DB_URL;

    const [userData, setUserData] = useState();

    useEffect(() => {
        if (user) {
            fetchData(user.email);
        }
    }, [user]);

    // Fetch data from server
    const fetchData = async (userEmail) => {
        // takes a user's email and attempts to get their data from the server
        try {
            const userExistsResponse = await fetch(dbUrl + `/user/exists/${userEmail}`);
            const userExists = await userExistsResponse.json();
            let data;

            if (userExists) {
                // fetch an existing user's data
                const existingUser = await fetch(dbUrl + `/user/${user.email}`);
                data = await existingUser.json();
            } else {
                // create a new user's data
                const newUser = await fetch(dbUrl + "/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: user.email }),
                });
                data = await newUser.json();
            }

            setUserData(data);
        } catch (error) {
            console.log(error);
        }
    };

    // Add new gift exchange
    const addExchange = async (exchangeName) => {
        await fetch(dbUrl + "/giftExchange", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ name: exchangeName, _id: userData._id }),
        });

        fetchData(user.email);
    };

    // Remove a gift exchange
    const removeExchange = async (userId, giftExchangeId) => {
        await fetch(dbUrl + "/giftExchange", {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ userId, giftExchangeId }),
        });

        fetchData(user.email);
    };

    // Add a new drawing
    // TODO: Add functionality to bring in participants from previous drawing if it exists.
    const addNewDrawing = async (drawing) => {
        await fetch(dbUrl + "/drawing", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(drawing),
        });

        fetchData(user.email);
    };

    // Add a new participant
    const addNewParticipant = async (participant) => {
        await fetch(dbUrl + "/participant", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(participant),
        });

        fetchData(user.email);
    };

    // Add a new restriction
    const addNewRestriction = async (restriction) => {
        await fetch(dbUrl + "/restriction", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(restriction),
        });

        fetchData(user.email);
    };

    // Remove a drawing
    const removeDrawing = async (deleteObj) => {
        await fetch(dbUrl + "/drawing", {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(deleteObj),
        });

        fetchData(user.email);
    };

    // Remove a participant
    const removeParticipant = async (deleteObj) => {
        await fetch(dbUrl + "/participant", {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(deleteObj),
        });

        fetchData(user.email);
    };

    // Remove restrictions
    const removeRestriction = async (deleteObj) => {
        console.log({ deleteObj });
        await fetch(dbUrl + "/restriction", {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(deleteObj),
        });

        fetchData(user.email);
    };

    // Update gift exchange name
    const updateGiftExchange = async (updateObj) => {
        await fetch(dbUrl + "/giftExchange", {
            method: "PATCH",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(updateObj),
        });

        fetchData(user.email);
    };

    // Update participant with new name/email
    const updateParticipant = async (updateObj) => {
        await fetch(dbUrl + "/participant", {
            method: "PATCH",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(updateObj),
        });

        fetchData(user.email);
    };

    return (
        <div className="App">
            <div className="App-header">
                <Router>
                    <Routes>
                        <Route path="/" exact element={<HomePage />} />

                        <Route
                            path="/giftexchanges"
                            element={
                                <ProtectedComponent
                                    Component={GiftExchangesPage}
                                    userData={userData}
                                    addExchange={addExchange}
                                    onDelete={removeExchange}
                                />
                            }
                        />

                        <Route
                            path="/giftexchanges/:xchgId"
                            element={
                                <ProtectedComponent
                                    Component={ExchangePage}
                                    userData={userData}
                                    onDelete={removeDrawing}
                                    addNewDrawing={addNewDrawing}
                                    updateGiftExchange={updateGiftExchange}
                                />
                            }
                        />

                        <Route
                            path="/giftexchanges/:xchgId/:drawId"
                            element={
                                <ProtectedComponent
                                    Component={DrawPage}
                                    userData={userData}
                                    addNewParticipant={addNewParticipant}
                                    onDelete={removeParticipant}
                                    updateParticipant={updateParticipant}
                                />
                            }
                        />

                        <Route
                            path="/giftexchanges/:xchgId/:drawId/:participantId"
                            element={
                                <ProtectedComponent
                                    Component={ParticipantPage}
                                    userData={userData}
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
