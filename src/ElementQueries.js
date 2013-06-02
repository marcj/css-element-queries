;(function(){
    /**
     *
     * @type {Function}
     * @constructor
     */
    var ElementQueries = this.ElementQueries = function(){
        /**
         * Adds a listener to the over/under-flow event.
         *
         * @param {HTMLElement} element
         * @param {Function}    callback
         */
        function addResizeListener(element, callback) {
            if (window.OverflowEvent){
                //webkit
                element.addEventListener('overflowchanged', function (e) {
                    callback.call(this, e);
                });
            } else {
                element.addEventListener('overflow', function (e) {
                    callback.call(this, e);
                });
                element.addEventListener('underflow', function (e) {
                    callback.call(this, e);
                });
            }
        }

        /**
         *
         * @constructor
         */
        function EventQueue(){
            this.q = [];
            this.add = function(ev) {
                this.q.push(ev);
            };

            var i, j;
            this.call = function() {
                for (i=0, j=this.q.length; i < j; i++) {
                    this.q[i].call();
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {String}      prop
         * @returns {String|Integer}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle(prop);
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }

        }
        /**
         *
         * @param {HTMLElement} element
         * @param {Function}    resized
         */
        function attachResizeEvent(element, resized) {
            if (!element.resizedAttached) {
                element.resizedAttached = new EventQueue();
                element.resizedAttached.add(resized);
            } else if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }

            if (element.onresize) {
                //internet explorer
                if (element.attachEvent) {
                    element.attachEvent('onresize', element.resizedAttached.call);
                } else if (element.addEventListener) {
                    element.addEventListener('resize', element.resizedAttached.call);
                }
            } else {
                var myResized = function(){
                    if (setupSensor()) {
                        element.resizedAttached.call();
                    }
                }
                element.resizeSensor = document.createElement('div');
                element.resizeSensor.className = 'resize-sensor';
                var style =
                    'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;';
                element.resizeSensor.style.cssText = style;
                element.resizeSensor.innerHTML =
                    '<div class="resize-sensor-overflow" style="'+style+'">' +
                        '<div></div>' +
                        '</div>' +
                        '<div class="resize-sensor-underflow" style="'+style+'">' +
                        '<div></div>' +
                        '</div>';
                element.appendChild(element.resizeSensor);

                if ('absolute' !== getComputedStyle(element, 'position')) {
                    element.style.position = 'relative';
                }

                var x = 0,
                    y = 0,
                    firstStyle = element.resizeSensor.firstElementChild.firstChild.style,
                    lastStyle = element.resizeSensor.lastElementChild.firstChild.style;

                function setupSensor() {
                    var change = false,
                        width = element.resizeSensor.offsetWidth,
                        height = element.resizeSensor.offsetHeight;

                    if (x != width) {
                        firstStyle.width = width - 1 + 'px';
                        lastStyle.width = width + 1 + 'px';
                        change = true;
                        x = width;
                    }
                    if (y != height) {
                        firstStyle.height = height - 1 + 'px';
                        lastStyle.height = height + 1 + 'px';
                        change = true;
                        y = height;
                    }
                    return change;
                }
                setupSensor();
                addResizeListener(element.resizeSensor, myResized);
                addResizeListener(element.resizeSensor.firstElementChild, myResized);
                addResizeListener(element.resizeSensor.lastElementChild, myResized);
            }
        }

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
                case "px": return value;
                case "em": return value * getEmSize(element);
                case "rem": return value * getEmSize();
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case "vw": return value * document.documentElement.clientWidth / 100;
                case "vh": return value * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === "vmin" ? "min" : "max"];
                    return value * chooser(vw, vh);
                default: return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @constructor
         */
        function SetupInformation(element){
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
                width  = this.element.offsetWidth;
                height = this.element.offsetHeight;

                attrValues = {};

                for (i=0, j=this.options.length; i < j; i++) {
                    option = this.options[i];
                    value  = convertToPx(this.element, option.value);

                    actualValue = option.property == 'width' ? width : height;
                    attrName    = option.mode + '-' + option.property;
                    attrValue   = '';

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
                attachResizeEvent(element, function(){
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
                selector = rules[i].selectorText;
                if (-1 !== selector.indexOf('min-width') || -1 !== selector.indexOf('max-width')) {
                    extractQuery(rules[i]);
                    //todo, ie7-8 includes @imports in a rule, so extract it
                }
            }
        }

        /**
         * Searches all css rules and setups the event listener to all elements with element query rules..
         */
        this.init = function(){
            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                readRules(document.styleSheets[i].cssRules || document.styleSheets[i].rules);
            }
        }
    }

    function init(){
        new ElementQueries().init();
    }

    if (window.addEventListener){
        window.addEventListener('load',init,false);
    } else {
        window.attachEvent('onload',init);
    }

})();