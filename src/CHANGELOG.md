# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.4.0](https://github.com/Parti-Equinoxe/equinoxe_api/compare/v1.3.4...v1.4.0) (2025-04-10)


### Features

* **webhook mail:** ajout date d'envoie ([535aabd](https://github.com/Parti-Equinoxe/equinoxe_api/commit/535aabd3e2baaa3dae21a745aed10f7e2edf1f89))

## [1.3.4](https://github.com/Parti-Equinoxe/equinoxe_api/compare/v1.3.3...v1.3.4) (2025-04-10)


### Bug Fixes

* maj gitignore ([dd4cae6](https://github.com/Parti-Equinoxe/equinoxe_api/commit/dd4cae64fa6217eb91fa364011f554eea554fbf3))
* **webhook mail:** fix crash (affichage mail d'envoi) ([3984810](https://github.com/Parti-Equinoxe/equinoxe_api/commit/39848107af8a166f1d6a0b4c350f1e48da6f2e54))

## [1.3.3](https://github.com/Parti-Equinoxe/equinoxe_api/compare/v1.3.2...v1.3.3) (2025-04-08)


### Bug Fixes

* ajout DISCORD_WEBHOOK_RELECTURE ([acf030e](https://github.com/Parti-Equinoxe/equinoxe_api/commit/acf030e94e921915f004bca6acb2c2f5627442e8))
* **webhook mail:** passe le lien en ENV (oups) ([a2509ff](https://github.com/Parti-Equinoxe/equinoxe_api/commit/a2509ff7eadd95a6ebd6f5c11efe4b7d4492173c))

## [1.3.2](https://github.com/Parti-Equinoxe/equinoxe_api/compare/v1.3.1...v1.3.2) (2025-04-07)


### Bug Fixes

* **webhook mail:** Ajout verif si pas de body ([dbd0377](https://github.com/Parti-Equinoxe/equinoxe_api/commit/dbd03775f3464ab514d016877a35020e04f36550))
* **webhook mail:** crash si pas de corps de text ([63521a6](https://github.com/Parti-Equinoxe/equinoxe_api/commit/63521a6d1b6e759ce5178f904cd1ae1b77ae061e))

## [1.3.1](https://github.com/Parti-Equinoxe/equinoxe_api/compare/v1.3.0...v1.3.1) (2025-04-07)


### Bug Fixes

* **webhook mail:** oublier de remettre en en POST ([81ffcd0](https://github.com/Parti-Equinoxe/equinoxe_api/commit/81ffcd07c56a184befb42d1ef98d2f02c344031a))

## [1.3.0](https://github.com/Parti-Equinoxe/equinoxe_api/compare/v1.2.2...v1.3.0) (2025-04-07)


### Features

* ajout version dans env + date démarage ([825f853](https://github.com/Parti-Equinoxe/equinoxe_api/commit/825f8538ebddc7e45bc05b92f42d6f19377f080e))
* **webhook mail:** ajout webhook parser vers discord pour les nouveaux mails ([090b468](https://github.com/Parti-Equinoxe/equinoxe_api/commit/090b4682818f157963e5c5d9412b1f0dd0f8389c))


### Bug Fixes

* crash res.redirect ([b917e24](https://github.com/Parti-Equinoxe/equinoxe_api/commit/b917e24ecbf408083099ef9a94dd6a3e1b56ba06))
* supprimer des log inutiles ([b445298](https://github.com/Parti-Equinoxe/equinoxe_api/commit/b4452989391e709c6696e14b6417d3907e27a8c4))
* unlogin bloqué par un return ([b9a9dd8](https://github.com/Parti-Equinoxe/equinoxe_api/commit/b9a9dd83f0503fb32a03982de89abd72aaa9f43a))

## [1.2.3](https://github.com/Parti-Equinoxe/equinoxe_api/compare/v1.2.2...v1.2.3) (2025-03-11)


### Bug Fixes

* crash res.redirect ([b917e24](https://github.com/Parti-Equinoxe/equinoxe_api/commit/b917e24ecbf408083099ef9a94dd6a3e1b56ba06))
* supprimer des log inutiles ([b445298](https://github.com/Parti-Equinoxe/equinoxe_api/commit/b4452989391e709c6696e14b6417d3907e27a8c4))
* unlogin bloqué par un return ([b9a9dd8](https://github.com/Parti-Equinoxe/equinoxe_api/commit/b9a9dd83f0503fb32a03982de89abd72aaa9f43a))

## [1.2.2](https://github.com/Parti-Equinoxe/equinoxe_api/compare/v1.2.1...v1.2.2) (2025-03-10)


### Bug Fixes

* crash[#2](https://github.com/Parti-Equinoxe/equinoxe_api/issues/2) ([c4afe8d](https://github.com/Parti-Equinoxe/equinoxe_api/commit/c4afe8d28e4f6090853ca5175bf8d25f8ff2b9a3))

## [1.2.1](https://github.com/Parti-Equinoxe/equinoxe_api/compare/v1.2.0...v1.2.1) (2025-03-10)


### Bug Fixes

* correction crash lorsque pas de return (res.redirect) ([59dbd72](https://github.com/Parti-Equinoxe/equinoxe_api/commit/59dbd72d8d9dfa55ae2e00c96e1b9f113fdf8da3))

## 1.2.0 (2025-03-10)


### Features

* Ajout d'une route version ([7a391ec](https://github.com/Parti-Equinoxe/equinoxe_api/commit/7a391ecbbcbf362effee42e33839f292bb512c24))
* **tag-version:** ajout des numéros de version sur le paquet et un changelog automatique ([bf9ce02](https://github.com/Parti-Equinoxe/equinoxe_api/commit/bf9ce02d8198c8c716e52cd8cdfe3e5c3c977596))


### Bug Fixes

* meilleur syntaxe du log ([b99537e](https://github.com/Parti-Equinoxe/equinoxe_api/commit/b99537e84d1413f13c3421f0b5432e916b67e7cd))
* PBKAC ([7ebed2a](https://github.com/Parti-Equinoxe/equinoxe_api/commit/7ebed2a02c4659c3eb501cb341671abcbdf424a9))

## 1.1.0 (2025-02-12)


### Features

* **tag-version:** ajout des numéros de version sur le paquet et un changelog automatique ([bf9ce02](https://github.com/Parti-Equinoxe/equinoxe_api/commit/bf9ce02d8198c8c716e52cd8cdfe3e5c3c977596))


### Bug Fixes

* PBKAC ([7ebed2a](https://github.com/Parti-Equinoxe/equinoxe_api/commit/7ebed2a02c4659c3eb501cb341671abcbdf424a9))

## 1.0.1 (2025-02-12)


### Bug Fixes

* PBKAC ([7ebed2a](https://github.com/Parti-Equinoxe/equinoxe_api/commit/7ebed2a02c4659c3eb501cb341671abcbdf424a9))
