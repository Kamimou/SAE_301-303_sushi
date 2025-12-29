import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
selector: 'app-register',
standalone: true,
imports: [CommonModule, ReactiveFormsModule],
template: `
<div class="container mt-5" style="max-width: 600px">
  <h2 class="text-center mb-4">Inscription</h2>

  <div class="card p-4 register-card">
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">

      <div class="mb-3">
        <label class="form-label">Nom</label>
        <input formControlName="last_name" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Prénom</label>
        <input formControlName="first_name" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Date de naissance</label>
        <input formControlName="birth_date" type="date" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">E-mail</label>
        <input formControlName="email" type="email" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Numéro de téléphone</label>
        <input formControlName="phone" type="tel" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Mot de passe</label>
        <input formControlName="password" type="password" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Adresse postale</label>
        <input formControlName="address" type="text" class="form-control" />
      </div>

      <div class="row mb-3">
        <div class="col-6">
          <label class="form-label">Code postal</label>
          <input formControlName="zip_code" type="text" class="form-control" />
        </div>
        <div class="col-6">
          <label class="form-label">Ville</label>
          <input formControlName="city" type="text" class="form-control" />
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label">Rôle</label>
        <select formControlName="role" class="form-select">
          <option value="" disabled>Choisir un rôle</option>
          <option value="client">Client</option>
          <option value="client_etudiant">Client étudiant</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="submit" [disabled]="registerForm.invalid" class="btn btn-primary w-100">
        S’inscrire
      </button>

    </form>
  </div>
</div>
`
})
export class RegisterComponent {

  registerForm = this.fb.group({
    last_name: [''],
    first_name: [''],
    birth_date: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: [''],
    zip_code: [''],
    city: [''],
    role: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private api: ApiService) {}

  onSubmit() {
    if (this.registerForm.valid) {
      const payload = this.registerForm.value;
      this.api.register(payload).subscribe({
        next: (res) => {
          if (res.success) {
            alert('Inscription réussie !');
            this.registerForm.reset();
          } else {
            alert('Erreur: ' + (res.message || 'Une erreur est survenue'));
          }
        },
        error: (err) => {
          const msg = err.error?.message || 'Erreur serveur';
          alert('Erreur: ' + msg);
        }
      });
    }
  }
}