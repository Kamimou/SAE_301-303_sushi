import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

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

       

        <div *ngIf="isAdmin(); else clientView">
          <h5>Vue administrateur</h5>

          <div *ngIf="loadingStats" class="text-center">Chargement des statistiques…</div>
        <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

          <div *ngIf="!loadingStats && !errorMessage">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div>
                <small class="text-muted">Période&nbsp;:</small>
                <span class="ms-2">12 derniers mois</span>
              </div>
              <div class="text-muted small">Données basées sur les commandes enregistrées</div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-4">
                <h6>Nombre de commandes par mois</h6>
                <div class="chart-wrapper" style="height:320px; max-height:420px;">
                  <canvas #ordersCanvas></canvas>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <h6>Chiffre d'affaires par mois</h6>
                <div class="chart-wrapper" style="height:320px; max-height:420px;">
                  <canvas #revenueCanvas></canvas>
                </div>
              </div>
            </div>
            <div *ngIf="stats && stats.labels?.length === 0" class="text-muted">Pas encore de données.</div>

          </div>

        </div>

        <ng-template #clientView>
  <h5 class="mt-4">Mon Historique de Commandes</h5>
  
  <div *ngIf="loadingOrders" class="text-center p-3">
    Chargement de vos commandes...
  </div>

  <div *ngIf="!loadingOrders && orders.length === 0" class="alert alert-light border">
    Vous n'avez pas encore passé de commande.
  </div>

  <div *ngIf="!loadingOrders && orders.length > 0" class="table-responsive">
    <table class="table table-hover mt-2">
      <thead class="table-light">
        <tr>
          <th>Référence</th>
          <th>Date</th>
          <th>Total</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let order of orders">
          <td><small class="text-monospace">{{ order.ref }}</small></td>
          <td>{{ order.created_at | date:'dd/MM/yyyy HH:mm' }}</td>
          <td><strong>{{ order.total | number:'1.2-2' }} €</strong></td>
          <td>
            <span class="badge" [ngClass]="{
              'bg-warning text-dark': order.status === 'Pending',
              'bg-success': order.status === 'Completed',
              'bg-info': order.status === 'Shipping'
            }">{{ order.status }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</ng-template>

 <button class="btn btn-outline-danger mb-3" (click)="logout()">Se déconnecter</button>

      </div>

      <ng-template #notConnected>
        <div class="card p-4">
          <p>Vous devez être connecté pour voir cette page. <a routerLink="/login">Se connecter</a></p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
    .chart-wrapper { position: relative; width: 100%; }
    .chart-wrapper canvas { width: 100% !important; height: 100% !important; display: block; }

    .container h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1f2937;
  position: relative;
  margin-bottom: 24px;
}

.container h2::after {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  background-color: #ff4b5c;
  border-radius: 999px;
  margin-top: 10px;
}

.container .card {
  border: none;
  border-radius: 26px;
  background-color: #ffffff;
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.08);
}

.container img.rounded-circle {
  border: 3px solid #ff4b5c;
  object-fit: cover;
}
.container h5 {
  font-weight: 600;
  color: #1f2937;
}

.container small.text-muted {
  color: #6b7280 !important;
}

.btn-outline-danger {
  border-radius: 14px;
  font-weight: 600;
  border-color: #ff4b5c;
  color: #ff4b5c;
}

.btn-outline-danger:hover {
  background-color: #ff4b5c;
  color: #fff;
}

.container h6 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.chart-wrapper {
  background-color: #f9fafb;
  border-radius: 18px;
  padding: 16px;
}

.table {
  border-radius: 18px;
  overflow: hidden;
}

.table thead {
  background-color: #f9fafb;
}

.table th {
  font-weight: 600;
  color: #1f2937;
}

.table td {
  vertical-align: middle;
}

.badge {
  border-radius: 999px;
  padding: 6px 12px;
  font-weight: 600;
  font-size: 0.75rem;
}

.bg-warning {
  background-color: #fde68a !important;
}

.bg-success {
  background-color: #86efac !important;
}

.bg-info {
  background-color: #bae6fd !important;
}

.alert {
  border-radius: 16px;
}

ng-template .card {
  text-align: center;
}

    `
  ]
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  user: User | null = null;
  orders: any[] = [];
  loadingOrders = false;

  @ViewChild('ordersCanvas') ordersCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueCanvas') revenueCanvasRef!: ElementRef<HTMLCanvasElement>;

  loadingStats = true;
  errorMessage: string | null = null;
  stats: { months?: number; labels: string[]; orders: number[]; revenue: number[] } | null = null;
  selectedMonths = 12;

  private ordersChart: any = null;
  private revenueChart: any = null;

  constructor(private auth: AuthService, private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(u => {
      this.user = u;
      if (this.user) {
        if (this.isAdmin()) {
          setTimeout(() => this.loadStats(), 0);
        } else {
          this.loadUserOrders(); // <--- APPELER L'HISTORIQUE SI CLIENT
        }
      }
    });
  }
  
  loadUserOrders() {
    if (!this.user?.id) return;
    this.loadingOrders = true;
    this.api.getUserOrders(this.user.id).subscribe({
      next: (data : any) => {
        this.orders = data;
        this.loadingOrders = false;
      },
      error: (err : any) => {
        console.error('Erreur historique', err);
        this.loadingOrders = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Pas strictement nécessaire car on déclenche via le subscribe, mais garde au cas où
    if (this.isAdmin()) {
      setTimeout(() => this.loadStats(), 0);
    }
  }

  ngOnDestroy(): void {
    try { this.ordersChart?.destroy(); } catch (e) {}
    try { this.revenueChart?.destroy(); } catch (e) {}
  }

  isAdmin() {
    return this.user?.user_type === 'admin';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }


  loadStats(months: number = this.selectedMonths) {
    this.loadingStats = true;
    this.errorMessage = null;
    this.api.getOrdersStats(months).subscribe({
      next: (res) => {
        this.stats = res;
        this.selectedMonths = res.months ?? months;
        try {
          this.renderCharts();
        } catch (e) {
          console.error('Erreur lors du rendu des graphiques', e);
          this.errorMessage = 'Erreur lors du rendu des graphiques.';
        } finally {
          this.loadingStats = false;
        }
      },
      error: (err) => {
        console.error('Erreur stats', err);
        this.errorMessage = err?.error?.error || err?.message || 'Erreur réseau lors de la récupération des statistiques.';
        this.loadingStats = false;
      }
    });
  }




  renderCharts() {
    if (!this.stats) return;

    const Chart = (window as any).Chart;
    if (!Chart) {
      console.error('Chart.js introuvable. Ajoutez le script CDN dans index.html ou installez chart.js.');
      return;
    }

    // Vérifications sur les canvas
    if (!this.ordersCanvasRef?.nativeElement) {
      console.error('Canvas orders introuvable');
      return;
    }
    if (!this.revenueCanvasRef?.nativeElement) {
      console.error('Canvas revenue introuvable');
      return;
    }

    // Orders chart
    try { this.ordersChart?.destroy(); } catch (e) {}
    const ctx1 = this.ordersCanvasRef.nativeElement.getContext?.('2d');
    if (ctx1) {
      this.ordersChart = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: this.stats.labels.map(l => {
            const d = new Date(l + '-01');
            return d.toLocaleString('fr-FR', { month: 'short', year: 'numeric' });
          }),
          datasets: [{
            label: 'Commandes',
            data: this.stats.orders,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { autoSkip: true, maxRotation: 0, maxTicksLimit: 12 }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { precision: 0 } }
          },
          plugins: { legend: { display: true } }
        }
      });
    } else {
      console.error('Impossible d’obtenir le contexte 2D pour ordersCanvas');
    }

    // Revenue chart
    try { this.revenueChart?.destroy(); } catch (e) {}
    const ctx2 = this.revenueCanvasRef.nativeElement.getContext?.('2d');
    if (ctx2) {
      this.revenueChart = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: this.stats.labels.map(l => {
            const d = new Date(l + '-01');
            return d.toLocaleString('fr-FR', { month: 'short', year: 'numeric' });
          }),
          datasets: [{
            label: "Chiffre d'affaires (€)",
            data: this.stats.revenue,
            backgroundColor: 'rgba(75, 192, 192, 0.3)',
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { autoSkip: true, maxRotation: 0, maxTicksLimit: 12 }, grid: { display: false } },
            y: { beginAtZero: true }
          }
        }
      });
    } else {
      console.error('Impossible d’obtenir le contexte 2D pour revenueCanvas');
    }
  }
}
