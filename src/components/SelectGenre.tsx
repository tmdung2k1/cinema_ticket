import { useEffect, useState } from "react";
import { supabase } from "../utils/appUtils";

type SelectGenreProps = {
    selectedID?: number;
    onChange?: (genreID: number) => void 
}

function SelectGenre({selectedID, onChange}: SelectGenreProps) {
    const [genres, setGenre] = useState<{ id: number, name: string }[]>([])
    useEffect(() => {
        supabase.from("mst_film_genres")
            .select()
            .then(res => {
                if (!res.data) return;
                setGenre(res.data.map(i => ({
                    id: i.id,
                    name: i.ten_the_loai
                })))
            });
    }, []);
    return (
        <>
        <select value={selectedID} onChange={(ev) => onChange && onChange(Number(ev.target.value))} className="form-select">
            <option value={0}>--- chọn 1 giá trị ---</option>
            {
                genres.map(genre => (
                    <option key={genre.id}
                    
                    value={genre.id}>{genre.name}</option>
                ))
            }
        </select>
        </>
    )
}
export default SelectGenre;