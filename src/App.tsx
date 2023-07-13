import type { Component } from 'solid-js'
import styles from './App.module.css'
import Game from './components/Game';

const App: Component = () => {
  return (
    <div>
      <div class={styles.game}>
        <div class="game-info">
          <h1>
            SNAKOW
          </h1>
          <div class="counter">

          </div>
        </div>
      </div>
      <div class="{styles.game-field}">
        <Game/>
      </div>
    </div>
  );
};

export default App;
