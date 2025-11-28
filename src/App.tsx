import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayouts from './layouts/AdminLayouts.tsx';
import Room from './pages/admin/Room';

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='admin' element={<AdminLayouts />}>
            <Route path='room' element={<Room />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
