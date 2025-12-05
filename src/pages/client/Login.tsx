import { useState } from "react";
import { supabase } from "../../utils/appUtils.tsx";
import { useNavigate } from "react-router-dom";


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    async function loginUser() {
        const result = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (result.error) {
            alert('Dang nhap that bai! ' + result.error.message);
        } else {
            alert('Dang nhap thanh cong.');
            navigate('/admin/room');
        }
    }
    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <h2>Đăng nhập tài khoản</h2>
                    <form action="">
                        <div className="mb-3"></div>
                        <label className="form-label"> Email address</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={loginUser}>Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Login;