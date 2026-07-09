// createAccount.js
// Gere le formulaire de creation de compte

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("boutonAfficherMotDePasse").addEventListener("click", function () {
    basculerAffichageMotDePasse("motDePasse", "boutonAfficherMotDePasse");
  });
  document.getElementById("boutonAfficherConfirmation").addEventListener("click", function () {
    basculerAffichageMotDePasse("confirmationMotDePasse", "boutonAfficherConfirmation");
  });

  const formulaireCreation = document.getElementById("formulaireCreation");
  formulaireCreation.addEventListener("submit", function (event) {
    event.preventDefault();
    traiterCreationCompte();
  });
});

function traiterCreationCompte() {
  const donnees = {
    nom: document.getElementById("nom").value.trim(),
    prenom: document.getElementById("prenom").value.trim(),
    age: document.getElementById("age").value.trim(),
    pseudo: document.getElementById("pseudo").value.trim(),
    email: document.getElementById("email").value.trim(),
    pays: document.getElementById("pays").value.trim(),
    devise: document.getElementById("devise").value.trim(),
    avatar: document.getElementById("avatar").value.trim()
  };
  const couleur = document.getElementById("couleur").value;
  const admin = document.getElementById("admin").checked;
  const motDePasse = document.getElementById("motDePasse").value;
  const confirmationMotDePasse = document.getElementById("confirmationMotDePasse").value;

  viderMessage("messageCreation");

  const erreurs = validerInformationsPersonnelles(donnees).concat(
    validerMotDePasse(motDePasse, confirmationMotDePasse)
  );

  if (erreurs.length > 0) {
    afficherErreurs("listeErreurs", erreurs);
    return;
  }
  afficherErreurs("listeErreurs", []);

  const nouvelUtilisateur = {
    nom: donnees.nom,
    prenom: donnees.prenom,
    age: donnees.age,
    admin: admin,
    MotDePasse: motDePasse,
    pseudo: donnees.pseudo,
    couleur: couleur,
    Devise: donnees.devise,
    Pays: donnees.pays,
    avatar: estVide(donnees.avatar) ? "https://loremflickr.com/200/200/avatar" : donnees.avatar,
    email: donnees.email,
    photo: "https://loremflickr.com/640/480/people"
  };

  const boutonCreer = document.getElementById("boutonCreer");
  boutonCreer.disabled = true;
  boutonCreer.textContent = "Creation en cours...";

  addUser(nouvelUtilisateur)
    .then(function () {
      afficherMessage("messageCreation", "Compte cree avec succes. Redirection vers la connexion...", "succes", 0);
      setTimeout(function () {
        window.location.href = "login.html";
      }, 1200);
    })
    .catch(function () {
      afficherMessage("messageCreation", messageErreurFetch(), "erreur");
      boutonCreer.disabled = false;
      boutonCreer.textContent = "Creer le compte";
    });
}
