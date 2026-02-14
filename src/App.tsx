import { lazy, Suspense } from 'react';

const HubApp = lazy(() => import('./apps/hub/HubApp'));
const TrainexApp = lazy(() => import('./apps/trainex/TrainexApp'));

function getActiveApp(): 'hub' | 'trainex' {
  const params = new URLSearchParams(window.location.search);
  return params.get('app') === 'trainex' ? 'trainex' : 'hub';
}

function App() {
  const activeApp = getActiveApp();

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      {activeApp === 'trainex' ? <TrainexApp /> : <HubApp />}
    </Suspense>
  );
}

export default App;
