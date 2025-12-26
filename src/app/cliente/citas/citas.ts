// 🔐 CITAS + TRACKER PÚBLICO INTEGRADO
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking } from '../../services/booking';
import { Cita } from '../../models/cita.models';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas implements OnInit {
  // ← Componente correcto
  misCitas: Cita[] = [];
  emailCliente = '';

  // 🔍 TRACKER PÚBLICO (NUEVO)
  codigoBusqueda = '';
  citaPublica: Cita | null = null;

  constructor(private bookingService: Booking) {
    this.emailCliente = localStorage.getItem('clienteEmail') || 'demo@servitech.com';
  }

  ngOnInit() {
    const todasCitas = this.bookingService.getCitas();
    this.misCitas = todasCitas.filter((cita) => cita.email === this.emailCliente);
  }

  // 💬 EMOJIS PARA SERVICIOS
  getEmojiServicio(servicio: string): string {
    const emojis: Record<string, string> = {
      'Reparación Laptop': '💻',
      'Reparación PC': '🖥️',
      'Limpieza Hardware': '🧹',
      'Cambio Pasta Térmica': '🔧',
      'Recuperación Datos': '💾',
      'Soporte Remoto': '🖱️',
      'Configuración Red': '🌐',
      'Tutoría Matemáticas': '📐',
      'Tutoría Informática': '💻',
      'Apoyo Escolar': '📚',
    };
    return emojis[servicio] || '🔧';
  }

  // 📱 WHATSAPP PARA CLIENTE
  abrirWhatsApp(cita: Cita) {
    const mensaje = `Hola, consulta sobre mi cita ${cita.id}\nServicio: ${cita.servicio}\nFecha: ${cita.fecha}`;
    window.open(`https://wa.me/5212345678901?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  // 🔍 BUSCAR PÚBLICO (CUALQUIERA)
  buscarCitaPublica() {
    if (this.codigoBusqueda.trim()) {
      const todasCitas = this.bookingService.getCitas();
      this.citaPublica =
        todasCitas.find((cita) =>
          cita.id.toLowerCase().includes(this.codigoBusqueda.toLowerCase().trim())
        ) || null;
    }
  }
  limpiarBusqueda() {
    this.codigoBusqueda = '';
    this.citaPublica = null;
  }
}
