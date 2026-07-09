// detailsUtilisateur.js
// Affiche les details d'un utilisateur specifique (lecture seule) - reserve aux administrateurs

function initDetailsUtilisateur(utilisateurConnecte, parametres) {
  if (!utilisateurConnecte.admin) {
    document.querySelector(".page-details-utilisateur").innerHTML =
      '<p class="message message-erreur" style="display:block;">Acces refuse : cette page est reservee aux administrateurs.</p>';
    return;
  }

  const id = parametres && parametres.id;

  document.getElementById("boutonRetourListe").addEventListener("click", function () {
    chargerPage("listeUtilisateurs");
  });

  if (!id) return;

  afficherChargement("chargementDetailsUtilisateur", "Chargement des details...");

  getUserById(id)
    .then(function (utilisateur) {
      cacherChargement("chargementDetailsUtilisateur");

      const imageAvatar = document.getElementById("detailsAvatar");
      imageAvatar.src = utilisateur.avatar || "images/avatar-defaut.svg";
      imageAvatar.style.display = "block";
      imageAvatar.onerror = function () {
        imageAvatar.onerror = null;
        imageAvatar.src = "images/avatar-defaut.svg";
      };

      document.getElementById("detailsNom").textContent = utilisateur.nom;
      document.getElementById("detailsPrenom").textContent = utilisateur.prenom;
      document.getElementById("detailsAge").textContent = utilisateur.age;
      document.getElementById("detailsPseudo").textContent = utilisateur.pseudo;
      document.getElementById("detailsEmail").textContent = utilisateur.email;
      document.getElementById("detailsPays").textContent = utilisateur.Pays;
      document.getElementById("detailsDevise").textContent = utilisateur.Devise;
      document.getElementById("detailsCouleur").textContent = utilisateur.couleur;
      document.getElementById("detailsAdmin").textContent = utilisateur.admin ? "Administrateur" : "Visiteur";
    })
    .catch(function () {
      cacherChargement("chargementDetailsUtilisateur");
      afficherMessage("messageDetailsUtilisateur", messageErreurFetch(), "erreur", 0);
    });
}
