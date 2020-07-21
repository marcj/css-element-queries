ElementQueries.listen();
ElementQueries.init();

const container = document.getElementById("container");

const resizeSensor = new ResizeSensor(container, () => {});
resizeSensor.detach();
resizeSensor.reset();

ResizeSensor.detach(container);
ResizeSensor.reset(container);
