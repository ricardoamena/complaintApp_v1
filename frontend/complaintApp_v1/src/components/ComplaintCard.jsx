import React, { useState } from "react";

const ComplaintCard = ({ complaint, onStatusUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState(complaint.comments || '');
  const [status, setStatus] = useState(complaint.status);

  const handleUpdate = () => {
    onStatusUpdate(complaint, status, comments);
    setIsEditing(false);
  };

  return (
    <div className="border rounded shadow p-4 mb-4">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-bold">Denuncia #{complaint.id}</h3>
          <p className="text-sm text-gray-500">
            Tipo: {complaint.type === 'identified' ? 'Con Identificación' : 'Anónima'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Editar
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="font-semibold">Descripción:</p>
          <p>{complaint.description}</p>
        </div>

        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="pending">Pendiente</option>
                <option value="resolved">Resuelto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Comentarios</label>
              <input
                type="text"
                placeholder="Agregar comentarios"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="font-semibold">Estado:</p>
              <p className={`capitalize ${status === 'resolved' ? 'text-green-600' : 'text-yellow-600'}`}>
                {status === 'resolved' ? 'Resuelto' : 'Pendiente'}
              </p>
            </div>
            {comments && (
              <div>
                <p className="font-semibold">Comentarios:</p>
                <p>{comments}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;