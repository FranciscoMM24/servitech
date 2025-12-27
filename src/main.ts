// 🚀 BOOTSTRAP PRINCIPAL: Conecta TODO
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { App } from './app/app';
import { Navbar } from './app/shared/navbar/navbar';
import { Solicitud } from './app/cliente/solicitud/solicitud';
import { Citas } from './app/cliente/citas/citas';
import { Dashboard } from './app/admin/dashboard/dashboard';
import { Servicios } from './app/admin/servicios/servicios';
import { Inicio } from './app/inicio/inicio';

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: '', component: Inicio }, // inicio animado
      { path: 'inicio', component: Inicio }, // alias

     
      { path: 'cliente/solicitud', component: Solicitud },
      { path: 'cliente/citas', component: Citas },

      { path: 'admin/dashboard', component: Dashboard },
      { path: 'admin/servicios', component: Servicios },

      { path: '**', redirectTo: '' },
    ]),

    provideHttpClient(),
    importProvidersFrom(FormsModule, ReactiveFormsModule, CommonModule),
  ],
});
