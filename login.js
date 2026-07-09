// login.js
// Gere le formulaire d'authentification

let tentativesEchouees = 0;
const NOMBRE_MAX_TENTATIVES = 3;

document.addEventListener("DOMContentLoaded", function () {
  remplirFormulaireSiSouvenu();

  document.getElementById("boutonAfficherMotDePasse").addEventListener("click", function () {
    basculerAffichageMotDePasse("motDePasse", "boutonAfficherMotDePasse");
  });

  const formulaireLogin = document.getElementById("formulaireLogin");
  formulaireLogin.addEventListener("submit", function (event) {
    event.preventDefault();
    traiterConnexion();
  });
});

// Si l'utilisateur avait coche "Se rappeler de moi", on remplit automatiquement les champs
function remplirFormulaireSiSouvenu() {
  const utilisateurMemorise = localStorage.getItem("utilisateurMemorise");
  if (utilisateurMemorise) {
    const donnees = JSON.parse(utilisateurMemorise);
    document.getElementById("pseudo").value = donnees.pseudo;
    document.getElementById("motDePasse").value = donnees.motDePasse;
    document.getElementById("seRappeler").checked = true;
  }
}

function traiterConnexion() {
  const pseudo = document.getElementById("pseudo").value.trim();
  const motDePasse = document.getElementById("motDePasse").value.trim();
  const seRappeler = document.getElementById("seRappeler").checked;
  const erreurs = [];

  viderMessage("messageLogin");

  if (estVide(pseudo)) {
    erreurs.push("Le nom d'utilisateur est obligatoire.");
  }
  if (estVide(motDePasse)) {
    erreurs.push("Le mot de passe est obligatoire.");
  }

  if (erreurs.length > 0) {
    afficherErreurs("listeErreurs", erreurs);
    return;
  }

  afficherErreurs("listeErreurs", []);
  const boutonLogin = document.getElementById("boutonLogin");
  boutonLogin.disabled = true;
  boutonLogin.textContent = "Connexion...";

  getUsers()
    .then(function (utilisateurs) {
      const utilisateurTrouve = utilisateurs.find(function (utilisateur) {
        return utilisateur.pseudo === pseudo && utilisateur.MotDePasse === motDePasse;
      });

      if (utilisateurTrouve) {
        gererConnexionReussie(utilisateurTrouve, seRappeler, pseudo, motDePasse);
      } else {
        gererConnexionEchouee();
      }
    })
    .catch(function () {
      afficherMessage("messageLogin", messageErreurFetch(), "erreur");
      reactiverBouton();
    });
}

function gererConnexionReussie(utilisateur, seRappeler, pseudo, motDePasse) {
  sessionStorage.setItem("utilisateurConnecte", JSON.stringify(utilisateur));

  if (seRappeler) {
    localStorage.setItem("utilisateurMemorise", JSON.stringify({ pseudo: pseudo, motDePasse: motDePasse }));
  } else {
    localStorage.removeItem("utilisateurMemorise");
  }

  afficherMessage("messageLogin", "Connexion reussie. Redirection en cours...", "succes", 0);

  setTimeout(function () {
    window.location.href = "layout.html";
  }, 700);
}

function gererConnexionEchouee() {
  tentativesEchouees++;
  const restantes = NOMBRE_MAX_TENTATIVES - tentativesEchouees;

  if (restantes > 0) {
    afficherErreurs("listeErreurs", [
      "Nom d'utilisateur ou mot de passe incorrect.",
      "Tentatives restantes : " + restantes
    ]);
    reactiverBouton();
  } else {
    afficherErreurs("listeErreurs", [
      "Nom d'utilisateur ou mot de passe incorrect.",
      "Nombre maximum de tentatives atteint. Le bouton de connexion est desactive."
    ]);
    const boutonLogin = document.getElementById("boutonLogin");
    boutonLogin.disabled = true;
    boutonLogin.textContent = "LOGIN";
  }
}

function reactiverBouton() {
  const boutonLogin = document.getElementById("boutonLogin");
  boutonLogin.disabled = false;
  boutonLogin.textContent = "LOGIN";
}
