import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Trash2,
  Plus,
  Download
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const response = await axios.get(`${BACKEND_URL}/api/orders?${params}`, { headers });
      setOrders(response.data);

    } catch (error) {
      console.error("Orders fetch error:", error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800", 
      picked_up: "bg-purple-100 text-purple-800",
      in_transit: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600">Manage and track all courier orders</p>
          </div>
          <Button className="bg-green-500 hover:bg-green-600">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by tracking number, customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Tracking #</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Route</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <span className="font-mono text-sm font-medium">
                          {order.tracking_number}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-gray-600">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm">
                          <p className="font-medium">
                            {order.pickup_address.city} → {order.delivery_address.city}
                          </p>
                          <p className="text-gray-600">
                            {order.distance ? `${order.distance}km` : 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="capitalize text-sm">
                          {order.vehicle_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="font-medium">€{order.price}</span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-sm">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {orders.length} orders
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;