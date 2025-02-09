const express = require('express');
const cookieParser = require("cookie-parser");
const fs = require("fs").promises;
const {blue, magenta, blackBright, underline, redBright} = require("cli-color");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
const tokens = ["aa"];
let routes = [];

// TODO: Stocker la dernier request si une erreur ce produit

async function readDirRoutes(path) {
    return fs.readdir(path).then(items => {
        return Promise.all(items.map(item => {
            const itemPath = `${path}/${item}`;
            return fs.stat(itemPath).then(stats => {
                if (stats.isDirectory()) return readDirRoutes(itemPath);
                if (!itemPath.endsWith(".js")) return;
                const name = itemPath.replace("routes", "").replace(".js", "").replace("index", "");
                const route = require("./" + itemPath);
                if (route.disabled) return;
                route.route = name;
                route.method = route.method || "GET";
                route.token = route.token || false;
                route.exec = route.exec || function (req, res) {
                    return res.send("/!\\ No exec function defined for this route");
                };
                console.log(`> ${name} (${magenta(route.method)})`);
                return routes.push(route);
            });
        }));
    });
}

function verifyToken(headers) {
    if (!headers.authorization) return false;
    const token = headers.authorization.replace("Bearer ", "");
    console.log(token);
    return tokens.includes(token);
}

async function init() {
    console.log(blue.bold("Loading routes:"));
    await readDirRoutes("routes");
    for (const route of routes) {
        app[route.method.toLowerCase()](route.route, async (req, res) => {
            const date = Date.now();
            let result = {};
            if (route.token && !verifyToken(req.headers)) {
                console.log(redBright(`>> Unauthorized access to ${route.route} from ${req.headers.host} (${req.ip})`));
                /*return res.status(401).send({
                    state: "Unauthorized",
                    status: 401,
                    message: "You need to add authorization: Bearer <token> in the header.",
                    temps: Date.now() - date,
                });*/
            }
            try {
                result = await route.exec(req, res);
            } catch (e) {
                const dateError = Date.now();
                console.log(redBright(`>> erreur dans ${route.route} à ${dateError.getDate()}/${dateError.getMonth() + 1}/${dateError.getFullYear()} - ${dateError.getHours()}:${dateError.getMinutes()}`));
                console.log(e);
                if (!res.headersSent) res.status(500).send({state: "Internal Server Error", error: e, status: 500});
            }
            if (result.error) {
                const dateError = Date.now();
                console.log(redBright(`>> erreur dans ${route.route} à ${dateError.getDate()}/${dateError.getMonth() + 1}/${dateError.getFullYear()} - ${dateError.getHours()}:${dateError.getMinutes()}`));
                console.log(result.error);
            }
            if (result.redirect) return res.redirect(result.redirect);
            if (res.headersSent) return;
            return res.status(result.error ? 400 : 200).send({
                status: result.error ? 400 : 200,
                state: result.error ? "Bad Request" : "OK",
                temps: Date.now() - date,
                ...result
            });
        });
    }
}

init().then(() => {
    app.listen(process.env.PORT, async () => {
        console.log(blackBright.bold(`Server is start on ` + underline(`localhost:${process.env.PORT}`)));
    });
});