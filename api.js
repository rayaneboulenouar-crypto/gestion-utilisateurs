// api.js
// Fonctions communes pour communiquer avec l'API MockAPI
// Toutes les fonctions retournent une Promise

const API_URL = "https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire";

// Recuperer la liste complete des utilisateurs
function getUsers() {
  return fetch(API_URL)
    .then(function (res) {
      return res.json();
    });
}

// Recuperer un seul utilisateur par son id
function getUserById(id) {
  return fetch(API_URL + "/" + id)
    .then(function (res) {
      return res.json();
    });
}

// Ajouter un nouvel utilisateur
function addUser(user) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  }).then(function (res) {
    return res.json();
  });
}

// Modifier un utilisateur existant
function updateUser(id, user) {
  return fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  }).then(function (res) {
    return res.json();
  });
}

// Supprimer un utilisateur
function deleteUser(id) {
  return fetch(API_URL + "/" + id, {
    method: "DELETE"
  }).then(function (res) {
    return res.json();
  });
}
