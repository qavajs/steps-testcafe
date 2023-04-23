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
                browserName: 'chromium'
            }
        },
        pageObject: new App()
    }
}
```

## Connect to testcafe server
In order to connect to testcafe server pass _wsEndpoint_ property in capabilities object
```typescript
{
    capabilities: {
        browserName: 'chromium',
        wsEndpoint: 'ws://127.0.0.1:60291/2bd48ce272de2b543e4c8c533f664b83'    
    }
}
```

## Connect to cdp endpoint
In order to connect to CDP endpoint pass _cdpEndpoint_ property in capabilities object 
```typescript
{
    capabilities: {
        browserName: 'chromium',
        cdpEndpoint: 'http://localhost:9222/'    
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

## testcafe traces
@qavajs support capturing testcafe traces. https://testcafe.dev/docs/next/trace-viewer-intro
```typescript
{
    browser: {
        trace: {
            event: ['onFail'], // Events to save trace. Possible value onFail or AfterScenario 
            dir: 'dirToStoreTraces', // Dir to store traces. Default is traces/
            attach: true // Define if trace need to be attached to cucumber report. Default false
        }
    }
}
```
