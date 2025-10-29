import {
  createElement,
  render,
  createState,
  createRouter,
} from '../framework/index.js';

// 1. Initial State (load persisted todos from localStorage if available)
let _savedTodos = [];
try {
  const _raw = localStorage.getItem('todos');
  if (_raw) _savedTodos = JSON.parse(_raw);
} catch (e) {
  _savedTodos = [];
}

const initialState = {
  todos: _savedTodos,
  filter: 'all', // 'all', 'active', 'completed'
};

// 2. Create Store
const store = createState(initialState);

// --- Components ---

const Header = () => {
  return createElement('header', {
    attrs: { class: 'header' },
    children: [
      createElement('h1', { children: ['todos'] }),
      createElement('input', {
        attrs: {
          class: 'new-todo',
          placeholder: 'What needs to be done?',
          autofocus: true,
          onkeyup: (event) => {
            if (event.key === 'Enter' && event.target.value.trim() !== '') {
              const newTodo = {
                id: Date.now(),
                title: event.target.value.trim(),
                completed: false,
              };
              const state = store.getState();
              store.setState({ todos: [...state.todos, newTodo] });
              event.target.value = '';
            }
          },
        },
      }),
    ],
  });
};

const TodoItem = ({ todo }) => {
  // Handlers for editing
  const startEditing = () => {
    const state = store.getState();
    const todos = state.todos.map((t) =>
      t.id === todo.id ? { ...t, editing: true } : t
    );
    store.setState({ todos });
  };

  const saveEdit = (newTitle) => {
    const trimmed = newTitle.trim();
    const state = store.getState();
    const todos = state.todos
      .map((t) =>
        t.id === todo.id ? { ...t, title: trimmed || t.title, editing: false } : t
      )
      // If the title became empty, remove the todo
      .filter((t) => t.title && t.title.length > 0);
    store.setState({ todos });
  };

  const cancelEdit = () => {
    const state = store.getState();
    const todos = state.todos.map((t) =>
      t.id === todo.id ? { ...t, editing: false } : t
    );
    store.setState({ todos });
  };

  return createElement('li', {
    attrs: {
      class: `${todo.completed ? 'completed' : ''} ${todo.editing ? 'editing' : ''}`.trim(),
    },
    children: [
      createElement('div', {
        attrs: { class: 'view' },
        children: [
          createElement('input', {
            attrs: {
              class: 'toggle',
              type: 'checkbox',
              checked: todo.completed,
              onchange: () => {
                const state = store.getState();
                const todos = state.todos.map((t) =>
                  t.id === todo.id ? { ...t, completed: !t.completed } : t
                );
                store.setState({ todos });
              },
            },
          }),
          createElement('label', {
            attrs: {
              ondblclick: startEditing,
            },
            children: [todo.title],
          }),
          createElement('button', {
            attrs: {
              class: 'destroy',
              onclick: () => {
                const state = store.getState();
                const todos = state.todos.filter((t) => t.id !== todo.id);
                store.setState({ todos });
              },
            },
          }),
        ],
      }),
      // Edit input shown when editing === true
      todo.editing
        ? createElement('input', {
            attrs: {
              class: 'edit',
              value: todo.title,
              autofocus: true,
              onkeyup: (e) => {
                if (e.key === 'Enter') {
                  saveEdit(e.target.value);
                }
              },
              onblur: (e) => {
                saveEdit(e.target.value);
              },
              onkeydown: (e) => {
                if (e.key === 'Escape') {
                  cancelEdit();
                }
              },
            },
          })
        : null,
    ],
  });
};

const TodoList = ({ todos }) => {
  return createElement('ul', {
    attrs: { class: 'todo-list' },
    children: todos.map((todo) => TodoItem({ todo })),
  });
};

const Main = ({ todos }) => {
  if (todos.length === 0) {
    return null;
  }

  const allCompleted = todos.every((todo) => todo.completed);

  return createElement('section', {
    attrs: { class: 'main' },
    children: [
      createElement('input', {
        attrs: {
          id: 'toggle-all',
          class: 'toggle-all',
          type: 'checkbox',
          checked: allCompleted,
          onchange: () => {
            const state = store.getState();
            const newTodos = state.todos.map((todo) => ({
              ...todo,
              completed: !allCompleted,
            }));
            store.setState({ todos: newTodos });
          },
        },
      }),
      createElement('label', {
        attrs: { for: 'toggle-all' },
        children: ['Mark all as complete'],
      }),
      
      TodoList({ todos }),
    ],
  });
};

// 3. Main App Component
const App = (props) => {
  // Keep the full todos separate from the filtered (visible) todos.
  const allTodos = props.todos || [];
  let visibleTodos = allTodos;
  const filter = props.filter;

  if (filter === 'active') {
    visibleTodos = allTodos.filter((todo) => !todo.completed);
  } else if (filter === 'completed') {
    visibleTodos = allTodos.filter((todo) => todo.completed);
  }

  return createElement('div', {
    attrs: { class: 'todoapp' },
    children: [
      Header(),
      Main({ todos: visibleTodos }),
      // Pass the full list to Footer so it can show counts and the clear button
      Footer({ todos: allTodos, filter }),
    ],
  });
};

const Footer = ({ todos, filter }) => {
  if (todos.length === 0) {
    return null;
  }

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return createElement('footer', {
    attrs: { class: 'footer' },
    children: [
      createElement('span', {
        attrs: { class: 'todo-count' },
        children: [
          createElement('strong', { children: [activeCount] }),
          ` item${activeCount !== 1 ? 's' : ''} left`,
        ],
      }),
      createElement('ul', {
        attrs: { class: 'filters' },
        children: [
          createElement('li', {
            children: [
              createElement('a', {
                attrs: {
                  href: '#/',
                  class: filter === 'all' ? 'selected' : '',
                },
                children: ['All'],
              }),
            ],
          }),
          createElement('li', {
            children: [
              createElement('a', {
                attrs: {
                  href: '#/active',
                  class: filter === 'active' ? 'selected' : '',
                },
                children: ['Active'],
              }),
            ],
          }),
          createElement('li', {
            children: [
              createElement('a', {
                attrs: {
                  href: '#/completed',
                  class: filter === 'completed' ? 'selected' : '',
                },
                children: ['Completed'],
              }),
            ],
          }),
        ],
      }),
      completedCount > 0
        ? createElement('button', {
            attrs: {
              class: 'clear-completed',
              onclick: () => {
                const state = store.getState();
                const newTodos = state.todos.filter((todo) => !todo.completed);
                store.setState({ todos: newTodos });
              },
            },
            children: ['Clear completed'],
          })
        : null,
    ],
  });
};

// 4. Render function
const renderApp = () => {
  const state = store.getState();
  const appElement = App(state);
  const root = document.getElementById('app');
  // Clear the root element before rendering
  root.innerHTML = '';
  root.appendChild(render(appElement));
};

// 5. Router
const router = createRouter();
router.addRoute('/', () => store.setState({ filter: 'all' }));
router.addRoute('/active', () => store.setState({ filter: 'active' }));
router.addRoute('/completed', () => store.setState({ filter: 'completed' }));

// 6. Subscribe to state changes and initial render
store.subscribe(renderApp);
router.listen();

// Persist todos to localStorage whenever state changes.
// We persist only the essential fields so ephemeral flags (like `editing`) are not stored.
store.subscribe((state) => {
  try {
    const toSave = (state.todos || []).map(({ id, title, completed }) => ({ id, title, completed }));
    localStorage.setItem('todos', JSON.stringify(toSave));
  } catch (e) {
    // ignore persistence errors (quota, private mode, etc.)
  }
});
