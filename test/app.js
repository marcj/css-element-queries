var EQ = require('../src/ElementQueries');
var ResizeSensor = require('../src/ResizeSensor');

EQ.listen();

var ResizerDemo = new Class({
    y: null,
    initialize: function(container) {
        this.container = container;
        this.setupLayout();
    },

    setupLayout: function(){
        this.handler = new Element('div', {
            'class': 'resizerDemo-handler'
        }).inject(this.container);

        this.container.makeResizable({
            snap: 0,
            handle: this.handler,
            modifiers: {
                'x': 'width',
                'y': this.y
            }
        });
    }
});

var ResizeDemoXY = new Class({
    Extends: ResizerDemo,
    y: 'height'
});

window.addEvent('domready', function(){
    $$('.examplesResizerDemos').each(function(resizer){
        new ResizerDemo(resizer);
    });
    $$('.examplesResizerDemosXY').each(function(resizer){
        new ResizeDemoXY(resizer);
    });


    perfTest();
    example3();
    example4();
    example5();
});

function perfTest(){
    var container = $('dynamicContainer');
    var dynamicCount = $('dynamicCount');
    var dynamicCounter = $('dynamicCounter');

    window.detachDynamic = function() {
        container.getChildren().each(function(element) {
            ResizeSensor.detach(element);
        });
    };

    window.removeDynamic = function() {
        container.empty();
    };

    window.addDynamic = function() {
        container.empty();
        var i = 0, to = dynamicCount.value, div, counter = 0;
        for (; i < to; i++) {
            div = new Element('div', {
                'class': 'dynamicElement',
                text: '#' + i
            }).inject(container);

            new ResizeSensor(div, function(){
                counter++;
                dynamicCounter.set('text', counter + ' changes.');
            });
        }
    }
}

function example3(){

    var logger = document.id('example-3-log');
    var box = document.id('example-3-box');
    document.id('startStop3').addEvent('click', function(){
        if (box.hasClass('example-3-box-start')) {
            box.removeClass('example-3-box-start');
        } else {
            box.addClass('example-3-box-start');
        }
    });
    new ResizeSensor(box, function(el){
        logger.set('html', 'Changed to ' + box.getSize().x+'px width.');
    });

}

function example4(){
    var logger = document.id('example-4-log');
    var box = document.id('example-4-box');
    document.id('startStop4').addEvent('click', function(){
        if (box.hasClass('example-4-box-start')) {
            box.removeClass('example-4-box-start');
        } else {
            box.addClass('example-4-box-start');
        }
    });
    new ResizeSensor(box, function(){
        logger.set('html', 'Changed to ' + box.getSize().y+'px height.');
    });
}

function example5(){
    var box = document.id('example-5');
    var changed = 0;
    new ResizeSensor(box.getParent(), function(){
        box.innerHTML = (++changed) + ' changes. ' + box.getParent().getSize().x+'px/'+box.getParent().getSize().y+'px';
    });
}