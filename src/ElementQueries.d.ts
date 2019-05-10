export declare class ElementQueries {
  /**
   * Attaches to DOMLoadContent
   */
  static listen(): void;

  /**
   * Parses all available CSS and attach ResizeSensor to those elements which have rules attached.
   * Make sure this is called after 'load' event, because CSS files are not ready when domReady is fired.
   */
  static init(): void;
}

export default ElementQueries;
