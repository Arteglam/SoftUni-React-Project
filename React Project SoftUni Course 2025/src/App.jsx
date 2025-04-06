import "./App.css";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { Routes, Route } from 'react-router-dom';

import Header from "./components/core/header/Header";
import Home from "./components/home/Home";
import About from "./components/core/about/About";
import Contact from "./components/core/contact/Contact";
import Footer from "./components/core/footer/Footer";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="box">
        <Header />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
