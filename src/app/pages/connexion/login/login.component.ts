import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-5" style="max-width: 500px">
      <h2 class="text-center mb-4">Connexion</h2>

      <div class="card p-4">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

          <div class="mb-3">
            <label class="form-label">E-mail</label>
            <input
              type="email"
              class="form-control"
              formControlName="email"
            />
          </div>

          <div class="mb-4">
            <label class="form-label">Mot de passe</label>
            <input
              type="password"
              class="form-control"
              formControlName="password"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 mb-2"
            [disabled]="loginForm.invalid"
          >
            Se connecter
          </button>

          <button
            type="button"
            class="btn btn-outline-secondary w-100"
            (click)="goToRegister()"
          >
            S’inscrire
          </button>

        </form>
      </div>
    </div>
  `
})
export class LoginComponent {

  // 🔹 formulaire de connexion
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  // 🔹 clic sur "Se connecter"
  onSubmit() {
    if (this.loginForm.valid) {

      const payload = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.api.login(payload).subscribe({
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('user', JSON.stringify(res.user));
            alert('Connexion réussie !');
            this.router.navigate(['/']);
          } else {
            alert(res.message || 'Identifiants incorrects');
          }
        },
        error: () => {
          alert('Erreur serveur');
        }
      });
    }
  }

  // 🔹 bouton "S’inscrire"
  goToRegister() {
    this.router.navigate(['/inscription']);
  }
}
