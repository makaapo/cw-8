import Toolbar from './components/NavBar/NavBar';
import MutateQuote from './Pages/MutateQuote/MutateQuote';
import {Route, Routes} from 'react-router-dom';
import Quotes from './Pages/Quotes/Quotes';

const App = () => (
  <>
    <header>
      <Toolbar/>
    </header>
    <main>
      <Routes>
        <Route path="/" element={<Quotes />}/>
        <Route path="/add-quote" element={<MutateQuote />}/>
        <Route path="/quotes/:id/edit" element={<MutateQuote/>}/>
        <Route path="*" element={<h3 className="text-center fs-1">Not Found</h3>}/>
      </Routes>
    </main>
  </>
);

export default App
