import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-light border-top mt-5">
      <div class="container py-4">
        <div class="row">
          <div class="col-md-6">
            <p class="mb-0">© Sushii — Mentions légales • Politique de confidentialité</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0">Contact RGPD : rgpd&#64;sushii.example</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}
