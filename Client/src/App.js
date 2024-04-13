import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Register";
import Dormitory from "./components/dormitorys/Dormitory";
import Booking from "./pages/booking/Booking";
import Reserve from "./components/reserve/Reserve";
import Formdorm from "./components/form/Formdorm";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import UpdateDormitory from "./pages/UpdateDormitory";
import Mybooking from "./pages/Mybooking";
import CustomerReserve from "./pages/CustomerReserve";
import Admin from "./pages/Admin";

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dormcard" element={<Dormitory />} />
          <Route path='/booking/:id' element={<Booking />} />
          <Route path='/formdorm' element={<Formdorm />} />

          <Route path='/reserve' element={<Reserve />} />


          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>

          <Route path='/update/:listingId' element={<UpdateDormitory />} />

          <Route path='/mybooking' element={<Mybooking />} />

          <Route path="/customerreserve/:id" element={<CustomerReserve />} />

          <Route path="/admin-dashboard" element={<Admin /> } />


        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
