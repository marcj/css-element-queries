export declare interface Size {
    width: number;
    height: number;
}

export declare type ResizeSensorCallback = (size: Size) => void;

export default class ResizeSensor {
    /**
     * Creates a new resize sensor on given elements. The provided callback is called max 1 times per requestAnimationFrame and
     * is called initially.
     */
    constructor(element: Element | Element[], callback: ResizeSensorCallback);

    /**
     * Removes the resize sensor, and stops listening to resize events.
     */
    detach(callback?: ResizeSensorCallback): void;

    /**
     * Resets the resize sensors, so for the next element resize is correctly detected. This is rare cases necessary
     * when the resize sensor isn't initialised correctly or is in a broken state due to DOM modifications.
     */
    reset(): void;

    /**
     * Removes the resize sensor, and stops listening to resize events.
     */
    static detach(element: Element | Element[], callback?: ResizeSensorCallback): void;

    /**
     * Resets the resize sensors, so for the next element resize is correctly detected. This is rare cases necessary
     * when the resize sensor isn't initialised correctly or is in a broken state due to DOM modifications.
     */
    static reset(element: Element | Element[]): void;
}
