export declare class ElementQueries {
  /**
   * Attaches to DOMContentLoaded
   */
  static listen(): void;

  /**
   * Parses all available CSS and attach ResizeSensor to those elements which have rules attached.
   * Make sure this is called after 'DOMContentLoaded' fires, because CSS files are not ready before then.
   */
  static init(): void;
}

export default ElementQueries;
