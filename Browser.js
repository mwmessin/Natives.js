
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

window.params = query ? query.structure('&', '=') : null;

function script(src) {
  $('<script>').attr('src', src).appendTo(head);
}

function xhr(options) {
  var xhr = new XMLHttpRequest();
  var url = options.to;

  if (options.params) url += '?' + options.params.destructure('&', '=');

  options.success && xhr.addEventListener('load', function () {
    log(xhr.status, xhr);
    options.success(xhr.response);
  }, false);

  options.error && xhr.addEventListener('error', function () {
    error(xhr.status, xhr);
    options.error(xhr.response);
  }, false);

  xhr.open(options.method || 'get', url, true);
  xhr.send();
}

function get(url, params, success, error) {
  if (params.isFunction) error = success, success = params, params = null;
  return xhr({
    method: 'get',
    to: url,
    params: params,
    success: success,
    error: error
  });
}

function post(url, params, success, error) {
  if (params.isFunction) error = success, success = params, params = null;
  return xhr({
    method: 'post',
    to: url,
    params: params,
    success: success,
    error: error
  });
}

function put(url, params, success, error) {
  if (params.isFunction) error = success, success = params, params = null;
  return xhr({
    method: 'put',
    to: url,
    params: params,
    success: success,
    error: error
  });
}

function del(url, params, success, error) {
  if (params.isFunction) error = success, success = params, params = null;
  return xhr({
    method: 'delete',
    to: url,
    params: params,
    success: success,
    error: error
  });
}
