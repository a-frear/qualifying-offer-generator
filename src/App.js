import './App.css';
import { useState } from 'react';

function App() {
  const [ offer, setOffer] = useState()

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

  //this resource helped me figure out how to deal with an html response: https://gomakethings.com/getting-html-with-fetch-in-vanilla-js/
  const generateOffer = () => {
    fetch(`https://arcane-spire-61626.herokuapp.com/`)
      .then(function (response) {
        return response.text();
      }).then(function (html) {
        // Convert the HTML string into a document object
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        //convert all .player-salary elements into integers
        const htmlTable = doc.querySelectorAll('.player-salary');
        let salaries = []
        for (let i=0; i < htmlTable.length; i++) {
          let salaryString = htmlTable[i].innerText
          let salaryInt = parseInt(salaryString.replace(/\D/g, ''))
          if (Number.isInteger(salaryInt)) {
          salaries.push(salaryInt)
          }
         }

         //find average of top 125 salaries
        let top125 = salaries.sort(function(a, b){return b - a}).slice(0, 125);
        let total = 0
        for (let i=0; i<top125.length; i++) {
          total += top125[i]
        }
        const avg = total/125
        setOffer(formatter.format(avg))
      }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Qualifying Offer Generator</h1>
      </header>
      <button onClick={generateOffer}>Generate</button>
      <p className='offer'>{offer}</p>
    </div>
  );
}

export default App;
