function regexp(regexpLike: string | RegExp) {
    if (typeof regexpLike === 'string') {
        return new RegExp(regexpLike, 'gmi')
    }
    return regexpLike
}

export const valueValidations = {
    EQUAL: 'equal',
    CONTAIN: 'contain',
    ABOVE: 'above',
    BELOW: 'below',
    MATCH: 'match'
}

const notClause = '(not )?';
const toBeClause = 'to (?:be )?';
const validationClause = `(${Object.values(valueValidations).join('|')})`;

export const valueWaitExtractRegexp = new RegExp(`^${notClause}${toBeClause}${validationClause}$`);
export const valueWaitRegexp = new RegExp(`(${notClause}${toBeClause}${validationClause})`);

const waits = {
    [valueValidations.EQUAL]: async (poll: Assertion, expected: any, reverse: boolean, timeout: number, message: string) =>
        reverse
            ? poll.notEql(expected, message, { timeout })
            : poll.eql(expected, message, { timeout }),
    [valueValidations.CONTAIN]: async (poll: Assertion, expected: any, reverse: boolean, timeout: number, message: string) =>
        reverse
            ? poll.notContains(expected, message, { timeout })
            : poll.contains(expected, message, { timeout }),
    [valueValidations.ABOVE]: async (poll: Assertion, expected: any, reverse: boolean, timeout: number, message: string) =>
        reverse
            ? poll.lte(parseFloat(expected), message, { timeout })
            : poll.gt(parseFloat(expected), message, { timeout }),
    [valueValidations.BELOW]: async (poll: Assertion, expected: any, reverse: boolean, timeout: number, message: string) =>
        reverse
            ? poll.gte(parseFloat(expected), message, { timeout })
            : poll.lt(parseFloat(expected), message, { timeout }),
    [valueValidations.MATCH]: async (poll: Assertion, expected: any, reverse: boolean, timeout: number, message: string) =>
        reverse
            ? poll.notMatch(regexp(expected), message, { timeout })
            : poll.match(regexp(expected), message, { timeout })
}

/**
 * Wait for condition
 * @param {any} valueFn - function to return value
 * @param {any} expected - expected value
 * @param {string} validationType - validation to perform
 * @param {number} [timeout] - timeout to wait
 * @param {boolean} [reverse] - negate flag
 * @return {Promise<void>}
 */
export async function valueWait(
    valueFn: ClientFunction | Selector,
    expected: any,
    validationType: string,
    timeout: number = 10000,
    reverse: boolean
) {
    const message: string = `Value is${reverse ? '' : ' not'} ${validationType} ${expected}`;
    const waitFn = waits[validationType];
    const poll: Assertion = t.expect(valueFn);
    await waitFn(poll, expected, reverse, timeout, message);
}
