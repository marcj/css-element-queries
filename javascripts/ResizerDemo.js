var ResizerDemo = new Class({

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
                'y': null
            }
        });
    }

});