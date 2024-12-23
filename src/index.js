require("dotenv").config();
const axios = require("axios");
const brevo = require("./brevo.js");

async function qomon(path) {
    const res = await axios.post(`https://incoming.qomon.app/${path}`, {
            data: {
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
            }
        },
        {
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${process.env.TOKEN_QOMON}`,
                "content-type": "application/json",
                "user-agent": "equinoxe/api"
            },
        }).catch(e => {
        console.log(e)
        console.log(`https://incoming.qomon.app/${path}`)
        return {data: e.toString()}
    });
    console.log(res.data.data.contacts[0]);
    return res.data
}

(async () => {
    //brevo("contacts?filter=equals(EMAIL,\"test_prenom_nom_tel_3@gmail.com\")")
    console.log(await brevo.get("contacts/test_prenom_nom_tel_3@gmail.com", [{
        label: "identifierType",
        value: "email_id"
    }]));
    console.log(await brevo.get("contacts/test_prenom_nom_tel_2@gmail.com", [{
        label: "identifierType",
        value: "email_id"
    }]));
    //await qomon("search")//contacts/127503978
})()

