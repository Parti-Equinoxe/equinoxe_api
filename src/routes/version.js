const version = process.env.npm_package_version;
module.exports = {
    exec: (req, res) => {
        return {message: `Version : ${version}`, data: {version: version}};
    }
}