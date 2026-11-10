import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" 
         [style.width.px]="size" 
         [style.height.px]="size" 
         style="border-radius: 28%; box-shadow: 0 4px 12px rgba(255,90,0,0.35); flex-shrink: 0; display: inline-block; vertical-align: middle;">
      <defs>
        <linearGradient id="novaGradSvg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF5A00"/>
          <stop offset="50%" stop-color="#FF7A29"/>
          <stop offset="100%" stop-color="#FF9E00"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#novaGradSvg)"/>
      <path d="M19 45V19L33 37V19H45V45L31 27V45H19Z" fill="white" opacity="0.95"/>
      <circle cx="47" cy="17" r="4.5" fill="#FFE500"/>
    </svg>
  `
})
export class BrandLogoComponent {
  @Input() size = 38;
}
