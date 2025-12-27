import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Solicitud } from '../app/cliente/solicitud/solicitud';

export const routes: Routes = [
  { path: '', component: Inicio},
  { path: 'solicitud', component: Solicitud },
  { path: '**', redirectTo: '' }
];
