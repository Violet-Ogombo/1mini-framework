/**
 * Creates a simple hash-based routing system. It allows you to define routes
 * and associate them with handler functions. When the URL hash changes, the
 * corresponding handler is called.
 *
 * @returns {object} An object with methods to define and listen to routes.
 */
export const createRouter = () => {
  const routes = {};

  /**
   * Defines a route and its handler.
   * @param {string} path The route path (e.g., '/', '/active', '/completed').
   * @param {function} handler The function to call when the route is matched.
   */
  const addRoute = (path, handler) => {
    routes[path] = handler;
  };

  /**
   * Starts listening for hash changes and calls the appropriate handler.
   */
  const listen = () => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      const path = hash.slice(1);
      const handler = routes[path];
      if (handler) {
        handler();
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial load
    handleHashChange();
  };

  return {
    addRoute,
    listen,
  };
};
