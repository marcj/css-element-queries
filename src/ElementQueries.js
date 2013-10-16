;
(function() {
    /**
     *
     * @type {Function}
     * @constructor
     */
    var ElementQueries = this.ElementQueries = function() {
        /**
         *
         * @param element
         * @returns {Number}
         */
        function getEmSize(element) {
            if (!element) {
                element = document.documentElement;
            }
            var fontSize = getComputedStyle(element, 'fontSize');
            return parseFloat(fontSize) || 16;
        }

        /**
         *
         * @copyright https://github.com/Mr0grog/element-query
         *
         * @param element
         * @param value
         * @param units
         * @returns {*}
         */
        function convertToPx(element, value) {
            var units = value.replace(/[0-9]*/, '');
            value = parseFloat(value);
            switch (units) {
                case "px":
                    return value;
                case "em":
                    return value * getEmSize(element);
                case "rem":
                    return value * getEmSize();
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case "vw":
                    return value * document.documentElement.clientWidth / 100;
                case "vh":
                    return value * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === "vmin" ? "min" : "max"];
                    return value * chooser(vw, vh);
                default:
                    return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @constructor
         */
        function SetupInformation(element) {
            this.element = element;
            this.options = [];
            var i, j, option, width = 0, height = 0, value, actualValue, attrValues, attrValue, attrName;

            /**
             * @param option {mode: 'min|max', property: 'width|height', value: '123px'}
             */
            this.addOption = function(option) {
                this.options.push(option);
            }

            var attributes = ['min-width', 'min-height', 'max-width', 'max-height'];

            /**
             * Extracts the computed width/height and sets to min/max- attribute.
             */
            this.call = function() {
                // extract current dimensions
                width = this.element.offsetWidth;
                height = this.element.offsetHeight;

                attrValues = {};

                for (i = 0, j = this.options.length; i < j; i++) {
                    option = this.options[i];
                    value = convertToPx(this.element, option.value);

                    actualValue = option.property == 'width' ? width : height;
                    attrName = option.mode + '-' + option.property;
                    attrValue = '';

                    if (option.mode == 'min' && actualValue >= value) {
                        attrValue += ' ' + option.value;
                    }

                    if (option.mode == 'max' && actualValue <= value) {
                        attrValue += ' ' + option.value;
                    }

                    if (!attrValues[attrName]) attrValues[attrName] = '';
                    attrValues[attrName] += attrValue;
                }

                for (var k in attributes) {
                    if (attrValues[attributes[k]]) {
                        this.element.setAttribute(attributes[k], attrValues[attributes[k]].substr(1));
                    } else {
                        this.element.removeAttribute(attributes[k]);
                    }
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {Object}      options
         */
        function setupElement(element, options) {
            if (element.elementQueriesSetupInformation) {
                element.elementQueriesSetupInformation.addOption(options);
            } else {
                element.elementQueriesSetupInformation = new SetupInformation(element);
                element.elementQueriesSetupInformation.addOption(options);
                new ResizeSensor(element, function() {
                    element.elementQueriesSetupInformation.call();
                });
            }
            element.elementQueriesSetupInformation.call();
        }

        /**
         * @param {String} selector
         * @param {String} mode min|max
         * @param {String} property width|height
         * @param {String} value
         */
        function queueQuery(selector, mode, property, value) {
            var elements = document.querySelectorAll(selector);
            for (var i = 0, j = elements.length; i < j; i++) {
                setupElement(elements[i], {
                    mode: mode,
                    property: property,
                    value: value
                });
            }
        }

        var regex = /,*([^,]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]/;

        /**
         * @param {CssRule} rule
         */
        function extractQuery(rule) {
            var matches = regex.exec(rule.selectorText);
            if (matches && 5 === matches.length) {
                queueQuery(matches[1], matches[2], matches[3], matches[4]);
            }
        }

        /**
         * @param {CssRule[]} rules
         */
        function readRules(rules) {
            var selector = '';
            for (var i = 0, j = rules.length; i < j; i++) {
                if (1 === rules[i].type) {
                    selector = rules[i].selectorText;
                    if (-1 !== selector.indexOf('min-width') || -1 !== selector.indexOf('max-width')) {
                        extractQuery(rules[i]);
                        //todo, ie7-8 includes @imports in a rule, so extract it
                    }
                }
            }
        }

        /**
         * Searches all css rules and setups the event listener to all elements with element query rules..
         */
        this.init = function() {
            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                readRules(document.styleSheets[i].cssRules || document.styleSheets[i].rules);
            }
        }
    }

    function init() {
        new ElementQueries().init();
    }

    if (window.addEventListener) {
        window.addEventListener('load', init, false);
    } else {
        window.attachEvent('onload', init);
    }

})();