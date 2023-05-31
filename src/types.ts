import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
    name: 'testcafeValidation',
    regexp: /((?:is |do |does |to )?(not |to not )?(?:to )?(?:be )?(equal|strictly equal|deeply equal|have member|match|contain|above|below|greater than|less than|have type)(?:s|es)?)/,
    transformer: p => p,
    useForSnippets: false
});

defineParameterType({
    name: 'testcafeValueWait',
    regexp: /((not )?to (?:be )?(equal|contain|above|below|match))/,
    transformer: p => p,
    useForSnippets: false
});

defineParameterType({
    name: 'testcafeConditionWait',
    regexp: /((not )?to (?:be )?(present|clickable|visible|invisible|enabled|disabled|in viewport))/,
    transformer: p => p,
    useForSnippets: false
});

defineParameterType({
    name: 'testcafeTimeout',
    regexp: /(?:\(timeout: (\d+)\))?/,
    transformer: p => p ? parseInt(p) : null,
    useForSnippets: false
});

defineParameterType({
    name: 'testcafePoType',
    regexp: /(element|collection)/,
    transformer: p => p,
    useForSnippets: false
});

