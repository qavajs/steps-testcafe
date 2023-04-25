import { When } from '@cucumber/cucumber';
import { getValue } from './transformers';
import memory from '@qavajs/memory';
import {RequestMock} from 'testcafe';

let mocks: {[prop: string]: RequestMock} = {};
/**
 * Create simple mock instance
 * @param {string} urlTemplate - minimatch url template to mock
 * @param {string} memoryKey - memory key to store mock instance
 * @example When I create mock for '.+/yourservice/.+' as 'mock1'
 * @example When I create mock for '$mockUrlTemplate' as 'mock1'
 */
When('I create mock for {string} as {string}', async function (urlTemplate: string, memoryKey: string) {
    const url = await getValue(urlTemplate);
    memory.setValue(memoryKey, url);
});

async function respondWith(mockKey: string, statusCode: string, body: string): Promise<void> {
    const url: any = await getValue(mockKey);
    const responseStatusCode: number = parseInt(await getValue(statusCode));
    const responseBody = await getValue(body);
    const mockTemplate = typeof url === 'string' ? new RegExp(url, 'g') : url;
    const response = RequestMock()
        .onRequestTo(mockTemplate)
        .respond(
            responseBody,
            responseStatusCode,
            { 'access-control-allow-origin': '*' }
        );
    mocks[mockKey] = response;
    await t.addRequestHooks(response);
}

/**
 * Add mocking rule to respond with desired status code and payload
 * @param {string} mockKey - memory key to get mock instance
 * @param {string} statusCode - status code
 * @param {string} body - response body
 * @example
 * When I create mock for '/yourservice/**' with filter options as 'myServiceMock'
 * And I set '$myServiceMock' mock to respond '200' with:
 * """
 * {
 *     "status": "success"
 * }
 * """
 */
When('I set {string} mock to respond {string} with:', respondWith);

/**
 * Add mocking rule to respond with desired status code and payload
 * @param {string} mockKey - memory key to get mock instance
 * @param {string} statusCode - status code
 * @param {string} body - response body
 * @example
 * When I create mock for '/yourservice/**' with filter options as 'myServiceMock'
 * And I set '$myServiceMock' mock to respond '200' with '$response'
 */
When('I set {string} mock to respond {string} with {string}', respondWith);

/**
 * Restore mock
 * @param {string} mockKey - memory key to get mock instance
 * @example When I restore '$myServiceMock'
 */
When('I restore {string} mock', async function (mockKey: string) {
    const mock = mocks[mockKey];
    await t.removeRequestHooks(mock);
    delete mocks[mockKey];
});

/**
 * Restore all mocks
 * @example When I restore all mocks
 */
When('I restore all mocks', async function () {
    await t.removeRequestHooks(...Object.values(mocks));
    mocks = {};
});
