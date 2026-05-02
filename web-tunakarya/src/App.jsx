import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./landing/Dashboard";
import Profile from "./landing/Profile";
import GaleriPage from "./pages/Galeri";
import MainLayout from "./layout/MainLayout.jsx";

function App() {
  const location = useLocation();

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/galeri"
          element={
            <MainLayout>
              <GaleriPage />
            </MainLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
