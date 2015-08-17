Kotlin.defineModule('browser-ext-platform', null, function () {
  'use strict';
  var _ = {
  };
  /** @name _.org_jetbrains_browserConnection */ 
  Kotlin.p(_, 'org_jetbrains_browserConnection', null, /** @lends _.org_jetbrains_browserConnection */ {
    TabService: {value: (function () {
      function $f0(callback, it) {
        callback(it, true);
      }
      return Kotlin.createTrait(null, /** @lends _.org_jetbrains_browserConnection.TabService.prototype */ {
        $dv$errorCallback_query: {value: function () {
          return null;
        }},
        $dv$bypassCache_reload: {value: function () {
          return true;
        }},
        $dv$errorCallback_load: {value: function () {
          return null;
        }},
        load: {value: function (url, uriToOpen, existingTab, newTab, focusWindow, errorCallback, callback) {
          if (errorCallback === undefined)
            errorCallback = this.$dv$errorCallback_load();
          var normalizedUriToOpen = uriToOpen !== null && uriToOpen !== undefined ? uriToOpen : url;
          if (existingTab === null || existingTab === undefined) {
            if (newTab === null || newTab === undefined) {
              var tmp$0;
              if (callback === null || callback === undefined)
                tmp$0 = null;
              else {
                tmp$0 = $f0.bind(null, callback);
              }
              this.createTab(normalizedUriToOpen, focusWindow, tmp$0);
            }
             else {
              this.updateTab(newTab, normalizedUriToOpen, focusWindow, errorCallback, callback);
            }
          }
           else {
            this.updateTab(existingTab, uriToOpen, focusWindow, errorCallback, callback);
          }
        }, writable: true},
        $dv$errorCallback_updateTab: {value: function () {
          return null;
        }}
      });
    })()}
  });
  /** @name _.org_jetbrains_util */ 
  Kotlin.p(_, 'org_jetbrains_util', function () {
    Object.defineProperty(this, 'executeActionWithRecursiveGuard', {value: function (o, recursiveGuard, action) {
      if (Kotlin.arrayIndexOf(recursiveGuard, o) !== -1) {
        return;
      }
      recursiveGuard.push(o);
      try {
        action(o);
      }
      finally {
        Kotlin.arrayRemove(recursiveGuard, o);
      }
    }});
    Object.defineProperty(this, 'newDisposable', {value: function () {
      return Kotlin.createObject(_.org_jetbrains_util.Disposable, null, {
        dispose: {value: function () {
        }, writable: true, enumerable: true}
      });
    }});
    function $f0(dispose) {
      return Kotlin.createObject(_.org_jetbrains_util.Disposable, null, {
        dispose: {value: function () {
          dispose();
        }, writable: true, enumerable: true}
      });
    }
    Object.defineProperty(this, 'disposer', {value: Kotlin.createObject(null, function () {
      Object.defineProperty(this, 'tree', {value: _.org_jetbrains_util.ObjectTree()});
      Object.defineProperty(this, 'disposeAction', {value: function (o) {
        o.dispose();
      }});
    }, {
      register: {value: function (parent, dispose) {
        this.tree.register(parent, $f0(dispose));
      }},
      register$0: {value: function (parent, child) {
        if (Kotlin.equals(parent, child)) {
          throw Kotlin.newException("Cannot register to itself", 'IllegalStateException');
        }
        this.tree.register(parent, child);
      }},
      dispose: {value: function (disposable, processUnregistered) {
        if (processUnregistered === undefined)
          processUnregistered = true;
        this.tree.executeAll(disposable, true, this.disposeAction, processUnregistered);
      }}
    })});
    Object.defineProperty(this, 'LOG', {value: _.org_jetbrains_logging.getLogger("org.jetbrains.disposable")});
  }, /** @lends _.org_jetbrains_util */ {
    Disposable: {value: (function () {
      return Kotlin.createTrait(null, /** @lends _.org_jetbrains_util.Disposable.prototype */ {
        register: {value: function (dispose) {
          _.org_jetbrains_util.disposer.register(this, dispose);
        }, writable: true},
        register$0: {value: function (child) {
          _.org_jetbrains_util.disposer.register$0(this, child);
        }, writable: true},
        disposeTree: {value: function () {
          _.org_jetbrains_util.disposer.dispose(this, undefined);
        }, writable: true}
      });
    })()},
    ObjectNode: {value: (function () {
      function $f0(disposeTree, action, it) {
        try {
        }
        catch (e) {
          _.org_jetbrains_util.LOG.error$0(e);
        }
        var list = this.children;
        if (list !== null && list !== undefined) {
          var n = list.length;
          while (n-- > 0) {
            Kotlin.arrayGet(list, n).execute(disposeTree, action);
          }
        }
        if (disposeTree) {
          this.children = null;
        }
        try {
          action(this.o);
        }
        catch (e_0) {
          _.org_jetbrains_util.LOG.error$0(e_0);
        }
        if (disposeTree) {
          this.remove();
        }
      }
      return Kotlin.createClass(null, function (tree, parent, o) {
        Object.defineProperty(this, 'tree', {value: tree});
        Object.defineProperty(this, 'o', {value: o});
        Object.defineProperty(this, '$parent', {value: parent, writable: true});
        Object.defineProperty(this, 'children', {value: null, writable: true});
      }, /** @lends _.org_jetbrains_util.ObjectNode.prototype */ {
        parent: {
          get: function () {
            return this.$parent;
          },
          set: function (value) {
            this.$parent = value;
          }
        },
        removeChild: {value: function (child) {
          var tmp$0;
          var index = Kotlin.arrayLastIndexOf((tmp$0 = this.children) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE(), child);
          if (index !== -1) {
            var tmp$1;
            Kotlin.arrayRemoveAt((tmp$1 = this.children) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE(), index);
          }
        }},
        addChild: {value: function (child) {
          if (this.children === null || this.children === undefined) {
            this.children = [];
          }
          var tmp$0;
          ((tmp$0 = this.children) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).push(child);
          child.parent = this;
        }},
        execute: {value: function (disposeTree, action) {
          _.org_jetbrains_util.executeActionWithRecursiveGuard(this, this.tree.executedNodes, $f0.bind(this, disposeTree, action));
        }},
        remove: {value: function () {
          this.tree.objectToNodeMap.remove(this.o);
          if (this.parent === null || this.parent === undefined) {
            Kotlin.collectionRemove(this.tree.rootObjects, this.o);
          }
           else {
            var tmp$0;
            ((tmp$0 = this.parent) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).removeChild(this);
          }
        }}
      });
    })()},
    ObjectTree: {value: (function () {
      return Kotlin.createClass(null, function () {
        Object.defineProperty(this, 'objectToNodeMap', {value: Kotlin.ComplexHashMap()});
        Object.defineProperty(this, 'rootObjects', {value: Kotlin.ComplexHashSet()});
        Object.defineProperty(this, 'executedUnregisteredNodes', {value: []});
        Object.defineProperty(this, 'executedNodes', {value: []});
      }, /** @lends _.org_jetbrains_util.ObjectTree.prototype */ {
        register: {value: function (parent, child) {
          var parentNode = this.getOrCreateNodeFor(parent, null);
          var childNode = this.objectToNodeMap.get(child);
          if (childNode === null || childNode === undefined) {
            childNode = this.createNodeFor(child, parentNode);
          }
           else {
            var oldParent = (childNode !== null && childNode !== undefined ? childNode : Kotlin.throwNPE()).parent;
            if (oldParent !== null && oldParent !== undefined) {
              oldParent.removeChild(childNode !== null && childNode !== undefined ? childNode : Kotlin.throwNPE());
            }
          }
          Kotlin.collectionRemove(this.rootObjects, child);
          this.checkWasNotAddedAlready(childNode !== null && childNode !== undefined ? childNode : Kotlin.throwNPE(), child);
          parentNode.addChild(childNode !== null && childNode !== undefined ? childNode : Kotlin.throwNPE());
        }},
        getOrCreateNodeFor: {value: function (o, defaultParent) {
          var node = this.objectToNodeMap.get(o);
          if (node !== null && node !== undefined) {
            return node;
          }
          return this.createNodeFor(o, defaultParent);
        }},
        createNodeFor: {value: function (o, parentNode) {
          var node = _.org_jetbrains_util.ObjectNode(this, parentNode, o);
          if (parentNode === null || parentNode === undefined) {
            Kotlin.collectionAdd(this.rootObjects, o);
          }
          this.objectToNodeMap.put(o, node);
          return node;
        }},
        checkWasNotAddedAlready: {value: function (childNode, child) {
          var parent = childNode.parent;
          while (parent !== null && parent !== undefined) {
            if (Kotlin.equals((parent !== null && parent !== undefined ? parent : Kotlin.throwNPE()).o, child)) {
              _.org_jetbrains_util.LOG.error(" was already added as a child of: " + parent);
            }
            parent = (parent !== null && parent !== undefined ? parent : Kotlin.throwNPE()).parent;
          }
        }},
        executeUnregistered: {value: function (o, action) {
          _.org_jetbrains_util.executeActionWithRecursiveGuard(o, this.executedUnregisteredNodes, action);
        }},
        executeAll: {value: function (o, disposeTree, action, processUnregistered) {
          var node = this.objectToNodeMap.get(o);
          if (node === null || node === undefined) {
            if (processUnregistered) {
              this.executeUnregistered(o, action);
              return true;
            }
             else {
              return false;
            }
          }
          node.execute(disposeTree, action);
          return true;
        }}
      });
    })()}
  });
  /** @name _.com_jetbrains_browserConnection */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection', function () {
    Object.defineProperty(this, 'SelectorSubjects', {value: Kotlin.createObject(null, function () {
      Object.defineProperty(this, 'AS_IS', {value: _.com_jetbrains_browserConnection.SelectorSubject()});
      Object.defineProperty(this, 'PARENT', {value: _.com_jetbrains_browserConnection.SelectorSubject()});
      Object.defineProperty(this, 'HTML', {value: _.com_jetbrains_browserConnection.SelectorSubject()});
    }, {
      valueOf: {value: function (ordinal) {
        if (ordinal === 0)
          return _.com_jetbrains_browserConnection.SelectorSubjects.AS_IS;
        else if (ordinal === 1)
          return _.com_jetbrains_browserConnection.SelectorSubjects.PARENT;
        else if (ordinal === 2)
          return _.com_jetbrains_browserConnection.SelectorSubjects.HTML;
        else
          throw Kotlin.newException(null, 'Exception');
      }}
    })});
  }, /** @lends _.com_jetbrains_browserConnection */ {
    SelectorSubject: {value: (function () {
      return Kotlin.createClass(null, null);
    })()},
    Dom: {value: (function () {
      return Kotlin.createTrait(null);
    })()},
    DomService: {value: (function () {
      function $f0(selector, selectorSubjectOrdinal, name, value, isStyle, it) {
        it.setProperty(selector, _.com_jetbrains_browserConnection.SelectorSubjects.valueOf(selectorSubjectOrdinal), name, value, isStyle);
      }
      function $f1(selector, selectorSubjectOrdinal, value, it) {
        it.setOuterHtml(selector, _.com_jetbrains_browserConnection.SelectorSubjects.valueOf(selectorSubjectOrdinal), value);
      }
      function $f2(selector, it) {
        it.reloadPageIfContains(selector);
      }
      function $f3(tab, created) {
        if (!created) {
          this.pageManager.tabService.reload(tab, undefined);
        }
      }
      function $f4(selector, selectorSubject, it) {
        it.highlightElement(selector, selectorSubject);
      }
      function $f5(it) {
        it.hideHighlight();
      }
      return Kotlin.createClass(null, function (pageManager) {
        Object.defineProperty(this, 'pageManager', {value: pageManager});
      }, /** @lends _.com_jetbrains_browserConnection.DomService.prototype */ {
        execute: {value: function (projectId, handler) {
          if (typeof projectId === 'string') {
            this.pageManager.execute(projectId, handler);
          }
           else {
            this.pageManager.executeForTabById(projectId !== null && projectId !== undefined ? projectId : Kotlin.throwNPE(), true, handler);
          }
        }},
        setProperty: {value: function (projectId, selector, selectorSubjectOrdinal, name, value, isStyle) {
          this.execute(projectId, $f0.bind(null, selector, selectorSubjectOrdinal, name, value, isStyle));
        }},
        setOuterHtml: {value: function (projectId, selector, selectorSubjectOrdinal, value) {
          this.execute(projectId, $f1.bind(null, selector, selectorSubjectOrdinal, value));
        }},
        reloadPagesContainingElement: {value: function (projectId, selector) {
          this.execute(projectId, $f2.bind(null, selector));
        }},
        openUrl: {value: function (url) {
          this.pageManager.getOrCreateTab(url, undefined, undefined, undefined, $f3.bind(this));
        }},
        highlightElement: {value: function (projectId, selector, selectorSubjectOrdinal) {
          var selectorSubject = _.com_jetbrains_browserConnection.SelectorSubjects.valueOf(selectorSubjectOrdinal);
          this.execute(projectId, $f4.bind(null, selector, selectorSubject));
        }},
        hideHighlight: {value: function (tabId) {
          if (tabId === undefined)
            tabId = -1;
          var handler = $f5;
          if (tabId === -1) {
            this.pageManager.execute$0(null, true, handler);
          }
           else {
            this.pageManager.executeForTabById(tabId, true, handler);
          }
        }}
      });
    })()}
  });
  /** @name _.org_jetbrains_extensions */ 
  Kotlin.p(_, 'org_jetbrains_extensions', function () {
    Object.defineProperty(this, 'Extensions', {value: Kotlin.createObject(null, function () {
      Object.defineProperty(this, 'rootArea', {value: _.org_jetbrains_extensions.ExtensionsArea()});
    }, {
      getExtensions: {value: function (name) {
        return this.getExtensions$0(name, this.rootArea);
      }},
      getExtensions$0: {value: function (name, area) {
        return area.getExtensionPoint(name).extensions;
      }}
    })});
    Object.defineProperty(this, 'ANY', {value: _.org_jetbrains_extensions.LoadingOrder("any")});
    Object.defineProperty(this, 'FIRST', {value: _.org_jetbrains_extensions.LoadingOrder("first")});
  }, /** @lends _.org_jetbrains_extensions */ {
    ExtensionPointName: {value: (function () {
      return Kotlin.createClass(null, function (name) {
        Object.defineProperty(this, 'name', {value: name});
      }, /** @lends _.org_jetbrains_extensions.ExtensionPointName.prototype */ {
        extensions: {
          get: function () {
            return _.org_jetbrains_extensions.Extensions.getExtensions(this);
          }
        },
        extension: {
          get: function () {
            return Kotlin.arrayGet(this.extensions, 0);
          }
        }
      });
    })()},
    Orderable: {value: (function () {
      return Kotlin.createTrait(null);
    })()},
    LoadingOrder: {value: (function () {
      return Kotlin.createClass(null, function (name) {
        Object.defineProperty(this, 'name', {value: name});
      });
    })()},
    ExtensionComponentAdapter: {get: function () {
      var r = (function () {
        return Kotlin.createClass(_.org_jetbrains_extensions.Orderable, null);
      })();
      Object.defineProperty(this, 'ExtensionComponentAdapter', r);
      return r;
    }},
    ExtensionPoint: {value: (function () {
      return Kotlin.createClass(null, function (name) {
        Object.defineProperty(this, 'name', {value: name});
        Object.defineProperty(this, 'instances', {value: []});
      }, /** @lends _.org_jetbrains_extensions.ExtensionPoint.prototype */ {
        extensions: {
          get: function () {
            return this.instances;
          }
        },
        ObjectComponentAdapter: {get: function () {
          var r = (function () {
            return Kotlin.createClass(_.org_jetbrains_extensions.ExtensionComponentAdapter, function $fun(order) {
              $fun.baseInitializer.call(this);
              Object.defineProperty(this, 'order', {value: order});
            });
          })();
          Object.defineProperty(this, 'ObjectComponentAdapter', r);
          return r;
        }},
        registerExtension: {value: function (order, extension) {
          if (order === undefined)
            order = _.org_jetbrains_extensions.ANY;
          this.registerExtension$0(extension, order);
        }},
        registerExtension$0: {value: function (extension, order) {
          if (Kotlin.equals(order, _.org_jetbrains_extensions.FIRST)) {
            this.registerExtension$1(extension, 0);
          }
           else {
            this.registerExtension$1(extension, -1);
          }
        }},
        registerExtension$1: {value: function (extension, index) {
          if (Kotlin.arrayIndexOf(this.instances, extension) !== -1) {
            throw Kotlin.newException("Extension was already added: " + extension, 'IllegalArgumentException');
          }
          if (index === -1) {
            this.instances.push(extension);
          }
           else {
            Kotlin.arrayAddAt(this.instances, index, extension);
          }
        }}
      });
    })()},
    ExtensionsArea: {value: (function () {
      return Kotlin.createClass(null, function () {
        Object.defineProperty(this, 'extensionPoints', {value: Kotlin.PrimitiveHashMap()});
      }, /** @lends _.org_jetbrains_extensions.ExtensionsArea.prototype */ {
        registerExtensionPoint: {value: function (name) {
          var extensionPoint = _.org_jetbrains_extensions.ExtensionPoint(name.name);
          this.extensionPoints.put(name.name, extensionPoint !== null && extensionPoint !== undefined ? extensionPoint : Kotlin.throwNPE());
          return extensionPoint;
        }},
        getExtensionPoint: {value: function (name) {
          var tmp$0;
          return (tmp$0 = this.extensionPoints.get(name.name)) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
        }}
      });
    })()}
  });
  /** @name _.org_jetbrains_io */ 
  Kotlin.p(_, 'org_jetbrains_io', function () {
    Object.defineProperty(this, 'trimQueryOrFragment', {value: function ($receiver) {
      return $receiver.replace(_.org_jetbrains_io.queryOrFragmentRegExp, '');
    }});
    Object.defineProperty(this, 'loadResource', {value: function (url, errorCallback, callback) {
      _.org_jetbrains_io.loadResource$0(url, true, null, errorCallback, callback);
    }});
    function $f0(request, successFilter, callback, errorCallback) {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200 || request.status === 0) {
          if (successFilter === null || successFilter === undefined || successFilter(request)) {
            var tmp$0;
            callback((tmp$0 = request.responseText) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE());
          }
        }
         else {
          errorCallback !== null && errorCallback !== undefined ? errorCallback(request.statusText) : null;
        }
      }
    }
    Object.defineProperty(this, 'loadResource$0', {value: function (url, preventCaching, successFilter, errorCallback, callback) {
      if (preventCaching === undefined)
        preventCaching = true;
      if (successFilter === undefined)
        successFilter = null;
      if (errorCallback === undefined)
        errorCallback = null;
      var request = new XMLHttpRequest();
      request.open("GET", preventCaching && !(url.indexOf("file:") === 0) && !(url.indexOf('?') !== -1) ? url + "?time=" + Date.now() : url);
      request.onreadystatechange = $f0.bind(null, request, successFilter, callback, errorCallback);
      request.send();
    }});
    Object.defineProperty(this, 'canonicalizeUri', {value: function (uri, baseUrl) {
      if (_.org_jetbrains_io.get_isDataUri(uri) || (_.org_jetbrains_io.get_asParsedUrl(uri) !== null && _.org_jetbrains_io.get_asParsedUrl(uri) !== undefined)) {
        return uri;
      }
      var tmp$0, tmp$1;
      var base = (tmp$0 = _.org_jetbrains_io.get_asParsedUrl(baseUrl)) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
      var baseHost = base.scheme + "://";
      if (base.authority !== null && base.authority !== undefined) {
        baseHost += base.authority;
      }
      if (uri.charAt(0) === '/') {
        if (uri.length > 1 && uri.charAt(1) === '/') {
          return base.scheme + ":" + uri;
        }
         else {
          return baseHost + uri;
        }
      }
      var result = baseHost + ((tmp$1 = base.directory) !== null && tmp$1 !== undefined ? tmp$1 : "/") + uri;
      var queryOrFragmentInfo = _.org_jetbrains_io.queryOrFragmentRegExp.exec(result);
      var path = queryOrFragmentInfo === null || queryOrFragmentInfo === undefined ? result : result.substring(0, queryOrFragmentInfo.index);
      path = path.replace(new RegExp("/" + "\\" + "./", "g"), "/");
      var doubleDotRegExp = new RegExp("/((?!" + "\\" + "." + "\\" + "./)[^/]*)/" + "\\" + "." + "\\" + "./");
      while (doubleDotRegExp.test(path)) {
        path = path.replace(doubleDotRegExp, "/");
      }
      if (queryOrFragmentInfo === null || queryOrFragmentInfo === undefined) {
        return path;
      }
      return path + queryOrFragmentInfo[0];
    }});
    Object.defineProperty(this, 'queryOrFragmentRegExp', {value: new RegExp("(" + "\\" + "?|#|;).*" + "$", "g")});
  }, /** @lends _.org_jetbrains_io */ {
    get_isDataUri: {value: function ($receiver) {
      return $receiver.indexOf("data:") === 0;
    }},
    get_isInLocalFileSystem: {value: function ($receiver) {
      return $receiver.indexOf("file://") === 0;
    }},
    get_asParsedUrl: {value: function ($receiver) {
      return parseUrl($receiver);
    }}
  });
  /** @name _.org_jetbrains_io_jsonRpc */ 
  Kotlin.p(_, 'org_jetbrains_io_jsonRpc', function () {
    Object.defineProperty(this, 'stringifyNullable', {value: function (s) {
      return s === null || s === undefined ? "null" : JSON.stringify(s);
    }});
    Object.defineProperty(this, 'LOG', {value: _.org_jetbrains_logging.getLogger("org.jetbrains.io.jsonRpc")});
  }, /** @lends _.org_jetbrains_io_jsonRpc */ {
    Message: {value: (function () {
      return Kotlin.createTrait(null);
    })()},
    JsonRpcServer: {value: (function () {
      function $f0(id, result) {
        this.socket.send("[" + id + ", " + "\"" + "r" + "\"" + ", " + JSON.stringify(result) + "]");
      }
      function $f1(id, it) {
        this.socket.send("[" + id + ", " + "\"" + "e" + "\"" + ", " + JSON.stringify(it) + "]");
      }
      function $f2(regularArgs, resultCallback, errorCallback, it) {
        if (it < regularArgs.length) {
          return regularArgs[it];
        }
         else if (it === regularArgs.length) {
          return resultCallback;
        }
         else {
          return errorCallback;
        }
      }
      return Kotlin.createClass(null, function (socket) {
        Object.defineProperty(this, 'socket', {value: socket});
        Object.defineProperty(this, 'messageIdCounter', {value: 0, writable: true});
        Object.defineProperty(this, 'callbacks', {value: Kotlin.PrimitiveHashMap()});
        Object.defineProperty(this, 'domains', {value: Kotlin.PrimitiveHashMap()});
        {
          this.socket.message = Kotlin.assignOwner(function $fun(message) {
            if (_.org_jetbrains_io_jsonRpc.LOG.debugEnabled) {
              _.org_jetbrains_io_jsonRpc.LOG.debug(["IN " + message]);
            }
            var data = JSON.parse(message);
            if (data.length === 1 || (data.length === 2 && !(typeof data[1] === 'string'))) {
              var tmp$0;
              var f = (tmp$0 = $fun.o.callbacks.get(data[0])) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
              var singletonArray = $fun.o.safeGet(data, 1);
              if (singletonArray === null || singletonArray === undefined)
                (f !== null && f !== undefined ? f : Kotlin.throwNPE())();
              else
                f(singletonArray[0]);
            }
             else {
              var id;
              var offset;
              if (typeof data[0] === 'string') {
                id = -1;
                offset = 0;
              }
               else {
                var tmp$1;
                id = (tmp$1 = data[0]) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE();
                offset = 1;
              }
              var args = $fun.o.safeGet(data, offset + 2);
              var errorCallback;
              if (id !== -1) {
                var resultCallback = $f0.bind($fun.o, id);
                errorCallback = $f1.bind($fun.o, id);
                if (args === null || args === undefined) {
                  args = [resultCallback, errorCallback !== null && errorCallback !== undefined ? errorCallback : Kotlin.throwNPE()];
                }
                 else {
                  var regularArgs = args !== null && args !== undefined ? args : Kotlin.throwNPE();
                  args = Kotlin.arrayFromFun(regularArgs.length + 2, $f2.bind(null, regularArgs, resultCallback, errorCallback));
                }
              }
               else {
                errorCallback = null;
              }
              try {
                var tmp$2, tmp$3;
                kt_invoke((tmp$2 = $fun.o.domains.get(data[offset])) !== null && tmp$2 !== undefined ? tmp$2 : Kotlin.throwNPE(), (tmp$3 = data[offset + 1]) !== null && tmp$3 !== undefined ? tmp$3 : Kotlin.throwNPE(), args);
              }
              catch (e) {
                _.org_jetbrains_io_jsonRpc.LOG.error$0(e);
                if (errorCallback !== null && errorCallback !== undefined) {
                  var tmp$4;
                  errorCallback((tmp$4 = e.getMessage()) !== null && tmp$4 !== undefined ? tmp$4 : Kotlin.throwNPE());
                }
              }
            }
          }, this);
        }
      }, /** @lends _.org_jetbrains_io_jsonRpc.JsonRpcServer.prototype */ {
        safeGet: {value: function (a, index) {
          var tmp$0;
          return index < a.length ? (tmp$0 = a[index]) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE() : null;
        }},
        registerDomain: {value: function (name, commands) {
          if (this.domains.containsKey(name)) {
            throw Kotlin.newException(null, 'Exception');
          }
          this.domains.put(name, commands);
        }},
        send: {value: function (domain, command, encodedMessage) {
          if (encodedMessage === undefined)
            encodedMessage = null;
          this.send$0(domain, command, encodedMessage, null);
        }},
        send$0: {value: function (domain, command, encodedMessage, callback) {
          if (encodedMessage === undefined)
            encodedMessage = null;
          if (callback === undefined)
            callback = null;
          var message = "[";
          if (callback !== null && callback !== undefined) {
            var tmp$0, tmp$1;
            var id = (tmp$0 = this.messageIdCounter, tmp$1 = tmp$0, this.messageIdCounter = tmp$0 + 1, tmp$1);
            this.callbacks.put(id, callback !== null && callback !== undefined ? callback : Kotlin.throwNPE());
            message += id.toString() + ", ";
          }
          message += "\"" + domain + "\"" + ", " + "\"" + command + "\"";
          if (encodedMessage !== null && encodedMessage !== undefined) {
            message += ", " + Kotlin.stringify(encodedMessage);
          }
          message += "]";
          this.socket.send(message);
        }},
        send$1: {value: function (domain, message) {
          this.send$0(domain, message.method, message.toString(), null);
        }},
        send$2: {value: function (domain, message, callback) {
          if (callback === undefined)
            callback = null;
          this.send$0(domain, message.method, message.toString(), callback);
        }}
      });
    })()}
  });
  /** @name _.org_jetbrains_logging */ 
  Kotlin.p(_, 'org_jetbrains_logging', function () {
    function $f0(it) {
      return _.org_jetbrains_logging.ConsoleLogger();
    }
    Object.defineProperty(this, 'getLogger', {value: function (category) {
      {
        var tmp$0 = Kotlin.arrayIterator(_.org_jetbrains_logging.LOGGER_FACTORY_EP_NAME.extensions);
        while (tmp$0.hasNext()) {
          var factory = tmp$0.next();
          var logger = factory(category);
          if (logger !== null && logger !== undefined) {
            return logger;
          }
        }
      }
      throw Kotlin.newException(null, 'IllegalStateException');
    }});
    Object.defineProperty(this, 'LOGGER_FACTORY_EP_NAME', {value: _.org_jetbrains_extensions.ExtensionPointName("org.jetbrains.logging.logger")});
    Object.defineProperty(this, 'doInit', {value: function () {
      var extensionPoint = _.org_jetbrains_extensions.Extensions.rootArea.registerExtensionPoint(_.org_jetbrains_logging.LOGGER_FACTORY_EP_NAME);
      extensionPoint.registerExtension(undefined, $f0);
    }()});
  }, /** @lends _.org_jetbrains_logging */ {
    Logger: {value: (function () {
      return Kotlin.createTrait(null);
    })()},
    ConsoleLogger: {get: function () {
      var r = (function () {
        return Kotlin.createClass(_.org_jetbrains_logging.Logger, function () {
          Object.defineProperty(this, 'debugEnabled', {value: true, writable: true});
        }, /** @lends _.org_jetbrains_logging.ConsoleLogger.prototype */ {
          info: {value: function (message) {
            console.info(message);
          }, writable: true},
          warn: {value: function (message) {
            console.warn(message);
          }, writable: true},
          error: {value: function (message) {
            console.error(message);
          }, writable: true},
          error$0: {value: function (e) {
            console.error(e, (e !== null && e !== undefined ? e : Kotlin.throwNPE()).stack);
          }, writable: true},
          debug: {value: function (objects) {
            if (this.debugEnabled) {
              console.log.apply(console, objects);
            }
          }, writable: true}
        });
      })();
      Object.defineProperty(this, 'ConsoleLogger', r);
      return r;
    }}
  });
  /** @name _.com_jetbrains_browserConnection */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection', function () {
    Object.defineProperty(this, 'greaterOrEquals', {value: function ($receiver, oBaseline, oBuild) {
      if ($receiver.baselineVersion !== oBaseline) {
        return $receiver.baselineVersion > oBaseline;
      }
      var bn = $receiver.buildNumber;
      if (bn !== null && bn !== undefined && bn !== 0 && bn < oBuild) {
        return false;
      }
      return true;
    }});
    Object.defineProperty(this, 'connect', {value: function (version, family, host, port, reconnectTimeout, callback) {
      if (host === undefined)
        host = _.com_jetbrains_browserConnection.DEFAULT_JB_HOST;
      if (port === undefined)
        port = _.com_jetbrains_browserConnection.DEFAULT_JB_PORT;
      if (reconnectTimeout === undefined)
        reconnectTimeout = 5000;
      if (callback === undefined)
        callback = null;
      var socket = _.org_jetbrains_io_webSocket.Socket(null, reconnectTimeout);
      var rpcServer = _.org_jetbrains_io_jsonRpc.JsonRpcServer(socket);
      callback !== null && callback !== undefined ? callback(socket, rpcServer) : null;
      socket.connect("ws://" + host + ":" + port + "/jsonRpc?v=" + version + "&f=" + family);
      return rpcServer;
    }});
    Object.defineProperty(this, 'registerDomService', {value: function (pageManager, rpcServer) {
      rpcServer.registerDomain("Dom", _.com_jetbrains_browserConnection.DomService(pageManager));
    }});
    Object.defineProperty(this, 'compareUrls', {value: function (a, b) {
      if (Kotlin.equals(a, b)) {
        return true;
      }
      var filePrefix = "file://";
      if (a.indexOf(filePrefix) === 0 && b.indexOf(filePrefix) === 0) {
        return Kotlin.equals(_.com_jetbrains_browserConnection.normalizeFileUrl(a), _.com_jetbrains_browserConnection.normalizeFileUrl(b));
      }
      return Kotlin.equals(_.com_jetbrains_browserConnection.trimTrailing(_.org_jetbrains_io.trimQueryOrFragment(a), '/'), _.com_jetbrains_browserConnection.trimTrailing(_.org_jetbrains_io.trimQueryOrFragment(b), '/'));
    }});
    Object.defineProperty(this, 'trimTrailing', {value: function ($receiver, char) {
      var index = $receiver.length - 1;
      while (index >= 0 && $receiver.charAt(index) === char) {
        index--;
      }
      return $receiver.substring(0, index + 1);
    }});
    Object.defineProperty(this, 'normalizeFileUrl', {value: function (url) {
      if (url.indexOf(_.com_jetbrains_browserConnection.LOCALHOST_FILE_PREFIX) === 0) {
        return "file:///" + url.substring(_.com_jetbrains_browserConnection.LOCALHOST_FILE_PREFIX.length);
      }
       else {
        return url;
      }
    }});
    Object.defineProperty(this, 'normalizeTabUriPath', {value: function (path) {
      return Kotlin.equals(path, "/") ? null : path;
    }});
    Object.defineProperty(this, 'isInspectableBackedByPattern', {value: function (scheme, host) {
      if (Kotlin.equals(scheme, "file") || Kotlin.equals(scheme, "data")) {
        return 1;
      }
       else if (!(Kotlin.equals(scheme, "http") || Kotlin.equals(scheme, "https"))) {
        return -1;
      }
      if (host === null || host === undefined) {
        throw Kotlin.newException("host can be null only if protocol equals file", 'IllegalArgumentException');
      }
      if (!(host.indexOf(".") !== -1) || host.indexOf(".localhost", host.length - ".localhost".length) !== -1 || host.indexOf(".local", host.length - ".local".length) !== -1 || host.indexOf(".dev", host.length - ".dev".length) !== -1) {
        return 1;
      }
      return 0;
    }});
    Object.defineProperty(this, 'DEFAULT_JB_HOST', {value: "127.0.0.1"});
    Object.defineProperty(this, 'DEFAULT_JB_PORT', {value: "63342"});
    Object.defineProperty(this, 'LOCALHOST_FILE_PREFIX', {value: "file://localhost/"});
  }, /** @lends _.com_jetbrains_browserConnection */ {
    BuildInfo: {value: (function () {
      return Kotlin.createClass(null, function (name, productName, baselineVersion, buildNumber) {
        if (productName === undefined)
          productName = null;
        Object.defineProperty(this, 'name', {value: name});
        Object.defineProperty(this, 'productName', {value: productName});
        Object.defineProperty(this, 'baselineVersion', {value: baselineVersion});
        Object.defineProperty(this, 'buildNumber', {value: buildNumber});
      });
    })()},
    DebuggerCommand: {value: (function () {
      return Kotlin.createTrait(null);
    })()},
    DebuggerService: {value: (function () {
      function $f0(usePreliminaryPage, callback, done, rejectedCallback, tab, created) {
        this.pageManager.attachDebugger(tab, !usePreliminaryPage, this.wrapCallFinally(callback, done), rejectedCallback);
      }
      function $f1(usePreliminaryPage, url, errorCallback, callback, done) {
        try {
          var urlToOpen = usePreliminaryPage ? this.createPreliminaryPageUrl(url) : null;
          var rejectedCallback = this.wrapCallFinally(errorCallback, done);
          this.pageManager.getOrCreateTab(url, urlToOpen, true, rejectedCallback, $f0.bind(this, usePreliminaryPage, callback, done, rejectedCallback));
        }
        catch (e) {
          try {
            errorCallback(Kotlin.stringify(e));
          }
          finally {
            done();
          }
        }
      }
      function $f2(callback, finallyCallback, it) {
        try {
          callback(it);
        }
        finally {
          finallyCallback();
        }
      }
      return Kotlin.createClass(null, function (pageManager) {
        Object.defineProperty(this, 'pageManager', {value: pageManager});
        Object.defineProperty(this, 'queueProcessor', {value: _.org_jetbrains_util_concurrency.QueueProcessor(function (item, done) {
          item(done);
        })});
      }, /** @lends _.com_jetbrains_browserConnection.DebuggerService.prototype */ {
        attach: {value: function (url, usePreliminaryPage, callback, errorCallback) {
          this.queueProcessor.add($f1.bind(this, usePreliminaryPage, url, errorCallback, callback));
        }},
        createPreliminaryPageUrl: {value: function (url) {
          return "data:text/html;base64," + window.btoa("<!DOCTYPE html><title>Loading " + url + "</title>");
        }, writable: true},
        wrapCallFinally: {value: function (callback, finallyCallback) {
          return $f2.bind(null, callback, finallyCallback);
        }}
      });
    })()},
    PageManager: {value: (function () {
      function $f0(onlyIfAttached, handler, it) {
        this.executeForTab(it, onlyIfAttached, handler);
      }
      function $f1(it) {
        this.tabService.reload(it, undefined);
      }
      return Kotlin.createClass(null, function (tabService, rpcServer) {
        Object.defineProperty(this, 'tabService', {value: tabService});
        Object.defineProperty(this, 'rpcServer', {value: rpcServer});
      }, /** @lends _.com_jetbrains_browserConnection.PageManager.prototype */ {
        filterInspectable: {value: function (projectId, hostAndPathPairs, callback) {
          this.rpcServer.send$0("Pages", "filterInspectable", "\"" + Kotlin.stringify(projectId) + "\"" + ", " + JSON.stringify(hostAndPathPairs), callback);
        }},
        execute: {value: function (projectId, handler) {
          this.execute$0(projectId, false, handler);
        }},
        execute$0: {value: function (projectId, onlyIfAttached, handler) {
          this.process(projectId, $f0.bind(this, onlyIfAttached, handler));
        }},
        reload: {value: function () {
          this.process(null, $f1.bind(this));
        }},
        $dv$urlToOpen_getOrCreateTab: {value: function () {
          return null;
        }},
        $dv$focusWindow_getOrCreateTab: {value: function () {
          return true;
        }},
        $dv$errorCallback_getOrCreateTab: {value: function () {
          return null;
        }},
        $dv$callback_getOrCreateTab: {value: function () {
          return null;
        }}
      });
    })()}
  });
  /** @name _.org_jetbrains_util_concurrency */ 
  Kotlin.p(_, 'org_jetbrains_util_concurrency', function () {
    Object.defineProperty(this, 'LOG', {value: _.org_jetbrains_logging.getLogger("org.jetbrains.util.concurrency")});
  }, /** @lends _.org_jetbrains_util_concurrency */ {
    QueueProcessor: {value: (function () {
      return Kotlin.createClass(null, function (processor) {
        Object.defineProperty(this, 'processor', {value: processor});
        Object.defineProperty(this, 'queue', {value: []});
        Object.defineProperty(this, 'processing', {value: false, writable: true});
        Object.defineProperty(this, 'done', {value: Kotlin.assignOwner(function $fun() {
          if (!$fun.o.processing) {
            throw Kotlin.newException("processing must be true", 'Exception');
          }
          Kotlin.arrayRemoveAt($fun.o.queue, 0);
          if ($fun.o.queue.length === 0) {
            $fun.o.processing = false;
          }
           else {
            $fun.o.process(Kotlin.arrayGet($fun.o.queue, 0));
          }
        }, this)});
      }, /** @lends _.org_jetbrains_util_concurrency.QueueProcessor.prototype */ {
        add: {value: function (item) {
          this.queue.push(item);
          if (!this.processing) {
            this.processing = true;
            this.process(item);
          }
        }},
        process: {value: function (item) {
          this.processor(item, this.done);
        }}
      });
    })()}
  });
  /** @name _.org_jetbrains_io_webSocket */ 
  Kotlin.p(_, 'org_jetbrains_io_webSocket', function () {
    Object.defineProperty(this, 'LOG', {value: _.org_jetbrains_logging.getLogger("org.jetbrains.io.webSocket")});
  }, /** @lends _.org_jetbrains_io_webSocket */ {
    Socket: {value: (function () {
      function $f0(it) {
        if (this.message !== null && this.message !== undefined) {
          var tmp$0;
          ((tmp$0 = this.message) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE())(it.data);
        }
      }
      function $f1(socket, it) {
        this.connecting = false;
        this.reconnectTimer = null;
        socket.onmessage = $f0.bind(this);
        if (this.opened !== null && this.opened !== undefined) {
          var tmp$0;
          ((tmp$0 = this.opened) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE())();
        }
      }
      function $f2() {
        this.connect$0();
      }
      function $f3(it) {
        this.socket = null;
        if (!this.connecting && (this.closed !== null && this.closed !== undefined)) {
          try {
            var tmp$0;
            ((tmp$0 = this.closed) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE())();
          }
          catch (e) {
            _.org_jetbrains_io_webSocket.LOG.error$0(e);
          }
        }
        if (this.reconnectTimeout > 0) {
          if (this.reconnectTimer === null || this.reconnectTimer === undefined) {
            this.reconnectTimer = _.org_jetbrains_util.setTimeout(this.reconnectTimeout, $f2.bind(this));
          }
           else {
            var tmp$1;
            ((tmp$1 = this.reconnectTimer) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE()).start();
          }
        }
      }
      function $f4(it) {
        if (this.reconnectTimeout === -1) {
          _.org_jetbrains_io_webSocket.LOG.error("onerror " + it);
        }
      }
      return Kotlin.createClass(null, function (uri, reconnectTimeout) {
        if (uri === undefined)
          uri = null;
        if (reconnectTimeout === undefined)
          reconnectTimeout = 5000;
        Object.defineProperty(this, 'uri', {value: uri, writable: true});
        Object.defineProperty(this, 'reconnectTimeout', {value: reconnectTimeout});
        Object.defineProperty(this, 'socket', {value: null, writable: true});
        Object.defineProperty(this, 'connecting', {value: false, writable: true});
        Object.defineProperty(this, 'reconnectTimer', {value: null, writable: true});
        Object.defineProperty(this, 'opened', {value: null, writable: true});
        Object.defineProperty(this, 'closed', {value: null, writable: true});
        Object.defineProperty(this, 'message', {value: null, writable: true});
        {
          if (this.uri !== null && this.uri !== undefined) {
            this.connect$0();
          }
        }
      }, /** @lends _.org_jetbrains_io_webSocket.Socket.prototype */ {
        send: {value: function (data) {
          var tmp$0;
          ((tmp$0 = this.socket) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).send(data);
        }},
        disconnect: {value: function () {
          var s = this.socket;
          if (s !== null && s !== undefined) {
            this.socket = null;
            s.close();
            _.org_jetbrains_io_webSocket.LOG.info("WebSocket connection closed");
          }
        }},
        connect: {value: function (uri) {
          this.uri = uri;
          this.connect$0();
        }},
        connect$0: {value: function () {
          if (this.socket !== null && this.socket !== undefined) {
          }
          this.connecting = true;
          var tmp$0;
          var WebSocket = require('ws');
          var socket = new WebSocket((tmp$0 = this.uri) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE());
          this.socket = socket;
          socket.onopen = $f1.bind(this, socket);
          socket.onclose = $f3.bind(this);
          socket.onerror = $f4.bind(this);
        }}
      });
    })()}
  });
  /** @name _.org_jetbrains_util */ 
  Kotlin.p(_, 'org_jetbrains_util', function () {
    function $f0(delay, callback) {
      return _.org_jetbrains_util.WindowTimer(delay, callback);
    }
    Object.defineProperty(this, 'setTimeout', {value: function (delay, callback) {
      var timer = _.org_jetbrains_util.TIMER_FACTORY_EP_NAME.extension.call(_.org_jetbrains_util.TIMER_FACTORY_EP_NAME, delay, callback);
      timer.start();
      return timer;
    }});
    Object.defineProperty(this, 'TIMER_FACTORY_EP_NAME', {value: _.org_jetbrains_extensions.ExtensionPointName("org.jetbrains.util.timer")});
    Object.defineProperty(this, 'doInit', {value: function () {
      var extensionPoint = _.org_jetbrains_extensions.Extensions.rootArea.registerExtensionPoint(_.org_jetbrains_util.TIMER_FACTORY_EP_NAME);
      extensionPoint.registerExtension(undefined, $f0);
    }()});
  }, /** @lends _.org_jetbrains_util */ {
    Timer: {value: (function () {
      return Kotlin.createClass(null, function (callback) {
        Object.defineProperty(this, 'callback', {value: callback});
      }, /** @lends _.org_jetbrains_util.Timer.prototype */ {
        running: {
          get: function () {
            return this.$running;
          }
        }
      });
    })()},
    WindowTimer: {get: function () {
      var r = (function () {
        return Kotlin.createClass(_.org_jetbrains_util.Timer, function $fun(delay, callback) {
          $fun.baseInitializer.call(this, callback);
          Object.defineProperty(this, 'timeoutId', {value: -1, writable: true});
          Object.defineProperty(this, '$delay', {value: delay, writable: true});
          Object.defineProperty(this, 'callbackWrapper', {value: Kotlin.assignOwner(function $fun() {
            $fun.o.timeoutId = -1;
            callback();
          }, this)});
        }, /** @lends _.org_jetbrains_util.WindowTimer.prototype */ {
          delay: {
            get: function () {
              return this.$delay;
            },
            set: function (value) {
              this.$delay = value;
              if (this.running) {
                this.stop();
                this.start();
              }
            }
          },
          running: {
            get: function () {
              return this.timeoutId !== -1;
            }
          },
          start: {value: function () {
            if (!this.running) {
              this.timeoutId = window.setTimeout(this.callbackWrapper, this.delay);
            }
          }, writable: true},
          stop: {value: function () {
            if (!this.running) {
              return;
            }
            window.clearTimeout(this.timeoutId);
            this.timeoutId = -1;
          }, writable: true}
        });
      })();
      Object.defineProperty(this, 'WindowTimer', r);
      return r;
    }}
  });
  /** @name _.org_jetbrains_util */ 
  Kotlin.p(_, 'org_jetbrains_util', function () {
    Object.defineProperty(this, 'ThreeState', {value: Kotlin.createObject(null, function () {
      Object.defineProperty(this, 'YES', {value: 1});
      Object.defineProperty(this, 'NO', {value: -1});
      Object.defineProperty(this, 'UNSURE', {value: 0});
    })});
    Object.defineProperty(this, 'compareVersionNumber', {value: function ($receiver, otherVersion) {
      return _.org_jetbrains_util.compareVersionNumbers($receiver, otherVersion);
    }});
    Object.defineProperty(this, 'compareVersionNumbers', {value: function (v1, v2) {
      if ((v1 === null || v1 === undefined) && (v2 === null || v2 === undefined)) {
        return 0;
      }
      if (v1 === null || v1 === undefined) {
        return -1;
      }
      if (v2 === null || v2 === undefined) {
        return 1;
      }
      var part1 = v1.split("[" + "\\" + "." + "\\" + "_" + "\\" + "-]");
      var part2 = v2.split("[" + "\\" + "." + "\\" + "_" + "\\" + "-]");
      var index = 0;
      while (index < part1.length && index < part2.length) {
        var p1 = part1[index];
        var p2 = part2[index];
        var cmp;
        if (p1.match("\\" + "d+") !== null && p2.match("\\" + "d+") !== null) {
          cmp = parseInt(p1) - parseInt(p2);
          if (cmp < -1) {
            cmp = -1;
          }
           else if (cmp > 1) {
            cmp = 1;
          }
        }
         else {
          cmp = part1[index].compareTo(part2[index]);
        }
        if (cmp !== 0) {
          return cmp;
        }
        index++;
      }
      if (part1.length === part2.length) {
        return 0;
      }
       else if (part1.length > index) {
        return 1;
      }
       else {
        return -1;
      }
    }});
  }, /** @lends _.org_jetbrains_util */ {
  });
  Kotlin.finalize(_);
  return _;
});

//# sourceMappingURL=browser-ext-platform.js.map
