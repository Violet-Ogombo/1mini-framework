/**
 * Creates a simple state management system that allows components to subscribe to state changes.
 * This is the heart of the application's data flow. When the state changes, all
 * subscribed components are notified and can re-render themselves.
 *
 * @param {object} initialState The initial state of the application.
 * @returns {object} An object with methods to get, set, and subscribe to the state.
 */
export const createState = (initialState) => {
  let state = initialState;
  const listeners = new Set();

  /**
   * Returns the current state.
   * @returns {object} The current state.
   */
  const getState = () => state;

  /**
   * Updates the state and notifies all subscribed listeners.
   * @param {object} newState The new state or a partial state to be merged.
   */
  const setState = (newState) => {
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener(state));
  };

  /**
   * Subscribes a listener function to be called whenever the state changes.
   * @param {function} listener The function to call on state changes.
   * @returns {function} An unsubscribe function.
   */
  const subscribe = (listener) => {
    listeners.add(listener);
    // Return an unsubscribe function.
    return () => listeners.delete(listener);
  };

  return {
    getState,
    setState,
    subscribe,
  };
};
