# equinoxe_api


## Installation

[a remplir]

```bash
cd src
npm ci # au lieux de npm i voir : https://stackoverflow.com/questions/48524417/should-the-package-lock-json-file-be-added-to-gitignore
```

## Utilisation du projet 

[a remplir]

```bash
cd src
npm run start # [a remplir]
npm run dev # [a remplir]
npm run test # [a remplir]
```

## Conventionnal commit

Les commits sur ce paquet doivent utiliser la méthode de commit conventionnel pour que les releases génèrent un numéro de version automatiquement.
Les principes basique :
- Feat
  - Permet de spécifié une nouvelle fonctionnalité développé
  - Update du numéro de version de "1.0.0" > "1.1.0"
  - Exemple de commit :
    - Basique : "feat: ma nouvelle fonctionnalité"
    - Groupé : "feat(webhook) : mise en place des webhooks"

- Fix
  - Permet de spécifié un correctif
  - Update du numéro de version de "1.0.0" > "1.0.1"
  - Exemple de commit :
    - Basique : "fix: correction de tel problème"
    - Groupé : "fix(webhook) : correction du webhook sur ..."

- Chore
  - Permet de commit sur des fichiers de "corvée", comme le readme, changelog, package-lock
  - Pas d'update du numéro de version "1.0.0" > "1.0.0"
  - Exemple de commit :
    - Basique : "chore: modification du readme"
    - Groupé : "chore(readme) : maj du readme"

Voir la documentation sur les conventionnal commits complète ici : https://www.conventionalcommits.org/en/v1.0.0/#summary

PS : Si vous le souhaitez, on pourrait ajouter au package.json un "bloqueur" qui oblige les commit à utilisé cette convention
=> voir ici : https://github.com/conventional-changelog/commitlint
=> si vous êtes OK, c'est assez simple à mettre en place

## Mise à jour du paquet

Lorsqu'on met à jour l'api sur la prod, il faudra lancer au préalable une release grâce à cette commande 

```bash
cd src
npm run release
```

Elle permet de mettre à jour le numéro de version du paquet automatiquement selon les convetionnals commit effectués.
Et aussi génère dans le fichier "CHANGELOG.md" l'historique de nos développements grâce aux commits.
