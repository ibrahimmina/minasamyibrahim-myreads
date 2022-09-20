import "./App.css";
import { useState , useEffect} from "react";
import ListBooks from "./components/ListBooks";
import * as BooksAPI from "./BooksAPI";
import { Route, Routes, useNavigate, Link } from "react-router-dom";


function App() {
    let navigate = useNavigate();

  const [showSearchPage, setShowSearchpage] = useState(false);

  const [books, setBooks]= useState([]);

  const updateShelf = (book,shelf) => {
    const updateShelfAPI = async () => {
      BooksAPI.update(book,shelf);
      const res = await BooksAPI.getAll();
      setBooks(res);
    };
    updateShelfAPI();
  }

  useEffect(() => {
    const getBooks = async () => {
      const res = await BooksAPI.getAll();
      setBooks(res);
    };
    getBooks();
  }, [])


  const [query, setQuery] = useState("");

  const updateQuery = (query) => {
    setQuery(query.trim());
  }

  const clearQuery = () => {
      setShowSearchpage(!showSearchPage);
      updateQuery("");
      navigate("/");
  }

  let showingBooks = "";
  if (query === ""){
    showingBooks = books;
  } else {
    
    let filter1 = books.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));
    //console.log(filter1);
    let filter2 = books.filter((c) => c.authors.toString().toLowerCase().includes(query.toLowerCase()));
    //console.log(filter2);
    let filter3 = books.filter((c) => c.industryIdentifiers.every(a => a.identifier.includes(query)));
    //console.log(filter3);
    let concat = [].concat(filter1,filter2,filter3);
    let ids = concat.map(o => o.id)
    let filtered = concat.filter(({id}, index) => !ids.includes(id, index+1))
    showingBooks = filtered;
  }


  return (

    <Routes>
    <Route exact path="/" element={
          <div className="app">
                    <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Currently Reading</h2>
                <div className="bookshelf-books">
                    <ListBooks books={books.filter((bk) => bk.shelf === "currentlyReading")} onUpdateShelf={updateShelf}/>


                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Want to Read</h2>
                <div className="bookshelf-books">
                  <ListBooks books={books.filter((bk) => bk.shelf === "wantToRead")} onUpdateShelf={updateShelf}/>
                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Read</h2>
                <div className="bookshelf-books">
                  <ListBooks books={books.filter((bk) => bk.shelf === "read")} onUpdateShelf={updateShelf}/>
                </div>
              </div>
            </div>
          </div>
          <div className="open-search">
                <Link to="/search" className="add-contact" >
                    Add a book
                </Link>
{/*             <a onClick={() => setShowSearchpage(!showSearchPage)}>Add a book</a>
 */}          </div>
        </div>

            </div>

    }/>
    <Route exact path="/search" element={
          <div className="app">
        <div className="search-books">
          <div className="search-books-bar">
            <a href="/"
              className="close-search"
              onClick={clearQuery}
            >
              Close
            </a>
            <div className="search-books-input-wrapper">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN"
                value={query} onChange={(event) => updateQuery(event.target.value)}
              />
            </div>
          </div>
          <div className="search-books-results">
            <ListBooks books={showingBooks} onUpdateShelf={updateShelf}/>
         </div>
        </div>
        </div>
    }/>  
    </Routes>
    
/*     <div className="app">
      {showSearchPage ? (
        <div className="search-books">
          <div className="search-books-bar">
            <a
              className="close-search"
              onClick={clearQuery}
            >
              Close
            </a>
            <div className="search-books-input-wrapper">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN"
                value={query} onChange={(event) => updateQuery(event.target.value)}
              />
            </div>
          </div>
          <div className="search-books-results">
            <ListBooks books={showingBooks} onUpdateShelf={updateShelf}/>
         </div>
        </div>
      ) : (
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Currently Reading</h2>
                <div className="bookshelf-books">
                    <ListBooks books={books.filter((bk) => bk.shelf === "currentlyReading")} onUpdateShelf={updateShelf}/>


                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Want to Read</h2>
                <div className="bookshelf-books">
                  <ListBooks books={books.filter((bk) => bk.shelf === "wantToRead")} onUpdateShelf={updateShelf}/>
                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Read</h2>
                <div className="bookshelf-books">
                  <ListBooks books={books.filter((bk) => bk.shelf === "read")} onUpdateShelf={updateShelf}/>
                </div>
              </div>
            </div>
          </div>
          <div className="open-search">
            <a onClick={() => setShowSearchpage(!showSearchPage)}>Add a book</a>
          </div>
        </div>
      )}
    </div> */
  );
}

export default App;
