import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";

const DrawingRow = ({ id, year, onDelete }) => {
    const navigate = useNavigate();
    const { userId, xchgId } = useParams();

    return (
        <tr>
            <td>
                <p>{year} Drawing</p>
            </td>
            <td>
                <Button
                    variant="warning"
                    onClick={() => {
                        navigate(`/${userId}/${xchgId}/${id}`);
                    }}
                >
                    <FaEdit />
                </Button>
            </td>
            <td>
                <Button
                    variant="danger"
                    onClick={() => {
                        onDelete(id);
                    }}
                >
                    <FaTrashAlt />
                </Button>
            </td>
        </tr>
    );
};

export default DrawingRow;
