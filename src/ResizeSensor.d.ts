declare class ResizeSensor {
    constructor(element: (Element | Element[]), callback: Function);
    detach(callback: Function): void;
}

export = ResizeSensor;
