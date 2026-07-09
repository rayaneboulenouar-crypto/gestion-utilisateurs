// ajouterUtilisateur.js
// Permet a l'administrateur d'ajouter un nouvel utilisateur

function initAjouterUtilisateur(utilisateurConnecte) {
  if (!utilisateurConnecte.admin) {
    document.querySelector(".page-ajouter-utilisateur").innerHTML =
      '<p class="message message-erreur" style="display:block;">Acces refuse : cette page est reservee aux administrateurs.</p>';
    return;
  }

  document.getElementById("boutonAfficherMotDePasseAjout").addEventListener("click", function () {
    basculerAffichageMotDePasse("ajoutMotDePasse", "boutonAfficherMotDePasseAjout");
  });

  document.getElementById("formulaireAjouterUtilisateur").addEventListener("submit", function (event) {
    event.preventDefault();
    traiterAjoutUtilisateur();
  });
}

function traiterAjoutUtilisateur() {
  const donnees = {
    nom: document.getElementById("ajoutNom").value.trim(),
    prenom: document.getElementById("ajoutPrenom").value.trim(),
    age: document.getElementById("ajoutAge").value.trim(),
    pseudo: document.getElementById("ajoutPseudo").value.trim(),
    email: document.getElementById("ajoutEmail").value.trim(),
    pays: document.getElementById("ajoutPays").value.trim(),
    devise: document.getElementById("ajoutDevise").value.trim(),
    avatar: document.getElementById("ajoutAvatar").value.trim()
  };
  const couleur = document.getElementById("ajoutCouleur").value;
  const motDePasse = document.getElementById("ajoutMotDePasse").value;
  const admin = document.getElementById("ajoutAdmin").checked;

  viderMessage("messageAjout");

  const erreurs = validerInformationsPersonnelles(donnees).concat(validerMotDePasse(motDePasse));

  if (erreurs.length > 0) {
    afficherErreurs("listeErreursAjout", erreurs);
    return;
  }
  afficherErreurs("listeErreursAjout", []);

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

  const bouton = document.getElementById("boutonAjouterUtilisateur");
  bouton.disabled = true;
  bouton.textContent = "Ajout en cours...";

  addUser(nouvelUtilisateur)
    .then(function () {
      afficherMessage("messageAjout", "Utilisateur ajoute avec succes.", "succes", 0);
      setTimeout(function () {
        chargerPage("listeUtilisateurs");
      }, 900);
    })
    .catch(function () {
      afficherMessage("messageAjout", messageErreurFetch(), "erreur");
      bouton.disabled = false;
      bouton.textContent = "Ajouter";
    });
}
