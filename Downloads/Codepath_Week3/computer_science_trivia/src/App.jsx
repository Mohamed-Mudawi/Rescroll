import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [userGuess, setUserGuess] = useState("");
  const [notification, setNotification] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  let [cards, setCards] = useState([
    {question: "What does FAANG stand for?" ,answer: "Facebook, Apple, Amazon, Netflix, Google"},
    {question: "What is the most popular website to prepare for technical interviewing?" ,answer: "LeetCode"},
    {question: "What language is used for most technical interviews because of its easy syntax?" ,answer: "Python"},
    {question: "What does JSON stand for?" ,answer: "JavaScript Object Notation"},
    {question: "What does CI/CD stand for?" ,answer: "Continuous integration, continuous deployment"},
    {question: "What is used to communicate between the front end, and backend of a fullstack application?" ,answer: "An API (Application Programming Interface)"},
    {question: "What company owns the cloud platform called Azure?" ,answer: "Microsoft"},
    {question: "Where are tech giants like Apple or Google located?" ,answer: "California"},
    {question: "Is machine learning a subfield of artificial intelligence?" ,answer: "Yes"},
    {question: "What popular application do developers use to create and collaborate on their code?" ,answer: "GitHub"}
  ]);

  // Flip the current card
  const flipCurrentCard = () => {
    setIsFlipped(!isFlipped);
  }  

  // Shuffle card list
  const shuffleCards = () => {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]; 
    }
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }

  // Go backwards and forwards in card list
  const goBack = () => {
    if (currentCardIndex != 0) {
      setCurrentCardIndex(currentCardIndex-1);
    }
  }
  const goNext = () => {
    if (currentCardIndex != 9) {
      setCurrentCardIndex(currentCardIndex+1);
    }
  }

  // Check if the guess is right or wrong
  const checkAnswer = () => {
    let temp = userGuess.toLowerCase();
    let correctAnswer = cards[currentCardIndex].answer.toLowerCase();
    if (temp == correctAnswer){
    setNotification("Correct!");
    } else {
      setNotification("Incorrect. Try again.");
    }
    setTimeout(() => {
      setNotification("");
    }, 2000);
  }

  const handleGuessChange = (event) => {
    setUserGuess(event.target.value);
  };

  let cardText;
  if (isFlipped) {
    cardText = cards[currentCardIndex].answer;
  } else {
    cardText = cards[currentCardIndex].question;
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Tech G.O.A.T.s</h1>
        <h2>Want to go into Big Tech? Test your knowledge here!</h2>
        <p>Number of Cards: 10</p>
      </div>
      <div className="container">
        <div className="flashCard" onClick={flipCurrentCard}>
          {cardText}
        </div>
      </div>
      <div className="guess">
        <h3>Guess the answer here: </h3>
        <input type="text" onChange={handleGuessChange} value={userGuess}></input>
        <button onClick={checkAnswer}>Check Answer</button>
        {notification && <p className="notification">{notification}</p>}
      </div>
      <div className="back next">
        <button onClick={goBack}>Back</button>
        <button onClick={goNext}>Next</button>
      </div>
      <button onClick={shuffleCards}>Shuffle</button>
    </div>
  )
}

export default App
