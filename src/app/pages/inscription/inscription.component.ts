import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';


@Component({
selector: 'app-register',
standalone: true,
imports: [CommonModule, ReactiveFormsModule],
template: `
<div class="container mt-5" style="max-width: 500px">
<h2 class="text-center mb-4">Inscription</h2>


<form [formGroup]="registerForm" (ngSubmit)="onSubmit()">


<div class="container d-flex justify-content-center align-items-center min-vh-100">
  <div class="card p-4 register-card">

    

    <form>

      <div class="mb-3">
        <label class="form-label">Nom</label>
        <input type="text" class="form-control">
      </div>

      <div class="mb-3">
        <label class="form-label">Prénom</label>
        <input type="text" class="form-control">
      </div>

      <div class="mb-3">
        <label class="form-label">Date de naissance</label>
        <input type="date" class="form-control">
      </div>

      <div class="mb-3">
        <label class="form-label">E-mail</label>
        <input type="email" class="form-control">
      </div>

      <div class="mb-3">
        <label class="form-label">Mot de passe</label>
        <input type="password" class="form-control">
      </div>

      <div class="mb-3">
        <label class="form-label">Numéro de téléphone</label>
        <input type="tel" class="form-control">
      </div>

      <div class="mb-3">
        <label class="form-label">Adresse postale</label>
        <input type="text" class="form-control">
      </div>

      <div class="row mb-3">
        <div class="col-6">
          <label class="form-label">Code postal</label>
          <input type="text" class="form-control">
        </div>
        <div class="col-6">
          <label class="form-label">Ville</label>
          <input type="text" class="form-control">
        </div>
      </div>

      <div class="mb-4">
      <label class="form-label">Rôle</label>
      <select class="form-select">
        <option value="" selected disabled>Choisir un rôle</option>
        <option value="etudiant">Étudiant</option>
        <option value="admin">Admin</option>
      </select>
      </div>

      <button type="button" class="btn btn-primary w-100">
        S’inscrire
      </button>

    </form>

  </div>
</div>
`
})
export class RegisterComponent {


registerForm = this.fb.group({
name: ['', Validators.required],
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required, Validators.minLength(6)]]
});


constructor(private fb: FormBuilder) {}


onSubmit() {
if (this.registerForm.valid) {
console.log('Utilisateur inscrit :', this.registerForm.value);
alert('Inscription réussie !');
}
}
}