const {newPanneau} = require("../../../api/panneauramix");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        const data = {
            "Identifiant panneaux": "test_2",
            "11-Commune du panneau": [
                1
            ],
            "Longitude": "49",
            "Latitude": "49",
            "1-Dernière personne passée": [
                1
            ],
            "Date dernier passage": "2020-01-01T12:00:00Z",
            "A Supprimer": false,
            "13-Circonscriptions": [
                1
            ],
            "Adresse": "42 rue du test",
            "Description": "un panneua de test",
            "1-Dernière personne a avoir modifié": [
                1
            ],
            "Compteur": 0,
            "Décollées ?": true,
            "Nom": "TEST#2"
        };
        return await newPanneau(data);
    }
};