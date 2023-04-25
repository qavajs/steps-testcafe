import { When } from '@cucumber/cucumber';
import { getValue, getElement } from './transformers';
import { ClientFunction, Selector } from 'testcafe';
import {parseCoords} from './utils/utils';

/**
 * Opens provided url
 * @param {string} url - url to navigate
 * @example I open 'https://google.com'
 */
When('I open {string} url', async function (url: string) {
    const urlValue = await getValue(url);
    await t.navigateTo(urlValue);
});

/**
 * Type text to element
 * @param {string} alias - element to type
 * @param {string} value - value to type
 * @example I type 'wikipedia' to 'Google Input'
 */
When('I type {string} to {string}', async function (value: string, alias: string) {
    const element = await getElement(alias);
    const typeValue = await getValue(value);
    await t.typeText(element, typeValue);
});

/**
 * Click element
 * @param {string} alias - element to click
 * @example I click 'Google Button'
 */
When('I click {string}', async function (alias: string) {
    const element = await getElement(alias);
    await t.click(element);
});

/**
 * Click element via script
 * @param {string} alias - element to click
 * @example I force click 'Google Button'
 */
When('I force click {string}', async function (alias: string) {
    const element = await getElement(alias);
    // @ts-ignore
    await t.eval(() => element().click(), { dependencies: { element } });
});

/**
 * Right click element
 * @param {string} alias - element to right click
 * @example I right click 'Google Button'
 */
When('I right click {string}', async function (alias: string) {
    const element = await getElement(alias);
    await t.rightClick(element);
});

/**
 * Double click element
 * @param {string} alias - double element to click
 * @example I double click 'Google Button'
 */
When('I double click {string}', async function (alias: string) {
    const element = await getElement(alias);
    await t.doubleClick(element);
});

/**
 * Clear input
 * @param {string} alias - element to clear
 * @example I clear 'Google Input'
 */
When('I clear {string}', async function (alias: string) {
    const element = await getElement(alias);
    await t.selectText(element).pressKey('delete');
});

/**
 * Switch to parent frame
 * @example I switch to parent frame
 */
When('I switch to parent frame', async function () {
    await t.switchToMainWindow();
});

/**
 * Switch to frame by index
 * @param {number} index - index to switch
 * @example I switch to 2 frame
 */
When('I switch to {int} frame', async function (index: number) {
    await t.switchToIframe(Selector('iframe').nth(index - 1));
});

/**
 * Switch to frame by index
 * @param {number} index - index to switch
 * @example I switch to 2 frame
 */
When('I switch to {string} window', async function (hrefOrTitleKey: string) {
    const hrefOrTitle = await getValue(hrefOrTitleKey);
    await t.switchToWindow((win: WindowFilterData) =>
        win.title.includes(hrefOrTitle) || win.url.href.includes(hrefOrTitle)
    );
});

/**
 * Refresh current page
 * @example I refresh page
 */
When('I refresh page', async function () {
    await ClientFunction(() => {
        document.location.reload();
    }).with({ boundTestRun: t })();
});

/**
 * Press button
 * @param {string} key - key to press
 * @example I press 'Enter' key
 * @example I press 'Control+C' keys
 */
When('I press {string} key(s)', async function (key: string) {
    const resolvedKey = await getValue(key);
    await t.pressKey(resolvedKey.toLowerCase());
});

/**
 * Press button given number of times
 * @param {string} key - key to press
 * @param {number} num - number of times
 * @example I press 'Enter' key 5 times
 * @example I press 'Control+V' keys 5 times
 */
When('I press {string} key(s) {int} time(s)', async function (key: string, num: number) {
    const resolvedKey = await getValue(key)
    for (let i: number = 0; i < num; i++) {
        await t.pressKey(resolvedKey.toLowerCase());
    }
});

/**
 * Hover over element
 * @param {string} alias - element to hover over
 * @example I hover over 'Google Button'
 */
When('I hover over {string}', async function (alias: string) {
    const element = await getElement(alias);
    await t.hover(element);
});

/**
 * Select option with certain text from select element
 * @param {string} option - option to select
 * @param {string} alias - alias of select
 * @example I select '1900' option from 'Registration Form > Date Of Birth'
 * @example I select '$dateOfBirth' option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {string} option from {string} dropdown', async function (option: string, alias: string) {
    const optionValue = await getValue(option);
    const select = await getElement(alias);
    await t
        .click(select)
        .click(select.find('option').withText(optionValue));
});

/**
 * Select option with certain text from select element
 * @param {number} optionIndex - index of option to select
 * @param {string} alias - alias of select
 * @example I select 1 option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {int}(st|nd|rd|th) option from {string} dropdown', async function (optionIndex: number, alias: string) {
    const select = await getElement(alias);
    await t
        .click(select)
        .click(select.find('option').nth(optionIndex - 1));
});

/**
 * Click on element with desired text in collection
 * @param {string} expectedText - text to click
 * @param {string} alias - collection to search text
 * @example I click 'google' text in 'Search Engines' collection
 * @example I click '$someVarWithText' text in 'Search Engines' collection
 */
When(
    'I click {string} text in {string} collection',
    async function (value: string, alias: string) {
        const resolvedValue = await getValue(value);
        const collection = await getElement(alias);
        await t.click(collection.withText(resolvedValue));
    }
);

/**
 * Scroll by provided offset
 * @param {string} - offset string in 'x, y' format
 * @example
 * When I scroll by '0, 100'
 */
When('I scroll by {string}', async function (offset: string) {
    const [x, y] = parseCoords(await getValue(offset));
    await t.scrollBy(x, y);
});

/**
 * Scroll by provided offset in element
 * @param {string} - offset string in 'x, y' format
 * @param {string} - element alias
 * @example
 * When I scroll by '0, 100' in 'Overflow Container'
 */
When('I scroll by {string} in {string}', async function (offset: string, alias: string) {
    const element = await getElement(alias);
    const [x, y] = parseCoords(await getValue(offset));
    await t.scrollBy(element, x, y);
});

/**
 * Provide file url to upload input
 * @param {string} alias - element to upload file
 * @param {string} value - file path
 * @example I upload '/folder/file.txt' to 'File Input'
 */
When('I upload {string} file to {string}', async function (value: string, alias: string) {
    const element = await getElement(alias);
    const filePath = await getValue(value);
    await t.setFilesToUpload(element, [filePath]).click(element);
});

/**
 * Set alert handler
 * @example I will accept alert
 */
When('I will accept alert', async function () {
    await t.setNativeDialogHandler(() => true);
});

/**
 * Dismiss alert
 * testcafe automatically dismisses all dialogs. This step is just to make it implicitly.
 * @example I will dismiss alert
 */
When('I will dismiss alert', async function () {
    await t.setNativeDialogHandler(() => false);
});

/**
 * Type text to prompt
 * I type {string} to alert
 * @example I will type 'coffee' to alert
 */
When('I will type {string} to alert', async function (valueKey: string) {
    const value = await getValue(valueKey);
    await t.setNativeDialogHandler(() => value, { dependencies: { value }});
});
