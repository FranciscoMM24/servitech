// 🔥 FORMULARIO + RESPONSABILIDAD + ID AUTOMÁTICO
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Booking } from '../../services/booking'; // ✅ CORREGIDO
import { Router } from '@angular/router';
import { Cita } from '../../models/cita.models'; // ✅ CORREGIDO

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './solicitud.html',
  styleUrl: './solicitud.css',
})
export class Solicitud {
  // ✅ COMPONENTE CORRECTO
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

  // 🚫 RESPONSABILIDAD SISTEMA
  aceptoResponsabilidad = false;
  mostrarCodigo = false;
  codigoVerificacion = '';
  codigoGenerado = '';
  nuevaCita: Cita | null = null;

  constructor(
    private fb: FormBuilder,
    private bookingService: Booking, // ✅ CORREGIDO NOMBRE
    private router: Router
  ) {
    // Configurar fecha mínima
    this.minFecha.setDate(this.minFecha.getDate() + 1);
    this.minFechaStr = this.minFecha.toISOString().split('T')[0];

    // 📋 Crear formulario
    this.formSolicitud = this.fb.group({
      cliente: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      servicio: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
    });

    // 💰 Actualizar precio al cambiar servicio ✅ MÉTODO PÚBLICO
    this.formSolicitud.get('servicio')?.valueChanges.subscribe((servicio) => {
      if (servicio) {
        this.precioSeleccionado.set(this.getCostoServcio(servicio)); // ✅ MÉTODO CORRECTO
      } else {
        this.precioSeleccionado.set(0);
      }
    });
  }

  // ✅ VERIFICAR FORMULARIO COMPLETO + RESPONSABILIDAD
  formCompleto(): boolean {
    const formValido = this.formSolicitud.valid;
    const telefonoValido = this.validarTelefono();
    console.log('🔍 DEBUG:', {
      formValido,
      telefonoValido,
      aceptoResponsabilidad: this.aceptoResponsabilidad,
    });
    return formValido && telefonoValido && this.aceptoResponsabilidad;
  }

  // ☎️ VALIDAR TELÉFONO
  validarTelefono(): boolean {
    const tel = this.formSolicitud.get('telefono')?.value || '';
    return /^\d{10}$/.test(tel);
  }

  // 💰 OBTENER COSTO (MÉTODO PÚBLICO)
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

  // 🔑 GENERAR CÓDIGO VERIFICACIÓN
  generarCodigo() {
    console.log('🔑 BOTÓN PRESIONADO'); // DEBUG
    if (this.formCompleto()) {
      this.codigoGenerado = Math.floor(Math.random() * 9000 + 1000).toString();
      this.mostrarCodigo = true;
      console.log('✅ CÓDIGO GENERADO:', this.codigoGenerado);
      // NO alert() - se muestra visualmente
    } else {
      alert('❌ Completa TODOS los campos + marca checkbox + teléfono 10 dígitos');
    }
  }

  // ✅ VERIFICAR CÓDIGO + CREAR CITA
  verificarCodigo() {
    console.log('🔍 VERIFICANDO:', {
      codigoVerificacion: this.codigoVerificacion,
      codigoGenerado: this.codigoGenerado,
    });
    if (this.codigoVerificacion === this.codigoGenerado) {
      const citaData = this.formSolicitud.value;
      this.nuevaCita = this.bookingService.crearCita(citaData);

      alert(
        `🎉 ¡CITA CONFIRMADA!\n\n` +
          `📋 **ID: ${this.nuevaCita.id}**\n` +
          `👤 ${this.nuevaCita.cliente}\n` +
          `🔧 ${this.nuevaCita.servicio}\n` +
          `📅 ${this.nuevaCita.fecha} ${this.nuevaCita.hora}\n` +
          `💰 $${this.nuevaCita.costo} MXN\n\n` +
          `🔍 **GUARDALO** para rastrear en /cliente/citas`
      );

      localStorage.setItem('clienteEmail', citaData.email);
      this.router.navigate(['/cliente/citas']);
    } else {
      alert('❌ Código incorrecto. Intenta de nuevo.');
      this.codigoVerificacion = '';
    }
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
    this.mostrarCodigo = false;
    this.codigoVerificacion = '';
    this.codigoGenerado = '';
    this.nuevaCita = null;
  }
}
