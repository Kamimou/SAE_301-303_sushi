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
    <section class="hero bg-light py-5 mb-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="display-4 fw-bold">Bienvenue chez Sushii</h1>
            <p class="lead text-muted">Des sushis frais, préparation maison, livraison rapide.</p>
            <a href="/menu" routerLink="/menu" class="btn btn-primary btn-lg">Commander</a>
          </div>
          <div class="col-md-6">
            <img src="/assets/hero.jpg" alt="Sushis" class="img-fluid rounded" loading="lazy">
          </div>
        </div>
      </div>
    </section>

    <section class="features mb-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <h5 class="card-title">Frais & local</h5>
                <p class="card-text">Ingrédients sélectionnés chez nos fournisseurs locaux.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <h5 class="card-title">Livraison rapide</h5>
                <p class="card-text">Livraison en 30–45 min dans la zone.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <h5 class="card-title">Sûr & conforme</h5>
                <p class="card-text">Conforme RGPD : seules les données nécessaires sont collectées.</p>
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
            <h2 class="mb-4">Contact</h2>
            <form (ngSubmit)="submitContact($event)" #contactForm="ngForm">
              <div class="mb-3">
                <label class="form-label">Nom</label>
                <input type="text" class="form-control" 
                       [(ngModel)]="contactData.name" name="name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" 
                       [(ngModel)]="contactData.email" name="email" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Message</label>
                <textarea class="form-control" rows="5"
                          [(ngModel)]="contactData.message" name="message" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="submitting">
                {{ submitting ? 'Envoi...' : 'Envoyer' }}
              </button>
            </form>
            <p class="text-muted mt-3 small">Pour la politique de confidentialité et mentions légales, voir les liens en bas.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      border-bottom: 1px solid #dee2e6;
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
