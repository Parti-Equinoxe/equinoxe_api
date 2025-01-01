require("dotenv").config();
const brevo = require("./api/brevo.js");
const qomon = require("./api/qomon.js");


(async () => {
    console.log(await brevo.get("contacts/test_prenom_nom_tel_3@gmail.com", [{
        label: "identifierType",
        value: "email_id"
    }]));
    console.log(await qomon.post("search", {
        "advanced_search": {
            "per_page": 1,
            query: {
                "$all": [
                    {
                        "$at_least_one": [
                            {
                                "$condition": {
                                    attr: "mail",
                                    ope: "eql",
                                    value: "test_prenom_nom_tel_3@gmail.com"
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }))
})()

