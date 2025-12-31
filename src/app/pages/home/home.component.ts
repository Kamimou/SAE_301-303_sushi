import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="hero py-5 mb-5">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-6 text-white">
        <span class="badge badge-welcome mb-3">🍣 Bienvenue</span>

        <h1 class="display-3 fw-bold">
          Savourez<br />l'excellence
        </h1>

        <p class="lead mt-3">
          Sushis frais, préparation artisanale, livraison express.
          L'authentique expérience culinaire à votre porte.
        </p>

        <div class="mt-4 d-flex gap-3">
          <a routerLink="/menu" class="btn btn-primary btn-lg">
            🛒 Commander maintenant
          </a>
        </div>
      </div>

      <div class="col-md-6 text-center d-none d-md-block">
        <img src="/assets/products/logo-sushii.png"
             alt="Sushii"
             loading="lazy">
      </div>
    </div>
  </div>
</section>

<section class="mb-5 text-center">
  <h2 class="section-title">Pourquoi nous choisir ?</h2>
  <p class="text-muted">Trois piliers qui font la différence</p>

  <div class="container mt-5">
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card feature-card h-100">
          <div class="card-body">
            <div class="feature-icon">🌿</div>
            <h5 class="mt-3">Frais & Local</h5>
            <p class="text-muted">
              Ingrédients premium sélectionnés chez nos fournisseurs de confiance. Qualité garantie chaque jour
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card feature-card h-100">
          <div class="card-body">
            <div class="feature-icon">⚡</div>
            <h5 class="mt-3">Livraison Ultra-Rapide</h5>
            <p class="text-muted">
              30 à 45 minutes maximum. Nos livreurs s'assurent que votrecommande arrive rapidement et en parfait état.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card feature-card h-100">
          <div class="card-body">
            <div class="feature-icon">🔒</div>
            <h5 class="mt-3">Sécurisé & Légal</h5>
            <p class="text-muted">
              Conforme RGPD, données protégées. Vos informations sont en sécurité avec nous. 
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="contact mb-5">
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h2 class="mb-4 text-center">Contact</h2>
        <form (ngSubmit)="submitContact($event)">
          <div class="mb-3">
            <label class="form-label">Nom</label>
            <input class="form-control"
                   [(ngModel)]="contactData.name"
                   name="name"
                   required>
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input class="form-control"
                   [(ngModel)]="contactData.email"
                   name="email"
                   required>
          </div>

          <div class="mb-4">
            <label class="form-label">Message</label>
            <textarea class="form-control"
                      rows="5"
                      [(ngModel)]="contactData.message"
                      name="message"
                      required></textarea>
          </div>

          <button class="btn btn-primary w-100" [disabled]="submitting">
            {{ submitting ? 'Envoi...' : 'Envoyer le message ' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
  `,
  styles: [`
    .hero {
  background: linear-gradient(
    135deg,
    #e63950 0%,
    #f4a8a8 50%,
    #fdebd3 100%
  );
  border-radius: 2rem;
}


.badge-welcome {
  background: #ffd43b;
  color: #000;
  border-radius: 999px;
  font-weight: 600;
  border: none;
}


.hero-label {
  color: white;
  font-weight: 600;
  opacity: .85;
}

/* Titres sections */
.section-title {
  color: #e30613;
  font-weight: 800;
  font-size: 2.5rem;
}

.container h2 {
  max-width: 960px;
  color: #e30613;
  font-weight: 800;
}

.btn-primary {
  background-color: #e30613;
  border-color: #e30613;
}

.btn-primary:hover {
  background-color: #c90510;
  border-color: #c90510;
}


.feature-card {
  border: none;
  border-radius: 1.25rem;
  box-shadow: 0 15px 40px rgba(0,0,0,.08);
  transition: transform .3s ease;
}

.feature-card h5 {
  color: #e30613;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  font-size: 2.5rem;
    }
  `]
})




export class HomeComponent {
  contactData = { name: '', email: '', message: '' };
  submitting = false;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  submitContact(event: Event) {
    event.preventDefault();
    
    if (!this.contactData.name || !this.contactData.email || !this.contactData.message) {
      this.toastService.show('Tous les champs sont requis', 'error');
      return;
    }

    this.submitting = true;
    this.apiService.submitContact(this.contactData).subscribe({
      next: () => {
        this.toastService.show('Merci ! Nous te répondons sous 24h', 'success');
        this.contactData = { name: '', email: '', message: '' };
        this.submitting = false;
      },
      error: (error) => {
        console.error('Erreur', error);
        this.toastService.show('Erreur lors de l\'envoi', 'error');
        this.submitting = false;
      }
    });
  }
}
