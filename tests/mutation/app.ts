declare const ResizeSensor;

const state: {
    dragged: Element
} = {
    dragged: null
};

let i = 0;

for (const item of document.getElementsByClassName('drag')) {
    i++;
    item.setAttribute('draggable', 'true');
    item.setAttribute('id', 'drag-' + i);

    (element => {
        const title = 'Drag me #' + i;
        element.setAttribute('data-label', title);

        new ResizeSensor(element, (size) => {
            element.setAttribute('data-label', `${title} (${size.width}x${size.height})`);
        });
    })(item);

    item.addEventListener('dragstart', (event: DragEvent) => {
        state.dragged = <Element>event.target;
        event.dataTransfer.setData('text', 'thanks firefox');
        event.dataTransfer.dropEffect = 'move';
    });
}

for (const item of document.getElementsByClassName('container')) {
    (element => {
        item.addEventListener('drop', (event) => {
            event.preventDefault();
            item.classList.remove('drag-hover');

            state.dragged.parentNode.removeChild(state.dragged);
            element.appendChild(state.dragged);

            state.dragged = null;
        });
    })(item);

    item.addEventListener('dragleave', (event) => {
        item.classList.remove('drag-hover');
    });

    item.addEventListener('dragover', (event) => {
        item.classList.add('drag-hover');
    });

    item.addEventListener('dragover', (event) => {
        event.preventDefault();
    });
}
