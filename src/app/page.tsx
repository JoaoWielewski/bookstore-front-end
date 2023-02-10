import './styles.css';
import BooksContainer from './components/BooksContainer/page';

function Home() {
  return (
    <>
      <h1>Books</h1>
      <BooksContainer advertisement={false}></BooksContainer>
    </>
  );
}

export default Home;
