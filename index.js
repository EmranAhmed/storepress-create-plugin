/**
 * External dependencies
 */
const { join } = require('path')

/**
 * Converts a string to kebab-case by replacing separators (hyphens, dots,
 * underscores, spaces, and plus signs) with hyphens and lowercasing.
 *
 * @param {string} input - The string to convert.
 * @returns {string} The kebab-cased string (e.g. "my-plugin-name").
 *
 * @example
 * kebabCase('My Plugin Name') // => 'my-plugin-name'
 * kebabCase('my_plugin.name') // => 'my-plugin-name'
 */
function kebabCase (input) {
  const regex = /[-._\s+]/gi
  return input.replace(regex, '-').toLowerCase()
}

/**
 * Converts a string to snake_case by replacing separators (hyphens, dots,
 * underscores, spaces, and plus signs) with underscores and lowercasing.
 *
 * @param {string} input - The string to convert.
 * @returns {string} The snake_cased string (e.g. "my_plugin_name").
 *
 * @example
 * snakeCase('My Plugin Name') // => 'my_plugin_name'
 * snakeCase('my-plugin.name') // => 'my_plugin_name'
 */
function snakeCase(input) {
  const regex = /[-._\s+]/gi
  return input.replace(regex, '_').toLowerCase()
}

/**
 * Converts a string to CONSTANT_CASE by replacing separators (hyphens, dots,
 * underscores, spaces, and plus signs) with underscores and uppercasing.
 *
 * @param {string} input - The string to convert.
 * @returns {string} The constant-cased string (e.g. "MY_PLUGIN_NAME").
 *
 * @example
 * constantCase('my-plugin-name') // => 'MY_PLUGIN_NAME'
 * constantCase('my plugin.name') // => 'MY_PLUGIN_NAME'
 */
function constantCase (input) {
  const regex = /[-._\s+]/gi
  return input.replace(regex, '_').toUpperCase()
}

/**
 * Maps the literal string `"storepress"` to its branded casing `"StorePress"`,
 * leaving all other inputs unchanged.
 *
 * @param {string} input - The string to check.
 * @returns {string} `"StorePress"` if input is `"storepress"`, otherwise the original input.
 *
 * @example
 * pascalStorePress('storepress') // => 'StorePress'
 * pascalStorePress('myplugin')   // => 'myplugin'
 */
function pascalStorePress (input) {
  return 'storepress' === input ? 'StorePress' : input
}

/**
 * Converts a string to PascalCase by extracting alphanumeric words and
 * capitalising the first letter of each.
 *
 * @param {string} input - The string to convert.
 * @returns {string} The PascalCased string (e.g. "MyPluginName").
 *
 * @example
 * pascalCase('my-plugin-name') // => 'MyPluginName'
 * pascalCase('my plugin name') // => 'MyPluginName'
 */
function pascalCase (input) {
  return (input.match(/[a-zA-Z0-9]+/g) || []).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('')
}

/**
 * Configuration object for the `@wordpress/create-block` scaffolding tool.
 *
 * Provides default values, custom npm scripts, dependency lists, package.json
 * overrides, a view transformer, and resolved template directory paths used
 * when generating a new StorePress WordPress plugin or block.
 *
 * @type {{
 *   defaultValues: Object,
 *   pluginTemplatesPath: string,
 *   blockTemplatesPath: string,
 * }}
 */
module.exports = {
  defaultValues: {
    wpScripts: false,
    folderName: 'src/static-block',
    namespace: 'storepress',
    slug: 'plugin',
    version: '0.0.1',
    title: 'StorePress Plugin',
    description: 'A StorePress Plugin',
    author: 'EmranAhmed',
    dashicon: 'pets',
    category: 'storepress',
    attributes: {
      x: {
        type: 'number',
        default: 100,
      },
    },
    license: 'GPL-2.0-or-later',
    customScripts: {
      "wp-plugin-check": "(node -e \"process.exit(require('fs').existsSync('wp-plugin-check') ? 1 : 0)\" && npx gitget WordPress/plugin-check/phpcs-sniffs wp-plugin-check/plugin-check/phpcs-sniffs) || echo \"> Skipping wp-plugin-check download\"",
      'clean-composer': 'rimraf vendor',
      "postinstall": "npm run wp-plugin-check && npm run packages-install:all && git init -q && rimraf .husky && npm run clean-composer && composer install && npx husky init && echo \"npx lint-staged\" > .husky/pre-commit",
      'stan:php': 'composer run phpstan',
      'stan:php:report': 'composer run phpstan-report',

      'lint:php:report': 'composer run lint-report',
      'lint:php': 'composer run lint',
      'lint:php:fix': 'composer run format',
      'format:php': 'composer run format',

      'prebuild': 'rimraf build',
      'build': 'npm run start -- --no-watch && wp-scripts build --webpack-copy-php --experimental-modules',

      'check-engines': 'wp-scripts check-engines',
      'check-licenses': 'wp-scripts check-licenses',

      'format': 'wp-scripts format ./src',
      'format:all': 'npm run format:php && npm run format:css && npm run format:js',
      'format:js': 'wp-scripts format \'./src/**/*.js\'',
      'format:css': 'wp-scripts format \'./src/**/*.scss\'',

      'lint:css': 'wp-scripts lint-style \'./src/**/*.scss\'',
      'lint:css:report': 'npm run lint:css -- --output-file scss-report.txt',
      'lint:css:fix': 'npm run lint:css -- --fix',

      'lint:js': 'wp-scripts lint-js --format=pretty \'./src/**/*.js\'',
      'lint:js:report': 'npm run lint:js -- --format html --output-file lint-report.html',
      'lint:js:fix': 'npm run lint:js -- --fix',

      'lint:md:docs': 'wp-scripts lint-md-docs',
      'lint:pkg-json': 'wp-scripts lint-pkg-json',

      "packages-install:all": "node ./tools/packages-install.js",
      "packages-update:storepress": "node ./tools/packages-update.js",
      'packages-update': 'wp-scripts packages-update && npm run packages-update:storepress && composer update && composer dump-autoload',

      'prepackage': 'rimraf languages ${npm_package_name}.zip && npm run language && npm run build && npm run clean-composer && composer install --no-dev --optimize-autoloader',
      'package': 'node ./tools/package.js',
      'postpackage': 'npm run clean-composer && composer install',

      'plugin-zip': 'npm run package -- --zip',

      'test:e2e': 'wp-scripts test-e2e',
      'test:unit': 'wp-scripts test-unit-js --config jest.config.js',

      'start': 'rimraf build && wp-scripts start --webpack-copy-php --experimental-modules',

      'language': 'npm run language:make-pot && npm run language:make-json',
      "language:make-pot": "WP_CLI_PHP_ARGS='-d memory_limit=2048M' ./vendor/bin/wp i18n make-pot . languages/${npm_package_name}.pot --slug=$npm_package_name --domain=$npm_package_name --exclude=tools,node_modules,vendor,languages --package-name=\"StorePress Plugin\"",
      "language:make-json": "WP_CLI_PHP_ARGS='-d memory_limit=2048M' ./vendor/bin/wp i18n make-json languages --pretty-print",

      'create-dynamic-block': 'npx @wordpress/create-block@latest --namespace storepress --variant dynamic --no-plugin',
      'create-static-block': 'npx @wordpress/create-block@latest --namespace storepress --no-plugin',
      'create-interactive-block': 'npx @wordpress/create-block@latest --template @wordpress/create-block-interactive-template --namespace storepress --no-plugin',
      'create-woo-extension': 'npx @wordpress/create-block@latest --template @woocommerce/create-woo-extension --namespace storepress',
      'create-product-editor-block': 'npx @wordpress/create-block@latest --template @woocommerce/create-product-editor-block --namespace storepress',
    },
    npmDependencies: [
      '@wordpress/interactivity',
      '@storepress/components',
      '@storepress/icons',
      '@storepress/utils',
      '@wordpress/dom-ready',
      '@wordpress/icons',
      'clsx',
    ],
    npmDevDependencies: [
      '@wordpress/eslint-plugin',
      '@wordpress/babel-preset-default',
      '@testing-library/jest-dom',
      '@testing-library/react',
      '@testing-library/user-event',
      'jest-environment-jsdom',
      'identity-obj-proxy',
      '@wordpress/scripts',
      '@wordpress/blocks',
      '@wordpress/base-styles',
      '@wordpress/dependency-extraction-webpack-plugin',
      '@wordpress/i18n',
      'husky',
      'lint-staged',
      'fs-extra',
      'webpack-remove-empty-scripts',
      'eslint-plugin-prettier@',
      'eslint-formatter-pretty',
      'rimraf',
      'prettier'
      //'prettier@https://github.com/Automattic/wp-prettier/archive/refs/heads/wp-prettier-2.8.5.zip'
    ],
    customPackageJSON: {
      "private": true,
      "license": "GPL-2.0-or-later",
      "keywords": [
        "wordpress",
        "gutenberg",
        "block",
        "storepress"
      ],
      "homepage": "https://github.com/USERNAME/REPO",
      "repository": {
        "type": "git",
        "url": "https://github.com/USERNAME/REPO"
      },
      "bugs": {
        "url": "https://github.com/USERNAME/REPO/issues"
      },
      'files': [
        'vendor/**',
        'admin/**',
        'public/**',
        'build/**',
        'assets/**',
        'images/**',
        'includes/**',
        'templates/**',
        'languages/**',
        '*.php',
        'composer.json',
        'block.json',
        'changelog.*',
        'README.txt',
        'wpml-config.xml',
      ]
    },
    /**
     * Transforms the raw `@wordpress/create-block` view object by deriving
     * additional casing variants for the namespace and slug, injecting today's
     * date, and exposing GitHub Actions expression placeholders used in
     * workflow templates.
     *
     * @param {Object} view                - The view data provided by `@wordpress/create-block`.
     * @param {string} view.namespace      - The plugin namespace (e.g. `"storepress"`).
     * @param {string} view.slug           - The plugin slug (e.g. `"my-plugin"`).
     * @returns {Object} The extended view object with the following additional properties:
     *   - `{string} todayDate`               - ISO date string for today (YYYY-MM-DD).
     *   - `{string} constantNamespace`        - Namespace in CONSTANT_CASE.
     *   - `{string} kebabNamespace`           - Namespace in kebab-case.
     *   - `{string} pascaleNamespace`         - Namespace in PascalCase (with StorePress branding).
     *   - `{string} constantSlug`             - Slug in CONSTANT_CASE.
     *   - `{string} kebabSlug`                - Slug in kebab-case.
     *   - `{string} pascaleSlug`              - Slug in PascalCase (with StorePress branding).
     *   - `{string} GITHUB_REPOSITORY_NAME`  - GitHub Actions expression for the repository name.
     *   - `{string} GITHUB_RELEASE_NAME`      - GitHub Actions expression for the release name.
     *   - `{string} GITHUB_RELEASE_TAG`       - GitHub Actions expression for the release tag.
     *   - `{string} GITHUB_CHANGELOG_CONTENT` - GitHub Actions expression for changelog content.
     *   - `{string} GITHUB_TOKEN`             - GitHub Actions expression for the GitHub token.
     */
    transformer: (view) => {
      const todayDate = new Date().toJSON().slice(0, 10)
      const pascaleNamespace = pascalCase(pascalStorePress(view.namespace))
      const constantNamespace = constantCase(view.namespace)
      const kebabNamespace = kebabCase(view.namespace)
      const constantSlug = constantCase(view.slug)
      const kebabSlug = kebabCase(view.slug)
      const pascaleSlug = pascalCase(pascalStorePress(view.slug))
      const snakeNamespace = snakeCase(view.namespace)
      const snakeSlug = snakeCase(view.slug)

      return {
        ...view,
        todayDate: todayDate,
        constantNamespace: constantNamespace,
        kebabNamespace: kebabNamespace,
        pascaleNamespace: pascaleNamespace,
        snakeNamespace: snakeNamespace,

        constantSlug: constantSlug,
        kebabSlug: kebabSlug,
        pascaleSlug: pascaleSlug,
        snakeSlug: snakeSlug,

        GITHUB_REPOSITORY_NAME: "${{ github.event.repository.name }}",
        GITHUB_RELEASE_NAME: "${{ env.RELEASE_NAME }}",
        GITHUB_RELEASE_TAG: "${{ env.RELEASE_TAG }}",
        GITHUB_CHANGELOG_CONTENT: "${{ steps.changelog.outputs.changelog }}",
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
      }
    },
  },
  pluginTemplatesPath: join(__dirname, 'plugin-templates'),
  blockTemplatesPath: join(__dirname, 'block-templates'),
}
