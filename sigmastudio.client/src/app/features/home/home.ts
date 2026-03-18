import { Component, OnInit } from '@angular/core';

interface Particle {
  id: number;
  left: number;
  top: number;
  delay: number;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage implements OnInit {
  text = 'SIGMASTUDIO';
  letters: string[] = [];
  particles: Particle[] = [];
  Math = Math;

  private waveTimers: any[] = [];
  private currentHoveredIndex: number | null = null;
  private isHoveringWord: boolean = false;

  constructor() { }

  ngOnInit() {
    this.letters = this.text.split('');

    this.particles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.5
    }));
  }

  onWordEnter(): void {
    this.isHoveringWord = true;
  }

  onWordLeave(): void {
    this.isHoveringWord = false;
    this.currentHoveredIndex = null;
    this.updateActiveLetter();
    this.clearWaveTimers();

    const letterElements = document.querySelectorAll<HTMLElement>('.letter');
    letterElements.forEach(el => el.classList.remove('wave'));
  }

  hoverLetter(index: number): void {
    this.currentHoveredIndex = index;
    this.updateActiveLetter();

    if (this.isHoveringWord) {
      this.startWave(index);
      this.isHoveringWord = false;
    }
  }

  private updateActiveLetter(): void {
    const letterElements = document.querySelectorAll<HTMLElement>('.letter');
    letterElements.forEach((el, i) => {
      if (i === this.currentHoveredIndex) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  private startWave(centerIndex: number): void {
    this.clearWaveTimers();

    const letterElements = document.querySelectorAll<HTMLElement>('.letter');

    letterElements.forEach((el, i) => {
      el.classList.remove('wave');

      if (i === centerIndex) {
        return;
      }

      const delay = Math.abs(i - centerIndex) * 60;

      const timer = setTimeout(() => {
        el.classList.add('wave');

        const removeTimer = setTimeout(() => {
          el.classList.remove('wave');
        }, 600);

        this.waveTimers.push(removeTimer);
      }, delay);

      this.waveTimers.push(timer);
    });
  }

  private clearWaveTimers(): void {
    this.waveTimers.forEach(t => clearTimeout(t));
    this.waveTimers = [];
  }
}
