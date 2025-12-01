import { useState } from "react";
import config from '../../config';
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_PUBLISHABLE_KEY);
function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');  
    async function registerUser() { {/*async la bat dong bo*/}
        if (!email || !password) {
            alert('Vui long nhap day du thong tin');
            return;
        } if (password.length < 6) {
            alert('Mat khau phai co it nhat 6 ky tu');
            return;
        }
        const response = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (response.error) {
            alert('Dang ky that bai! ' + response.error.message);
        }
        else {
            alert('Dang ky thanh cong.');
        }
    }
    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <h2>Đăng ký tài khoản</h2>
                    <form>
                        <div className="mb-3"></div>
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                        {/*target la lay gia tri nguoi dung nhap vao*/}
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <button type="button" onClick={async () => await registerUser()} className="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Register;