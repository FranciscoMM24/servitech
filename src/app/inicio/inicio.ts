import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements AfterViewInit {
  ngAfterViewInit() {
    this.animarStats();
    setTimeout(() => this.iniciarMouse3D(), 100); // ✅ Delay para DOM
  }

  animarStats() {
    const stats = document.querySelectorAll('.stat-number') as NodeListOf<HTMLElement>;
    stats.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target') || '0');
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target.toString();
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current).toString();
        }
      }, 20);
    });
  }

  iniciarMouse3D() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((cardElement) => {
      const card = cardElement as HTMLElement;

      // ✅ FIX: Función arrow inline
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
      });
    });
  }
}
