import type { Component } from 'solid-js'
import styles from './styles/App.module.css'
import Game from './components/Game';

const App: Component = () => {
  return (
    <div class={styles.main}>
      <Game/>
      <div class={styles.info}>
        <b>Steuerung</b>
        <br/>Rote Schlange über WASD
        <br/>Schwarze Schlange über die Pfeiltasten
      </div>
    </div>
  );
};

export default App;
