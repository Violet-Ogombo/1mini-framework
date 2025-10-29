# Mini-Framework

This is a simple, lightweight JavaScript framework for building front-end applications. It provides the essential features needed for modern web development, including DOM abstraction, state management, routing, and event handling.

## Features

*   **DOM Abstraction**: A Virtual DOM-like system where you describe your UI using JavaScript objects. The framework then renders the actual HTML.
*   **State Management**: A centralized store to manage your application's data. The UI automatically updates when the state changes.
*   **Routing System**: A simple hash-based router to synchronize the application's view with the URL.
*   **Event Handling**: A declarative way to handle user events directly within your UI components.

## How It Works

This framework follows the principle of "inversion of control." Instead of you calling library functions, the framework calls your code in response to events and state changes.

1.  **Describe Your UI**: You create components, which are functions that return JavaScript objects (virtual nodes) describing the HTML structure.
2.  **Manage State**: You create a central `store` that holds all your application's data.
3.  **Render**: The framework takes your components and the current state, and renders the final HTML to the screen.
4.  **Update**: When the state changes (e.g., due to a user action), the framework automatically re-renders the necessary parts of the UI.

## How to Use

### 1. Create an Element

Use the `createElement` function to describe an HTML element. It takes a tag, attributes, and an array of children.

```javascript
import { createElement } from './framework/index.js';

const myElement = createElement('div', {
  attrs: { class: 'container' },
  children: ['Hello, World!'],
});
```

### 2. Nest Elements

To nest elements, simply include other `createElement` calls in the `children` array.

```javascript
const nestedElement = createElement('div', {
  attrs: { class: 'parent' },
  children: [
    createElement('h1', { children: ['I am a child heading'] }),
    createElement('p', { children: ['I am a child paragraph'] }),
  ],
});
```

### 3. Add Attributes

Attributes are passed in the `attrs` object. This includes standard HTML attributes like `class`, `id`, `placeholder`, etc.

```javascript
const inputElement = createElement('input', {
  attrs: {
    type: 'text',
    class: 'new-todo',
    placeholder: 'What needs to be done?',
  },
});
```

### 4. Create an Event

Events are handled by adding special attributes that start with `on` (e.g., `onclick`, `onkeyup`). The value should be the function to execute when the event occurs.

```javascript
const button = createElement('button', {
  attrs: {
    onclick: () => alert('Button was clicked!'),
  },
  children: ['Click Me'],
});
```

This declarative approach keeps your event logic tied directly to the elements that trigger them, making the code easier to read and manage.

## How to run the TodoMVC demo

The TodoMVC demo is in the `todo-mvc` folder.

From PowerShell, you can use Python's built-in HTTP server (works on Windows if Python is installed):

```powershell
cd 'c:\Desktop\mini-framework\todo-mvc'
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

Or, Open the todo-mvc folder in VS Code and click "Go Live" in the status bar (or right-click index.html -> "Open with Live Server").

Or using Node (no global install required):

```powershell
cd 'c:\Desktop\mini-framework\todo-mvc'
npx http-server -c-1 . 8000
# Open http://localhost:8000 in your browser
```

Notes:
- The app persists todos to `localStorage` under the `todos` key. If you want to reset stored todos, clear them in the browser DevTools (Application > Local Storage) or run `localStorage.removeItem('todos')` in the console.
- The demo supports adding, editing (double-click a todo), checking/unchecking, filtering (All / Active / Completed), and clearing completed todos.
