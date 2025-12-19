import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayouts from './layouts/AdminLayouts.tsx';
import Room from './pages/admin/Room';
import ClientLayouts from './layouts/Client_layout.tsx';
import Register from './pages/client/Register.tsx';
import Login from './pages/client/Login.tsx';
import FilmUpsert from './pages/admin/FilmUpsert.tsx';

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='admin' element={<AdminLayouts />}>
            <Route path='room' element={<Room />}></Route>
            <Route path='film/create' element={<FilmUpsert />}></Route>
          </Route>
          <Route element={<ClientLayouts />}>
            <Route path='dang_ky' element={<Register />}></Route>
          </Route>
          <Route element={<ClientLayouts />}>
            <Route path='dang_nhap' element={<Login/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
