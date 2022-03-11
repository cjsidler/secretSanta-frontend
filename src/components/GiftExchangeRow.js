import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const GiftExchangeRow = ({ userData, name, exchange, onDelete }) => {
    const navigate = useNavigate();

    return (
        <tr>
            <td>
                <p>{name}</p>
            </td>
            <td>
                <Button variant="warning" onClick={() => navigate(`/giftexchanges/${exchange._id}`)}>
                    <FaEdit />
                </Button>
            </td>
            <td>
                <Button
                    variant="danger"
                    onClick={() => {
                        window.confirm("Are you sure you want to delete this gift exchange?") &&
                            onDelete(userData._id, exchange._id);
                    }}
                >
                    <FaTrashAlt />
                </Button>
            </td>
        </tr>
    );
};

export default GiftExchangeRow;
