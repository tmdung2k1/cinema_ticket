
// dau ? du lieu co the null
export type Room = {
    id: number;
    room_name?: string;
    created_at?: string;
    create_by?: string;
}
export type RoomListItem = {
    idx?: number;
} & Room;//ke thua tat ca thuoc tinh cua Room