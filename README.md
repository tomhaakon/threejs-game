﻿# threejs-game

husk dette:
https://github.com/rafgraph/detect-it
https://jeremyckahn.github.io/keydrown/
https://www.mixamo.com/#/

badkend amazon s3, skal prøve supabase


## mine egne funksjoner

### sendError

import

```
import { sendError } from "./errorHandler.js";
```

bruk

```
sendError("tittel for beskjed", "innhold");
```

### handleStatus

import

```
import { sendStatus } from './handleStatus.js'
```

bruk, legg den i en funksjon du vil teste om den kjører eller ikke. om den funker vil et icon som beveger seg dukke opp nederst til venstre.

```
 sendStatus(true)
```

# install threejs-init

index.html
style.css
main.js

## vite

```
npm install --save-dev vite
npx vite
```

## three.js

```
npm install --save three
```
