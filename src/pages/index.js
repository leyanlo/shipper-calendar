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
  paddingRight: $theme.sizing.scale800,
  paddingBottom: $theme.sizing.scale900,
  paddingLeft: $theme.sizing.scale800,
  boxShadow: $theme.lighting.shadow700,
  [$theme.media.tablet]: {
    paddingRight: $theme.sizing.scale1200,
    paddingLeft: $theme.sizing.scale1200,
  },
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
  marginBottom: $theme.sizing.scale800,
}));

const Day = styled('div', ({$theme}) => ({
  ...$theme.typography.font300,
  color: $theme.colors.mono600,
}));

// From https://css-tricks.com/aspect-ratio-boxes/
export const AspectRatioBox = styled('div', () => ({
  width: '100%',
  position: 'relative',
  '::before': {
    content: '""',
    width: '1px',
    marginLeft: '-1px',
    float: 'left',
    height: 0,
    paddingTop: '100%',
  },
  '::after': {
    content: '""',
    display: 'table',
    clear: 'both',
  },
}));

const Date = styled('button', ({$date, $disabled, $price, $style, $theme}) => ({
  ...$theme.typography.font200,
  fontVariantNumeric: 'tabular-nums',
  color: $theme.colors.mono800,
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: 0,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  border: `1px solid ${$theme.colors.mono300}`,
  ...($disabled
    ? {}
    : {
        cursor: 'pointer',
        ...$style,
      }),
  ':focus': {outline: 'none'},
  [$theme.media.tablet]: {
    ...$theme.typography.font450,
    alignItems: 'center',
  },
  ...($price
    ? {
        '::before': {
          content: `"${$price}"`,
          position: 'absolute',
          bottom: $theme.sizing.scale200,
          [$theme.media.tablet]: {
            bottom: 'auto',
          },
        },
      }
    : {}),
  '::after': {
    ...$theme.typography.font350,
    content: `"${$date.content}"`,
    ...($date.color ? {color: $date.color} : {}),
    position: 'absolute',
    top: $theme.sizing.scale200,
    [$theme.media.tablet]: {
      ...$theme.typography.font300,
      right: $theme.sizing.scale200,
    },
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
    dateRange: 2,
    hovered: null,
    selected: [],
  };

  getDateAttributes = (d, i) => {
    const {dateRange, hovered, selected} = this.state;

    const ret = {
      date: {content: d.date},
      style: {},
    };

    // Process price
    if (!d.price) {
      ret.disabled = true;
      ret.style.color = LightThemeMove.colors.mono600;
      ret.style.backgroundColor = LightThemeMove.colors.mono200;
      return ret;
    }

    ret.price = `$${d.price}`;

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

    // Process selected
    if (selected.length) {
      if (i < selected[0].pickup) {
        ret.price = '';
        ret.style.backgroundColor = LightThemeMove.colors.white;
        ret.disabled = true;
      }
      selected.forEach(({pickup, dropoff}) => {
        if (pickup === i) {
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
        } else if (pickup < i && (i < pickup + dateRange || i <= dropoff)) {
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
          ret.price = '';
        }
      });
      const lastSelected = selected[selected.length - 1];
      if (!lastSelected.dropoff && i > lastSelected.pickup + dateRange - 1) {
        ret.price = `+$${150 * (i - lastSelected.pickup - dateRange + 1)}`;
        ret.style.color = LightThemeMove.colors.negative;
        ret.date.color = LightThemeMove.colors.mono800;
        ret.style.backgroundColor = LightThemeMove.colors.white;
      } else if (lastSelected.dropoff) {
        ret.disabled = true;
        if (i === lastSelected.pickup) {
          const newPrice =
            d.price + 150 * (1 + lastSelected.dropoff - i - dateRange);
          ret.price = `$${newPrice}`;
        } else if (i > lastSelected.dropoff) {
          ret.style.backgroundColor = LightThemeMove.colors.white;
          ret.price = '';
        }
      }
    }

    // Process hovered
    if (hovered !== null) {
      if (!selected.length) {
        if (hovered === i) {
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
        } else if (hovered < i && i < hovered + dateRange) {
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
          ret.price = '';
        }
      } else {
        const lastSelected = selected[selected.length - 1];
        if (!lastSelected.dropoff) {
          if (i === lastSelected.pickup && i + dateRange <= hovered) {
            const newPrice = d.price + 150 * (1 + hovered - i - dateRange);
            ret.price = `$${newPrice}`;
          } else if (i > lastSelected.pickup && i <= hovered) {
            ret.style.backgroundColor = LightThemeMove.colors.primary;
            ret.style.color = LightThemeMove.colors.white;
            ret.date.color = LightThemeMove.colors.white;
            ret.price = '';
          }
        }
      }
    }

    return ret;
  };

  getDate = (d, i) => {
    const dateAttributes = this.getDateAttributes(d, i);
    return (
      <AspectRatioBox>
        <Date
          $date={dateAttributes.date}
          $disabled={dateAttributes.disabled}
          $price={dateAttributes.price}
          $style={dateAttributes.style}
          disabled={dateAttributes.disabled}
          key={i}
          onBlur={this.onHover(null)}
          onClick={this.onClickDate(i)}
          onFocus={this.onHover(i)}
          onMouseOut={this.onHover(null)}
          onMouseOver={this.onHover(i)}
        />
      </AspectRatioBox>
    );
  };

  onClickDate = (i) => () => {
    const {dateRange, selected} = this.state;
    if (!selected.length) {
      this.setState({selected: [{pickup: i}]});
    } else {
      const lastSelected = selected[selected.length - 1];
      if (lastSelected.dropoff) {
        this.setState({selected: [...selected, {pickup: i}]});
      } else if (lastSelected.pickup + dateRange <= i) {
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
        <Button
          disabled={!selected[0] || !selected[0].dropoff}
          overrides={{
            BaseButton: ResetButton,
          }}
        >
          Review Shipment
        </Button>
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
