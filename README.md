﻿# threejs-game
https://game.tomhaakon.com/

### Backend 
hosted on render.com 
Vite, express, socket.io, cors


### Frontend
hosted on netlify
Vite

Detect-it
https://github.com/rafgraph/detect-it

Keydrown
https://jeremyckahn.github.io/keydrown/

Nipplejs
For touch joystick control for touch screen

Model 
https://www.mixamo.com/#/

## custom functions for debug

### sendError

import

```
import { sendError } from "./errorHandler.js";
```

use

```
sendError("title", "content");
```

### handleStatus

import

```
import { sendStatus } from './handleStatus.js'
```

bruk

```
 sendStatus(true)
```

# install threejs-game locally
```
cd threejs-game
npm i
npm run start ./server
npm run dev ./client
```

index.html
style.css
main.js

# init
## vite
```
npm install --save-dev vite
npx vite
```
## three.js
```
npm install --save three
```
