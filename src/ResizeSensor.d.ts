declare class ResizeSensor {
    constructor(element: (Element | Element[]), callback: Function);
    detach(callback: Function): void;
    reset(element: Element | Element[]): void;
}

export default ResizeSensor;
