import { useEffect } from "react";
import { supabase } from "../../utils/appUtils";

function Room() {
    async function loadRoom()  {
        const {data, error} = await supabase
        .from('rooms')
        .select('');
        if(error){
            alert('xảy ra lỗi: ' + error.message);
            return;
        }
        console.log(data);
    }
    useEffect(() => {
        loadRoom();
    }, []);
    return (
        <>
            <h1>Quản lý phòng chiếu</h1>
        </>
    )
}
export default Room;