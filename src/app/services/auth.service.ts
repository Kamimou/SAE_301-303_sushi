import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  last_name?: string;
  first_name?: string;
  email?: string;
  user_type?: string;
  is_student?: number;
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        this.userSubject.next(JSON.parse(raw));
      } catch (e) {
        console.warn('AuthService: impossible de parser user en localStorage', e);
      }
    }
  }

  setUser(user: User | null) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    } else {
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
