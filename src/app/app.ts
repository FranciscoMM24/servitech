import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, RouterModule],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .main-content {
        /* PANTALLA COMPLETA - SIN MAX-WIDTH */
        min-height: calc(100vh - clamp(100px, 18vh, 140px));
        width: 100vw;
        padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 5vw, 2rem);
        margin: 0;
        padding-left: clamp(1rem, 5vw, 2rem);
        padding-right: clamp(1rem, 5vw, 2rem);
        /* ROJO-NEGRO TECH FULLSCREEN */
        background: linear-gradient(135deg, rgba(26, 0, 5, 0.98) 0%, rgba(42, 10, 16, 0.92) 100%);
        overflow-x: hidden;
        position: relative;
      }

      /* CONTENIDO CENTRADO RESPONSIVE */
      .main-content > * {
        max-width: clamp(320px, 95vw, 1200px);
        margin: 0 auto;
      }

      /* EVITA SCROLL HORIZONTAL */
      * {
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        font-family: 'Orbitron', 'Inter', -apple-system, sans-serif;
        /* ROJO-NEGRO TECH FULL BODY */
        background: linear-gradient(135deg, #1a0005 0%, #2a0a10 40%, #0f0f1a 70%, #000 100%);
      }
    `,
  ],
})
export class App {
  protected readonly title = signal('servitech');
}
