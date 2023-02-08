const allPorts = [];

onconnect = function(e) {
  let port = e.ports[0];
  allPorts.push(port);

  port.addEventListener('message', e => {
    let message = e.data[0];
    allPorts.forEach(port => {
      port.postMessage(message);
      console.log(e.data);
    })
  });

  port.start()
}