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
import { Citas,  } from './app/cliente/citas/citas';
import { Dashboard,  } from './app/admin/dashboard/dashboard';
import { Servicios,  } from './app/admin/servicios/servicios';

bootstrapApplication(App, {
  providers: [
    // 📍 RUTAS COMPLETAS DE TU NEGOCIO
    provideRouter([
      { path: '', redirectTo: '/cliente/solicitud', pathMatch: 'full' },
      { path: 'cliente/solicitud', component: Solicitud},
      { path: 'cliente/citas', component: Citas },
      { path: 'admin/dashboard', component: Dashboard },
      { path: 'admin/servicios', component: Servicios},
      { path: '**', redirectTo: '/cliente/solicitud' }
    ]),
    
    provideHttpClient(),
    importProvidersFrom(FormsModule, ReactiveFormsModule)
  ]
});
