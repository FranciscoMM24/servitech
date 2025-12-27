import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar,RouterModule],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .main-content {
        min-height: calc(100vh - clamp(100px, 18vh, 140px));
        padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 5vw, 2rem);
        max-width: clamp(320px, 95vw, 1200px);
        margin: 0 auto;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        overflow-x: hidden;
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
        font-family: 'Inter', -apple-system, sans-serif;
      }
    `,
  ],
})
export class App {
  protected readonly title = signal('servitech');
}
