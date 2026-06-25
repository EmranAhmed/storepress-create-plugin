---
name: php-to-mustache
description: Convert StorePress WordPress plugin PHP source files into Mustache scaffolding templates by replacing plugin-specific identifiers (namespace, slug, version, text domain) with Mustache tags while leaving framework/vendor identifiers untouched. Use this skill whenever the user asks to "make template", "make mustache template", "convert it", "convert to mustache", "mustache it", "templatize this", or otherwise wants a concrete plugin PHP file turned into a reusable `@storepress/create-plugin`-style template. Trigger even if the user just pastes a PHP file and says "convert" — assume Mustache templating is the goal in a StorePress plugin context.
---

# PHP → Mustache Template Conversion

Convert a concrete StorePress plugin PHP file into a Mustache template suitable for plugin scaffolding (e.g. `@wordpress/create-block` / `@storepress/create-plugin`). The job is a **targeted find-and-replace**: swap the *plugin-specific* identifiers for Mustache tags, and leave everything else — framework code, vendor namespaces, WordPress APIs, method bodies, logic — byte-for-byte identical.

The hard part is knowing *what is plugin-specific and replaceable* vs *what is stable and must never be touched*. Get that boundary wrong and the template either leaks the source plugin's identity or corrupts a vendor reference. Read the rules below carefully before editing.

## Core principle

Only tokens that vary **per generated plugin** become Mustache tags. A token is replaceable only if it would genuinely differ for a *different* StorePress plugin. Anything that is part of a shared library, the framework, WordPress/WooCommerce, PHP, or fixed brand boilerplate stays exactly as written.

When unsure whether a token is plugin-specific, **leave it alone and ask the user**. Over-replacing is worse than under-replacing — a stray tag inside a vendor namespace breaks every generated plugin silently.

## The Mustache tag vocabulary

Use exactly these tag names. They match the conventions already in use in the user's templates — do not invent new spellings.

| Mustache tag | Replaces                                                           | Example source value |
|---|--------------------------------------------------------------------|---|
| `{{pascaleNamespace}}` | The **vendor/author** segment of the plugin's PHP namespace root   | `StorePress` in `StorePress\Base` |
| `{{slugPascalCase}}` | The **plugin** segment of the namespace (PascalCase of the slug)   | `Base` in `StorePress\Base` |
| `{{version}}` | Plugin version, used in `@since` / `@version` doc tags             | `1.0.0` |
| `{{textdomain}}` | The i18n text domain string (2nd arg of translation fns)           | `storepress-base-plugin` |
| `{{slug}}` | The plugin slug (kebab-case), when it appears as a literal         | `storepress-base-plugin` / `base` |

> Note the spelling `{{pascaleNamespace}}` (with the trailing "e") — that is the spelling the user's existing templates use. Keep it consistent even though "Pascal" is the conventional spelling; consistency across the template set matters more than correctness of the word.

If the source contains a plugin-specific token that none of these cover (e.g. a constant prefix, a plugin display name distinct from the slug), tell the user and propose a new tag name rather than silently forcing it into an existing tag.

## What is REPLACEABLE (becomes a Mustache tag)

These vary per plugin and **must** be templated:

1. **The plugin's own namespace** — split into vendor + plugin parts.
   - `namespace StorePress\Base\Integrations;` → `namespace {{pascaleNamespace}}\{{slugPascalCase}}\Integrations;`
   - `use StorePress\Base\Traits\PluginUtilityTrait;` → `use {{pascaleNamespace}}\{{slugPascalCase}}\Traits\PluginUtilityTrait;`
   - The deeper sub-namespace (`Integrations`, `Traits`, etc.) is **structural and stays literal** — only the first two segments are templated.

2. **`@package` doc tag** — `@package StorePress/Base` → `@package {{pascaleNamespace}}/{{slugPascalCase}}`
   (Note the separator here is `/`, not `\` — preserve whatever separator the source uses.)

3. **Version numbers** in `@since` and `@version` → `{{version}}`.
   - `@since 1.0.0` → `@since {{version}}`
   - `@version 1.0.0` → `@version {{version}}`

4. **Text domain strings** — the *second argument* to i18n functions (`__`, `esc_html__`, `esc_attr__`, `_e`, `esc_html_e`, `_n`, `_x`, etc.).
   - `esc_html__( 'Settings', 'storepress-base-plugin' )` → `esc_html__( 'Settings', '{{textdomain}}' )`
   - Replace **only** the text-domain argument. The translatable string itself (`'Settings'`) is real UI copy and stays literal.

5. **Literal slug occurrences** — if the kebab-case slug appears as a string literal somewhere other than the text domain (rare), template it with `{{slug}}`.

## What is STABLE (never replaced — leave byte-for-byte)

These do **not** change between plugins and must stay literal. A Mustache tag here is a bug:

1. **`StorePress\AdminUtils` and any other shared-library / vendor namespace.** This is the critical one. `StorePress\AdminUtils\Abstracts\AbstractSettings` is a *dependency*, not the plugin's own code — every generated plugin imports the same library. **Never** turn the `StorePress` in `StorePress\AdminUtils` into `{{pascaleNamespace}}`.
   - ✅ Keep: `use StorePress\AdminUtils\Abstracts\AbstractSettings;`
   - ❌ Wrong: `use {{pascaleNamespace}}\AdminUtils\Abstracts\AbstractSettings;`

   The trap: the vendor segment (`StorePress`) is textually identical to the plugin's own vendor segment, so a naïve global replace of "StorePress" will corrupt it. You must distinguish by the **second** segment: `StorePress\AdminUtils\...` is a library (stable); `StorePress\Base\...` is the plugin (templated). See the disambiguation rules below.

2. **Brand string literals that are intentionally fixed.** E.g. the menu title `esc_html__( 'StorePress', '...' )` returns the literal brand name "StorePress" as UI text — that is deliberate copy, not the plugin name. Leave the *first* argument alone; only template its text-domain (second) argument.

3. **All WordPress / WooCommerce / PHP APIs and language constructs** — `defined`, `ABSPATH`, `sprintf`, `str_ireplace`, `esc_html__` (the function name itself), `class`, `extends`, `use`, `public function`, type hints (`string`, `void`, `array<string, string>`), `$this->...`, method names, etc.

4. **Method bodies and logic** — the implementation never changes. `$this->load_template( 'settings-sidebar.php', ... )`, the array of localized strings' *keys*, control flow — all literal.

5. **Translatable UI copy** — the human-readable strings inside translation functions (`'The changes you made will be lost...'`, `'Reset All'`, `'Settings Saved'`). These are real text; do not tag them.

6. **The `die()` guard string** — `die( 'Keep Silent' )` stays literal.

## Disambiguating `StorePress\X` — the central rule

Because the plugin's vendor segment and the shared library's vendor segment are both the word `StorePress`, you cannot replace by string match. Decide per occurrence using the **second namespace segment**:

- `StorePress\AdminUtils\...` → **shared library** → leave entirely literal.
- `StorePress\<PluginPart>\...` where `<PluginPart>` is the plugin's own segment (e.g. `Base`) → **plugin code** → template as `{{pascaleNamespace}}\{{slugPascalCase}}\...`.

**How to identify the plugin's own segment:** it is the second segment that appears in the file's own `namespace` declaration. In the example, `namespace StorePress\Base\Integrations;` tells you the plugin part is `Base`. Therefore:
- every `StorePress\Base\...` → templated, and
- every other `StorePress\<Other>\...` (here `AdminUtils`) → left literal.

Do **not** hardcode `StorePress` or `Base` as the values to search for in a reusable way — they are examples. Derive the vendor part and the plugin part from the file's `namespace` line, then apply the two-segment rule. The vendor part *may* change in other inputs; only `StorePress\AdminUtils` (and similarly-structured vendor libraries) is guaranteed stable.

If a `Vendor\Something\...` import appears that you cannot classify as either the plugin's own code or a known shared library, ask the user rather than guessing.

## Procedure

1. **Read the source file** and locate its `namespace` declaration. From it, extract:
   - the **vendor segment** (1st part) → maps to `{{pascaleNamespace}}`
   - the **plugin segment** (2nd part) → maps to `{{slugPascalCase}}`
2. **Find the text domain.** It's the recurring second argument across the i18n calls (e.g. `'storepress-base-plugin'`) → maps to `{{textdomain}}`. Confirm it's consistent throughout.
3. **Find the version** in the doc block (`@since` / `@version`) → maps to `{{version}}`.
4. Walk the file top to bottom and apply replacements per the REPLACEABLE rules, while honoring every STABLE rule. Apply the two-segment disambiguation to every `Vendor\X\...` reference.
5. **Preserve formatting exactly** — indentation (the source uses tabs, including the unusual leading-tab indentation on the opening doc block), spacing inside parens (` 'Settings', '{{textdomain}}' `), alignment of `=>` in arrays, blank lines, and the trailing newline. Only the targeted tokens change; whitespace and structure are untouched.
6. **Self-check before returning** (see checklist). Then output the converted file.
7. Save the result as a `.mustache` file (e.g. `class-admin-page.php.mustache`) if the user wants a file; otherwise show it inline in a fenced block. Match the user's existing template naming if they indicate one.

## Self-check before returning

Run through this every time — these are the failure modes that actually occur:

- [ ] Did `StorePress\AdminUtils` (and any other shared-library namespace) survive **completely unchanged**? No `{{pascaleNamespace}}` leaked into it?
- [ ] Were the vendor + plugin segments derived from the file's *own* `namespace` line, not from a hardcoded "StorePress"/"Base"?
- [ ] Is every `{{textdomain}}` only in the **second** argument of i18n functions — never replacing a translatable string or a function name?
- [ ] Did the literal brand UI string (`'StorePress'` as a menu title) stay literal, with only its text-domain arg templated?
- [ ] Are all `@since` / `@version` values `{{version}}`, and `@package` set to `{{pascaleNamespace}}/{{slugPascalCase}}` with the original `/` separator?
- [ ] Are method bodies, array keys, type hints, and logic byte-identical to the source?
- [ ] Is whitespace/indentation/alignment and the trailing newline preserved exactly?
- [ ] Did you avoid inventing tag names? (Used only the vocabulary table; flagged anything uncovered to the user.)

## Worked example

A trimmed before/after showing the boundary cases. See `references/example-conversion.md` for the full file pair.

**Source:**
```php
namespace StorePress\Base\Integrations;

use StorePress\AdminUtils\Abstracts\AbstractSettings;
use StorePress\Base\Traits\PluginUtilityTrait;

public function get_menu_title(): string {
    return esc_html__( 'StorePress', 'storepress-base-plugin' );
}
```

**Template:**
```php
namespace {{pascaleNamespace}}\{{slugPascalCase}}\Integrations;

use StorePress\AdminUtils\Abstracts\AbstractSettings;
use {{pascaleNamespace}}\{{slugPascalCase}}\Traits\PluginUtilityTrait;

public function get_menu_title(): string {
    return esc_html__( 'StorePress', '{{textdomain}}' );
}
```

Note in one block: the plugin namespace is templated, the `AdminUtils` import is untouched, the `'StorePress'` UI literal is untouched, and only its text-domain argument becomes `{{textdomain}}`. That contrast is the whole skill.
