export declare type ResizeCallback = (size: { width: number; height: number; }) => void;

declare class ResizeSensor {
    constructor(element: Element | Element[], callback: ResizeCallback);
    detach(callback: ResizeCallback): void;
    reset(): void;

    static detach(element: Element | Element[], callback: ResizeCallback): void;
    static reset(element: Element | Element[]): void;
}

export default ResizeSensor;
