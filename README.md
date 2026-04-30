# @storepress/create-plugin

This is a template for [`@wordpress/create-block`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/) Scaffolding StorePress Plugin.

## Usage

This template can be used by running the following command:

```bash
npx @wordpress/create-block@latest extension-name --namespace=storepress --template @storepress/create-plugin --target-dir .
```

Navigate to the newly created folder and get started.

```bash
cd my-extension-name
npm i                                               # Install dependencies
npm start                                           # Start developing
npx @wp-now/wp-now start                            # Start Wordpress environment
```

## Development

For development on this tool itself, you can also install from a local directory.

```bash
npx @wordpress/create-block@latest example-extension-name --template ./create-plugin 
```

### Add Tests

Please check [Base Plugin](https://github.com/EmranAhmed/storepress-base-plugin/) to add `test` and others.

This is a template to used with [`@wordpress/create-block`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/) to create a StorePress Plugin starting point.
