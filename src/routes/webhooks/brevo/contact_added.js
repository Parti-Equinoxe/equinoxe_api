module.exports = {
    exec(req) {
        console.log(req);
        //penser à ajouter verif ip
        return {message: "Bienvenu sur l'API Équinoxe !"};
    }
}