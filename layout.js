// layout.js
// Gere l'entete, la navigation et le chargement dynamique du contenu

// Liste des pages disponibles dans le menu
const PAGES_MENU = [
  { cle: "accueil", libelle: "Accueil", admin: true, visiteur: true, init: "initAccueil" },
  { cle: "voirProfil", libelle: "Mon Profil", admin: true, visiteur: true, init: "initProfil" },
  { cle: "modifierCouleur", libelle: "Changer la couleur", admin: true, visiteur: true, init: "initCouleur" },
  { cle: "demandes", libelle: "Demandes", admin: true, visiteur: true, init: "initDemandes" },
  { cle: "listeUtilisateurs", libelle: "Utilisateurs", admin: true, visiteur: false, init: "initListeUtilisateurs" },
  { cle: "ajouterUtilisateur", libelle: "Ajouter Utilisateur", admin: true, visiteur: false, init: "initAjouterUtilisateur" }
];

// Correspondance entre la cle de page et la fonction d'initialisation (pour les pages hors menu aussi)
const INIT_FONCTIONS = {
  accueil: "initAccueil",
  voirProfil: "initProfil",
  modifierCouleur: "initCouleur",
  demandes: "initDemandes",
  listeUtilisateurs: "initListeUtilisateurs",
  ajouterUtilisateur: "initAjouterUtilisateur",
  detailsUtilisateur: "initDetailsUtilisateur",
  modifierUtilisateur: "initModifierUtilisateur"
};

// Pages accessibles uniquement aux administrateurs (protection meme si l'appel ne passe pas par le menu)
const PAGES_RESERVEES_ADMIN = ["listeUtilisateurs", "ajouterUtilisateur", "modifierUtilisateur", "detailsUtilisateur"];

// Titres de document affiches selon la page chargee dans le Content
const TITRES_PAGES = {
  accueil: "Accueil - Espace Stagiaire",
  voirProfil: "Mon Profil - Espace Stagiaire",
  modifierCouleur: "Changer ma couleur - Espace Stagiaire",
  demandes: "Demandes - Espace Stagiaire",
  listeUtilisateurs: "Utilisateurs - Espace Stagiaire",
  ajouterUtilisateur: "Ajouter Utilisateur - Espace Stagiaire",
  detailsUtilisateur: "Details Utilisateur - Espace Stagiaire",
  modifierUtilisateur: "Modifier Utilisateur - Espace Stagiaire"
};

let utilisateurConnecte = null;

document.addEventListener("DOMContentLoaded", function () {
  const donneesUtilisateur = sessionStorage.getItem("utilisateurConnecte");

  if (!donneesUtilisateur) {
    window.location.href = "login.html";
    return;
  }

  utilisateurConnecte = JSON.parse(donneesUtilisateur);

  appliquerCouleurDeFond(utilisateurConnecte.couleur);
  afficherNomUtilisateur();
  construireMenus();
  chargerPage("accueil");

  document.getElementById("boutonDeconnexion").addEventListener("click", deconnecter);
});

function appliquerCouleurDeFond(couleur) {
  document.documentElement.style.setProperty("--couleur-theme", couleur || "#2f4f2f");
}

function afficherNomUtilisateur() {
  document.getElementById("nomUtilisateurConnecte").textContent =
    utilisateurConnecte.prenom + " " + utilisateurConnecte.nom;

  const avatarEntete = document.getElementById("avatarEntete");
  avatarEntete.src = utilisateurConnecte.avatar || "images/avatar-defaut.svg";
  avatarEntete.onerror = function () {
    avatarEntete.onerror = null;
    avatarEntete.src = "images/avatar-defaut.svg";
  };
}

function construireMenus() {
  const barreNavigation = document.getElementById("barreNavigation");
  const indexVertical = document.getElementById("indexVertical");
  barreNavigation.innerHTML = "";
  indexVertical.innerHTML = "";

  PAGES_MENU.forEach(function (page) {
    const estAutorise = utilisateurConnecte.admin ? page.admin : page.visiteur;
    if (!estAutorise) return;

    const lienHorizontal = document.createElement("a");
    lienHorizontal.textContent = page.libelle;
    lienHorizontal.href = "#";
    lienHorizontal.dataset.page = page.cle;
    lienHorizontal.addEventListener("click", function (event) {
      event.preventDefault();
      chargerPage(page.cle);
    });
    barreNavigation.appendChild(lienHorizontal);

    const lienVertical = lienHorizontal.cloneNode(true);
    lienVertical.addEventListener("click", function (event) {
      event.preventDefault();
      chargerPage(page.cle);
    });
    indexVertical.appendChild(lienVertical);
  });
}

function marquerLienActif(cle) {
  document.querySelectorAll(".barre-navigation a, .index a").forEach(function (lien) {
    lien.classList.toggle("actif", lien.dataset.page === cle);
  });
}

// Charge une page HTML dans la section 'Content' et execute sa fonction d'initialisation
function chargerPage(cle, parametres) {
  const estPageAdmin = PAGES_RESERVEES_ADMIN.indexOf(cle) !== -1;
  if (estPageAdmin && !utilisateurConnecte.admin) {
    document.getElementById("sectionContenu").innerHTML =
      '<p class="message message-erreur" style="display:block;">Acces refuse : cette page est reservee aux administrateurs.</p>';
    return;
  }

  fetch("pages/" + cle + ".html")
    .then(function (res) {
      return res.text();
    })
    .then(function (html) {
      document.getElementById("sectionContenu").innerHTML = html;
      marquerLienActif(cle);
      document.title = TITRES_PAGES[cle] || "Espace Stagiaire";

      const nomFonctionInit = INIT_FONCTIONS[cle];
      if (nomFonctionInit && typeof window[nomFonctionInit] === "function") {
        window[nomFonctionInit](utilisateurConnecte, parametres);
      }
    })
    .catch(function () {
      document.getElementById("sectionContenu").innerHTML = "<p>Impossible de charger cette page.</p>";
    });
}

function deconnecter() {
  sessionStorage.removeItem("utilisateurConnecte");
  window.location.href = "login.html";
}
