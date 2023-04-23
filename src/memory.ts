import memory from '@qavajs/memory';
import { When } from '@cucumber/cucumber';
import { getElement, getValue } from './transformers';
import {ClientFunction} from 'testcafe';

/**
 * Save text of element to memory
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save text of '#1 of Search Results' as 'firstSearchResult'
 */
When('I save text of {string} as {string}', async function (alias, key) {
    const element = await getElement(alias);
    const value = await element.with({ boundTestRun: t }).innerText;
    memory.setValue(key, value);
});

/**
 * Save property of element to memory
 * @param {string} property - property to store
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save 'checked' property of 'Checkbox' as 'checked'
 * @example I save '$prop' property of 'Checkbox' as 'checked'
 */
When('I save {string} property of {string} as {string}', async function (property, alias, key) {
    const element = await getElement(alias);
    const propertyName = await getValue(property);
    // @ts-ignore
    const value = await element.with({ boundTestRun: t })[propertyName];
    memory.setValue(key, value);
});

/**
 * Save attribute of element to memory
 * @param {string} attribute - attribute to store
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save 'href' attribute of 'Link' as 'linkHref'
 * @example I save '$prop' attribute of 'Link' as 'linkHref'
 */
When('I save {string} attribute of {string} as {string}', async function (attribute, alias, key) {
    const element = await getElement(alias);
    const attributeName = await getValue(attribute);
    const value = await element.with({ boundTestRun: t }).getAttribute(attributeName);
    memory.setValue(key, value);
});

/**
 * Save number of elements in collection to memory
 * @param {string} alias - collection to get value
 * @param {string} key - key to store value
 * @example I save number of elements in 'Search Results' as 'numberOfSearchResults'
 */
When('I save number of elements in {string} collection as {string}', async function (alias, key) {
    const collection = await getElement(alias);
    const value = await collection.with({ boundTestRun: t }).count;
    memory.setValue(key, value);
});

/**
 * Save array of texts of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save text of every element of 'Search Results' collection as 'searchResults'
 */
When(
    'I save text of every element of {string} collection as {string}',
    async function (alias: string, key: string) {
        const collection = await getElement(alias);
        const count = await collection.with({ boundTestRun: t }).count;
        const values = [];
        for (let i = 0; i < count; i++) {
            values.push(await collection.nth(i).with({ boundTestRun: t }).innerText);
        }
        memory.setValue(key, values);
    }
);

/**
 * Save array of attributes of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save 'checked' attribute of every element of 'Search > Checkboxes' collection as 'checkboxes'
 */
When(
    'I save {string} attribute of every element of {string} collection as {string}',
    async function (attribute: string, alias: string, key: string) {
        const collection = await getElement(alias);
        const count = await collection.with({ boundTestRun: t }).count;
        const values = [];
        for (let i = 0; i < count; i++) {
            values.push(await collection.nth(i).with({ boundTestRun: t }).getAttribute(attribute));
        }
        memory.setValue(key, values);
    }
);

/**
 * Save array of property of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save 'href' property of every element of 'Search > Links' collection as 'hrefs'
 */
When(
    'I save {string} property of every element of {string} collection as {string}',
    async function (property: string, alias: string, key: string) {
        const propertyName = await getValue(property);
        const collection = await getElement(alias);
        const count = await collection.with({ boundTestRun: t }).count;
        const values = [];
        for (let i = 0; i < count; i++) {
            const element = collection.nth(i).with({ boundTestRun: t });
            // @ts-ignore
            values.push(await element[propertyName]);
        }
        memory.setValue(key, values);
    }
);

/**
 * Save current url to memory
 * @param {string} key - key to store value
 * @example I save current url as 'currentUrl'
 */
When('I save current url as {string}', async function (key: string) {
    const url = await ClientFunction(() => window.location.href )
        .with({ boundTestRun: t })();
    memory.setValue(key, url);
});

/**
 * Save current page title to memory
 * @param {string} key - key to store value
 * @example I save page title as 'currentTitle'
 */
When('I save page title as {string}', async function (key: string) {
    const title = await ClientFunction(() => window.document.title )
        .with({ boundTestRun: t })();
    memory.setValue(key, title);
});

/**
 * Save page screenshot into memory
 * @param {string} key - key to store value
 * @example I save screenshot as 'screenshot'
 */
When('I save screenshot as {string}', async function(key: string) {
    const screenshot = await t.takeScreenshot();
    memory.setValue(key, screenshot);
});

/**
 * Save css property of element to memory
 * @param {string} property - property to store
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save 'color' css property of 'Checkbox' as 'checkboxColor'
 * @example I save '$propertyName' property of 'Checkbox' as 'checkboxColor'
 */
When('I save {string} css property of {string} as {string}', async function (property, alias, key) {
    const element = await getElement(alias);
    const propertyName = await getValue(property);
    const value = await ClientFunction(() => {
        // @ts-ignore
        return getComputedStyle(element()).getPropertyValue(propertyName)
    }, { dependencies: { element, propertyName }}).with({ boundTestRun: t })();
    memory.setValue(key, value);
});
