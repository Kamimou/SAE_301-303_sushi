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
})
export class RgpdComponent {}
