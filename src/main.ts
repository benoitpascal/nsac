const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  throw new Error('Missing #app root element');
}

app.textContent = 'Hello world';
