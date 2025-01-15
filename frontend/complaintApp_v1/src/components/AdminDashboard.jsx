import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService.js";
import ComplaintCard from "./ComplaintCard";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminService.checkAuth()) {
      navigate("/admin/login");
      return;
    }
    loadComplaints();
  }, [navigate]);

  const loadComplaints = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Error al cargar las denuncias", error);
      setError(error.message || "Ha ocurrido un error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (complaint, newStatus, comments) => {
    setError(null);
    try {
      await adminService.updateComplaintStatus(complaint.id, complaint.type, {
        status: newStatus,
        comments: comments,
      });
      await loadComplaints();
    } catch (error) {
      console.error("Error al actualizar el estado de la denuncia", error);
      setError(error.message || "Ha ocurrido un error");
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (filters.status !== "all" && complaint.status !== filters.status)
      return false;
    if (filters.type !== "all" && complaint.type !== filters.type) return false;
    return true;
  });

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      adminService.logout();
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="resolved">Resueltos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">Todas</option>
                <option value="identified">Con Identificación</option>
                <option value="anonymous">Anónimas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando denuncias...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay denuncias que mostrar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={`${complaint.type}-${complaint.id}`}
                complaint={complaint}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
