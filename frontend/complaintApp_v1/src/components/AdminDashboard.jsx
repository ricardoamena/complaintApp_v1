import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../services/adminService";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminService.checkAuth()) {
      navigate("/admin/login");
      return;
    }
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await adminService.getAllComplaints(filters);
      setComplaints(data);
    } catch (error) {
      console.error("Error al cargar las denuncias", error);
    }
  };

  const handleStatusUpdate = async (complaints, newStatus, comments) => {
    try {
        await adminService.updateComplaintStatus(complaints.id, complaints.type, {
            status: newStatus,
            comments: comments,
        });
        loadComplaints();
    }   catch (error) {
        console.error("Error al actualizar el estado de la denuncia", error);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filters.status !== 'all' && complaint.status !== filters.status) return false;
    if (filters.type !== 'all' && complaint.type !== filters.type) return false;
    return true;
  });

  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto sm:px-6 lg:px-8">
        <div className="p-4">
          <h1 className="text-center">Panel de Administración:</h1>
          <div className="h-2 w-full bg-gray-300 border rounded-md "></div>

          <button></button>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name=""
              id=""
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="resolved">Resueltos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="all">Todas</option>
              <option value="identified">Con Identificación</option>
              <option value="anonymous">Anónimas</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
