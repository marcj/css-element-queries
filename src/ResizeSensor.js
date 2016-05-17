/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function() {

    // Only used for the dirty checking, so the event callback count is limted to max 1 call per fps per sensor.
    // In combination with the event based resize sensor this saves cpu time, because the sensor is too fast and
    // would generate too many unnecessary events.
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (fn) {
            return window.setTimeout(fn, 20);
        };

    /**
     * Iterate over each of the provided element(s).
     *
     * @param {HTMLElement|HTMLElement[]} elements
     * @param {Function}                  callback
     */
    function forEachElement(elements, callback){
        var elementsType = Object.prototype.toString.call(elements);
        var isCollectionTyped = ('[object Array]' === elementsType
            || ('[object NodeList]' === elementsType)
            || ('[object HTMLCollection]' === elementsType)
            || ('undefined' !== typeof jQuery && elements instanceof jQuery) //jquery
            || ('undefined' !== typeof Elements && elements instanceof Elements) //mootools
        );
        var i = 0, j = elements.length;
        if (isCollectionTyped) {
            for (; i < j; i++) {
                callback(elements[i]);
            }
        } else {
            callback(elements);
        }
    }

    /**
     * Class for adding/removing/triggering events.
     *
     * @constructor
     */
    function EventQueue() {
        var q = [];
        this.add = function(ev) {
            q.push(ev);
        };

        var i, j;
        this.call = function() {
            for (i = 0, j = q.length; i < j; i++) {
                q[i].call();
            }
        };

        this.remove = function(ev) {
            var newQueue = [];
            for(i = 0, j = q.length; i < j; i++) {
                if(q[i] !== ev) newQueue.push(q[i]);
            }
            q = newQueue;
        }

        this.length = function() {
            return q.length;
        }
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

    /**
     * checks "display" peoperty of elements relevant to
     * the one provided and fires the provided callback
     * once we are ready to start monitoring for resize
     * events.
     *
     * @param   {HTMLElement} element
     * @param   {Function}    callback
     * @returns {Function}
     */
    var whenElementIsReady = (function(){

        var interval = false;
        var elsToMonitor = [];
        var cbs = new EventQueue();

        var checkDisplayProps = function(){
            if(!elsToMonitor.length){
                clearInterval(interval);
                interval = false;
                return;
            }
            for(var i = 0; i < elsToMonitor.length; i++){
                var el = elsToMonitor[i];
                el.__displayMonitor.display =
                    window.getComputedStyle(el).display == "none" ? false : true;
            }
            cbs.call();
        }

        var getParents = function(el){
            var els = [el];
            while((el = el.parentNode) && el.nodeType === document.ELEMENT_NODE){
                els.push(el);
            }
            return els;
        }

        var monitorThese = function(els){
            for(var i = 0; i < els.length; i++){
                var monitorObj = els[i].__displayMonitor
                              || (els[i].__displayMonitor = {count: 0, display: false});
                monitorObj.count++;
                if(elsToMonitor.indexOf(els[i]) == -1) elsToMonitor.push(els[i]);
            }
        }

        var stopMonitoringThese = function(els){
            for(var i = 0; i < els.length; i++){
                var monitorObj = els[i].__displayMonitor;
                var count = monitorObj? --monitorObj.count : 0;
                if(!count){
                    delete els[i].__displayMonitor;
                    elsToMonitor.splice(elsToMonitor.indexOf(els[i]), 1);
                }
            }
        }

        return function(element, callback, useInterval){

            //no browser support? don't do.
            if(!("getComputedStyle" in window)){
                callback();
                return function(){}
            }

            var allEls = getParents(element);
            var isMonitoring = true;
            monitorThese(allEls);

            var stopMonitoringThis = function(){
                isMonitoring = false;
                stopMonitoringThese(allEls);
                cbs.remove(monitorCb);
            }

            var monitorCb = function(){
                for(var i = 0; i < allEls.length; i++){
                    var el = allEls[i];
                    if(!el.__displayMonitor.display) return;
                }
                stopMonitoringThis();
                callback();
            }

            cbs.add(monitorCb);

            if(useInterval && !interval){
                interval = window.setInterval(checkDisplayProps, 150);
            }

            return {
                stop: function(){
                    if (isMonitoring) stopMonitoringThis();
                },
                triggerCheck: function(){
                    if (isMonitoring) checkDisplayProps();
                }
            };

        }

    }());

    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     * @param {Bool}     useIntervalCheck
     *
     * @constructor
     */
    var ResizeSensor = function(element, callback, useIntervalCheck) {

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

            element.resizeSensor = document.createElement('div');
            element.resizeSensor.className = 'resize-sensor';
            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';
            var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

            element.resizeSensor.style.cssText = style;
            element.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="' + style + '">' +
                    '<div style="' + styleChild + '"></div>' +
                '</div>' +
                '<div class="resize-sensor-shrink" style="' + style + '">' +
                    '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                '</div>';
            element.appendChild(element.resizeSensor);

            if (getComputedStyle(element, 'position') == 'static') {
                element.style.position = 'relative';
            }

            var expand = element.resizeSensor.childNodes[0];
            var expandChild = expand.childNodes[0];
            var shrink = element.resizeSensor.childNodes[1];

            var reset = function() {
                expandChild.style.width  = 100000 + 'px';
                expandChild.style.height = 100000 + 'px';

                expand.scrollLeft = 100000;
                expand.scrollTop = 100000;

                shrink.scrollLeft = 100000;
                shrink.scrollTop = 100000;
            };

            reset();
            var dirty = false;

            var dirtyChecking = function() {
                if (!element.resizedAttached) return;

                if (dirty) {
                    element.resizedAttached.call();
                    dirty = false;
                }

                requestAnimationFrame(dirtyChecking);
            };

            requestAnimationFrame(dirtyChecking);
            var lastWidth, lastHeight;
            var cachedWidth, cachedHeight; //useful to not query offsetWidth twice

            var onScroll = function() {
              if ((cachedWidth = element.offsetWidth) != lastWidth || (cachedHeight = element.offsetHeight) != lastHeight) {
                  dirty = true;

                  lastWidth = cachedWidth;
                  lastHeight = cachedHeight;
              }
              reset();
            };

            var addEvent = function(el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };

            element.resizeIsReady = whenElementIsReady(element, reset, useIntervalCheck);
            addEvent(expand, 'scroll', onScroll);
            addEvent(shrink, 'scroll', onScroll);
        }

        forEachElement(element, function(elem){
            attachResizeEvent(elem, callback);
        });

        this.detach = function(ev) {
            ResizeSensor.detach(element, ev);
        };

        // this checks whether the element is ready to be
        // monitored for resize events yet or not. If you
        // have asked for the checknot to occur on an interval,
        // this is your alternate option for doing so.
        this.checkDisplayProps = function(ev) {
            forEachElement(element, function(elem){
                if (elem.resizeIsReady) {
                    elem.resizeIsReady.triggerCheck();
                }
            });
        }

    };

    ResizeSensor.detach = function(element, ev) {
        forEachElement(element, function(elem){
            if(elem.resizedAttached && typeof ev == "function"){
                elem.resizedAttached.remove(ev);
                if(elem.resizedAttached.length()) return;
            }
            if (elem.resizeSensor) {
                elem.removeChild(elem.resizeSensor);
                if (elem.resizeIsReady){
                    elem.resizeIsReady.stop();
                }
                delete elem.resizeSensor;
                delete elem.resizedAttached;
                delete elem.resizeIsReady;
            }
        });
    };

    // make available to common module loader
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = ResizeSensor;
    }
    else {
        window.ResizeSensor = ResizeSensor;
    }

})();