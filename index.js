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
          "prepare": "husky install",
          "pre-commit": "lint-staged",
          "postinstall": "rm -rf ./vendor && rm -rf ./composer.lock && composer install",
          "clean": "rm -rf ./vendor && rm -rf ./composer.lock && rm -rf ./build",
          "ready": "npm run clean && npm run build && npm run build:php",
          "build:php": "composer install --no-dev --optimize-autoloader",
          "lint:php": "composer run lint",
          "format:php": "composer run format",
          "build": "wp-scripts build --webpack-copy-php --experimental-modules",
          "check-engines": "wp-scripts check-engines",
          "check-licenses": "wp-scripts check-licenses",
          "format": "wp-scripts format ./src",
          "format:all": "npm run format:php && npm run format:css && npm run format:js",
          "format:js": "wp-scripts format './src/**/*.js'",
          "format:css": "wp-scripts format './src/**/*.scss'",
          "lint:css": "wp-scripts lint-style './src/**/*.scss'",
          "lint:css-fix": "wp-scripts lint-style './src/**/*.scss' --fix",
          "lint:js": "wp-scripts lint-js './src/**/*.js'",
          "lint:js-fix": "wp-scripts lint-js './src/**/*.js' --fix",
          "lint:md:docs": "wp-scripts lint-md-docs",
          "lint:pkg-json": "wp-scripts lint-pkg-json",
          "packages-update": "wp-scripts packages-update",
          "preplugin-zip": "rm -rf ./languages && npm run language && npm run ready",
          "plugin-zip": "wp-scripts plugin-zip",
          "postplugin-zip": "composer install",
          "test:e2e": "wp-scripts test-e2e",
          "test:unit": "wp-scripts test-unit-js",
          "start": "rm -rf ./build && wp-scripts start --webpack-copy-php --experimental-modules",
          "language": "npm run language:make-pot && npm run language:make-json",
          "language:make-pot": "./vendor/bin/wp i18n make-pot . languages/storepress-base-plugin.pot --exclude=build,assets,bin,node_modules,vendor,languages --package-name=\"StorePress Base Plugin\"",
          "language:make-json": "./vendor/bin/wp i18n make-json languages --no-purge --pretty-print",
          "create-dynamic-block": "npx @wordpress/create-block@latest --namespace storepress --variant dynamic --no-plugin",
          "create-static-block": "npx @wordpress/create-block@latest --namespace storepress --no-plugin",
          "create-interactive-block": "npx @wordpress/create-block@latest --template @wordpress/create-block-interactive-template --namespace storepress --no-plugin",
          "create-woo-extension": "npx @wordpress/create-block@latest --template @woocommerce/create-woo-extension --namespace storepress",
          "create-product-editor-block": "npx @wordpress/create-block@latest --template @woocommerce/create-product-editor-block --namespace storepress"
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
        "*.scss": [
          "npm run lint:css-fix",
          "npm run lint:css"
        ],
        "*.{js,ts,tsx}": [
          "npm run lint:js-fix",
          "npm run lint:js"
        ],
        "*.php": [
          "npm run format:php",
          "npm run lint:php"
        ],
        "*.md": [
          "npm run lint:md:docs"
        ]
      },
      "files": [
        "vendor/**",
        "admin/**",
        "build/**",
        "assets/**",
        "images/**",
        "includes/**",
        "templates/**",
        "languages/**",
        "public/**",
        "*.php",
        "block.json",
        "changelog.*",
        "LICENSE.*",
        "README.txt",
        "wpml-config.xml"
      ]
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
