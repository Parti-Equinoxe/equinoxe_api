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
    const res = await axios.get(`https://incoming.qomon.app/${path}`, {
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
    console.log(res.data.data.contact);
    return res.data
}

qomon("contacts/127503978")

