// CRXKIT - A toolkit to make chrome extension.
// https://github.com/greatghoul/crxkit
//
// License under MIT 

(function() {
    var crx = window.crx = {};

    // FXIEME: Not a good namespace to define this utility function.
    // Get full name of option (with prefix)
    function _name(name) {
        return this.prefix + name;
    }

    // Options
    crx.options = {
        // Initialize options
        //
        // defaults: default options
        // prefix: option name prefix in localStorage, default to `_CRX_OPTION_`
        // sync: Sync options in each extension pages or not(including contentscripts), default to `false`
        init: function(options) {
            this.defaults = options.defaults || {};
            this.prefix = options.prefix || '_CRX_OPTION_';
         
            return this;
        },

        // Reset options to defaults
        //
        // will not override exists options by default, 
        // to override exists options, use `crx.options.reset(true)`
        reset: function(override) {
            for (var optionName in this.defaults) {
                var fullOptionName = this.prefix + optionName;
                var currentOptionValue = localStorage.getItem(fullOptionName);

                // Override if exists depents on `override`
                if (currentOptionValue !== null && !override) continue;
                localStorage.setItem(fullOptionName, this.defaults[optionName]);
            }  
            return this;
        },

        // Option getter
        get: function(name, altValue) {
            var value = localStorage.getItem(_name(name));
            if (value === null) {
                value = altValue;
            }
            return value;
        },

        // Option setter
        //
        // `value` can be passed as a callback with old value as parameter.
        set: function(name, value) {
            if (typeof(value) === 'function') {
                localStorage.setItem(_name(name), value(this.get(name)));
            } else {
                localStorage.setItem(_name(name), value);
            }
            return this;
        }
    }
})();
