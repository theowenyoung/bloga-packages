# Bloga core

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

For get config from bloga

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running.

Say what the step will be

```
yarn add bloga-core
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo.

## Usage <a name = "usage"></a>

Add notes about how to use the system.


### Get Site Config

```javascript
const bloga = require('bloga-core')
const init = async ()=>{
  // if there is no options, it will read enviroment var
  // export BLOGA_SITE_CONFIG_URL = https://bloga.owenyoung.com/api/v1/sites/iBgRIF1KUH2uCzzGQm5ld/settings.json
  const {data} = await bloga.getSiteConfig({
    url:'https://bloga.owenyoung.com/api/v1/sites/iBgRIF1KUH2uCzzGQm5ld/settings.json'
  })
}

```