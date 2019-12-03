const Modulerizr = require('./node_modules/modulerizr');

describe("Test modulerizr startup", function () {
    
    it("should succeed with dirname of modulerizr-file.", function () {
        const modulerizr = new Modulerizr(`${__dirname}`);
        expect(modulerizr._modulerizr).toBe(true);
    });
    it("should succeed specific path to modulerizr-config", function () {
        const modulerizr = new Modulerizr(`${__dirname}/modulerizr_custompath.config.js`);
        expect(modulerizr._modulerizr).toBe(true);
    });
    it("should thow an Error if configpath does not exist", function () {
        try
        {
            new Modulerizr(`${__dirname}/xxx.js`);
            fail();
        }
        catch(e)
        {
            //unknown path throws an error - that's good.
        }
    });
    it("should return an instance of modulerizr", function () {
        const modulerizr = new Modulerizr(`${__dirname}/modulerizr_custompath.config.js`);
        expect(modulerizr._modulerizr).toBe(true);
    });
    it("should work with a custom config instead of a path", function () {
        const modulerizr = new Modulerizr({
            customconfig: true
        });
        expect(modulerizr._modulerizr).toBe(true);
        expect(modulerizr.config.getKey('customconfig')).toBe(true);
    });
});