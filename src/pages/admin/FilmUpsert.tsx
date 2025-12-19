import React, { useState } from "react"
import type { FilmType } from "../../types/film"
import { supabase } from "../../utils/appUtils"


function FilmUpsert() {

    const [ten_phim, setten_phim] = useState('')
    const [dao_dien, setdao_dien] = useState('')
    const [anh_gioi_thieu, setanh_gioi_thieu] = useState('')
    const [trailer, settrailer] = useState('')
    const [gioi_thieu_noi_dung, setgioi_thieu_noi_dung] = useState('')
    const [id_the_loai, setid_the_loai] = useState<number>()
    const [id_phan_loai, setid_phan_loai] = useState<number>()
    const [ngay_khoi_chieu, setngay_khoi_chieu] = useState('')
    const [dang_chieu, setdang_chieu] = useState(false)

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        //gui du lieu len supabase
        const data: FilmType = {
            ten_phim: ten_phim,
            dao_dien: dao_dien,
            anh_gioi_thieu: anh_gioi_thieu,
            trailer: trailer,
            gioi_thieu_noi_dung: gioi_thieu_noi_dung,
            id_the_loai: id_the_loai,
            id_phan_loai: id_phan_loai,
            ngay_khoi_chieu: ngay_khoi_chieu,
            dang_chieu: dang_chieu,
        }
        const res = await supabase.from('films').insert(data)
        if (res.status === 201) {
            alert('Thêm phim thành công')
        } else {
            alert('Thêm phim thất bại')
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2 className="text-center">Thêm phim mới</h2>
                </div>
                <div className="mt-3">
                    <label className="form-label">Tên phim</label>
                    <input onChange={(ev) => setten_phim(ev.target.value)} type="text" className="form-control" /></div>
                <div className="mt-3">
                    <label className="form-label">Đạo diễn</label>
                    <input onChange={(ev) => setdao_dien(ev.target.value)} type="text" className="form-control" /></div>
                <div className="mt-3">
                    <label className="form-label">Ảnh giới thiệu</label>
                    <input onChange={(ev) => setanh_gioi_thieu(ev.target.value)} type="text" className="form-control" /></div>
                <div className="mt-3">
                    <label className="form-label">Trailer</label>
                    <input onChange={(ev) => settrailer(ev.target.value)} type="text" className="form-control" /></div>
                <div className="mt-3">
                    <label className="form-label">Giới thiệu nội dung</label>
                    <input onChange={(ev) => setgioi_thieu_noi_dung(ev.target.value)} type="text" className="form-control" /></div>
                <div className="mt-3">
                    <label className="form-label">Thể loại</label>
                    <input onChange={(ev) => setid_the_loai(Number(ev.target.value))} type="text" className="form-control" /></div>
                <div className="mt-3">
                    <label className="form-label">Phân loại</label>
                    <input onChange={(ev) => setid_phan_loai(Number(ev.target.value))} type="text" className="form-control" /></div>
                <div className="mt-3">
                    <label className="form-label">Ngày khởi chiếu</label>
                    <input onChange={(ev) => setngay_khoi_chieu(ev.target.value)} type="date" className="form-control" /></div>
                <div className="mt-3">
                    <label className="form-label">Đang chiếu</label>
                    <input onChange={(ev) => setdang_chieu(ev.target.checked)} type="checkbox" className="form-check-input mx-2" /></div>
                <div className="mt-4 text-center">
                    <button type="submit" className="btn btn-success">
                        Thêm mới
                    </button>
                </div>
            </form>
        </>
    )
}
export default FilmUpsert