// utilisateurs.js
// Affiche la liste des utilisateurs (reserve aux administrateurs) avec recherche et CRUD

let listeUtilisateursComplete = [];

function initListeUtilisateurs(utilisateurConnecte) {
  if (!utilisateurConnecte.admin) {
    document.querySelector(".page-utilisateurs").innerHTML =
      '<p class="message message-erreur" style="display:block;">Acces refuse : cette page est reservee aux administrateurs.</p>';
    return;
  }

  document.getElementById("rechercheUtilisateurs").addEventListener("input", function (event) {
    filtrerEtAfficher(event.target.value);
  });

  afficherChargement("chargementUtilisateurs", "Chargement des utilisateurs...");

  getUsers()
    .then(function (utilisateurs) {
      cacherChargement("chargementUtilisateurs");
      listeUtilisateursComplete = utilisateurs;
      filtrerEtAfficher("");
    })
    .catch(function () {
      cacherChargement("chargementUtilisateurs");
      afficherMessage("messageUtilisateurs", messageErreurFetch(), "erreur", 0);
    });
}

function filtrerEtAfficher(texteRecherche) {
  const recherche = texteRecherche.trim().toLowerCase();

  const utilisateursFiltres = listeUtilisateursComplete.filter(function (utilisateur) {
    if (estVide(recherche)) return true;
    return (
      (utilisateur.nom || "").toLowerCase().includes(recherche) ||
      (utilisateur.prenom || "").toLowerCase().includes(recherche) ||
      (utilisateur.pseudo || "").toLowerCase().includes(recherche) ||
      (utilisateur.email || "").toLowerCase().includes(recherche)
    );
  });

  afficherLigneUtilisateurs(utilisateursFiltres);
}

function afficherLigneUtilisateurs(utilisateurs) {
  const corpsTable = document.getElementById("corpsTableUtilisateurs");
  const messageAucunUtilisateur = document.getElementById("messageAucunUtilisateur");
  corpsTable.innerHTML = "";

  if (utilisateurs.length === 0) {
    messageAucunUtilisateur.style.display = "block";
    return;
  }
  messageAucunUtilisateur.style.display = "none";

  utilisateurs.forEach(function (utilisateur) {
    const ligne = document.createElement("tr");

    ligne.innerHTML =
      "<td>" + utilisateur.pseudo + "</td>" +
      "<td>" + utilisateur.nom + "</td>" +
      "<td>" + utilisateur.prenom + "</td>" +
      "<td>" + utilisateur.email + "</td>" +
      "<td>" + (utilisateur.admin ? "Admin" : "Visiteur") + "</td>" +
      '<td class="actions-cellule"></td>';

    const celluleActions = ligne.querySelector(".actions-cellule");

    const boutonDetails = document.createElement("button");
    boutonDetails.textContent = "Details";
    boutonDetails.addEventListener("click", function () {
      chargerPage("detailsUtilisateur", { id: utilisateur.id });
    });

    const boutonModifier = document.createElement("button");
    boutonModifier.textContent = "Modifier";
    boutonModifier.addEventListener("click", function () {
      chargerPage("modifierUtilisateur", { id: utilisateur.id });
    });

    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.textContent = "Supprimer";
    boutonSupprimer.addEventListener("click", function () {
      supprimerUtilisateur(utilisateur.id);
    });

    celluleActions.appendChild(boutonDetails);
    celluleActions.appendChild(boutonModifier);
    celluleActions.appendChild(boutonSupprimer);

    corpsTable.appendChild(ligne);
  });
}

function supprimerUtilisateur(id) {
  const confirmation = confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
  if (!confirmation) return;

  deleteUser(id)
    .then(function () {
      listeUtilisateursComplete = listeUtilisateursComplete.filter(function (utilisateur) {
        return utilisateur.id !== id;
      });
      afficherMessage("messageUtilisateurs", "Utilisateur supprime avec succes.", "succes");
      filtrerEtAfficher(document.getElementById("rechercheUtilisateurs").value);
    })
    .catch(function () {
      afficherMessage("messageUtilisateurs", messageErreurFetch(), "erreur");
    });
}
