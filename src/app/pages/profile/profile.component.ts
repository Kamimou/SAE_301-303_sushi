import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5" style="max-width:800px">
      <h2>Mon profil</h2>

      <div *ngIf="user; else notConnected" class="card p-4">
        <div class="d-flex align-items-center gap-3 mb-3">
          <img *ngIf="user?.avatar" [src]="user.avatar" class="rounded-circle" width="64" height="64" alt="avatar">
          <div>
            <h5 class="mb-0">{{ user?.first_name }} {{ user?.last_name }}</h5>
            <small class="text-muted">{{ user?.email }}</small>
          </div>
        </div>

        <button class="btn btn-outline-danger mb-3" (click)="logout()">Se déconnecter</button>

        <div *ngIf="isAdmin(); else clientView">
          <h5>Vue administrateur</h5>
          <p>Commandes par mois (données à implémenter)</p>
          <p>Chiffre d'affaires: (données à implémenter)</p>
        </div>

        <ng-template #clientView>
          <h5>Commandes en cours</h5>
          <p>(Liste des commandes en cours — implémenter l'API)</p>
          <h5 class="mt-3">Historique</h5>
          <p>(Historique des commandes — implémenter l'API)</p>
        </ng-template>

      </div>

      <ng-template #notConnected>
        <div class="card p-4">
          <p>Vous devez être connecté pour voir cette page. <a routerLink="/login">Se connecter</a></p>
        </div>
      </ng-template>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(u => this.user = u);
  }

  isAdmin() {
    return this.user?.user_type === 'admin';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
