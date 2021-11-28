import { ModalsProvider } from '@mantine/modals';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedPage from '@/components/ProtectedPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { AuthContextProvider } from './contexts/auth';
import { routes } from './routes';

const App: React.FC = () => (
  <ModalsProvider>
    <AuthContextProvider>
      <Router>
        <Routes>
          {Object.entries(routes).map(([routeName, { protected: isProtected, element, path }]) => (
            <Route
              key={routeName}
              path={path}
              element={isProtected ? <ProtectedPage>{element}</ProtectedPage> : element}
            />
          ))}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  </ModalsProvider>
);

export default App;
