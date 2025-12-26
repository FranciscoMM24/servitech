// 🔥 MOTOR DE SERVITECH: Gestiona TODAS las citas de tu negocio
import { Injectable } from '@angular/core';
import { Cita } from '../models/cita.models'; // ← CORREGIDO

@Injectable({
  providedIn: 'root',
})
export class Booking {
  private citas: Cita[] = []; // 🗄️ Base de datos local

  constructor() {
    // 💾 Carga citas guardadas al iniciar (NO se pierden)
    const guardadas = localStorage.getItem('servitech_citas');
    if (guardadas) {
      this.citas = JSON.parse(guardadas);
    }
  }

  // 📝 CLIENTE CREA CITA - RETORNA CITA CON ID AUTOMÁTICO
  crearCita(citaData: any): Cita {
    const todasCitas = this.getCitas();
    
    // 🎯 ID AUTOMÁTICO: ST-AAAAMMDD-NNN
    const hoy = new Date();
    const fecha = hoy.toISOString().slice(2, 10).replace(/-/g, ''); // 251226
    const numero = todasCitas.length + 1;
    const idNuevo = `ST-${fecha}-${numero.toString().padStart(3, '0')}`; // ST-251226-001
    
    const nuevaCita: Cita = {
      id: idNuevo, // ← ID FORMATO PRO
      cliente: citaData.nombre,
      email: citaData.email,
      telefono: citaData.telefono,
      servicio: citaData.servicio,
      fecha: citaData.fecha,
      hora: citaData.hora,
      costo: this.calcularCosto(citaData.servicio),
      estado: 'pendiente',
      descripcion: citaData.descripcion || '',
      pagado: false,
      fechaCreacion: new Date().toISOString()
    };

    this.citas.push(nuevaCita);
    this.guardarLocal();
    console.log('✅ Cita creada:', nuevaCita);
    return nuevaCita; // ← RETORNA para mostrar ID
  }

  // 💰 PRECIOS DE TUS SERVICIOS (EDITA AQUÍ)
  public calcularCosto(servicio: string): number {
    const precios: Record<string, number> = {
      'Reparación Laptop': 850,
      'Reparación PC': 650,
      'Limpieza Hardware': 350,
      'Cambio Pasta Térmica': 150,
      'Recuperación Datos': 1300,
      'Soporte Remoto': 200,
      'Configuración Red': 400,
      'Tutoría Matemáticas': 220,
      'Tutoría Informática': 260,
      'Apoyo Escolar': 180,
    };
    return precios[servicio as keyof typeof precios] || 0;
  }

  // 👨‍💼 ADMIN: Todas las citas
  getCitas(): Cita[] {
    return [...this.citas]; // ← COPIA para inmutabilidad
  }

  // 💳 ADMIN: Marcar pagada
  marcarPagada(id: string): boolean {
    const cita = this.citas.find((c) => c.id === id);
    if (cita) {
      cita.pagado = true;
      cita.estado = 'confirmada';
      this.guardarLocal();
      return true;
    }
    return false;
  }

  // 📊 ADMIN: Estadísticas dashboard
  getEstadisticas() {
    return {
      total: this.citas.length,
      pendientes: this.citas.filter((c) => c.estado === 'pendiente').length,
      confirmadas: this.citas.filter((c) => c.estado === 'confirmada').length,
      ingresosPendientes: this.citas.filter((c) => !c.pagado).reduce((sum, c) => sum + c.costo, 0),
      ingresosTotales: this.citas.filter((c) => c.pagado).reduce((sum, c) => sum + c.costo, 0),
      porServicio: this.citas.reduce((acc, c) => {
        acc[c.servicio] = (acc[c.servicio] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  // 🗑️ ADMIN: Eliminar cita
  eliminarCita(id: string): boolean {
    const index = this.citas.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.citas.splice(index, 1);
      this.guardarLocal();
      return true;
    }
    return false;
  }

  // 💾 Guardar en localStorage
  private guardarLocal() {
    localStorage.setItem('servitech_citas', JSON.stringify(this.citas));
  }
}
