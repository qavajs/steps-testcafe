import { Selector } from 'testcafe';

export const conditionValidations = {
    PRESENT: 'present',
    // CLICKABLE: 'clickable',
    VISIBLE: 'visible',
    INVISIBLE: 'invisible',
    IN_VIEWPORT: 'in viewport',
    // ENABLED: 'enabled',
    // DISABLED: 'disabled'
}

const notClause = '(not )?';
const toBeClause = 'to (?:be )?';
const validationClause = `(${Object.values(conditionValidations).join('|')})`;

export const conditionWaitExtractRegexp = new RegExp(`^${notClause}${toBeClause}${validationClause}$`);
export const conditionWaitRegexp = new RegExp(`(${notClause}${toBeClause}${validationClause})`);

const executeWait = (expect: Assertion<any>, reverse: boolean, timeout: number, timeoutMsg: string) => {
    return reverse
        ? expect.eql(0, timeoutMsg, { timeout })
        : expect.gt(0, timeoutMsg, { timeout });
}

const waits = {
    [conditionValidations.PRESENT]: (
        element: Selector,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => {
        const expect = t.expect(element.with({ boundTestRun: t }).count);
        return executeWait(expect, reverse, timeout, timeoutMsg);
    },
    [conditionValidations.VISIBLE]: (
        element: Selector,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => {
        const expect = t.expect(element.filterVisible().with({ boundTestRun: t }).count)
        return executeWait(expect, reverse, timeout, timeoutMsg);
    },
    [conditionValidations.INVISIBLE]: (
        element: Selector,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => {
        const expect = t.expect(element.filterHidden().with({ boundTestRun: t }).count)
        return executeWait(expect, reverse, timeout, timeoutMsg);
    },
}
/**
 * Wait for condition
 * @param {Selector} element - element
 * @param {string} validationType - validation to perform
 * @param {number} [timeout] - timeout to wait
 * @param {boolean} [reverse] - negate flag
 * @return {Promise<void>}
 */
export async function conditionWait(
    element: Selector,
    validationType: string,
    timeout: number = 10000,
    reverse: boolean = false
) {
    const timeoutMsg: string = `Element is${reverse ? '' : ' not'} ${validationType}`;
    const waitFn = waits[validationType];
    await waitFn(element, reverse, timeout, timeoutMsg);
}
