import logo from './logo.svg';
import './App.css';
import { Container } from './Container';
import { useState } from 'react';
import { ContainerV2 } from './ContainerV2';

const data = new Array(100_000).fill(null).map((_, index) => ({
  id:index,
  content: `Item ${index}`
}))

function App() {
  const [activeTab, setActiveTab] = useState(0)

  const changeActiveTab = () => {
    const newTab = Math.round(Math.random() * data.length) 
    setActiveTab(newTab)
  }
  return (
    <div className="App">
      <Container data={data} activeTabIndex={activeTab}/>
      {/* <ContainerV2 data={data} /> */}
      <button onClick={changeActiveTab} >Set new random active tab </button>
    </div>
  );
}

export default App;
