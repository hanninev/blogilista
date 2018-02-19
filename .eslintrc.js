module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "parser": "babel-eslint",
    "extends": "eslint:recommended",
    "rules": {
  "no-console": 0,
  "eqeqeq": "error",
  "no-trailing-spaces": "error",
  "object-curly-spacing": [
      "error", "always"
  ],
  "arrow-spacing": [
      "error", { "before": true, "after": true }
  ],
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    },
    "globals": {
        "test": true,
        "expect": true,
        "describe": true
    }
};
