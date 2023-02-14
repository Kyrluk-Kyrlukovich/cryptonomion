import Worker from 'worker-loader!./worker';

const worker = new Worker();

export function sendMessage(msg) {
  worker.postMessage(msg);
}
