import { conditionWait, conditionWaitExtractRegexp } from './conditionWait';
import { valueWait, valueWaitExtractRegexp } from './valueWait';
import { po } from '@qavajs/po-testcafe';
import memory from '@qavajs/memory';
import { Selector } from 'testcafe';

export function getValue(alias: string): any {
    return memory.getValue(alias)
}

export async function getElement(alias: string): Promise<Selector> {
    return po.getElement(await memory.getValue(alias))
}

export function getConditionWait(condition: string): Function {
    const match = condition.match(conditionWaitExtractRegexp) as RegExpMatchArray;
    if (!match) throw new Error(`${condition} wait is not implemented`);
    const [ _, reverse, validation ] = match;
    return async function (element: Selector, timeout: number) {
        await conditionWait(element, validation, timeout, Boolean(reverse))
    }
}

export function getValueWait(condition: string): Function {
    const match = condition.match(valueWaitExtractRegexp) as RegExpMatchArray;
    if (!match) throw new Error(`${condition} wait is not implemented`);
    const [ _, reverse, validation ] = match;
    return async function (valueFn: ClientFunction, expected: any, timeout: number) {
        await valueWait(valueFn, expected, validation, timeout, Boolean(reverse))
    }
}
