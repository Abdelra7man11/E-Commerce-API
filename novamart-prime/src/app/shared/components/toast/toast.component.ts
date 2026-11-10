import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 start-0 p-3" 
         style="z-index: 10000; pointer-events: none; margin-top: 0.5rem; margin-left: 0.5rem;">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast show custom-toast align-items-center border-0 shadow-lg mb-2.5 overflow-hidden" 
             [ngClass]="{
               'toast-success': toast.type === 'success',
               'toast-error': toast.type === 'error',
               'toast-warning': toast.type === 'warning',
               'toast-info': toast.type === 'info'
             }"
             role="alert" 
             aria-live="assertive" 
             aria-atomic="true"
             style="pointer-events: auto;">
          <div class="d-flex align-items-center p-3">
            <div class="toast-icon-circle me-3 flex-shrink-0 d-flex align-items-center justify-content-center">
              @switch (toast.type) {
                @case ('success') {
                  <i class="fa-solid fa-circle-check fs-5"></i>
                }
                @case ('error') {
                  <i class="fa-solid fa-circle-exclamation fs-5"></i>
                }
                @case ('warning') {
                  <i class="fa-solid fa-triangle-exclamation fs-5"></i>
                }
                @default {
                  <i class="fa-solid fa-circle-info fs-5"></i>
                }
              }
            </div>
            
            <div class="flex-grow-1 lh-sm me-2">
              @if (toast.title) {
                <div class="fw-bold mb-0.5 toast-title">{{ toast.title }}</div>
              }
              <div class="small toast-message">{{ toast.message }}</div>
            </div>

            <button type="button" 
                    class="btn-close btn-close-toast flex-shrink-0 ms-auto" 
                    (click)="toastService.remove(toast.id)"
                    aria-label="Close"></button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideInFromLeft {
      0% {
        opacity: 0;
        transform: translate3d(-35px, 0, 0) scale(0.96);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }

    .custom-toast {
      animation: slideInFromLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      border-radius: 14px !important;
      min-width: 320px;
      max-width: 420px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16) !important;
      transition: all 0.25s ease;
      color: #ffffff;
    }

    .toast-icon-circle {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(4px);
    }

    .toast-title {
      font-size: 0.88rem;
      letter-spacing: -0.01em;
    }

    .toast-message {
      font-size: 0.82rem;
      opacity: 0.95;
      line-height: 1.4;
    }

    .toast-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }

    .toast-error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }

    .toast-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      color: #ffffff !important;
    }

    .toast-info {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
    }

    .btn-close-toast {
      filter: invert(1) grayscale(100%) brightness(200%);
      opacity: 0.75;
      padding: 0.35rem;
      font-size: 0.75rem;
      transition: opacity 0.2s ease, transform 0.2s ease;

      &:hover {
        opacity: 1;
        transform: scale(1.15);
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
