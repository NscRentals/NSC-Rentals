import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserDashboard from './pages/user/userDashboard';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import {Toaster} from "react-hot-toast";
import AdminPage from './pages/admin/adminDashboard';
import AdminViewDetails from './pages/maintainance/adminViewDetails';
import EditSparePart from './pages/maintainance/EditSpareParts';
import DeleteSparePart from './pages/maintainance/deleteSpareParts';
import AddSparePart from './pages/maintainance/AddSparePart';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster/>
      <Routes>
        <Route path="/user/*" element={<UserDashboard/>} />
        <Route path="/edit-spare-part/:id" element={<EditSparePart />} />
        <Route path="/login" element ={<LoginPage></LoginPage>}></Route>
        <Route path="/admin/" element={<AdminPage/>}/>
        <Route path="/maintainance/adminViewDetails" element={<AdminViewDetails/>} />
        <Route path="/maintainance/delete/:id" element={<DeleteSparePart/>} />
        <Route path="/maintainance/add" element={<AddSparePart/>}/>
      </Routes>
    </BrowserRouter>
  );
    
}
