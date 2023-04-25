import { After, AfterStep, Before, BeforeStep } from '@cucumber/cucumber';
import defaultTimeouts from './defaultTimeouts';
import { po } from '@qavajs/po-testcafe';
import {isChromium, saveScreenshotAfterStep, saveScreenshotBeforeStep, takeScreenshot} from './utils/utils';
import createTestCafe from 'testcafe';

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
        defaultTimeouts,
        ...driverConfig.timeout
    }
    config.driverConfig = driverConfig;
    const cucumberWorker: number = (process.env.CUCUMBER_WORKER_ID ?? 1) as number;
    global.testcafe = await createTestCafe('localhost', 31337 + cucumberWorker * 10, 31338 + cucumberWorker * 10);
    global.runner = await testcafe.createRunner();
    global.taskPromise = runner
        .src('./src/testController/bootstrap.ts')
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
    }
});
