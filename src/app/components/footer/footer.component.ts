import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
  <div class="container py-4">
    <div class="row align-items-center">
      
      <!-- Logo / Nom de la marque -->
      <div class="col-md-6 mb-3 mb-md-0">
        <h5 class="fw-bold mb-1">🍣 Sushii</h5>
        <p class="small text-muted mb-0">© 2025 Sushii. Tous droits réservés.</p>
      </div>

      <!-- Liens légaux -->
      <div class="col-md-6 text-md-end text-center">
        <span class="badge">Mentions légales</span>
        <span class="badge">Politique de confidentialité</span>
      </div>

    </div>
  </div>
</footer>

  `,
    styles: [
    `
  /* Footer général avec couleurs logo */
.footer {
  background-color: #f4f1ee; /* couleur claire neutre pour contraste avec rouge/orange */
  font-family: 'Poppins', sans-serif;
  border-top: 3px solid #ffffffff; /* rouge logo */
  padding-top: 2rem;
  padding-bottom: 2rem;
}

/* Nom / Logo */
.footer h5 {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

/* Texte secondaire */
.footer p {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0;
}

.footer span {
  color: #555;
  margin-bottom: 0;
}
  
  `]

})
export class FooterComponent {}
