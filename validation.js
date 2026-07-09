// validation.js
// Fonctions communes de validation et d'affichage utilisees dans tout le projet

// ===== VALIDATION DE BASE =====

// Verifie qu'une valeur n'est pas vide
function estVide(valeur) {
  return valeur === undefined || valeur === null || valeur.toString().trim() === "";
}

// Verifie qu'une adresse email a un format correct
function emailValide(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
}

// Verifie qu'une URL a un format correct (utilise pour le champ avatar)
function urlValide(url) {
  const regexUrl = /^https?:\/\/.+/i;
  return regexUrl.test(url);
}

// Verifie que le mot de passe respecte toutes les regles demandees :
// au moins 8 caracteres, une majuscule, une minuscule, un chiffre, un caractere special
function motDePasseValide(motDePasse) {
  if (estVide(motDePasse)) return false;
  const auMoins8 = motDePasse.length >= 8;
  const uneMajuscule = /[A-Z]/.test(motDePasse);
  const uneMinuscule = /[a-z]/.test(motDePasse);
  const unChiffre = /[0-9]/.test(motDePasse);
  const unCaractereSpecial = /[^A-Za-z0-9]/.test(motDePasse);
  return auMoins8 && uneMajuscule && uneMinuscule && unChiffre && unCaractereSpecial;
}

// ===== VALIDATION PARTAGEE DES FORMULAIRES UTILISATEUR =====
// Utilisee par createAccount.js, ajouterUtilisateur.js et modifierUtilisateur.js
// pour eviter de dupliquer les memes regles partout

function validerInformationsPersonnelles(donnees) {
  const erreurs = [];

  if (estVide(donnees.nom)) erreurs.push("Le nom est obligatoire.");
  if (estVide(donnees.prenom)) erreurs.push("Le prenom est obligatoire.");
  if (estVide(donnees.age)) {
    erreurs.push("L'age est obligatoire.");
  } else if (Number(donnees.age) <= 0 || Number(donnees.age) > 120) {
    erreurs.push("L'age doit etre compris entre 1 et 120.");
  }
  if (estVide(donnees.pseudo)) erreurs.push("Le pseudo est obligatoire.");
  if (estVide(donnees.email)) {
    erreurs.push("L'email est obligatoire.");
  } else if (!emailValide(donnees.email)) {
    erreurs.push("L'email n'est pas valide.");
  }
  if (estVide(donnees.pays)) erreurs.push("Le pays est obligatoire.");
  if (estVide(donnees.devise)) erreurs.push("La devise est obligatoire.");
  if (donnees.avatar && !estVide(donnees.avatar) && !urlValide(donnees.avatar)) {
    erreurs.push("L'URL de l'avatar n'est pas valide (doit commencer par http:// ou https://).");
  }

  return erreurs;
}

// Valide un mot de passe et, si demande, sa confirmation
function validerMotDePasse(motDePasse, confirmation) {
  const erreurs = [];

  if (estVide(motDePasse)) {
    erreurs.push("Le mot de passe est obligatoire.");
  } else if (!motDePasseValide(motDePasse)) {
    erreurs.push("Le mot de passe doit contenir au moins 8 caracteres, une majuscule, une minuscule, un chiffre et un caractere special.");
  }

  if (confirmation !== undefined) {
    if (estVide(confirmation)) {
      erreurs.push("La confirmation du mot de passe est obligatoire.");
    } else if (motDePasse !== confirmation) {
      erreurs.push("La confirmation du mot de passe ne correspond pas.");
    }
  }

  return erreurs;
}

// ===== AFFICHAGE DES ERREURS =====

// Affiche une liste d'erreurs (tableau de chaines) dans un element <ul>
function afficherErreurs(idListe, erreurs) {
  const liste = document.getElementById(idListe);
  if (!liste) return;
  liste.innerHTML = "";
  erreurs.forEach(function (erreur) {
    const item = document.createElement("li");
    item.textContent = erreur;
    liste.appendChild(item);
  });
}

// ===== MESSAGES DOM (remplace les alert()) =====

// Affiche un message (succes, erreur ou info) dans un conteneur donne.
// type : "succes" | "erreur" | "info"
// Le message disparait automatiquement apres "dureeMs" millisecondes (sauf si dureeMs vaut 0)
function afficherMessage(idConteneur, texte, type, dureeMs) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  const duree = dureeMs === undefined ? 4000 : dureeMs;

  conteneur.textContent = texte;
  conteneur.className = "message message-" + type;
  conteneur.style.display = "block";

  if (duree > 0) {
    setTimeout(function () {
      if (conteneur.textContent === texte) {
        conteneur.style.display = "none";
        conteneur.textContent = "";
      }
    }, duree);
  }
}

// Vide un conteneur de message
function viderMessage(idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;
  conteneur.textContent = "";
  conteneur.style.display = "none";
}

// ===== INDICATEUR DE CHARGEMENT =====

function afficherChargement(idConteneur, texte) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;
  conteneur.textContent = texte || "Chargement en cours...";
  conteneur.className = "indicateur-chargement";
  conteneur.style.display = "block";
}

function cacherChargement(idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;
  conteneur.style.display = "none";
}

// Message d'erreur reutilisable en cas d'echec d'une requete fetch
function messageErreurFetch() {
  return "Impossible de contacter le serveur. Veuillez reessayer.";
}

// ===== AFFICHAGE / MASQUAGE DU MOT DE PASSE =====

// Bascule un champ de mot de passe entre "password" et "text"
// et met a jour l'icone Font Awesome du bouton associe
function basculerAffichageMotDePasse(idChamp, idBouton) {
  const champ = document.getElementById(idChamp);
  const bouton = document.getElementById(idBouton);
  if (!champ || !bouton) return;

  const icone = bouton.querySelector("i");

  if (champ.type === "password") {
    champ.type = "text";
    if (icone) {
      icone.classList.remove("fa-eye");
      icone.classList.add("fa-eye-slash");
    }
    bouton.setAttribute("aria-label", "Cacher le mot de passe");
  } else {
    champ.type = "password";
    if (icone) {
      icone.classList.remove("fa-eye-slash");
      icone.classList.add("fa-eye");
    }
    bouton.setAttribute("aria-label", "Afficher le mot de passe");
  }
}
