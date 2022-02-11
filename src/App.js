import logo from './logo.svg';
import './App.css';
import { useQuery } from "react-query"

const fetchCatFacts = async () => 
  await fetch("/facts")
      .then(response => response.json())
  // await fetch("https://cat-fact.herokuapp.com/facts")

export const useCatFacts = () => {
  const catfacts = useQuery('cats', fetchCatFacts)
  const facts = catfacts.data
    ?.map((x, idx) => <div key={idx}>{x.text}</div>)
    ?? []
  return {catfacts, facts}
}


function App() {
  const { catfacts, facts} = useCatFacts()
  if (catfacts.isLoading) {
    return <div>Loading... random cat nonsense</div>
  }

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React by becoming a cat
          </a>
          {facts}
        </header>
      </div>
  );
}

export default App;
