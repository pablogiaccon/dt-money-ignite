import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { GlobalStyle } from './styles/global';

export function App() {
  return (
    <>
      <Header />
      <Dashboard />
      <GlobalStyle />
    </>
  );
}
