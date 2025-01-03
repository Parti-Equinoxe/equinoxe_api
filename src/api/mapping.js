module.exports = [
  {
    "id": "nom",
    "brevo": "attributes.NOM",
    "qomon": "surname",
    transform: (b) => b
  },
  {
    "id": "prenom",
    "brevo": "attributes.PRENOM",
    "qomon": "firstname",
    transform: (b) => b
  },
  {
    "id": "email",
    "brevo": "updated_email",
    "qomon": "mail",
    transform: (b) => b
  },
  {
    "id": "tel",
    "brevo": "attributes.SMS",
    "qomon": "mobile",
    transform: (b) => b
  },
  {
    "id": "code_postal",
    "brevo": "attributes.CODE_POSTAL",
    "qomon": "address.postalcode",
    transform: (b) => b
  },
  {
    "id": "genre",
    "brevo": "attributes.GENDRE",
    "qomon": "address.postalcode",
    transform: (b) => b[0] ?? "O" // premier caractere
  },
  {
    "id": "ville",
    "brevo": "attributes.VILLE",
    "qomon": "address.city",
    transform: (b) => b
  }
]