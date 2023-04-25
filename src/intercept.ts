import { When } from '@cucumber/cucumber';
import { getValue } from './transformers';
import memory from '@qavajs/memory';
import { RequestLogger } from 'testcafe';

/**
 * Create interception for url or predicate function
 * @param {string | function} url - url or predicate function to listen
 * @param {string} key - memory key to save
 * @example I create interception for '.+\/api\/qavajs' as 'intercept'
 * @example I create interception for '$interceptHandler' as 'intercept' // if you need to pass function as interception handler
 */
When('I create interception for {string} as {string}', async function (urlTemplate: string, key: string) {
    const url = await getValue(urlTemplate);
    const predicate = typeof url === 'string' ? new RegExp(url, 'g') : url;
    const requestLogger = RequestLogger(predicate, {
        logRequestBody: true,
        logRequestHeaders: true,
        logResponseBody: true,
        logResponseHeaders: true
    });
    memory.setValue(key, requestLogger);
    await t.addRequestHooks(requestLogger);
});

/**
 * Wait for interception response
 * @param {string} interception - key of saved interception promise
 * @example I wait for '$interception' response
 */
When('I wait for {string} response', async function (interception: string) {
    const requestLogger: RequestLogger = await getValue(interception);
    await t.expect(requestLogger.requests.length).gt(0);
    await t.expect(requestLogger.contains(request => !!request.response)).ok();
});

/**
 * Save interception response
 * @param {string} interception - key of saved interception promise
 * @example I save '$interception' response as 'response'
 */
When('I save {string} response as {string}', async function (interception: string, key: string) {
    const requestLogger: RequestLogger = await getValue(interception);
    await t.expect(requestLogger.requests.length).gt(0);
    await t.expect(requestLogger.contains(request => !!request.response)).ok();
    const requests = requestLogger.requests;
    memory.setValue(key, requests[requests.length - 1]);
});
