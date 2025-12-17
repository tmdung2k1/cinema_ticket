import { useEffect, useState } from "react";
import { supabase } from "../../utils/appUtils";
import type { RoomListItem } from "../../types/room";

import "bootstrap-icons/font/bootstrap-icons.css";
import AppModal from "../../components/AppModal";

function Room() {
    const [rooms, setRooms] = useState<RoomListItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [currentRoom, setCurrentRoom] = useState<{ id?: number; room_name: string }>({
        room_name: "",
    });

    // Load danh sách phòng
    async function loadRooms() {
        const { data, error } = await supabase
            .from("rooms")
            .select("id, room_name")
            .order("id");

        if (error) {
            alert("Lỗi khi tải danh sách phòng: " + error.message);
            return;
        }
        setRooms(data as RoomListItem[]);
    }

    // Thêm phòng mới
    async function addRoom() {
        if (!currentRoom.room_name.trim()) {
            alert("Vui lòng nhập tên phòng!");
            return;
        }

        const { error } = await supabase
            .from("rooms")
            .insert({ room_name: currentRoom.room_name.trim() });

        if (error) {
            alert("Lỗi khi thêm phòng: " + error.message);
        } else {
            loadRooms();
            closeModal();
        }
    }

    // Mở modal sửa phòng
    async function openEditRoom(id: number) {
        const { data, error } = await supabase
            .from("rooms")
            .select("id, room_name")
            .eq("id", id)
            .single();

        if (error) {
            alert("Lỗi khi lấy thông tin phòng: " + error.message);
            return;
        }

        setCurrentRoom({ id: data.id, room_name: data.room_name || "" });
        setModalMode("edit");
        setShowModal(true);
    }

    // Cập nhật phòng
    async function updateRoom() {
        if (!currentRoom.room_name.trim()) {
            alert("Vui lòng nhập tên phòng!");
            return;
        }
        if (!currentRoom.id) return;

        const { error } = await supabase
            .from("rooms")
            .update({ room_name: currentRoom.room_name.trim() })
            .eq("id", currentRoom.id);

        if (error) {
            alert("Lỗi khi cập nhật: " + error.message);
        } else {
            loadRooms();
            closeModal();
        }
    }

    // Xóa nhiều phòng (duy nhất còn lại)
    async function deleteSelectedRooms() {
        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất một phòng để xóa!");
            return;
        }

        if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} phòng đã chọn?`)) return;

        const { error } = await supabase.from("rooms").delete().in("id", selectedIds);

        if (error) {
            alert("Lỗi khi xóa: " + error.message);
        } else {
            loadRooms();
            setSelectedIds([]);
        }
    }

    // Đóng modal và reset form
    function closeModal() {
        setShowModal(false);
        setCurrentRoom({ room_name: "" });
        setModalMode("add");
    }

    // Mở modal thêm mới
    function openAddModal() {
        setCurrentRoom({ room_name: "" });
        setModalMode("add");
        setShowModal(true);
    }

    // Xử lý checkbox
    function toggleSelect(id: number) {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    function toggleSelectAll() {
        if (selectedIds.length === rooms.length && rooms.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(rooms.map((r) => r.id));
        }
    }

    useEffect(() => {
        loadRooms();
    }, []);

    return (
        <>
            <div className="container py-4">
                <h2 className="mb-4">Danh sách phòng</h2>

                <div className="mb-3 d-flex gap-2">
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <i className="bi bi-plus-lg me-2"></i>Thêm Phòng
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={deleteSelectedRooms}
                        disabled={selectedIds.length === 0}
                    >
                        <i className="bi bi-trash me-2"></i>Xóa ({selectedIds.length})
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                            <tr className="text-center">
                                <th style={{ width: "50px" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === rooms.length && rooms.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>ID</th>
                                <th>Tên phòng</th>
                                <th style={{ width: "100px" }}>Tùy biến</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-muted">
                                        Chưa có phòng nào
                                    </td>
                                </tr>
                            ) : (
                                rooms.map((room) => (
                                    <tr key={room.id}>
                                        <td className="text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(room.id)}
                                                onChange={() => toggleSelect(room.id)}
                                            />
                                        </td>
                                        <td>{room.id}</td>
                                        <td>{room.room_name}</td>
                                        <td className="text-center">
                                            {/* Chỉ giữ lại nút Sửa */}
                                            <button
                                                onClick={() => openEditRoom(room.id)}
                                                className="btn btn-info btn-sm"
                                                title="Sửa"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal chung cho Thêm và Sửa */}
            <AppModal
                show={showModal}
                onHide={closeModal}
                headerText={modalMode === "add" ? "Thêm phòng mới" : "Cập nhật phòng"}>
                <div className="mt-3">
                    <label className="form-label fw-bold">Tên phòng</label>
                    <input
                        type="text"
                        className="form-control"
                        value={currentRoom.room_name}
                        onChange={(e) =>
                            setCurrentRoom({ ...currentRoom, room_name: e.target.value })
                        }
                        placeholder="Nhập tên phòng..."
                        autoFocus //khi mo ra thì con trỏ tự động ở trong input
                    />
                </div>

                <div className="mt-4 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        Hủy
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={modalMode === "add" ? addRoom : updateRoom}>
                        {modalMode === "add" ? "Thêm mới" : "Cập nhật"}
                    </button>
                </div>
            </AppModal>
        </>
    );
}

export default Room;