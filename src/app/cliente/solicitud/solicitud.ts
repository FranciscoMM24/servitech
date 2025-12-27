// 🔥 FORMULARIO + RESPONSABILIDAD + ID DIRECTO (SIN CÓDIGO)
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Booking } from '../../services/booking';
import { Router } from '@angular/router';
import { Cita } from '../../models/cita.models';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './solicitud.html',
  styleUrl: './solicitud.css',
})
export class Solicitud {
  // 📋 SERVICIOS
  servicios = [
    'Reparación Laptop',
    'Reparación PC',
    'Limpieza Hardware',
    'Cambio Pasta Térmica',
    'Recuperación Datos',
    'Soporte Remoto',
    'Configuración Red',
    'Tutoría Matemáticas',
    'Tutoría Informática',
    'Apoyo Escolar',
  ];

  // 💰 Precio en tiempo real
  precioSeleccionado = signal(0);

  // 📝 Formulario reactivo
  formSolicitud!: FormGroup;

  // 📅 Fecha mínima: mañana
  minFecha = new Date();
  minFechaStr = '';

  // 🚫 RESPONSABILIDAD + ESTADO
  aceptoResponsabilidad = false;
  nuevaCita: Cita | null = null;
  whatsappEnviado = false;

  constructor(private fb: FormBuilder, private bookingService: Booking, private router: Router) {
    // Configurar fecha mínima
    this.minFecha.setDate(this.minFecha.getDate() + 1);
    this.minFechaStr = this.minFecha.toISOString().split('T')[0];

    // 📋 Crear formulario SIN HORA
    this.formSolicitud = this.fb.group({
      cliente: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      servicio: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fecha: ['', Validators.required],
    });

    // 💰 Actualizar precio al cambiar servicio
    this.formSolicitud.get('servicio')?.valueChanges.subscribe((servicio) => {
      if (servicio) {
        this.precioSeleccionado.set(this.getCostoServcio(servicio));
      } else {
        this.precioSeleccionado.set(0);
      }
    });
  }

  // ✅ VERIFICAR FORMULARIO COMPLETO + RESPONSABILIDAD
  formCompleto(): boolean {
    const formValido = this.formSolicitud.valid;
    const telefonoValido = this.validarTelefono();
    return formValido && telefonoValido && this.aceptoResponsabilidad;
  }

  // ☎️ VALIDAR TELÉFONO
  validarTelefono(): boolean {
    const tel = this.formSolicitud.get('telefono')?.value || '';
    return /^\d{10}$/.test(tel);
  }

  // 💰 OBTENER COSTO
  getCostoServcio(servicio: string): number {
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

  // 🎉 CREAR CITA DIRECTA (1 CLICK)
  crearCitaDirecta() {
    if (this.formCompleto()) {
      const citaData = this.formSolicitud.value;

      // ✅ CREAR CITA
      this.nuevaCita = this.bookingService.crearCita(citaData);

      // 📱 WHATSAPP AUTOMÁTICO
      this.enviarWhatsAppConfirmacion(citaData);

      // ✅ GUARDAR EMAIL
      localStorage.setItem('clienteEmail', citaData.email);
      console.log('🎉 Cita creada:', this.nuevaCita.id);
    }
  }

  // 📱 WHATSAPP CONFIRMACIÓN (SIN CÓDIGO)
  enviarWhatsAppConfirmacion(citaData: any) {
    const mensaje = `🎉 *¡CITA RESERVADA CONFIRMADA!* 

📋 *ID CITA:* ${this.nuevaCita?.id}

👤 ${citaData.cliente}
🔧 ${citaData.servicio}
📅 ${citaData.fecha}
💰 *$${citaData.costo} MXN*

✅ *Ya puedes rastrear tu cita en:*
servitech.com/cliente/citas

¡Gracias por confiar en ServiTech! ⭐`;

    const telefono = citaData.telefono.replace(/[^0-9]/g, '');
    const urlWhatsApp = `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(urlWhatsApp, '_blank');
    console.log('📱 WhatsApp enviado:', urlWhatsApp);

    this.whatsappEnviado = true;
    setTimeout(() => {
      this.whatsappEnviado = false;
    }, 4000);
  }

  // 🚪 IR A MIS CITAS
  irMisCitas() {
    this.router.navigate(['/cliente/citas']);
  }

  // 🗑️ RESET FORMULARIO
  resetFormulario() {
    this.formSolicitud.reset();
    this.precioSeleccionado.set(0);
    this.aceptoResponsabilidad = false;
    this.nuevaCita = null;
  }
}
