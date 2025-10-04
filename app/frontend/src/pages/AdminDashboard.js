import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Euro,
  Truck
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      // Fetch dashboard stats
      const statsResponse = await axios.get(`${BACKEND_URL}/api/admin/dashboard`, { headers });
      setStats(statsResponse.data);

      // Fetch recent orders
      const ordersResponse = await axios.get(`${BACKEND_URL}/api/orders?limit=5`, { headers });
      setRecentOrders(ordersResponse.data);

    } catch (error) {
      console.error("Dashboard error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        navigate("/admin/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
              {change.positive ? '↗' : '↘'} {change.value}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to 123 Geleverd admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={stats?.total_orders || 0}
            icon={Package}
            color="bg-blue-500"
          />
          <StatCard
            title="Orders Today"
            value={stats?.orders_today || 0}
            icon={TrendingUp}
            color="bg-green-500"
          />
          <StatCard
            title="Revenue Today"
            value={`€${stats?.revenue_today?.toFixed(2) || '0.00'}`}
            icon={Euro}
            color="bg-yellow-500"
          />
          <StatCard
            title="Active Couriers"
            value={stats?.active_couriers || 0}
            icon={Truck}
            color="bg-purple-500"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Completed Orders</h3>
            </div>
            <p className="text-2xl font-bold">{stats?.completed_orders || 0}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold">Pending Orders</h3>
            </div>
            <p className="text-2xl font-bold">{stats?.pending_orders || 0}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Monthly Revenue</h3>
            </div>
            <p className="text-2xl font-bold">€{stats?.revenue_month?.toFixed(2) || '0.00'}</p>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/admin/orders")}
            >
              View All Orders
            </Button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-500' :
                      order.status === 'in_transit' ? 'bg-blue-500' :
                      order.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{order.tracking_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{order.price}</p>
                    <p className="text-sm text-gray-600 capitalize">{order.status.replace('_', ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent orders found</p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col space-y-2"
              onClick={() => navigate("/admin/orders")}
            >
              <Package className="w-6 h-6" />
              <span>Manage Orders</span>
            </Button>
            <Button 
              variant="outline"
              className="h-auto p-4 flex flex-col space-y-2"
              onClick={() => navigate("/admin/couriers")}
            >
              <Users className="w-6 h-6" />
              <span>Manage Couriers</span>
            </Button>
            <Button 
              variant="outline"
              className="h-auto p-4 flex flex-col space-y-2"
              onClick={() => navigate("/admin/analytics")}
            >
              <TrendingUp className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;