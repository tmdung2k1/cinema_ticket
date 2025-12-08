import { useEffect, useState } from "react";
import { supabase } from "../../utils/appUtils";
import type { RoomListItem } from "../../types/room";
import { Modal } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';


function Room() {
    const [rooms, setRooms] = useState<RoomListItem[]>([]);
    const [Roomname, setRoomName] = useState('')
    async function addRoom() {
        const res = await supabase
            .from('rooms')
            .insert({ room_name: Roomname });
        if (res.status === 201) {
            loadRooms()
            setshow(false)
            setRoomName('')
        }
    }
    async function loadRooms() {
        const { data, error } = await supabase
            .from('rooms')
            .select();
        if (error) {
            alert('xảy ra lỗi: ' + error.message);
            return;
        }
        setRooms(data as RoomListItem[]);
    }
    //xu ly khi vua tai trang xong
    useEffect(() => {
        loadRooms();
    }, []);
    const [show, setshow] = useState(false)
    return (
        <>
            <h1>Room Admin Page</h1>
            <div className="container">
                <div className="row">
                    <div className="col-mt-3">
                        <h2>Danh sách phòng</h2>
                        <div className="mb-3">
                            <button className="btn btn-primary" onClick={() => setshow(true)}>
                                Thêm Phòng
                            </button>
                        </div>
                        <table className="table table-bordered">
                            <thead>
                                <tr className="table-dark text-center">
                                    <th>ID</th>
                                    <th>Tên phòng</th>
                                    <th>Tùy biến</th>
                                </tr>
                            </thead>
                            <tbody> 
                                {
                                    rooms.map((room) =>
                                        <tr key={room.id}>
                                            <td>{room.id}</td>
                                            <td>{room.room_name}</td>
                                            <td className="text-center">
                                                <button className="btn btn-info mx-2 p-2"><i className="bi bi-pencil">Sửa</i></button>
                                                <button className="btn btn-danger mx-2 p-2"><i className="bi bi-trash">Xóa</i></button>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/*form them moi phong*/}
            <Modal show={show} onHide={() => setshow(false)}>
                <Modal.Header closeButton>
                    <h4>Thêm mới phòng</h4>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mt-3">
                            <label className="form-label">Tên Phòng</label>
                            <input type="text" className="form-control"
                                value={Roomname}
                                onChange={e => setRoomName(e.target.value)} />
                        </div>
                        <div className="mt-3">
                            <button type="button" onClick={async () => await addRoom()} className="btn btn-success">
                                Thêm mới
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}
export default Room;