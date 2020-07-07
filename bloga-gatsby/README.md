bloga-gatsby
============

Bloga gatsby pre build tools

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/bloga-gatsby.svg)](https://npmjs.org/package/bloga-gatsby)
[![Downloads/week](https://img.shields.io/npm/dw/bloga-gatsby.svg)](https://npmjs.org/package/bloga-gatsby)
[![License](https://img.shields.io/npm/l/bloga-gatsby.svg)](https://github.com/theowenyoung/bloga-gatsby/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bloga-gatsby
$ bloga-gatsby COMMAND
running command...
$ bloga-gatsby (-v|--version|version)
bloga-gatsby/0.0.13 darwin-x64 node-v12.18.0
$ bloga-gatsby --help [COMMAND]
USAGE
  $ bloga-gatsby COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bloga-gatsby hello`](#bloga-gatsby-hello)
* [`bloga-gatsby help [COMMAND]`](#bloga-gatsby-help-command)
* [`bloga-gatsby init`](#bloga-gatsby-init)
* [`bloga-gatsby options`](#bloga-gatsby-options)

## `bloga-gatsby hello`

Describe the command here

```
USAGE
  $ bloga-gatsby hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/theowenyoung/bloga-gatsby/blob/v0.0.13/src/commands/hello.js)_

## `bloga-gatsby help [COMMAND]`

display help for bloga-gatsby

```
USAGE
  $ bloga-gatsby help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `bloga-gatsby init`

Describe the command here

```
USAGE
  $ bloga-gatsby init

OPTIONS
  -f, --file=file                remote file url
  -p, --path-prefix=path-prefix  path prefix

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/init.js](https://github.com/theowenyoung/bloga-gatsby/blob/v0.0.13/src/commands/init.js)_

## `bloga-gatsby options`

Generate bloga options

```
USAGE
  $ bloga-gatsby options

OPTIONS
  -f, --format=format  [default: yaml] output format, yaml or json
  -o, --override       is override bloga-options.yaml?
  -p, --path=path      file path
```

_See code: [src/commands/options.js](https://github.com/theowenyoung/bloga-gatsby/blob/v0.0.13/src/commands/options.js)_
<!-- commandsstop -->
