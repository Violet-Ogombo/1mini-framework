/**
 * Creates a virtual DOM node, which is a JavaScript object that represents an HTML element.
 * This function is the foundation for abstracting the DOM. Instead of writing HTML, you can create elements programmatically.
 *
 * @param {string} tag The HTML tag for the element (e.g., 'div', 'p', 'button').
 * @param {object} attrs An object containing the attributes for the element (e.g., { class: 'container', id: 'my-id' }).
 * @param {Array<object|string>} children An array of child virtual nodes or strings.
 * @returns {object} A virtual DOM node.
 */
export const createElement = (tag, options) => {
  const { attrs = {}, children = [] } = options || {};
  return {
    tag,
    attrs,
    children,
  };
};

/**
 * Renders a virtual DOM node into a real DOM element. It recursively builds the
 * DOM tree based on the virtual node's structure.
 *
 * @param {object} vNode A virtual DOM node created by `createElement`.
 * @returns {Node} A real DOM node that can be appended to the document.
 */
export const render = (vNode) => {
  // Handle primitive/string virtual nodes
  // If the virtual node is null/undefined, return null so parents can skip it.
  // (Previously this returned an empty text node which produced unwanted empty nodes.)
  if (vNode == null) return null;
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    return document.createTextNode(String(vNode));
  }

  // If a real DOM node is passed, return it directly
  if (vNode instanceof Node) return vNode;

  // Defensive defaults in case attrs/children are missing
  const tag = vNode.tag || 'div';
  const attrs = vNode.attrs || {};
  const children = vNode.children || [];

  // Create the main element.
  const $el = document.createElement(tag);

  // Set the attributes.
  for (const [key, value] of Object.entries(attrs)) {
    // If the attribute is an event listener, attach it.
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      $el.addEventListener(eventName, value);
      continue;
    }

    if (value === undefined || value === null) continue;

    // Special-case value property to set input values correctly
    if (key === 'value') {
      try {
        $el.value = value;
      } catch (e) {
        $el.setAttribute('value', value);
      }
      continue;
    }

    // Handle boolean attributes (checked, disabled, autofocus, etc.) by setting properties
    if (typeof value === 'boolean') {
      try {
        $el[key] = value;
      } catch (e) {
        // Fallback to set/remove attribute
        if (value) $el.setAttribute(key, ''); else $el.removeAttribute(key);
      }
      continue;
    }

    // Special-case className
    if (key === 'class') {
      $el.className = value;
      continue;
    }

    // Fallback: set as attribute
    $el.setAttribute(key, value);
  }

  // Render and append the children.
  for (const child of children) {
    // Ignore null or false children
    if (child === null || child === false || child === undefined) {
      continue;
    }
    const $child = render(child);
    $el.appendChild($child);
  }

  return $el;
};
