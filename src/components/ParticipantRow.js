import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";

const ParticipantRow = ({ name, email, secretDraw, participantId, userId, onDelete }) => {
    const { xchgId, drawId } = useParams();
    const navigate = useNavigate();

    return (
        <tr>
            <td style={{ paddingBottom: 0 }}>
                <p style={{ margin: 0 }}>{name}</p>
            </td>
            <td style={{ paddingBottom: 0 }}>
                <p style={{ margin: 0 }}>{email}</p>
            </td>
            <td style={{ paddingBottom: 0 }}>
                <p style={{ margin: 0 }}>{secretDraw ? secretDraw : "?"}</p>
            </td>
            <td>
                <Button
                    style={{ color: "white" }}
                    onClick={() => navigate(`/giftexchanges/${xchgId}/${drawId}/${participantId}`)}
                >
                    <FaEdit />
                </Button>
            </td>
            <td>
                <Button
                    variant="danger"
                    onClick={() => {
                        window.confirm("Are you sure you want to delete this gift participant?") &&
                            onDelete({ userId, giftExchangeId: xchgId, drawingId: drawId, participantId });
                    }}
                >
                    <FaTrashAlt />
                </Button>
            </td>
        </tr>
    );
};

export default ParticipantRow;
