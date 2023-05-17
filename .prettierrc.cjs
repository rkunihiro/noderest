/** @type {import("prettier").Config} */
module.exports = {
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: false,
    quoteProps: "consistent",
    jsxSingleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: "always",

    overrides: [
        {
            files: ["*.go", "*.mk", "Makefile", "makefile"],
            options: {
                useTabs: true,
            },
        },
        {
            files: ["*.md", "*.yaml", "*.yml"],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
