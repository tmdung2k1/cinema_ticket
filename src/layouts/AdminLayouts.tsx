
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/appUtils';

function AdminLayouts() {
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            const res = await supabase.auth.getSession()
            if (res.data.session) {
                // Đã đăng nhập
                console.log('Đã đăng nhập');
            } else {
                alert('Bạn cần đăng nhập!');
                // Chuyển hướng về trang đăng nhập 
                navigate('/dang_nhap');
            }
        })();
    },[navigate]);
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-info">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Admin</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li>
                                <a className="nav-link" href="#">Danh sách phòng</a>
                            </li>
                            <li>
                                <a className="nav-link" href="#">Login</a>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="container">
                <Outlet></Outlet>
            </div>
        </>
    )
}
export default AdminLayouts;