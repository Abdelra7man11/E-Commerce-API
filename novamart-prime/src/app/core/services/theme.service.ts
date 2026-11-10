import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    const savedTheme = localStorage.getItem('novamart_theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }

    this.applyTheme(this.isDarkMode());

    // Listen to changes
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  toggleTheme() {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    localStorage.setItem('novamart_theme', next ? 'dark' : 'light');
    this.applyTheme(next);
  }

  private applyTheme(isDark: boolean) {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark-theme');
        root.setAttribute('data-bs-theme', 'dark');
      } else {
        root.classList.remove('dark-theme');
        root.setAttribute('data-bs-theme', 'light');
      }
    }
  }
}
