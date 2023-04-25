module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "browser": true,
    "es6": true
   },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      "no-underscore-dangle": [
            "error",
            { "allow": ["_id"] }
        ]
    }
}
