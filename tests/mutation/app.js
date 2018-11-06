var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var e_1, _a, e_2, _b;
var state = {
    dragged: null
};
var i = 0;
try {
    for (var _c = __values(document.getElementsByClassName('drag')), _d = _c.next(); !_d.done; _d = _c.next()) {
        var item = _d.value;
        i++;
        item.setAttribute('draggable', 'true');
        item.setAttribute('id', 'drag-' + i);
        (function (element) {
            var title = 'Drag me #' + i;
            element.setAttribute('data-label', title);
            new ResizeSensor(element, function (size) {
                element.setAttribute('data-label', title + " (" + size.width + "x" + size.height + ")");
            });
        })(item);
        item.addEventListener('dragstart', function (event) {
            state.dragged = event.target;
            event.dataTransfer.setData('text', 'thanks firefox');
            event.dataTransfer.dropEffect = 'move';
        });
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
    }
    finally { if (e_1) throw e_1.error; }
}
var _loop_1 = function (item) {
    (function (element) {
        item.addEventListener('drop', function (event) {
            event.preventDefault();
            item.classList.remove('drag-hover');
            state.dragged.parentNode.removeChild(state.dragged);
            element.appendChild(state.dragged);
            state.dragged = null;
        });
    })(item);
    item.addEventListener('dragleave', function (event) {
        item.classList.remove('drag-hover');
    });
    item.addEventListener('dragover', function (event) {
        item.classList.add('drag-hover');
    });
    item.addEventListener('dragover', function (event) {
        event.preventDefault();
    });
};
try {
    for (var _e = __values(document.getElementsByClassName('container')), _f = _e.next(); !_f.done; _f = _e.next()) {
        var item = _f.value;
        _loop_1(item);
    }
}
catch (e_2_1) { e_2 = { error: e_2_1 }; }
finally {
    try {
        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
    }
    finally { if (e_2) throw e_2.error; }
}
