/** @license React v16.8.6
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.React = factory();
})(this, function () {
  'use strict';

  // TODO: this is special because it gets imported during build.

  var ReactVersion = '16.8.6';

  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var hasSymbol = typeof Symbol === 'function' && Symbol.for;

  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;

  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

  var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }
    var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }
    return null;
  }

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */

  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
    }

    return Object(val);
  }

  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }

      // Detect buggy property enumeration order in older V8 versions.

      // https://bugs.chromium.org/p/v8/issues/detail?id=4118
      var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
      test1[5] = 'de';
      if (Object.getOwnPropertyNames(test1)[0] === '5') {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2['_' + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      });
      if (order2.join('') !== '0123456789') {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test3 = {};
      'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
        return false;
      }

      return true;
    } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
    }
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    var from;
    var to = toObject(target);
    var symbols;

    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);

      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }

      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }

    return to;
  };

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  var validateFormat = function () {};

  {
    validateFormat = function (format) {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    };
  }

  function invariant(condition, format, a, b, c, d, e, f) {
    validateFormat(format);

    if (!condition) {
      var error = void 0;
      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  }

  // Relying on the `invariant()` implementation lets us
  // preserve the format and params in the www builds.

  /**
   * Forked from fbjs/warning:
   * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
   *
   * Only change is we use console.warn instead of console.error,
   * and do nothing when 'console' is not supported.
   * This really simplifies the code.
   * ---
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var lowPriorityWarning = function () {};

  {
    var printWarning = function (format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.warn(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    lowPriorityWarning = function (condition, format) {
      if (format === undefined) {
        throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  }

  var lowPriorityWarning$1 = lowPriorityWarning;

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warningWithoutStack = function () {};

  {
    warningWithoutStack = function (condition, format) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (format === undefined) {
        throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (args.length > 8) {
        // Check before the condition to catch violations early.
        throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
      }
      if (condition) {
        return;
      }
      if (typeof console !== 'undefined') {
        var argsWithFormat = args.map(function (item) {
          return '' + item;
        });
        argsWithFormat.unshift('Warning: ' + format);

        // We intentionally don't use spread (or .apply) directly because it
        // breaks IE9: https://github.com/facebook/react/issues/13610
        Function.prototype.apply.call(console.error, console, argsWithFormat);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        throw new Error(message);
      } catch (x) {}
    };
  }

  var warningWithoutStack$1 = warningWithoutStack;

  var didWarnStateUpdateForUnmountedComponent = {};

  function warnNoop(publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
      var warningKey = componentName + '.' + callerName;
      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }
      warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }

  /**
   * This is the abstract API for an update queue.
   */
  var ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function (publicInstance) {
      return false;
    },

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} Name of the calling function in the public API.
     * @internal
     */
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };

  var emptyObject = {};
  {
    Object.freeze(emptyObject);
  }

  /**
   * Base class helpers for the updating state of a component.
   */
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject;
    // We initialize the default updater but the real one gets injected by the
    // renderer.
    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};

  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  Component.prototype.setState = function (partialState, callback) {
    !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */
  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };

  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   */
  {
    var deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };
    var defineDeprecationWarning = function (methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    };
    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy() {}
  ComponentDummy.prototype = Component.prototype;

  /**
   * Convenience component with default shallow equality check for sCU.
   */
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;
  // Avoid an extra prototype jump for these methods.
  objectAssign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;

  // an immutable object with a single mutable value
  function createRef() {
    var refObject = {
      current: null
    };
    {
      Object.seal(refObject);
    }
    return refObject;
  }

  var enableSchedulerDebugging = false;

  /* eslint-disable no-var */

  // TODO: Use symbols?
  var ImmediatePriority = 1;
  var UserBlockingPriority = 2;
  var NormalPriority = 3;
  var LowPriority = 4;
  var IdlePriority = 5;

  // Max 31 bit integer. The max integer size in V8 for 32-bit systems.
  // Math.pow(2, 30) - 1
  // 0b111111111111111111111111111111
  var maxSigned31BitInt = 1073741823;

  // Times out immediately
  var IMMEDIATE_PRIORITY_TIMEOUT = -1;
  // Eventually times out
  var USER_BLOCKING_PRIORITY = 250;
  var NORMAL_PRIORITY_TIMEOUT = 5000;
  var LOW_PRIORITY_TIMEOUT = 10000;
  // Never times out
  var IDLE_PRIORITY = maxSigned31BitInt;

  // Callbacks are stored as a circular, doubly linked list.
  var firstCallbackNode = null;

  var currentDidTimeout = false;
  // Pausing the scheduler is useful for debugging.
  var isSchedulerPaused = false;

  var currentPriorityLevel = NormalPriority;
  var currentEventStartTime = -1;
  var currentExpirationTime = -1;

  // This is set when a callback is being executed, to prevent re-entrancy.
  var isExecutingCallback = false;

  var isHostCallbackScheduled = false;

  var hasNativePerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';

  function ensureHostCallbackIsScheduled() {
    if (isExecutingCallback) {
      // Don't schedule work yet; wait until the next time we yield.
      return;
    }
    // Schedule the host callback using the earliest expiration in the list.
    var expirationTime = firstCallbackNode.expirationTime;
    if (!isHostCallbackScheduled) {
      isHostCallbackScheduled = true;
    } else {
      // Cancel the existing host callback.
      cancelHostCallback();
    }
    requestHostCallback(flushWork, expirationTime);
  }

  function flushFirstCallback() {
    var flushedNode = firstCallbackNode;

    // Remove the node from the list before calling the callback. That way the
    // list is in a consistent state even if the callback throws.
    var next = firstCallbackNode.next;
    if (firstCallbackNode === next) {
      // This is the last callback in the list.
      firstCallbackNode = null;
      next = null;
    } else {
      var lastCallbackNode = firstCallbackNode.previous;
      firstCallbackNode = lastCallbackNode.next = next;
      next.previous = lastCallbackNode;
    }

    flushedNode.next = flushedNode.previous = null;

    // Now it's safe to call the callback.
    var callback = flushedNode.callback;
    var expirationTime = flushedNode.expirationTime;
    var priorityLevel = flushedNode.priorityLevel;
    var previousPriorityLevel = currentPriorityLevel;
    var previousExpirationTime = currentExpirationTime;
    currentPriorityLevel = priorityLevel;
    currentExpirationTime = expirationTime;
    var continuationCallback;
    try {
      continuationCallback = callback();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
      currentExpirationTime = previousExpirationTime;
    }

    // A callback may return a continuation. The continuation should be scheduled
    // with the same priority and expiration as the just-finished callback.
    if (typeof continuationCallback === 'function') {
      var continuationNode = {
        callback: continuationCallback,
        priorityLevel: priorityLevel,
        expirationTime: expirationTime,
        next: null,
        previous: null
      };

      // Insert the new callback into the list, sorted by its expiration. This is
      // almost the same as the code in `scheduleCallback`, except the callback
      // is inserted into the list *before* callbacks of equal expiration instead
      // of after.
      if (firstCallbackNode === null) {
        // This is the first callback in the list.
        firstCallbackNode = continuationNode.next = continuationNode.previous = continuationNode;
      } else {
        var nextAfterContinuation = null;
        var node = firstCallbackNode;
        do {
          if (node.expirationTime >= expirationTime) {
            // This callback expires at or after the continuation. We will insert
            // the continuation *before* this callback.
            nextAfterContinuation = node;
            break;
          }
          node = node.next;
        } while (node !== firstCallbackNode);

        if (nextAfterContinuation === null) {
          // No equal or lower priority callback was found, which means the new
          // callback is the lowest priority callback in the list.
          nextAfterContinuation = firstCallbackNode;
        } else if (nextAfterContinuation === firstCallbackNode) {
          // The new callback is the highest priority callback in the list.
          firstCallbackNode = continuationNode;
          ensureHostCallbackIsScheduled();
        }

        var previous = nextAfterContinuation.previous;
        previous.next = nextAfterContinuation.previous = continuationNode;
        continuationNode.next = nextAfterContinuation;
        continuationNode.previous = previous;
      }
    }
  }

  function flushImmediateWork() {
    if (
    // Confirm we've exited the outer most event handler
    currentEventStartTime === -1 && firstCallbackNode !== null && firstCallbackNode.priorityLevel === ImmediatePriority) {
      isExecutingCallback = true;
      try {
        do {
          flushFirstCallback();
        } while (
        // Keep flushing until there are no more immediate callbacks
        firstCallbackNode !== null && firstCallbackNode.priorityLevel === ImmediatePriority);
      } finally {
        isExecutingCallback = false;
        if (firstCallbackNode !== null) {
          // There's still work remaining. Request another callback.
          ensureHostCallbackIsScheduled();
        } else {
          isHostCallbackScheduled = false;
        }
      }
    }
  }

  function flushWork(didTimeout) {
    // Exit right away if we're currently paused

    if (enableSchedulerDebugging && isSchedulerPaused) {
      return;
    }

    isExecutingCallback = true;
    var previousDidTimeout = currentDidTimeout;
    currentDidTimeout = didTimeout;
    try {
      if (didTimeout) {
        // Flush all the expired callbacks without yielding.
        while (firstCallbackNode !== null && !(enableSchedulerDebugging && isSchedulerPaused)) {
          // TODO Wrap in feature flag
          // Read the current time. Flush all the callbacks that expire at or
          // earlier than that time. Then read the current time again and repeat.
          // This optimizes for as few performance.now calls as possible.
          var currentTime = getCurrentTime();
          if (firstCallbackNode.expirationTime <= currentTime) {
            do {
              flushFirstCallback();
            } while (firstCallbackNode !== null && firstCallbackNode.expirationTime <= currentTime && !(enableSchedulerDebugging && isSchedulerPaused));
            continue;
          }
          break;
        }
      } else {
        // Keep flushing callbacks until we run out of time in the frame.
        if (firstCallbackNode !== null) {
          do {
            if (enableSchedulerDebugging && isSchedulerPaused) {
              break;
            }
            flushFirstCallback();
          } while (firstCallbackNode !== null && !shouldYieldToHost());
        }
      }
    } finally {
      isExecutingCallback = false;
      currentDidTimeout = previousDidTimeout;
      if (firstCallbackNode !== null) {
        // There's still work remaining. Request another callback.
        ensureHostCallbackIsScheduled();
      } else {
        isHostCallbackScheduled = false;
      }
      // Before exiting, flush all the immediate work that was scheduled.
      flushImmediateWork();
    }
  }

  function unstable_runWithPriority(priorityLevel, eventHandler) {
    switch (priorityLevel) {
      case ImmediatePriority:
      case UserBlockingPriority:
      case NormalPriority:
      case LowPriority:
      case IdlePriority:
        break;
      default:
        priorityLevel = NormalPriority;
    }

    var previousPriorityLevel = currentPriorityLevel;
    var previousEventStartTime = currentEventStartTime;
    currentPriorityLevel = priorityLevel;
    currentEventStartTime = getCurrentTime();

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
      currentEventStartTime = previousEventStartTime;

      // Before exiting, flush all the immediate work that was scheduled.
      flushImmediateWork();
    }
  }

  function unstable_next(eventHandler) {
    var priorityLevel = void 0;
    switch (currentPriorityLevel) {
      case ImmediatePriority:
      case UserBlockingPriority:
      case NormalPriority:
        // Shift down to normal priority
        priorityLevel = NormalPriority;
        break;
      default:
        // Anything lower than normal priority should remain at the current level.
        priorityLevel = currentPriorityLevel;
        break;
    }

    var previousPriorityLevel = currentPriorityLevel;
    var previousEventStartTime = currentEventStartTime;
    currentPriorityLevel = priorityLevel;
    currentEventStartTime = getCurrentTime();

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
      currentEventStartTime = previousEventStartTime;

      // Before exiting, flush all the immediate work that was scheduled.
      flushImmediateWork();
    }
  }

  function unstable_wrapCallback(callback) {
    var parentPriorityLevel = currentPriorityLevel;
    return function () {
      // This is a fork of runWithPriority, inlined for performance.
      var previousPriorityLevel = currentPriorityLevel;
      var previousEventStartTime = currentEventStartTime;
      currentPriorityLevel = parentPriorityLevel;
      currentEventStartTime = getCurrentTime();

      try {
        return callback.apply(this, arguments);
      } finally {
        currentPriorityLevel = previousPriorityLevel;
        currentEventStartTime = previousEventStartTime;
        flushImmediateWork();
      }
    };
  }

  function unstable_scheduleCallback(callback, deprecated_options) {
    var startTime = currentEventStartTime !== -1 ? currentEventStartTime : getCurrentTime();

    var expirationTime;
    if (typeof deprecated_options === 'object' && deprecated_options !== null && typeof deprecated_options.timeout === 'number') {
      // FIXME: Remove this branch once we lift expiration times out of React.
      expirationTime = startTime + deprecated_options.timeout;
    } else {
      switch (currentPriorityLevel) {
        case ImmediatePriority:
          expirationTime = startTime + IMMEDIATE_PRIORITY_TIMEOUT;
          break;
        case UserBlockingPriority:
          expirationTime = startTime + USER_BLOCKING_PRIORITY;
          break;
        case IdlePriority:
          expirationTime = startTime + IDLE_PRIORITY;
          break;
        case LowPriority:
          expirationTime = startTime + LOW_PRIORITY_TIMEOUT;
          break;
        case NormalPriority:
        default:
          expirationTime = startTime + NORMAL_PRIORITY_TIMEOUT;
      }
    }

    var newNode = {
      callback: callback,
      priorityLevel: currentPriorityLevel,
      expirationTime: expirationTime,
      next: null,
      previous: null
    };

    // Insert the new callback into the list, ordered first by expiration, then
    // by insertion. So the new callback is inserted any other callback with
    // equal expiration.
    if (firstCallbackNode === null) {
      // This is the first callback in the list.
      firstCallbackNode = newNode.next = newNode.previous = newNode;
      ensureHostCallbackIsScheduled();
    } else {
      var next = null;
      var node = firstCallbackNode;
      do {
        if (node.expirationTime > expirationTime) {
          // The new callback expires before this one.
          next = node;
          break;
        }
        node = node.next;
      } while (node !== firstCallbackNode);

      if (next === null) {
        // No callback with a later expiration was found, which means the new
        // callback has the latest expiration in the list.
        next = firstCallbackNode;
      } else if (next === firstCallbackNode) {
        // The new callback has the earliest expiration in the entire list.
        firstCallbackNode = newNode;
        ensureHostCallbackIsScheduled();
      }

      var previous = next.previous;
      previous.next = next.previous = newNode;
      newNode.next = next;
      newNode.previous = previous;
    }

    return newNode;
  }

  function unstable_pauseExecution() {
    isSchedulerPaused = true;
  }

  function unstable_continueExecution() {
    isSchedulerPaused = false;
    if (firstCallbackNode !== null) {
      ensureHostCallbackIsScheduled();
    }
  }

  function unstable_getFirstCallbackNode() {
    return firstCallbackNode;
  }

  function unstable_cancelCallback(callbackNode) {
    var next = callbackNode.next;
    if (next === null) {
      // Already cancelled.
      return;
    }

    if (next === callbackNode) {
      // This is the only scheduled callback. Clear the list.
      firstCallbackNode = null;
    } else {
      // Remove the callback from its position in the list.
      if (callbackNode === firstCallbackNode) {
        firstCallbackNode = next;
      }
      var previous = callbackNode.previous;
      previous.next = next;
      next.previous = previous;
    }

    callbackNode.next = callbackNode.previous = null;
  }

  function unstable_getCurrentPriorityLevel() {
    return currentPriorityLevel;
  }

  function unstable_shouldYield() {
    return !currentDidTimeout && (firstCallbackNode !== null && firstCallbackNode.expirationTime < currentExpirationTime || shouldYieldToHost());
  }

  // The remaining code is essentially a polyfill for requestIdleCallback. It
  // works by scheduling a requestAnimationFrame, storing the time for the start
  // of the frame, then scheduling a postMessage which gets scheduled after paint.
  // Within the postMessage handler do as much work as possible until time + frame
  // rate. By separating the idle call into a separate event tick we ensure that
  // layout, paint and other browser work is counted against the available time.
  // The frame rate is dynamically adjusted.

  // We capture a local reference to any global, in case it gets polyfilled after
  // this module is initially evaluated. We want to be using a
  // consistent implementation.
  var localDate = Date;

  // This initialization code may run even on server environments if a component
  // just imports ReactDOM (e.g. for findDOMNode). Some environments might not
  // have setTimeout or clearTimeout. However, we always expect them to be defined
  // on the client. https://github.com/facebook/react/pull/13088
  var localSetTimeout = typeof setTimeout === 'function' ? setTimeout : undefined;
  var localClearTimeout = typeof clearTimeout === 'function' ? clearTimeout : undefined;

  // We don't expect either of these to necessarily be defined, but we will error
  // later if they are missing on the client.
  var localRequestAnimationFrame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : undefined;
  var localCancelAnimationFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : undefined;

  var getCurrentTime;

  // requestAnimationFrame does not run when the tab is in the background. If
  // we're backgrounded we prefer for that work to happen so that the page
  // continues to load in the background. So we also schedule a 'setTimeout' as
  // a fallback.
  // TODO: Need a better heuristic for backgrounded work.
  var ANIMATION_FRAME_TIMEOUT = 100;
  var rAFID;
  var rAFTimeoutID;
  var requestAnimationFrameWithTimeout = function (callback) {
    // schedule rAF and also a setTimeout
    rAFID = localRequestAnimationFrame(function (timestamp) {
      // cancel the setTimeout
      localClearTimeout(rAFTimeoutID);
      callback(timestamp);
    });
    rAFTimeoutID = localSetTimeout(function () {
      // cancel the requestAnimationFrame
      localCancelAnimationFrame(rAFID);
      callback(getCurrentTime());
    }, ANIMATION_FRAME_TIMEOUT);
  };

  if (hasNativePerformanceNow) {
    var Performance = performance;
    getCurrentTime = function () {
      return Performance.now();
    };
  } else {
    getCurrentTime = function () {
      return localDate.now();
    };
  }

  var requestHostCallback;
  var cancelHostCallback;
  var shouldYieldToHost;

  var globalValue = null;
  if (typeof window !== 'undefined') {
    globalValue = window;
  } else if (typeof global !== 'undefined') {
    globalValue = global;
  }

  if (globalValue && globalValue._schedMock) {
    // Dynamic injection, only for testing purposes.
    var globalImpl = globalValue._schedMock;
    requestHostCallback = globalImpl[0];
    cancelHostCallback = globalImpl[1];
    shouldYieldToHost = globalImpl[2];
    getCurrentTime = globalImpl[3];
  } else if (
  // If Scheduler runs in a non-DOM environment, it falls back to a naive
  // implementation using setTimeout.
  typeof window === 'undefined' ||
  // Check if MessageChannel is supported, too.
  typeof MessageChannel !== 'function') {
    // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
    // fallback to a naive implementation.
    var _callback = null;
    var _flushCallback = function (didTimeout) {
      if (_callback !== null) {
        try {
          _callback(didTimeout);
        } finally {
          _callback = null;
        }
      }
    };
    requestHostCallback = function (cb, ms) {
      if (_callback !== null) {
        // Protect against re-entrancy.
        setTimeout(requestHostCallback, 0, cb);
      } else {
        _callback = cb;
        setTimeout(_flushCallback, 0, false);
      }
    };
    cancelHostCallback = function () {
      _callback = null;
    };
    shouldYieldToHost = function () {
      return false;
    };
  } else {
    if (typeof console !== 'undefined') {
      // TODO: Remove fb.me link
      if (typeof localRequestAnimationFrame !== 'function') {
        console.error("This browser doesn't support requestAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
      }
      if (typeof localCancelAnimationFrame !== 'function') {
        console.error("This browser doesn't support cancelAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
      }
    }

    var scheduledHostCallback = null;
    var isMessageEventScheduled = false;
    var timeoutTime = -1;

    var isAnimationFrameScheduled = false;

    var isFlushingHostCallback = false;

    var frameDeadline = 0;
    // We start out assuming that we run at 30fps but then the heuristic tracking
    // will adjust this value to a faster fps if we get more frequent animation
    // frames.
    var previousFrameTime = 33;
    var activeFrameTime = 33;

    shouldYieldToHost = function () {
      return frameDeadline <= getCurrentTime();
    };

    // We use the postMessage trick to defer idle work until after the repaint.
    var channel = new MessageChannel();
    var port = channel.port2;
    channel.port1.onmessage = function (event) {
      isMessageEventScheduled = false;

      var prevScheduledCallback = scheduledHostCallback;
      var prevTimeoutTime = timeoutTime;
      scheduledHostCallback = null;
      timeoutTime = -1;

      var currentTime = getCurrentTime();

      var didTimeout = false;
      if (frameDeadline - currentTime <= 0) {
        // There's no time left in this idle period. Check if the callback has
        // a timeout and whether it's been exceeded.
        if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
          // Exceeded the timeout. Invoke the callback even though there's no
          // time left.
          didTimeout = true;
        } else {
          // No timeout.
          if (!isAnimationFrameScheduled) {
            // Schedule another animation callback so we retry later.
            isAnimationFrameScheduled = true;
            requestAnimationFrameWithTimeout(animationTick);
          }
          // Exit without invoking the callback.
          scheduledHostCallback = prevScheduledCallback;
          timeoutTime = prevTimeoutTime;
          return;
        }
      }

      if (prevScheduledCallback !== null) {
        isFlushingHostCallback = true;
        try {
          prevScheduledCallback(didTimeout);
        } finally {
          isFlushingHostCallback = false;
        }
      }
    };

    var animationTick = function (rafTime) {
      if (scheduledHostCallback !== null) {
        // Eagerly schedule the next animation callback at the beginning of the
        // frame. If the scheduler queue is not empty at the end of the frame, it
        // will continue flushing inside that callback. If the queue *is* empty,
        // then it will exit immediately. Posting the callback at the start of the
        // frame ensures it's fired within the earliest possible frame. If we
        // waited until the end of the frame to post the callback, we risk the
        // browser skipping a frame and not firing the callback until the frame
        // after that.
        requestAnimationFrameWithTimeout(animationTick);
      } else {
        // No pending work. Exit.
        isAnimationFrameScheduled = false;
        return;
      }

      var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
      if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
        if (nextFrameTime < 8) {
          // Defensive coding. We don't support higher frame rates than 120hz.
          // If the calculated frame time gets lower than 8, it is probably a bug.
          nextFrameTime = 8;
        }
        // If one frame goes long, then the next one can be short to catch up.
        // If two frames are short in a row, then that's an indication that we
        // actually have a higher frame rate than what we're currently optimizing.
        // We adjust our heuristic dynamically accordingly. For example, if we're
        // running on 120hz display or 90hz VR display.
        // Take the max of the two in case one of them was an anomaly due to
        // missed frame deadlines.
        activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
      } else {
        previousFrameTime = nextFrameTime;
      }
      frameDeadline = rafTime + activeFrameTime;
      if (!isMessageEventScheduled) {
        isMessageEventScheduled = true;
        port.postMessage(undefined);
      }
    };

    requestHostCallback = function (callback, absoluteTimeout) {
      scheduledHostCallback = callback;
      timeoutTime = absoluteTimeout;
      if (isFlushingHostCallback || absoluteTimeout < 0) {
        // Don't wait for the next frame. Continue working ASAP, in a new event.
        port.postMessage(undefined);
      } else if (!isAnimationFrameScheduled) {
        // If rAF didn't already schedule one, we need to schedule a frame.
        // TODO: If this rAF doesn't materialize because the browser throttles, we
        // might want to still have setTimeout trigger rIC as a backup to ensure
        // that we keep performing work.
        isAnimationFrameScheduled = true;
        requestAnimationFrameWithTimeout(animationTick);
      }
    };

    cancelHostCallback = function () {
      scheduledHostCallback = null;
      isMessageEventScheduled = false;
      timeoutTime = -1;
    };
  }

  // Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


  // In some cases, StrictMode should also double-render lifecycles.
  // This can be confusing for tests though,
  // And it can be bad for performance in production.
  // This feature flag can be used to control the behavior:


  // To preserve the "Pause on caught exceptions" behavior of the debugger, we
  // replay the begin phase of a failed component inside invokeGuardedCallback.


  // Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:


  // Gather advanced timing metrics for Profiler subtrees.


  // Trace which interactions trigger each commit.
  var enableSchedulerTracing = true;

  // Only used in www builds.
  // TODO: true? Here it might just be false.

  // Only used in www builds.


  // Only used in www builds.


  // React Fire: prevent the value and checked attributes from syncing
  // with their related DOM properties


  // These APIs will no longer be "unstable" in the upcoming 16.7 release,
  // Control this behavior with a flag to support 16.6 minor releases in the meanwhile.
  var enableStableConcurrentModeAPIs = false;

  var DEFAULT_THREAD_ID = 0;

  // Counters used to generate unique IDs.
  var interactionIDCounter = 0;
  var threadIDCounter = 0;

  // Set of currently traced interactions.
  // Interactions "stack"–
  // Meaning that newly traced interactions are appended to the previously active set.
  // When an interaction goes out of scope, the previous set (if any) is restored.
  var interactionsRef = null;

  // Listener(s) to notify when interactions begin and end.
  var subscriberRef = null;

  if (enableSchedulerTracing) {
    interactionsRef = {
      current: new Set()
    };
    subscriberRef = {
      current: null
    };
  }

  function unstable_clear(callback) {
    if (!enableSchedulerTracing) {
      return callback();
    }

    var prevInteractions = interactionsRef.current;
    interactionsRef.current = new Set();

    try {
      return callback();
    } finally {
      interactionsRef.current = prevInteractions;
    }
  }

  function unstable_getCurrent() {
    if (!enableSchedulerTracing) {
      return null;
    } else {
      return interactionsRef.current;
    }
  }

  function unstable_getThreadID() {
    return ++threadIDCounter;
  }

  function unstable_trace(name, timestamp, callback) {
    var threadID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_THREAD_ID;

    if (!enableSchedulerTracing) {
      return callback();
    }

    var interaction = {
      __count: 1,
      id: interactionIDCounter++,
      name: name,
      timestamp: timestamp
    };

    var prevInteractions = interactionsRef.current;

    // Traced interactions should stack/accumulate.
    // To do that, clone the current interactions.
    // The previous set will be restored upon completion.
    var interactions = new Set(prevInteractions);
    interactions.add(interaction);
    interactionsRef.current = interactions;

    var subscriber = subscriberRef.current;
    var returnValue = void 0;

    try {
      if (subscriber !== null) {
        subscriber.onInteractionTraced(interaction);
      }
    } finally {
      try {
        if (subscriber !== null) {
          subscriber.onWorkStarted(interactions, threadID);
        }
      } finally {
        try {
          returnValue = callback();
        } finally {
          interactionsRef.current = prevInteractions;

          try {
            if (subscriber !== null) {
              subscriber.onWorkStopped(interactions, threadID);
            }
          } finally {
            interaction.__count--;

            // If no async work was scheduled for this interaction,
            // Notify subscribers that it's completed.
            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          }
        }
      }
    }

    return returnValue;
  }

  function unstable_wrap(callback) {
    var threadID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_THREAD_ID;

    if (!enableSchedulerTracing) {
      return callback;
    }

    var wrappedInteractions = interactionsRef.current;

    var subscriber = subscriberRef.current;
    if (subscriber !== null) {
      subscriber.onWorkScheduled(wrappedInteractions, threadID);
    }

    // Update the pending async work count for the current interactions.
    // Update after calling subscribers in case of error.
    wrappedInteractions.forEach(function (interaction) {
      interaction.__count++;
    });

    var hasRun = false;

    function wrapped() {
      var prevInteractions = interactionsRef.current;
      interactionsRef.current = wrappedInteractions;

      subscriber = subscriberRef.current;

      try {
        var returnValue = void 0;

        try {
          if (subscriber !== null) {
            subscriber.onWorkStarted(wrappedInteractions, threadID);
          }
        } finally {
          try {
            returnValue = callback.apply(undefined, arguments);
          } finally {
            interactionsRef.current = prevInteractions;

            if (subscriber !== null) {
              subscriber.onWorkStopped(wrappedInteractions, threadID);
            }
          }
        }

        return returnValue;
      } finally {
        if (!hasRun) {
          // We only expect a wrapped function to be executed once,
          // But in the event that it's executed more than once–
          // Only decrement the outstanding interaction counts once.
          hasRun = true;

          // Update pending async counts for all wrapped interactions.
          // If this was the last scheduled async work for any of them,
          // Mark them as completed.
          wrappedInteractions.forEach(function (interaction) {
            interaction.__count--;

            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          });
        }
      }
    }

    wrapped.cancel = function cancel() {
      subscriber = subscriberRef.current;

      try {
        if (subscriber !== null) {
          subscriber.onWorkCanceled(wrappedInteractions, threadID);
        }
      } finally {
        // Update pending async counts for all wrapped interactions.
        // If this was the last scheduled async work for any of them,
        // Mark them as completed.
        wrappedInteractions.forEach(function (interaction) {
          interaction.__count--;

          if (subscriber && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        });
      }
    };

    return wrapped;
  }

  var subscribers = null;
  if (enableSchedulerTracing) {
    subscribers = new Set();
  }

  function unstable_subscribe(subscriber) {
    if (enableSchedulerTracing) {
      subscribers.add(subscriber);

      if (subscribers.size === 1) {
        subscriberRef.current = {
          onInteractionScheduledWorkCompleted: onInteractionScheduledWorkCompleted,
          onInteractionTraced: onInteractionTraced,
          onWorkCanceled: onWorkCanceled,
          onWorkScheduled: onWorkScheduled,
          onWorkStarted: onWorkStarted,
          onWorkStopped: onWorkStopped
        };
      }
    }
  }

  function unstable_unsubscribe(subscriber) {
    if (enableSchedulerTracing) {
      subscribers.delete(subscriber);

      if (subscribers.size === 0) {
        subscriberRef.current = null;
      }
    }
  }

  function onInteractionTraced(interaction) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onInteractionTraced(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onInteractionScheduledWorkCompleted(interaction) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onInteractionScheduledWorkCompleted(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkScheduled(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkScheduled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkStarted(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkStarted(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkStopped(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkStopped(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkCanceled(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkCanceled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  /**
   * Keeps track of the current dispatcher.
   */
  var ReactCurrentDispatcher = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  /**
   * Keeps track of the current owner.
   *
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */
  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

  var describeComponentFrame = function (name, source, ownerName) {
    var sourceInfo = '';
    if (source) {
      var path = source.fileName;
      var fileName = path.replace(BEFORE_SLASH_RE, '');
      {
        // In DEV, include code for a common special case:
        // prefer "folder/index.js" instead of just "index.js".
        if (/^index\./.test(fileName)) {
          var match = path.match(BEFORE_SLASH_RE);
          if (match) {
            var pathBeforeSlash = match[1];
            if (pathBeforeSlash) {
              var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
              fileName = folderName + '/' + fileName;
            }
          }
        }
      }
      sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
    } else if (ownerName) {
      sourceInfo = ' (created by ' + ownerName + ')';
    }
    return '\n    in ' + (name || 'Unknown') + sourceInfo;
  };

  var Resolved = 1;

  function refineResolvedLazyComponent(lazyComponent) {
    return lazyComponent._status === Resolved ? lazyComponent._result : null;
  }

  function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || '';
    return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
  }

  function getComponentName(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }
    {
      if (typeof type.tag === 'number') {
        warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }
    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }
    if (typeof type === 'string') {
      return type;
    }
    switch (type) {
      case REACT_CONCURRENT_MODE_TYPE:
        return 'ConcurrentMode';
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';
      case REACT_PORTAL_TYPE:
        return 'Portal';
      case REACT_PROFILER_TYPE:
        return 'Profiler';
      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';
      case REACT_SUSPENSE_TYPE:
        return 'Suspense';
    }
    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          return 'Context.Consumer';
        case REACT_PROVIDER_TYPE:
          return 'Context.Provider';
        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');
        case REACT_MEMO_TYPE:
          return getComponentName(type.type);
        case REACT_LAZY_TYPE:
          {
            var thenable = type;
            var resolvedThenable = refineResolvedLazyComponent(thenable);
            if (resolvedThenable) {
              return getComponentName(resolvedThenable);
            }
          }
      }
    }
    return null;
  }

  var ReactDebugCurrentFrame = {};

  var currentlyValidatingElement = null;

  function setCurrentlyValidatingElement(element) {
    {
      currentlyValidatingElement = element;
    }
  }

  {
    // Stack implementation injected by the current renderer.
    ReactDebugCurrentFrame.getCurrentStack = null;

    ReactDebugCurrentFrame.getStackAddendum = function () {
      var stack = '';

      // Add an extra top frame while an element is being validated
      if (currentlyValidatingElement) {
        var name = getComponentName(currentlyValidatingElement.type);
        var owner = currentlyValidatingElement._owner;
        stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
      }

      // Delegate to the injected renderer-specific implementation
      var impl = ReactDebugCurrentFrame.getCurrentStack;
      if (impl) {
        stack += impl() || '';
      }

      return stack;
    };
  }

  var ReactSharedInternals = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentOwner: ReactCurrentOwner,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: objectAssign
  };

  {
    // Re-export the schedule API(s) for UMD bundles.
    // This avoids introducing a dependency on a new UMD global in a minor update,
    // Since that would be a breaking change (e.g. for all existing CodeSandboxes).
    // This re-export is only required for UMD bundles;
    // CJS bundles use the shared NPM package.
    objectAssign(ReactSharedInternals, {
      Scheduler: {
        unstable_cancelCallback: unstable_cancelCallback,
        unstable_shouldYield: unstable_shouldYield,
        unstable_now: getCurrentTime,
        unstable_scheduleCallback: unstable_scheduleCallback,
        unstable_runWithPriority: unstable_runWithPriority,
        unstable_next: unstable_next,
        unstable_wrapCallback: unstable_wrapCallback,
        unstable_getFirstCallbackNode: unstable_getFirstCallbackNode,
        unstable_pauseExecution: unstable_pauseExecution,
        unstable_continueExecution: unstable_continueExecution,
        unstable_getCurrentPriorityLevel: unstable_getCurrentPriorityLevel,
        unstable_IdlePriority: IdlePriority,
        unstable_ImmediatePriority: ImmediatePriority,
        unstable_LowPriority: LowPriority,
        unstable_NormalPriority: NormalPriority,
        unstable_UserBlockingPriority: UserBlockingPriority
      },
      SchedulerTracing: {
        __interactionsRef: interactionsRef,
        __subscriberRef: subscriberRef,
        unstable_clear: unstable_clear,
        unstable_getCurrent: unstable_getCurrent,
        unstable_getThreadID: unstable_getThreadID,
        unstable_subscribe: unstable_subscribe,
        unstable_trace: unstable_trace,
        unstable_unsubscribe: unstable_unsubscribe,
        unstable_wrap: unstable_wrap
      }
    });
  }

  {
    objectAssign(ReactSharedInternals, {
      // These should not be included in production.
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {}
    });
  }

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warning = warningWithoutStack$1;

  {
    warning = function (condition, format) {
      if (condition) {
        return;
      }
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();
      // eslint-disable-next-line react-internal/warning-and-invariant-args

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
    };
  }

  var warning$1 = warning;

  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };

  var specialPropKeyWarningShown = void 0;
  var specialPropRefWarningShown = void 0;

  function hasValidRef(config) {
    {
      if (hasOwnProperty$1.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    {
      if (hasOwnProperty$1.call(config, 'key')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }

  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }

  /**
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, no instanceof check
   * will work. Instead test $$typeof field against Symbol.for('react.element') to check
   * if something is a React Element.
   *
   * @param {*} type
   * @param {*} key
   * @param {string|object} ref
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @param {*} owner
   * @param {*} props
   * @internal
   */
  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,

      // Record the component responsible for creating this element.
      _owner: owner
    };

    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {};

      // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element;
  };

  /**
   * Create and return a new ReactElement of the given type.
   * See https://reactjs.org/docs/react-api.html#createelement
   */
  function createElement(type, config, children) {
    var propName = void 0;

    // Reserved names are extracted
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source;
      // Remaining properties are added to a new props object
      for (propName in config) {
        if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }
      props.children = childArray;
    }

    // Resolve default props
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    {
      if (key || ref) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }

  /**
   * Return a function that produces ReactElements of a given type.
   * See https://reactjs.org/docs/react-api.html#createfactory
   */

  function cloneAndReplaceKey(oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

    return newElement;
  }

  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://reactjs.org/docs/react-api.html#cloneelement
   */
  function cloneElement(element, config, children) {
    !!(element === null || element === undefined) ? invariant(false, 'React.cloneElement(...): The argument must be a React element, but you passed %s.', element) : void 0;

    var propName = void 0;

    // Original props are copied
    var props = objectAssign({}, element.props);

    // Reserved names are extracted
    var key = element.key;
    var ref = element.ref;
    // Self is preserved since the owner is preserved.
    var self = element._self;
    // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.
    var source = element._source;

    // Owner will be preserved, unless ref is overridden
    var owner = element._owner;

    if (config != null) {
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      // Remaining properties override existing props
      var defaultProps = void 0;
      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }
      for (propName in config) {
        if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  }

  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */
  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }

  var SEPARATOR = '.';
  var SUBSEPARATOR = ':';

  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */
  function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedString = ('' + key).replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });

    return '$' + escapedString;
  }

  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */

  var didWarnAboutMaps = false;

  var userProvidedKeyEscapeRegex = /\/+/g;
  function escapeUserProvidedKey(text) {
    return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
  }

  var POOL_SIZE = 10;
  var traverseContextPool = [];
  function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
    if (traverseContextPool.length) {
      var traverseContext = traverseContextPool.pop();
      traverseContext.result = mapResult;
      traverseContext.keyPrefix = keyPrefix;
      traverseContext.func = mapFunction;
      traverseContext.context = mapContext;
      traverseContext.count = 0;
      return traverseContext;
    } else {
      return {
        result: mapResult,
        keyPrefix: keyPrefix,
        func: mapFunction,
        context: mapContext,
        count: 0
      };
    }
  }

  function releaseTraverseContext(traverseContext) {
    traverseContext.result = null;
    traverseContext.keyPrefix = null;
    traverseContext.func = null;
    traverseContext.context = null;
    traverseContext.count = 0;
    if (traverseContextPool.length < POOL_SIZE) {
      traverseContextPool.push(traverseContext);
    }
  }

  /**
   * @param {?*} children Children tree container.
   * @param {!string} nameSoFar Name of the key path so far.
   * @param {!function} callback Callback to invoke with each child found.
   * @param {?*} traverseContext Used to pass information throughout the traversal
   * process.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // All of the above are perceived as null.
      children = null;
    }

    var invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case 'string':
        case 'number':
          invokeCallback = true;
          break;
        case 'object':
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }
      }
    }

    if (invokeCallback) {
      callback(traverseContext, children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
      return 1;
    }

    var child = void 0;
    var nextName = void 0;
    var subtreeCount = 0; // Count of children found in the current subtree.
    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else {
      var iteratorFn = getIteratorFn(children);
      if (typeof iteratorFn === 'function') {
        {
          // Warn about using Maps as children
          if (iteratorFn === children.entries) {
            !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
            didWarnAboutMaps = true;
          }
        }

        var iterator = iteratorFn.call(children);
        var step = void 0;
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else if (type === 'object') {
        var addendum = '';
        {
          addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
        }
        var childrenString = '' + children;
        invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
      }
    }

    return subtreeCount;
  }

  /**
   * Traverses children that are typically specified as `props.children`, but
   * might also be specified through attributes:
   *
   * - `traverseAllChildren(this.props.children, ...)`
   * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
   *
   * The `traverseContext` is an optional argument that is passed through the
   * entire traversal. It can be used to store accumulations or anything else that
   * the callback might find relevant.
   *
   * @param {?*} children Children tree object.
   * @param {!function} callback To invoke upon traversing each child.
   * @param {?*} traverseContext Context for traversal.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }

    return traverseAllChildrenImpl(children, '', callback, traverseContext);
  }

  /**
   * Generate a key string that identifies a component within a set.
   *
   * @param {*} component A component that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */
  function getComponentKey(component, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (typeof component === 'object' && component !== null && component.key != null) {
      // Explicit key
      return escape(component.key);
    }
    // Implicit key determined by the index in the set
    return index.toString(36);
  }

  function forEachSingleChild(bookKeeping, child, name) {
    var func = bookKeeping.func,
        context = bookKeeping.context;

    func.call(context, child, bookKeeping.count++);
  }

  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */
  function forEachChildren(children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }
    var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  function mapSingleChildIntoContext(bookKeeping, child, childKey) {
    var result = bookKeeping.result,
        keyPrefix = bookKeeping.keyPrefix,
        func = bookKeeping.func,
        context = bookKeeping.context;

    var mappedChild = func.call(context, child, bookKeeping.count++);
    if (Array.isArray(mappedChild)) {
      mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        mappedChild = cloneAndReplaceKey(mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
      }
      result.push(mappedChild);
    }
  }

  function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
    var escapedPrefix = '';
    if (prefix != null) {
      escapedPrefix = escapeUserProvidedKey(prefix) + '/';
    }
    var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * The provided mapFunction(child, key, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, func, context);
    return result;
  }

  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */
  function countChildren(children) {
    return traverseAllChildren(children, function () {
      return null;
    }, null);
  }

  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */
  function toArray(children) {
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
      return child;
    });
    return result;
  }

  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */
  function onlyChild(children) {
    !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
    return children;
  }

  function createContext(defaultValue, calculateChangedBits) {
    if (calculateChangedBits === undefined) {
      calculateChangedBits = null;
    } else {
      {
        !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
      }
    }

    var context = {
      $$typeof: REACT_CONTEXT_TYPE,
      _calculateChangedBits: calculateChangedBits,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null
    };

    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context
    };

    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;

    {
      // A separate object, but proxies back to the original context object for
      // backwards compatibility. It has a different $$typeof, so we can properly
      // warn for the incorrect usage of Context as a Consumer.
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
        _calculateChangedBits: context._calculateChangedBits
      };
      // $FlowFixMe: Flow complains about not setting a value, which is intentional here
      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;
              warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
            }
            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          }
        },
        _currentValue: {
          get: function () {
            return context._currentValue;
          },
          set: function (_currentValue) {
            context._currentValue = _currentValue;
          }
        },
        _currentValue2: {
          get: function () {
            return context._currentValue2;
          },
          set: function (_currentValue2) {
            context._currentValue2 = _currentValue2;
          }
        },
        _threadCount: {
          get: function () {
            return context._threadCount;
          },
          set: function (_threadCount) {
            context._threadCount = _threadCount;
          }
        },
        Consumer: {
          get: function () {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;
              warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
            }
            return context.Consumer;
          }
        }
      });
      // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
      context.Consumer = Consumer;
    }

    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }

    return context;
  }

  function lazy(ctor) {
    var lazyType = {
      $$typeof: REACT_LAZY_TYPE,
      _ctor: ctor,
      // React uses these fields to store the result.
      _status: -1,
      _result: null
    };

    {
      // In production, this would just set it on the object.
      var defaultProps = void 0;
      var propTypes = void 0;
      Object.defineProperties(lazyType, {
        defaultProps: {
          configurable: true,
          get: function () {
            return defaultProps;
          },
          set: function (newDefaultProps) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            defaultProps = newDefaultProps;
            // Match production behavior more closely:
            Object.defineProperty(lazyType, 'defaultProps', {
              enumerable: true
            });
          }
        },
        propTypes: {
          configurable: true,
          get: function () {
            return propTypes;
          },
          set: function (newPropTypes) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            propTypes = newPropTypes;
            // Match production behavior more closely:
            Object.defineProperty(lazyType, 'propTypes', {
              enumerable: true
            });
          }
        }
      });
    }

    return lazyType;
  }

  function forwardRef(render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
      } else if (typeof render !== 'function') {
        warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        !(
        // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
        render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
      }

      if (render != null) {
        !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
      }
    }

    return {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render: render
    };
  }

  function isValidElementType(type) {
    return typeof type === 'string' || typeof type === 'function' ||
    // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
  }

  function memo(type, compare) {
    {
      if (!isValidElementType(type)) {
        warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }
    return {
      $$typeof: REACT_MEMO_TYPE,
      type: type,
      compare: compare === undefined ? null : compare
    };
  }

  function resolveDispatcher() {
    var dispatcher = ReactCurrentDispatcher.current;
    !(dispatcher !== null) ? invariant(false, 'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.') : void 0;
    return dispatcher;
  }

  function useContext(Context, unstable_observedBits) {
    var dispatcher = resolveDispatcher();
    {
      !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0;

      // TODO: add a more generic warning for invalid values.
      if (Context._context !== undefined) {
        var realContext = Context._context;
        // Don't deduplicate because this legitimately causes bugs
        // and nobody should be using this in existing code.
        if (realContext.Consumer === Context) {
          warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
        } else if (realContext.Provider === Context) {
          warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
        }
      }
    }
    return dispatcher.useContext(Context, unstable_observedBits);
  }

  function useState(initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }

  function useReducer(reducer, initialArg, init) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }

  function useRef(initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }

  function useEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, inputs);
  }

  function useLayoutEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, inputs);
  }

  function useCallback(callback, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, inputs);
  }

  function useMemo(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, inputs);
  }

  function useImperativeHandle(ref, create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, inputs);
  }

  function useDebugValue(value, formatterFn) {
    {
      var dispatcher = resolveDispatcher();
      return dispatcher.useDebugValue(value, formatterFn);
    }
  }

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var printWarning$1 = function () {};

  {
    var ReactPropTypesSecret = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};

    printWarning$1 = function (text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    {
      for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.');
              err.name = 'Invariant Violation';
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning$1((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : '';

            printWarning$1('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
          }
        }
      }
    }
  }

  var checkPropTypes_1 = checkPropTypes;

  /**
   * ReactElementValidator provides a wrapper around a element factory
   * which validates the props passed to the element. This is intended to be
   * used only in DEV and could be replaced by a static type checker for languages
   * that support it.
   */

  var propTypesMisspellWarningShown = void 0;

  {
    propTypesMisspellWarningShown = false;
  }

  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = getComponentName(ReactCurrentOwner.current.type);
      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }
    return '';
  }

  function getSourceInfoErrorAddendum(elementProps) {
    if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
      var source = elementProps.__source;
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }
    return '';
  }

  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */
  var ownerHasKeyUseWarning = {};

  function getCurrentComponentErrorInfo(parentType) {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
      if (parentName) {
        info = '\n\nCheck the top-level render call using <' + parentName + '>.';
      }
    }
    return info;
  }

  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */
  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }
    element._store.validated = true;

    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }
    ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

    // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.
    var childOwner = '';
    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      // Give the component that originally created this child.
      childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
    }

    setCurrentlyValidatingElement(element);
    {
      warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
    }
    setCurrentlyValidatingElement(null);
  }

  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */
  function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
      return;
    }
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];
        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);
      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step = void 0;
          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }

  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */
  function validatePropTypes(element) {
    var type = element.type;
    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }
    var name = getComponentName(type);
    var propTypes = void 0;
    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
    // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }
    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes_1(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;
      warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
    }
    if (typeof type.getDefaultProps === 'function') {
      !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
    }
  }

  /**
   * Given a fragment, validate that it can only be provided with fragment props
   * @param {ReactElement} fragment
   */
  function validateFragmentProps(fragment) {
    setCurrentlyValidatingElement(fragment);

    var keys = Object.keys(fragment.props);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key !== 'children' && key !== 'key') {
        warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
        break;
      }
    }

    if (fragment.ref !== null) {
      warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
    }

    setCurrentlyValidatingElement(null);
  }

  function createElementWithValidation(type, props, children) {
    var validType = isValidElementType(type);

    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      var info = '';
      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(props);
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString = void 0;
      if (type === null) {
        typeString = 'null';
      } else if (Array.isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }

  function createFactoryWithValidation(type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type;
    // Legacy hook: remove it
    {
      Object.defineProperty(validatedFactory, 'type', {
        enumerable: false,
        get: function () {
          lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
          Object.defineProperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }

    return validatedFactory;
  }

  function cloneElementWithValidation(element, props, children) {
    var newElement = cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

  var React = {
    Children: {
      map: mapChildren,
      forEach: forEachChildren,
      count: countChildren,
      toArray: toArray,
      only: onlyChild
    },

    createRef: createRef,
    Component: Component,
    PureComponent: PureComponent,

    createContext: createContext,
    forwardRef: forwardRef,
    lazy: lazy,
    memo: memo,

    useCallback: useCallback,
    useContext: useContext,
    useEffect: useEffect,
    useImperativeHandle: useImperativeHandle,
    useDebugValue: useDebugValue,
    useLayoutEffect: useLayoutEffect,
    useMemo: useMemo,
    useReducer: useReducer,
    useRef: useRef,
    useState: useState,

    Fragment: REACT_FRAGMENT_TYPE,
    StrictMode: REACT_STRICT_MODE_TYPE,
    Suspense: REACT_SUSPENSE_TYPE,

    createElement: createElementWithValidation,
    cloneElement: cloneElementWithValidation,
    createFactory: createFactoryWithValidation,
    isValidElement: isValidElement,

    version: ReactVersion,

    unstable_ConcurrentMode: REACT_CONCURRENT_MODE_TYPE,
    unstable_Profiler: REACT_PROFILER_TYPE,

    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
  };

  // Note: some APIs are added with feature flags.
  // Make sure that stable builds for open source
  // don't modify the React object to avoid deopts.
  // Also let's not expose their names in stable builds.

  if (enableStableConcurrentModeAPIs) {
    React.ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    React.Profiler = REACT_PROFILER_TYPE;
    React.unstable_ConcurrentMode = undefined;
    React.unstable_Profiler = undefined;
  }

  var React$2 = Object.freeze({
    default: React
  });

  var React$3 = React$2 && React || React$2;

  // TODO: decide on the top-level export form.
  // This is hacky but makes it work with both Rollup and Jest.
  var react = React$3.default || React$3;

  return react;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9kaXN0L3JlYWN0LmRldmVsb3BtZW50LmpzIl0sIm5hbWVzIjpbImdsb2JhbCIsImZhY3RvcnkiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmaW5lIiwiYW1kIiwiUmVhY3QiLCJSZWFjdFZlcnNpb24iLCJoYXNTeW1ib2wiLCJTeW1ib2wiLCJmb3IiLCJSRUFDVF9FTEVNRU5UX1RZUEUiLCJSRUFDVF9QT1JUQUxfVFlQRSIsIlJFQUNUX0ZSQUdNRU5UX1RZUEUiLCJSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIiwiUkVBQ1RfUFJPRklMRVJfVFlQRSIsIlJFQUNUX1BST1ZJREVSX1RZUEUiLCJSRUFDVF9DT05URVhUX1RZUEUiLCJSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSIsIlJFQUNUX0ZPUldBUkRfUkVGX1RZUEUiLCJSRUFDVF9TVVNQRU5TRV9UWVBFIiwiUkVBQ1RfTUVNT19UWVBFIiwiUkVBQ1RfTEFaWV9UWVBFIiwiTUFZQkVfSVRFUkFUT1JfU1lNQk9MIiwiaXRlcmF0b3IiLCJGQVVYX0lURVJBVE9SX1NZTUJPTCIsImdldEl0ZXJhdG9yRm4iLCJtYXliZUl0ZXJhYmxlIiwibWF5YmVJdGVyYXRvciIsImdldE93blByb3BlcnR5U3ltYm9scyIsIk9iamVjdCIsImhhc093blByb3BlcnR5IiwicHJvdG90eXBlIiwicHJvcElzRW51bWVyYWJsZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwidG9PYmplY3QiLCJ2YWwiLCJ1bmRlZmluZWQiLCJUeXBlRXJyb3IiLCJzaG91bGRVc2VOYXRpdmUiLCJhc3NpZ24iLCJ0ZXN0MSIsIlN0cmluZyIsImdldE93blByb3BlcnR5TmFtZXMiLCJ0ZXN0MiIsImkiLCJmcm9tQ2hhckNvZGUiLCJvcmRlcjIiLCJtYXAiLCJuIiwiam9pbiIsInRlc3QzIiwic3BsaXQiLCJmb3JFYWNoIiwibGV0dGVyIiwia2V5cyIsImVyciIsIm9iamVjdEFzc2lnbiIsInRhcmdldCIsInNvdXJjZSIsImZyb20iLCJ0byIsInN5bWJvbHMiLCJzIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwia2V5IiwiY2FsbCIsInZhbGlkYXRlRm9ybWF0IiwiZm9ybWF0IiwiRXJyb3IiLCJpbnZhcmlhbnQiLCJjb25kaXRpb24iLCJhIiwiYiIsImMiLCJkIiwiZSIsImYiLCJlcnJvciIsImFyZ3MiLCJhcmdJbmRleCIsInJlcGxhY2UiLCJuYW1lIiwiZnJhbWVzVG9Qb3AiLCJsb3dQcmlvcml0eVdhcm5pbmciLCJwcmludFdhcm5pbmciLCJfbGVuIiwiQXJyYXkiLCJfa2V5IiwibWVzc2FnZSIsImNvbnNvbGUiLCJ3YXJuIiwieCIsIl9sZW4yIiwiX2tleTIiLCJhcHBseSIsImNvbmNhdCIsImxvd1ByaW9yaXR5V2FybmluZyQxIiwid2FybmluZ1dpdGhvdXRTdGFjayIsImFyZ3NXaXRoRm9ybWF0IiwiaXRlbSIsInVuc2hpZnQiLCJGdW5jdGlvbiIsIndhcm5pbmdXaXRob3V0U3RhY2skMSIsImRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudCIsIndhcm5Ob29wIiwicHVibGljSW5zdGFuY2UiLCJjYWxsZXJOYW1lIiwiX2NvbnN0cnVjdG9yIiwiY29uc3RydWN0b3IiLCJjb21wb25lbnROYW1lIiwiZGlzcGxheU5hbWUiLCJ3YXJuaW5nS2V5IiwiUmVhY3ROb29wVXBkYXRlUXVldWUiLCJpc01vdW50ZWQiLCJlbnF1ZXVlRm9yY2VVcGRhdGUiLCJjYWxsYmFjayIsImVucXVldWVSZXBsYWNlU3RhdGUiLCJjb21wbGV0ZVN0YXRlIiwiZW5xdWV1ZVNldFN0YXRlIiwicGFydGlhbFN0YXRlIiwiZW1wdHlPYmplY3QiLCJmcmVlemUiLCJDb21wb25lbnQiLCJwcm9wcyIsImNvbnRleHQiLCJ1cGRhdGVyIiwicmVmcyIsImlzUmVhY3RDb21wb25lbnQiLCJzZXRTdGF0ZSIsImZvcmNlVXBkYXRlIiwiZGVwcmVjYXRlZEFQSXMiLCJyZXBsYWNlU3RhdGUiLCJkZWZpbmVEZXByZWNhdGlvbldhcm5pbmciLCJtZXRob2ROYW1lIiwiaW5mbyIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiZm5OYW1lIiwiQ29tcG9uZW50RHVtbXkiLCJQdXJlQ29tcG9uZW50IiwicHVyZUNvbXBvbmVudFByb3RvdHlwZSIsImlzUHVyZVJlYWN0Q29tcG9uZW50IiwiY3JlYXRlUmVmIiwicmVmT2JqZWN0IiwiY3VycmVudCIsInNlYWwiLCJlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmciLCJJbW1lZGlhdGVQcmlvcml0eSIsIlVzZXJCbG9ja2luZ1ByaW9yaXR5IiwiTm9ybWFsUHJpb3JpdHkiLCJMb3dQcmlvcml0eSIsIklkbGVQcmlvcml0eSIsIm1heFNpZ25lZDMxQml0SW50IiwiSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQiLCJVU0VSX0JMT0NLSU5HX1BSSU9SSVRZIiwiTk9STUFMX1BSSU9SSVRZX1RJTUVPVVQiLCJMT1dfUFJJT1JJVFlfVElNRU9VVCIsIklETEVfUFJJT1JJVFkiLCJmaXJzdENhbGxiYWNrTm9kZSIsImN1cnJlbnREaWRUaW1lb3V0IiwiaXNTY2hlZHVsZXJQYXVzZWQiLCJjdXJyZW50UHJpb3JpdHlMZXZlbCIsImN1cnJlbnRFdmVudFN0YXJ0VGltZSIsImN1cnJlbnRFeHBpcmF0aW9uVGltZSIsImlzRXhlY3V0aW5nQ2FsbGJhY2siLCJpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCIsImhhc05hdGl2ZVBlcmZvcm1hbmNlTm93IiwicGVyZm9ybWFuY2UiLCJub3ciLCJlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCIsImV4cGlyYXRpb25UaW1lIiwiY2FuY2VsSG9zdENhbGxiYWNrIiwicmVxdWVzdEhvc3RDYWxsYmFjayIsImZsdXNoV29yayIsImZsdXNoRmlyc3RDYWxsYmFjayIsImZsdXNoZWROb2RlIiwibmV4dCIsImxhc3RDYWxsYmFja05vZGUiLCJwcmV2aW91cyIsInByaW9yaXR5TGV2ZWwiLCJwcmV2aW91c1ByaW9yaXR5TGV2ZWwiLCJwcmV2aW91c0V4cGlyYXRpb25UaW1lIiwiY29udGludWF0aW9uQ2FsbGJhY2siLCJjb250aW51YXRpb25Ob2RlIiwibmV4dEFmdGVyQ29udGludWF0aW9uIiwibm9kZSIsImZsdXNoSW1tZWRpYXRlV29yayIsImRpZFRpbWVvdXQiLCJwcmV2aW91c0RpZFRpbWVvdXQiLCJjdXJyZW50VGltZSIsImdldEN1cnJlbnRUaW1lIiwic2hvdWxkWWllbGRUb0hvc3QiLCJ1bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHkiLCJldmVudEhhbmRsZXIiLCJwcmV2aW91c0V2ZW50U3RhcnRUaW1lIiwidW5zdGFibGVfbmV4dCIsInVuc3RhYmxlX3dyYXBDYWxsYmFjayIsInBhcmVudFByaW9yaXR5TGV2ZWwiLCJ1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrIiwiZGVwcmVjYXRlZF9vcHRpb25zIiwic3RhcnRUaW1lIiwidGltZW91dCIsIm5ld05vZGUiLCJ1bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbiIsInVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uIiwidW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGUiLCJ1bnN0YWJsZV9jYW5jZWxDYWxsYmFjayIsImNhbGxiYWNrTm9kZSIsInVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsIiwidW5zdGFibGVfc2hvdWxkWWllbGQiLCJsb2NhbERhdGUiLCJEYXRlIiwibG9jYWxTZXRUaW1lb3V0Iiwic2V0VGltZW91dCIsImxvY2FsQ2xlYXJUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwibG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJsb2NhbENhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJBTklNQVRJT05fRlJBTUVfVElNRU9VVCIsInJBRklEIiwickFGVGltZW91dElEIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lV2l0aFRpbWVvdXQiLCJ0aW1lc3RhbXAiLCJQZXJmb3JtYW5jZSIsImdsb2JhbFZhbHVlIiwid2luZG93IiwiX3NjaGVkTW9jayIsImdsb2JhbEltcGwiLCJNZXNzYWdlQ2hhbm5lbCIsIl9jYWxsYmFjayIsIl9mbHVzaENhbGxiYWNrIiwiY2IiLCJtcyIsInNjaGVkdWxlZEhvc3RDYWxsYmFjayIsImlzTWVzc2FnZUV2ZW50U2NoZWR1bGVkIiwidGltZW91dFRpbWUiLCJpc0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVkIiwiaXNGbHVzaGluZ0hvc3RDYWxsYmFjayIsImZyYW1lRGVhZGxpbmUiLCJwcmV2aW91c0ZyYW1lVGltZSIsImFjdGl2ZUZyYW1lVGltZSIsImNoYW5uZWwiLCJwb3J0IiwicG9ydDIiLCJwb3J0MSIsIm9ubWVzc2FnZSIsImV2ZW50IiwicHJldlNjaGVkdWxlZENhbGxiYWNrIiwicHJldlRpbWVvdXRUaW1lIiwiYW5pbWF0aW9uVGljayIsInJhZlRpbWUiLCJuZXh0RnJhbWVUaW1lIiwicG9zdE1lc3NhZ2UiLCJhYnNvbHV0ZVRpbWVvdXQiLCJlbmFibGVTY2hlZHVsZXJUcmFjaW5nIiwiZW5hYmxlU3RhYmxlQ29uY3VycmVudE1vZGVBUElzIiwiREVGQVVMVF9USFJFQURfSUQiLCJpbnRlcmFjdGlvbklEQ291bnRlciIsInRocmVhZElEQ291bnRlciIsImludGVyYWN0aW9uc1JlZiIsInN1YnNjcmliZXJSZWYiLCJTZXQiLCJ1bnN0YWJsZV9jbGVhciIsInByZXZJbnRlcmFjdGlvbnMiLCJ1bnN0YWJsZV9nZXRDdXJyZW50IiwidW5zdGFibGVfZ2V0VGhyZWFkSUQiLCJ1bnN0YWJsZV90cmFjZSIsInRocmVhZElEIiwiaW50ZXJhY3Rpb24iLCJfX2NvdW50IiwiaWQiLCJpbnRlcmFjdGlvbnMiLCJhZGQiLCJzdWJzY3JpYmVyIiwicmV0dXJuVmFsdWUiLCJvbkludGVyYWN0aW9uVHJhY2VkIiwib25Xb3JrU3RhcnRlZCIsIm9uV29ya1N0b3BwZWQiLCJvbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZCIsInVuc3RhYmxlX3dyYXAiLCJ3cmFwcGVkSW50ZXJhY3Rpb25zIiwib25Xb3JrU2NoZWR1bGVkIiwiaGFzUnVuIiwid3JhcHBlZCIsImNhbmNlbCIsIm9uV29ya0NhbmNlbGVkIiwic3Vic2NyaWJlcnMiLCJ1bnN0YWJsZV9zdWJzY3JpYmUiLCJzaXplIiwidW5zdGFibGVfdW5zdWJzY3JpYmUiLCJkZWxldGUiLCJkaWRDYXRjaEVycm9yIiwiY2F1Z2h0RXJyb3IiLCJSZWFjdEN1cnJlbnREaXNwYXRjaGVyIiwiUmVhY3RDdXJyZW50T3duZXIiLCJCRUZPUkVfU0xBU0hfUkUiLCJkZXNjcmliZUNvbXBvbmVudEZyYW1lIiwib3duZXJOYW1lIiwic291cmNlSW5mbyIsInBhdGgiLCJmaWxlTmFtZSIsInRlc3QiLCJtYXRjaCIsInBhdGhCZWZvcmVTbGFzaCIsImZvbGRlck5hbWUiLCJsaW5lTnVtYmVyIiwiUmVzb2x2ZWQiLCJyZWZpbmVSZXNvbHZlZExhenlDb21wb25lbnQiLCJsYXp5Q29tcG9uZW50IiwiX3N0YXR1cyIsIl9yZXN1bHQiLCJnZXRXcmFwcGVkTmFtZSIsIm91dGVyVHlwZSIsImlubmVyVHlwZSIsIndyYXBwZXJOYW1lIiwiZnVuY3Rpb25OYW1lIiwiZ2V0Q29tcG9uZW50TmFtZSIsInR5cGUiLCJ0YWciLCIkJHR5cGVvZiIsInJlbmRlciIsInRoZW5hYmxlIiwicmVzb2x2ZWRUaGVuYWJsZSIsIlJlYWN0RGVidWdDdXJyZW50RnJhbWUiLCJjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCIsInNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50IiwiZWxlbWVudCIsImdldEN1cnJlbnRTdGFjayIsImdldFN0YWNrQWRkZW5kdW0iLCJzdGFjayIsIm93bmVyIiwiX293bmVyIiwiX3NvdXJjZSIsImltcGwiLCJSZWFjdFNoYXJlZEludGVybmFscyIsIlNjaGVkdWxlciIsInVuc3RhYmxlX25vdyIsInVuc3RhYmxlX0lkbGVQcmlvcml0eSIsInVuc3RhYmxlX0ltbWVkaWF0ZVByaW9yaXR5IiwidW5zdGFibGVfTG93UHJpb3JpdHkiLCJ1bnN0YWJsZV9Ob3JtYWxQcmlvcml0eSIsInVuc3RhYmxlX1VzZXJCbG9ja2luZ1ByaW9yaXR5IiwiU2NoZWR1bGVyVHJhY2luZyIsIl9faW50ZXJhY3Rpb25zUmVmIiwiX19zdWJzY3JpYmVyUmVmIiwiUmVhY3RDb21wb25lbnRUcmVlSG9vayIsIndhcm5pbmciLCJ3YXJuaW5nJDEiLCJoYXNPd25Qcm9wZXJ0eSQxIiwiUkVTRVJWRURfUFJPUFMiLCJyZWYiLCJfX3NlbGYiLCJfX3NvdXJjZSIsInNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duIiwic3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24iLCJoYXNWYWxpZFJlZiIsImNvbmZpZyIsImdldHRlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImlzUmVhY3RXYXJuaW5nIiwiaGFzVmFsaWRLZXkiLCJkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlciIsIndhcm5BYm91dEFjY2Vzc2luZ0tleSIsImNvbmZpZ3VyYWJsZSIsImRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyIiwid2FybkFib3V0QWNjZXNzaW5nUmVmIiwiUmVhY3RFbGVtZW50Iiwic2VsZiIsIl9zdG9yZSIsImVudW1lcmFibGUiLCJ3cml0YWJsZSIsInZhbHVlIiwiY3JlYXRlRWxlbWVudCIsImNoaWxkcmVuIiwicHJvcE5hbWUiLCJjaGlsZHJlbkxlbmd0aCIsImNoaWxkQXJyYXkiLCJkZWZhdWx0UHJvcHMiLCJjbG9uZUFuZFJlcGxhY2VLZXkiLCJvbGRFbGVtZW50IiwibmV3S2V5IiwibmV3RWxlbWVudCIsIl9zZWxmIiwiY2xvbmVFbGVtZW50IiwiaXNWYWxpZEVsZW1lbnQiLCJvYmplY3QiLCJTRVBBUkFUT1IiLCJTVUJTRVBBUkFUT1IiLCJlc2NhcGUiLCJlc2NhcGVSZWdleCIsImVzY2FwZXJMb29rdXAiLCJlc2NhcGVkU3RyaW5nIiwiZGlkV2FybkFib3V0TWFwcyIsInVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4IiwiZXNjYXBlVXNlclByb3ZpZGVkS2V5IiwidGV4dCIsIlBPT0xfU0laRSIsInRyYXZlcnNlQ29udGV4dFBvb2wiLCJnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQiLCJtYXBSZXN1bHQiLCJrZXlQcmVmaXgiLCJtYXBGdW5jdGlvbiIsIm1hcENvbnRleHQiLCJ0cmF2ZXJzZUNvbnRleHQiLCJwb3AiLCJyZXN1bHQiLCJmdW5jIiwiY291bnQiLCJyZWxlYXNlVHJhdmVyc2VDb250ZXh0IiwicHVzaCIsInRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsIiwibmFtZVNvRmFyIiwiaW52b2tlQ2FsbGJhY2siLCJnZXRDb21wb25lbnRLZXkiLCJjaGlsZCIsIm5leHROYW1lIiwic3VidHJlZUNvdW50IiwibmV4dE5hbWVQcmVmaXgiLCJpc0FycmF5IiwiaXRlcmF0b3JGbiIsImVudHJpZXMiLCJzdGVwIiwiaWkiLCJkb25lIiwiYWRkZW5kdW0iLCJjaGlsZHJlblN0cmluZyIsInRyYXZlcnNlQWxsQ2hpbGRyZW4iLCJjb21wb25lbnQiLCJpbmRleCIsInRvU3RyaW5nIiwiZm9yRWFjaFNpbmdsZUNoaWxkIiwiYm9va0tlZXBpbmciLCJmb3JFYWNoQ2hpbGRyZW4iLCJmb3JFYWNoRnVuYyIsImZvckVhY2hDb250ZXh0IiwibWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dCIsImNoaWxkS2V5IiwibWFwcGVkQ2hpbGQiLCJtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsIiwiYXJyYXkiLCJwcmVmaXgiLCJlc2NhcGVkUHJlZml4IiwibWFwQ2hpbGRyZW4iLCJjb3VudENoaWxkcmVuIiwidG9BcnJheSIsIm9ubHlDaGlsZCIsImNyZWF0ZUNvbnRleHQiLCJkZWZhdWx0VmFsdWUiLCJjYWxjdWxhdGVDaGFuZ2VkQml0cyIsIl9jYWxjdWxhdGVDaGFuZ2VkQml0cyIsIl9jdXJyZW50VmFsdWUiLCJfY3VycmVudFZhbHVlMiIsIl90aHJlYWRDb3VudCIsIlByb3ZpZGVyIiwiQ29uc3VtZXIiLCJfY29udGV4dCIsImhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzIiwiaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwic2V0IiwiX1Byb3ZpZGVyIiwiX2N1cnJlbnRSZW5kZXJlciIsIl9jdXJyZW50UmVuZGVyZXIyIiwibGF6eSIsImN0b3IiLCJsYXp5VHlwZSIsIl9jdG9yIiwicHJvcFR5cGVzIiwibmV3RGVmYXVsdFByb3BzIiwibmV3UHJvcFR5cGVzIiwiZm9yd2FyZFJlZiIsImlzVmFsaWRFbGVtZW50VHlwZSIsIm1lbW8iLCJjb21wYXJlIiwicmVzb2x2ZURpc3BhdGNoZXIiLCJkaXNwYXRjaGVyIiwidXNlQ29udGV4dCIsIkNvbnRleHQiLCJ1bnN0YWJsZV9vYnNlcnZlZEJpdHMiLCJyZWFsQ29udGV4dCIsInVzZVN0YXRlIiwiaW5pdGlhbFN0YXRlIiwidXNlUmVkdWNlciIsInJlZHVjZXIiLCJpbml0aWFsQXJnIiwiaW5pdCIsInVzZVJlZiIsImluaXRpYWxWYWx1ZSIsInVzZUVmZmVjdCIsImNyZWF0ZSIsImlucHV0cyIsInVzZUxheW91dEVmZmVjdCIsInVzZUNhbGxiYWNrIiwidXNlTWVtbyIsInVzZUltcGVyYXRpdmVIYW5kbGUiLCJ1c2VEZWJ1Z1ZhbHVlIiwiZm9ybWF0dGVyRm4iLCJSZWFjdFByb3BUeXBlc1NlY3JldCQxIiwiUmVhY3RQcm9wVHlwZXNTZWNyZXRfMSIsInByaW50V2FybmluZyQxIiwiUmVhY3RQcm9wVHlwZXNTZWNyZXQiLCJsb2dnZWRUeXBlRmFpbHVyZXMiLCJjaGVja1Byb3BUeXBlcyIsInR5cGVTcGVjcyIsInZhbHVlcyIsImxvY2F0aW9uIiwiZ2V0U3RhY2siLCJ0eXBlU3BlY05hbWUiLCJleCIsImNoZWNrUHJvcFR5cGVzXzEiLCJwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biIsImdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSIsImdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtIiwiZWxlbWVudFByb3BzIiwib3duZXJIYXNLZXlVc2VXYXJuaW5nIiwiZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyIsInBhcmVudFR5cGUiLCJwYXJlbnROYW1lIiwidmFsaWRhdGVFeHBsaWNpdEtleSIsInZhbGlkYXRlZCIsImN1cnJlbnRDb21wb25lbnRFcnJvckluZm8iLCJjaGlsZE93bmVyIiwidmFsaWRhdGVDaGlsZEtleXMiLCJ2YWxpZGF0ZVByb3BUeXBlcyIsIlByb3BUeXBlcyIsImdldERlZmF1bHRQcm9wcyIsImlzUmVhY3RDbGFzc0FwcHJvdmVkIiwidmFsaWRhdGVGcmFnbWVudFByb3BzIiwiZnJhZ21lbnQiLCJjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24iLCJ2YWxpZFR5cGUiLCJ0eXBlU3RyaW5nIiwiY3JlYXRlRmFjdG9yeVdpdGhWYWxpZGF0aW9uIiwidmFsaWRhdGVkRmFjdG9yeSIsImJpbmQiLCJjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbiIsIkNoaWxkcmVuIiwib25seSIsIkZyYWdtZW50IiwiU3RyaWN0TW9kZSIsIlN1c3BlbnNlIiwiY3JlYXRlRmFjdG9yeSIsInZlcnNpb24iLCJ1bnN0YWJsZV9Db25jdXJyZW50TW9kZSIsInVuc3RhYmxlX1Byb2ZpbGVyIiwiX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQiLCJDb25jdXJyZW50TW9kZSIsIlByb2ZpbGVyIiwiUmVhY3QkMiIsImRlZmF1bHQiLCJSZWFjdCQzIiwicmVhY3QiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUFTQTs7QUFFQyxXQUFVQSxNQUFWLEVBQWtCQyxPQUFsQixFQUEyQjtBQUMzQixTQUFPQyxPQUFQLEtBQW1CLFFBQW5CLElBQStCLE9BQU9DLE1BQVAsS0FBa0IsV0FBakQsR0FBK0RBLE9BQU9ELE9BQVAsR0FBaUJELFNBQWhGLEdBQ0EsT0FBT0csTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsT0FBT0MsR0FBdkMsR0FBNkNELE9BQU9ILE9BQVAsQ0FBN0MsR0FDQ0QsT0FBT00sS0FBUCxHQUFlTCxTQUZoQjtBQUdBLENBSkEsRUFJQyxJQUpELEVB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KiogQGxpY2Vuc2UgUmVhY3QgdjE2LjguNlxuICogcmVhY3QuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5SZWFjdCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLy8gVE9ETzogdGhpcyBpcyBzcGVjaWFsIGJlY2F1c2UgaXQgZ2V0cyBpbXBvcnRlZCBkdXJpbmcgYnVpbGQuXG5cbnZhciBSZWFjdFZlcnNpb24gPSAnMTYuOC42JztcblxuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cbnZhciBoYXNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3I7XG5cbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgOiAweGVhYzc7XG52YXIgUkVBQ1RfUE9SVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wb3J0YWwnKSA6IDB4ZWFjYTtcbnZhciBSRUFDVF9GUkFHTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZnJhZ21lbnQnKSA6IDB4ZWFjYjtcbnZhciBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3RyaWN0X21vZGUnKSA6IDB4ZWFjYztcbnZhciBSRUFDVF9QUk9GSUxFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucHJvZmlsZXInKSA6IDB4ZWFkMjtcbnZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucHJvdmlkZXInKSA6IDB4ZWFjZDtcbnZhciBSRUFDVF9DT05URVhUX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5jb250ZXh0JykgOiAweGVhY2U7XG5cbnZhciBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbmN1cnJlbnRfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpIDogMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpIDogMHhlYWQxO1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSA6IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5sYXp5JykgOiAweGVhZDQ7XG5cbnZhciBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcblxuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gIGlmIChtYXliZUl0ZXJhYmxlID09PSBudWxsIHx8IHR5cGVvZiBtYXliZUl0ZXJhYmxlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBtYXliZUl0ZXJhdG9yID0gTUFZQkVfSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbTUFZQkVfSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXTtcbiAgaWYgKHR5cGVvZiBtYXliZUl0ZXJhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG1heWJlSXRlcmF0b3I7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbnZhciBvYmplY3RBc3NpZ24gPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoKSB7fTtcblxue1xuICB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yID0gdm9pZCAwO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG4vLyBSZWx5aW5nIG9uIHRoZSBgaW52YXJpYW50KClgIGltcGxlbWVudGF0aW9uIGxldHMgdXNcbi8vIHByZXNlcnZlIHRoZSBmb3JtYXQgYW5kIHBhcmFtcyBpbiB0aGUgd3d3IGJ1aWxkcy5cblxuLyoqXG4gKiBGb3JrZWQgZnJvbSBmYmpzL3dhcm5pbmc6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmJqcy9ibG9iL2U2NmJhMjBhZDViZTQzM2ViNTQ0MjNmMmIwOTdkODI5MzI0ZDlkZTYvcGFja2FnZXMvZmJqcy9zcmMvX19mb3Jrc19fL3dhcm5pbmcuanNcbiAqXG4gKiBPbmx5IGNoYW5nZSBpcyB3ZSB1c2UgY29uc29sZS53YXJuIGluc3RlYWQgb2YgY29uc29sZS5lcnJvcixcbiAqIGFuZCBkbyBub3RoaW5nIHdoZW4gJ2NvbnNvbGUnIGlzIG5vdCBzdXBwb3J0ZWQuXG4gKiBUaGlzIHJlYWxseSBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICogLS0tXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIGxvd1ByaW9yaXR5V2FybmluZyA9IGZ1bmN0aW9uIChjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgbG93UHJpb3JpdHlXYXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIGxvd1ByaW9yaXR5V2FybmluZyQxID0gbG93UHJpb3JpdHlXYXJuaW5nO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZ1dpdGhvdXRTdGFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG57XG4gIHdhcm5pbmdXaXRob3V0U3RhY2sgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDJdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZ1dpdGhvdXRTdGFjayhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gOCkge1xuICAgICAgLy8gQ2hlY2sgYmVmb3JlIHRoZSBjb25kaXRpb24gdG8gY2F0Y2ggdmlvbGF0aW9ucyBlYXJseS5cbiAgICAgIHRocm93IG5ldyBFcnJvcignd2FybmluZ1dpdGhvdXRTdGFjaygpIGN1cnJlbnRseSBzdXBwb3J0cyBhdCBtb3N0IDggYXJndW1lbnRzLicpO1xuICAgIH1cbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBhcmdzV2l0aEZvcm1hdCA9IGFyZ3MubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiAnJyArIGl0ZW07XG4gICAgICB9KTtcbiAgICAgIGFyZ3NXaXRoRm9ybWF0LnVuc2hpZnQoJ1dhcm5pbmc6ICcgKyBmb3JtYXQpO1xuXG4gICAgICAvLyBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBzcHJlYWQgKG9yIC5hcHBseSkgZGlyZWN0bHkgYmVjYXVzZSBpdFxuICAgICAgLy8gYnJlYWtzIElFOTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xMzYxMFxuICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5lcnJvciwgY29uc29sZSwgYXJnc1dpdGhGb3JtYXQpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xufVxuXG52YXIgd2FybmluZ1dpdGhvdXRTdGFjayQxID0gd2FybmluZ1dpdGhvdXRTdGFjaztcblxudmFyIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudCA9IHt9O1xuXG5mdW5jdGlvbiB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgY2FsbGVyTmFtZSkge1xuICB7XG4gICAgdmFyIF9jb25zdHJ1Y3RvciA9IHB1YmxpY0luc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgIHZhciBjb21wb25lbnROYW1lID0gX2NvbnN0cnVjdG9yICYmIChfY29uc3RydWN0b3IuZGlzcGxheU5hbWUgfHwgX2NvbnN0cnVjdG9yLm5hbWUpIHx8ICdSZWFjdENsYXNzJztcbiAgICB2YXIgd2FybmluZ0tleSA9IGNvbXBvbmVudE5hbWUgKyAnLicgKyBjYWxsZXJOYW1lO1xuICAgIGlmIChkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCBcIkNhbid0IGNhbGwgJXMgb24gYSBjb21wb25lbnQgdGhhdCBpcyBub3QgeWV0IG1vdW50ZWQuIFwiICsgJ1RoaXMgaXMgYSBuby1vcCwgYnV0IGl0IG1pZ2h0IGluZGljYXRlIGEgYnVnIGluIHlvdXIgYXBwbGljYXRpb24uICcgKyAnSW5zdGVhZCwgYXNzaWduIHRvIGB0aGlzLnN0YXRlYCBkaXJlY3RseSBvciBkZWZpbmUgYSBgc3RhdGUgPSB7fTtgICcgKyAnY2xhc3MgcHJvcGVydHkgd2l0aCB0aGUgZGVzaXJlZCBzdGF0ZSBpbiB0aGUgJXMgY29tcG9uZW50LicsIGNhbGxlck5hbWUsIGNvbXBvbmVudE5hbWUpO1xuICAgIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBhYnN0cmFjdCBBUEkgZm9yIGFuIHVwZGF0ZSBxdWV1ZS5cbiAqL1xudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0ge1xuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB3ZSB3YW50IHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgbW91bnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAgICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAgICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAgICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gY2FsbGVyTmFtZSBuYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVGb3JjZVVwZGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnZm9yY2VVcGRhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIG9yIGBzZXRTdGF0ZWAgdG8gbXV0YXRlIHN0YXRlLlxuICAgKiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gICAqXG4gICAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gICAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29tcGxldGVTdGF0ZSBOZXh0IHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlUmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNvbXBsZXRlU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdyZXBsYWNlU3RhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIFRoaXMgb25seSBleGlzdHMgYmVjYXVzZSBfcGVuZGluZ1N0YXRlIGlzXG4gICAqIGludGVybmFsLiBUaGlzIHByb3ZpZGVzIGEgbWVyZ2luZyBzdHJhdGVneSB0aGF0IGlzIG5vdCBhdmFpbGFibGUgdG8gZGVlcFxuICAgKiBwcm9wZXJ0aWVzIHdoaWNoIGlzIGNvbmZ1c2luZy4gVE9ETzogRXhwb3NlIHBlbmRpbmdTdGF0ZSBvciBkb24ndCB1c2UgaXRcbiAgICogZHVyaW5nIHRoZSBtZXJnZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IE5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVNldFN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3NldFN0YXRlJyk7XG4gIH1cbn07XG5cbnZhciBlbXB0eU9iamVjdCA9IHt9O1xue1xuICBPYmplY3QuZnJlZXplKGVtcHR5T2JqZWN0KTtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGhlbHBlcnMgZm9yIHRoZSB1cGRhdGluZyBzdGF0ZSBvZiBhIGNvbXBvbmVudC5cbiAqL1xuZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICAvLyBXZSBpbml0aWFsaXplIHRoZSBkZWZhdWx0IHVwZGF0ZXIgYnV0IHRoZSByZWFsIG9uZSBnZXRzIGluamVjdGVkIGJ5IHRoZVxuICAvLyByZW5kZXJlci5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuQ29tcG9uZW50LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50ID0ge307XG5cbi8qKlxuICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyB0byBtdXRhdGVcbiAqIHN0YXRlLiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgYHRoaXMuc3RhdGVgIHdpbGwgYmUgaW1tZWRpYXRlbHkgdXBkYXRlZCwgc29cbiAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgY2FsbHMgdG8gYHNldFN0YXRlYCB3aWxsIHJ1biBzeW5jaHJvbm91c2x5LFxuICogYXMgdGhleSBtYXkgZXZlbnR1YWxseSBiZSBiYXRjaGVkIHRvZ2V0aGVyLiAgWW91IGNhbiBwcm92aWRlIGFuIG9wdGlvbmFsXG4gKiBjYWxsYmFjayB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgY2FsbCB0byBzZXRTdGF0ZSBpcyBhY3R1YWxseVxuICogY29tcGxldGVkLlxuICpcbiAqIFdoZW4gYSBmdW5jdGlvbiBpcyBwcm92aWRlZCB0byBzZXRTdGF0ZSwgaXQgd2lsbCBiZSBjYWxsZWQgYXQgc29tZSBwb2ludCBpblxuICogdGhlIGZ1dHVyZSAobm90IHN5bmNocm9ub3VzbHkpLiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB1cCB0byBkYXRlXG4gKiBjb21wb25lbnQgYXJndW1lbnRzIChzdGF0ZSwgcHJvcHMsIGNvbnRleHQpLiBUaGVzZSB2YWx1ZXMgY2FuIGJlIGRpZmZlcmVudFxuICogZnJvbSB0aGlzLiogYmVjYXVzZSB5b3VyIGZ1bmN0aW9uIG1heSBiZSBjYWxsZWQgYWZ0ZXIgcmVjZWl2ZVByb3BzIGJ1dCBiZWZvcmVcbiAqIHNob3VsZENvbXBvbmVudFVwZGF0ZSwgYW5kIHRoaXMgbmV3IHN0YXRlLCBwcm9wcywgYW5kIGNvbnRleHQgd2lsbCBub3QgeWV0IGJlXG4gKiBhc3NpZ25lZCB0byB0aGlzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fGZ1bmN0aW9ufSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIG9yIGZ1bmN0aW9uIHRvXG4gKiAgICAgICAgcHJvZHVjZSBuZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggY3VycmVudCBzdGF0ZS5cbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgc3RhdGUgaXMgdXBkYXRlZC5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5Db21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgISh0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnZnVuY3Rpb24nIHx8IHBhcnRpYWxTdGF0ZSA9PSBudWxsKSA/IGludmFyaWFudChmYWxzZSwgJ3NldFN0YXRlKC4uLik6IHRha2VzIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMgdG8gdXBkYXRlIG9yIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzLicpIDogdm9pZCAwO1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssICdzZXRTdGF0ZScpO1xufTtcblxuLyoqXG4gKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAqXG4gKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAqXG4gKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICpcbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgdXBkYXRlIGlzIGNvbXBsZXRlLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cbkNvbXBvbmVudC5wcm90b3R5cGUuZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdGhpcy51cGRhdGVyLmVucXVldWVGb3JjZVVwZGF0ZSh0aGlzLCBjYWxsYmFjaywgJ2ZvcmNlVXBkYXRlJyk7XG59O1xuXG4vKipcbiAqIERlcHJlY2F0ZWQgQVBJcy4gVGhlc2UgQVBJcyB1c2VkIHRvIGV4aXN0IG9uIGNsYXNzaWMgUmVhY3QgY2xhc3NlcyBidXQgc2luY2VcbiAqIHdlIHdvdWxkIGxpa2UgdG8gZGVwcmVjYXRlIHRoZW0sIHdlJ3JlIG5vdCBnb2luZyB0byBtb3ZlIHRoZW0gb3ZlciB0byB0aGlzXG4gKiBtb2Rlcm4gYmFzZSBjbGFzcy4gSW5zdGVhZCwgd2UgZGVmaW5lIGEgZ2V0dGVyIHRoYXQgd2FybnMgaWYgaXQncyBhY2Nlc3NlZC5cbiAqL1xue1xuICB2YXIgZGVwcmVjYXRlZEFQSXMgPSB7XG4gICAgaXNNb3VudGVkOiBbJ2lzTW91bnRlZCcsICdJbnN0ZWFkLCBtYWtlIHN1cmUgdG8gY2xlYW4gdXAgc3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZyByZXF1ZXN0cyBpbiAnICsgJ2NvbXBvbmVudFdpbGxVbm1vdW50IHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzLiddLFxuICAgIHJlcGxhY2VTdGF0ZTogWydyZXBsYWNlU3RhdGUnLCAnUmVmYWN0b3IgeW91ciBjb2RlIHRvIHVzZSBzZXRTdGF0ZSBpbnN0ZWFkIChzZWUgJyArICdodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzMyMzYpLiddXG4gIH07XG4gIHZhciBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgaW5mbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21wb25lbnQucHJvdG90eXBlLCBtZXRob2ROYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG93UHJpb3JpdHlXYXJuaW5nJDEoZmFsc2UsICclcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlcycsIGluZm9bMF0sIGluZm9bMV0pO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBmb3IgKHZhciBmbk5hbWUgaW4gZGVwcmVjYXRlZEFQSXMpIHtcbiAgICBpZiAoZGVwcmVjYXRlZEFQSXMuaGFzT3duUHJvcGVydHkoZm5OYW1lKSkge1xuICAgICAgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nKGZuTmFtZSwgZGVwcmVjYXRlZEFQSXNbZm5OYW1lXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIENvbXBvbmVudER1bW15KCkge31cbkNvbXBvbmVudER1bW15LnByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ29udmVuaWVuY2UgY29tcG9uZW50IHdpdGggZGVmYXVsdCBzaGFsbG93IGVxdWFsaXR5IGNoZWNrIGZvciBzQ1UuXG4gKi9cbmZ1bmN0aW9uIFB1cmVDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbnZhciBwdXJlQ29tcG9uZW50UHJvdG90eXBlID0gUHVyZUNvbXBvbmVudC5wcm90b3R5cGUgPSBuZXcgQ29tcG9uZW50RHVtbXkoKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuY29uc3RydWN0b3IgPSBQdXJlQ29tcG9uZW50O1xuLy8gQXZvaWQgYW4gZXh0cmEgcHJvdG90eXBlIGp1bXAgZm9yIHRoZXNlIG1ldGhvZHMuXG5vYmplY3RBc3NpZ24ocHVyZUNvbXBvbmVudFByb3RvdHlwZSwgQ29tcG9uZW50LnByb3RvdHlwZSk7XG5wdXJlQ29tcG9uZW50UHJvdG90eXBlLmlzUHVyZVJlYWN0Q29tcG9uZW50ID0gdHJ1ZTtcblxuLy8gYW4gaW1tdXRhYmxlIG9iamVjdCB3aXRoIGEgc2luZ2xlIG11dGFibGUgdmFsdWVcbmZ1bmN0aW9uIGNyZWF0ZVJlZigpIHtcbiAgdmFyIHJlZk9iamVjdCA9IHtcbiAgICBjdXJyZW50OiBudWxsXG4gIH07XG4gIHtcbiAgICBPYmplY3Quc2VhbChyZWZPYmplY3QpO1xuICB9XG4gIHJldHVybiByZWZPYmplY3Q7XG59XG5cbnZhciBlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmcgPSBmYWxzZTtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5cbi8vIFRPRE86IFVzZSBzeW1ib2xzP1xudmFyIEltbWVkaWF0ZVByaW9yaXR5ID0gMTtcbnZhciBVc2VyQmxvY2tpbmdQcmlvcml0eSA9IDI7XG52YXIgTm9ybWFsUHJpb3JpdHkgPSAzO1xudmFyIExvd1ByaW9yaXR5ID0gNDtcbnZhciBJZGxlUHJpb3JpdHkgPSA1O1xuXG4vLyBNYXggMzEgYml0IGludGVnZXIuIFRoZSBtYXggaW50ZWdlciBzaXplIGluIFY4IGZvciAzMi1iaXQgc3lzdGVtcy5cbi8vIE1hdGgucG93KDIsIDMwKSAtIDFcbi8vIDBiMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExXG52YXIgbWF4U2lnbmVkMzFCaXRJbnQgPSAxMDczNzQxODIzO1xuXG4vLyBUaW1lcyBvdXQgaW1tZWRpYXRlbHlcbnZhciBJTU1FRElBVEVfUFJJT1JJVFlfVElNRU9VVCA9IC0xO1xuLy8gRXZlbnR1YWxseSB0aW1lcyBvdXRcbnZhciBVU0VSX0JMT0NLSU5HX1BSSU9SSVRZID0gMjUwO1xudmFyIE5PUk1BTF9QUklPUklUWV9USU1FT1VUID0gNTAwMDtcbnZhciBMT1dfUFJJT1JJVFlfVElNRU9VVCA9IDEwMDAwO1xuLy8gTmV2ZXIgdGltZXMgb3V0XG52YXIgSURMRV9QUklPUklUWSA9IG1heFNpZ25lZDMxQml0SW50O1xuXG4vLyBDYWxsYmFja3MgYXJlIHN0b3JlZCBhcyBhIGNpcmN1bGFyLCBkb3VibHkgbGlua2VkIGxpc3QuXG52YXIgZmlyc3RDYWxsYmFja05vZGUgPSBudWxsO1xuXG52YXIgY3VycmVudERpZFRpbWVvdXQgPSBmYWxzZTtcbi8vIFBhdXNpbmcgdGhlIHNjaGVkdWxlciBpcyB1c2VmdWwgZm9yIGRlYnVnZ2luZy5cbnZhciBpc1NjaGVkdWxlclBhdXNlZCA9IGZhbHNlO1xuXG52YXIgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBOb3JtYWxQcmlvcml0eTtcbnZhciBjdXJyZW50RXZlbnRTdGFydFRpbWUgPSAtMTtcbnZhciBjdXJyZW50RXhwaXJhdGlvblRpbWUgPSAtMTtcblxuLy8gVGhpcyBpcyBzZXQgd2hlbiBhIGNhbGxiYWNrIGlzIGJlaW5nIGV4ZWN1dGVkLCB0byBwcmV2ZW50IHJlLWVudHJhbmN5LlxudmFyIGlzRXhlY3V0aW5nQ2FsbGJhY2sgPSBmYWxzZTtcblxudmFyIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gZmFsc2U7XG5cbnZhciBoYXNOYXRpdmVQZXJmb3JtYW5jZU5vdyA9IHR5cGVvZiBwZXJmb3JtYW5jZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gJ2Z1bmN0aW9uJztcblxuZnVuY3Rpb24gZW5zdXJlSG9zdENhbGxiYWNrSXNTY2hlZHVsZWQoKSB7XG4gIGlmIChpc0V4ZWN1dGluZ0NhbGxiYWNrKSB7XG4gICAgLy8gRG9uJ3Qgc2NoZWR1bGUgd29yayB5ZXQ7IHdhaXQgdW50aWwgdGhlIG5leHQgdGltZSB3ZSB5aWVsZC5cbiAgICByZXR1cm47XG4gIH1cbiAgLy8gU2NoZWR1bGUgdGhlIGhvc3QgY2FsbGJhY2sgdXNpbmcgdGhlIGVhcmxpZXN0IGV4cGlyYXRpb24gaW4gdGhlIGxpc3QuXG4gIHZhciBleHBpcmF0aW9uVGltZSA9IGZpcnN0Q2FsbGJhY2tOb2RlLmV4cGlyYXRpb25UaW1lO1xuICBpZiAoIWlzSG9zdENhbGxiYWNrU2NoZWR1bGVkKSB7XG4gICAgaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIC8vIENhbmNlbCB0aGUgZXhpc3RpbmcgaG9zdCBjYWxsYmFjay5cbiAgICBjYW5jZWxIb3N0Q2FsbGJhY2soKTtcbiAgfVxuICByZXF1ZXN0SG9zdENhbGxiYWNrKGZsdXNoV29yaywgZXhwaXJhdGlvblRpbWUpO1xufVxuXG5mdW5jdGlvbiBmbHVzaEZpcnN0Q2FsbGJhY2soKSB7XG4gIHZhciBmbHVzaGVkTm9kZSA9IGZpcnN0Q2FsbGJhY2tOb2RlO1xuXG4gIC8vIFJlbW92ZSB0aGUgbm9kZSBmcm9tIHRoZSBsaXN0IGJlZm9yZSBjYWxsaW5nIHRoZSBjYWxsYmFjay4gVGhhdCB3YXkgdGhlXG4gIC8vIGxpc3QgaXMgaW4gYSBjb25zaXN0ZW50IHN0YXRlIGV2ZW4gaWYgdGhlIGNhbGxiYWNrIHRocm93cy5cbiAgdmFyIG5leHQgPSBmaXJzdENhbGxiYWNrTm9kZS5uZXh0O1xuICBpZiAoZmlyc3RDYWxsYmFja05vZGUgPT09IG5leHQpIHtcbiAgICAvLyBUaGlzIGlzIHRoZSBsYXN0IGNhbGxiYWNrIGluIHRoZSBsaXN0LlxuICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gbnVsbDtcbiAgICBuZXh0ID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGFzdENhbGxiYWNrTm9kZSA9IGZpcnN0Q2FsbGJhY2tOb2RlLnByZXZpb3VzO1xuICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gbGFzdENhbGxiYWNrTm9kZS5uZXh0ID0gbmV4dDtcbiAgICBuZXh0LnByZXZpb3VzID0gbGFzdENhbGxiYWNrTm9kZTtcbiAgfVxuXG4gIGZsdXNoZWROb2RlLm5leHQgPSBmbHVzaGVkTm9kZS5wcmV2aW91cyA9IG51bGw7XG5cbiAgLy8gTm93IGl0J3Mgc2FmZSB0byBjYWxsIHRoZSBjYWxsYmFjay5cbiAgdmFyIGNhbGxiYWNrID0gZmx1c2hlZE5vZGUuY2FsbGJhY2s7XG4gIHZhciBleHBpcmF0aW9uVGltZSA9IGZsdXNoZWROb2RlLmV4cGlyYXRpb25UaW1lO1xuICB2YXIgcHJpb3JpdHlMZXZlbCA9IGZsdXNoZWROb2RlLnByaW9yaXR5TGV2ZWw7XG4gIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgdmFyIHByZXZpb3VzRXhwaXJhdGlvblRpbWUgPSBjdXJyZW50RXhwaXJhdGlvblRpbWU7XG4gIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJpb3JpdHlMZXZlbDtcbiAgY3VycmVudEV4cGlyYXRpb25UaW1lID0gZXhwaXJhdGlvblRpbWU7XG4gIHZhciBjb250aW51YXRpb25DYWxsYmFjaztcbiAgdHJ5IHtcbiAgICBjb250aW51YXRpb25DYWxsYmFjayA9IGNhbGxiYWNrKCk7XG4gIH0gZmluYWxseSB7XG4gICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmV2aW91c1ByaW9yaXR5TGV2ZWw7XG4gICAgY3VycmVudEV4cGlyYXRpb25UaW1lID0gcHJldmlvdXNFeHBpcmF0aW9uVGltZTtcbiAgfVxuXG4gIC8vIEEgY2FsbGJhY2sgbWF5IHJldHVybiBhIGNvbnRpbnVhdGlvbi4gVGhlIGNvbnRpbnVhdGlvbiBzaG91bGQgYmUgc2NoZWR1bGVkXG4gIC8vIHdpdGggdGhlIHNhbWUgcHJpb3JpdHkgYW5kIGV4cGlyYXRpb24gYXMgdGhlIGp1c3QtZmluaXNoZWQgY2FsbGJhY2suXG4gIGlmICh0eXBlb2YgY29udGludWF0aW9uQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgY29udGludWF0aW9uTm9kZSA9IHtcbiAgICAgIGNhbGxiYWNrOiBjb250aW51YXRpb25DYWxsYmFjayxcbiAgICAgIHByaW9yaXR5TGV2ZWw6IHByaW9yaXR5TGV2ZWwsXG4gICAgICBleHBpcmF0aW9uVGltZTogZXhwaXJhdGlvblRpbWUsXG4gICAgICBuZXh0OiBudWxsLFxuICAgICAgcHJldmlvdXM6IG51bGxcbiAgICB9O1xuXG4gICAgLy8gSW5zZXJ0IHRoZSBuZXcgY2FsbGJhY2sgaW50byB0aGUgbGlzdCwgc29ydGVkIGJ5IGl0cyBleHBpcmF0aW9uLiBUaGlzIGlzXG4gICAgLy8gYWxtb3N0IHRoZSBzYW1lIGFzIHRoZSBjb2RlIGluIGBzY2hlZHVsZUNhbGxiYWNrYCwgZXhjZXB0IHRoZSBjYWxsYmFja1xuICAgIC8vIGlzIGluc2VydGVkIGludG8gdGhlIGxpc3QgKmJlZm9yZSogY2FsbGJhY2tzIG9mIGVxdWFsIGV4cGlyYXRpb24gaW5zdGVhZFxuICAgIC8vIG9mIGFmdGVyLlxuICAgIGlmIChmaXJzdENhbGxiYWNrTm9kZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZmlyc3QgY2FsbGJhY2sgaW4gdGhlIGxpc3QuXG4gICAgICBmaXJzdENhbGxiYWNrTm9kZSA9IGNvbnRpbnVhdGlvbk5vZGUubmV4dCA9IGNvbnRpbnVhdGlvbk5vZGUucHJldmlvdXMgPSBjb250aW51YXRpb25Ob2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbmV4dEFmdGVyQ29udGludWF0aW9uID0gbnVsbDtcbiAgICAgIHZhciBub2RlID0gZmlyc3RDYWxsYmFja05vZGU7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChub2RlLmV4cGlyYXRpb25UaW1lID49IGV4cGlyYXRpb25UaW1lKSB7XG4gICAgICAgICAgLy8gVGhpcyBjYWxsYmFjayBleHBpcmVzIGF0IG9yIGFmdGVyIHRoZSBjb250aW51YXRpb24uIFdlIHdpbGwgaW5zZXJ0XG4gICAgICAgICAgLy8gdGhlIGNvbnRpbnVhdGlvbiAqYmVmb3JlKiB0aGlzIGNhbGxiYWNrLlxuICAgICAgICAgIG5leHRBZnRlckNvbnRpbnVhdGlvbiA9IG5vZGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgIH0gd2hpbGUgKG5vZGUgIT09IGZpcnN0Q2FsbGJhY2tOb2RlKTtcblxuICAgICAgaWYgKG5leHRBZnRlckNvbnRpbnVhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAvLyBObyBlcXVhbCBvciBsb3dlciBwcmlvcml0eSBjYWxsYmFjayB3YXMgZm91bmQsIHdoaWNoIG1lYW5zIHRoZSBuZXdcbiAgICAgICAgLy8gY2FsbGJhY2sgaXMgdGhlIGxvd2VzdCBwcmlvcml0eSBjYWxsYmFjayBpbiB0aGUgbGlzdC5cbiAgICAgICAgbmV4dEFmdGVyQ29udGludWF0aW9uID0gZmlyc3RDYWxsYmFja05vZGU7XG4gICAgICB9IGVsc2UgaWYgKG5leHRBZnRlckNvbnRpbnVhdGlvbiA9PT0gZmlyc3RDYWxsYmFja05vZGUpIHtcbiAgICAgICAgLy8gVGhlIG5ldyBjYWxsYmFjayBpcyB0aGUgaGlnaGVzdCBwcmlvcml0eSBjYWxsYmFjayBpbiB0aGUgbGlzdC5cbiAgICAgICAgZmlyc3RDYWxsYmFja05vZGUgPSBjb250aW51YXRpb25Ob2RlO1xuICAgICAgICBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJldmlvdXMgPSBuZXh0QWZ0ZXJDb250aW51YXRpb24ucHJldmlvdXM7XG4gICAgICBwcmV2aW91cy5uZXh0ID0gbmV4dEFmdGVyQ29udGludWF0aW9uLnByZXZpb3VzID0gY29udGludWF0aW9uTm9kZTtcbiAgICAgIGNvbnRpbnVhdGlvbk5vZGUubmV4dCA9IG5leHRBZnRlckNvbnRpbnVhdGlvbjtcbiAgICAgIGNvbnRpbnVhdGlvbk5vZGUucHJldmlvdXMgPSBwcmV2aW91cztcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmx1c2hJbW1lZGlhdGVXb3JrKCkge1xuICBpZiAoXG4gIC8vIENvbmZpcm0gd2UndmUgZXhpdGVkIHRoZSBvdXRlciBtb3N0IGV2ZW50IGhhbmRsZXJcbiAgY3VycmVudEV2ZW50U3RhcnRUaW1lID09PSAtMSAmJiBmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCAmJiBmaXJzdENhbGxiYWNrTm9kZS5wcmlvcml0eUxldmVsID09PSBJbW1lZGlhdGVQcmlvcml0eSkge1xuICAgIGlzRXhlY3V0aW5nQ2FsbGJhY2sgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBkbyB7XG4gICAgICAgIGZsdXNoRmlyc3RDYWxsYmFjaygpO1xuICAgICAgfSB3aGlsZSAoXG4gICAgICAvLyBLZWVwIGZsdXNoaW5nIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIGltbWVkaWF0ZSBjYWxsYmFja3NcbiAgICAgIGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsICYmIGZpcnN0Q2FsbGJhY2tOb2RlLnByaW9yaXR5TGV2ZWwgPT09IEltbWVkaWF0ZVByaW9yaXR5KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaXNFeGVjdXRpbmdDYWxsYmFjayA9IGZhbHNlO1xuICAgICAgaWYgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsKSB7XG4gICAgICAgIC8vIFRoZXJlJ3Mgc3RpbGwgd29yayByZW1haW5pbmcuIFJlcXVlc3QgYW5vdGhlciBjYWxsYmFjay5cbiAgICAgICAgZW5zdXJlSG9zdENhbGxiYWNrSXNTY2hlZHVsZWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsdXNoV29yayhkaWRUaW1lb3V0KSB7XG4gIC8vIEV4aXQgcmlnaHQgYXdheSBpZiB3ZSdyZSBjdXJyZW50bHkgcGF1c2VkXG5cbiAgaWYgKGVuYWJsZVNjaGVkdWxlckRlYnVnZ2luZyAmJiBpc1NjaGVkdWxlclBhdXNlZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlzRXhlY3V0aW5nQ2FsbGJhY2sgPSB0cnVlO1xuICB2YXIgcHJldmlvdXNEaWRUaW1lb3V0ID0gY3VycmVudERpZFRpbWVvdXQ7XG4gIGN1cnJlbnREaWRUaW1lb3V0ID0gZGlkVGltZW91dDtcbiAgdHJ5IHtcbiAgICBpZiAoZGlkVGltZW91dCkge1xuICAgICAgLy8gRmx1c2ggYWxsIHRoZSBleHBpcmVkIGNhbGxiYWNrcyB3aXRob3V0IHlpZWxkaW5nLlxuICAgICAgd2hpbGUgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsICYmICEoZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nICYmIGlzU2NoZWR1bGVyUGF1c2VkKSkge1xuICAgICAgICAvLyBUT0RPIFdyYXAgaW4gZmVhdHVyZSBmbGFnXG4gICAgICAgIC8vIFJlYWQgdGhlIGN1cnJlbnQgdGltZS4gRmx1c2ggYWxsIHRoZSBjYWxsYmFja3MgdGhhdCBleHBpcmUgYXQgb3JcbiAgICAgICAgLy8gZWFybGllciB0aGFuIHRoYXQgdGltZS4gVGhlbiByZWFkIHRoZSBjdXJyZW50IHRpbWUgYWdhaW4gYW5kIHJlcGVhdC5cbiAgICAgICAgLy8gVGhpcyBvcHRpbWl6ZXMgZm9yIGFzIGZldyBwZXJmb3JtYW5jZS5ub3cgY2FsbHMgYXMgcG9zc2libGUuXG4gICAgICAgIHZhciBjdXJyZW50VGltZSA9IGdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgIGlmIChmaXJzdENhbGxiYWNrTm9kZS5leHBpcmF0aW9uVGltZSA8PSBjdXJyZW50VGltZSkge1xuICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgIGZsdXNoRmlyc3RDYWxsYmFjaygpO1xuICAgICAgICAgIH0gd2hpbGUgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsICYmIGZpcnN0Q2FsbGJhY2tOb2RlLmV4cGlyYXRpb25UaW1lIDw9IGN1cnJlbnRUaW1lICYmICEoZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nICYmIGlzU2NoZWR1bGVyUGF1c2VkKSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEtlZXAgZmx1c2hpbmcgY2FsbGJhY2tzIHVudGlsIHdlIHJ1biBvdXQgb2YgdGltZSBpbiB0aGUgZnJhbWUuXG4gICAgICBpZiAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwpIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGlmIChlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmcgJiYgaXNTY2hlZHVsZXJQYXVzZWQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmbHVzaEZpcnN0Q2FsbGJhY2soKTtcbiAgICAgICAgfSB3aGlsZSAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwgJiYgIXNob3VsZFlpZWxkVG9Ib3N0KCkpO1xuICAgICAgfVxuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBpc0V4ZWN1dGluZ0NhbGxiYWNrID0gZmFsc2U7XG4gICAgY3VycmVudERpZFRpbWVvdXQgPSBwcmV2aW91c0RpZFRpbWVvdXQ7XG4gICAgaWYgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsKSB7XG4gICAgICAvLyBUaGVyZSdzIHN0aWxsIHdvcmsgcmVtYWluaW5nLiBSZXF1ZXN0IGFub3RoZXIgY2FsbGJhY2suXG4gICAgICBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBCZWZvcmUgZXhpdGluZywgZmx1c2ggYWxsIHRoZSBpbW1lZGlhdGUgd29yayB0aGF0IHdhcyBzY2hlZHVsZWQuXG4gICAgZmx1c2hJbW1lZGlhdGVXb3JrKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfcnVuV2l0aFByaW9yaXR5KHByaW9yaXR5TGV2ZWwsIGV2ZW50SGFuZGxlcikge1xuICBzd2l0Y2ggKHByaW9yaXR5TGV2ZWwpIHtcbiAgICBjYXNlIEltbWVkaWF0ZVByaW9yaXR5OlxuICAgIGNhc2UgVXNlckJsb2NraW5nUHJpb3JpdHk6XG4gICAgY2FzZSBOb3JtYWxQcmlvcml0eTpcbiAgICBjYXNlIExvd1ByaW9yaXR5OlxuICAgIGNhc2UgSWRsZVByaW9yaXR5OlxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHByaW9yaXR5TGV2ZWwgPSBOb3JtYWxQcmlvcml0eTtcbiAgfVxuXG4gIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgdmFyIHByZXZpb3VzRXZlbnRTdGFydFRpbWUgPSBjdXJyZW50RXZlbnRTdGFydFRpbWU7XG4gIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJpb3JpdHlMZXZlbDtcbiAgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gZ2V0Q3VycmVudFRpbWUoKTtcblxuICB0cnkge1xuICAgIHJldHVybiBldmVudEhhbmRsZXIoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByZXZpb3VzUHJpb3JpdHlMZXZlbDtcbiAgICBjdXJyZW50RXZlbnRTdGFydFRpbWUgPSBwcmV2aW91c0V2ZW50U3RhcnRUaW1lO1xuXG4gICAgLy8gQmVmb3JlIGV4aXRpbmcsIGZsdXNoIGFsbCB0aGUgaW1tZWRpYXRlIHdvcmsgdGhhdCB3YXMgc2NoZWR1bGVkLlxuICAgIGZsdXNoSW1tZWRpYXRlV29yaygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX25leHQoZXZlbnRIYW5kbGVyKSB7XG4gIHZhciBwcmlvcml0eUxldmVsID0gdm9pZCAwO1xuICBzd2l0Y2ggKGN1cnJlbnRQcmlvcml0eUxldmVsKSB7XG4gICAgY2FzZSBJbW1lZGlhdGVQcmlvcml0eTpcbiAgICBjYXNlIFVzZXJCbG9ja2luZ1ByaW9yaXR5OlxuICAgIGNhc2UgTm9ybWFsUHJpb3JpdHk6XG4gICAgICAvLyBTaGlmdCBkb3duIHRvIG5vcm1hbCBwcmlvcml0eVxuICAgICAgcHJpb3JpdHlMZXZlbCA9IE5vcm1hbFByaW9yaXR5O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIEFueXRoaW5nIGxvd2VyIHRoYW4gbm9ybWFsIHByaW9yaXR5IHNob3VsZCByZW1haW4gYXQgdGhlIGN1cnJlbnQgbGV2ZWwuXG4gICAgICBwcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgdmFyIHByZXZpb3VzRXZlbnRTdGFydFRpbWUgPSBjdXJyZW50RXZlbnRTdGFydFRpbWU7XG4gIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJpb3JpdHlMZXZlbDtcbiAgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gZ2V0Q3VycmVudFRpbWUoKTtcblxuICB0cnkge1xuICAgIHJldHVybiBldmVudEhhbmRsZXIoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByZXZpb3VzUHJpb3JpdHlMZXZlbDtcbiAgICBjdXJyZW50RXZlbnRTdGFydFRpbWUgPSBwcmV2aW91c0V2ZW50U3RhcnRUaW1lO1xuXG4gICAgLy8gQmVmb3JlIGV4aXRpbmcsIGZsdXNoIGFsbCB0aGUgaW1tZWRpYXRlIHdvcmsgdGhhdCB3YXMgc2NoZWR1bGVkLlxuICAgIGZsdXNoSW1tZWRpYXRlV29yaygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3dyYXBDYWxsYmFjayhjYWxsYmFjaykge1xuICB2YXIgcGFyZW50UHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRoaXMgaXMgYSBmb3JrIG9mIHJ1bldpdGhQcmlvcml0eSwgaW5saW5lZCBmb3IgcGVyZm9ybWFuY2UuXG4gICAgdmFyIHByZXZpb3VzUHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICAgIHZhciBwcmV2aW91c0V2ZW50U3RhcnRUaW1lID0gY3VycmVudEV2ZW50U3RhcnRUaW1lO1xuICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcGFyZW50UHJpb3JpdHlMZXZlbDtcbiAgICBjdXJyZW50RXZlbnRTdGFydFRpbWUgPSBnZXRDdXJyZW50VGltZSgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByZXZpb3VzUHJpb3JpdHlMZXZlbDtcbiAgICAgIGN1cnJlbnRFdmVudFN0YXJ0VGltZSA9IHByZXZpb3VzRXZlbnRTdGFydFRpbWU7XG4gICAgICBmbHVzaEltbWVkaWF0ZVdvcmsoKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2soY2FsbGJhY2ssIGRlcHJlY2F0ZWRfb3B0aW9ucykge1xuICB2YXIgc3RhcnRUaW1lID0gY3VycmVudEV2ZW50U3RhcnRUaW1lICE9PSAtMSA/IGN1cnJlbnRFdmVudFN0YXJ0VGltZSA6IGdldEN1cnJlbnRUaW1lKCk7XG5cbiAgdmFyIGV4cGlyYXRpb25UaW1lO1xuICBpZiAodHlwZW9mIGRlcHJlY2F0ZWRfb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgZGVwcmVjYXRlZF9vcHRpb25zICE9PSBudWxsICYmIHR5cGVvZiBkZXByZWNhdGVkX29wdGlvbnMudGltZW91dCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgYnJhbmNoIG9uY2Ugd2UgbGlmdCBleHBpcmF0aW9uIHRpbWVzIG91dCBvZiBSZWFjdC5cbiAgICBleHBpcmF0aW9uVGltZSA9IHN0YXJ0VGltZSArIGRlcHJlY2F0ZWRfb3B0aW9ucy50aW1lb3V0O1xuICB9IGVsc2Uge1xuICAgIHN3aXRjaCAoY3VycmVudFByaW9yaXR5TGV2ZWwpIHtcbiAgICAgIGNhc2UgSW1tZWRpYXRlUHJpb3JpdHk6XG4gICAgICAgIGV4cGlyYXRpb25UaW1lID0gc3RhcnRUaW1lICsgSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBVc2VyQmxvY2tpbmdQcmlvcml0eTpcbiAgICAgICAgZXhwaXJhdGlvblRpbWUgPSBzdGFydFRpbWUgKyBVU0VSX0JMT0NLSU5HX1BSSU9SSVRZO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSWRsZVByaW9yaXR5OlxuICAgICAgICBleHBpcmF0aW9uVGltZSA9IHN0YXJ0VGltZSArIElETEVfUFJJT1JJVFk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMb3dQcmlvcml0eTpcbiAgICAgICAgZXhwaXJhdGlvblRpbWUgPSBzdGFydFRpbWUgKyBMT1dfUFJJT1JJVFlfVElNRU9VVDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE5vcm1hbFByaW9yaXR5OlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZXhwaXJhdGlvblRpbWUgPSBzdGFydFRpbWUgKyBOT1JNQUxfUFJJT1JJVFlfVElNRU9VVDtcbiAgICB9XG4gIH1cblxuICB2YXIgbmV3Tm9kZSA9IHtcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgcHJpb3JpdHlMZXZlbDogY3VycmVudFByaW9yaXR5TGV2ZWwsXG4gICAgZXhwaXJhdGlvblRpbWU6IGV4cGlyYXRpb25UaW1lLFxuICAgIG5leHQ6IG51bGwsXG4gICAgcHJldmlvdXM6IG51bGxcbiAgfTtcblxuICAvLyBJbnNlcnQgdGhlIG5ldyBjYWxsYmFjayBpbnRvIHRoZSBsaXN0LCBvcmRlcmVkIGZpcnN0IGJ5IGV4cGlyYXRpb24sIHRoZW5cbiAgLy8gYnkgaW5zZXJ0aW9uLiBTbyB0aGUgbmV3IGNhbGxiYWNrIGlzIGluc2VydGVkIGFueSBvdGhlciBjYWxsYmFjayB3aXRoXG4gIC8vIGVxdWFsIGV4cGlyYXRpb24uXG4gIGlmIChmaXJzdENhbGxiYWNrTm9kZSA9PT0gbnVsbCkge1xuICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IGNhbGxiYWNrIGluIHRoZSBsaXN0LlxuICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gbmV3Tm9kZS5uZXh0ID0gbmV3Tm9kZS5wcmV2aW91cyA9IG5ld05vZGU7XG4gICAgZW5zdXJlSG9zdENhbGxiYWNrSXNTY2hlZHVsZWQoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbmV4dCA9IG51bGw7XG4gICAgdmFyIG5vZGUgPSBmaXJzdENhbGxiYWNrTm9kZTtcbiAgICBkbyB7XG4gICAgICBpZiAobm9kZS5leHBpcmF0aW9uVGltZSA+IGV4cGlyYXRpb25UaW1lKSB7XG4gICAgICAgIC8vIFRoZSBuZXcgY2FsbGJhY2sgZXhwaXJlcyBiZWZvcmUgdGhpcyBvbmUuXG4gICAgICAgIG5leHQgPSBub2RlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfSB3aGlsZSAobm9kZSAhPT0gZmlyc3RDYWxsYmFja05vZGUpO1xuXG4gICAgaWYgKG5leHQgPT09IG51bGwpIHtcbiAgICAgIC8vIE5vIGNhbGxiYWNrIHdpdGggYSBsYXRlciBleHBpcmF0aW9uIHdhcyBmb3VuZCwgd2hpY2ggbWVhbnMgdGhlIG5ld1xuICAgICAgLy8gY2FsbGJhY2sgaGFzIHRoZSBsYXRlc3QgZXhwaXJhdGlvbiBpbiB0aGUgbGlzdC5cbiAgICAgIG5leHQgPSBmaXJzdENhbGxiYWNrTm9kZTtcbiAgICB9IGVsc2UgaWYgKG5leHQgPT09IGZpcnN0Q2FsbGJhY2tOb2RlKSB7XG4gICAgICAvLyBUaGUgbmV3IGNhbGxiYWNrIGhhcyB0aGUgZWFybGllc3QgZXhwaXJhdGlvbiBpbiB0aGUgZW50aXJlIGxpc3QuXG4gICAgICBmaXJzdENhbGxiYWNrTm9kZSA9IG5ld05vZGU7XG4gICAgICBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpO1xuICAgIH1cblxuICAgIHZhciBwcmV2aW91cyA9IG5leHQucHJldmlvdXM7XG4gICAgcHJldmlvdXMubmV4dCA9IG5leHQucHJldmlvdXMgPSBuZXdOb2RlO1xuICAgIG5ld05vZGUubmV4dCA9IG5leHQ7XG4gICAgbmV3Tm9kZS5wcmV2aW91cyA9IHByZXZpb3VzO1xuICB9XG5cbiAgcmV0dXJuIG5ld05vZGU7XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3BhdXNlRXhlY3V0aW9uKCkge1xuICBpc1NjaGVkdWxlclBhdXNlZCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uKCkge1xuICBpc1NjaGVkdWxlclBhdXNlZCA9IGZhbHNlO1xuICBpZiAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwpIHtcbiAgICBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlKCkge1xuICByZXR1cm4gZmlyc3RDYWxsYmFja05vZGU7XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2NhbmNlbENhbGxiYWNrKGNhbGxiYWNrTm9kZSkge1xuICB2YXIgbmV4dCA9IGNhbGxiYWNrTm9kZS5uZXh0O1xuICBpZiAobmV4dCA9PT0gbnVsbCkge1xuICAgIC8vIEFscmVhZHkgY2FuY2VsbGVkLlxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChuZXh0ID09PSBjYWxsYmFja05vZGUpIHtcbiAgICAvLyBUaGlzIGlzIHRoZSBvbmx5IHNjaGVkdWxlZCBjYWxsYmFjay4gQ2xlYXIgdGhlIGxpc3QuXG4gICAgZmlyc3RDYWxsYmFja05vZGUgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIC8vIFJlbW92ZSB0aGUgY2FsbGJhY2sgZnJvbSBpdHMgcG9zaXRpb24gaW4gdGhlIGxpc3QuXG4gICAgaWYgKGNhbGxiYWNrTm9kZSA9PT0gZmlyc3RDYWxsYmFja05vZGUpIHtcbiAgICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gbmV4dDtcbiAgICB9XG4gICAgdmFyIHByZXZpb3VzID0gY2FsbGJhY2tOb2RlLnByZXZpb3VzO1xuICAgIHByZXZpb3VzLm5leHQgPSBuZXh0O1xuICAgIG5leHQucHJldmlvdXMgPSBwcmV2aW91cztcbiAgfVxuXG4gIGNhbGxiYWNrTm9kZS5uZXh0ID0gY2FsbGJhY2tOb2RlLnByZXZpb3VzID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfZ2V0Q3VycmVudFByaW9yaXR5TGV2ZWwoKSB7XG4gIHJldHVybiBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfc2hvdWxkWWllbGQoKSB7XG4gIHJldHVybiAhY3VycmVudERpZFRpbWVvdXQgJiYgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsICYmIGZpcnN0Q2FsbGJhY2tOb2RlLmV4cGlyYXRpb25UaW1lIDwgY3VycmVudEV4cGlyYXRpb25UaW1lIHx8IHNob3VsZFlpZWxkVG9Ib3N0KCkpO1xufVxuXG4vLyBUaGUgcmVtYWluaW5nIGNvZGUgaXMgZXNzZW50aWFsbHkgYSBwb2x5ZmlsbCBmb3IgcmVxdWVzdElkbGVDYWxsYmFjay4gSXRcbi8vIHdvcmtzIGJ5IHNjaGVkdWxpbmcgYSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIHN0b3JpbmcgdGhlIHRpbWUgZm9yIHRoZSBzdGFydFxuLy8gb2YgdGhlIGZyYW1lLCB0aGVuIHNjaGVkdWxpbmcgYSBwb3N0TWVzc2FnZSB3aGljaCBnZXRzIHNjaGVkdWxlZCBhZnRlciBwYWludC5cbi8vIFdpdGhpbiB0aGUgcG9zdE1lc3NhZ2UgaGFuZGxlciBkbyBhcyBtdWNoIHdvcmsgYXMgcG9zc2libGUgdW50aWwgdGltZSArIGZyYW1lXG4vLyByYXRlLiBCeSBzZXBhcmF0aW5nIHRoZSBpZGxlIGNhbGwgaW50byBhIHNlcGFyYXRlIGV2ZW50IHRpY2sgd2UgZW5zdXJlIHRoYXRcbi8vIGxheW91dCwgcGFpbnQgYW5kIG90aGVyIGJyb3dzZXIgd29yayBpcyBjb3VudGVkIGFnYWluc3QgdGhlIGF2YWlsYWJsZSB0aW1lLlxuLy8gVGhlIGZyYW1lIHJhdGUgaXMgZHluYW1pY2FsbHkgYWRqdXN0ZWQuXG5cbi8vIFdlIGNhcHR1cmUgYSBsb2NhbCByZWZlcmVuY2UgdG8gYW55IGdsb2JhbCwgaW4gY2FzZSBpdCBnZXRzIHBvbHlmaWxsZWQgYWZ0ZXJcbi8vIHRoaXMgbW9kdWxlIGlzIGluaXRpYWxseSBldmFsdWF0ZWQuIFdlIHdhbnQgdG8gYmUgdXNpbmcgYVxuLy8gY29uc2lzdGVudCBpbXBsZW1lbnRhdGlvbi5cbnZhciBsb2NhbERhdGUgPSBEYXRlO1xuXG4vLyBUaGlzIGluaXRpYWxpemF0aW9uIGNvZGUgbWF5IHJ1biBldmVuIG9uIHNlcnZlciBlbnZpcm9ubWVudHMgaWYgYSBjb21wb25lbnRcbi8vIGp1c3QgaW1wb3J0cyBSZWFjdERPTSAoZS5nLiBmb3IgZmluZERPTU5vZGUpLiBTb21lIGVudmlyb25tZW50cyBtaWdodCBub3Rcbi8vIGhhdmUgc2V0VGltZW91dCBvciBjbGVhclRpbWVvdXQuIEhvd2V2ZXIsIHdlIGFsd2F5cyBleHBlY3QgdGhlbSB0byBiZSBkZWZpbmVkXG4vLyBvbiB0aGUgY2xpZW50LiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvcHVsbC8xMzA4OFxudmFyIGxvY2FsU2V0VGltZW91dCA9IHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nID8gc2V0VGltZW91dCA6IHVuZGVmaW5lZDtcbnZhciBsb2NhbENsZWFyVGltZW91dCA9IHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicgPyBjbGVhclRpbWVvdXQgOiB1bmRlZmluZWQ7XG5cbi8vIFdlIGRvbid0IGV4cGVjdCBlaXRoZXIgb2YgdGhlc2UgdG8gbmVjZXNzYXJpbHkgYmUgZGVmaW5lZCwgYnV0IHdlIHdpbGwgZXJyb3Jcbi8vIGxhdGVyIGlmIHRoZXkgYXJlIG1pc3Npbmcgb24gdGhlIGNsaWVudC5cbnZhciBsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicgPyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiB1bmRlZmluZWQ7XG52YXIgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZSA9IHR5cGVvZiBjYW5jZWxBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJyA/IGNhbmNlbEFuaW1hdGlvbkZyYW1lIDogdW5kZWZpbmVkO1xuXG52YXIgZ2V0Q3VycmVudFRpbWU7XG5cbi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBkb2VzIG5vdCBydW4gd2hlbiB0aGUgdGFiIGlzIGluIHRoZSBiYWNrZ3JvdW5kLiBJZlxuLy8gd2UncmUgYmFja2dyb3VuZGVkIHdlIHByZWZlciBmb3IgdGhhdCB3b3JrIHRvIGhhcHBlbiBzbyB0aGF0IHRoZSBwYWdlXG4vLyBjb250aW51ZXMgdG8gbG9hZCBpbiB0aGUgYmFja2dyb3VuZC4gU28gd2UgYWxzbyBzY2hlZHVsZSBhICdzZXRUaW1lb3V0JyBhc1xuLy8gYSBmYWxsYmFjay5cbi8vIFRPRE86IE5lZWQgYSBiZXR0ZXIgaGV1cmlzdGljIGZvciBiYWNrZ3JvdW5kZWQgd29yay5cbnZhciBBTklNQVRJT05fRlJBTUVfVElNRU9VVCA9IDEwMDtcbnZhciByQUZJRDtcbnZhciByQUZUaW1lb3V0SUQ7XG52YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lV2l0aFRpbWVvdXQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgLy8gc2NoZWR1bGUgckFGIGFuZCBhbHNvIGEgc2V0VGltZW91dFxuICByQUZJRCA9IGxvY2FsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICh0aW1lc3RhbXApIHtcbiAgICAvLyBjYW5jZWwgdGhlIHNldFRpbWVvdXRcbiAgICBsb2NhbENsZWFyVGltZW91dChyQUZUaW1lb3V0SUQpO1xuICAgIGNhbGxiYWNrKHRpbWVzdGFtcCk7XG4gIH0pO1xuICByQUZUaW1lb3V0SUQgPSBsb2NhbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIC8vIGNhbmNlbCB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZShyQUZJRCk7XG4gICAgY2FsbGJhY2soZ2V0Q3VycmVudFRpbWUoKSk7XG4gIH0sIEFOSU1BVElPTl9GUkFNRV9USU1FT1VUKTtcbn07XG5cbmlmIChoYXNOYXRpdmVQZXJmb3JtYW5jZU5vdykge1xuICB2YXIgUGVyZm9ybWFuY2UgPSBwZXJmb3JtYW5jZTtcbiAgZ2V0Q3VycmVudFRpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFBlcmZvcm1hbmNlLm5vdygpO1xuICB9O1xufSBlbHNlIHtcbiAgZ2V0Q3VycmVudFRpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxvY2FsRGF0ZS5ub3coKTtcbiAgfTtcbn1cblxudmFyIHJlcXVlc3RIb3N0Q2FsbGJhY2s7XG52YXIgY2FuY2VsSG9zdENhbGxiYWNrO1xudmFyIHNob3VsZFlpZWxkVG9Ib3N0O1xuXG52YXIgZ2xvYmFsVmFsdWUgPSBudWxsO1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIGdsb2JhbFZhbHVlID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICBnbG9iYWxWYWx1ZSA9IGdsb2JhbDtcbn1cblxuaWYgKGdsb2JhbFZhbHVlICYmIGdsb2JhbFZhbHVlLl9zY2hlZE1vY2spIHtcbiAgLy8gRHluYW1pYyBpbmplY3Rpb24sIG9ubHkgZm9yIHRlc3RpbmcgcHVycG9zZXMuXG4gIHZhciBnbG9iYWxJbXBsID0gZ2xvYmFsVmFsdWUuX3NjaGVkTW9jaztcbiAgcmVxdWVzdEhvc3RDYWxsYmFjayA9IGdsb2JhbEltcGxbMF07XG4gIGNhbmNlbEhvc3RDYWxsYmFjayA9IGdsb2JhbEltcGxbMV07XG4gIHNob3VsZFlpZWxkVG9Ib3N0ID0gZ2xvYmFsSW1wbFsyXTtcbiAgZ2V0Q3VycmVudFRpbWUgPSBnbG9iYWxJbXBsWzNdO1xufSBlbHNlIGlmIChcbi8vIElmIFNjaGVkdWxlciBydW5zIGluIGEgbm9uLURPTSBlbnZpcm9ubWVudCwgaXQgZmFsbHMgYmFjayB0byBhIG5haXZlXG4vLyBpbXBsZW1lbnRhdGlvbiB1c2luZyBzZXRUaW1lb3V0LlxudHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHxcbi8vIENoZWNrIGlmIE1lc3NhZ2VDaGFubmVsIGlzIHN1cHBvcnRlZCwgdG9vLlxudHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAnZnVuY3Rpb24nKSB7XG4gIC8vIElmIHRoaXMgYWNjaWRlbnRhbGx5IGdldHMgaW1wb3J0ZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudCwgZS5nLiBKYXZhU2NyaXB0Q29yZSxcbiAgLy8gZmFsbGJhY2sgdG8gYSBuYWl2ZSBpbXBsZW1lbnRhdGlvbi5cbiAgdmFyIF9jYWxsYmFjayA9IG51bGw7XG4gIHZhciBfZmx1c2hDYWxsYmFjayA9IGZ1bmN0aW9uIChkaWRUaW1lb3V0KSB7XG4gICAgaWYgKF9jYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX2NhbGxiYWNrKGRpZFRpbWVvdXQpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2NhbGxiYWNrID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHJlcXVlc3RIb3N0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoY2IsIG1zKSB7XG4gICAgaWYgKF9jYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgLy8gUHJvdGVjdCBhZ2FpbnN0IHJlLWVudHJhbmN5LlxuICAgICAgc2V0VGltZW91dChyZXF1ZXN0SG9zdENhbGxiYWNrLCAwLCBjYik7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9jYWxsYmFjayA9IGNiO1xuICAgICAgc2V0VGltZW91dChfZmx1c2hDYWxsYmFjaywgMCwgZmFsc2UpO1xuICAgIH1cbiAgfTtcbiAgY2FuY2VsSG9zdENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgIF9jYWxsYmFjayA9IG51bGw7XG4gIH07XG4gIHNob3VsZFlpZWxkVG9Ib3N0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn0gZWxzZSB7XG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBUT0RPOiBSZW1vdmUgZmIubWUgbGlua1xuICAgIGlmICh0eXBlb2YgbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGlzIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IHJlcXVlc3RBbmltYXRpb25GcmFtZS4gXCIgKyAnTWFrZSBzdXJlIHRoYXQgeW91IGxvYWQgYSAnICsgJ3BvbHlmaWxsIGluIG9sZGVyIGJyb3dzZXJzLiBodHRwczovL2ZiLm1lL3JlYWN0LXBvbHlmaWxscycpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxvY2FsQ2FuY2VsQW5pbWF0aW9uRnJhbWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGlzIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGNhbmNlbEFuaW1hdGlvbkZyYW1lLiBcIiArICdNYWtlIHN1cmUgdGhhdCB5b3UgbG9hZCBhICcgKyAncG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vZmIubWUvcmVhY3QtcG9seWZpbGxzJyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IG51bGw7XG4gIHZhciBpc01lc3NhZ2VFdmVudFNjaGVkdWxlZCA9IGZhbHNlO1xuICB2YXIgdGltZW91dFRpbWUgPSAtMTtcblxuICB2YXIgaXNBbmltYXRpb25GcmFtZVNjaGVkdWxlZCA9IGZhbHNlO1xuXG4gIHZhciBpc0ZsdXNoaW5nSG9zdENhbGxiYWNrID0gZmFsc2U7XG5cbiAgdmFyIGZyYW1lRGVhZGxpbmUgPSAwO1xuICAvLyBXZSBzdGFydCBvdXQgYXNzdW1pbmcgdGhhdCB3ZSBydW4gYXQgMzBmcHMgYnV0IHRoZW4gdGhlIGhldXJpc3RpYyB0cmFja2luZ1xuICAvLyB3aWxsIGFkanVzdCB0aGlzIHZhbHVlIHRvIGEgZmFzdGVyIGZwcyBpZiB3ZSBnZXQgbW9yZSBmcmVxdWVudCBhbmltYXRpb25cbiAgLy8gZnJhbWVzLlxuICB2YXIgcHJldmlvdXNGcmFtZVRpbWUgPSAzMztcbiAgdmFyIGFjdGl2ZUZyYW1lVGltZSA9IDMzO1xuXG4gIHNob3VsZFlpZWxkVG9Ib3N0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmcmFtZURlYWRsaW5lIDw9IGdldEN1cnJlbnRUaW1lKCk7XG4gIH07XG5cbiAgLy8gV2UgdXNlIHRoZSBwb3N0TWVzc2FnZSB0cmljayB0byBkZWZlciBpZGxlIHdvcmsgdW50aWwgYWZ0ZXIgdGhlIHJlcGFpbnQuXG4gIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gIHZhciBwb3J0ID0gY2hhbm5lbC5wb3J0MjtcbiAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpc01lc3NhZ2VFdmVudFNjaGVkdWxlZCA9IGZhbHNlO1xuXG4gICAgdmFyIHByZXZTY2hlZHVsZWRDYWxsYmFjayA9IHNjaGVkdWxlZEhvc3RDYWxsYmFjaztcbiAgICB2YXIgcHJldlRpbWVvdXRUaW1lID0gdGltZW91dFRpbWU7XG4gICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gbnVsbDtcbiAgICB0aW1lb3V0VGltZSA9IC0xO1xuXG4gICAgdmFyIGN1cnJlbnRUaW1lID0gZ2V0Q3VycmVudFRpbWUoKTtcblxuICAgIHZhciBkaWRUaW1lb3V0ID0gZmFsc2U7XG4gICAgaWYgKGZyYW1lRGVhZGxpbmUgLSBjdXJyZW50VGltZSA8PSAwKSB7XG4gICAgICAvLyBUaGVyZSdzIG5vIHRpbWUgbGVmdCBpbiB0aGlzIGlkbGUgcGVyaW9kLiBDaGVjayBpZiB0aGUgY2FsbGJhY2sgaGFzXG4gICAgICAvLyBhIHRpbWVvdXQgYW5kIHdoZXRoZXIgaXQncyBiZWVuIGV4Y2VlZGVkLlxuICAgICAgaWYgKHByZXZUaW1lb3V0VGltZSAhPT0gLTEgJiYgcHJldlRpbWVvdXRUaW1lIDw9IGN1cnJlbnRUaW1lKSB7XG4gICAgICAgIC8vIEV4Y2VlZGVkIHRoZSB0aW1lb3V0LiBJbnZva2UgdGhlIGNhbGxiYWNrIGV2ZW4gdGhvdWdoIHRoZXJlJ3Mgbm9cbiAgICAgICAgLy8gdGltZSBsZWZ0LlxuICAgICAgICBkaWRUaW1lb3V0ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIHRpbWVvdXQuXG4gICAgICAgIGlmICghaXNBbmltYXRpb25GcmFtZVNjaGVkdWxlZCkge1xuICAgICAgICAgIC8vIFNjaGVkdWxlIGFub3RoZXIgYW5pbWF0aW9uIGNhbGxiYWNrIHNvIHdlIHJldHJ5IGxhdGVyLlxuICAgICAgICAgIGlzQW5pbWF0aW9uRnJhbWVTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZVdpdGhUaW1lb3V0KGFuaW1hdGlvblRpY2spO1xuICAgICAgICB9XG4gICAgICAgIC8vIEV4aXQgd2l0aG91dCBpbnZva2luZyB0aGUgY2FsbGJhY2suXG4gICAgICAgIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IHByZXZTY2hlZHVsZWRDYWxsYmFjaztcbiAgICAgICAgdGltZW91dFRpbWUgPSBwcmV2VGltZW91dFRpbWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJldlNjaGVkdWxlZENhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICBpc0ZsdXNoaW5nSG9zdENhbGxiYWNrID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHByZXZTY2hlZHVsZWRDYWxsYmFjayhkaWRUaW1lb3V0KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlzRmx1c2hpbmdIb3N0Q2FsbGJhY2sgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIGFuaW1hdGlvblRpY2sgPSBmdW5jdGlvbiAocmFmVGltZSkge1xuICAgIGlmIChzY2hlZHVsZWRIb3N0Q2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgIC8vIEVhZ2VybHkgc2NoZWR1bGUgdGhlIG5leHQgYW5pbWF0aW9uIGNhbGxiYWNrIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlXG4gICAgICAvLyBmcmFtZS4gSWYgdGhlIHNjaGVkdWxlciBxdWV1ZSBpcyBub3QgZW1wdHkgYXQgdGhlIGVuZCBvZiB0aGUgZnJhbWUsIGl0XG4gICAgICAvLyB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGluc2lkZSB0aGF0IGNhbGxiYWNrLiBJZiB0aGUgcXVldWUgKmlzKiBlbXB0eSxcbiAgICAgIC8vIHRoZW4gaXQgd2lsbCBleGl0IGltbWVkaWF0ZWx5LiBQb3N0aW5nIHRoZSBjYWxsYmFjayBhdCB0aGUgc3RhcnQgb2YgdGhlXG4gICAgICAvLyBmcmFtZSBlbnN1cmVzIGl0J3MgZmlyZWQgd2l0aGluIHRoZSBlYXJsaWVzdCBwb3NzaWJsZSBmcmFtZS4gSWYgd2VcbiAgICAgIC8vIHdhaXRlZCB1bnRpbCB0aGUgZW5kIG9mIHRoZSBmcmFtZSB0byBwb3N0IHRoZSBjYWxsYmFjaywgd2UgcmlzayB0aGVcbiAgICAgIC8vIGJyb3dzZXIgc2tpcHBpbmcgYSBmcmFtZSBhbmQgbm90IGZpcmluZyB0aGUgY2FsbGJhY2sgdW50aWwgdGhlIGZyYW1lXG4gICAgICAvLyBhZnRlciB0aGF0LlxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lV2l0aFRpbWVvdXQoYW5pbWF0aW9uVGljayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHBlbmRpbmcgd29yay4gRXhpdC5cbiAgICAgIGlzQW5pbWF0aW9uRnJhbWVTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEZyYW1lVGltZSA9IHJhZlRpbWUgLSBmcmFtZURlYWRsaW5lICsgYWN0aXZlRnJhbWVUaW1lO1xuICAgIGlmIChuZXh0RnJhbWVUaW1lIDwgYWN0aXZlRnJhbWVUaW1lICYmIHByZXZpb3VzRnJhbWVUaW1lIDwgYWN0aXZlRnJhbWVUaW1lKSB7XG4gICAgICBpZiAobmV4dEZyYW1lVGltZSA8IDgpIHtcbiAgICAgICAgLy8gRGVmZW5zaXZlIGNvZGluZy4gV2UgZG9uJ3Qgc3VwcG9ydCBoaWdoZXIgZnJhbWUgcmF0ZXMgdGhhbiAxMjBoei5cbiAgICAgICAgLy8gSWYgdGhlIGNhbGN1bGF0ZWQgZnJhbWUgdGltZSBnZXRzIGxvd2VyIHRoYW4gOCwgaXQgaXMgcHJvYmFibHkgYSBidWcuXG4gICAgICAgIG5leHRGcmFtZVRpbWUgPSA4O1xuICAgICAgfVxuICAgICAgLy8gSWYgb25lIGZyYW1lIGdvZXMgbG9uZywgdGhlbiB0aGUgbmV4dCBvbmUgY2FuIGJlIHNob3J0IHRvIGNhdGNoIHVwLlxuICAgICAgLy8gSWYgdHdvIGZyYW1lcyBhcmUgc2hvcnQgaW4gYSByb3csIHRoZW4gdGhhdCdzIGFuIGluZGljYXRpb24gdGhhdCB3ZVxuICAgICAgLy8gYWN0dWFsbHkgaGF2ZSBhIGhpZ2hlciBmcmFtZSByYXRlIHRoYW4gd2hhdCB3ZSdyZSBjdXJyZW50bHkgb3B0aW1pemluZy5cbiAgICAgIC8vIFdlIGFkanVzdCBvdXIgaGV1cmlzdGljIGR5bmFtaWNhbGx5IGFjY29yZGluZ2x5LiBGb3IgZXhhbXBsZSwgaWYgd2UncmVcbiAgICAgIC8vIHJ1bm5pbmcgb24gMTIwaHogZGlzcGxheSBvciA5MGh6IFZSIGRpc3BsYXkuXG4gICAgICAvLyBUYWtlIHRoZSBtYXggb2YgdGhlIHR3byBpbiBjYXNlIG9uZSBvZiB0aGVtIHdhcyBhbiBhbm9tYWx5IGR1ZSB0b1xuICAgICAgLy8gbWlzc2VkIGZyYW1lIGRlYWRsaW5lcy5cbiAgICAgIGFjdGl2ZUZyYW1lVGltZSA9IG5leHRGcmFtZVRpbWUgPCBwcmV2aW91c0ZyYW1lVGltZSA/IHByZXZpb3VzRnJhbWVUaW1lIDogbmV4dEZyYW1lVGltZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldmlvdXNGcmFtZVRpbWUgPSBuZXh0RnJhbWVUaW1lO1xuICAgIH1cbiAgICBmcmFtZURlYWRsaW5lID0gcmFmVGltZSArIGFjdGl2ZUZyYW1lVGltZTtcbiAgICBpZiAoIWlzTWVzc2FnZUV2ZW50U2NoZWR1bGVkKSB7XG4gICAgICBpc01lc3NhZ2VFdmVudFNjaGVkdWxlZCA9IHRydWU7XG4gICAgICBwb3J0LnBvc3RNZXNzYWdlKHVuZGVmaW5lZCk7XG4gICAgfVxuICB9O1xuXG4gIHJlcXVlc3RIb3N0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGFic29sdXRlVGltZW91dCkge1xuICAgIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRpbWVvdXRUaW1lID0gYWJzb2x1dGVUaW1lb3V0O1xuICAgIGlmIChpc0ZsdXNoaW5nSG9zdENhbGxiYWNrIHx8IGFic29sdXRlVGltZW91dCA8IDApIHtcbiAgICAgIC8vIERvbid0IHdhaXQgZm9yIHRoZSBuZXh0IGZyYW1lLiBDb250aW51ZSB3b3JraW5nIEFTQVAsIGluIGEgbmV3IGV2ZW50LlxuICAgICAgcG9ydC5wb3N0TWVzc2FnZSh1bmRlZmluZWQpO1xuICAgIH0gZWxzZSBpZiAoIWlzQW5pbWF0aW9uRnJhbWVTY2hlZHVsZWQpIHtcbiAgICAgIC8vIElmIHJBRiBkaWRuJ3QgYWxyZWFkeSBzY2hlZHVsZSBvbmUsIHdlIG5lZWQgdG8gc2NoZWR1bGUgYSBmcmFtZS5cbiAgICAgIC8vIFRPRE86IElmIHRoaXMgckFGIGRvZXNuJ3QgbWF0ZXJpYWxpemUgYmVjYXVzZSB0aGUgYnJvd3NlciB0aHJvdHRsZXMsIHdlXG4gICAgICAvLyBtaWdodCB3YW50IHRvIHN0aWxsIGhhdmUgc2V0VGltZW91dCB0cmlnZ2VyIHJJQyBhcyBhIGJhY2t1cCB0byBlbnN1cmVcbiAgICAgIC8vIHRoYXQgd2Uga2VlcCBwZXJmb3JtaW5nIHdvcmsuXG4gICAgICBpc0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZVdpdGhUaW1lb3V0KGFuaW1hdGlvblRpY2spO1xuICAgIH1cbiAgfTtcblxuICBjYW5jZWxIb3N0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gbnVsbDtcbiAgICBpc01lc3NhZ2VFdmVudFNjaGVkdWxlZCA9IGZhbHNlO1xuICAgIHRpbWVvdXRUaW1lID0gLTE7XG4gIH07XG59XG5cbi8vIEhlbHBzIGlkZW50aWZ5IHNpZGUgZWZmZWN0cyBpbiBiZWdpbi1waGFzZSBsaWZlY3ljbGUgaG9va3MgYW5kIHNldFN0YXRlIHJlZHVjZXJzOlxuXG5cbi8vIEluIHNvbWUgY2FzZXMsIFN0cmljdE1vZGUgc2hvdWxkIGFsc28gZG91YmxlLXJlbmRlciBsaWZlY3ljbGVzLlxuLy8gVGhpcyBjYW4gYmUgY29uZnVzaW5nIGZvciB0ZXN0cyB0aG91Z2gsXG4vLyBBbmQgaXQgY2FuIGJlIGJhZCBmb3IgcGVyZm9ybWFuY2UgaW4gcHJvZHVjdGlvbi5cbi8vIFRoaXMgZmVhdHVyZSBmbGFnIGNhbiBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIGJlaGF2aW9yOlxuXG5cbi8vIFRvIHByZXNlcnZlIHRoZSBcIlBhdXNlIG9uIGNhdWdodCBleGNlcHRpb25zXCIgYmVoYXZpb3Igb2YgdGhlIGRlYnVnZ2VyLCB3ZVxuLy8gcmVwbGF5IHRoZSBiZWdpbiBwaGFzZSBvZiBhIGZhaWxlZCBjb21wb25lbnQgaW5zaWRlIGludm9rZUd1YXJkZWRDYWxsYmFjay5cblxuXG4vLyBXYXJuIGFib3V0IGRlcHJlY2F0ZWQsIGFzeW5jLXVuc2FmZSBsaWZlY3ljbGVzOyByZWxhdGVzIHRvIFJGQyAjNjpcblxuXG4vLyBHYXRoZXIgYWR2YW5jZWQgdGltaW5nIG1ldHJpY3MgZm9yIFByb2ZpbGVyIHN1YnRyZWVzLlxuXG5cbi8vIFRyYWNlIHdoaWNoIGludGVyYWN0aW9ucyB0cmlnZ2VyIGVhY2ggY29tbWl0LlxudmFyIGVuYWJsZVNjaGVkdWxlclRyYWNpbmcgPSB0cnVlO1xuXG4vLyBPbmx5IHVzZWQgaW4gd3d3IGJ1aWxkcy5cbiAvLyBUT0RPOiB0cnVlPyBIZXJlIGl0IG1pZ2h0IGp1c3QgYmUgZmFsc2UuXG5cbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuXG5cbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuXG5cbi8vIFJlYWN0IEZpcmU6IHByZXZlbnQgdGhlIHZhbHVlIGFuZCBjaGVja2VkIGF0dHJpYnV0ZXMgZnJvbSBzeW5jaW5nXG4vLyB3aXRoIHRoZWlyIHJlbGF0ZWQgRE9NIHByb3BlcnRpZXNcblxuXG4vLyBUaGVzZSBBUElzIHdpbGwgbm8gbG9uZ2VyIGJlIFwidW5zdGFibGVcIiBpbiB0aGUgdXBjb21pbmcgMTYuNyByZWxlYXNlLFxuLy8gQ29udHJvbCB0aGlzIGJlaGF2aW9yIHdpdGggYSBmbGFnIHRvIHN1cHBvcnQgMTYuNiBtaW5vciByZWxlYXNlcyBpbiB0aGUgbWVhbndoaWxlLlxudmFyIGVuYWJsZVN0YWJsZUNvbmN1cnJlbnRNb2RlQVBJcyA9IGZhbHNlO1xuXG52YXIgREVGQVVMVF9USFJFQURfSUQgPSAwO1xuXG4vLyBDb3VudGVycyB1c2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRHMuXG52YXIgaW50ZXJhY3Rpb25JRENvdW50ZXIgPSAwO1xudmFyIHRocmVhZElEQ291bnRlciA9IDA7XG5cbi8vIFNldCBvZiBjdXJyZW50bHkgdHJhY2VkIGludGVyYWN0aW9ucy5cbi8vIEludGVyYWN0aW9ucyBcInN0YWNrXCLigJNcbi8vIE1lYW5pbmcgdGhhdCBuZXdseSB0cmFjZWQgaW50ZXJhY3Rpb25zIGFyZSBhcHBlbmRlZCB0byB0aGUgcHJldmlvdXNseSBhY3RpdmUgc2V0LlxuLy8gV2hlbiBhbiBpbnRlcmFjdGlvbiBnb2VzIG91dCBvZiBzY29wZSwgdGhlIHByZXZpb3VzIHNldCAoaWYgYW55KSBpcyByZXN0b3JlZC5cbnZhciBpbnRlcmFjdGlvbnNSZWYgPSBudWxsO1xuXG4vLyBMaXN0ZW5lcihzKSB0byBub3RpZnkgd2hlbiBpbnRlcmFjdGlvbnMgYmVnaW4gYW5kIGVuZC5cbnZhciBzdWJzY3JpYmVyUmVmID0gbnVsbDtcblxuaWYgKGVuYWJsZVNjaGVkdWxlclRyYWNpbmcpIHtcbiAgaW50ZXJhY3Rpb25zUmVmID0ge1xuICAgIGN1cnJlbnQ6IG5ldyBTZXQoKVxuICB9O1xuICBzdWJzY3JpYmVyUmVmID0ge1xuICAgIGN1cnJlbnQ6IG51bGxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfY2xlYXIoY2FsbGJhY2spIHtcbiAgaWYgKCFlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICB2YXIgcHJldkludGVyYWN0aW9ucyA9IGludGVyYWN0aW9uc1JlZi5jdXJyZW50O1xuICBpbnRlcmFjdGlvbnNSZWYuY3VycmVudCA9IG5ldyBTZXQoKTtcblxuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9IGZpbmFsbHkge1xuICAgIGludGVyYWN0aW9uc1JlZi5jdXJyZW50ID0gcHJldkludGVyYWN0aW9ucztcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9nZXRDdXJyZW50KCkge1xuICBpZiAoIWVuYWJsZVNjaGVkdWxlclRyYWNpbmcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfZ2V0VGhyZWFkSUQoKSB7XG4gIHJldHVybiArK3RocmVhZElEQ291bnRlcjtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfdHJhY2UobmFtZSwgdGltZXN0YW1wLCBjYWxsYmFjaykge1xuICB2YXIgdGhyZWFkSUQgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IERFRkFVTFRfVEhSRUFEX0lEO1xuXG4gIGlmICghZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9XG5cbiAgdmFyIGludGVyYWN0aW9uID0ge1xuICAgIF9fY291bnQ6IDEsXG4gICAgaWQ6IGludGVyYWN0aW9uSURDb3VudGVyKyssXG4gICAgbmFtZTogbmFtZSxcbiAgICB0aW1lc3RhbXA6IHRpbWVzdGFtcFxuICB9O1xuXG4gIHZhciBwcmV2SW50ZXJhY3Rpb25zID0gaW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQ7XG5cbiAgLy8gVHJhY2VkIGludGVyYWN0aW9ucyBzaG91bGQgc3RhY2svYWNjdW11bGF0ZS5cbiAgLy8gVG8gZG8gdGhhdCwgY2xvbmUgdGhlIGN1cnJlbnQgaW50ZXJhY3Rpb25zLlxuICAvLyBUaGUgcHJldmlvdXMgc2V0IHdpbGwgYmUgcmVzdG9yZWQgdXBvbiBjb21wbGV0aW9uLlxuICB2YXIgaW50ZXJhY3Rpb25zID0gbmV3IFNldChwcmV2SW50ZXJhY3Rpb25zKTtcbiAgaW50ZXJhY3Rpb25zLmFkZChpbnRlcmFjdGlvbik7XG4gIGludGVyYWN0aW9uc1JlZi5jdXJyZW50ID0gaW50ZXJhY3Rpb25zO1xuXG4gIHZhciBzdWJzY3JpYmVyID0gc3Vic2NyaWJlclJlZi5jdXJyZW50O1xuICB2YXIgcmV0dXJuVmFsdWUgPSB2b2lkIDA7XG5cbiAgdHJ5IHtcbiAgICBpZiAoc3Vic2NyaWJlciAhPT0gbnVsbCkge1xuICAgICAgc3Vic2NyaWJlci5vbkludGVyYWN0aW9uVHJhY2VkKGludGVyYWN0aW9uKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XG4gICAgICAgIHN1YnNjcmliZXIub25Xb3JrU3RhcnRlZChpbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuVmFsdWUgPSBjYWxsYmFjaygpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQgPSBwcmV2SW50ZXJhY3Rpb25zO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25Xb3JrU3RvcHBlZChpbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaW50ZXJhY3Rpb24uX19jb3VudC0tO1xuXG4gICAgICAgICAgLy8gSWYgbm8gYXN5bmMgd29yayB3YXMgc2NoZWR1bGVkIGZvciB0aGlzIGludGVyYWN0aW9uLFxuICAgICAgICAgIC8vIE5vdGlmeSBzdWJzY3JpYmVycyB0aGF0IGl0J3MgY29tcGxldGVkLlxuICAgICAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsICYmIGludGVyYWN0aW9uLl9fY291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfd3JhcChjYWxsYmFjaykge1xuICB2YXIgdGhyZWFkSUQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IERFRkFVTFRfVEhSRUFEX0lEO1xuXG4gIGlmICghZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICAgIHJldHVybiBjYWxsYmFjaztcbiAgfVxuXG4gIHZhciB3cmFwcGVkSW50ZXJhY3Rpb25zID0gaW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQ7XG5cbiAgdmFyIHN1YnNjcmliZXIgPSBzdWJzY3JpYmVyUmVmLmN1cnJlbnQ7XG4gIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XG4gICAgc3Vic2NyaWJlci5vbldvcmtTY2hlZHVsZWQod3JhcHBlZEludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICB9XG5cbiAgLy8gVXBkYXRlIHRoZSBwZW5kaW5nIGFzeW5jIHdvcmsgY291bnQgZm9yIHRoZSBjdXJyZW50IGludGVyYWN0aW9ucy5cbiAgLy8gVXBkYXRlIGFmdGVyIGNhbGxpbmcgc3Vic2NyaWJlcnMgaW4gY2FzZSBvZiBlcnJvci5cbiAgd3JhcHBlZEludGVyYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnRlcmFjdGlvbikge1xuICAgIGludGVyYWN0aW9uLl9fY291bnQrKztcbiAgfSk7XG5cbiAgdmFyIGhhc1J1biA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIHdyYXBwZWQoKSB7XG4gICAgdmFyIHByZXZJbnRlcmFjdGlvbnMgPSBpbnRlcmFjdGlvbnNSZWYuY3VycmVudDtcbiAgICBpbnRlcmFjdGlvbnNSZWYuY3VycmVudCA9IHdyYXBwZWRJbnRlcmFjdGlvbnM7XG5cbiAgICBzdWJzY3JpYmVyID0gc3Vic2NyaWJlclJlZi5jdXJyZW50O1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZXR1cm5WYWx1ZSA9IHZvaWQgMDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLm9uV29ya1N0YXJ0ZWQod3JhcHBlZEludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgICAgICB9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGludGVyYWN0aW9uc1JlZi5jdXJyZW50ID0gcHJldkludGVyYWN0aW9ucztcblxuICAgICAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm9uV29ya1N0b3BwZWQod3JhcHBlZEludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICghaGFzUnVuKSB7XG4gICAgICAgIC8vIFdlIG9ubHkgZXhwZWN0IGEgd3JhcHBlZCBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbmNlLFxuICAgICAgICAvLyBCdXQgaW4gdGhlIGV2ZW50IHRoYXQgaXQncyBleGVjdXRlZCBtb3JlIHRoYW4gb25jZeKAk1xuICAgICAgICAvLyBPbmx5IGRlY3JlbWVudCB0aGUgb3V0c3RhbmRpbmcgaW50ZXJhY3Rpb24gY291bnRzIG9uY2UuXG4gICAgICAgIGhhc1J1biA9IHRydWU7XG5cbiAgICAgICAgLy8gVXBkYXRlIHBlbmRpbmcgYXN5bmMgY291bnRzIGZvciBhbGwgd3JhcHBlZCBpbnRlcmFjdGlvbnMuXG4gICAgICAgIC8vIElmIHRoaXMgd2FzIHRoZSBsYXN0IHNjaGVkdWxlZCBhc3luYyB3b3JrIGZvciBhbnkgb2YgdGhlbSxcbiAgICAgICAgLy8gTWFyayB0aGVtIGFzIGNvbXBsZXRlZC5cbiAgICAgICAgd3JhcHBlZEludGVyYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnRlcmFjdGlvbikge1xuICAgICAgICAgIGludGVyYWN0aW9uLl9fY291bnQtLTtcblxuICAgICAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsICYmIGludGVyYWN0aW9uLl9fY291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd3JhcHBlZC5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgc3Vic2NyaWJlciA9IHN1YnNjcmliZXJSZWYuY3VycmVudDtcblxuICAgIHRyeSB7XG4gICAgICBpZiAoc3Vic2NyaWJlciAhPT0gbnVsbCkge1xuICAgICAgICBzdWJzY3JpYmVyLm9uV29ya0NhbmNlbGVkKHdyYXBwZWRJbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgLy8gVXBkYXRlIHBlbmRpbmcgYXN5bmMgY291bnRzIGZvciBhbGwgd3JhcHBlZCBpbnRlcmFjdGlvbnMuXG4gICAgICAvLyBJZiB0aGlzIHdhcyB0aGUgbGFzdCBzY2hlZHVsZWQgYXN5bmMgd29yayBmb3IgYW55IG9mIHRoZW0sXG4gICAgICAvLyBNYXJrIHRoZW0gYXMgY29tcGxldGVkLlxuICAgICAgd3JhcHBlZEludGVyYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnRlcmFjdGlvbikge1xuICAgICAgICBpbnRlcmFjdGlvbi5fX2NvdW50LS07XG5cbiAgICAgICAgaWYgKHN1YnNjcmliZXIgJiYgaW50ZXJhY3Rpb24uX19jb3VudCA9PT0gMCkge1xuICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHdyYXBwZWQ7XG59XG5cbnZhciBzdWJzY3JpYmVycyA9IG51bGw7XG5pZiAoZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICBzdWJzY3JpYmVycyA9IG5ldyBTZXQoKTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgaWYgKGVuYWJsZVNjaGVkdWxlclRyYWNpbmcpIHtcbiAgICBzdWJzY3JpYmVycy5hZGQoc3Vic2NyaWJlcik7XG5cbiAgICBpZiAoc3Vic2NyaWJlcnMuc2l6ZSA9PT0gMSkge1xuICAgICAgc3Vic2NyaWJlclJlZi5jdXJyZW50ID0ge1xuICAgICAgICBvbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZDogb25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQsXG4gICAgICAgIG9uSW50ZXJhY3Rpb25UcmFjZWQ6IG9uSW50ZXJhY3Rpb25UcmFjZWQsXG4gICAgICAgIG9uV29ya0NhbmNlbGVkOiBvbldvcmtDYW5jZWxlZCxcbiAgICAgICAgb25Xb3JrU2NoZWR1bGVkOiBvbldvcmtTY2hlZHVsZWQsXG4gICAgICAgIG9uV29ya1N0YXJ0ZWQ6IG9uV29ya1N0YXJ0ZWQsXG4gICAgICAgIG9uV29ya1N0b3BwZWQ6IG9uV29ya1N0b3BwZWRcbiAgICAgIH07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3Vuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgaWYgKGVuYWJsZVNjaGVkdWxlclRyYWNpbmcpIHtcbiAgICBzdWJzY3JpYmVycy5kZWxldGUoc3Vic2NyaWJlcik7XG5cbiAgICBpZiAoc3Vic2NyaWJlcnMuc2l6ZSA9PT0gMCkge1xuICAgICAgc3Vic2NyaWJlclJlZi5jdXJyZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb25JbnRlcmFjdGlvblRyYWNlZChpbnRlcmFjdGlvbikge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICB0cnkge1xuICAgICAgc3Vic2NyaWJlci5vbkludGVyYWN0aW9uVHJhY2VkKGludGVyYWN0aW9uKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKCFkaWRDYXRjaEVycm9yKSB7XG4gICAgICAgIGRpZENhdGNoRXJyb3IgPSB0cnVlO1xuICAgICAgICBjYXVnaHRFcnJvciA9IGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGRpZENhdGNoRXJyb3IpIHtcbiAgICB0aHJvdyBjYXVnaHRFcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZChpbnRlcmFjdGlvbikge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICB0cnkge1xuICAgICAgc3Vic2NyaWJlci5vbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZChpbnRlcmFjdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xuICAgICAgICBkaWRDYXRjaEVycm9yID0gdHJ1ZTtcbiAgICAgICAgY2F1Z2h0RXJyb3IgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGlmIChkaWRDYXRjaEVycm9yKSB7XG4gICAgdGhyb3cgY2F1Z2h0RXJyb3I7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25Xb3JrU2NoZWR1bGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpIHtcbiAgdmFyIGRpZENhdGNoRXJyb3IgPSBmYWxzZTtcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcblxuICBzdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN1YnNjcmliZXIub25Xb3JrU2NoZWR1bGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoIWRpZENhdGNoRXJyb3IpIHtcbiAgICAgICAgZGlkQ2F0Y2hFcnJvciA9IHRydWU7XG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpZiAoZGlkQ2F0Y2hFcnJvcikge1xuICAgIHRocm93IGNhdWdodEVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9uV29ya1N0YXJ0ZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICB0cnkge1xuICAgICAgc3Vic2NyaWJlci5vbldvcmtTdGFydGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoIWRpZENhdGNoRXJyb3IpIHtcbiAgICAgICAgZGlkQ2F0Y2hFcnJvciA9IHRydWU7XG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpZiAoZGlkQ2F0Y2hFcnJvcikge1xuICAgIHRocm93IGNhdWdodEVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9uV29ya1N0b3BwZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICB0cnkge1xuICAgICAgc3Vic2NyaWJlci5vbldvcmtTdG9wcGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoIWRpZENhdGNoRXJyb3IpIHtcbiAgICAgICAgZGlkQ2F0Y2hFcnJvciA9IHRydWU7XG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpZiAoZGlkQ2F0Y2hFcnJvcikge1xuICAgIHRocm93IGNhdWdodEVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9uV29ya0NhbmNlbGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpIHtcbiAgdmFyIGRpZENhdGNoRXJyb3IgPSBmYWxzZTtcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcblxuICBzdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN1YnNjcmliZXIub25Xb3JrQ2FuY2VsZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xuICAgICAgICBkaWRDYXRjaEVycm9yID0gdHJ1ZTtcbiAgICAgICAgY2F1Z2h0RXJyb3IgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGlmIChkaWRDYXRjaEVycm9yKSB7XG4gICAgdGhyb3cgY2F1Z2h0RXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBkaXNwYXRjaGVyLlxuICovXG52YXIgUmVhY3RDdXJyZW50RGlzcGF0Y2hlciA9IHtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAdHlwZSB7UmVhY3RDb21wb25lbnR9XG4gICAqL1xuICBjdXJyZW50OiBudWxsXG59O1xuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IG93bmVyLlxuICpcbiAqIFRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBjb21wb25lbnQgd2hvIHNob3VsZCBvd24gYW55IGNvbXBvbmVudHMgdGhhdCBhcmVcbiAqIGN1cnJlbnRseSBiZWluZyBjb25zdHJ1Y3RlZC5cbiAqL1xudmFyIFJlYWN0Q3VycmVudE93bmVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcbn07XG5cbnZhciBCRUZPUkVfU0xBU0hfUkUgPSAvXiguKilbXFxcXFxcL10vO1xuXG52YXIgZGVzY3JpYmVDb21wb25lbnRGcmFtZSA9IGZ1bmN0aW9uIChuYW1lLCBzb3VyY2UsIG93bmVyTmFtZSkge1xuICB2YXIgc291cmNlSW5mbyA9ICcnO1xuICBpZiAoc291cmNlKSB7XG4gICAgdmFyIHBhdGggPSBzb3VyY2UuZmlsZU5hbWU7XG4gICAgdmFyIGZpbGVOYW1lID0gcGF0aC5yZXBsYWNlKEJFRk9SRV9TTEFTSF9SRSwgJycpO1xuICAgIHtcbiAgICAgIC8vIEluIERFViwgaW5jbHVkZSBjb2RlIGZvciBhIGNvbW1vbiBzcGVjaWFsIGNhc2U6XG4gICAgICAvLyBwcmVmZXIgXCJmb2xkZXIvaW5kZXguanNcIiBpbnN0ZWFkIG9mIGp1c3QgXCJpbmRleC5qc1wiLlxuICAgICAgaWYgKC9eaW5kZXhcXC4vLnRlc3QoZmlsZU5hbWUpKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHBhdGgubWF0Y2goQkVGT1JFX1NMQVNIX1JFKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgdmFyIHBhdGhCZWZvcmVTbGFzaCA9IG1hdGNoWzFdO1xuICAgICAgICAgIGlmIChwYXRoQmVmb3JlU2xhc2gpIHtcbiAgICAgICAgICAgIHZhciBmb2xkZXJOYW1lID0gcGF0aEJlZm9yZVNsYXNoLnJlcGxhY2UoQkVGT1JFX1NMQVNIX1JFLCAnJyk7XG4gICAgICAgICAgICBmaWxlTmFtZSA9IGZvbGRlck5hbWUgKyAnLycgKyBmaWxlTmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgc291cmNlSW5mbyA9ICcgKGF0ICcgKyBmaWxlTmFtZSArICc6JyArIHNvdXJjZS5saW5lTnVtYmVyICsgJyknO1xuICB9IGVsc2UgaWYgKG93bmVyTmFtZSkge1xuICAgIHNvdXJjZUluZm8gPSAnIChjcmVhdGVkIGJ5ICcgKyBvd25lck5hbWUgKyAnKSc7XG4gIH1cbiAgcmV0dXJuICdcXG4gICAgaW4gJyArIChuYW1lIHx8ICdVbmtub3duJykgKyBzb3VyY2VJbmZvO1xufTtcblxudmFyIFJlc29sdmVkID0gMTtcblxuXG5mdW5jdGlvbiByZWZpbmVSZXNvbHZlZExhenlDb21wb25lbnQobGF6eUNvbXBvbmVudCkge1xuICByZXR1cm4gbGF6eUNvbXBvbmVudC5fc3RhdHVzID09PSBSZXNvbHZlZCA/IGxhenlDb21wb25lbnQuX3Jlc3VsdCA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFdyYXBwZWROYW1lKG91dGVyVHlwZSwgaW5uZXJUeXBlLCB3cmFwcGVyTmFtZSkge1xuICB2YXIgZnVuY3Rpb25OYW1lID0gaW5uZXJUeXBlLmRpc3BsYXlOYW1lIHx8IGlubmVyVHlwZS5uYW1lIHx8ICcnO1xuICByZXR1cm4gb3V0ZXJUeXBlLmRpc3BsYXlOYW1lIHx8IChmdW5jdGlvbk5hbWUgIT09ICcnID8gd3JhcHBlck5hbWUgKyAnKCcgKyBmdW5jdGlvbk5hbWUgKyAnKScgOiB3cmFwcGVyTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWUodHlwZSkge1xuICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgLy8gSG9zdCByb290LCB0ZXh0IG5vZGUgb3IganVzdCBpbnZhbGlkIHR5cGUuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAge1xuICAgIGlmICh0eXBlb2YgdHlwZS50YWcgPT09ICdudW1iZXInKSB7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdSZWNlaXZlZCBhbiB1bmV4cGVjdGVkIG9iamVjdCBpbiBnZXRDb21wb25lbnROYW1lKCkuICcgKyAnVGhpcyBpcyBsaWtlbHkgYSBidWcgaW4gUmVhY3QuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLicpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgfVxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTpcbiAgICAgIHJldHVybiAnQ29uY3VycmVudE1vZGUnO1xuICAgIGNhc2UgUkVBQ1RfRlJBR01FTlRfVFlQRTpcbiAgICAgIHJldHVybiAnRnJhZ21lbnQnO1xuICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICByZXR1cm4gJ1BvcnRhbCc7XG4gICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgcmV0dXJuICdQcm9maWxlcic7XG4gICAgY2FzZSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFOlxuICAgICAgcmV0dXJuICdTdHJpY3RNb2RlJztcbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICByZXR1cm4gJ1N1c3BlbnNlJztcbiAgfVxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgc3dpdGNoICh0eXBlLiQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgcmV0dXJuICdDb250ZXh0LkNvbnN1bWVyJztcbiAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgcmV0dXJuICdDb250ZXh0LlByb3ZpZGVyJztcbiAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldFdyYXBwZWROYW1lKHR5cGUsIHR5cGUucmVuZGVyLCAnRm9yd2FyZFJlZicpO1xuICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHR5cGUudHlwZSk7XG4gICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciB0aGVuYWJsZSA9IHR5cGU7XG4gICAgICAgICAgdmFyIHJlc29sdmVkVGhlbmFibGUgPSByZWZpbmVSZXNvbHZlZExhenlDb21wb25lbnQodGhlbmFibGUpO1xuICAgICAgICAgIGlmIChyZXNvbHZlZFRoZW5hYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZShyZXNvbHZlZFRoZW5hYmxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbnZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0ge307XG5cbnZhciBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCA9IG51bGw7XG5cbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpIHtcbiAge1xuICAgIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50ID0gZWxlbWVudDtcbiAgfVxufVxuXG57XG4gIC8vIFN0YWNrIGltcGxlbWVudGF0aW9uIGluamVjdGVkIGJ5IHRoZSBjdXJyZW50IHJlbmRlcmVyLlxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjayA9IG51bGw7XG5cbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGFjayA9ICcnO1xuXG4gICAgLy8gQWRkIGFuIGV4dHJhIHRvcCBmcmFtZSB3aGlsZSBhbiBlbGVtZW50IGlzIGJlaW5nIHZhbGlkYXRlZFxuICAgIGlmIChjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCkge1xuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50LnR5cGUpO1xuICAgICAgdmFyIG93bmVyID0gY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQuX293bmVyO1xuICAgICAgc3RhY2sgKz0gZGVzY3JpYmVDb21wb25lbnRGcmFtZShuYW1lLCBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC5fc291cmNlLCBvd25lciAmJiBnZXRDb21wb25lbnROYW1lKG93bmVyLnR5cGUpKTtcbiAgICB9XG5cbiAgICAvLyBEZWxlZ2F0ZSB0byB0aGUgaW5qZWN0ZWQgcmVuZGVyZXItc3BlY2lmaWMgaW1wbGVtZW50YXRpb25cbiAgICB2YXIgaW1wbCA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0Q3VycmVudFN0YWNrO1xuICAgIGlmIChpbXBsKSB7XG4gICAgICBzdGFjayArPSBpbXBsKCkgfHwgJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YWNrO1xuICB9O1xufVxuXG52YXIgUmVhY3RTaGFyZWRJbnRlcm5hbHMgPSB7XG4gIFJlYWN0Q3VycmVudERpc3BhdGNoZXI6IFJlYWN0Q3VycmVudERpc3BhdGNoZXIsXG4gIFJlYWN0Q3VycmVudE93bmVyOiBSZWFjdEN1cnJlbnRPd25lcixcbiAgLy8gVXNlZCBieSByZW5kZXJlcnMgdG8gYXZvaWQgYnVuZGxpbmcgb2JqZWN0LWFzc2lnbiB0d2ljZSBpbiBVTUQgYnVuZGxlczpcbiAgYXNzaWduOiBvYmplY3RBc3NpZ25cbn07XG5cbntcbiAgLy8gUmUtZXhwb3J0IHRoZSBzY2hlZHVsZSBBUEkocykgZm9yIFVNRCBidW5kbGVzLlxuICAvLyBUaGlzIGF2b2lkcyBpbnRyb2R1Y2luZyBhIGRlcGVuZGVuY3kgb24gYSBuZXcgVU1EIGdsb2JhbCBpbiBhIG1pbm9yIHVwZGF0ZSxcbiAgLy8gU2luY2UgdGhhdCB3b3VsZCBiZSBhIGJyZWFraW5nIGNoYW5nZSAoZS5nLiBmb3IgYWxsIGV4aXN0aW5nIENvZGVTYW5kYm94ZXMpLlxuICAvLyBUaGlzIHJlLWV4cG9ydCBpcyBvbmx5IHJlcXVpcmVkIGZvciBVTUQgYnVuZGxlcztcbiAgLy8gQ0pTIGJ1bmRsZXMgdXNlIHRoZSBzaGFyZWQgTlBNIHBhY2thZ2UuXG4gIG9iamVjdEFzc2lnbihSZWFjdFNoYXJlZEludGVybmFscywge1xuICAgIFNjaGVkdWxlcjoge1xuICAgICAgdW5zdGFibGVfY2FuY2VsQ2FsbGJhY2s6IHVuc3RhYmxlX2NhbmNlbENhbGxiYWNrLFxuICAgICAgdW5zdGFibGVfc2hvdWxkWWllbGQ6IHVuc3RhYmxlX3Nob3VsZFlpZWxkLFxuICAgICAgdW5zdGFibGVfbm93OiBnZXRDdXJyZW50VGltZSxcbiAgICAgIHVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2s6IHVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2ssXG4gICAgICB1bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHk6IHVuc3RhYmxlX3J1bldpdGhQcmlvcml0eSxcbiAgICAgIHVuc3RhYmxlX25leHQ6IHVuc3RhYmxlX25leHQsXG4gICAgICB1bnN0YWJsZV93cmFwQ2FsbGJhY2s6IHVuc3RhYmxlX3dyYXBDYWxsYmFjayxcbiAgICAgIHVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlOiB1bnN0YWJsZV9nZXRGaXJzdENhbGxiYWNrTm9kZSxcbiAgICAgIHVuc3RhYmxlX3BhdXNlRXhlY3V0aW9uOiB1bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbixcbiAgICAgIHVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uOiB1bnN0YWJsZV9jb250aW51ZUV4ZWN1dGlvbixcbiAgICAgIHVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsOiB1bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbCxcbiAgICAgIHVuc3RhYmxlX0lkbGVQcmlvcml0eTogSWRsZVByaW9yaXR5LFxuICAgICAgdW5zdGFibGVfSW1tZWRpYXRlUHJpb3JpdHk6IEltbWVkaWF0ZVByaW9yaXR5LFxuICAgICAgdW5zdGFibGVfTG93UHJpb3JpdHk6IExvd1ByaW9yaXR5LFxuICAgICAgdW5zdGFibGVfTm9ybWFsUHJpb3JpdHk6IE5vcm1hbFByaW9yaXR5LFxuICAgICAgdW5zdGFibGVfVXNlckJsb2NraW5nUHJpb3JpdHk6IFVzZXJCbG9ja2luZ1ByaW9yaXR5XG4gICAgfSxcbiAgICBTY2hlZHVsZXJUcmFjaW5nOiB7XG4gICAgICBfX2ludGVyYWN0aW9uc1JlZjogaW50ZXJhY3Rpb25zUmVmLFxuICAgICAgX19zdWJzY3JpYmVyUmVmOiBzdWJzY3JpYmVyUmVmLFxuICAgICAgdW5zdGFibGVfY2xlYXI6IHVuc3RhYmxlX2NsZWFyLFxuICAgICAgdW5zdGFibGVfZ2V0Q3VycmVudDogdW5zdGFibGVfZ2V0Q3VycmVudCxcbiAgICAgIHVuc3RhYmxlX2dldFRocmVhZElEOiB1bnN0YWJsZV9nZXRUaHJlYWRJRCxcbiAgICAgIHVuc3RhYmxlX3N1YnNjcmliZTogdW5zdGFibGVfc3Vic2NyaWJlLFxuICAgICAgdW5zdGFibGVfdHJhY2U6IHVuc3RhYmxlX3RyYWNlLFxuICAgICAgdW5zdGFibGVfdW5zdWJzY3JpYmU6IHVuc3RhYmxlX3Vuc3Vic2NyaWJlLFxuICAgICAgdW5zdGFibGVfd3JhcDogdW5zdGFibGVfd3JhcFxuICAgIH1cbiAgfSk7XG59XG5cbntcbiAgb2JqZWN0QXNzaWduKFJlYWN0U2hhcmVkSW50ZXJuYWxzLCB7XG4gICAgLy8gVGhlc2Ugc2hvdWxkIG5vdCBiZSBpbmNsdWRlZCBpbiBwcm9kdWN0aW9uLlxuICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWU6IFJlYWN0RGVidWdDdXJyZW50RnJhbWUsXG4gICAgLy8gU2hpbSBmb3IgUmVhY3QgRE9NIDE2LjAuMCB3aGljaCBzdGlsbCBkZXN0cnVjdHVyZWQgKGJ1dCBub3QgdXNlZCkgdGhpcy5cbiAgICAvLyBUT0RPOiByZW1vdmUgaW4gUmVhY3QgMTcuMC5cbiAgICBSZWFjdENvbXBvbmVudFRyZWVIb29rOiB7fVxuICB9KTtcbn1cblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSB3YXJuaW5nV2l0aG91dFN0YWNrJDE7XG5cbntcbiAgd2FybmluZyA9IGZ1bmN0aW9uIChjb25kaXRpb24sIGZvcm1hdCkge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lO1xuICAgIHZhciBzdGFjayA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC93YXJuaW5nLWFuZC1pbnZhcmlhbnQtYXJnc1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEuYXBwbHkodW5kZWZpbmVkLCBbZmFsc2UsIGZvcm1hdCArICclcyddLmNvbmNhdChhcmdzLCBbc3RhY2tdKSk7XG4gIH07XG59XG5cbnZhciB3YXJuaW5nJDEgPSB3YXJuaW5nO1xuXG52YXIgaGFzT3duUHJvcGVydHkkMSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG5cbnZhciBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biA9IHZvaWQgMDtcbnZhciBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biA9IHZvaWQgMDtcblxuZnVuY3Rpb24gaGFzVmFsaWRSZWYoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkkMS5jYWxsKGNvbmZpZywgJ3JlZicpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdyZWYnKS5nZXQ7XG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5JDEuY2FsbChjb25maWcsICdrZXknKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAna2V5JykuZ2V0O1xuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29uZmlnLmtleSAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duKSB7XG4gICAgICBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biA9IHRydWU7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICclczogYGtleWAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgfVxuICB9O1xuICB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdrZXknLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdLZXksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ1JlZiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duKSB7XG4gICAgICBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biA9IHRydWU7XG4gICAgICB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICclczogYHJlZmAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgfVxuICB9O1xuICB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdyZWYnLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBSZWFjdCBlbGVtZW50LiBUaGlzIG5vIGxvbmdlciBhZGhlcmVzIHRvXG4gKiB0aGUgY2xhc3MgcGF0dGVybiwgc28gZG8gbm90IHVzZSBuZXcgdG8gY2FsbCBpdC4gQWxzbywgbm8gaW5zdGFuY2VvZiBjaGVja1xuICogd2lsbCB3b3JrLiBJbnN0ZWFkIHRlc3QgJCR0eXBlb2YgZmllbGQgYWdhaW5zdCBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgdG8gY2hlY2tcbiAqIGlmIHNvbWV0aGluZyBpcyBhIFJlYWN0IEVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0geyp9IGtleVxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSByZWZcbiAqIEBwYXJhbSB7Kn0gc2VsZiBBICp0ZW1wb3JhcnkqIGhlbHBlciB0byBkZXRlY3QgcGxhY2VzIHdoZXJlIGB0aGlzYCBpc1xuICogZGlmZmVyZW50IGZyb20gdGhlIGBvd25lcmAgd2hlbiBSZWFjdC5jcmVhdGVFbGVtZW50IGlzIGNhbGxlZCwgc28gdGhhdCB3ZVxuICogY2FuIHdhcm4uIFdlIHdhbnQgdG8gZ2V0IHJpZCBvZiBvd25lciBhbmQgcmVwbGFjZSBzdHJpbmcgYHJlZmBzIHdpdGggYXJyb3dcbiAqIGZ1bmN0aW9ucywgYW5kIGFzIGxvbmcgYXMgYHRoaXNgIGFuZCBvd25lciBhcmUgdGhlIHNhbWUsIHRoZXJlIHdpbGwgYmUgbm9cbiAqIGNoYW5nZSBpbiBiZWhhdmlvci5cbiAqIEBwYXJhbSB7Kn0gc291cmNlIEFuIGFubm90YXRpb24gb2JqZWN0IChhZGRlZCBieSBhIHRyYW5zcGlsZXIgb3Igb3RoZXJ3aXNlKVxuICogaW5kaWNhdGluZyBmaWxlbmFtZSwgbGluZSBudW1iZXIsIGFuZC9vciBvdGhlciBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7Kn0gb3duZXJcbiAqIEBwYXJhbSB7Kn0gcHJvcHNcbiAqIEBpbnRlcm5hbFxuICovXG52YXIgUmVhY3RFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcykge1xuICB2YXIgZWxlbWVudCA9IHtcbiAgICAvLyBUaGlzIHRhZyBhbGxvd3MgdXMgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBhcyBhIFJlYWN0IEVsZW1lbnRcbiAgICAkJHR5cGVvZjogUkVBQ1RfRUxFTUVOVF9UWVBFLFxuXG4gICAgLy8gQnVpbHQtaW4gcHJvcGVydGllcyB0aGF0IGJlbG9uZyBvbiB0aGUgZWxlbWVudFxuICAgIHR5cGU6IHR5cGUsXG4gICAga2V5OiBrZXksXG4gICAgcmVmOiByZWYsXG4gICAgcHJvcHM6IHByb3BzLFxuXG4gICAgLy8gUmVjb3JkIHRoZSBjb21wb25lbnQgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoaXMgZWxlbWVudC5cbiAgICBfb3duZXI6IG93bmVyXG4gIH07XG5cbiAge1xuICAgIC8vIFRoZSB2YWxpZGF0aW9uIGZsYWcgaXMgY3VycmVudGx5IG11dGF0aXZlLiBXZSBwdXQgaXQgb25cbiAgICAvLyBhbiBleHRlcm5hbCBiYWNraW5nIHN0b3JlIHNvIHRoYXQgd2UgY2FuIGZyZWV6ZSB0aGUgd2hvbGUgb2JqZWN0LlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlcGxhY2VkIHdpdGggYSBXZWFrTWFwIG9uY2UgdGhleSBhcmUgaW1wbGVtZW50ZWQgaW5cbiAgICAvLyBjb21tb25seSB1c2VkIGRldmVsb3BtZW50IGVudmlyb25tZW50cy5cbiAgICBlbGVtZW50Ll9zdG9yZSA9IHt9O1xuXG4gICAgLy8gVG8gbWFrZSBjb21wYXJpbmcgUmVhY3RFbGVtZW50cyBlYXNpZXIgZm9yIHRlc3RpbmcgcHVycG9zZXMsIHdlIG1ha2VcbiAgICAvLyB0aGUgdmFsaWRhdGlvbiBmbGFnIG5vbi1lbnVtZXJhYmxlICh3aGVyZSBwb3NzaWJsZSwgd2hpY2ggc2hvdWxkXG4gICAgLy8gaW5jbHVkZSBldmVyeSBlbnZpcm9ubWVudCB3ZSBydW4gdGVzdHMgaW4pLCBzbyB0aGUgdGVzdCBmcmFtZXdvcmtcbiAgICAvLyBpZ25vcmVzIGl0LlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7XG4gICAgLy8gc2VsZiBhbmQgc291cmNlIGFyZSBERVYgb25seSBwcm9wZXJ0aWVzLlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NlbGYnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc2VsZlxuICAgIH0pO1xuICAgIC8vIFR3byBlbGVtZW50cyBjcmVhdGVkIGluIHR3byBkaWZmZXJlbnQgcGxhY2VzIHNob3VsZCBiZSBjb25zaWRlcmVkXG4gICAgLy8gZXF1YWwgZm9yIHRlc3RpbmcgcHVycG9zZXMgYW5kIHRoZXJlZm9yZSB3ZSBoaWRlIGl0IGZyb20gZW51bWVyYXRpb24uXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc291cmNlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNvdXJjZVxuICAgIH0pO1xuICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQucHJvcHMpO1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgUmVhY3RFbGVtZW50IG9mIHRoZSBnaXZlbiB0eXBlLlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjcmVhdGVlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgY29uZmlnLCBjaGlsZHJlbikge1xuICB2YXIgcHJvcE5hbWUgPSB2b2lkIDA7XG5cbiAgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuICB2YXIgcHJvcHMgPSB7fTtcblxuICB2YXIga2V5ID0gbnVsbDtcbiAgdmFyIHJlZiA9IG51bGw7XG4gIHZhciBzZWxmID0gbnVsbDtcbiAgdmFyIHNvdXJjZSA9IG51bGw7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gICAgfVxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgc2VsZiA9IGNvbmZpZy5fX3NlbGYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zZWxmO1xuICAgIHNvdXJjZSA9IGNvbmZpZy5fX3NvdXJjZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NvdXJjZTtcbiAgICAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBhcmUgYWRkZWQgdG8gYSBuZXcgcHJvcHMgb2JqZWN0XG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eSQxLmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuICAgIHtcbiAgICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUoY2hpbGRBcnJheSk7XG4gICAgICB9XG4gICAgfVxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICBpZiAodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcbiAgICBmb3IgKHByb3BOYW1lIGluIGRlZmF1bHRQcm9wcykge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHtcbiAgICBpZiAoa2V5IHx8IHJlZikge1xuICAgICAgdmFyIGRpc3BsYXlOYW1lID0gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCAnVW5rbm93bicgOiB0eXBlO1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZikge1xuICAgICAgICBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQsIHByb3BzKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHByb2R1Y2VzIFJlYWN0RWxlbWVudHMgb2YgYSBnaXZlbiB0eXBlLlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjcmVhdGVmYWN0b3J5XG4gKi9cblxuXG5mdW5jdGlvbiBjbG9uZUFuZFJlcGxhY2VLZXkob2xkRWxlbWVudCwgbmV3S2V5KSB7XG4gIHZhciBuZXdFbGVtZW50ID0gUmVhY3RFbGVtZW50KG9sZEVsZW1lbnQudHlwZSwgbmV3S2V5LCBvbGRFbGVtZW50LnJlZiwgb2xkRWxlbWVudC5fc2VsZiwgb2xkRWxlbWVudC5fc291cmNlLCBvbGRFbGVtZW50Ll9vd25lciwgb2xkRWxlbWVudC5wcm9wcyk7XG5cbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG5cbi8qKlxuICogQ2xvbmUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgdXNpbmcgZWxlbWVudCBhcyB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2Nsb25lZWxlbWVudFxuICovXG5mdW5jdGlvbiBjbG9uZUVsZW1lbnQoZWxlbWVudCwgY29uZmlnLCBjaGlsZHJlbikge1xuICAhIShlbGVtZW50ID09PSBudWxsIHx8IGVsZW1lbnQgPT09IHVuZGVmaW5lZCkgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdC5jbG9uZUVsZW1lbnQoLi4uKTogVGhlIGFyZ3VtZW50IG11c3QgYmUgYSBSZWFjdCBlbGVtZW50LCBidXQgeW91IHBhc3NlZCAlcy4nLCBlbGVtZW50KSA6IHZvaWQgMDtcblxuICB2YXIgcHJvcE5hbWUgPSB2b2lkIDA7XG5cbiAgLy8gT3JpZ2luYWwgcHJvcHMgYXJlIGNvcGllZFxuICB2YXIgcHJvcHMgPSBvYmplY3RBc3NpZ24oe30sIGVsZW1lbnQucHJvcHMpO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIGtleSA9IGVsZW1lbnQua2V5O1xuICB2YXIgcmVmID0gZWxlbWVudC5yZWY7XG4gIC8vIFNlbGYgaXMgcHJlc2VydmVkIHNpbmNlIHRoZSBvd25lciBpcyBwcmVzZXJ2ZWQuXG4gIHZhciBzZWxmID0gZWxlbWVudC5fc2VsZjtcbiAgLy8gU291cmNlIGlzIHByZXNlcnZlZCBzaW5jZSBjbG9uZUVsZW1lbnQgaXMgdW5saWtlbHkgdG8gYmUgdGFyZ2V0ZWQgYnkgYVxuICAvLyB0cmFuc3BpbGVyLCBhbmQgdGhlIG9yaWdpbmFsIHNvdXJjZSBpcyBwcm9iYWJseSBhIGJldHRlciBpbmRpY2F0b3Igb2YgdGhlXG4gIC8vIHRydWUgb3duZXIuXG4gIHZhciBzb3VyY2UgPSBlbGVtZW50Ll9zb3VyY2U7XG5cbiAgLy8gT3duZXIgd2lsbCBiZSBwcmVzZXJ2ZWQsIHVubGVzcyByZWYgaXMgb3ZlcnJpZGRlblxuICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgLy8gU2lsZW50bHkgc3RlYWwgdGhlIHJlZiBmcm9tIHRoZSBwYXJlbnQuXG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgICAgb3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIH1cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIG92ZXJyaWRlIGV4aXN0aW5nIHByb3BzXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHZvaWQgMDtcbiAgICBpZiAoZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgfVxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkkMS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgaWYgKGNvbmZpZ1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCAmJiBkZWZhdWx0UHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdEVsZW1lbnQoZWxlbWVudC50eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpO1xufVxuXG4vKipcbiAqIFZlcmlmaWVzIHRoZSBvYmplY3QgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2lzdmFsaWRlbGVtZW50XG4gKiBAcGFyYW0gez9vYmplY3R9IG9iamVjdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBgb2JqZWN0YCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIEBmaW5hbFxuICovXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cblxudmFyIFNFUEFSQVRPUiA9ICcuJztcbnZhciBTVUJTRVBBUkFUT1IgPSAnOic7XG5cbi8qKlxuICogRXNjYXBlIGFuZCB3cmFwIGtleSBzbyBpdCBpcyBzYWZlIHRvIHVzZSBhcyBhIHJlYWN0aWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IHRvIGJlIGVzY2FwZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBlc2NhcGVkIGtleS5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlUmVnZXggPSAvWz06XS9nO1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHtcbiAgICAnPSc6ICc9MCcsXG4gICAgJzonOiAnPTInXG4gIH07XG4gIHZhciBlc2NhcGVkU3RyaW5nID0gKCcnICsga2V5KS5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuXG4gIHJldHVybiAnJCcgKyBlc2NhcGVkU3RyaW5nO1xufVxuXG4vKipcbiAqIFRPRE86IFRlc3QgdGhhdCBhIHNpbmdsZSBjaGlsZCBhbmQgYW4gYXJyYXkgd2l0aCBvbmUgaXRlbSBoYXZlIHRoZSBzYW1lIGtleVxuICogcGF0dGVybi5cbiAqL1xuXG52YXIgZGlkV2FybkFib3V0TWFwcyA9IGZhbHNlO1xuXG52YXIgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXggPSAvXFwvKy9nO1xuZnVuY3Rpb24gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHRleHQpIHtcbiAgcmV0dXJuICgnJyArIHRleHQpLnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsICckJi8nKTtcbn1cblxudmFyIFBPT0xfU0laRSA9IDEwO1xudmFyIHRyYXZlcnNlQ29udGV4dFBvb2wgPSBbXTtcbmZ1bmN0aW9uIGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChtYXBSZXN1bHQsIGtleVByZWZpeCwgbWFwRnVuY3Rpb24sIG1hcENvbnRleHQpIHtcbiAgaWYgKHRyYXZlcnNlQ29udGV4dFBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IHRyYXZlcnNlQ29udGV4dFBvb2wucG9wKCk7XG4gICAgdHJhdmVyc2VDb250ZXh0LnJlc3VsdCA9IG1hcFJlc3VsdDtcbiAgICB0cmF2ZXJzZUNvbnRleHQua2V5UHJlZml4ID0ga2V5UHJlZml4O1xuICAgIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbWFwRnVuY3Rpb247XG4gICAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBtYXBDb250ZXh0O1xuICAgIHRyYXZlcnNlQ29udGV4dC5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRyYXZlcnNlQ29udGV4dDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBtYXBSZXN1bHQsXG4gICAgICBrZXlQcmVmaXg6IGtleVByZWZpeCxcbiAgICAgIGZ1bmM6IG1hcEZ1bmN0aW9uLFxuICAgICAgY29udGV4dDogbWFwQ29udGV4dCxcbiAgICAgIGNvdW50OiAwXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCkge1xuICB0cmF2ZXJzZUNvbnRleHQucmVzdWx0ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmtleVByZWZpeCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuY291bnQgPSAwO1xuICBpZiAodHJhdmVyc2VDb250ZXh0UG9vbC5sZW5ndGggPCBQT09MX1NJWkUpIHtcbiAgICB0cmF2ZXJzZUNvbnRleHRQb29sLnB1c2godHJhdmVyc2VDb250ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHshc3RyaW5nfSBuYW1lU29GYXIgTmFtZSBvZiB0aGUga2V5IHBhdGggc28gZmFyLlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIHRvIGludm9rZSB3aXRoIGVhY2ggY2hpbGQgZm91bmQuXG4gKiBAcGFyYW0gez8qfSB0cmF2ZXJzZUNvbnRleHQgVXNlZCB0byBwYXNzIGluZm9ybWF0aW9uIHRocm91Z2hvdXQgdGhlIHRyYXZlcnNhbFxuICogcHJvY2Vzcy5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZHJlbiwgbmFtZVNvRmFyLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGNoaWxkcmVuO1xuXG4gIGlmICh0eXBlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAvLyBBbGwgb2YgdGhlIGFib3ZlIGFyZSBwZXJjZWl2ZWQgYXMgbnVsbC5cbiAgICBjaGlsZHJlbiA9IG51bGw7XG4gIH1cblxuICB2YXIgaW52b2tlQ2FsbGJhY2sgPSBmYWxzZTtcblxuICBpZiAoY2hpbGRyZW4gPT09IG51bGwpIHtcbiAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHN3aXRjaCAoY2hpbGRyZW4uJCR0eXBlb2YpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGludm9rZUNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodHJhdmVyc2VDb250ZXh0LCBjaGlsZHJlbixcbiAgICAvLyBJZiBpdCdzIHRoZSBvbmx5IGNoaWxkLCB0cmVhdCB0aGUgbmFtZSBhcyBpZiBpdCB3YXMgd3JhcHBlZCBpbiBhbiBhcnJheVxuICAgIC8vIHNvIHRoYXQgaXQncyBjb25zaXN0ZW50IGlmIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gZ3Jvd3MuXG4gICAgbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiArIGdldENvbXBvbmVudEtleShjaGlsZHJlbiwgMCkgOiBuYW1lU29GYXIpO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdm9pZCAwO1xuICB2YXIgbmV4dE5hbWUgPSB2b2lkIDA7XG4gIHZhciBzdWJ0cmVlQ291bnQgPSAwOyAvLyBDb3VudCBvZiBjaGlsZHJlbiBmb3VuZCBpbiB0aGUgY3VycmVudCBzdWJ0cmVlLlxuICB2YXIgbmV4dE5hbWVQcmVmaXggPSBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SIDogbmFtZVNvRmFyICsgU1VCU0VQQVJBVE9SO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpKTtcbiAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZCwgbmV4dE5hbWUsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4oY2hpbGRyZW4pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAge1xuICAgICAgICAvLyBXYXJuIGFib3V0IHVzaW5nIE1hcHMgYXMgY2hpbGRyZW5cbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4gPT09IGNoaWxkcmVuLmVudHJpZXMpIHtcbiAgICAgICAgICAhZGlkV2FybkFib3V0TWFwcyA/IHdhcm5pbmckMShmYWxzZSwgJ1VzaW5nIE1hcHMgYXMgY2hpbGRyZW4gaXMgdW5zdXBwb3J0ZWQgYW5kIHdpbGwgbGlrZWx5IHlpZWxkICcgKyAndW5leHBlY3RlZCByZXN1bHRzLiBDb252ZXJ0IGl0IHRvIGEgc2VxdWVuY2UvaXRlcmFibGUgb2Yga2V5ZWQgJyArICdSZWFjdEVsZW1lbnRzIGluc3RlYWQuJykgOiB2b2lkIDA7XG4gICAgICAgICAgZGlkV2FybkFib3V0TWFwcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKGNoaWxkcmVuKTtcbiAgICAgIHZhciBzdGVwID0gdm9pZCAwO1xuICAgICAgdmFyIGlpID0gMDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgY2hpbGQgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpaSsrKTtcbiAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGFkZGVuZHVtID0gJyc7XG4gICAgICB7XG4gICAgICAgIGFkZGVuZHVtID0gJyBJZiB5b3UgbWVhbnQgdG8gcmVuZGVyIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiwgdXNlIGFuIGFycmF5ICcgKyAnaW5zdGVhZC4nICsgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKCk7XG4gICAgICB9XG4gICAgICB2YXIgY2hpbGRyZW5TdHJpbmcgPSAnJyArIGNoaWxkcmVuO1xuICAgICAgaW52YXJpYW50KGZhbHNlLCAnT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiAlcykuJXMnLCBjaGlsZHJlblN0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyAnb2JqZWN0IHdpdGgga2V5cyB7JyArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKCcsICcpICsgJ30nIDogY2hpbGRyZW5TdHJpbmcsIGFkZGVuZHVtKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3VidHJlZUNvdW50O1xufVxuXG4vKipcbiAqIFRyYXZlcnNlcyBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAsIGJ1dFxuICogbWlnaHQgYWxzbyBiZSBzcGVjaWZpZWQgdGhyb3VnaCBhdHRyaWJ1dGVzOlxuICpcbiAqIC0gYHRyYXZlcnNlQWxsQ2hpbGRyZW4odGhpcy5wcm9wcy5jaGlsZHJlbiwgLi4uKWBcbiAqIC0gYHRyYXZlcnNlQWxsQ2hpbGRyZW4odGhpcy5wcm9wcy5sZWZ0UGFuZWxDaGlsZHJlbiwgLi4uKWBcbiAqXG4gKiBUaGUgYHRyYXZlcnNlQ29udGV4dGAgaXMgYW4gb3B0aW9uYWwgYXJndW1lbnQgdGhhdCBpcyBwYXNzZWQgdGhyb3VnaCB0aGVcbiAqIGVudGlyZSB0cmF2ZXJzYWwuIEl0IGNhbiBiZSB1c2VkIHRvIHN0b3JlIGFjY3VtdWxhdGlvbnMgb3IgYW55dGhpbmcgZWxzZSB0aGF0XG4gKiB0aGUgY2FsbGJhY2sgbWlnaHQgZmluZCByZWxldmFudC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIG9iamVjdC5cbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBjYWxsYmFjayBUbyBpbnZva2UgdXBvbiB0cmF2ZXJzaW5nIGVhY2ggY2hpbGQuXG4gKiBAcGFyYW0gez8qfSB0cmF2ZXJzZUNvbnRleHQgQ29udGV4dCBmb3IgdHJhdmVyc2FsLlxuICogQHJldHVybiB7IW51bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGlzIHN1YnRyZWUuXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZHJlbiwgJycsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIGEga2V5IHN0cmluZyB0aGF0IGlkZW50aWZpZXMgYSBjb21wb25lbnQgd2l0aGluIGEgc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gY29tcG9uZW50IEEgY29tcG9uZW50IHRoYXQgY291bGQgY29udGFpbiBhIG1hbnVhbCBrZXkuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggdGhhdCBpcyB1c2VkIGlmIGEgbWFudWFsIGtleSBpcyBub3QgcHJvdmlkZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldENvbXBvbmVudEtleShjb21wb25lbnQsIGluZGV4KSB7XG4gIC8vIERvIHNvbWUgdHlwZWNoZWNraW5nIGhlcmUgc2luY2Ugd2UgY2FsbCB0aGlzIGJsaW5kbHkuIFdlIHdhbnQgdG8gZW5zdXJlXG4gIC8vIHRoYXQgd2UgZG9uJ3QgYmxvY2sgcG90ZW50aWFsIGZ1dHVyZSBFUyBBUElzLlxuICBpZiAodHlwZW9mIGNvbXBvbmVudCA9PT0gJ29iamVjdCcgJiYgY29tcG9uZW50ICE9PSBudWxsICYmIGNvbXBvbmVudC5rZXkgIT0gbnVsbCkge1xuICAgIC8vIEV4cGxpY2l0IGtleVxuICAgIHJldHVybiBlc2NhcGUoY29tcG9uZW50LmtleSk7XG4gIH1cbiAgLy8gSW1wbGljaXQga2V5IGRldGVybWluZWQgYnkgdGhlIGluZGV4IGluIHRoZSBzZXRcbiAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKDM2KTtcbn1cblxuZnVuY3Rpb24gZm9yRWFjaFNpbmdsZUNoaWxkKGJvb2tLZWVwaW5nLCBjaGlsZCwgbmFtZSkge1xuICB2YXIgZnVuYyA9IGJvb2tLZWVwaW5nLmZ1bmMsXG4gICAgICBjb250ZXh0ID0gYm9va0tlZXBpbmcuY29udGV4dDtcblxuICBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xufVxuXG4vKipcbiAqIEl0ZXJhdGVzIHRocm91Z2ggY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbmZvcmVhY2hcbiAqXG4gKiBUaGUgcHJvdmlkZWQgZm9yRWFjaEZ1bmMoY2hpbGQsIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZm9yRWFjaEZ1bmNcbiAqIEBwYXJhbSB7Kn0gZm9yRWFjaENvbnRleHQgQ29udGV4dCBmb3IgZm9yRWFjaENvbnRleHQuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2hDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG4gIHZhciB0cmF2ZXJzZUNvbnRleHQgPSBnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQobnVsbCwgbnVsbCwgZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KTtcbiAgdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaFNpbmdsZUNoaWxkLCB0cmF2ZXJzZUNvbnRleHQpO1xuICByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbmZ1bmN0aW9uIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQoYm9va0tlZXBpbmcsIGNoaWxkLCBjaGlsZEtleSkge1xuICB2YXIgcmVzdWx0ID0gYm9va0tlZXBpbmcucmVzdWx0LFxuICAgICAga2V5UHJlZml4ID0gYm9va0tlZXBpbmcua2V5UHJlZml4LFxuICAgICAgZnVuYyA9IGJvb2tLZWVwaW5nLmZ1bmMsXG4gICAgICBjb250ZXh0ID0gYm9va0tlZXBpbmcuY29udGV4dDtcblxuXG4gIHZhciBtYXBwZWRDaGlsZCA9IGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZCwgYm9va0tlZXBpbmcuY291bnQrKyk7XG4gIGlmIChBcnJheS5pc0FycmF5KG1hcHBlZENoaWxkKSkge1xuICAgIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwobWFwcGVkQ2hpbGQsIHJlc3VsdCwgY2hpbGRLZXksIGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYztcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChtYXBwZWRDaGlsZCAhPSBudWxsKSB7XG4gICAgaWYgKGlzVmFsaWRFbGVtZW50KG1hcHBlZENoaWxkKSkge1xuICAgICAgbWFwcGVkQ2hpbGQgPSBjbG9uZUFuZFJlcGxhY2VLZXkobWFwcGVkQ2hpbGQsXG4gICAgICAvLyBLZWVwIGJvdGggdGhlIChtYXBwZWQpIGFuZCBvbGQga2V5cyBpZiB0aGV5IGRpZmZlciwganVzdCBhc1xuICAgICAgLy8gdHJhdmVyc2VBbGxDaGlsZHJlbiB1c2VkIHRvIGRvIGZvciBvYmplY3RzIGFzIGNoaWxkcmVuXG4gICAgICBrZXlQcmVmaXggKyAobWFwcGVkQ2hpbGQua2V5ICYmICghY2hpbGQgfHwgY2hpbGQua2V5ICE9PSBtYXBwZWRDaGlsZC5rZXkpID8gZXNjYXBlVXNlclByb3ZpZGVkS2V5KG1hcHBlZENoaWxkLmtleSkgKyAnLycgOiAnJykgKyBjaGlsZEtleSk7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKG1hcHBlZENoaWxkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCBhcnJheSwgcHJlZml4LCBmdW5jLCBjb250ZXh0KSB7XG4gIHZhciBlc2NhcGVkUHJlZml4ID0gJyc7XG4gIGlmIChwcmVmaXggIT0gbnVsbCkge1xuICAgIGVzY2FwZWRQcmVmaXggPSBlc2NhcGVVc2VyUHJvdmlkZWRLZXkocHJlZml4KSArICcvJztcbiAgfVxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KGFycmF5LCBlc2NhcGVkUHJlZml4LCBmdW5jLCBjb250ZXh0KTtcbiAgdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG4vKipcbiAqIE1hcHMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbm1hcFxuICpcbiAqIFRoZSBwcm92aWRlZCBtYXBGdW5jdGlvbihjaGlsZCwga2V5LCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZ1bmMgVGhlIG1hcCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gY29udGV4dCBDb250ZXh0IGZvciBtYXBGdW5jdGlvbi5cbiAqIEByZXR1cm4ge29iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9yZGVyZWQgbWFwIG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jLCBjb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgcmVzdWx0LCBudWxsLCBmdW5jLCBjb250ZXh0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb3VudCB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXNcbiAqIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVuY291bnRcbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gY291bnRDaGlsZHJlbihjaGlsZHJlbikge1xuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9LCBudWxsKTtcbn1cblxuLyoqXG4gKiBGbGF0dGVuIGEgY2hpbGRyZW4gb2JqZWN0ICh0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmApIGFuZFxuICogcmV0dXJuIGFuIGFycmF5IHdpdGggYXBwcm9wcmlhdGVseSByZS1rZXllZCBjaGlsZHJlbi5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW50b2FycmF5XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoY2hpbGRyZW4pIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZDtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgY2hpbGQgaW4gYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuIGFuZCB2ZXJpZmllcyB0aGF0IHRoZXJlXG4gKiBpcyBvbmx5IG9uZSBjaGlsZCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5vbmx5XG4gKlxuICogVGhlIGN1cnJlbnQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgYSBzaW5nbGUgY2hpbGQgZ2V0c1xuICogcGFzc2VkIHdpdGhvdXQgYSB3cmFwcGVyLCBidXQgdGhlIHB1cnBvc2Ugb2YgdGhpcyBoZWxwZXIgZnVuY3Rpb24gaXMgdG9cbiAqIGFic3RyYWN0IGF3YXkgdGhlIHBhcnRpY3VsYXIgc3RydWN0dXJlIG9mIGNoaWxkcmVuLlxuICpcbiAqIEBwYXJhbSB7P29iamVjdH0gY2hpbGRyZW4gQ2hpbGQgY29sbGVjdGlvbiBzdHJ1Y3R1cmUuXG4gKiBAcmV0dXJuIHtSZWFjdEVsZW1lbnR9IFRoZSBmaXJzdCBhbmQgb25seSBgUmVhY3RFbGVtZW50YCBjb250YWluZWQgaW4gdGhlXG4gKiBzdHJ1Y3R1cmUuXG4gKi9cbmZ1bmN0aW9uIG9ubHlDaGlsZChjaGlsZHJlbikge1xuICAhaXNWYWxpZEVsZW1lbnQoY2hpbGRyZW4pID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3QuQ2hpbGRyZW4ub25seSBleHBlY3RlZCB0byByZWNlaXZlIGEgc2luZ2xlIFJlYWN0IGVsZW1lbnQgY2hpbGQuJykgOiB2b2lkIDA7XG4gIHJldHVybiBjaGlsZHJlbjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29udGV4dChkZWZhdWx0VmFsdWUsIGNhbGN1bGF0ZUNoYW5nZWRCaXRzKSB7XG4gIGlmIChjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHtcbiAgICAgICEoY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09IG51bGwgfHwgdHlwZW9mIGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSAnZnVuY3Rpb24nKSA/IHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2NyZWF0ZUNvbnRleHQ6IEV4cGVjdGVkIHRoZSBvcHRpb25hbCBzZWNvbmQgYXJndW1lbnQgdG8gYmUgYSAnICsgJ2Z1bmN0aW9uLiBJbnN0ZWFkIHJlY2VpdmVkOiAlcycsIGNhbGN1bGF0ZUNoYW5nZWRCaXRzKSA6IHZvaWQgMDtcbiAgICB9XG4gIH1cblxuICB2YXIgY29udGV4dCA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfQ09OVEVYVF9UWVBFLFxuICAgIF9jYWxjdWxhdGVDaGFuZ2VkQml0czogY2FsY3VsYXRlQ2hhbmdlZEJpdHMsXG4gICAgLy8gQXMgYSB3b3JrYXJvdW5kIHRvIHN1cHBvcnQgbXVsdGlwbGUgY29uY3VycmVudCByZW5kZXJlcnMsIHdlIGNhdGVnb3JpemVcbiAgICAvLyBzb21lIHJlbmRlcmVycyBhcyBwcmltYXJ5IGFuZCBvdGhlcnMgYXMgc2Vjb25kYXJ5LiBXZSBvbmx5IGV4cGVjdFxuICAgIC8vIHRoZXJlIHRvIGJlIHR3byBjb25jdXJyZW50IHJlbmRlcmVycyBhdCBtb3N0OiBSZWFjdCBOYXRpdmUgKHByaW1hcnkpIGFuZFxuICAgIC8vIEZhYnJpYyAoc2Vjb25kYXJ5KTsgUmVhY3QgRE9NIChwcmltYXJ5KSBhbmQgUmVhY3QgQVJUIChzZWNvbmRhcnkpLlxuICAgIC8vIFNlY29uZGFyeSByZW5kZXJlcnMgc3RvcmUgdGhlaXIgY29udGV4dCB2YWx1ZXMgb24gc2VwYXJhdGUgZmllbGRzLlxuICAgIF9jdXJyZW50VmFsdWU6IGRlZmF1bHRWYWx1ZSxcbiAgICBfY3VycmVudFZhbHVlMjogZGVmYXVsdFZhbHVlLFxuICAgIC8vIFVzZWQgdG8gdHJhY2sgaG93IG1hbnkgY29uY3VycmVudCByZW5kZXJlcnMgdGhpcyBjb250ZXh0IGN1cnJlbnRseVxuICAgIC8vIHN1cHBvcnRzIHdpdGhpbiBpbiBhIHNpbmdsZSByZW5kZXJlci4gU3VjaCBhcyBwYXJhbGxlbCBzZXJ2ZXIgcmVuZGVyaW5nLlxuICAgIF90aHJlYWRDb3VudDogMCxcbiAgICAvLyBUaGVzZSBhcmUgY2lyY3VsYXJcbiAgICBQcm92aWRlcjogbnVsbCxcbiAgICBDb25zdW1lcjogbnVsbFxuICB9O1xuXG4gIGNvbnRleHQuUHJvdmlkZXIgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX1BST1ZJREVSX1RZUEUsXG4gICAgX2NvbnRleHQ6IGNvbnRleHRcbiAgfTtcblxuICB2YXIgaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMgPSBmYWxzZTtcbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyID0gZmFsc2U7XG5cbiAge1xuICAgIC8vIEEgc2VwYXJhdGUgb2JqZWN0LCBidXQgcHJveGllcyBiYWNrIHRvIHRoZSBvcmlnaW5hbCBjb250ZXh0IG9iamVjdCBmb3JcbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gSXQgaGFzIGEgZGlmZmVyZW50ICQkdHlwZW9mLCBzbyB3ZSBjYW4gcHJvcGVybHlcbiAgICAvLyB3YXJuIGZvciB0aGUgaW5jb3JyZWN0IHVzYWdlIG9mIENvbnRleHQgYXMgYSBDb25zdW1lci5cbiAgICB2YXIgQ29uc3VtZXIgPSB7XG4gICAgICAkJHR5cGVvZjogUkVBQ1RfQ09OVEVYVF9UWVBFLFxuICAgICAgX2NvbnRleHQ6IGNvbnRleHQsXG4gICAgICBfY2FsY3VsYXRlQ2hhbmdlZEJpdHM6IGNvbnRleHQuX2NhbGN1bGF0ZUNoYW5nZWRCaXRzXG4gICAgfTtcbiAgICAvLyAkRmxvd0ZpeE1lOiBGbG93IGNvbXBsYWlucyBhYm91dCBub3Qgc2V0dGluZyBhIHZhbHVlLCB3aGljaCBpcyBpbnRlbnRpb25hbCBoZXJlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQ29uc3VtZXIsIHtcbiAgICAgIFByb3ZpZGVyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlbmRlcmluZyA8Q29udGV4dC5Db25zdW1lci5Qcm92aWRlcj4gaXMgbm90IHN1cHBvcnRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIHJlbmRlciA8Q29udGV4dC5Qcm92aWRlcj4gaW5zdGVhZD8nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuUHJvdmlkZXI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9Qcm92aWRlcikge1xuICAgICAgICAgIGNvbnRleHQuUHJvdmlkZXIgPSBfUHJvdmlkZXI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfY3VycmVudFZhbHVlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICBjb250ZXh0Ll9jdXJyZW50VmFsdWUgPSBfY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZTI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUyKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlMiA9IF9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX3RocmVhZENvdW50OiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll90aHJlYWRDb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX3RocmVhZENvdW50KSB7XG4gICAgICAgICAgY29udGV4dC5fdGhyZWFkQ291bnQgPSBfdGhyZWFkQ291bnQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBDb25zdW1lcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycyA9IHRydWU7XG4gICAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuQ29uc3VtZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuQ29uc3VtZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjb250ZXh0LkNvbnN1bWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbWlzc2luZyBwcm9wZXJ0aWVzIGJlY2F1c2UgaXQgZG9lc24ndCB1bmRlcnN0YW5kIGRlZmluZVByb3BlcnR5XG4gICAgY29udGV4dC5Db25zdW1lciA9IENvbnN1bWVyO1xuICB9XG5cbiAge1xuICAgIGNvbnRleHQuX2N1cnJlbnRSZW5kZXJlciA9IG51bGw7XG4gICAgY29udGV4dC5fY3VycmVudFJlbmRlcmVyMiA9IG51bGw7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZnVuY3Rpb24gbGF6eShjdG9yKSB7XG4gIHZhciBsYXp5VHlwZSA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTEFaWV9UWVBFLFxuICAgIF9jdG9yOiBjdG9yLFxuICAgIC8vIFJlYWN0IHVzZXMgdGhlc2UgZmllbGRzIHRvIHN0b3JlIHRoZSByZXN1bHQuXG4gICAgX3N0YXR1czogLTEsXG4gICAgX3Jlc3VsdDogbnVsbFxuICB9O1xuXG4gIHtcbiAgICAvLyBJbiBwcm9kdWN0aW9uLCB0aGlzIHdvdWxkIGp1c3Qgc2V0IGl0IG9uIHRoZSBvYmplY3QuXG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHZvaWQgMDtcbiAgICB2YXIgcHJvcFR5cGVzID0gdm9pZCAwO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGxhenlUeXBlLCB7XG4gICAgICBkZWZhdWx0UHJvcHM6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gZGVmYXVsdFByb3BzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdEZWZhdWx0UHJvcHMpIHtcbiAgICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdSZWFjdC5sYXp5KC4uLik6IEl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gYXNzaWduIGBkZWZhdWx0UHJvcHNgIHRvICcgKyAnYSBsYXp5IGNvbXBvbmVudCBpbXBvcnQuIEVpdGhlciBzcGVjaWZ5IHRoZW0gd2hlcmUgdGhlIGNvbXBvbmVudCAnICsgJ2lzIGRlZmluZWQsIG9yIGNyZWF0ZSBhIHdyYXBwaW5nIGNvbXBvbmVudCBhcm91bmQgaXQuJyk7XG4gICAgICAgICAgZGVmYXVsdFByb3BzID0gbmV3RGVmYXVsdFByb3BzO1xuICAgICAgICAgIC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsYXp5VHlwZSwgJ2RlZmF1bHRQcm9wcycsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb3BUeXBlczoge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBwcm9wVHlwZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1Byb3BUeXBlcykge1xuICAgICAgICAgIHdhcm5pbmckMShmYWxzZSwgJ1JlYWN0LmxhenkoLi4uKTogSXQgaXMgbm90IHN1cHBvcnRlZCB0byBhc3NpZ24gYHByb3BUeXBlc2AgdG8gJyArICdhIGxhenkgY29tcG9uZW50IGltcG9ydC4gRWl0aGVyIHNwZWNpZnkgdGhlbSB3aGVyZSB0aGUgY29tcG9uZW50ICcgKyAnaXMgZGVmaW5lZCwgb3IgY3JlYXRlIGEgd3JhcHBpbmcgY29tcG9uZW50IGFyb3VuZCBpdC4nKTtcbiAgICAgICAgICBwcm9wVHlwZXMgPSBuZXdQcm9wVHlwZXM7XG4gICAgICAgICAgLy8gTWF0Y2ggcHJvZHVjdGlvbiBiZWhhdmlvciBtb3JlIGNsb3NlbHk6XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxhenlUeXBlLCAncHJvcFR5cGVzJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbGF6eVR5cGU7XG59XG5cbmZ1bmN0aW9uIGZvcndhcmRSZWYocmVuZGVyKSB7XG4gIHtcbiAgICBpZiAocmVuZGVyICE9IG51bGwgJiYgcmVuZGVyLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpIHtcbiAgICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ2ZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHJlY2VpdmVkIGEgYG1lbW9gICcgKyAnY29tcG9uZW50LiBJbnN0ZWFkIG9mIGZvcndhcmRSZWYobWVtbyguLi4pKSwgdXNlICcgKyAnbWVtbyhmb3J3YXJkUmVmKC4uLikpLicpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlbmRlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZXF1aXJlcyBhIHJlbmRlciBmdW5jdGlvbiBidXQgd2FzIGdpdmVuICVzLicsIHJlbmRlciA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiByZW5kZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAhKFxuICAgICAgLy8gRG8gbm90IHdhcm4gZm9yIDAgYXJndW1lbnRzIGJlY2F1c2UgaXQgY291bGQgYmUgZHVlIHRvIHVzYWdlIG9mIHRoZSAnYXJndW1lbnRzJyBvYmplY3RcbiAgICAgIHJlbmRlci5sZW5ndGggPT09IDAgfHwgcmVuZGVyLmxlbmd0aCA9PT0gMikgPyB3YXJuaW5nV2l0aG91dFN0YWNrJDEoZmFsc2UsICdmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgYWNjZXB0IGV4YWN0bHkgdHdvIHBhcmFtZXRlcnM6IHByb3BzIGFuZCByZWYuICVzJywgcmVuZGVyLmxlbmd0aCA9PT0gMSA/ICdEaWQgeW91IGZvcmdldCB0byB1c2UgdGhlIHJlZiBwYXJhbWV0ZXI/JyA6ICdBbnkgYWRkaXRpb25hbCBwYXJhbWV0ZXIgd2lsbCBiZSB1bmRlZmluZWQuJykgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgaWYgKHJlbmRlciAhPSBudWxsKSB7XG4gICAgICAhKHJlbmRlci5kZWZhdWx0UHJvcHMgPT0gbnVsbCAmJiByZW5kZXIucHJvcFR5cGVzID09IG51bGwpID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGRvIG5vdCBzdXBwb3J0IHByb3BUeXBlcyBvciBkZWZhdWx0UHJvcHMuICcgKyAnRGlkIHlvdSBhY2NpZGVudGFsbHkgcGFzcyBhIFJlYWN0IGNvbXBvbmVudD8nKSA6IHZvaWQgMDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFLFxuICAgIHJlbmRlcjogcmVuZGVyXG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgfHxcbiAgLy8gTm90ZTogaXRzIHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIGlmIGl0J3MgYSBwb2x5ZmlsbC5cbiAgdHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRSB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFKTtcbn1cblxuZnVuY3Rpb24gbWVtbyh0eXBlLCBjb21wYXJlKSB7XG4gIHtcbiAgICBpZiAoIWlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSkge1xuICAgICAgd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnbWVtbzogVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBjb21wb25lbnQuIEluc3RlYWQgJyArICdyZWNlaXZlZDogJXMnLCB0eXBlID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHR5cGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9NRU1PX1RZUEUsXG4gICAgdHlwZTogdHlwZSxcbiAgICBjb21wYXJlOiBjb21wYXJlID09PSB1bmRlZmluZWQgPyBudWxsIDogY29tcGFyZVxuICB9O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRGlzcGF0Y2hlcigpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLmN1cnJlbnQ7XG4gICEoZGlzcGF0Y2hlciAhPT0gbnVsbCkgPyBpbnZhcmlhbnQoZmFsc2UsICdJbnZhbGlkIGhvb2sgY2FsbC4gSG9va3MgY2FuIG9ubHkgYmUgY2FsbGVkIGluc2lkZSBvZiB0aGUgYm9keSBvZiBhIGZ1bmN0aW9uIGNvbXBvbmVudC4gVGhpcyBjb3VsZCBoYXBwZW4gZm9yIG9uZSBvZiB0aGUgZm9sbG93aW5nIHJlYXNvbnM6XFxuMS4gWW91IG1pZ2h0IGhhdmUgbWlzbWF0Y2hpbmcgdmVyc2lvbnMgb2YgUmVhY3QgYW5kIHRoZSByZW5kZXJlciAoc3VjaCBhcyBSZWFjdCBET00pXFxuMi4gWW91IG1pZ2h0IGJlIGJyZWFraW5nIHRoZSBSdWxlcyBvZiBIb29rc1xcbjMuIFlvdSBtaWdodCBoYXZlIG1vcmUgdGhhbiBvbmUgY29weSBvZiBSZWFjdCBpbiB0aGUgc2FtZSBhcHBcXG5TZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC1pbnZhbGlkLWhvb2stY2FsbCBmb3IgdGlwcyBhYm91dCBob3cgdG8gZGVidWcgYW5kIGZpeCB0aGlzIHByb2JsZW0uJykgOiB2b2lkIDA7XG4gIHJldHVybiBkaXNwYXRjaGVyO1xufVxuXG5mdW5jdGlvbiB1c2VDb250ZXh0KENvbnRleHQsIHVuc3RhYmxlX29ic2VydmVkQml0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHtcbiAgICAhKHVuc3RhYmxlX29ic2VydmVkQml0cyA9PT0gdW5kZWZpbmVkKSA/IHdhcm5pbmckMShmYWxzZSwgJ3VzZUNvbnRleHQoKSBzZWNvbmQgYXJndW1lbnQgaXMgcmVzZXJ2ZWQgZm9yIGZ1dHVyZSAnICsgJ3VzZSBpbiBSZWFjdC4gUGFzc2luZyBpdCBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ1lvdSBwYXNzZWQ6ICVzLiVzJywgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzLCB0eXBlb2YgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzID09PSAnbnVtYmVyJyAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1syXSkgPyAnXFxuXFxuRGlkIHlvdSBjYWxsIGFycmF5Lm1hcCh1c2VDb250ZXh0KT8gJyArICdDYWxsaW5nIEhvb2tzIGluc2lkZSBhIGxvb3AgaXMgbm90IHN1cHBvcnRlZC4gJyArICdMZWFybiBtb3JlIGF0IGh0dHBzOi8vZmIubWUvcnVsZXMtb2YtaG9va3MnIDogJycpIDogdm9pZCAwO1xuXG4gICAgLy8gVE9ETzogYWRkIGEgbW9yZSBnZW5lcmljIHdhcm5pbmcgZm9yIGludmFsaWQgdmFsdWVzLlxuICAgIGlmIChDb250ZXh0Ll9jb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciByZWFsQ29udGV4dCA9IENvbnRleHQuX2NvbnRleHQ7XG4gICAgICAvLyBEb24ndCBkZWR1cGxpY2F0ZSBiZWNhdXNlIHRoaXMgbGVnaXRpbWF0ZWx5IGNhdXNlcyBidWdzXG4gICAgICAvLyBhbmQgbm9ib2R5IHNob3VsZCBiZSB1c2luZyB0aGlzIGluIGV4aXN0aW5nIGNvZGUuXG4gICAgICBpZiAocmVhbENvbnRleHQuQ29uc3VtZXIgPT09IENvbnRleHQpIHtcbiAgICAgICAgd2FybmluZyQxKGZhbHNlLCAnQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuQ29uc3VtZXIpIGlzIG5vdCBzdXBwb3J0ZWQsIG1heSBjYXVzZSBidWdzLCBhbmQgd2lsbCBiZSAnICsgJ3JlbW92ZWQgaW4gYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkPycpO1xuICAgICAgfSBlbHNlIGlmIChyZWFsQ29udGV4dC5Qcm92aWRlciA9PT0gQ29udGV4dCkge1xuICAgICAgICB3YXJuaW5nJDEoZmFsc2UsICdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Qcm92aWRlcikgaXMgbm90IHN1cHBvcnRlZC4gJyArICdEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNvbnRleHQoQ29udGV4dCwgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlU3RhdGUoaW5pdGlhbFN0YXRlKTtcbn1cblxuZnVuY3Rpb24gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KTtcbn1cblxuZnVuY3Rpb24gdXNlUmVmKGluaXRpYWxWYWx1ZSkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVJlZihpbml0aWFsVmFsdWUpO1xufVxuXG5mdW5jdGlvbiB1c2VFZmZlY3QoY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VFZmZlY3QoY3JlYXRlLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBpbnB1dHMpO1xufVxuXG5mdW5jdGlvbiB1c2VDYWxsYmFjayhjYWxsYmFjaywgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlQ2FsbGJhY2soY2FsbGJhY2ssIGlucHV0cyk7XG59XG5cbmZ1bmN0aW9uIHVzZU1lbW8oY3JlYXRlLCBpbnB1dHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VNZW1vKGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgaW5wdXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgaW5wdXRzKTtcbn1cblxuZnVuY3Rpb24gdXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyRm4pIHtcbiAge1xuICAgIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgICByZXR1cm4gZGlzcGF0Y2hlci51c2VEZWJ1Z1ZhbHVlKHZhbHVlLCBmb3JtYXR0ZXJGbik7XG4gIH1cbn1cblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5cblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0JDEgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXRfMSA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0JDE7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuXG5cbnZhciBwcmludFdhcm5pbmckMSA9IGZ1bmN0aW9uKCkge307XG5cbntcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gUmVhY3RQcm9wVHlwZXNTZWNyZXRfMTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xuXG4gIHByaW50V2FybmluZyQxID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAodHlwZVNwZWNzLmhhc093blByb3BlcnR5KHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKFxuICAgICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7ICcgK1xuICAgICAgICAgICAgICAnaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYCcgKyB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gKyAnYC4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgJiYgIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgIHByaW50V2FybmluZyQxKFxuICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJyArXG4gICAgICAgICAgICBsb2NhdGlvbiArICcgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICcgKyB0eXBlb2YgZXJyb3IgKyAnLiAnICtcbiAgICAgICAgICAgICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgK1xuICAgICAgICAgICAgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nXG4gICAgICAgICAgKTtcblxuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXNbZXJyb3IubWVzc2FnZV0gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIHN0YWNrID0gZ2V0U3RhY2sgPyBnZXRTdGFjaygpIDogJyc7XG5cbiAgICAgICAgICBwcmludFdhcm5pbmckMShcbiAgICAgICAgICAgICdGYWlsZWQgJyArIGxvY2F0aW9uICsgJyB0eXBlOiAnICsgZXJyb3IubWVzc2FnZSArIChzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnZhciBjaGVja1Byb3BUeXBlc18xID0gY2hlY2tQcm9wVHlwZXM7XG5cbi8qKlxuICogUmVhY3RFbGVtZW50VmFsaWRhdG9yIHByb3ZpZGVzIGEgd3JhcHBlciBhcm91bmQgYSBlbGVtZW50IGZhY3RvcnlcbiAqIHdoaWNoIHZhbGlkYXRlcyB0aGUgcHJvcHMgcGFzc2VkIHRvIHRoZSBlbGVtZW50LiBUaGlzIGlzIGludGVuZGVkIHRvIGJlXG4gKiB1c2VkIG9ubHkgaW4gREVWIGFuZCBjb3VsZCBiZSByZXBsYWNlZCBieSBhIHN0YXRpYyB0eXBlIGNoZWNrZXIgZm9yIGxhbmd1YWdlc1xuICogdGhhdCBzdXBwb3J0IGl0LlxuICovXG5cbnZhciBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IHZvaWQgMDtcblxue1xuICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKSB7XG4gIGlmIChSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBuYW1lICsgJ2AuJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShlbGVtZW50UHJvcHMpIHtcbiAgaWYgKGVsZW1lbnRQcm9wcyAhPT0gbnVsbCAmJiBlbGVtZW50UHJvcHMgIT09IHVuZGVmaW5lZCAmJiBlbGVtZW50UHJvcHMuX19zb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBzb3VyY2UgPSBlbGVtZW50UHJvcHMuX19zb3VyY2U7XG4gICAgdmFyIGZpbGVOYW1lID0gc291cmNlLmZpbGVOYW1lLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICB2YXIgbGluZU51bWJlciA9IHNvdXJjZS5saW5lTnVtYmVyO1xuICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgeW91ciBjb2RlIGF0ICcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnLic7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIFdhcm4gaWYgdGhlcmUncyBubyBrZXkgZXhwbGljaXRseSBzZXQgb24gZHluYW1pYyBhcnJheXMgb2YgY2hpbGRyZW4gb3JcbiAqIG9iamVjdCBrZXlzIGFyZSBub3QgdmFsaWQuIFRoaXMgYWxsb3dzIHVzIHRvIGtlZXAgdHJhY2sgb2YgY2hpbGRyZW4gYmV0d2VlblxuICogdXBkYXRlcy5cbiAqL1xudmFyIG93bmVySGFzS2V5VXNlV2FybmluZyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpIHtcbiAgdmFyIGluZm8gPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcblxuICBpZiAoIWluZm8pIHtcbiAgICB2YXIgcGFyZW50TmFtZSA9IHR5cGVvZiBwYXJlbnRUeXBlID09PSAnc3RyaW5nJyA/IHBhcmVudFR5cGUgOiBwYXJlbnRUeXBlLmRpc3BsYXlOYW1lIHx8IHBhcmVudFR5cGUubmFtZTtcbiAgICBpZiAocGFyZW50TmFtZSkge1xuICAgICAgaW5mbyA9ICdcXG5cXG5DaGVjayB0aGUgdG9wLWxldmVsIHJlbmRlciBjYWxsIHVzaW5nIDwnICsgcGFyZW50TmFtZSArICc+Lic7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbmZvO1xufVxuXG4vKipcbiAqIFdhcm4gaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGFuIGV4cGxpY2l0IGtleSBhc3NpZ25lZCB0byBpdC5cbiAqIFRoaXMgZWxlbWVudCBpcyBpbiBhbiBhcnJheS4gVGhlIGFycmF5IGNvdWxkIGdyb3cgYW5kIHNocmluayBvciBiZVxuICogcmVvcmRlcmVkLiBBbGwgY2hpbGRyZW4gdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiB2YWxpZGF0ZWQgYXJlIHJlcXVpcmVkIHRvXG4gKiBoYXZlIGEgXCJrZXlcIiBwcm9wZXJ0eSBhc3NpZ25lZCB0byBpdC4gRXJyb3Igc3RhdHVzZXMgYXJlIGNhY2hlZCBzbyBhIHdhcm5pbmdcbiAqIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0aGF0IHJlcXVpcmVzIGEga2V5LlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIGVsZW1lbnQncyBwYXJlbnQncyB0eXBlLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUV4cGxpY2l0S2V5KGVsZW1lbnQsIHBhcmVudFR5cGUpIHtcbiAgaWYgKCFlbGVtZW50Ll9zdG9yZSB8fCBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgfHwgZWxlbWVudC5rZXkgIT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuXG4gIHZhciBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvID0gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKTtcbiAgaWYgKG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSkge1xuICAgIHJldHVybjtcbiAgfVxuICBvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10gPSB0cnVlO1xuXG4gIC8vIFVzdWFsbHkgdGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIG9mZmVuZGVyLCBidXQgaWYgaXQgYWNjZXB0cyBjaGlsZHJlbiBhcyBhXG4gIC8vIHByb3BlcnR5LCBpdCBtYXkgYmUgdGhlIGNyZWF0b3Igb2YgdGhlIGNoaWxkIHRoYXQncyByZXNwb25zaWJsZSBmb3JcbiAgLy8gYXNzaWduaW5nIGl0IGEga2V5LlxuICB2YXIgY2hpbGRPd25lciA9ICcnO1xuICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Ll9vd25lciAmJiBlbGVtZW50Ll9vd25lciAhPT0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGNvbXBvbmVudCB0aGF0IG9yaWdpbmFsbHkgY3JlYXRlZCB0aGlzIGNoaWxkLlxuICAgIGNoaWxkT3duZXIgPSAnIEl0IHdhcyBwYXNzZWQgYSBjaGlsZCBmcm9tICcgKyBnZXRDb21wb25lbnROYW1lKGVsZW1lbnQuX293bmVyLnR5cGUpICsgJy4nO1xuICB9XG5cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCk7XG4gIHtcbiAgICB3YXJuaW5nJDEoZmFsc2UsICdFYWNoIGNoaWxkIGluIGEgbGlzdCBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJyArICclcyVzIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmcta2V5cyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLCBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvLCBjaGlsZE93bmVyKTtcbiAgfVxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbn1cblxuLyoqXG4gKiBFbnN1cmUgdGhhdCBldmVyeSBlbGVtZW50IGVpdGhlciBpcyBwYXNzZWQgaW4gYSBzdGF0aWMgbG9jYXRpb24sIGluIGFuXG4gKiBhcnJheSB3aXRoIGFuIGV4cGxpY2l0IGtleXMgcHJvcGVydHkgZGVmaW5lZCwgb3IgaW4gYW4gb2JqZWN0IGxpdGVyYWxcbiAqIHdpdGggdmFsaWQga2V5IHByb3BlcnR5LlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdE5vZGV9IG5vZGUgU3RhdGljYWxseSBwYXNzZWQgY2hpbGQgb2YgYW55IHR5cGUuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgbm9kZSdzIHBhcmVudCdzIHR5cGUuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlQ2hpbGRLZXlzKG5vZGUsIHBhcmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBub2RlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZVtpXTtcbiAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShjaGlsZCwgcGFyZW50VHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzVmFsaWRFbGVtZW50KG5vZGUpKSB7XG4gICAgLy8gVGhpcyBlbGVtZW50IHdhcyBwYXNzZWQgaW4gYSB2YWxpZCBsb2NhdGlvbi5cbiAgICBpZiAobm9kZS5fc3RvcmUpIHtcbiAgICAgIG5vZGUuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5vZGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obm9kZSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBFbnRyeSBpdGVyYXRvcnMgdXNlZCB0byBwcm92aWRlIGltcGxpY2l0IGtleXMsXG4gICAgICAvLyBidXQgbm93IHdlIHByaW50IGEgc2VwYXJhdGUgd2FybmluZyBmb3IgdGhlbSBsYXRlci5cbiAgICAgIGlmIChpdGVyYXRvckZuICE9PSBub2RlLmVudHJpZXMpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG5vZGUpO1xuICAgICAgICB2YXIgc3RlcCA9IHZvaWQgMDtcbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShzdGVwLnZhbHVlLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhbiBlbGVtZW50LCB2YWxpZGF0ZSB0aGF0IGl0cyBwcm9wcyBmb2xsb3cgdGhlIHByb3BUeXBlcyBkZWZpbml0aW9uLFxuICogcHJvdmlkZWQgYnkgdGhlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCkge1xuICB2YXIgdHlwZSA9IGVsZW1lbnQudHlwZTtcbiAgaWYgKHR5cGUgPT09IG51bGwgfHwgdHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUodHlwZSk7XG4gIHZhciBwcm9wVHlwZXMgPSB2b2lkIDA7XG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fFxuICAvLyBOb3RlOiBNZW1vIG9ubHkgY2hlY2tzIG91dGVyIHByb3BzIGhlcmUuXG4gIC8vIElubmVyIHByb3BzIGFyZSBjaGVja2VkIGluIHRoZSByZWNvbmNpbGVyLlxuICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpKSB7XG4gICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChwcm9wVHlwZXMpIHtcbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcbiAgICBjaGVja1Byb3BUeXBlc18xKHByb3BUeXBlcywgZWxlbWVudC5wcm9wcywgJ3Byb3AnLCBuYW1lLCBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0pO1xuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xuICB9IGVsc2UgaWYgKHR5cGUuUHJvcFR5cGVzICE9PSB1bmRlZmluZWQgJiYgIXByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duKSB7XG4gICAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgIHdhcm5pbmdXaXRob3V0U3RhY2skMShmYWxzZSwgJ0NvbXBvbmVudCAlcyBkZWNsYXJlZCBgUHJvcFR5cGVzYCBpbnN0ZWFkIG9mIGBwcm9wVHlwZXNgLiBEaWQgeW91IG1pc3NwZWxsIHRoZSBwcm9wZXJ0eSBhc3NpZ25tZW50PycsIG5hbWUgfHwgJ1Vua25vd24nKTtcbiAgfVxuICBpZiAodHlwZW9mIHR5cGUuZ2V0RGVmYXVsdFByb3BzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgIXR5cGUuZ2V0RGVmYXVsdFByb3BzLmlzUmVhY3RDbGFzc0FwcHJvdmVkID8gd2FybmluZ1dpdGhvdXRTdGFjayQxKGZhbHNlLCAnZ2V0RGVmYXVsdFByb3BzIGlzIG9ubHkgdXNlZCBvbiBjbGFzc2ljIFJlYWN0LmNyZWF0ZUNsYXNzICcgKyAnZGVmaW5pdGlvbnMuIFVzZSBhIHN0YXRpYyBwcm9wZXJ0eSBuYW1lZCBgZGVmYXVsdFByb3BzYCBpbnN0ZWFkLicpIDogdm9pZCAwO1xuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYSBmcmFnbWVudCwgdmFsaWRhdGUgdGhhdCBpdCBjYW4gb25seSBiZSBwcm92aWRlZCB3aXRoIGZyYWdtZW50IHByb3BzXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZnJhZ21lbnRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVGcmFnbWVudFByb3BzKGZyYWdtZW50KSB7XG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGZyYWdtZW50KTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGZyYWdtZW50LnByb3BzKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgaWYgKGtleSAhPT0gJ2NoaWxkcmVuJyAmJiBrZXkgIT09ICdrZXknKSB7XG4gICAgICB3YXJuaW5nJDEoZmFsc2UsICdJbnZhbGlkIHByb3AgYCVzYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLiAnICsgJ1JlYWN0LkZyYWdtZW50IGNhbiBvbmx5IGhhdmUgYGtleWAgYW5kIGBjaGlsZHJlbmAgcHJvcHMuJywga2V5KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChmcmFnbWVudC5yZWYgIT09IG51bGwpIHtcbiAgICB3YXJuaW5nJDEoZmFsc2UsICdJbnZhbGlkIGF0dHJpYnV0ZSBgcmVmYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLicpO1xuICB9XG5cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIHZhbGlkVHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKTtcblxuICAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAvLyBzdWNjZWVkIGFuZCB0aGVyZSB3aWxsIGxpa2VseSBiZSBlcnJvcnMgaW4gcmVuZGVyLlxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHZhciBpbmZvID0gJyc7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyh0eXBlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGluZm8gKz0gJyBZb3UgbGlrZWx5IGZvcmdvdCB0byBleHBvcnQgeW91ciBjb21wb25lbnQgZnJvbSB0aGUgZmlsZSAnICsgXCJpdCdzIGRlZmluZWQgaW4sIG9yIHlvdSBtaWdodCBoYXZlIG1peGVkIHVwIGRlZmF1bHQgYW5kIG5hbWVkIGltcG9ydHMuXCI7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZUluZm8gPSBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShwcm9wcyk7XG4gICAgaWYgKHNvdXJjZUluZm8pIHtcbiAgICAgIGluZm8gKz0gc291cmNlSW5mbztcbiAgICB9IGVsc2Uge1xuICAgICAgaW5mbyArPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZVN0cmluZyA9IHZvaWQgMDtcbiAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgdHlwZVN0cmluZyA9ICdudWxsJztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnYXJyYXknO1xuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gdW5kZWZpbmVkICYmIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRSkge1xuICAgICAgdHlwZVN0cmluZyA9ICc8JyArIChnZXRDb21wb25lbnROYW1lKHR5cGUudHlwZSkgfHwgJ1Vua25vd24nKSArICcgLz4nO1xuICAgICAgaW5mbyA9ICcgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlU3RyaW5nID0gdHlwZW9mIHR5cGU7XG4gICAgfVxuXG4gICAgd2FybmluZyQxKGZhbHNlLCAnUmVhY3QuY3JlYXRlRWxlbWVudDogdHlwZSBpcyBpbnZhbGlkIC0tIGV4cGVjdGVkIGEgc3RyaW5nIChmb3IgJyArICdidWlsdC1pbiBjb21wb25lbnRzKSBvciBhIGNsYXNzL2Z1bmN0aW9uIChmb3IgY29tcG9zaXRlICcgKyAnY29tcG9uZW50cykgYnV0IGdvdDogJXMuJXMnLCB0eXBlU3RyaW5nLCBpbmZvKTtcbiAgfVxuXG4gIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIC8vIFRoZSByZXN1bHQgY2FuIGJlIG51bGxpc2ggaWYgYSBtb2NrIG9yIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIHVzZWQuXG4gIC8vIFRPRE86IERyb3AgdGhpcyB3aGVuIHRoZXNlIGFyZSBubyBsb25nZXIgYWxsb3dlZCBhcyB0aGUgdHlwZSBhcmd1bWVudC5cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgLy8gU2tpcCBrZXkgd2FybmluZyBpZiB0aGUgdHlwZSBpc24ndCB2YWxpZCBzaW5jZSBvdXIga2V5IHZhbGlkYXRpb24gbG9naWNcbiAgLy8gZG9lc24ndCBleHBlY3QgYSBub24tc3RyaW5nL2Z1bmN0aW9uIHR5cGUgYW5kIGNhbiB0aHJvdyBjb25mdXNpbmcgZXJyb3JzLlxuICAvLyBXZSBkb24ndCB3YW50IGV4Y2VwdGlvbiBiZWhhdmlvciB0byBkaWZmZXIgYmV0d2VlbiBkZXYgYW5kIHByb2QuXG4gIC8vIChSZW5kZXJpbmcgd2lsbCB0aHJvdyB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlIGFuZCBhcyBzb29uIGFzIHRoZSB0eXBlIGlzXG4gIC8vIGZpeGVkLCB0aGUga2V5IHdhcm5pbmdzIHdpbGwgYXBwZWFyLilcbiAgaWYgKHZhbGlkVHlwZSkge1xuICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIHR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFKSB7XG4gICAgdmFsaWRhdGVGcmFnbWVudFByb3BzKGVsZW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbih0eXBlKSB7XG4gIHZhciB2YWxpZGF0ZWRGYWN0b3J5ID0gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uLmJpbmQobnVsbCwgdHlwZSk7XG4gIHZhbGlkYXRlZEZhY3RvcnkudHlwZSA9IHR5cGU7XG4gIC8vIExlZ2FjeSBob29rOiByZW1vdmUgaXRcbiAge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWxpZGF0ZWRGYWN0b3J5LCAndHlwZScsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvd1ByaW9yaXR5V2FybmluZyQxKGZhbHNlLCAnRmFjdG9yeS50eXBlIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB0aGUgY2xhc3MgZGlyZWN0bHkgJyArICdiZWZvcmUgcGFzc2luZyBpdCB0byBjcmVhdGVGYWN0b3J5LicpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3R5cGUnLCB7XG4gICAgICAgICAgdmFsdWU6IHR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHZhbGlkYXRlZEZhY3Rvcnk7XG59XG5cbmZ1bmN0aW9uIGNsb25lRWxlbWVudFdpdGhWYWxpZGF0aW9uKGVsZW1lbnQsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgbmV3RWxlbWVudCA9IGNsb25lRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgbmV3RWxlbWVudC50eXBlKTtcbiAgfVxuICB2YWxpZGF0ZVByb3BUeXBlcyhuZXdFbGVtZW50KTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG5cbnZhciBSZWFjdCA9IHtcbiAgQ2hpbGRyZW46IHtcbiAgICBtYXA6IG1hcENoaWxkcmVuLFxuICAgIGZvckVhY2g6IGZvckVhY2hDaGlsZHJlbixcbiAgICBjb3VudDogY291bnRDaGlsZHJlbixcbiAgICB0b0FycmF5OiB0b0FycmF5LFxuICAgIG9ubHk6IG9ubHlDaGlsZFxuICB9LFxuXG4gIGNyZWF0ZVJlZjogY3JlYXRlUmVmLFxuICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgUHVyZUNvbXBvbmVudDogUHVyZUNvbXBvbmVudCxcblxuICBjcmVhdGVDb250ZXh0OiBjcmVhdGVDb250ZXh0LFxuICBmb3J3YXJkUmVmOiBmb3J3YXJkUmVmLFxuICBsYXp5OiBsYXp5LFxuICBtZW1vOiBtZW1vLFxuXG4gIHVzZUNhbGxiYWNrOiB1c2VDYWxsYmFjayxcbiAgdXNlQ29udGV4dDogdXNlQ29udGV4dCxcbiAgdXNlRWZmZWN0OiB1c2VFZmZlY3QsXG4gIHVzZUltcGVyYXRpdmVIYW5kbGU6IHVzZUltcGVyYXRpdmVIYW5kbGUsXG4gIHVzZURlYnVnVmFsdWU6IHVzZURlYnVnVmFsdWUsXG4gIHVzZUxheW91dEVmZmVjdDogdXNlTGF5b3V0RWZmZWN0LFxuICB1c2VNZW1vOiB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyOiB1c2VSZWR1Y2VyLFxuICB1c2VSZWY6IHVzZVJlZixcbiAgdXNlU3RhdGU6IHVzZVN0YXRlLFxuXG4gIEZyYWdtZW50OiBSRUFDVF9GUkFHTUVOVF9UWVBFLFxuICBTdHJpY3RNb2RlOiBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFLFxuICBTdXNwZW5zZTogUkVBQ1RfU1VTUEVOU0VfVFlQRSxcblxuICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24sXG4gIGNyZWF0ZUZhY3Rvcnk6IGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbixcbiAgaXNWYWxpZEVsZW1lbnQ6IGlzVmFsaWRFbGVtZW50LFxuXG4gIHZlcnNpb246IFJlYWN0VmVyc2lvbixcblxuICB1bnN0YWJsZV9Db25jdXJyZW50TW9kZTogUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUsXG4gIHVuc3RhYmxlX1Byb2ZpbGVyOiBSRUFDVF9QUk9GSUxFUl9UWVBFLFxuXG4gIF9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEOiBSZWFjdFNoYXJlZEludGVybmFsc1xufTtcblxuLy8gTm90ZTogc29tZSBBUElzIGFyZSBhZGRlZCB3aXRoIGZlYXR1cmUgZmxhZ3MuXG4vLyBNYWtlIHN1cmUgdGhhdCBzdGFibGUgYnVpbGRzIGZvciBvcGVuIHNvdXJjZVxuLy8gZG9uJ3QgbW9kaWZ5IHRoZSBSZWFjdCBvYmplY3QgdG8gYXZvaWQgZGVvcHRzLlxuLy8gQWxzbyBsZXQncyBub3QgZXhwb3NlIHRoZWlyIG5hbWVzIGluIHN0YWJsZSBidWlsZHMuXG5cbmlmIChlbmFibGVTdGFibGVDb25jdXJyZW50TW9kZUFQSXMpIHtcbiAgUmVhY3QuQ29uY3VycmVudE1vZGUgPSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbiAgUmVhY3QuUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xuICBSZWFjdC51bnN0YWJsZV9Db25jdXJyZW50TW9kZSA9IHVuZGVmaW5lZDtcbiAgUmVhY3QudW5zdGFibGVfUHJvZmlsZXIgPSB1bmRlZmluZWQ7XG59XG5cblxuXG52YXIgUmVhY3QkMiA9IE9iamVjdC5mcmVlemUoe1xuXHRkZWZhdWx0OiBSZWFjdFxufSk7XG5cbnZhciBSZWFjdCQzID0gKCBSZWFjdCQyICYmIFJlYWN0ICkgfHwgUmVhY3QkMjtcblxuLy8gVE9ETzogZGVjaWRlIG9uIHRoZSB0b3AtbGV2ZWwgZXhwb3J0IGZvcm0uXG4vLyBUaGlzIGlzIGhhY2t5IGJ1dCBtYWtlcyBpdCB3b3JrIHdpdGggYm90aCBSb2xsdXAgYW5kIEplc3QuXG52YXIgcmVhY3QgPSBSZWFjdCQzLmRlZmF1bHQgfHwgUmVhY3QkMztcblxucmV0dXJuIHJlYWN0O1xuXG59KSkpO1xuIl19