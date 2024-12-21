require("dotenv").config();
const axios = require("axios");

async function brevo(path) {
    const res = await axios.get(`https://api.brevo.com/v3/${path}`, {
        headers: {
            "accept": "application/json",
            "api-key": process.env.TOKEN_BREVO,
            "content-type": "application/json"
        }
    }).catch(e => {
        console.log(e)
    });
    console.log(res.data);
    return res.data
}

async function qomon(path) {
    const res = await axios.post(`https://incoming.qomon.app/${path}`, {
        data: {
            "advanced_search": {
                "per_page": 10,
                "query": {
                    "$all": []
                }
            }
        }
    }, {
        headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${process.env.TOKEN_QOMON}`,
            "content-type": "application/json"
        },
    }).catch(e => {
        console.log(e)
    });
    console.log(res.data);
    return res.data
}

qomon("search")

