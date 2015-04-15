
function log() {
	console.log.apply(console, arguments);
}

function warn() {
  console.warn.apply(console, arguments);
}

function error() {
  console.error.apply(console, arguments);
}

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
    promise.onThen(xhr.response);
  }, false);

  xhr.addEventListener('error', function () {
    promise.onError(xhr.response);
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

