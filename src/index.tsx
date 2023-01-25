import { Suspense, lazy } from 'react';
import { Spinner } from 'reactstrap';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import Store from './redux/Store';
import { ToastContainer } from 'react-toastify';
import { SignalR } from './components/signalR/SignalR';
import 'bootstrap/dist/css/bootstrap.min.css';
import './configs/i18n/config';
import 'react-toastify/dist/ReactToastify.css';
import '@src/scss/styles/style.scss';

const LazyApp = lazy(() => import('./App'));
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={Store}>
    <Suspense fallback={<Spinner />}>
      <LazyApp />
      <SignalR />
      <ToastContainer newestOnTop />
    </Suspense>
  </Provider>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then((result) => {
        console.log('service worker Registred');
      })
      .catch((result) => {
        console.log('service worker Erorr:', result);
      });
  });
}
