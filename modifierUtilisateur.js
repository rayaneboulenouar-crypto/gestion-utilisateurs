// modifierUtilisateur.js
// Permet a l'administrateur de modifier un utilisateur existant

let utilisateurEnEditionId = null;
let utilisateurEnEditionOriginal = null;

function initModifierUtilisateur(utilisateurConnecte, parametres) {
  if (!utilisateurConnecte.admin) {
    document.querySelector(".page-modifier-utilisateur").innerHTML =
      '<p class="message message-erreur" style="display:block;">Acces refuse : cette page est reservee aux administrateurs.</p>';
    return;
  }

  const id = parametres && parametres.id;
  utilisateurEnEditionId = id;

  document.getElementById("boutonAnnulerModification").addEventListener("click", function () {
    chargerPage("listeUtilisateurs");
  });

  document.getElementById("formulaireModifierUtilisateur").addEventListener("submit", function (event) {
    event.preventDefault();
    enregistrerModificationUtilisateur();
  });

  if (!id) return;

  afficherChargement("chargementModification", "Chargement des informations...");

  getUserById(id)
    .then(function (utilisateur) {
      cacherChargement("chargementModification");
      utilisateurEnEditionOriginal = utilisateur;
      document.getElementById("modifNom").value = utilisateur.nom;
      document.getElementById("modifPrenom").value = utilisateur.prenom;
      document.getElementById("modifAge").value = utilisateur.age;
      document.getElementById("modifPseudo").value = utilisateur.pseudo;
      document.getElementById("modifEmail").value = utilisateur.email;
      document.getElementById("modifPays").value = utilisateur.Pays;
      document.getElementById("modifDevise").value = utilisateur.Devise;
      document.getElementById("modifAdmin").checked = utilisateur.admin;
    })
    .catch(function () {
      cacherChargement("chargementModification");
      afficherMessage("messageModification", messageErreurFetch(), "erreur", 0);
    });
}

function enregistrerModificationUtilisateur() {
  const donnees = {
    nom: document.getElementById("modifNom").value.trim(),
    prenom: document.getElementById("modifPrenom").value.trim(),
    age: document.getElementById("modifAge").value.trim(),
    pseudo: document.getElementById("modifPseudo").value.trim(),
    email: document.getElementById("modifEmail").value.trim(),
    pays: document.getElementById("modifPays").value.trim(),
    devise: document.getElementById("modifDevise").value.trim()
  };
  const admin = document.getElementById("modifAdmin").checked;

  viderMessage("messageModification");

  const erreurs = validerInformationsPersonnelles(donnees);
  if (erreurs.length > 0) {
    afficherErreurs("listeErreursModification", erreurs);
    return;
  }
  afficherErreurs("listeErreursModification", []);

  const utilisateurMisAJour = Object.assign({}, utilisateurEnEditionOriginal, {
    nom: donnees.nom,
    prenom: donnees.prenom,
    age: donnees.age,
    pseudo: donnees.pseudo,
    email: donnees.email,
    Pays: donnees.pays,
    Devise: donnees.devise,
    admin: admin
  });

  const boutonEnregistrer = document.getElementById("boutonEnregistrerModification");
  boutonEnregistrer.disabled = true;
  boutonEnregistrer.textContent = "Enregistrement...";

  updateUser(utilisateurEnEditionId, utilisateurMisAJour)
    .then(function () {
      afficherMessage("messageModification", "Utilisateur modifie avec succes.", "succes", 0);
      setTimeout(function () {
        chargerPage("listeUtilisateurs");
      }, 900);
    })
    .catch(function () {
      afficherMessage("messageModification", messageErreurFetch(), "erreur");
      boutonEnregistrer.disabled = false;
      boutonEnregistrer.textContent = "Enregistrer";
    });
}
