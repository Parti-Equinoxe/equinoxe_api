module.exports.config = {
    headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${process.env.TOKEN_QOMON}`,
        "content-type": "application/json",
        "user-agent": "equinoxe/api"
    },
}