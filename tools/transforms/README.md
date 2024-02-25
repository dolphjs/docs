# Transforms overview

All the content that is rendered by the docs.dolphjs.com application, and some of its
configuration files, are generated from source files by [Dgeni](https://github.com/angular/dgeni).
Dgeni is a general purpose documentation generation tool.

Markdown files in `content` are processed and transformed
into files that are consumed by the `docs.dolphjs.com` web frontend.

## Packages

The documentation tool of dolphjs is split into multiple Dgeni packages.

**dolphjs-package**

The main package. Orchestrates all the following packages and sets
final configuration. It is responsible for cleaning up the file system.

**dolphjs-base-package**

The base package for common configurations, services and processors for
each package. It handles the general input / output / template path resolution.

**dolphjs-content-package**

Orchestrates all hand-written contents for the dolphjs documentation.
It makes use of the `content`-folders markdown. On top of that
it takes care of the `content/**/*.json` files such as `content/discover/who-uses.json`.

**content-package**

A package to handle the markdown content files. It creates a new DocType `content`
which include a `content` and `title` of each markdown file.
The **dolphjs-content-package** manages this content further.

## Templates

All the templates for the docs.dolphjs.com dgeni transformations are stored in the `tools/transforms/templates`
folder. See the [README](./templates/README.md).
