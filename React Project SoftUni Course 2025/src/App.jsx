import "./App.scss";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from "./components/home/Home";
import GamesCatalog from "./components/games/games-catalog/GamesCatalog";
import About from "./components/core/about/About";
import Contact from "./components/core/contact/Contact";
import Gallery from "./components/games/gallery/Gallery";
import GameDetails from "./components/games/game-details/GameDetails";
import GuestGuard from "./components/guards/GuestGuard";
import Register from "./components/users/register/Register";
import Login from "./components/users/login/Login";
import AuthGuard from "./components/guards/AuthGuard";
import Profile from "./components/users/profile/Profile";
import GameCreate from "./components/games/game-create/GameCreate";
import GameEdit from "./components/games/game-edit/GameEdit";
import Error404 from "./components/errors/Error404/Error404";
import Header from "./components/core/header/Header";
import Footer from "./components/core/footer/Footer";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="box">
        <Header />
        <main id="main-content">
          <Routes>
            {/* Redirect from root to home */}
            <Route path="" element={<Navigate to="/home" replace />} />
            
            {/* Public routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/catalog" element={<GamesCatalog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/details/:id" element={<GameDetails />} />

            {/* Guest routes */}
            <Route element={<GuestGuard />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/create" element={<GameCreate />} />
              <Route path="/edit/:id" element={<GameEdit />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
