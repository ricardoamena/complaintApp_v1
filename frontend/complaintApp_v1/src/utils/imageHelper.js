// En Vite, usamos import.meta.env en lugar de process.env
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:7070";

export const processImageUrls = (imagenes) => {
  if (!imagenes) return [];
  
  // Convertir a array si es una cadena
  let imageArray;
  if (typeof imagenes === 'string') {
    // Si la cadena está vacía o es undefined, devolver array vacío
    if (!imagenes.trim()) return [];
    imageArray = imagenes.split(',').map(img => img.trim());
  } else if (Array.isArray(imagenes)) {
    imageArray = imagenes;
  } else {
    console.error('Formato de imágenes no válido:', imagenes);
    return [];
  }

  // Procesar las URLs
  return imageArray.map(img => {
    if (img.startsWith('http')) return img;
    const normalizedPath = img.replace(/\\/g, '/');
    const path = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    return `http://localhost:7070${path}`;
  });
};


//Valida el tamaño y tipo de la imagen antes de subirla

export const validateImage = (file) => {
    const MAX_SIZE = 2 * 1024 * 1024; //2MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

    if(file.size > MAX_SIZE) {
        throw new Error (`El archivo ${file.name} excede el tamaño permitido de 2MB.`);
    }
    if(!ALLOWED_TYPES.includes(file.type)) {
        throw new Error (`La archivo ${file.name} no es un tipo de imagen valido.`);
    }
    return true;
}