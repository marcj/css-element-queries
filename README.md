CSS Element Queries
===================

A proof-of-concept event-based CSS element dimension query with valid CSS selector syntax.

This means:

 - High-speed.
 - No interval/timeout detection. It's truly event-based.
 - No CSS modifications. Valid CSS Syntax.
 - All CSS selectors available. It uses the normal attribute selector.
 - Support and tested in webkit, gecko and internet explorer(8/9/10).
 - `min-width`, `min-height`, `max-width` and `max-height` are yet supported.
 - It works for actual all layout modifications: HTML (innerHTML etc), inline styles, DOM mutation, CSS3 transitions, fluid layout changes (parent changes too), pseudo classes (:hover etc), window resizes, etc.
 - No Javascript-Framework dependency, so works with jQuery, Mootools, etc.

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

Include then the javascript file at the bottom and you're good to go. No custom javascript calls needed.

```html
<script src="src/ResizeSensor.js"></script>
<script src="src/ElementQueries.js"></script>
```

Info: This is a first very experimental version! You should not use it yet.


Issues
------

 - Does not work on `img` tags. A wrapper `div` around it works fine. See the demo.
 - Adds in non-internet-explorer browsers a additional hidden element into the selected target element. Forces the target element to be relative or absolute.