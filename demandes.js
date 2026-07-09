// demandes.js
// Gere les demandes des utilisateurs (creation, suivi, approbation, rejet)
// Les demandes sont stockees dans localStorage car aucune API n'est fournie pour cette fonctionnalite

const CLE_DEMANDES = "demandes";

function lireDemandes() {
  const donnees = localStorage.getItem(CLE_DEMANDES);
  return donnees ? JSON.parse(donnees) : [];
}

function enregistrerDemandes(demandes) {
  localStorage.setItem(CLE_DEMANDES, JSON.stringify(demandes));
}

function initDemandes(utilisateurConnecte) {
  const zoneFormulaireDemande = document.getElementById("zoneFormulaireDemande");
  const titreListeDemandes = document.getElementById("titreListeDemandes");
  const descriptionDemandes = document.getElementById("descriptionDemandes");

  if (utilisateurConnecte.admin) {
    zoneFormulaireDemande.innerHTML = "";
    titreListeDemandes.textContent = "Toutes les demandes";
    descriptionDemandes.textContent =
      "Consultez les demandes envoyees par les visiteurs et changez leur statut a tout moment.";
  } else {
    titreListeDemandes.textContent = "Mes demandes";
    descriptionDemandes.textContent =
      "Vous pouvez soumettre une demande a l'administrateur et suivre son statut ci-dessous.";
    zoneFormulaireDemande.innerHTML =
      '<h3>Nouvelle demande</h3>' +
      '<form id="formulaireNouvelleDemande">' +
      '<div class="champ">' +
      '<label for="titreDemande">Titre</label>' +
      '<input type="text" id="titreDemande" placeholder="Ex : Demande de changement de pseudo">' +
      "</div>" +
      '<div class="champ">' +
      '<label for="descriptionDemande">Description</label>' +
      '<textarea id="descriptionDemande" rows="3" placeholder="Decrivez votre demande..."></textarea>' +
      "</div>" +
      '<button type="submit" id="boutonCreerDemande">Envoyer la demande</button>' +
      '<ul id="listeErreursDemande" class="liste-erreurs"></ul>' +
      "</form>";

    document.getElementById("formulaireNouvelleDemande").addEventListener("submit", function (event) {
      event.preventDefault();
      creerDemande(utilisateurConnecte);
    });
  }

  afficherDemandes(utilisateurConnecte);
}

function creerDemande(utilisateurConnecte) {
  const titre = document.getElementById("titreDemande").value.trim();
  const description = document.getElementById("descriptionDemande").value.trim();
  const erreurs = [];

  viderMessage("messageDemandes");

  if (estVide(titre)) erreurs.push("Le titre est obligatoire.");
  if (estVide(description)) erreurs.push("La description est obligatoire.");

  if (erreurs.length > 0) {
    afficherErreurs("listeErreursDemande", erreurs);
    return;
  }
  afficherErreurs("listeErreursDemande", []);

  const demandes = lireDemandes();
  demandes.push({
    id: Date.now().toString(),
    titre: titre,
    description: description,
    statut: "En attente",
    pseudoAuteur: utilisateurConnecte.pseudo
  });
  enregistrerDemandes(demandes);

  document.getElementById("titreDemande").value = "";
  document.getElementById("descriptionDemande").value = "";
  afficherMessage("messageDemandes", "Votre demande a ete envoyee avec succes.", "succes");

  afficherDemandes(utilisateurConnecte);
}

function afficherDemandes(utilisateurConnecte) {
  const toutesLesDemandes = lireDemandes();
  const demandesAffichees = utilisateurConnecte.admin
    ? toutesLesDemandes
    : toutesLesDemandes.filter(function (demande) {
        return demande.pseudoAuteur === utilisateurConnecte.pseudo;
      });

  const corpsTable = document.getElementById("corpsTableDemandes");
  const messageAucuneDemande = document.getElementById("messageAucuneDemande");
  corpsTable.innerHTML = "";

  if (demandesAffichees.length === 0) {
    messageAucuneDemande.style.display = "block";
    return;
  }
  messageAucuneDemande.style.display = "none";

  demandesAffichees.forEach(function (demande) {
    const ligne = document.createElement("tr");
    const classeBadge = obtenirClasseBadge(demande.statut);

    ligne.innerHTML =
      "<td>" + demande.titre + "</td>" +
      "<td>" + demande.description + "</td>" +
      "<td>" + demande.pseudoAuteur + "</td>" +
      '<td><span class="badge ' + classeBadge + '">' + demande.statut + "</span></td>" +
      '<td class="actions-demande"></td>';

    const celluleActions = ligne.querySelector(".actions-demande");

    if (utilisateurConnecte.admin) {
      ["En attente", "Approuvee", "Rejetee"].forEach(function (statutPossible) {
        if (statutPossible === demande.statut) return;
        const bouton = document.createElement("button");
        bouton.textContent = "Marquer " + statutPossible;
        bouton.addEventListener("click", function () {
          changerStatutDemande(demande.id, statutPossible, utilisateurConnecte);
        });
        celluleActions.appendChild(bouton);
      });
    } else if (demande.statut === "En attente") {
      const boutonAnnuler = document.createElement("button");
      boutonAnnuler.textContent = "Annuler";
      boutonAnnuler.addEventListener("click", function () {
        annulerDemande(demande.id, utilisateurConnecte);
      });
      celluleActions.appendChild(boutonAnnuler);
    }

    corpsTable.appendChild(ligne);
  });
}

function obtenirClasseBadge(statut) {
  if (statut === "Approuvee") return "badge-approuvee";
  if (statut === "Rejetee") return "badge-rejetee";
  return "badge-attente";
}

function changerStatutDemande(id, nouveauStatut, utilisateurConnecte) {
  const demandes = lireDemandes();
  const demande = demandes.find(function (item) {
    return item.id === id;
  });
  if (demande) {
    demande.statut = nouveauStatut;
    enregistrerDemandes(demandes);
    afficherMessage("messageDemandes", "Statut de la demande mis a jour.", "succes");
    afficherDemandes(utilisateurConnecte);
  }
}

function annulerDemande(id, utilisateurConnecte) {
  let demandes = lireDemandes();
  demandes = demandes.filter(function (item) {
    return item.id !== id;
  });
  enregistrerDemandes(demandes);
  afficherMessage("messageDemandes", "Demande annulee.", "succes");
  afficherDemandes(utilisateurConnecte);
}
