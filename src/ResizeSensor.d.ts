export declare type ResizeSensorCallback = (size: { width: number; height: number; }) => void;

declare class ResizeSensor {
    constructor(element: Element | Element[], callback: ResizeSensorCallback);
    detach(callback: ResizeSensorCallback): void;
    reset(): void;

    static detach(element: Element | Element[], callback: ResizeSensorCallback): void;
    static reset(element: Element | Element[]): void;
}

export default ResizeSensor;
