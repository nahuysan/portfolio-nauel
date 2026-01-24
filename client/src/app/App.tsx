import { Header } from "./components/Header";
import { LanguageProvider } from './context/LanguageContext';
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Photography } from "./components/Photography";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <LanguageProvider>
    <div className="size-full">
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Photography />
        <Contact />
      </main>
      <Footer />
    </div>
    </LanguageProvider>
  );
}
