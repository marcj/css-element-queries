$(document).ready(function () {
    console.log('ready');

    // $("textarea.html").each(function(idx, textarea) {
    //     CodeMirror.fromTextArea(textarea, {
    //         lineNumbers: true,
    //         mode: "htmlmixed",
    //         readOnly: true
    //     });
    // });
    //
    // $("textarea.css").each(function(idx, textarea) {
    //     CodeMirror.fromTextArea(textarea, {
    //         lineNumbers: true,
    //         mode: "css",
    //         readOnly: true
    //     });
    // });
    //
    // $("textarea.javascript").each(function(idx, textarea) {
    //     CodeMirror.fromTextArea(textarea, {
    //         lineNumbers: true,
    //         mode: "javascript",
    //         readOnly: true
    //     });
    // });
});

function ResizerDemo(element) {
    element = $(element);
    var handler = $('<div class="resizerDemo-handler"></div>');
    var info = $('<div class="resizerDemo-info"></div>');

    element.append(handler);
    element.append(info);

    var hammer = new Hammer(element[0], {recognizers: [
        [Hammer.Pan, { threshold: 0}]
    ]});

    var startWidth;
    element.on('mousedown', function(e){
        e.preventDefault();
    });
    hammer.on('panstart', function(e) {
        startWidth = element[0].clientWidth;
    });

    hammer.on('panmove', function(e) {
        element[0].style.width = (startWidth + e.deltaX) + 'px';
        info.html(element[0].clientWidth + 'px x ' + element[0].clientHeight + 'px');
    })
}

$( document ).ready(function(){
    $('.examplesResizerDemos').each(function(idx, element){
        new ResizerDemo(element);
    });

    perfTest();
    example3();
    example4();
    example5();
});

function perfTest(){
    var container = $('#dynamicContainer');
    var dynamicCount = $('#dynamicCount');
    var dynamicCounter = $('#dynamicCounter');

    window.detachDynamic = function() {
        container.children().each(function(idx, element) {
            ResizeSensor.detach(element);
        });
    };

    window.removeDynamic = function() {
        container.html('');
    };

    window.addDynamic = function() {
        container.html('');
        var i = 0, to = dynamicCount.val(), div, counter = 0;
        for (; i < to; i++) {
            div = $('<div class="dynamicElement">#'+i+'</div>');
            container.append(div);

            new ResizeSensor(div, function(){
                counter++;
                dynamicCounter.html(counter + ' changes.');
            });
        }
    }
}

function example3(){
    var logger = $('#example-3-log');
    var box = $('#example-3-box');

    $('#startStop3').on('click', function(){
        if (box.hasClass('example-3-box-start')) {
            box.removeClass('example-3-box-start');
        } else {
            box.addClass('example-3-box-start');
        }
    });
    new ResizeSensor(box, function(el){
        logger.html('Changed to ' + box[0].clientWidth+'px width.');
    });

}

function example4(){
    var logger = $('#example-4-log');
    var box = $('#example-4-box');

    $('#startStop4').on('click', function(){
        if (box.hasClass('example-4-box-start')) {
            box.removeClass('example-4-box-start');
        } else {
            box.addClass('example-4-box-start');
        }
    });
    new ResizeSensor(box, function(){
        logger.html('Changed to ' + box[0].clientHeight+'px height.');
    });
}

function example5(){
    var box = $('#example-5');
    var changed = 0;
    new ResizeSensor(box.parent(), function(){
        box[0].innerHTML = (++changed) + ' changes. ' + box.parent()[0].clientWidth+'px/'+box.parent()[0].clientHeight+'px';
    });
}