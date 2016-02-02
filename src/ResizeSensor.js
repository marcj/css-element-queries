/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function() {

    var isFrameBasedUpdate = 'requestAnimationFrame' in window;
    var isIE = navigator.userAgent.match(/Trident/);

    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     *
     * @constructor
     */
    var ResizeSensor = function(element, callback) {
        /**
         *
         * @constructor
         */
        function EventQueue() {
            this.q = [];
            this.add = function(ev) {
                this.q.push(ev);
            };

            var i, j;
            this.call = function() {
                for (i = 0, j = this.q.length; i < j; i++) {
                    this.q[i].call();
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {String}      prop
         * @returns {String|Number}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }

        var elementType = Object.prototype.toString.call(element);

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

            if (document.attachEvent) {
                //IE
                var checker = function() {
                    if (!element.resizedAttached) {
                        element.detachEvent('onresize', checker);
                        return;
                    }
                    element.resizedAttached.call();
                };
                element.attachEvent('onresize', checker);

                return;
            }


            var resizeSensor = document.createElement('object');
            resizeSensor.className = 'resize-sensor';
            resizeSensor.style =
                'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%;' +
                'transition: 0s; overflow: hidden; pointer-events: none; z-index: -1;';

            if (getComputedStyle(element, 'position') == 'static') {
                element.style.position = 'relative';
            }

            element.resizeSensor = resizeSensor;

            var dirty = false;
            var changed = function() {
                if (isFrameBasedUpdate) {
                    dirty = true;
                } else {
                    if (element.resizedAttached) {
                        element.resizedAttached.call();
                    }
                }
            };

            if (isFrameBasedUpdate) {
                function dirtyChecking() {
                    if (dirty) {
                        dirty = false;
                    }

                    if (element.resizedAttached) {
                        element.resizedAttached.call();
                    }

                    window.requestAnimationFrame(dirtyChecking);
                }

                window.requestAnimationFrame(dirtyChecking);
            }

            resizeSensor.onload = function() {
                //this.contentDocument.defaultView.addEventListener('resize', changed);
            };

            resizeSensor.type = 'text/html';
            if (isIE) element.appendChild(resizeSensor);

            resizeSensor.data = 'about:blank';
            if (!isIE) element.appendChild(resizeSensor);

        }
        var isCollectionTyped = ('[object Array]' === elementType
            || ('[object NodeList]' === elementType)
            || ('[object HTMLCollection]' === elementType)
            || ('undefined' !== typeof jQuery && element instanceof jQuery) //jquery
            || ('undefined' !== typeof Elements && element instanceof Elements) //mootools
        );

        if (isCollectionTyped) {
            var i = 0, j = element.length;
            for (; i < j; i++) {
                attachResizeEvent(element[i], callback);
            }
        } else {
            attachResizeEvent(element, callback);
        }

        this.detach = function() {
            if (isCollectionTyped) {
                var i = 0, j = element.length;
                for (; i < j; i++) {
                    ResizeSensor.detach(element[i]);
                }
            } else {
                ResizeSensor.detach(element);
            }
        };
    };

    ResizeSensor.detach = function(element) {
        if (element.resizeSensor) {
            element.removeChild(element.resizeSensor);
            delete element.resizeSensor;
            delete element.resizedAttached;
        }
    };

    // make available to common module loader
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = ResizeSensor;
    }
    else {
        window.ResizeSensor = ResizeSensor;
    }

})();
