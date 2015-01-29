CSS Element Queries
===================

Element Queries is a polyfill adding support for element based media-queries to all new browsers (incl. IE7+).
It allows not only to define media-queries based on window-size but also adds 'media-queries' functionality depending on element (any selector supported)
size while not causing performance lags due to event based implementation.

It's a proof-of-concept event-based CSS element dimension query with valid CSS selector syntax.

Features:

 - no performance issues since it listens only on size changes of elements that have element query rules defined through css. Other element query polifills only listen on `window.onresize` which causes performance issues and allows only to detect changes via window.resize event and not inside layout changes like css3 animation, :hover, DOM changes etc.
 - no interval/timeout detection. Truly event-based through integrated ResizeSensor class.
 - no CSS modifications. Valid CSS Syntax
 - all CSS selectors available. Uses regular attribute selector. No need to write rules in HTML.
 - supports and tested in webkit, gecko and IE(7/8/9/10/11).
 - `min-width`, `min-height`, `max-width` and `max-height` are supported so far
 - works with any layout modifications: HTML (innerHTML etc), inline styles, DOM mutation, CSS3 transitions, fluid layout changes (also percent changes), pseudo classes (:hover etc.), window resizes and more
 - no Javascript-Framework dependency (works with jQuery, Mootools, etc.)

More demos and information: http://marcj.github.io/css-element-queries/

Example
-------

```css
.widget-name {
    padding: 25px;
}
.widget-name[max-width="200px"] {
    padding: 0;
}
.widget-name[min-width="500px"] {
    padding: 55px;
}

/* responsive images */
.responsive-image img {
    width: 100%;
}

.responsive-image[max-width^='400px'] img {
    content: url(demo/image-400px.jpg);
}

.responsive-image[max-width^='1000px'] img {
    content: url(demo/image-1000px.jpg);
}

.responsive-image[min-width='1000px'] img {
    content: url(demo/image-full.jpg);
}
```

Include the javascript files at the bottom and you're good to go. No custom javascript calls needed.

```html
<script src="src/ResizeSensor.js"></script>
<script src="src/ElementQueries.js"></script>
```

Issues
------

 - So far does not work on `img` and other elements that can't contain other elements. Wrapping with a `div` works fine though (See demo).
 - Adds additional hidden elements into selected target element and forces target element to be relative or absolute.
 

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/marcj/css-element-queries/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


License
-------
MIT license. Copyright [Marc J. Schmidt](http://marcjschmidt.de/).
