
function resize(handler) {
	window.addEventListener('resize', handler);
}

resize(function (event) {
  window.width = innerWidth;
  window.height = innerHeight;
});

window.extend({
  html: document.body.parentNode,
  head: document.head,
  body: document.body,
  width: innerWidth,
  height: innerHeight,
  query: location.toString().split('?')[1]
});

window.params = query ? query.parse('&', '=') : null;

$('body').mousedown('left', function () {
  window.dragging = true
});

$('body').mouseup('left', function () {
  window.dragging = false
});

function script(src) {
  $('<script>').attr('src', src).appendTo(head);
}

function xhr(options) {
  var xhr = new XMLHttpRequest();
  var url = options.to;
  var promise = {
    then: function (onThen) { this.onThen = onThen; return this; },
    error: function (onError) { this.onError = onError; return this; }
  };

  if (options.params) url += '?' + options.params.serialize('&', '=');

  xhr.addEventListener('load', function () {
    promise.onThen && promise.onThen(xhr.response);
  }, false);

  xhr.addEventListener('error', function () {
    promise.onError && promise.onError(xhr.response);
  }, false);

  xhr.open(options.method || 'get', url, true);
  xhr.send();

  return promise;
}

function get(url, params) {
  if (params.isFunction) error = success, success = params, params = null;
  return xhr({
    method: 'get',
    to: url,
    params: params
  });
}

function post(url, params) {
  if (params.isFunction) error = success, success = params, params = null;
  return xhr({
    method: 'post',
    to: url,
    params: params
  });
}

function put(url, params) {
  if (params.isFunction) error = success, success = params, params = null;
  return xhr({
    method: 'put',
    to: url,
    params: params
  });
}

function del(url, params) {
  if (params.isFunction) error = success, success = params, params = null;
  return xhr({
    method: 'delete',
    to: url,
    params: params
  });
}

function dependencies() {
  var graph = [];

  for (var i = 0; i < arguments.length; i += 2) {
    var dependencies = arguments[i], callback = arguments[i + 1];
    callback.dependencies = dependencies;

    for (var j = 0; j < dependencies.length; ++j) {
      var precursor = dependencies[j];
      precursor.dependents || (precursor.dependents = []);
      precursor.dependents.push(callback);
    }

    graph.push(callback);
  }

  for (var i = 0; i < graph.length; ++i) {
    var callback = graph[i];
    if (callback.dependencies.length == 0) {
      callback.call({});

    }
  }
}

function a(cb) {}
function b(cb) {}
function c(cb) {}

dependencies(
  [ ], a,
  [a], b,
  [b], c
);

