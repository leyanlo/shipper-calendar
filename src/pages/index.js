import {Block} from 'baseui/block';
import {
  Button,
  KIND,
  StyledBaseButton,
  StyledStartEnhancer,
} from 'baseui/button';
import {H6} from 'baseui/typography';
import {LightThemeMove, ThemeProvider, styled} from 'baseui';
import React from 'react';

const Main = styled('main', {
  fontFamily: 'UberMove-Regular',
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FAFAFA',
});

const Section = styled('section', ({$theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '760px',
  justifyContent: 'center',
  backgroundColor: $theme.colors.white,
  paddingTop: $theme.sizing.scale900,
  paddingRight: $theme.sizing.scale1200,
  paddingBottom: $theme.sizing.scale900,
  paddingLeft: $theme.sizing.scale1200,
  boxShadow: $theme.lighting.shadow700,
}));

const ResetButton = styled(StyledBaseButton, ({$theme, disabled}) => ({
  ...$theme.typography.font350,
  alignSelf: 'flex-end',
  ...(disabled ? {opacity: 0, pointerEvents: 'none'} : {}),
}));

const ResetButtonIcon = styled(StyledStartEnhancer, ({$theme}) => ({
  marginRight: $theme.sizing.scale0,
}));

const Grid = styled('div', ({$theme}) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gridTemplateRows: $theme.sizing.scale1200,
  alignItems: 'center',
  justifyItems: 'center',
  background: $theme.colors.white,
}));

const Day = styled('div', ({$theme}) => ({
  ...$theme.typography.font300,
  color: $theme.colors.mono600,
}));

const Date = styled('button', ({$date, $disabled, $style, $theme}) => ({
  ...$theme.typography.font450,
  color: $theme.colors.mono800,
  position: 'relative',
  width: '100%',
  height: '100%',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${$theme.colors.mono300}`,
  ...($disabled
    ? {}
    : {
        cursor: 'pointer',
        ...$style,
      }),
  ':focus': {outline: 'none'},
  '::before': {
    content: '""',
    display: 'inline-block',
    width: '1px',
    height: 0,
    paddingBottom: '100%',
  },
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
    dates: [
      {date: 'Jan 6'},
      {date: '7'},
      {date: '8', price: 1739, quintile: 1},
      {date: '9', price: 1771},
      {date: '10', price: 1729, quintile: 1},
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
    ],
    dateRanges: [2, 2],
    hovered: null,
    selected: [],
  };

  getDateRange = () => {
    const {dateRanges, selected} = this.state;
    return dateRanges[selected.length];
  };

  getDateAttributes = (d, i) => {
    const {hovered, selected} = this.state;

    const ret = {
      style: {},
    };

    // Process price
    if (!d.price) {
      ret.disabled = true;
      ret.style.color = LightThemeMove.colors.mono600;
      ret.style.backgroundColor = LightThemeMove.colors.mono200;
      return ret;
    }

    ret.children =
      d.price && `$${Math.floor(d.price / 1000)},${d.price % 1000}`;

    // Process quintile
    switch (d.quintile) {
      case 1:
        ret.style.backgroundColor = LightThemeMove.colors.primary50;
        break;
      case 2:
        ret.style.backgroundColor = LightThemeMove.colors.primary200;
        break;
      default:
        ret.style.backgroundColor = LightThemeMove.colors.white;
        break;
    }

    const dateRange = this.getDateRange();

    // Process selected
    if (selected.length) {
      if (i < selected[0].pickup) {
        ret.children = '';
        ret.disabled = true;
      }
      selected.forEach(({pickup, dropoff}) => {
        if (pickup === i) {
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
        } else if (pickup < i && (i < pickup + dateRange || i <= dropoff)) {
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
          ret.children = '';
        }
      });
    }

    // Process hovered
    if (hovered !== null) {
      if (hovered === i) {
        ret.style.backgroundColor = LightThemeMove.colors.primary;
        ret.style.color = LightThemeMove.colors.white;
      } else if (hovered < i && i < hovered + dateRange) {
        ret.style.backgroundColor = LightThemeMove.colors.primary;
        ret.style.color = LightThemeMove.colors.white;
      }
    }

    return ret;
  };

  getDate = (d, i) => {
    const dateAttributes = this.getDateAttributes(d, i);
    return (
      <Date
        $date={d.date}
        $disabled={dateAttributes.disabled}
        $style={dateAttributes.style}
        disabled={dateAttributes.disabled}
        key={i}
        onBlur={this.onHover(null)}
        onClick={this.onClickDate(i)}
        onFocus={this.onHover(i)}
        onMouseOut={this.onHover(null)}
        onMouseOver={this.onHover(i)}
      >
        {dateAttributes.children}
      </Date>
    );
  };

  onClickDate = (i) => () => {
    const {selected} = this.state;
    if (!selected.length) {
      this.setState({selected: [{pickup: i}]});
    } else {
      const lastSelected = selected[selected.length - 1];
      if (lastSelected.dropoff) {
        this.setState({selected: [...selected, {pickup: i}]});
      } else if (lastSelected.pickup + this.getDateRange() <= i) {
        this.setState({
          selected: [
            ...selected.slice(0, selected.length - 1),
            {pickup: lastSelected.pickup, dropoff: i},
          ],
        });
      }
    }
  };

  onClickReset = () => {
    this.setState({selected: []});
  };

  onHover = (i) => () => {
    this.setState({hovered: i});
  };

  render() {
    const {dates, selected} = this.state;
    return (
      <Section>
        <Block
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <H6 $as="span" color={LightThemeMove.colors.mono800}>
            Select shipment dates
          </H6>
          <Button
            disabled={!selected.length}
            kind={KIND.minimal}
            onClick={this.onClickReset}
            startEnhancer={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.66667 2C5.33333 2 2.66667 4.66667 2.66667 8C2.66667 8.13333 2.66667 8.26667 2.66667 8.33333L0 6.19999V8.73334L4 11.8667L8 8.73334V6.19999L4.73333 8.73334C4.66667 8.46667 4.66667 8.2 4.66667 7.93333C4.66667 5.73333 6.46667 3.93333 8.66667 3.93333C10.8667 3.93333 12.6667 5.73333 12.6667 7.93333C12.6667 10.1333 10.8667 11.9333 8.66667 11.9333V13.9333C12 13.9333 14.6667 11.2667 14.6667 7.93333C14.6667 4.6 12 2 8.66667 2Z"
                  fill="#276EF1"
                />
              </svg>
            }
            overrides={{
              BaseButton: ResetButton,
              StartEnhancer: ResetButtonIcon,
            }}
          >
            Reset Dates
          </Button>
        </Block>
        <Grid>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <Day key={i}>{day}</Day>
          ))}
          {dates.map(this.getDate)}
        </Grid>
      </Section>
    );
  }
}

export default () => (
  <ThemeProvider
    theme={{
      ...LightThemeMove,
      media: {
        tablet: '@media only screen and (min-width: 769px)',
      },
    }}
  >
    <Main>
      <Calendar />
    </Main>
  </ThemeProvider>
);
