/*!
 * quival v0.2.5 (https://github.com/apih/quival)
 * (c) 2023 Mohd Hafizuddin M Marzuki <hafizuddin_83@yahoo.com>
 * Released under the MIT License.
 */
var quival = (function (exports) {
  'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return exports;
    };
    var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg,
            value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
        method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
              return next.value = undefined, next.done = !0, next;
            };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
  function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
  }
  function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
  }
  function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
  }
  function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
  }
  function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
  }
  function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }
    return descriptor.value;
  }
  function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
      descriptor.set.call(receiver, value);
    } else {
      if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
      }
      descriptor.value = value;
    }
  }
  function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
      throw new TypeError("Private static access of wrong provenance");
    }
  }
  function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (descriptor === undefined) {
      throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
  }
  function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
      throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
  }
  function _classPrivateFieldInitSpec(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
  }

  function toCamelCase(string) {
    return string.replace(/(_\w)/g, function (match) {
      return match[1].toUpperCase();
    });
  }
  function toSnakeCase(string) {
    return string.replace(/[\w]([A-Z])/g, function (match) {
      return match[0] + '_' + match[1].toLowerCase();
    }).toLowerCase();
  }
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  function getByPath(obj, path, defaultValue) {
    var keys = path.split('.');
    var current = obj;
    var _iterator = _createForOfIteratorHelper(keys),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var key = _step.value;
        if (!current.hasOwnProperty(key)) {
          return defaultValue;
        }
        current = current[key];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return current;
  }
  function flattenObject(obj) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return Object.keys(obj).reduce(function (accumulator, key) {
      var prefixedKey = prefix ? "".concat(prefix, ".").concat(key) : key;
      if (_typeof(obj[key]) === 'object' && obj[key] !== null) {
        Object.assign(accumulator, flattenObject(obj[key], prefixedKey));
      } else {
        accumulator[prefixedKey] = obj[key];
      }
      return accumulator;
    }, {});
  }
  function parseDate(value) {
    if (isEmpty(value) || typeof value !== 'string') {
      return new Date('');
    } else if (value instanceof Date) {
      return value;
    }
    var match, years, months, days, hours, minutes, seconds, meridiem;
    var castToIntegers = function castToIntegers(value) {
      return value && /^\d*$/.test(value) ? parseInt(value) : value;
    };
    if ((match = value.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})\s?((\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?)?/i)) !== null) {
      var _match$map = match.map(castToIntegers);
      var _match$map2 = _slicedToArray(_match$map, 10);
      days = _match$map2[1];
      months = _match$map2[2];
      years = _match$map2[3];
      var _match$map2$ = _match$map2[5];
      hours = _match$map2$ === void 0 ? 0 : _match$map2$;
      var _match$map2$2 = _match$map2[6];
      minutes = _match$map2$2 === void 0 ? 0 : _match$map2$2;
      var _match$map2$3 = _match$map2[8];
      seconds = _match$map2$3 === void 0 ? 0 : _match$map2$3;
      var _match$map2$4 = _match$map2[9];
      meridiem = _match$map2$4 === void 0 ? 'am' : _match$map2$4;
    } else if ((match = value.match(/^(\d{2,4})[.\/-](\d{1,2})[.\/-](\d{1,2})\s?((\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?)?/i)) !== null || (match = value.match(/^(\d{4})(\d{2})(\d{2})\s?((\d{2})(\d{2})((\d{2}))?\s?(am|pm)?)?/i)) !== null) {
      var _match$map3 = match.map(castToIntegers);
      var _match$map4 = _slicedToArray(_match$map3, 10);
      years = _match$map4[1];
      months = _match$map4[2];
      days = _match$map4[3];
      var _match$map4$ = _match$map4[5];
      hours = _match$map4$ === void 0 ? 0 : _match$map4$;
      var _match$map4$2 = _match$map4[6];
      minutes = _match$map4$2 === void 0 ? 0 : _match$map4$2;
      var _match$map4$3 = _match$map4[8];
      seconds = _match$map4$3 === void 0 ? 0 : _match$map4$3;
      var _match$map4$4 = _match$map4[9];
      meridiem = _match$map4$4 === void 0 ? 'am' : _match$map4$4;
    } else if (match = value.match(/(\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?\s?(\d{4})[.\/-](\d{2})[.\/-](\d{2})/i)) {
      var _match$map5 = match.map(castToIntegers);
      var _match$map6 = _slicedToArray(_match$map5, 9);
      hours = _match$map6[1];
      minutes = _match$map6[2];
      seconds = _match$map6[4];
      var _match$map6$ = _match$map6[5];
      meridiem = _match$map6$ === void 0 ? 'am' : _match$map6$;
      years = _match$map6[6];
      months = _match$map6[7];
      days = _match$map6[8];
    } else if (match = value.match(/(\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?\s?(\d{2})[.\/-](\d{2})[.\/-](\d{4})/i)) {
      var _match$map7 = match.map(castToIntegers);
      var _match$map8 = _slicedToArray(_match$map7, 9);
      hours = _match$map8[1];
      minutes = _match$map8[2];
      seconds = _match$map8[4];
      var _match$map8$ = _match$map8[5];
      meridiem = _match$map8$ === void 0 ? 'am' : _match$map8$;
      days = _match$map8[6];
      months = _match$map8[7];
      years = _match$map8[8];
    } else if (match = value.match(/(\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s?(am|pm)?/i)) {
      var current = new Date();
      years = current.getFullYear();
      months = current.getMonth() + 1;
      days = current.getDate();
      var _match$map9 = match.map(castToIntegers);
      var _match$map10 = _slicedToArray(_match$map9, 6);
      var _match$map10$ = _match$map10[1];
      hours = _match$map10$ === void 0 ? 0 : _match$map10$;
      var _match$map10$2 = _match$map10[2];
      minutes = _match$map10$2 === void 0 ? 0 : _match$map10$2;
      var _match$map10$3 = _match$map10[4];
      seconds = _match$map10$3 === void 0 ? 0 : _match$map10$3;
      var _match$map10$4 = _match$map10[5];
      meridiem = _match$map10$4 === void 0 ? 'am' : _match$map10$4;
    } else {
      return new Date(value);
    }
    if (years >= 10 && years < 100) {
      years += 2000;
    }
    if (meridiem.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    return new Date("".concat(years, "-").concat(months, "-").concat(days, " ").concat(hours, ":").concat(minutes, ":").concat(seconds));
  }
  function parseDateByFormat(value, format) {
    var _match$indices$hours, _match$indices$minute, _match$indices$second, _match$indices$meridi;
    if (isEmpty(value)) {
      return new Date('');
    }
    format = format.split('');
    var formats = {
      Y: '(\\d{4})',
      y: '(\\d{2})',
      m: '(\\d{2})',
      n: '([1-9]\\d?)',
      d: '(\\d{2})',
      j: '([1-9]\\d?)',
      G: '([1-9]\\d?)',
      g: '([1-9]\\d?)',
      H: '(\\d{2})',
      h: '(\\d{2})',
      i: '(\\d{2})',
      s: '(\\d{2})',
      A: '(AM|PM)',
      a: '(am|pm)'
    };
    var pattern = '^';
    var indices = {
      years: -1,
      months: -1,
      days: -1,
      hours: -1,
      minutes: -1,
      seconds: -1,
      meridiem: -1
    };
    var index = 1;
    var _iterator3 = _createForOfIteratorHelper(format),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var char = _step3.value;
        if (formats.hasOwnProperty(char)) {
          pattern += formats[char];
          if (['Y', 'y'].indexOf(char) !== -1) {
            indices.years = index++;
          } else if (['m', 'n'].indexOf(char) !== -1) {
            indices.months = index++;
          } else if (['d', 'j'].indexOf(char) !== -1) {
            indices.days = index++;
          } else if (['G', 'g', 'H', 'h'].indexOf(char) !== -1) {
            indices.hours = index++;
          } else if (char === 'i') {
            indices.minutes = index++;
          } else if (char === 's') {
            indices.seconds = index++;
          } else if (['A', 'a'].indexOf(char) !== -1) {
            indices.meridiem = index++;
          }
        } else {
          pattern += '\\' + char;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    pattern += '$';
    var match = value.match(new RegExp(pattern));
    if (match === null) {
      return new Date('');
    }
    match = match.map(function (value) {
      return value && /^\d*$/.test(value) ? parseInt(value) : value;
    });
    var current = new Date();
    var years = match[indices.years];
    var months = match[indices.months];
    var days = match[indices.days];
    var hours = (_match$indices$hours = match[indices.hours]) !== null && _match$indices$hours !== void 0 ? _match$indices$hours : 0;
    var minutes = (_match$indices$minute = match[indices.minutes]) !== null && _match$indices$minute !== void 0 ? _match$indices$minute : 0;
    var seconds = (_match$indices$second = match[indices.seconds]) !== null && _match$indices$second !== void 0 ? _match$indices$second : 0;
    var meridiem = (_match$indices$meridi = match[indices.meridiem]) !== null && _match$indices$meridi !== void 0 ? _match$indices$meridi : 'am';
    if (!years && !months && !days) {
      years = current.getFullYear();
      months = current.getMonth() + 1;
      days = current.getDate();
    } else if (years && !months && !days) {
      months = 1;
      days = 1;
    } else if (!years && months && !days) {
      years = current.getFullYear();
      days = 1;
    } else if (!years && !months && days) {
      years = current.getFullYear();
      months = current.getMonth() + 1;
    }
    if (years >= 10 && years < 100) {
      years = years + 2000;
    }
    if (meridiem.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    return new Date("".concat(years, "-").concat(months, "-").concat(days, " ").concat(hours, ":").concat(minutes, ":").concat(seconds));
  }
  function isDigits(value) {
    return String(value).search(/[^0-9]/) === -1;
  }
  function isEmpty(value) {
    return value === '' || value === null || typeof value === 'undefined';
  }
  function isNumeric(value) {
    var number = Number(value);
    return value !== null && typeof value !== 'boolean' && typeof number === 'number' && !isNaN(number);
  }
  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }
  function isValidDate(value) {
    return value instanceof Date && value.toDateString() !== 'Invalid Date';
  }

  var _distinctCache = /*#__PURE__*/new WeakMap();
  var _imageCache = /*#__PURE__*/new WeakMap();
  var Checkers = /*#__PURE__*/function () {
    function Checkers(validator) {
      _classCallCheck(this, Checkers);
      _defineProperty(this, "validator", void 0);
      _classPrivateFieldInitSpec(this, _distinctCache, {
        writable: true,
        value: {}
      });
      _classPrivateFieldInitSpec(this, _imageCache, {
        writable: true,
        value: {}
      });
      this.validator = validator;
    }

    // Internal helpers
    _createClass(Checkers, [{
      key: "clearCaches",
      value: function clearCaches() {
        _classPrivateFieldSet(this, _distinctCache, {});
        _classPrivateFieldSet(this, _imageCache, {});
      }
    }, {
      key: "isDependent",
      value: function isDependent(parameters) {
        var other = this.validator.getValue(parameters[0]);
        return parameters.slice(1).some(function (value) {
          return value == other;
        });
      }
    }, {
      key: "collectRequiredsThenTest",
      value: function collectRequiredsThenTest(attribute, value, parameters, callback) {
        var result = [];
        var _iterator = _createForOfIteratorHelper(parameters),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var other = _step.value;
            result.push(this.checkRequired(other, this.validator.getValue(other)));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (callback(result)) {
          return this.checkRequired(attribute, value);
        }
        return true;
      }
    }, {
      key: "collectMissingsThenTest",
      value: function collectMissingsThenTest(attribute, value, parameters, callback) {
        var result = [];
        var _iterator2 = _createForOfIteratorHelper(parameters),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var other = _step2.value;
            result.push(this.checkMissing(other));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        if (callback(result)) {
          return this.checkMissing(attribute);
        }
        return true;
      }
    }, {
      key: "testStringUsingRegex",
      value: function testStringUsingRegex(attribute, value, asciiRegex, unicodeRegex) {
        var isAscii = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        if (typeof value !== 'string' && typeof value !== 'number') {
          return false;
        }
        value = String(value);
        if (isAscii || this.validator.hasRule(attribute, 'ascii')) {
          return asciiRegex.test(value);
        }
        return unicodeRegex.test(value);
      }
    }, {
      key: "compareValues",
      value: function compareValues(attribute, value, parameters, callback) {
        var _parameters$;
        if (isEmpty(value)) {
          return false;
        }
        var other = (_parameters$ = parameters[0]) !== null && _parameters$ !== void 0 ? _parameters$ : '';
        var otherValue = this.validator.getValue(other);
        if (typeof otherValue === 'undefined') {
          if (isNumeric(other)) {
            otherValue = parseFloat(other, 10);
          } else {
            otherValue = null;
          }
        } else {
          otherValue = this.validator.getSize(other, otherValue);
        }
        if (isEmpty(otherValue)) {
          return false;
        }
        return callback(this.validator.getSize(attribute, value), otherValue);
      }
    }, {
      key: "compareDates",
      value: function compareDates(attribute, value, parameters, callback) {
        var _parameters$2;
        var rule = this.validator.getRule(attribute);
        value = rule.hasOwnProperty('date_format') ? parseDateByFormat(value, rule.date_format[0]) : parseDate(value);
        if (!isValidDate(value)) {
          return false;
        }
        var other = (_parameters$2 = parameters[0]) !== null && _parameters$2 !== void 0 ? _parameters$2 : '';
        var otherValue = this.validator.getValue(other);
        if (typeof otherValue === 'undefined') {
          otherValue = parseDate(other);
        } else {
          var otherRule = this.validator.getRule(other);
          otherValue = otherRule.hasOwnProperty('date_format') ? parseDateByFormat(otherValue, otherRule.date_format[0]) : parseDate(otherValue);
        }
        if (!isValidDate(otherValue)) {
          return false;
        }
        return callback(value.getTime(), otherValue.getTime());
      }

      // Type
    }, {
      key: "checkArray",
      value: function checkArray(attribute, value, parameters) {
        if (!(Array.isArray(value) || isPlainObject(value))) {
          return false;
        }
        if (parameters && parameters.length > 0) {
          for (var _i = 0, _Object$keys = Object.keys(value); _i < _Object$keys.length; _i++) {
            var key = _Object$keys[_i];
            if (!parameters.includes(key)) {
              return false;
            }
          }
        }
        return true;
      }
    }, {
      key: "checkBoolean",
      value: function checkBoolean(attribute, value, parameters) {
        return [true, false, 0, 1, '0', '1'].includes(value);
      }
    }, {
      key: "checkDate",
      value: function checkDate(attribute, value, parameters) {
        return isValidDate(parseDate(value));
      }
    }, {
      key: "checkFile",
      value: function checkFile(attribute, value, parameters) {
        return value instanceof File;
      }
    }, {
      key: "checkInteger",
      value: function checkInteger(attribute, value, parameters) {
        return String(parseInt(value, 10)) === String(value);
      }
    }, {
      key: "checkNumeric",
      value: function checkNumeric(attribute, value, parameters) {
        return isNumeric(value);
      }
    }, {
      key: "checkString",
      value: function checkString(attribute, value, parameters) {
        return typeof value === 'string';
      }

      // Numeric
    }, {
      key: "checkDecimal",
      value: function checkDecimal(attribute, value, parameters) {
        var _String$split$;
        if (!this.checkNumeric(attribute, value)) {
          return false;
        }
        var decimals = ((_String$split$ = String(value).split('.')[1]) !== null && _String$split$ !== void 0 ? _String$split$ : '').length;
        if (parameters.length === 1) {
          return decimals == parameters[0];
        }
        return decimals >= parameters[0] && decimals <= parameters[1];
      }
    }, {
      key: "checkMultipleOf",
      value: function checkMultipleOf(attribute, value, parameters) {
        if (!isNumeric(value) || !isNumeric(parameters[0])) {
          return false;
        }
        var numerator = parseInt(value, 10);
        var denominator = parseInt(parameters[0], 10);
        if (numerator === 0 && denominator === 0) {
          return false;
        } else if (numerator === 0) {
          return true;
        } else if (denominator === 0) {
          return false;
        }
        return numerator % denominator === 0;
      }

      // Agreement
    }, {
      key: "checkAccepted",
      value: function checkAccepted(attribute, value, parameters) {
        return ['yes', 'on', '1', 1, true, 'true'].includes(value);
      }
    }, {
      key: "checkAcceptedIf",
      value: function checkAcceptedIf(attribute, value, parameters) {
        if (this.isDependent(parameters)) {
          return this.checkAccepted(attribute, value, parameters);
        }
        return true;
      }
    }, {
      key: "checkDeclined",
      value: function checkDeclined(attribute, value, parameters) {
        return ['no', 'off', '0', 0, false, 'false'].includes(value);
      }
    }, {
      key: "checkDeclinedIf",
      value: function checkDeclinedIf(attribute, value, parameters) {
        if (this.isDependent(parameters)) {
          return this.checkDeclined(attribute, value, parameters);
        }
        return true;
      }

      // Existence
    }, {
      key: "checkRequired",
      value: function checkRequired(attribute, value, parameters) {
        if (isEmpty(value)) {
          return false;
        } else if (Array.isArray(value)) {
          return value.length > 0;
        } else if (value instanceof File) {
          return value.size > 0;
        }
        value = String(value).replace(/\s/g, '');
        return value.length > 0;
      }
    }, {
      key: "checkRequiredArrayKeys",
      value: function checkRequiredArrayKeys(attribute, value, parameters) {
        if (!this.checkArray(attribute, value)) {
          return false;
        }
        var keys = Object.keys(value);
        var _iterator3 = _createForOfIteratorHelper(parameters),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var parameter = _step3.value;
            if (!keys.includes(parameter)) {
              return false;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        return true;
      }
    }, {
      key: "checkRequiredIf",
      value: function checkRequiredIf(attribute, value, parameters) {
        if (this.isDependent(parameters)) {
          return this.checkRequired(attribute, value);
        }
        return true;
      }
    }, {
      key: "checkRequiredIfAccepted",
      value: function checkRequiredIfAccepted(attribute, value, parameters) {
        if (this.checkAccepted(parameters[0], this.validator.getValue(parameters[0]))) {
          return this.checkRequired(attribute, value);
        }
        return true;
      }
    }, {
      key: "checkRequiredUnless",
      value: function checkRequiredUnless(attribute, value, parameters) {
        if (!this.isDependent(parameters)) {
          return this.checkRequired(attribute, value);
        }
        return true;
      }
    }, {
      key: "checkRequiredWith",
      value: function checkRequiredWith(attribute, value, parameters) {
        return this.collectRequiredsThenTest(attribute, value, parameters, function (result) {
          return result.includes(true);
        });
      }
    }, {
      key: "checkRequiredWithAll",
      value: function checkRequiredWithAll(attribute, value, parameters) {
        return this.collectRequiredsThenTest(attribute, value, parameters, function (result) {
          return !result.includes(false);
        });
      }
    }, {
      key: "checkRequiredWithout",
      value: function checkRequiredWithout(attribute, value, parameters) {
        return this.collectRequiredsThenTest(attribute, value, parameters, function (result) {
          return result.includes(false);
        });
      }
    }, {
      key: "checkRequiredWithoutAll",
      value: function checkRequiredWithoutAll(attribute, value, parameters) {
        return this.collectRequiredsThenTest(attribute, value, parameters, function (result) {
          return !result.includes(true);
        });
      }
    }, {
      key: "checkFilled",
      value: function checkFilled(attribute, value, parameters) {
        if (typeof value !== 'undefined') {
          return this.checkRequired(attribute, value);
        }
        return true;
      }
    }, {
      key: "checkPresent",
      value: function checkPresent(attribute, value, parameters) {
        return typeof value !== 'undefined';
      }

      // Missing
    }, {
      key: "checkMissing",
      value: function checkMissing(attribute, value, parameters) {
        return !this.validator.hasAttribute(attribute);
      }
    }, {
      key: "checkMissingIf",
      value: function checkMissingIf(attribute, value, parameters) {
        if (this.isDependent(parameters)) {
          return this.checkMissing(attribute);
        }
        return true;
      }
    }, {
      key: "checkMissingUnless",
      value: function checkMissingUnless(attribute, value, parameters) {
        if (!this.isDependent(parameters)) {
          return this.checkMissing(attribute);
        }
        return true;
      }
    }, {
      key: "checkMissingWith",
      value: function checkMissingWith(attribute, value, parameters) {
        return this.collectMissingsThenTest(attribute, value, parameters, function (result) {
          return result.includes(false);
        });
      }
    }, {
      key: "checkMissingWithAll",
      value: function checkMissingWithAll(attribute, value, parameters) {
        return this.collectMissingsThenTest(attribute, value, parameters, function (result) {
          return !result.includes(true);
        });
      }

      // Prohibition
    }, {
      key: "checkProhibited",
      value: function checkProhibited(attribute, value, parameters) {
        return !this.checkRequired(attribute, value);
      }
    }, {
      key: "checkProhibitedIf",
      value: function checkProhibitedIf(attribute, value, parameters) {
        if (this.isDependent(parameters)) {
          return !this.checkRequired(attribute, value);
        }
        return true;
      }
    }, {
      key: "checkProhibitedUnless",
      value: function checkProhibitedUnless(attribute, value, parameters) {
        if (!this.isDependent(parameters)) {
          return !this.checkRequired(attribute, value);
        }
        return true;
      }
    }, {
      key: "checkProhibits",
      value: function checkProhibits(attribute, value, parameters) {
        if (this.checkRequired(attribute, value)) {
          var _iterator4 = _createForOfIteratorHelper(parameters),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var parameter = _step4.value;
              if (this.checkRequired(parameter, this.validator.getValue(parameter))) {
                return false;
              }
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }
        return true;
      }

      // Size
    }, {
      key: "checkSize",
      value: function checkSize(attribute, value, parameters) {
        return this.validator.getSize(attribute, value) === parseFloat(parameters[0]);
      }
    }, {
      key: "checkMin",
      value: function checkMin(attribute, value, parameters) {
        return this.validator.getSize(attribute, value) >= parseFloat(parameters[0]);
      }
    }, {
      key: "checkMax",
      value: function checkMax(attribute, value, parameters) {
        return this.validator.getSize(attribute, value) <= parseFloat(parameters[0]);
      }
    }, {
      key: "checkBetween",
      value: function checkBetween(attribute, value, parameters) {
        return this.checkMin(attribute, value, [parameters[0]]) && this.checkMax(attribute, value, [parameters[1]]);
      }

      // Digits
    }, {
      key: "checkDigits",
      value: function checkDigits(attribute, value, parameters) {
        var _value, _parameters$3;
        var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (length, value) {
          return length === value;
        };
        value = String((_value = value) !== null && _value !== void 0 ? _value : '');
        if (!isDigits(value)) {
          return false;
        }
        return callback(value.length, parseInt(parameters[0], 10), parseInt((_parameters$3 = parameters[1]) !== null && _parameters$3 !== void 0 ? _parameters$3 : 0, 10));
      }
    }, {
      key: "checkMinDigits",
      value: function checkMinDigits(attribute, value, parameters) {
        return this.checkDigits(attribute, value, parameters, function (length, value) {
          return length >= value;
        });
      }
    }, {
      key: "checkMaxDigits",
      value: function checkMaxDigits(attribute, value, parameters) {
        return this.checkDigits(attribute, value, parameters, function (length, value) {
          return length <= value;
        });
      }
    }, {
      key: "checkDigitsBetween",
      value: function checkDigitsBetween(attribute, value, parameters) {
        return this.checkDigits(attribute, value, parameters, function (length, value1, value2) {
          return length >= value1 && length <= value2;
        });
      }

      // String
    }, {
      key: "checkAlpha",
      value: function checkAlpha(attribute, value, parameters) {
        return this.testStringUsingRegex(attribute, value, /^[a-z]+$/i, /^(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u065F\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06EF\u06FA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07CA-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u0870-\u0887\u0889-\u088E\u0898-\u08E1\u08E3-\u0963\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09F0\u09F1\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A70-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CF1-\u0CF3\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECE\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u103F\u1050-\u108F\u109A-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1715\u171F-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u180B-\u180D\u180F\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F\u1AA7\u1AB0-\u1ACE\u1B00-\u1B4C\u1B6B-\u1B73\u1B80-\u1BAF\u1BBA-\u1BF3\u1C00-\u1C37\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u20D0-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005\u3006\u302A-\u302F\u3031-\u3035\u303B\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA672\uA674-\uA67D\uA67F-\uA6E5\uA6F0\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA827\uA82C\uA840-\uA873\uA880-\uA8C5\uA8E0-\uA8F7\uA8FB\uA8FD-\uA8FF\uA90A-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF\uA9E0-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uABEC\uABED\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD27\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDEFD-\uDF1C\uDF27\uDF30-\uDF50\uDF70-\uDF85\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC70-\uDC75\uDC7F-\uDCBA\uDCC2\uDCD0-\uDCE8\uDD00-\uDD34\uDD44-\uDD47\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDCE\uDDCF\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E-\uDE41\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC5E-\uDC61\uDC80-\uDCC5\uDCC7\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE80-\uDEB8\uDF00-\uDF1A\uDF1D-\uDF2B\uDF40-\uDF46]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD43\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDEE0-\uDEF6\uDF00-\uDF10\uDF12-\uDF3A\uDF3E-\uDF42\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC40-\uDC55]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFE4\uDFF0\uDFF1]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC30-\uDC6D\uDC8F\uDD00-\uDD2C\uDD30-\uDD3D\uDD4E\uDE90-\uDEAE\uDEC0-\uDEEF]|\uD839[\uDCD0-\uDCEF\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF]|\uDB40[\uDD00-\uDDEF])+$/, parameters.includes('ascii'));
      }
    }, {
      key: "checkAlphaDash",
      value: function checkAlphaDash(attribute, value, parameters) {
        return this.testStringUsingRegex(attribute, value, /^[a-z0-9_-]+$/i, /^(?:[\x2D0-9A-Z_a-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u0870-\u0887\u0889-\u088E\u0898-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09F4-\u09F9\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71-\u0B77\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BF2\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7E\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF3\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D63\u0D66-\u0D78\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECE\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F33\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1715\u171F-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u17F0-\u17F9\u180B-\u180D\u180F-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ACE\u1B00-\u1B4C\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u20D0-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA672\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA827\uA82C\uA830-\uA835\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE6\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD27\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDEFD-\uDF27\uDF30-\uDF54\uDF70-\uDF85\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC52-\uDC75\uDC7F-\uDCBA\uDCC2\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD44-\uDD47\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDCE-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE37\uDE3E-\uDE41\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5E-\uDC61\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD43\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF6\uDF00-\uDF10\uDF12-\uDF3A\uDF3E-\uDF42\uDF50-\uDF59\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC40-\uDC55]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFE4\uDFF0\uDFF1]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44\uDEC0-\uDED3\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC30-\uDC6D\uDC8F\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAE\uDEC0-\uDEF9]|\uD839[\uDCD0-\uDCF9\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCD6\uDD00-\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF]|\uDB40[\uDD00-\uDDEF])+$/, parameters.includes('ascii'));
      }
    }, {
      key: "checkAlphaNum",
      value: function checkAlphaNum(attribute, value, parameters) {
        return this.testStringUsingRegex(attribute, value, /^[a-z0-9]+$/i, /^(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u0870-\u0887\u0889-\u088E\u0898-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09F4-\u09F9\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71-\u0B77\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BF2\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7E\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF3\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D63\u0D66-\u0D78\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECE\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F33\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1715\u171F-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u17F0-\u17F9\u180B-\u180D\u180F-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ACE\u1B00-\u1B4C\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u20D0-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA672\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA827\uA82C\uA830-\uA835\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE6\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD27\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDEFD-\uDF27\uDF30-\uDF54\uDF70-\uDF85\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC52-\uDC75\uDC7F-\uDCBA\uDCC2\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD44-\uDD47\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDCE-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE37\uDE3E-\uDE41\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5E-\uDC61\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD43\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF6\uDF00-\uDF10\uDF12-\uDF3A\uDF3E-\uDF42\uDF50-\uDF59\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC40-\uDC55]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFE4\uDFF0\uDFF1]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44\uDEC0-\uDED3\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC30-\uDC6D\uDC8F\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAE\uDEC0-\uDEF9]|\uD839[\uDCD0-\uDCF9\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCD6\uDD00-\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF]|\uDB40[\uDD00-\uDDEF])+$/, parameters.includes('ascii'));
      }
    }, {
      key: "checkAscii",
      value: function checkAscii(attribute, value, parameters) {
        return !/[^\x09\x10\x13\x0A\x0D\x20-\x7E]/.test(value);
      }
    }, {
      key: "checkRegex",
      value: function checkRegex(attribute, value, parameters) {
        var _expression$match;
        var invert = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        if (!(typeof value === 'string' || isNumeric(value))) {
          return false;
        }
        var expression = parameters.join(',');
        var _ref = (_expression$match = expression.match(/^\/(.*)\/([gimu]*)$/)) !== null && _expression$match !== void 0 ? _expression$match : [],
          _ref2 = _slicedToArray(_ref, 3),
          whole = _ref2[0],
          pattern = _ref2[1],
          flags = _ref2[2];
        if (isEmpty(whole)) {
          throw new Error("Invalid regular expression pattern: ".concat(expression));
        }
        if (flags.includes('u')) {
          pattern = pattern.replace(/\\A/g, '^').replace(/\\z/gi, '$').replace(/\\([pP])([CLMNPSZ])/g, '\\$1{$2}').replace(/\\\x\{([0-9a-f]+)\}/g, "\\u{$1}");
        }
        var result = new RegExp(pattern, flags).test(value);
        return invert ? !result : result;
      }
    }, {
      key: "checkNotRegex",
      value: function checkNotRegex(attribute, value, parameters) {
        return this.checkRegex(attribute, value, parameters, true);
      }
    }, {
      key: "checkLowercase",
      value: function checkLowercase(attribute, value, parameters) {
        return value === String(value).toLocaleLowerCase();
      }
    }, {
      key: "checkUppercase",
      value: function checkUppercase(attribute, value, parameters) {
        return value === String(value).toLocaleUpperCase();
      }
    }, {
      key: "checkStartsWith",
      value: function checkStartsWith(attribute, value, parameters) {
        value = String(value);
        var _iterator5 = _createForOfIteratorHelper(parameters),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var parameter = _step5.value;
            if (value.startsWith(parameter)) {
              return true;
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        return false;
      }
    }, {
      key: "checkDoesntStartWith",
      value: function checkDoesntStartWith(attribute, value, parameters) {
        return !this.checkStartsWith(attribute, value, parameters);
      }
    }, {
      key: "checkEndsWith",
      value: function checkEndsWith(attribute, value, parameters) {
        value = String(value);
        var _iterator6 = _createForOfIteratorHelper(parameters),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var parameter = _step6.value;
            if (value.endsWith(parameter)) {
              return true;
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
        return false;
      }
    }, {
      key: "checkDoesntEndWith",
      value: function checkDoesntEndWith(attribute, value, parameters) {
        return !this.checkEndsWith(attribute, value, parameters);
      }

      // Compare values
    }, {
      key: "checkSame",
      value: function checkSame(attribute, value, parameters) {
        var other = this.validator.getValue(parameters[0]);
        return value === other;
      }
    }, {
      key: "checkDifferent",
      value: function checkDifferent(attribute, value, parameters) {
        var _iterator7 = _createForOfIteratorHelper(parameters),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var parameter = _step7.value;
            var other = this.validator.getValue(parameter);
            if (typeof other !== 'undefined' && value === other) {
              return false;
            }
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
        return true;
      }
    }, {
      key: "checkConfirmed",
      value: function checkConfirmed(attribute, value, parameters) {
        return this.checkSame(attribute, value, [attribute + '_confirmation']);
      }
    }, {
      key: "checkGt",
      value: function checkGt(attribute, value, parameters) {
        return this.compareValues(attribute, value, parameters, function (val1, val2) {
          return val1 > val2;
        });
      }
    }, {
      key: "checkGte",
      value: function checkGte(attribute, value, parameters) {
        return this.compareValues(attribute, value, parameters, function (val1, val2) {
          return val1 >= val2;
        });
      }
    }, {
      key: "checkLt",
      value: function checkLt(attribute, value, parameters) {
        return this.compareValues(attribute, value, parameters, function (val1, val2) {
          return val1 < val2;
        });
      }
    }, {
      key: "checkLte",
      value: function checkLte(attribute, value, parameters) {
        return this.compareValues(attribute, value, parameters, function (val1, val2) {
          return val1 <= val2;
        });
      }

      // Dates
    }, {
      key: "checkAfter",
      value: function checkAfter(attribute, value, parameters) {
        return this.compareDates(attribute, value, parameters, function (val1, val2) {
          return val1 > val2;
        });
      }
    }, {
      key: "checkAfterOrEqual",
      value: function checkAfterOrEqual(attribute, value, parameters) {
        return this.compareDates(attribute, value, parameters, function (val1, val2) {
          return val1 >= val2;
        });
      }
    }, {
      key: "checkBefore",
      value: function checkBefore(attribute, value, parameters) {
        return this.compareDates(attribute, value, parameters, function (val1, val2) {
          return val1 < val2;
        });
      }
    }, {
      key: "checkBeforeOrEqual",
      value: function checkBeforeOrEqual(attribute, value, parameters) {
        return this.compareDates(attribute, value, parameters, function (val1, val2) {
          return val1 <= val2;
        });
      }
    }, {
      key: "checkDateEquals",
      value: function checkDateEquals(attribute, value, parameters) {
        return this.compareDates(attribute, value, parameters, function (val1, val2) {
          return val1 === val2;
        });
      }
    }, {
      key: "checkDateFormat",
      value: function checkDateFormat(attribute, value, parameters) {
        var format = parameters[0].split('');
        var formats = {
          Y: '(\\d{4})',
          y: '(\\d{2})',
          m: '(\\d{2})',
          n: '([1-9]\\d?)',
          d: '(\\d{2})',
          j: '([1-9]\\d?)',
          G: '([1-9]\\d?)',
          g: '([1-9]\\d?)',
          H: '(\\d{2})',
          h: '(\\d{2})',
          i: '(\\d{2})',
          s: '(\\d{2})',
          A: '(AM|PM)',
          a: '(am|pm)'
        };
        var pattern = '^';
        var _iterator8 = _createForOfIteratorHelper(format),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var char = _step8.value;
            if (formats.hasOwnProperty(char)) {
              pattern += formats[char];
            } else {
              pattern += '\\' + char;
            }
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
        pattern += '$';
        return new RegExp(pattern).test(value);
      }

      // Array / Object
    }, {
      key: "checkDistinct",
      value: function checkDistinct(attribute, value, parameters) {
        var _stringified$match$le, _stringified$match;
        var unparsed = this.validator.getPrimaryAttribute(attribute);
        if (!unparsed.includes('*')) {
          return true;
        }
        var index = unparsed.indexOf('*');
        var parentPath = unparsed.substring(0, index - 1);
        var stringified;
        if (_classPrivateFieldGet(this, _distinctCache).hasOwnProperty(parentPath)) {
          stringified = _classPrivateFieldGet(this, _distinctCache)[parentPath];
        } else {
          var _this$validator$getVa;
          stringified = JSON.stringify(flattenObject((_this$validator$getVa = this.validator.getValue(parentPath)) !== null && _this$validator$getVa !== void 0 ? _this$validator$getVa : {}));
          _classPrivateFieldGet(this, _distinctCache)[parentPath] = stringified;
        }
        var ignoreCase = parameters.includes('ignore_case');
        var isStrict = !ignoreCase && parameters.includes('strict');
        var escapedValue = escapeRegExp(String(value));
        var pattern = "\"".concat(escapeRegExp(unparsed.substring(index)).replaceAll('\\*', '[^."]+'), "\":");
        var counter = 0;
        if (isStrict) {
          if (typeof value === 'string') {
            pattern += "\"".concat(escapedValue, "\"");
          } else {
            pattern += "".concat(escapedValue);
          }
        } else {
          pattern += "(".concat(escapedValue, "|\"").concat(escapedValue, "\")");
        }
        pattern += '[,}]+';
        counter += (_stringified$match$le = (_stringified$match = stringified.match(new RegExp(pattern, 'g' + (ignoreCase ? 'i' : '')))) === null || _stringified$match === void 0 ? void 0 : _stringified$match.length) !== null && _stringified$match$le !== void 0 ? _stringified$match$le : 0;
        return counter === 1;
      }
    }, {
      key: "checkInArray",
      value: function checkInArray(attribute, value, parameters) {
        var _this$validator$getVa2;
        var unparsed = this.validator.getPrimaryAttribute(parameters[0]);
        if (!unparsed.includes('*')) {
          return false;
        }
        var data = (_this$validator$getVa2 = this.validator.getValue(unparsed.split('.*')[0])) !== null && _this$validator$getVa2 !== void 0 ? _this$validator$getVa2 : {};
        return Object.values(flattenObject(data)).some(function (item) {
          return item == value;
        });
      }
    }, {
      key: "checkIn",
      value: function checkIn(attribute, value, parameters) {
        if (!(this.checkArray(attribute, value) && this.validator.hasRule(attribute, 'array'))) {
          return parameters.some(function (parameter) {
            return parameter == value;
          });
        }
        var _loop = function _loop() {
          var item = _Object$values[_i2];
          if (!parameters.some(function (parameter) {
            return parameter == item;
          })) {
            return {
              v: false
            };
          }
        };
        for (var _i2 = 0, _Object$values = Object.values(value); _i2 < _Object$values.length; _i2++) {
          var _ret = _loop();
          if (_typeof(_ret) === "object") return _ret.v;
        }
        return true;
      }
    }, {
      key: "checkNotIn",
      value: function checkNotIn(attribute, value, parameters) {
        return !this.checkIn(attribute, value, parameters);
      }

      // File
    }, {
      key: "checkMimetypes",
      value: function checkMimetypes(attribute, value, parameters) {
        if (this.checkFile(attribute, value)) {
          return parameters.includes(value.type);
        }
        return false;
      }
    }, {
      key: "checkMimes",
      value: function checkMimes(attribute, value, parameters) {
        if (this.checkFile(attribute, value)) {
          return parameters.includes(value.name.split('.').pop().toLowerCase());
        }
        return false;
      }
    }, {
      key: "checkImage",
      value: function () {
        var _checkImage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(attribute, value, parameters) {
          var _this = this;
          var result;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                result = this.checkMimes(attribute, value, ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']);
                if (!(!result || typeof FileReader === 'undefined')) {
                  _context2.next = 3;
                  break;
                }
                return _context2.abrupt("return", result);
              case 3:
                _context2.next = 5;
                return new Promise(function (resolve, reject) {
                  var reader = new FileReader();
                  reader.onload = function (event) {
                    return resolve(event.target.result);
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(value);
                }).then( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
                    var image;
                    return _regeneratorRuntime().wrap(function _callee$(_context) {
                      while (1) switch (_context.prev = _context.next) {
                        case 0:
                          image = new Image();
                          image.src = data;
                          _context.next = 4;
                          return image.decode();
                        case 4:
                          _classPrivateFieldGet(_this, _imageCache)[attribute] = image;
                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }, _callee);
                  }));
                  return function (_x4) {
                    return _ref3.apply(this, arguments);
                  };
                }()).catch(function () {
                  result = false;
                });
              case 5:
                return _context2.abrupt("return", result);
              case 6:
              case "end":
                return _context2.stop();
            }
          }, _callee2, this);
        }));
        function checkImage(_x, _x2, _x3) {
          return _checkImage.apply(this, arguments);
        }
        return checkImage;
      }()
    }, {
      key: "checkDimensions",
      value: function () {
        var _checkDimensions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(attribute, value, parameters) {
          var constraints, _iterator9, _step9, parameter, _parameter$split, _parameter$split2, key, _value2, _value2$split$map, _value2$split$map2, numerator, denominator, image, width, height;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!this.checkImage(attribute, value) || !_classPrivateFieldGet(this, _imageCache).hasOwnProperty(attribute))) {
                  _context3.next = 2;
                  break;
                }
                return _context3.abrupt("return", false);
              case 2:
                constraints = {};
                _iterator9 = _createForOfIteratorHelper(parameters);
                try {
                  for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                    parameter = _step9.value;
                    _parameter$split = parameter.split('=', 2), _parameter$split2 = _slicedToArray(_parameter$split, 2), key = _parameter$split2[0], _value2 = _parameter$split2[1];
                    if (key === 'ratio' && _value2.includes('/')) {
                      _value2$split$map = _value2.split('/', 2).map(function (part) {
                        return parseFloat(part, 10);
                      }), _value2$split$map2 = _slicedToArray(_value2$split$map, 2), numerator = _value2$split$map2[0], denominator = _value2$split$map2[1];
                      constraints[key] = numerator / denominator;
                    } else {
                      constraints[key] = parseFloat(_value2, 10);
                    }
                  }
                } catch (err) {
                  _iterator9.e(err);
                } finally {
                  _iterator9.f();
                }
                image = _classPrivateFieldGet(this, _imageCache)[attribute];
                width = image.naturalWidth;
                height = image.naturalHeight;
                if (!(constraints.hasOwnProperty('width') && constraints.width !== width || constraints.hasOwnProperty('height') && constraints.height !== height || constraints.hasOwnProperty('min_width') && constraints.min_width > width || constraints.hasOwnProperty('min_height') && constraints.min_height > height || constraints.hasOwnProperty('max_width') && constraints.max_width < width || constraints.hasOwnProperty('max_height') && constraints.max_height < height)) {
                  _context3.next = 10;
                  break;
                }
                return _context3.abrupt("return", false);
              case 10:
                if (!constraints.hasOwnProperty('ratio')) {
                  _context3.next = 12;
                  break;
                }
                return _context3.abrupt("return", Math.abs(constraints.ratio - width / height) <= 1 / (Math.max(width, height) + 1));
              case 12:
                return _context3.abrupt("return", true);
              case 13:
              case "end":
                return _context3.stop();
            }
          }, _callee3, this);
        }));
        function checkDimensions(_x5, _x6, _x7) {
          return _checkDimensions.apply(this, arguments);
        }
        return checkDimensions;
      }() // Miscellaneous
    }, {
      key: "checkEmail",
      value: function checkEmail(attribute, value, parameters) {
        var firstRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!firstRegex.test(value)) {
          var secondRegex = /^((?:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]|[^\u0000-\u007F])+@(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?(?:\.(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?)+)*$/;
          return secondRegex.test(value);
        }
        return true;
      }
    }, {
      key: "checkJson",
      value: function checkJson(attribute, value, parameters) {
        try {
          JSON.parse(value);
        } catch (error) {
          return false;
        }
        return true;
      }
    }, {
      key: "checkMacAddress",
      value: function checkMacAddress(attribute, value, parameters) {
        value = String(value);
        var separators = {
          '-': 2,
          ':': 2,
          '.': 4
        };
        var separator, digits;
        for (var _i3 = 0, _Object$entries = Object.entries(separators); _i3 < _Object$entries.length; _i3++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i3], 2);
          separator = _Object$entries$_i[0];
          digits = _Object$entries$_i[1];
          if (value.includes(separator)) {
            break;
          }
        }
        var blocks = value.split(separator);
        if (blocks.length !== 12 / digits) {
          return false;
        }
        var _iterator10 = _createForOfIteratorHelper(blocks),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var block = _step10.value;
            if (!new RegExp('^[0-9a-f]{' + digits + '}$', 'i').test(block)) {
              return false;
            }
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
        return true;
      }
    }, {
      key: "checkIpv4",
      value: function checkIpv4(attribute, value, parameters) {
        if (/[^\d.]/.test(value)) {
          return false;
        }
        var blocks = String(value).split('.');
        if (blocks.length !== 4) {
          return false;
        }
        var _iterator11 = _createForOfIteratorHelper(blocks),
          _step11;
        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var block = _step11.value;
            if (block < 0 || block > 255) {
              return false;
            }
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
        return true;
      }
    }, {
      key: "checkIpv6",
      value: function checkIpv6(attribute, value, parameters) {
        value = String(value);
        if (value.includes(':::') || value.split('::').length > 2) {
          return false;
        }
        var blocks = value.split(':');
        if (blocks.length < 3 || blocks.length > 8) {
          return false;
        }
        var _iterator12 = _createForOfIteratorHelper(blocks),
          _step12;
        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var block = _step12.value;
            if (block !== '' && !/^[0-9a-f]{1,4}$/i.test(block)) {
              return false;
            }
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }
        return true;
      }
    }, {
      key: "checkIp",
      value: function checkIp(attribute, value, parameters) {
        return this.checkIpv4(attribute, value, parameters) || this.checkIpv6(attribute, value, parameters);
      }
    }, {
      key: "checkTimezone",
      value: function checkTimezone(attribute, value, parameters) {
        try {
          Intl.DateTimeFormat(undefined, {
            timeZone: value
          });
        } catch (error) {
          if (String(error).toLowerCase().includes('invalid time zone')) {
            return false;
          }
        }
        return true;
      }
    }, {
      key: "checkUrl",
      value: function checkUrl(attribute, value, parameters) {
        try {
          new URL(value);
        } catch (error) {
          return false;
        }
        return true;
      }
    }, {
      key: "checkUlid",
      value: function checkUlid(attribute, value, parameters) {
        return /[0-7][0-9A-HJKMNP-TV-Z]{25}/.test(value);
      }
    }, {
      key: "checkUuid",
      value: function checkUuid(attribute, value, parameters) {
        return /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(value);
      }
    }]);
    return Checkers;
  }();

  var _data$1 = /*#__PURE__*/new WeakMap();
  var ErrorBag = /*#__PURE__*/function () {
    function ErrorBag() {
      _classCallCheck(this, ErrorBag);
      _classPrivateFieldInitSpec(this, _data$1, {
        writable: true,
        value: {}
      });
    }
    _createClass(ErrorBag, [{
      key: "keys",
      value: function keys() {
        return Object.keys(_classPrivateFieldGet(this, _data$1));
      }
    }, {
      key: "values",
      value: function values() {
        return Object.values(_classPrivateFieldGet(this, _data$1));
      }
    }, {
      key: "entries",
      value: function entries() {
        return Object.entries(_classPrivateFieldGet(this, _data$1));
      }
    }, {
      key: "add",
      value: function add(key, message) {
        if (_classPrivateFieldGet(this, _data$1).hasOwnProperty(key)) {
          _classPrivateFieldGet(this, _data$1)[key].push(message);
        } else {
          _classPrivateFieldGet(this, _data$1)[key] = [message];
        }
      }
    }, {
      key: "get",
      value: function get(key) {
        if (!key.includes('*')) {
          return _classPrivateFieldGet(this, _data$1).hasOwnProperty(key) ? _classPrivateFieldGet(this, _data$1)[key] : {};
        }
        var pattern = new RegExp('^' + key.replaceAll('*', '.*?') + '$');
        var result = {};
        var _iterator = _createForOfIteratorHelper(this.entries()),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _step$value = _slicedToArray(_step.value, 2),
              _key = _step$value[0],
              value = _step$value[1];
            if (pattern.test(_key)) {
              result[_key] = value;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return result;
      }
    }, {
      key: "first",
      value: function first(key) {
        for (var _i = 0, _Object$values = Object.values(this.get(key)); _i < _Object$values.length; _i++) {
          var message = _Object$values[_i];
          return Array.isArray(message) ? message[0] : message;
        }
        return '';
      }
    }, {
      key: "has",
      value: function has(key) {
        return this.first(key) !== '';
      }
    }, {
      key: "messages",
      value: function messages() {
        return _classPrivateFieldGet(this, _data$1);
      }
    }, {
      key: "all",
      value: function all() {
        var result = [];
        this.values().forEach(function (messages) {
          return result.push.apply(result, _toConsumableArray(messages));
        });
        return result;
      }
    }, {
      key: "count",
      value: function count() {
        var count = 0;
        this.values().forEach(function (messages) {
          return count += messages.length;
        });
        return count;
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        return this.keys().length === 0;
      }
    }, {
      key: "isNotEmpty",
      value: function isNotEmpty() {
        return !this.isEmpty();
      }
    }]);
    return ErrorBag;
  }();

  var Lang = /*#__PURE__*/function () {
    function Lang() {
      _classCallCheck(this, Lang);
    }
    _createClass(Lang, null, [{
      key: "locale",
      value: function locale(_locale2) {
        _classStaticPrivateFieldSpecSet(this, Lang, _locale, _locale2);
      }
    }, {
      key: "setMessages",
      value: function setMessages(locale, messages) {
        _classStaticPrivateFieldSpecGet(this, Lang, _messages)[locale] = flattenObject(messages);
      }
    }, {
      key: "get",
      value: function get(path) {
        if (_classStaticPrivateFieldSpecGet(this, Lang, _messages)[_classStaticPrivateFieldSpecGet(this, Lang, _locale)] && _classStaticPrivateFieldSpecGet(this, Lang, _messages)[_classStaticPrivateFieldSpecGet(this, Lang, _locale)][path]) {
          return _classStaticPrivateFieldSpecGet(this, Lang, _messages)[_classStaticPrivateFieldSpecGet(this, Lang, _locale)][path];
        }
        return;
      }
    }, {
      key: "has",
      value: function has(path) {
        return typeof this.get(path) === 'undefined' ? false : true;
      }
    }, {
      key: "set",
      value: function set(path, value) {
        if (isPlainObject(value)) {
          Object.assign(_classStaticPrivateFieldSpecGet(this, Lang, _messages)[_classStaticPrivateFieldSpecGet(this, Lang, _locale)], flattenObject(value, path));
        } else if (typeof value === 'string') {
          _classStaticPrivateFieldSpecGet(this, Lang, _messages)[_classStaticPrivateFieldSpecGet(this, Lang, _locale)][path] = value;
        }
      }
    }]);
    return Lang;
  }();
  var _locale = {
    writable: true,
    value: void 0
  };
  var _messages = {
    writable: true,
    value: {}
  };

  var Replacers = /*#__PURE__*/function () {
    function Replacers(validator) {
      _classCallCheck(this, Replacers);
      _defineProperty(this, "validator", void 0);
      this.validator = validator;
    }
    _createClass(Replacers, [{
      key: "replace",
      value: function replace(message, data) {
        Object.entries(data).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];
          return message = message.replaceAll(':' + key, value);
        });
        return message;
      }

      // Numeric
    }, {
      key: "replaceDecimal",
      value: function replaceDecimal(message, attribute, rule, parameters) {
        return this.replace(message, {
          decimal: parameters.join('-')
        });
      }
    }, {
      key: "replaceMultipleOf",
      value: function replaceMultipleOf(message, attribute, rule, parameters) {
        return this.replace(message, {
          value: parameters[0]
        });
      }

      // Agreement
    }, {
      key: "replaceAcceptedIf",
      value: function replaceAcceptedIf(message, attribute, rule, parameters) {
        return this.replace(message, {
          other: this.validator.getDisplayableAttribute(parameters[0]),
          value: this.validator.getDisplayableValue(parameters[0], this.validator.getValue(parameters[0]))
        });
      }
    }, {
      key: "replaceDeclinedIf",
      value: function replaceDeclinedIf(message, attribute, rule, parameters) {
        return this.replaceAcceptedIf(message, attribute, rule, parameters);
      }

      // Existence
    }, {
      key: "replaceRequiredArrayKeys",
      value: function replaceRequiredArrayKeys(message, attribute, rule, parameters) {
        var _this = this;
        return this.replace(message, {
          values: parameters.map(function (value) {
            return _this.validator.getDisplayableValue(attribute, value);
          }).join(', ')
        });
      }
    }, {
      key: "replaceRequiredIf",
      value: function replaceRequiredIf(message, attribute, rule, parameters) {
        return this.replaceAcceptedIf(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceRequiredIfAccepted",
      value: function replaceRequiredIfAccepted(message, attribute, rule, parameters) {
        return this.replaceAcceptedIf(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceRequiredUnless",
      value: function replaceRequiredUnless(message, attribute, rule, parameters) {
        var _this2 = this;
        return this.replace(message, {
          other: this.validator.getDisplayableAttribute(parameters[0]),
          values: parameters.slice(1).map(function (value) {
            return _this2.validator.getDisplayableValue(parameters[0], value);
          }).join(', ')
        });
      }
    }, {
      key: "replaceRequiredWith",
      value: function replaceRequiredWith(message, attribute, rule, parameters) {
        var _this3 = this;
        return this.replace(message, {
          values: parameters.map(function (value) {
            return _this3.validator.getDisplayableAttribute(value);
          }).join(' / ')
        });
      }
    }, {
      key: "replaceRequiredWithAll",
      value: function replaceRequiredWithAll(message, attribute, rule, parameters) {
        return this.replaceRequiredWith(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceRequiredWithout",
      value: function replaceRequiredWithout(message, attribute, rule, parameters) {
        return this.replaceRequiredWith(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceRequiredWithoutAll",
      value: function replaceRequiredWithoutAll(message, attribute, rule, parameters) {
        return this.replaceRequiredWith(message, attribute, rule, parameters);
      }

      // Missing
    }, {
      key: "replaceMissingIf",
      value: function replaceMissingIf(message, attribute, rule, parameters) {
        return this.replaceAcceptedIf(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceMissingUnless",
      value: function replaceMissingUnless(message, attribute, rule, parameters) {
        return this.replace(this.replaceRequiredUnless(message, attribute, rule, parameters), {
          value: this.validator.getDisplayableValue(parameters[0], parameters[1])
        });
      }
    }, {
      key: "replaceMissingWith",
      value: function replaceMissingWith(message, attribute, rule, parameters) {
        return this.replaceRequiredWith(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceMissingWithAll",
      value: function replaceMissingWithAll(message, attribute, rule, parameters) {
        return this.replaceRequiredWith(message, attribute, rule, parameters);
      }

      // Prohibition
    }, {
      key: "replaceProhibitedIf",
      value: function replaceProhibitedIf(message, attribute, rule, parameters) {
        return this.replaceAcceptedIf(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceProhibitedUnless",
      value: function replaceProhibitedUnless(message, attribute, rule, parameters) {
        return this.replaceRequiredUnless(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceProhibits",
      value: function replaceProhibits(message, attribute, rule, parameters) {
        var _this4 = this;
        return this.replace(message, {
          other: parameters.map(function (value) {
            return _this4.validator.getDisplayableAttribute(value);
          }).join(' / ')
        });
      }

      // Size
    }, {
      key: "replaceSize",
      value: function replaceSize(message, attribute, rule, parameters) {
        return this.replace(message, {
          size: parameters[0]
        });
      }
    }, {
      key: "replaceMin",
      value: function replaceMin(message, attribute, rule, parameters) {
        return this.replace(message, {
          min: parameters[0]
        });
      }
    }, {
      key: "replaceMax",
      value: function replaceMax(message, attribute, rule, parameters) {
        return this.replace(message, {
          max: parameters[0]
        });
      }
    }, {
      key: "replaceBetween",
      value: function replaceBetween(message, attribute, rule, parameters) {
        return this.replace(message, {
          min: parameters[0],
          max: parameters[1]
        });
      }

      // Digits
    }, {
      key: "replaceDigits",
      value: function replaceDigits(message, attribute, rule, parameters) {
        return this.replace(message, {
          digits: parameters[0]
        });
      }
    }, {
      key: "replaceMinDigits",
      value: function replaceMinDigits(message, attribute, rule, parameters) {
        return this.replaceMin(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceMaxDigits",
      value: function replaceMaxDigits(message, attribute, rule, parameters) {
        return this.replaceMax(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceDigitsBetween",
      value: function replaceDigitsBetween(message, attribute, rule, parameters) {
        return this.replaceBetween(message, attribute, rule, parameters);
      }

      // String
    }, {
      key: "replaceStartsWith",
      value: function replaceStartsWith(message, attribute, rule, parameters) {
        return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceDoesntStartWith",
      value: function replaceDoesntStartWith(message, attribute, rule, parameters) {
        return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceEndsWith",
      value: function replaceEndsWith(message, attribute, rule, parameters) {
        return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceDoesntEndWith",
      value: function replaceDoesntEndWith(message, attribute, rule, parameters) {
        return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
      }

      // Compare values
    }, {
      key: "replaceSame",
      value: function replaceSame(message, attribute, rule, parameters) {
        return this.replaceAcceptedIf(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceDifferent",
      value: function replaceDifferent(message, attribute, rule, parameters) {
        return this.replaceAcceptedIf(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceGt",
      value: function replaceGt(message, attribute, rule, parameters) {
        var value = this.validator.getValue(parameters[0]);
        return this.replace(message, {
          value: value ? this.validator.getSize(parameters[0], value) : this.validator.getDisplayableAttribute(parameters[0])
        });
      }
    }, {
      key: "replaceGte",
      value: function replaceGte(message, attribute, rule, parameters) {
        return this.replaceGt(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceLt",
      value: function replaceLt(message, attribute, rule, parameters) {
        return this.replaceGt(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceLte",
      value: function replaceLte(message, attribute, rule, parameters) {
        return this.replaceGt(message, attribute, rule, parameters);
      }

      // Dates
    }, {
      key: "replaceAfter",
      value: function replaceAfter(message, attribute, rule, parameters) {
        var other = parameters[0];
        return this.replace(message, {
          date: this.validator.hasAttribute(other) ? this.validator.getDisplayableAttribute(other) : other
        });
      }
    }, {
      key: "replaceAfterOrEqual",
      value: function replaceAfterOrEqual(message, attribute, rule, parameters) {
        return this.replaceAfter(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceBefore",
      value: function replaceBefore(message, attribute, rule, parameters) {
        return this.replaceAfter(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceBeforeOrEqual",
      value: function replaceBeforeOrEqual(message, attribute, rule, parameters) {
        return this.replaceAfter(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceDateEquals",
      value: function replaceDateEquals(message, attribute, rule, parameters) {
        return this.replaceAfter(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceDateFormat",
      value: function replaceDateFormat(message, attribute, rule, parameters) {
        return this.replace(message, {
          format: parameters[0]
        });
      }

      // Array
    }, {
      key: "replaceInArray",
      value: function replaceInArray(message, attribute, rule, parameters) {
        return this.replaceAcceptedIf(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceIn",
      value: function replaceIn(message, attribute, rule, parameters) {
        return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
      }
    }, {
      key: "replaceNotIn",
      value: function replaceNotIn(message, attribute, rule, parameters) {
        return this.replaceRequiredArrayKeys(message, attribute, rule, parameters);
      }

      // File
    }, {
      key: "replaceMimetypes",
      value: function replaceMimetypes(message, attribute, rule, parameters) {
        return this.replace(message, {
          values: parameters.join(', ')
        });
      }
    }, {
      key: "replaceMimes",
      value: function replaceMimes(message, attribute, rule, parameters) {
        return this.replaceMimetypes(message, attribute, rule, parameters);
      }
    }]);
    return Replacers;
  }();

  var _data = /*#__PURE__*/new WeakMap();
  var _rules = /*#__PURE__*/new WeakMap();
  var _customMessages = /*#__PURE__*/new WeakMap();
  var _customAttributes = /*#__PURE__*/new WeakMap();
  var _customValues = /*#__PURE__*/new WeakMap();
  var _checkers = /*#__PURE__*/new WeakMap();
  var _replacers = /*#__PURE__*/new WeakMap();
  var _errors = /*#__PURE__*/new WeakMap();
  var _implicitAttributes = /*#__PURE__*/new WeakMap();
  var _stopOnFirstFailure = /*#__PURE__*/new WeakMap();
  var _alwaysBail = /*#__PURE__*/new WeakMap();
  var Validator = /*#__PURE__*/function () {
    function Validator() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var rules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var messages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var attributes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var values = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      _classCallCheck(this, Validator);
      _classPrivateFieldInitSpec(this, _data, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldInitSpec(this, _rules, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldInitSpec(this, _customMessages, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldInitSpec(this, _customAttributes, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldInitSpec(this, _customValues, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldInitSpec(this, _checkers, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldInitSpec(this, _replacers, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldInitSpec(this, _errors, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldInitSpec(this, _implicitAttributes, {
        writable: true,
        value: {}
      });
      _classPrivateFieldInitSpec(this, _stopOnFirstFailure, {
        writable: true,
        value: false
      });
      _classPrivateFieldInitSpec(this, _alwaysBail, {
        writable: true,
        value: false
      });
      _defineProperty(this, "fileRules", ['file', 'image', 'mimetypes', 'mimes']);
      _defineProperty(this, "numericRules", ['decimal', 'numeric', 'integer']);
      _defineProperty(this, "sizeRules", ['size', 'between', 'min', 'max', 'gt', 'lt', 'gte', 'lte']);
      this.setProperties(data, rules, messages, attributes, values);
      _classPrivateFieldSet(this, _checkers, new Checkers(this));
      _classPrivateFieldSet(this, _replacers, new Replacers(this));
      for (var _i = 0, _Object$entries = Object.entries(_classStaticPrivateFieldSpecGet(Validator, Validator, _customCheckers)); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          rule = _Object$entries$_i[0],
          checker = _Object$entries$_i[1];
        _classPrivateFieldGet(this, _checkers)[toCamelCase('check_' + rule)] = checker;
      }
      for (var _i2 = 0, _Object$entries2 = Object.entries(_classStaticPrivateFieldSpecGet(Validator, Validator, _customReplacers)); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          _rule = _Object$entries2$_i[0],
          replacer = _Object$entries2$_i[1];
        _classPrivateFieldGet(this, _replacers)[toCamelCase('replace_' + _rule)] = replacer;
      }
      _classPrivateFieldSet(this, _errors, new ErrorBag());
    }
    _createClass(Validator, [{
      key: "setProperties",
      value: function setProperties() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var rules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var messages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var attributes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        var values = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
        _classPrivateFieldSet(this, _data, data);
        _classPrivateFieldSet(this, _rules, this.parseRules(rules));
        _classPrivateFieldSet(this, _customMessages, messages);
        _classPrivateFieldSet(this, _customAttributes, attributes);
        _classPrivateFieldSet(this, _customValues, flattenObject(values));
        return this;
      }
    }, {
      key: "setData",
      value: function setData(data) {
        _classPrivateFieldSet(this, _data, data);
        return this;
      }
    }, {
      key: "setRules",
      value: function setRules(rules) {
        _classPrivateFieldSet(this, _rules, this.parseRules(rules));
        return this;
      }
    }, {
      key: "setCustomMessages",
      value: function setCustomMessages(messages) {
        _classPrivateFieldSet(this, _customMessages, messages);
        return this;
      }
    }, {
      key: "setCustomAttributes",
      value: function setCustomAttributes(attributes) {
        _classPrivateFieldSet(this, _customAttributes, attributes);
        return this;
      }
    }, {
      key: "setCustomValues",
      value: function setCustomValues(values) {
        _classPrivateFieldSet(this, _customValues, flattenObject(values));
        return this;
      }
    }, {
      key: "addImplicitAttribute",
      value: function addImplicitAttribute(implicitAttribute, attribute) {
        _classPrivateFieldGet(this, _implicitAttributes)[implicitAttribute] = attribute;
        return this;
      }
    }, {
      key: "stopOnFirstFailure",
      value: function stopOnFirstFailure() {
        var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        _classPrivateFieldSet(this, _stopOnFirstFailure, flag);
        return this;
      }
    }, {
      key: "alwaysBail",
      value: function alwaysBail() {
        var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        _classPrivateFieldSet(this, _alwaysBail, flag);
        return this;
      }
    }, {
      key: "parseRules",
      value: function parseRules(rules) {
        var parsedRules = {};
        var parseAttributeRules = function parseAttributeRules(rules) {
          if (Array.isArray(rules)) {
            return rules;
          } else {
            return String(rules).split('|');
          }
        };
        for (var _i3 = 0, _Object$entries3 = Object.entries(rules); _i3 < _Object$entries3.length; _i3++) {
          var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
            attribute = _Object$entries3$_i[0],
            attributeRules = _Object$entries3$_i[1];
          var attributes = attribute.includes('*') ? this.parseWildcardAttribute(attribute) : [attribute];
          var _iterator = _createForOfIteratorHelper(attributes),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var _attribute = _step.value;
              var parsedAttributeRules = {};
              var _iterator2 = _createForOfIteratorHelper(parseAttributeRules(attributeRules)),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var attributeRule = _step2.value;
                  var parts = attributeRule.split(':');
                  var rule = parts[0];
                  var parameters = parts.slice(1).join(':').split(',').filter(function (part) {
                    return part !== '';
                  });
                  parsedAttributeRules[rule] = parameters;
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              parsedRules[_attribute] = parsedAttributeRules;
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
        return parsedRules;
      }
    }, {
      key: "parseWildcardAttribute",
      value: function parseWildcardAttribute(attribute) {
        var _this = this;
        var attributes = [];
        var index = attribute.indexOf('*');
        var parentPath = attribute.substring(0, index - 1);
        var childPath = attribute.substring(index + 2);
        var data = this.getValue(parentPath);
        if (!(Array.isArray(data) || isPlainObject(data))) {
          return [attribute];
        }
        Object.entries(data).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0];
            _ref2[1];
          var implicitAttribute = "".concat(parentPath, ".").concat(key, ".").concat(childPath).replace(/\.$/, '');
          var implicitAttributes = implicitAttribute.includes('*') ? _this.parseWildcardAttribute(implicitAttribute) : [implicitAttribute];
          attributes.push.apply(attributes, _toConsumableArray(implicitAttributes));
          implicitAttributes.forEach(function (value) {
            return _classPrivateFieldGet(_this, _implicitAttributes)[value] = attribute;
          });
        });
        return attributes;
      }
    }, {
      key: "validate",
      value: function () {
        var _validate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          var _i4, _Object$entries4, _Object$entries4$_i, attribute, rules, value, doBail, isNullable, hasError, _i5, _Object$entries5, _Object$entries5$_i, rule, parameters, result, status, message, camelRule, _result;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _classPrivateFieldGet(this, _checkers).clearCaches();
                _classPrivateFieldSet(this, _errors, new ErrorBag());
                _i4 = 0, _Object$entries4 = Object.entries(_classPrivateFieldGet(this, _rules));
              case 3:
                if (!(_i4 < _Object$entries4.length)) {
                  _context.next = 47;
                  break;
                }
                _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2), attribute = _Object$entries4$_i[0], rules = _Object$entries4$_i[1];
                value = this.getValue(attribute);
                if (!(rules.hasOwnProperty('sometimes') && typeof value === 'undefined')) {
                  _context.next = 8;
                  break;
                }
                return _context.abrupt("continue", 44);
              case 8:
                doBail = _classPrivateFieldGet(this, _alwaysBail) || rules.hasOwnProperty('bail');
                isNullable = rules.hasOwnProperty('nullable');
                hasError = false;
                _i5 = 0, _Object$entries5 = Object.entries(rules);
              case 12:
                if (!(_i5 < _Object$entries5.length)) {
                  _context.next = 42;
                  break;
                }
                _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2), rule = _Object$entries5$_i[0], parameters = _Object$entries5$_i[1];
                if (!(rule === '')) {
                  _context.next = 16;
                  break;
                }
                return _context.abrupt("continue", 39);
              case 16:
                if (!(!_classStaticPrivateFieldSpecGet(Validator, Validator, _implicitRules).includes(rule) && (typeof value === 'undefined' || typeof value === 'string' && value.trim() === '' || isNullable && value === null))) {
                  _context.next = 18;
                  break;
                }
                return _context.abrupt("continue", 39);
              case 18:
                result = void 0, status = void 0, message = void 0;
                camelRule = toCamelCase('check_' + rule);
                if (!(typeof _classPrivateFieldGet(this, _checkers)[camelRule] === 'function')) {
                  _context.next = 26;
                  break;
                }
                _context.next = 23;
                return _classPrivateFieldGet(this, _checkers)[camelRule](attribute, value, parameters);
              case 23:
                result = _context.sent;
                _context.next = 31;
                break;
              case 26:
                if (!_classStaticPrivateFieldSpecGet(Validator, Validator, _dummyRules).includes(rule)) {
                  _context.next = 30;
                  break;
                }
                result = true;
                _context.next = 31;
                break;
              case 30:
                throw new Error("Invalid validation rule: ".concat(rule));
              case 31:
                if (typeof result === 'boolean') {
                  status = result;
                } else {
                  _result = result;
                  status = _result.status;
                  message = _result.message;
                }
                if (status) {
                  _context.next = 39;
                  break;
                }
                hasError = true;
                message = isEmpty(message) ? this.getMessage(attribute, rule) : message;
                message = this.makeReplacements(message, attribute, rule, parameters);
                _classPrivateFieldGet(this, _errors).add(attribute, message);
                if (!(doBail || _classStaticPrivateFieldSpecGet(Validator, Validator, _implicitRules).includes(rule))) {
                  _context.next = 39;
                  break;
                }
                return _context.abrupt("break", 42);
              case 39:
                _i5++;
                _context.next = 12;
                break;
              case 42:
                if (!(_classPrivateFieldGet(this, _stopOnFirstFailure) && hasError)) {
                  _context.next = 44;
                  break;
                }
                return _context.abrupt("break", 47);
              case 44:
                _i4++;
                _context.next = 3;
                break;
              case 47:
                if (!_classPrivateFieldGet(this, _errors).isNotEmpty()) {
                  _context.next = 49;
                  break;
                }
                throw _classPrivateFieldGet(this, _errors);
              case 49:
              case "end":
                return _context.stop();
            }
          }, _callee, this);
        }));
        function validate() {
          return _validate.apply(this, arguments);
        }
        return validate;
      }()
    }, {
      key: "passes",
      value: function () {
        var _passes = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.validate();
              case 3:
                _context2.next = 10;
                break;
              case 5:
                _context2.prev = 5;
                _context2.t0 = _context2["catch"](0);
                if (!(_context2.t0 instanceof Error)) {
                  _context2.next = 9;
                  break;
                }
                throw _context2.t0;
              case 9:
                return _context2.abrupt("return", false);
              case 10:
                return _context2.abrupt("return", true);
              case 11:
              case "end":
                return _context2.stop();
            }
          }, _callee2, this, [[0, 5]]);
        }));
        function passes() {
          return _passes.apply(this, arguments);
        }
        return passes;
      }()
    }, {
      key: "fails",
      value: function () {
        var _fails = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.passes();
              case 2:
                return _context3.abrupt("return", !_context3.sent);
              case 3:
              case "end":
                return _context3.stop();
            }
          }, _callee3, this);
        }));
        function fails() {
          return _fails.apply(this, arguments);
        }
        return fails;
      }()
    }, {
      key: "getMessage",
      value: function getMessage(attribute, rule) {
        var _message;
        var value = this.getValue(attribute);
        attribute = this.getPrimaryAttribute(attribute);
        var message;
        for (var _i6 = 0, _arr = ["".concat(attribute, ".").concat(rule), rule]; _i6 < _arr.length; _i6++) {
          var key = _arr[_i6];
          if (_classPrivateFieldGet(this, _customMessages).hasOwnProperty(key)) {
            message = _classPrivateFieldGet(this, _customMessages)[key];
            break;
          }
        }
        if (!message) {
          var _key = rule;
          if (this.sizeRules.includes(_key)) {
            if (Array.isArray(value) || isPlainObject(value) || this.hasRule(attribute, 'array')) {
              _key += '.array';
            } else if (value instanceof File || this.hasRule(attribute, this.fileRules)) {
              _key += '.file';
            } else if (typeof value === 'number' || this.hasRule(attribute, this.numericRules)) {
              _key += '.numeric';
            } else {
              _key += '.string';
            }
          }
          message = Lang.get(_key);
        }
        return (_message = message) !== null && _message !== void 0 ? _message : "validation.".concat(rule);
      }
    }, {
      key: "makeReplacements",
      value: function makeReplacements(message, attribute, rule, parameters) {
        var attributeName = this.getDisplayableAttribute(attribute);
        var value = this.getValue(attribute);
        var data = {
          attribute: attributeName,
          ATTRIBUTE: attributeName.toLocaleUpperCase(),
          Attribute: attributeName.charAt(0).toLocaleUpperCase() + attributeName.substring(1),
          input: this.getDisplayableValue(attribute, value)
        };
        for (var _i7 = 0, _Object$entries6 = Object.entries(data); _i7 < _Object$entries6.length; _i7++) {
          var _Object$entries6$_i = _slicedToArray(_Object$entries6[_i7], 2),
            key = _Object$entries6$_i[0],
            _value = _Object$entries6$_i[1];
          message = message.replaceAll(':' + key, _value);
        }
        var match = attribute.match(/\.(\d+)\.?/);
        var index = match === null ? -1 : parseInt(match[1], 10);
        if (index !== -1) {
          message = message.replaceAll(':index', index).replaceAll(':position', index + 1);
        }
        var camelRule = toCamelCase('replace_' + rule);
        if (typeof _classPrivateFieldGet(this, _replacers)[camelRule] === 'function') {
          message = _classPrivateFieldGet(this, _replacers)[camelRule](message, attribute, rule, parameters);
        }
        return message;
      }
    }, {
      key: "getDisplayableAttribute",
      value: function getDisplayableAttribute(attribute) {
        var unparsed = this.getPrimaryAttribute(attribute);
        for (var _i8 = 0, _arr2 = [attribute, unparsed]; _i8 < _arr2.length; _i8++) {
          var name = _arr2[_i8];
          if (_classPrivateFieldGet(this, _customAttributes).hasOwnProperty(name)) {
            return _classPrivateFieldGet(this, _customAttributes)[name];
          } else if (Lang.has("attributes.".concat(name))) {
            return Lang.get("attributes.".concat(name));
          }
        }
        if (_classPrivateFieldGet(this, _implicitAttributes).hasOwnProperty(attribute)) {
          return attribute;
        }
        return toSnakeCase(attribute).replaceAll('_', ' ');
      }
    }, {
      key: "getDisplayableValue",
      value: function getDisplayableValue(attribute, value) {
        attribute = this.getPrimaryAttribute(attribute);
        var path = "".concat(attribute, ".").concat(value);
        if (isEmpty(value)) {
          return 'empty';
        } else if (typeof value === 'boolean' || this.hasRule(attribute, 'boolean')) {
          return Number(value) ? 'true' : 'false';
        } else if (_classPrivateFieldGet(this, _customValues).hasOwnProperty(path)) {
          return _classPrivateFieldGet(this, _customValues)[path];
        } else if (Lang.has("values.".concat(path))) {
          return Lang.get("values.".concat(path));
        }
        return value;
      }
    }, {
      key: "getSize",
      value: function getSize(attribute, value) {
        if (isEmpty(value)) {
          return 0;
        } else if (isNumeric(value) && this.hasRule(attribute, this.numericRules)) {
          return parseFloat(typeof value === 'string' ? value.trim() : value, 10);
        } else if (value instanceof File) {
          return value.size / 1024;
        } else if (isPlainObject(value)) {
          return Object.keys(value).length;
        } else if (value.hasOwnProperty('length')) {
          return value.length;
        }
        return value;
      }
    }, {
      key: "getRule",
      value: function getRule(attribute) {
        var _classPrivateFieldGet2;
        attribute = this.getPrimaryAttribute(attribute);
        return (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _rules)[attribute]) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : {};
      }
    }, {
      key: "hasRule",
      value: function hasRule(attribute, rules) {
        attribute = this.getPrimaryAttribute(attribute);
        rules = typeof rules === 'string' ? [rules] : rules;
        if (!_classPrivateFieldGet(this, _rules).hasOwnProperty(attribute)) {
          return false;
        }
        var _iterator3 = _createForOfIteratorHelper(rules),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var rule = _step3.value;
            if (_classPrivateFieldGet(this, _rules)[attribute].hasOwnProperty(rule)) {
              return true;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        return false;
      }
    }, {
      key: "getPrimaryAttribute",
      value: function getPrimaryAttribute(attribute) {
        return _classPrivateFieldGet(this, _implicitAttributes).hasOwnProperty(attribute) ? _classPrivateFieldGet(this, _implicitAttributes)[attribute] : attribute;
      }
    }, {
      key: "hasAttribute",
      value: function hasAttribute(attribute) {
        return typeof this.getValue(attribute) !== 'undefined';
      }
    }, {
      key: "getValue",
      value: function getValue(attribute) {
        return getByPath(_classPrivateFieldGet(this, _data), attribute);
      }
    }, {
      key: "errors",
      value: function errors() {
        return _classPrivateFieldGet(this, _errors);
      }
    }], [{
      key: "setLocale",
      value: function setLocale(locale) {
        Lang.locale(locale);
      }
    }, {
      key: "setMessages",
      value: function setMessages(locale, messages) {
        Lang.setMessages(locale, messages);
      }
    }, {
      key: "addChecker",
      value: function addChecker(rule, method, message) {
        _classStaticPrivateFieldSpecGet(Validator, Validator, _customCheckers)[rule] = method;
        if (message) {
          Lang.set(rule, message);
        }
      }
    }, {
      key: "addImplicitChecker",
      value: function addImplicitChecker(rule, method, message) {
        Validator.addChecker(rule, method, message);
        _classStaticPrivateFieldSpecGet(Validator, Validator, _implicitRules).push(rule);
      }
    }, {
      key: "addReplacer",
      value: function addReplacer(rule, method) {
        _classStaticPrivateFieldSpecGet(Validator, Validator, _customReplacers)[rule] = method;
      }
    }, {
      key: "addDummyRule",
      value: function addDummyRule(rule) {
        _classStaticPrivateFieldSpecGet(Validator, Validator, _dummyRules).push(rule);
      }
    }]);
    return Validator;
  }();
  var _customCheckers = {
    writable: true,
    value: {}
  };
  var _customReplacers = {
    writable: true,
    value: {}
  };
  var _dummyRules = {
    writable: true,
    value: ['active_url', 'bail', 'current_password', 'enum', 'exclude', 'exclude_if', 'exclude_unless', 'exclude_with', 'exclude_without', 'exists', 'nullable', 'sometimes', 'unique']
  };
  var _implicitRules = {
    writable: true,
    value: ['accepted', 'accepted_if', 'declined', 'declined_if', 'filled', 'missing', 'missing_if', 'missing_unless', 'missing_with', 'missing_with_all', 'present', 'required', 'required_if', 'required_if_accepted', 'required_unless', 'required_with', 'required_with_all', 'required_without', 'required_without_all']
  };

  exports.Checkers = Checkers;
  exports.ErrorBag = ErrorBag;
  exports.Lang = Lang;
  exports.Replacers = Replacers;
  exports.Validator = Validator;

  return exports;

})({});
