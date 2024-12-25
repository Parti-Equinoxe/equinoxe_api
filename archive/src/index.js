const express = require('express');
const fs = require("fs").promises;
const {blue, magenta, blackBright, underline, redBright, green} = require("cli-color");
require("dotenv").config();
const app = express();
const tokens = ["aa"];
let routes = [];

async function readDirRoutes(path) {
    return fs.readdir(path).then(items => {
        return Promise.all(items.map(item => {
            const itemPath = `${path}/${item}`;
            return fs.stat(itemPath).then(stats => {
                if (stats.isDirectory()) return readDirRoutes(itemPath);
                if (!itemPath.endsWith(".js")) return;
                const name = itemPath.replace("routes", "").replace(".js", "").replace("index", "");
                const route = require("./" + itemPath);
                route.route = name;
                route.method = route.method || "GET";
                route.exec = route.exec || function (req, res) {
                    return res.send("/!\\ No exec function defined for this route");
                };
                console.log(`> ${name} (${magenta(route.method)})${route.auth !== "none" ? " (" + redBright(route.auth) + ")" : ""}`);
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
            if (!verifyToken(req.headers)) return res.send({
                state: "Unauthorized",
                status: 401,
                message: "You need to add authorization: Bearer <token> in the header.",
                temps: Date.now() - date,
            });
            try {
                result = await route.exec(req, res);
            } catch (e) {
                console.log(redBright(`>> erreur dans ${route.route}`));
                console.log(e);
                res.send({state: "fail", error: e, status: 400});
            }
            return res.send({
                status: 200,
                state: result.error ? "fail" : "done",
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
