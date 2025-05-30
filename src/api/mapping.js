/**
 * Module pour mapper les champs de l'api brevo vers ceux de l'api qomon
 * @module mapping
 */
/**
 * @type {Array<{id:string, brevo: string, qomon: string, transform: function}>}
 */
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
        "brevo": "attributes.GENDER",
        "qomon": "gender",
        transform: (b) => b[0] ?? "O" // premier caractere
    },
    {
        "id": "ville",
        "brevo": "attributes.VILLE",
        "qomon": "address.city",
        transform: (b) => b
    }
]