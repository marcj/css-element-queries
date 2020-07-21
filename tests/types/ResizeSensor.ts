import * as ResizeSensor from "../../src/ResizeSensor";

const container = document.getElementById("container");

const callback: ResizeSensor.ResizeSensorCallback = (
  size: ResizeSensor.Size
) => {
  console.log(size);
};

const resizeSensor = new ResizeSensor(container, callback);
resizeSensor.detach();
resizeSensor.detach(callback);
resizeSensor.reset();

ResizeSensor.detach(container);
ResizeSensor.detach(container, callback);
ResizeSensor.reset(container);
