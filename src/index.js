import * as React from 'react';
import {Block} from 'baseui/block';
import {LightThemeMove, ThemeProvider, styled} from 'baseui';
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import ReactDOM from 'react-dom';

const engine = new Styletron();

const Main = styled('main', {
  fontFamily: 'UberMove-Regular',
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ResetButton = styled('button', ({$show}) => ({
  alignSelf: 'flex-end',
  ...($show ? {} : {opacity: 0}),
}));

const Grid = styled('div', ({$theme}) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 120px)',
  gridTemplateRows: `${$theme.sizing.scale1200} repeat(3, 120px)`,
  alignItems: 'center',
  justifyItems: 'center',
  background: $theme.colors.white,
}));

const Day = styled('div', ({$theme}) => ({
  ...$theme.typography.font300,
  color: $theme.colors.mono600,
}));

const quintileStyles = {
  [-1]: {
    color: 'white',
    backgroundColor: 'rgb(39,110,241)',
  },
  1: {backgroundColor: 'rgba(39,110,241,0.44)'},
  2: {backgroundColor: 'rgba(39,110,241,0.08)'},
};

const Date = styled('button', ({$date, $disabled, $quintile, $theme}) => ({
  ...$theme.typography.font450,
  color: $theme.colors.mono800,
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: `1px solid ${$theme.colors.mono300}`,
  ...(quintileStyles[$quintile] || {}),
  ...($disabled
    ? {color: $theme.colors.mono600, backgroundColor: $theme.colors.mono200}
    : {}),
  '::after': {
    ...$theme.typography.font300,
    content: `"${$date}"`,
    position: 'absolute',
    top: '7px',
    right: '7px',
  },
}));

class Calendar extends React.PureComponent {
  state = {
    selected: -1,
  };

  onClickDate = ({currentTarget}) => {
    const i = parseInt(currentTarget.getAttribute('i'), 10);
    if (this.state.selected !== i) {
      this.setState({selected: i});
    } else {
      this.setState({selected: -1});
    }
  };

  onClickReset = () => {
    this.setState({selected: -1});
  };

  render = () => (
    <Block display="flex" flexDirection="column">
      <ResetButton
        $show={this.state.selected !== -1}
        type="button"
        onClick={this.onClickReset}
      >
        Reset Dates
      </ResetButton>
      <Grid>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <Day key={i}>{day}</Day>
        ))}
        {[
          {date: 'Jan 6'},
          {date: '7'},
          {date: '8', price: 1739, quintile: 1},
          {date: '9', price: 1771},
          {date: '10', price: 1729, quintile: -1},
          {date: '11', price: 1781},
          {date: '12', price: 1772},
          {date: '13', price: 1779},
          {date: '14', price: 1783},
          {date: '15', price: 1790},
          {date: '16', price: 1789},
          {date: '17', price: 1747, quintile: 2},
          {date: '18', price: 1792},
          {date: '19', price: 1786},
          {date: '20', price: 1792},
          {date: '21', price: 1798},
          {date: '22'},
          {date: '23'},
          {date: '24'},
          {date: '25'},
          {date: '26'},
        ].map((d, i) => (
          <Date
            $date={d.date}
            $disabled={!d.price}
            $quintile={d.quintile}
            i={i}
            key={i}
            onClick={this.onClickDate}
          >
            {d.price && `$${Math.floor(d.price / 1000)},${d.price % 1000}`}
          </Date>
        ))}
      </Grid>
    </Block>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(
  <StyletronProvider value={engine}>
    <ThemeProvider theme={LightThemeMove}>
      <Main>
        <Calendar />
      </Main>
    </ThemeProvider>
  </StyletronProvider>,
  rootElement
);
