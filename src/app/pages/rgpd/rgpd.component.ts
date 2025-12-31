import { Component } from '@angular/core';

@Component({
  selector: 'app-rgpd',
  template: `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-12">
          <div class="card shadow-sm">
            <div class="card-body p-4">

              <h1 class="text-center mb-4">
                Politique de confidentialité (RGPD)
              </h1>

              <section class="mb-4">
                <h5>1. Introduction</h5>
                <p class="text-muted">
                  Chez <strong>Sushii</strong>, la protection de vos données personnelles est une
                  priorité. Cette politique explique comment nous collectons, utilisons et
                  protégeons vos informations.
                </p>
              </section>

              <section class="mb-4">
                <h5>2. Données collectées</h5>
                <ul class="text-muted">
                  <li>Nom, prénom, adresse e-mail</li>
                  <li>Données de connexion (adresse IP, identifiants)</li>
                  <li>Données de navigation (cookies, préférences)</li>
                </ul>
              </section>

              <section class="mb-4">
                <h5>3. Finalités de la collecte</h5>
                <p class="text-muted">Vos données sont utilisées pour :</p>
                <ul class="text-muted">
                  <li>Créer et gérer votre compte utilisateur</li>
                  <li>Améliorer le fonctionnement de l'application</li>
                  <li>Envoyer des notifications liées à votre activité</li>
                </ul>
              </section>

              <section class="mb-4">
                <h5>4. Durée de conservation</h5>
                <p class="text-muted">
                  Les données sont conservées pendant la durée nécessaire aux finalités prévues,
                  puis supprimées <strong>12 mois après la suppression du compte</strong>.
                </p>
              </section>

              <section class="mb-4">
                <h5>5. Partage des données</h5>
                <p class="text-muted">
                  Vos données ne sont jamais vendues. Elles peuvent être partagées uniquement avec
                  nos prestataires techniques sous contrat de confidentialité.
                </p>
              </section>

              <section class="mb-4">
                <h5>6. Vos droits</h5>
                <ul class="text-muted">
                  <li>Droit d’accès, de rectification et de suppression</li>
                  <li>Droit d’opposition et de limitation</li>
                  <li>Droit à la portabilité des données</li>
                </ul>
              </section>

              

            </div>
          </div>
        </div>
      </div>
    </div>
  `
,
  styles: [`
  .container .card {
  border: none;
  border-radius: 24px;
  background-color: #ffffff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
}

.container .card-body {
  padding: 40px;
}

.container h1 {
  font-size: 2.4rem;
  font-weight: 800;
  color: #ff4b5c;
  position: relative;
}

.container h1::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: #ff4b5c;
  border-radius: 999px;
  margin: 12px auto 0;
}

.container h5 {
  font-weight: 700;
  color: #ff4b5c;
  margin-bottom: 8px;

}

.container p,
.container ul {
  font-size: 0.95rem;
  line-height: 1.6;
}

.text-muted {
  color: #6b7280 !important;
}

.container ul {
  padding-left: 18px;
}

.container ul li {
  margin-bottom: 6px;
}

.container section {
  padding: 18px 20px;
  border-radius: 16px;
  background-color: #f9fafb;
}

.container strong {
  color: #ff4b5c;
}


  
`]
})
export class RgpdComponent {}
