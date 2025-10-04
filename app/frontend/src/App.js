import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">import React from \"react\";
import \"./App.css\";
import { BrowserRouter, Routes, Route } from \"react-router-dom\";
import Home from \"./pages/Home\";
import AdminLogin from \"./pages/AdminLogin\";
import AdminDashboard from \"./pages/AdminDashboard\";
import AdminOrders from \"./pages/AdminOrders\";
import { Toaster } from \"./components/ui/toaster\";

function App() {
  return (
    <div className=\"App\">
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route path=\"/\" element={<Home />} />
          
          {/* Admin Routes */}
          <Route path=\"/admin/login\" element={<AdminLogin />} />
          <Route path=\"/admin/dashboard\" element={<AdminDashboard />} />
          <Route path=\"/admin/orders\" element={<AdminOrders />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;