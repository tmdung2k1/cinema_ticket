import { useEffect, useState } from "react";
import { supabase } from "../../utils/appUtils";
import type { RoomListItem } from "../../types/room";

import "bootstrap-icons/font/bootstrap-icons.css";
import AppModal from "../../components/AppModal";
import { useForm } from "react-hook-form";
//xac thuc du lieu
type Input = {
    room_name: string;
}

function Room() {
    const [rooms, setRooms] = useState<RoomListItem[]>([]);
    const { formState: { errors }, register, handleSubmit, setValue } = useForm<Input>();
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
        setValue("room_name", data.room_name || "");
        setModalMode("edit");
        setShowModal(true);
    }

    // Cập nhật phòng
    async function updateRoom(roomName: string) {
        if (!currentRoom.id) return;

        const { error } = await supabase
            .from("rooms")
            .update({ room_name: roomName.trim() })
            .eq("id", currentRoom.id);

        if (error) {
            alert("Lỗi khi cập nhật: " + error.message);
        } else {
            loadRooms();
            closeModal();
        }
    }

    // Xử lý submit form (thêm hoặc sửa)
    async function onSubmit(data: Input) {
        if (modalMode === "add") {
            const { error } = await supabase
                .from("rooms")
                .insert({ room_name: data.room_name.trim() });

            if (error) {
                alert("Lỗi khi thêm phòng: " + error.message);
            } else {
                loadRooms();
                closeModal();
            }
        } else {
            await updateRoom(data.room_name);
        }
    }

    // Xóa nhiều phòng đã chọn
    async function deleteSelectedRooms() {
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
        setValue("room_name", "");
        setModalMode("add");
    }

    // Mở modal thêm mới
    function openAddModal() {
        setCurrentRoom({ room_name: "" });
        setValue("room_name", "");
        setModalMode("add");
        setShowModal(true);
    }

    // Xử lý checkbox
    function toggleSelect(id: number) {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]//nếu đã chọn rồi thì bỏ chọn, chưa chọn thì thêm vào mảng
        );
    }

    function toggleSelectAll() { //khi bấm vào checkbox này thì sẽ chọn hết hoặc bỏ chọn hết
        if (selectedIds.length === rooms.length && rooms.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(rooms.map((r) => r.id));
        }
    }
    // Load danh sách phòng khi component mount
    useEffect(() => { //cu phap useEffect này để gọi hàm loadRooms khi component được render lần đầu tiên
        (() => {
            loadRooms();
        })();
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
                                        onChange={toggleSelectAll}//khi bấm vào checkbox này thì sẽ chọn hết hoặc bỏ chọn hết
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
                            ) :
                                (rooms.map((room) => (
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
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-3">
                            <label className="form-label fw-bold">Tên phòng</label>
                            <input
                                {...register("room_name", { required: "Tên phòng là bắt buộc" })}
                                className="form-control"
                                placeholder="Nhập tên phòng..."
                                autoFocus
                            />
                            {errors.room_name && (
                                <span className="text-danger">{errors.room_name.message}</span>
                            )}
                        </div>
                        <div className="mt-4 d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary">
                                {modalMode === "add" ? "Thêm Phòng" : "Cập Nhật"}
                            </button>
                        </div>
                    </form>
                </>
            </AppModal>
        </>
    );
}
export default Room;

