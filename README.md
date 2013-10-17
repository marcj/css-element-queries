CSS Element Queries
===================

A proof-of-concept event-based CSS element dimension query with valid CSS selector syntax.

This means:

 - no performance issues
 - no interval/timeout detection. Truly event-based
 - no CSS modifications. Valid CSS Syntax
 - all CSS selectors available. Uses regular attribute selector
 - support and tested in webkit, gecko and internet explorer(8/9/10).
 - `min-width`, `min-height`, `max-width` and `max-height` are supported so far
 - works with any layout modifications: HTML (innerHTML etc), inline styles, DOM mutation, CSS3 transitions, fluid layout changes (also percent changes), pseudo classes (:hover etc.), window resizes and more

More demos and information here: http://marcj.github.io/css-element-queries/

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

/* responsive images /*
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

Info: This is a first very experimental version! You should not use it yet.


Issues
------

 - Does not work on `img` tags. Wrapping with a `div` works fine though (See the demo).
 - Adds additional hidden element into selected target element in non-internet-explorer browsers and forces target element to be relative or absolute.
