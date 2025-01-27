import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService.js";
import ComplaintCard from "./ComplaintCard";


const AdminDashboard = () => {
  // Estados separados para cada tipo de denuncia
  const [complaints, setComplaints] = useState({
    identified: [],
    anonymous: [],
    loading: false,
    error: null,
  });

  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
  });
 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await loadComplaints();
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        setComplaints(prev => ({
          ...prev,
          loading: false,
          error: "Error al cargar las denuncias"
        }));
      }
    };
  
    loadInitialData();
  }, []); 

  const loadComplaints = async () => {
    setComplaints((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [normalComplaints, anonComplaints] = await Promise.all([
        adminService.getAllComplaints(),
        adminService.getAllAnonyComplaints(),
      ]);

      setComplaints({
        identified: normalComplaints.map((complaint) => ({
          ...complaint,
          type: "identified",
          status: complaint.status || "Pendiente",
        })),
        anonymous: anonComplaints.map((complaint) => ({
          ...complaint,
          type: "anonymous",
          status: complaint.status || "Pendiente",
        })),
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error al cargar las denuncias", error);
      setComplaints((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Error al cargar las denuncias",
      }));
    }
  };

  const handleStatusUpdate = async (complaint, newStatus, comentarios) => {
    setError(null);
    try {
      console.log("Datos a enviar:", {
        id: complaint.id,
        type: complaint.type,
        data: {
          status: newStatus,
          comentarios: comentarios,
        },
      });
      await adminService.updateComplaintStatus(complaint.id, complaint.type, {
        status: newStatus,
        comentarios: comentarios,
      });
      await loadComplaints();
    } catch (error) {
      console.error("Error al actualizar el estado de la denuncia", error);
      setError(error.message || "Ha ocurrido un error");
    }
  };

  const getFilteredComplaints = () => {
    let combinedComplaints = [];

    // Primero combinamos las denuncias según el tipo seleccionado
    if (filters.type === "all") {
      combinedComplaints = [...complaints.identified, ...complaints.anonymous];
    } else if (filters.type === "identified") {
      combinedComplaints = [...complaints.identified];
    } else if (filters.type === "anonymous") {
      combinedComplaints = [...complaints.anonymous];
    }

    // Luego filtramos por estado
    if (filters.status !== "all") {
      const statusMap = {
        pending: "Pendiente",
        resolved: "Resuelto",
      };

      combinedComplaints = combinedComplaints.filter(
        (complaint) => complaint.status === statusMap[filters.status]
      );
    }

    return combinedComplaints;
  };

  const filteredComplaints = getFilteredComplaints();


  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      adminService.logout();
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto max-h-screen bg-gray-100">
      <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <div className="flex gap-4">
              <div className="text-md text-gray-600 mt-3 mr-3">
                Total de denuncias: {filteredComplaints.length}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
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
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
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
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
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
        {complaints.error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{complaints.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {complaints.loading ? (
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
