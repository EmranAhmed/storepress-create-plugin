/**
 * External dependencies
 */
const { join } = require( 'path' );
// two-words
function kebabCase(input){
  const regex = /[-._\s+]/gi;
  return input.replace(regex, '-').toLowerCase()
}
function constantCase(input){
  const regex = /[-._\s+]/gi;
  return input.replace(regex, '_').toUpperCase()
}

function pascalStorePress(input){
  return 'storepress' === input ? 'StorePress' : input;
}

function pascalCase(input){
  return (input.match(/[a-zA-Z0-9]+/g) || []).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('');
}

module.exports = {
	defaultValues: {
    folderName: 'src/static-block',
    namespace: 'storepress',
		slug: 'plugin',
		version: '0.1.0',
		title: 'StorePress Plugin',
		description: 'A StorePress Plugin',
		author: 'EmranAhmed',
		dashicon: 'pets',
		category: 'storepress',
    attributes: {
      x: {
        type: 'number',
        default: 100
      },
    },
    license: 'GPL-3.0+',
		customScripts: {
      "clean-composer": "rm -rf ./vendor && rm -rf ./composer.lock",
      "postinstall": "git init -q && rm -rf ./.husky && npm run clean-composer && composer install",

      "lint:php": "composer run lint",
      "format:php": "composer run format",

      "prebuild": "rm -rf ./build && npm run clean-composer && composer install --no-dev --optimize-autoloader",
      "build": "npm run start -- --no-watch && wp-scripts build --webpack-copy-php --experimental-modules",

      "check-engines": "wp-scripts check-engines",
      "check-licenses": "wp-scripts check-licenses",

      "format": "wp-scripts format ./src",
      "format:all": "npm run format:php && npm run format:css && npm run format:js",
      "format:js": "wp-scripts format './src/**/*.js'",
      "format:css": "wp-scripts format './src/**/*.scss'",

      "lint:css": "wp-scripts lint-style './src/**/*.scss'",
      "lint:css:report": "npm run lint:css -- --output-file scss-report.txt",
      "lint:css:fix": "npm run lint:css -- --fix",

      "lint:js": "wp-scripts lint-js './src/**/*.js'",
      "lint:js:report": "npm run lint:js -- --format html --output-file lint-report.html",
      "lint:js:fix": "npm run lint:js -- --fix",

      "lint:md:docs": "wp-scripts lint-md-docs",
      "lint:pkg-json": "wp-scripts lint-pkg-json",

      "packages-update": "wp-scripts packages-update",

      "prepackage": "rm -rf ./languages && rm -rf ./${npm_package_name}.zip && npm run language && npm run build",
      "package": "./bin/package.js",
      "postpackage": "npm run clean-composer && composer install",

      "plugin-zip": "npm run package -- --zip",

      "test:e2e": "wp-scripts test-e2e",
      "test:unit": "wp-scripts test-unit-js",

      "start": "rm -rf ./build && wp-scripts start --webpack-copy-php --experimental-modules",

      "language": "npm run language:make-pot && npm run language:make-json",
      "language:make-pot": "./vendor/bin/wp i18n make-pot . languages/${npm_package_name}.pot --exclude=bin,node_modules,vendor,languages --package-name=\"StorePress Plugin\"",
      "language:make-json": "./vendor/bin/wp i18n make-json languages --no-purge --pretty-print",

      "create-dynamic-block": "npx @wordpress/create-block@latest --namespace storepress --variant dynamic --no-plugin",
      "create-static-block": "npx @wordpress/create-block@latest --namespace storepress --no-plugin",
      "create-interactive-block": "npx @wordpress/create-block@latest --template @wordpress/create-block-interactive-template --namespace storepress --no-plugin",
      "create-woo-extension": "npx @wordpress/create-block@latest --template @woocommerce/create-woo-extension --namespace storepress",
      "create-product-editor-block": "npx @wordpress/create-block@latest --template @woocommerce/create-product-editor-block --namespace storepress",

      "prepare": "husky install && npx husky add .husky/pre-commit \"npm run pre-commit\"",
      "pre-commit": "lint-staged"
    },
    npmDependencies: [
      '@wordpress/interactivity',
      '@storepress/components',
      '@storepress/icons',
      '@storepress/utils',
      '@wordpress/dom-ready',
      '@wordpress/icons',
      'classnames'
    ],
    npmDevDependencies: [
      '@wordpress/scripts@27.9.0',
      '@wordpress/blocks',
      '@woocommerce/dependency-extraction-webpack-plugin',
      '@woocommerce/eslint-plugin',
      '@wordpress/base-styles',
      '@wordpress/dependency-extraction-webpack-plugin@5.9.0',
      '@wordpress/i18n',
      'eslint-plugin-you-dont-need-lodash-underscore',
      'fs-extra',
      'husky@8.0.0',
      'lint-staged@15.2.5',
      'webpack-remove-empty-scripts',
      'eslint-plugin-prettier'
    ],
    customPackageJSON: {
      "lint-staged": {
        "./src/**/*.scss": [
          "npm run lint:css:fix",
          "npm run lint:css"
        ],
        "./src/**/*.{js,ts,tsx}": [
          "npm run lint:js:fix",
          "npm run lint:js"
        ],
        "*.php": [
          "npm run format:php",
          "npm run lint:php"
        ],
        "./*.md": [
          "npm run lint:md:docs"
        ],
        "./package.json": [
          "npm run lint:pkg-json"
        ]
      },
      "files": [
        "vendor/**",
        "admin/**",
        "public/**",
        "build/**",
        "assets/**",
        "images/**",
        "includes/**",
        "templates/**",
        "languages/**",
        "*.php",
        "block.json",
        "changelog.*",
        "README.txt",
        "wpml-config.xml"
      ],
      "bin": {
        "package": "./bin/package.js"
      },
    },
    transformer: ( view ) => {
        const todayDate =  new Date().toJSON().slice(0, 10);
        const pascaleNamespace = pascalCase(pascalStorePress(view.namespace))
        const constantNamespace = constantCase(view.namespace)
        const kebabNamespace = kebabCase(view.namespace)
        const constantSlug = constantCase(view.slug ) // TWO_WORDS
        const kebabSlug = kebabCase(view.slug ) // two-words
          return {
             ...view,
             todayDate: todayDate,
             constantNamespace: constantNamespace,
             kebabNamespace: kebabNamespace,
             pascaleNamespace: pascaleNamespace,

             constantSlug: constantSlug,
             kebabSlug: kebabSlug,
          };
    }
	},
	pluginTemplatesPath: join( __dirname, 'plugin-templates' ),
  blockTemplatesPath: join( __dirname, 'block-templates' ),
};
