
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/appUtils";
import type { FilmListItem } from "../../types/film";



function Film() {
    const [listFilms, setListFilms] = useState<FilmListItem[]>();

    useEffect(() => {
        //lay danh sach phim tu supabase
        supabase
            .from('films')
            .select(`
            id,
            ten_phim,
            anh_gioi_thieu,
            mst_film_genres(ten_the_loai),
            mst_film_ratings(ten_phan_loai),
            ngay_khoi_chieu
            `)
            .then((res) => {
                setListFilms(res.data as FilmListItem[]);
            });
    }, []);
    return (
        <>
            <h1>Trang Danh Sách Phim</h1>
            <Link to="/admin/film/create" className="btn btn-primary mb-3">Thêm Phim Mới</Link>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Tên Phim</th>
                        <th>Poster</th>
                        <th>Thể Loại</th>
                        <th>Phân Loại</th>
                        <th>Ngày Khởi Chiếu</th>
                        <th></th>
                    </tr>

                    {/* hien thi danh sach phim */}
                    {listFilms?.map((film, index) => (
                        <tr key={film.id}>
                            <td>{index + 1}</td>
                            <td>{film.ten_phim}</td>
                            <td>
                                <img src={film.anh_gioi_thieu} alt={film.ten_phim} width={100} className="img_anh_gioi_thieu" />
                            </td>
                            <td>{film?.mst_film_genres?.ten_the_loai}</td>
                            <td>{film?.mst_film_ratings?.ten_phan_loai}</td>
                            <td>{film.ngay_khoi_chieu}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
export default Film;