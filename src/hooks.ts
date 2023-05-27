import { After, AfterStep, Before, BeforeStep } from '@cucumber/cucumber';
import defaultTimeouts from './defaultTimeouts';
import { po } from '@qavajs/po-testcafe';
import { saveScreenshotAfterStep, saveScreenshotBeforeStep, takeScreenshot } from './utils/utils';
import createTestCafe from 'testcafe';
import { join } from 'path';

declare global {
    var t: TestController;
    var testcafe: TestCafe;
    var runner: Runner;
    var taskPromise: any;
    var config: any;
}

Before(async function () {
    const driverConfig = config.browser ?? config.driver;
    driverConfig.timeout = {
        ...defaultTimeouts,
        ...driverConfig.timeout
    }
    config.driverConfig = driverConfig;
    global.testcafe = await createTestCafe('localhost');
    global.runner = await testcafe.createRunner();
    global.taskPromise = runner
        .src(join(__dirname, '/testController/bootstrap.js'))
        .browsers([config.driverConfig.capabilities.browser])
        .run({
            nativeAutomation: config.driverConfig.capabilities.nativeAutomation ?? false
        });
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (global.t) {
                clearInterval(interval)
                resolve(t);
            }
        }, 500)
    })
    po.init({timeout: config.driverConfig.timeout.present});
    po.register(config.pageObject);
    this.log(`browser instance started:\n${JSON.stringify(config.driverConfig, null, 2)}`);
});

BeforeStep(async function () {
    if (saveScreenshotBeforeStep(config)) {
        try {
            this.attach(await takeScreenshot(), 'image/png');
        } catch (err) {
            console.warn(err)
        }
    }
});

AfterStep(async function (step) {
    try {
        if (saveScreenshotAfterStep(config, step)) {
            this.attach(await takeScreenshot(), 'image/png');
        }
    } catch (err) {
        console.warn(err)
    }
});

After(async function (scenario) {
    if (global.t) {
        await global.taskPromise.cancel();
        await global.runner.stop();
        await global.testcafe.close();
        // @ts-ignore
        global.t = null;
        // @ts-ignore
        global.runner = null;
        // @ts-ignore
        global.taskPromise = null;
    }
});
