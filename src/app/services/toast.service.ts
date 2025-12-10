import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 2200): void {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type };
    const current = this.toastSubject.value;
    this.toastSubject.next([...current, toast]);
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: string): void {
    const current = this.toastSubject.value.filter(t => t.id !== id);
    this.toastSubject.next(current);
  }
}
