[![npm version](https://badge.fury.io/js/@qavajs%2Fsteps-testcafe.svg)](https://badge.fury.io/js/@qavajs%2Fsteps-testcafe)

# @qavajs/steps-testcafe
Step library to work with testcafe in qavajs framework

## Installation

`npm install @qavajs/steps-testcafe`

## Configuration
```javascript
const App = require('./page_object');
module.exports = {
    default: {
        require: [
            'node_modules/@qavajs/steps-testcafe'
        ],
        browser: {
            timeout: {
                present: 10000,
                visible: 20000,
                page: 10000
            },
            capabilities: {
                browser: 'chrome'
            }
        },
        pageObject: new App()
    }
}
```

## Screenshot strategy
@qavajs/steps-testcafe has build-in capability to take screenshot on particular event. If you need to add 
screenshot to your report add _screenshot_ property to profile config.
Supported events:
- onFail
- beforeStep
- afterStep

```javascript
module.exports = {
    default: {
        screenshot: ['onFail']
    }
}
```

## Limitations
- I save value of '<cookieName>' cookie as 'cookie' is not working in hammerhead proxy mode

