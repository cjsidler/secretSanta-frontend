import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";

const ParticipantRow = ({ name, email, secretDraw, participantId, userId, onDelete }) => {
    const { xchgId, drawId } = useParams();
    const navigate = useNavigate();

    return (
        <tr>
            <td>{name}</td>
            <td>{email}</td>
            <td>{secretDraw ? secretDraw : "?"}</td>
            <td>
                <Button
                    variant="warning"
                    onClick={() => navigate(`/giftexchanges/${xchgId}/${drawId}/${participantId}`)}
                >
                    <FaEdit />
                </Button>
            </td>
            <td>
                <Button
                    variant="danger"
                    onClick={() => onDelete({ userId, giftExchangeId: xchgId, drawingId: drawId, participantId })}
                >
                    <FaTrashAlt />
                </Button>
            </td>
        </tr>
    );
};

export default ParticipantRow;
