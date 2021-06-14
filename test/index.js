import BackInterceptor from '../dist_npm/back-interceptor.esm';

const backInterceptor = new BackInterceptor();
window.b = backInterceptor;

backInterceptor.use(() => {
  console.log('cb 0');
});

const bi1 = backInterceptor.use(() => {
  console.log('cb 1');
});

backInterceptor.use(() => {
  console.log('cb 1');
});

backInterceptor.eject(bi1);
