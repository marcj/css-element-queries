CSS Element Queries
===================

A proof-of-concept event-based CSS element dimension query with valid CSS selector syntax.

This means:

 - No interval/timeout detection. It's truly event-based.
 - No CSS modifications.
 - Valid CSS Syntax.
 - All CSS selectors available. It used the normal attribute selector.
 - Support for webkit/gecko/internet explorer.
 - `min-width`, `min-height`, `max-width` and `max-height` are yet supported.

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
```

Info: This is a first very experimental version! You should not use it yet.