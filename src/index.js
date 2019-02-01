import React from "react";
import ReactDOM from "react-dom";

import { styled } from "baseui";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";

const engine = new Styletron();

const GridHeader = styled("div");

class Calendar extends React.Component {
  render() {
    return (
      <Block
        fontFamily="Helvetica Neue"
        backgroundColor="white"
        display="grid"
        gridTemplateColumns="repeat(7, 120px)"
        gridTemplateRows="48px repeat(3, 120px)"
        alignItems="center"
        justifyItems="center"
      >
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <button class="grid__cell -first" />
        <button class="grid__cell" />
        <button class="grid__cell" />
        <button class="grid__cell" />
        <button class="grid__cell">$732</button>
        <button class="grid__cell" reset-date>
          $767
        </button>
        <button class="grid__cell">$811</button>
        <button class="grid__cell">$813</button>
        <button class="grid__cell">$758</button>
        <button class="grid__cell">$759</button>
        <button class="grid__cell">$763</button>
        <button class="grid__cell">$759</button>
        <button class="grid__cell">$788</button>
        <button class="grid__cell">$846</button>
        <button class="grid__cell">$821</button>
        <button class="grid__cell">$767</button>
        <button class="grid__cell">$764</button>
        <button class="grid__cell">$766</button>
        <button class="grid__cell" />
        <button class="grid__cell" />
        <button class="grid__cell" />
      </Block>
    );
  }
}

const App = () => (
  <Block
    width="100%"
    minHeight="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    backgroundColor="#FAFAFA"
  >
    <Calendar />
  </Block>
);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StyletronProvider value={engine}>
    <App />
  </StyletronProvider>,
  rootElement
);
