const testController = {
    testController: null,
    setup: function(t) {
        global.t = t;
        return new Promise(() => {});
    },
    get: function() {
        return testController.testController;
    }
};
export default testController;
