// couleur.js
// Permet a l'utilisateur connecte de changer sa couleur preferee

const COULEURS_DISPONIBLES = ["maroon", "blue", "green", "orange", "purple", "teal", "black", "gray"];

function initCouleur(utilisateur) {
  const zoneCouleur = document.getElementById("zoneCouleur");

  const estRestreint = !utilisateur.admin && Number(utilisateur.age) < 15;

  if (estRestreint) {
    zoneCouleur.innerHTML =
      '<p class="message message-info" style="display:block;">Vous devez avoir au moins 15 ans pour pouvoir changer votre couleur preferee.</p>';
    return;
  }

  const optionsHtml = COULEURS_DISPONIBLES.map(function (couleur) {
    const selectionne = couleur === utilisateur.couleur ? "selected" : "";
    return '<option value="' + couleur + '" ' + selectionne + ">" + couleur + "</option>";
  }).join("");

  zoneCouleur.innerHTML =
    '<p>Couleur actuelle : <strong id="couleurActuelle">' + utilisateur.couleur + "</strong></p>" +
    '<label for="selectCouleur">Nouvelle couleur</label>' +
    '<select id="selectCouleur">' + optionsHtml + "</select>" +
    '<button id="boutonValiderCouleur">Valider</button>' +
    '<ul id="listeErreursCouleur" class="liste-erreurs"></ul>';

  document.getElementById("boutonValiderCouleur").addEventListener("click", function () {
    validerNouvelleCouleur(utilisateur);
  });
}

function validerNouvelleCouleur(utilisateur) {
  const nouvelleCouleur = document.getElementById("selectCouleur").value;
  viderMessage("messageCouleur");

  if (estVide(nouvelleCouleur)) {
    afficherErreurs("listeErreursCouleur", ["Veuillez choisir une couleur."]);
    return;
  }
  afficherErreurs("listeErreursCouleur", []);

  const bouton = document.getElementById("boutonValiderCouleur");
  bouton.disabled = true;
  bouton.textContent = "Enregistrement...";

  const utilisateurMisAJour = Object.assign({}, utilisateur, { couleur: nouvelleCouleur });

  updateUser(utilisateur.id, utilisateurMisAJour)
    .then(function () {
      utilisateur.couleur = nouvelleCouleur;
      sessionStorage.setItem("utilisateurConnecte", JSON.stringify(utilisateur));
      document.documentElement.style.setProperty("--couleur-theme", nouvelleCouleur);
      document.getElementById("couleurActuelle").textContent = nouvelleCouleur;
      afficherMessage("messageCouleur", "Couleur mise a jour avec succes.", "succes");
      bouton.disabled = false;
      bouton.textContent = "Valider";
    })
    .catch(function () {
      afficherMessage("messageCouleur", messageErreurFetch(), "erreur");
      bouton.disabled = false;
      bouton.textContent = "Valider";
    });
}
