import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const GiftExchangeRow = ({ user, name, exchange, onDelete }) => {
    const navigate = useNavigate();

    return (
        <tr>
            <td>
                <p>{name}</p>
            </td>
            <td>
                <Button
                    variant="warning"
                    onClick={() => navigate(`/${user.id}/${exchange.id}`)}
                >
                    <FaEdit />
                </Button>
            </td>
            <td>
                <Button
                    variant="danger"
                    onClick={() => {
                        window.confirm(
                            "Are you sure you want to delete this gift exchange?"
                        ) && onDelete(exchange.id);
                    }}
                >
                    <FaTrashAlt />
                </Button>
            </td>
        </tr>
    );
};

export default GiftExchangeRow;
