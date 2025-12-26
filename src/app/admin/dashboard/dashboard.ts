// 🔥 ADMIN COMPLETO: Eliminar + Editar + WhatsApp + CÓDIGO + LOGIN FIJO
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking } from '../../services/booking';
import { Cita } from '../../models/cita.models';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  citas: Cita[] = [];
  stats: any = {};
  mostrarLogin = false;
  password = '';
  esAdminValido = false;
  editarCita: Cita | null = null;
  notaAdmin = '';

  private ADMIN_PASSWORD = '2000';
  public router = inject(Router);

  constructor(private bookingService: Booking) {
    // 🔧 FIX: FORZAR LOGIN SI NO HAY SESIÓN
    const adminLogueado = localStorage.getItem('adminLogueado');
    this.esAdminValido = adminLogueado === 'true';

    // 🔧 SI LOCALSTORAGE CORRUPTO → FORZAR LOGIN
    if (adminLogueado !== 'true' && adminLogueado !== null) {
      localStorage.removeItem('adminLogueado');
      this.esAdminValido = false;
    }

    this.mostrarLogin = !this.esAdminValido;
  }

  ngOnInit() {
    if (this.esAdminValido) {
      this.cargarDatos();
    }
  }

  // 🔧 CARGAR DATOS (nuevo método)
  cargarDatos() {
    this.citas = this.bookingService.getCitas();
    this.stats = this.bookingService.getEstadisticas();
  }

  verificarAdmin() {
    console.log('🔐 Intentando login con:', this.password);

    if (this.password === this.ADMIN_PASSWORD) {
      localStorage.setItem('adminLogueado', 'true');
      this.esAdminValido = true;
      this.mostrarLogin = false;
      this.cargarDatos();
      console.log('✅ ADMIN LOGUEADO');
    } else {
      alert('❌ Contraseña incorrecta');
      this.password = '';
    }
  }

  logoutAdmin() {
    localStorage.removeItem('adminLogueado');
    this.esAdminValido = false;
    this.mostrarLogin = true;
    console.log('🚪 ADMIN LOGOUT');
  }

  // 💳 MARCAR PAGADA
  marcarPagada(id: string) {
    if (this.bookingService.marcarPagada(id)) {
      alert('✅ ¡Cita marcada como pagada!');
      this.cargarDatos();
    }
  }

  // 🗑️ ELIMINAR CITA
  eliminarCita(id: string) {
    if (confirm('¿Eliminar esta cita permanentemente?')) {
      this.citas = this.citas.filter((c) => c.id !== id);
      localStorage.setItem('servitech_citas', JSON.stringify(this.citas));
      alert('🗑️ Cita eliminada');
      this.cargarDatos();
    }
  }

  // ✏️ INICIAR EDICIÓN
  editarCitaInicio(cita: Cita) {
    this.editarCita = { ...cita };
    this.notaAdmin = cita.descripcion || '';
  }

  // 💾 GUARDAR EDICIÓN
  guardarEdicion() {
    if (this.editarCita) {
      const index = this.citas.findIndex((c) => c.id === this.editarCita!.id);
      if (index !== -1) {
        this.citas[index] = { ...this.editarCita, descripcion: this.notaAdmin };
        localStorage.setItem('servitech_citas', JSON.stringify(this.citas));
        alert('✅ ¡Cita actualizada!');
        this.cancelarEdicion();
        this.cargarDatos();
      }
    }
  }

  // ❌ CANCELAR EDICIÓN
  cancelarEdicion() {
    this.editarCita = null;
    this.notaAdmin = '';
  }

  // 📱 WHATSAPP DIRECTO AL CLIENTE
  whatsappCliente(cita: Cita) {
    const mensaje =
      `Hola ${cita.cliente}!\n\n` +
      `📋 Sobre tu cita ${cita.id}:\n` +
      `🔧 ${cita.servicio}\n` +
      `📅 ${cita.fecha} ${cita.hora}\n` +
      `💰 $${cita.costo}\n\n` +
      `Estado: ${cita.estado.toUpperCase()}\n\n` +
      `¿Alguna duda? 😊`;
    window.open(`https://wa.me/52${cita.telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  // 📱 WHATSAPP NOTIFICACIONES ESTATUS
  enviarWhatsAppStatus(cita: Cita, status: 'confirmada' | 'completada' | 'cancelada') {
    const mensajes: Record<string, string> = {
      confirmada: `✅ *¡Cita CONFIRMADA!* ${cita.cliente}\n\n🔧 ${cita.servicio}\n📅 ${cita.fecha} ${cita.hora}\n💰 $${cita.costo}\n\n¡Nos vemos pronto! 😊`,
      completada: `🎉 *¡TRABAJO TERMINADO!* ${cita.cliente}\n\n✅ ${cita.servicio} completado\n💰 Total: $${cita.costo}\n\n¡Gracias por confiar en ServiTech! ⭐`,
      cancelada: `⚠️ *Cita CANCELADA* ${cita.cliente}\n\n${cita.servicio}\n📅 ${cita.fecha}\n\nTe contactaremos para reprogramar. 🙏`,
    };

    const mensaje = mensajes[status] || `Actualización cita ${cita.id}`;
    window.open(`https://wa.me/52${cita.telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  // ✉️ EMAIL CLIENTE
  copiarEmailCliente(cita: Cita) {
    const subject = encodeURIComponent(`Actualización ${cita.servicio} - ServiTech`);
    const body = `Hola ${cita.cliente},\n\nEstado: ${cita.estado.toUpperCase()}\nServicio: ${
      cita.servicio
    }\nFecha: ${cita.fecha} ${cita.hora}\nCosto: $${cita.costo}\n\nSaludos,\nServiTech`;
    const mailto = `mailto:${cita.email}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  }

  // 🔍 BUSCAR POR CÓDIGO (temporal)
  buscarPorCodigo(codigo: string): Cita | null {
    return this.citas.find((cita) => (cita as any).codigoVerificacion === codigo) || null;
  }

  irClienteCitas() {
    this.router.navigate(['/cliente/citas']);
  }
}
