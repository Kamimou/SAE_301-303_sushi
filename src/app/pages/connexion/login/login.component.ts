import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

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
  ,
  styles: [`
  .container {
  padding-top: 40px;
}

h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1f2937;
  position: relative;
}

h2::after {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  background-color: #ff4b5c;
  border-radius: 999px;
  margin: 10px auto 0;
}

.card {
  border: none;
  border-radius: 24px;
  background-color: #ffffff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
}

.form-label {
  font-weight: 600;
  color: #1f2937;
}

.form-control {
  border-radius: 14px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
}

.form-control:focus {
  border-color: #ff4b5c;
  box-shadow: 0 0 0 3px rgba(255, 75, 92, 0.15);
}

.btn-primary {
  background-color: #ff4b5c;
  border: none;
  border-radius: 14px;
  padding: 12px;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(255, 75, 92, 0.35);
}

.btn-primary:hover {
  background-color: #e63946;
}

.btn-outline-secondary {
  border-radius: 14px;
  font-weight: 600;
  border-color: #e5e7eb;
}

.btn-outline-secondary:hover {
  background-color: #f9fafb;
}


`
  ]
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
    private router: Router,
    private auth: AuthService
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
            this.auth.setUser(res.user);
            alert('Connexion réussie !');
            this.router.navigate(['/profile']);
          } else {
            alert(res.message || 'Identifiants incorrects');
          }
        },
        error: (err) => {
          const msg = err?.error?.message || (err?.status === 0 ? 'Erreur réseau' : 'Erreur serveur');
          alert(msg);
        }
      });
    }
  }

  // 🔹 bouton "S’inscrire"
  goToRegister() {
    this.router.navigate(['/inscription']);
  }
}
