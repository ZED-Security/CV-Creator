import Creator from './components/Creator';
import { Container } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Show from './components/Show';

export default function App() {

  const Header = () => {
    return (
        <header className="header">
            <Container>
                <div className="header-container">
                    <div className="logo">CV</div>
                    <nav className="nav-links">
                        <a href="/create">Create</a>
                        <a href="/show">Show</a>
                    </nav>
                </div>
            </Container>
        </header>
    );
  }

  const Home = () => {
    return (
      <div className="home">
        <h2>CV Creator</h2>
        <p>Craft your professional CV quickly and effortlessly with our simple tool. Just fill in your details — like your name, profession, experience, skills, and education — and we’ll generate a clean, well-written paragraph-style CV for you.
Whether you’re applying for your first job or updating your career profile, our tool helps you present your story clearly and professionally in just seconds. No complicated templates, no formatting headaches — just your information turned into a compelling CV paragraph you can copy, save, or share.
Start building your perfect CV now and take the next step in your career with confidence!</p>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Container style={{ marginTop: '80px', marginBottom: '50px' }}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/create' element={<Creator/>} />
          <Route path='/show' element={<Show/>} />
        </Routes>
      </Container>
    </Router>
  );
}
