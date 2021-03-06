import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const DrawingRow = ({ userData, id, year, onDelete }) => {
    const navigate = useNavigate();
    const { xchgId } = useParams();

    const [curDrawing, setCurDrawing] = useState();

    useEffect(() => {
        if (userData) {
            const giftExchanges = userData.giftExchanges;
            const curExchange = giftExchanges.find((exchange) => exchange._id === xchgId);
            setCurDrawing(curExchange.draws.find((draw) => draw._id === id));
        }
    }, [userData]);

    return (
        <tr>
            <td>
                <p style={{ margin: 0 }}>{year} Drawing</p>
            </td>
            <td>
                <Button
                    style={{ color: "white" }}
                    onClick={() => {
                        navigate(`/giftexchanges/${xchgId}/${id}`);
                    }}
                >
                    <FaEdit />
                </Button>
            </td>
            <td>
                <Button
                    style={{ color: "white" }}
                    variant="danger"
                    onClick={() => {
                        window.confirm("Are you sure you want to delete this drawing?") &&
                            onDelete({ userId: userData._id, giftExchangeId: xchgId, drawingId: id });
                    }}
                >
                    <FaTrashAlt />
                </Button>
            </td>
        </tr>
    );
};

export default DrawingRow;
