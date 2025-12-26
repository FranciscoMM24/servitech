// 🗃️ ESTRUCTURA DE CADA CITA DE TU NEGOCIO
export interface Cita {
  id: string; // ID único automático
  cliente: string; // Nombre del cliente
  email: string; // Email contacto
  telefono: string; // WhatsApp (10 dígitos)
  servicio: string; // "Reparación Laptop", etc
  descripcion: string; // Detalles del problema
  fecha: string; // "2025-12-27"
  hora: string; // "10:00"
  costo: number; // Precio calculado automático
  pagado: boolean; // true = pagado
  fechaCreacion: string;
  codigoVerificacion?: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
}
