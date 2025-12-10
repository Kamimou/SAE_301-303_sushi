import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1050">
      <div *ngFor="let toast of toasts" 
           [ngClass]="'toast show alert alert-' + (toast.type === 'error' ? 'danger' : toast.type === 'success' ? 'success' : 'info')"
           role="alert">
        <div class="d-flex align-items-center">
          <span class="flex-grow-1">{{ toast.message }}</span>
          <button type="button" class="btn-close btn-sm" (click)="toastService.remove(toast.id)"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast {
      margin-bottom: 0.5rem;
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
    }
  `]
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(public toastService: ToastService) {
    this.toastService.toast$.subscribe(toasts => this.toasts = toasts);
  }
}
