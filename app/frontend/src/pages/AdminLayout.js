import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut,
  Menu,
  X,
  CreditCard
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("admin_token");
    const userData = localStorage.getItem("admin_user");
    
    if (!token || !userData) {
      navigate("/admin/login");
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", path: "/admin/orders", icon: Package },
    { name: "Couriers", path: "/admin/couriers", icon: Users },
    { name: "Analytics", path: "/admin/analytics", icon: TrendingUp },
    { name: "Pricing", path: "/admin/pricing", icon: CreditCard },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 text-white px-2 py-1 rounded font-bold text-sm">
              123
            </div>
            <span className="font-bold text-gray-800">GELEVERD</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">ADMIN</span>
          </div>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive(item.path)
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive(item.path) ? 'text-green-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          {user && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => navigate("/")}
            >
              ← Customer Site
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm border-b h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 text-white px-2 py-1 rounded font-bold text-sm">
              123
            </div>
            <span className="font-bold text-gray-800">GELEVERD</span>
          </div>
          
          <div className="w-6"></div> {/* Spacer */}
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;