import { useRef, useCallback } from "react"
import type { FilmType } from "../../types/film"
import { supabase } from "../../utils/appUtils"
import SelectGenre from "../../components/SelectGenre"

import { useNavigate } from "react-router-dom"
import * as yup from 'yup';
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"


const schema = yup.object({
    ten_phim: yup.string().required("Tên phim là bắt buộc"),
    dao_dien: yup.string(),
    anh_gioi_thieu: yup.mixed(),
    trailer: yup.mixed().optional(),
    gioi_thieu_noi_dung: yup.string().optional(),
    id_the_loai: yup.number().required("Thể loại là bắt buộc"),
    id_phan_loai: yup.number().required("Phân loại là bắt buộc"),
    ngay_khoi_chieu: yup.string().required("Ngày khởi chiếu là bắt buộc"),
    dang_chieu: yup.boolean().optional(),
}).required();

type FilmFormData = yup.InferType<typeof schema>;

// Helper function to get timestamp
const getTimestamp = () => Date.now();

function FilmUpsert() {
    {

        const anh_gioi_thieuRef = useRef<HTMLInputElement>(null);
        const trailerRef = useRef<HTMLInputElement>(null);
        const navigate = useNavigate();

        const {
            control,
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<FilmFormData>({

            // @ts-expect-error - Type incompatibility between yup and react-hook-form
            resolver: yupResolver(schema),
            defaultValues: {
                ten_phim: '',
                dao_dien: '',
                gioi_thieu_noi_dung: '',
                ngay_khoi_chieu: '',
                dang_chieu: false,
            }
        });

        const onSubmit = useCallback(async (data: FilmFormData) => {
            let anh_gioi_thieu = '';
            let trailer = '';

            //upload hinh anh len supabase storage
            const anh_gioi_thieuurl = anh_gioi_thieuRef.current?.files;
            if (anh_gioi_thieuurl && anh_gioi_thieuurl.length > 0) {
                const file = anh_gioi_thieuurl[0];
                const res = await supabase.storage
                    .from('cinema_ticket')
                    .upload(`anh_gioi_thieu/${getTimestamp()}_${file.name}`, file);
                if (res.data) {
                    const url = supabase.storage.from('cinema_ticket').getPublicUrl(res.data.path);
                    anh_gioi_thieu = url.data.publicUrl;
                }
            }
            //upload trailer len supabase storage
            const trailerurl = trailerRef.current?.files;
            if (trailerurl && trailerurl.length) {
                const file = trailerurl[0];
                const res = await supabase.storage
                    .from('cinema_ticket')
                    .upload(`trailer/${getTimestamp()}_${file.name}`, file);
                if (res.data) {
                    const url = supabase.storage.from('cinema_ticket').getPublicUrl(res.data.path)
                    trailer = url.data.publicUrl;
                }
            }

            //gui du lieu len supabase
            const filmData: FilmType = {
                ten_phim: data.ten_phim,
                dao_dien: data.dao_dien,
                anh_gioi_thieu: anh_gioi_thieu,
                trailer: trailer,
                gioi_thieu_noi_dung: data.gioi_thieu_noi_dung,
                id_the_loai: data.id_the_loai,
                id_phan_loai: data.id_phan_loai,
                ngay_khoi_chieu: data.ngay_khoi_chieu,
                dang_chieu: data.dang_chieu || false,
            }
            const res = await supabase.from('films').insert(filmData)
            if (res.status === 201) {
                alert('Thêm phim thành công')

                navigate('/admin/films');
            } else {
                alert('Thêm phim thất bại')
            }
        }, [navigate]);
        return (
            <>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    // @ts-expect-error - Type compatibility with yup schema
                    handleSubmit(onSubmit)(e);
                }} >
                    <div>
                        <h2 className="text-center">Thêm phim mới</h2>
                    </div>
                    <div className="mt-3">
                        <label className="form-label">Tên phim</label>
                        <input {...register("ten_phim")} type="text" className="form-control" />
                        <p className="text-danger">{errors.ten_phim?.message}</p>
                    </div>
                    <div className="mt-3">
                        <label className="form-label">Đạo diễn</label>
                        <input {...register("dao_dien")} type="text" className="form-control" />
                        <p className="text-danger">{errors.dao_dien?.message}</p>
                    </div>
                    <div className="mt-3">
                        <label className="form-label">Ảnh giới thiệu</label>
                        <input {...register("anh_gioi_thieu")} ref={anh_gioi_thieuRef} type="file" accept="image/*" className="form-control" />
                    </div>
                    <div className="mt-3">
                        <label className="form-label">Trailer</label>
                        <input {...register("trailer")} ref={trailerRef} type="file" accept="video/*" className="form-control" />
                    </div>
                    <div className="mt-3">
                        <label className="form-label">Giới thiệu nội dung</label>
                        <input {...register("gioi_thieu_noi_dung")} type="text" className="form-control" />
                        <p className="text-danger">{errors.gioi_thieu_noi_dung?.message}</p>
                    </div>
                    {/* <div className="mt-3">
                    <label className="form-label">Thể loại</label>
                    <input onChange={(ev) => setid_the_loai(Number(ev.target.value))} type="text" className="form-control" /></div> */}
                    <div className="mt-3">
                        <label className="form-label">Thể loại</label>
                        <Controller
                            name="id_the_loai"
                            control={control}
                            render={({ field }) => (
                                <SelectGenre
                                    onChange={(value) => field.onChange(value)}
                                />
                            )}
                        />
                        <p className="text-danger">{errors.id_the_loai?.message}</p>
                    </div>
                    <div className="mt-3">
                        <label className="form-label">Xếp hạng</label>
                        <Controller
                            name="id_phan_loai"
                            control={control}
                            render={({ field }) => (
                            <SelectGenre
                            onChange ={(value) => field.onChange(value)}
                            />
                            )}
                        />
                        <p className="text-danger">{errors.id_phan_loai?.message}</p>
                    </div>
                    <div className="mt-3">
                        <label className="form-label">Ngày khởi chiếu</label>
                        <input {...register("ngay_khoi_chieu")} type="date" className="form-control" />
                        <p className="text-danger">{errors.ngay_khoi_chieu?.message}</p>
                    </div>
                    <div className="mt-3">
                        <label className="form-label">Đang chiếu</label>
                        <input {...register("dang_chieu")} type="checkbox" className="form-check-input mx-2" /></div>
                    <div className="mt-4 text-center">
                        <button type="submit" className="btn btn-success">
                            Thêm mới
                        </button>
                    </div>
                </form>
            </>
        )
    }
}
export default FilmUpsert
