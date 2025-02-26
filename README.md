# @storepress/create-plugin

This is a template for [`@wordpress/create-block`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/) to create StorePress Plugin.

## Usage

This template can be used by running the following command:

```bash
npx @wordpress/create-block@latest --template @storepress/create-plugin my-extension-name --target-dir .
```

Navigate to the newly created folder and get started.

```
cd my-extension-name
chmod +x ./tools/package.js     # Make Package JS Executable.
npm i                           # Install dependencies
npm start                       # Start developing
npx @wp-now/wp-now start        # Start Wordpress environment
```

## Development

For development on this tool itself, you can also install from a local directory.

```bash
npx @wordpress/create-block@latest --template ./path/to/storepress/create-plugin my-extension-name
```

### Add Tests

Please check [Base Plugin](https://github.com/EmranAhmed/storepress-base-plugin/) to add `test` and others.

This is a template to used with [`@wordpress/create-block`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/) to create a StorePress Plugin starting point.
