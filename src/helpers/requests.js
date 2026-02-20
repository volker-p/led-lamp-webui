import ReconnectingWebSocket from 'reconnecting-websocket';

export const websocket = new ReconnectingWebSocket("ws://" + window.location.host + "/ws");

export const sendWSEvent = (eventName, data) => {
    websocket.send(
      JSON.stringify({
        event: eventName,
        data: data,
      })
    )
}

export const status = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
};

function futch(url, opts={}, onProgress) {
  return new Promise( (res, rej)=>{
      var xhr = new XMLHttpRequest();
      xhr.open(opts.method || 'get', url);
      for (var k in opts.headers||{})
          xhr.setRequestHeader(k, opts.headers[k]);
      xhr.onload = e => res(e.target.responseText);
      xhr.onerror = rej;
      if (xhr.upload && onProgress)
          xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
      xhr.send(opts.body);
  });
}

export const uploadSize = (size) => fetch(`/updateSize`, {
  method: "POST",
  body: new URLSearchParams(`fileSize=${size}`)
}).then(status)

export const uploadBinary = (file, onProgress) => futch(`/update`, {
  method: "POST",
  body: file
}, onProgress)

export const fetchPlugins = () => fetch(`/plugins`).then(status).then(r => r.json())

export const deletePlugin = (filename) => fetch(`/plugin/${encodeURIComponent(filename)}`, {
  method: "DELETE",
}).then(status)

export const uploadPluginSize = (size) => fetch(`/uploadPluginSize`, {
  method: "POST",
  body: new URLSearchParams(`fileSize=${size}`)
}).then(status)

export const uploadPlugin = (file, onProgress) => futch(`/uploadPlugin`, {
  method: "POST",
  body: file
}, onProgress)
