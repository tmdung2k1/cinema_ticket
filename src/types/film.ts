export type FilmType = {
    ten_phim: string;
    dao_dien?: string;
    anh_gioi_thieu?: string;
    trailer?: string;
    gioi_thieu_noi_dung?:string;
    id_the_loai?: number;
    id_phan_loai?: number;
    ngay_khoi_chieu?: string;
    dang_chieu?: boolean;
}
export type FilmListItem = {
    id: string;
    ten_phim: string;
    anh_gioi_thieu?: string;
    mst_film_genres?: { ten_the_loai?: string } 
    mst_film_ratings?: { ten_phan_loai?: string}
    ngay_khoi_chieu?: string;
} 