// profil.js
// Affiche les informations de l'utilisateur connecte (lecture seule)

function initProfil(utilisateur) {
  const imageAvatar = document.getElementById("profilAvatar");
  imageAvatar.src = utilisateur.avatar || "images/avatar-defaut.svg";
  imageAvatar.onerror = function () {
    imageAvatar.onerror = null;
    imageAvatar.src = "images/avatar-defaut.svg";
  };

  document.getElementById("profilNom").textContent = utilisateur.nom;
  document.getElementById("profilPrenom").textContent = utilisateur.prenom;
  document.getElementById("profilAge").textContent = utilisateur.age;
  document.getElementById("profilPseudo").textContent = utilisateur.pseudo;
  document.getElementById("profilEmail").textContent = utilisateur.email;
  document.getElementById("profilPays").textContent = utilisateur.Pays;
  document.getElementById("profilDevise").textContent = utilisateur.Devise;
  document.getElementById("profilCouleur").textContent = utilisateur.couleur;
  document.getElementById("profilAdmin").textContent = utilisateur.admin ? "Administrateur" : "Visiteur";
}
