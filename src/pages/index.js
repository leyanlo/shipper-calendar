import {Block} from 'baseui/block';
import {
  Button,
  KIND,
  StyledBaseButton,
  StyledStartEnhancer,
} from 'baseui/button';
import {LightThemeMove, ThemeProvider, styled} from 'baseui';
import React from 'react';
import extend from 'just-extend';

const Main = styled('main', {
  fontFamily: 'UberMove-Regular',
  width: '100%',
  minHeight: 'calc(100vh - 113px)', // 113px for iPhone X toolbars
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  [$theme.media.small]: {
    paddingRight: $theme.sizing.scale1200,
    paddingLeft: $theme.sizing.scale1200,
  },
}));

const Title = styled('div', ({$theme}) => ({
  ...$theme.typography.font450,
  [$theme.media.small]: {
    ...$theme.typography.font600.fontSize,
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
  gridTemplateRows: $theme.sizing.scale900,
  alignItems: 'center',
  justifyItems: 'center',
  backgroundColor: $theme.colors.white,
  marginBottom: $theme.sizing.scale800,
}));

const Day = styled('div', ({$theme}) => ({
  ...$theme.typography.font350,
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
    pointerEvents: 'none',
  },
  '::after': {
    content: '""',
    display: 'table',
    clear: 'both',
  },
}));

const DateButton = styled('button', ({$disabled, $style, $theme}) => ({
  color: $theme.colors.mono800,
  backgroundColor: $theme.colors.white,
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 0,
  ...($disabled
    ? {}
    : {
        cursor: 'pointer',
        ...$style,
      }),
  ':focus': {
    outline: 'none',
  },
  '::before': {
    position: 'absolute',
    top: $theme.sizing.scale400,
    color: $theme.colors.white,
    ...$theme.typography.font350,
  },
}));

const DateSpan = styled('span', ({$style, $theme}) => ({
  pointerEvents: 'none',
  ...$theme.typography.font350,
  [$theme.media.small]: {
    ...$theme.typography.font500,
  },
  ...$style,
}));

const Price = styled('span', ({$theme}) => ({
  ...$theme.typography.font200,
  minHeight: $theme.typography.font200.lineHeight,
  [$theme.media.small]: {
    ...$theme.typography.font450,
    minHeight: $theme.typography.font450.lineHeight,
    fontVariantNumeric: 'tabular-nums',
  },
}));

class Calendar extends React.PureComponent {
  constructor(props) {
    super(props);

    const prices = [
      {price: 1739, quintile: 1},
      {price: 1771},
      {price: 1729, quintile: 1},
      {price: 1781},
      {price: 1772},
      {price: 1779},
      {price: 1783},
      {price: 1790},
      {price: 1789},
      {price: 1747, quintile: 2},
      {price: 1792},
      {price: 1786},
      {price: 1792},
      {price: 1798},
    ];
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const lastSunday = this.getLastSunday();
    const dates = Array.from(Array(28).keys()).map((i) => {
      const date = new Date(lastSunday);
      date.setDate(date.getDate() + i);
      const dateDelta = parseInt((date - today) / (24 * 3600 * 1000), 10);
      return {date, ...prices[dateDelta]};
    });

    this.state = {
      dates,
      dateRange: 5,
      hovered: null,
      selected: null,
    };
  }

  getLastSunday = () => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(12, 0, 0, 0);
    return d;
  };

  getDollarString = (dollars, prefix) =>
    (dollars &&
      [
        prefix || '',
        '$',
        ...dollars
          .toString()
          .split('')
          .map((char, i, splitted) =>
            i && (splitted.length - i) % 3 === 0 ? `,${char}` : char
          ),
      ].join('')) ||
    '';

  getPricingDateAttributes = (d, i) => {
    const {dateRange, hovered} = this.state;

    const ret = {
      price: this.getDollarString(d.price),
      date: {
        content: d.date.toLocaleDateString('en-US', {
          ...(!i || d.date.getDate() === 1 ? {month: 'short'} : {}),
          day: 'numeric',
        }),
        style: {color: LightThemeMove.colors.black},
      },
      style: {},
    };

    // Process price
    if (!d.price) {
      ret.disabled = true;
      ret.style.color = LightThemeMove.colors.mono600;
      ret.date.style.color = LightThemeMove.colors.mono600;
    }

    // Process quintile
    switch (d.quintile) {
      case 1:
      case 2:
        ret.style.color = LightThemeMove.colors.positive;
        break;
      default:
        ret.style.color = LightThemeMove.colors.black;
    }

    // Process hovered
    if (hovered !== null) {
      if (hovered === i) {
        ret.style.backgroundColor = LightThemeMove.colors.primary;
        ret.style.color = LightThemeMove.colors.white;
        ret.style.borderTopLeftRadius = LightThemeMove.sizing.scale300;
        ret.style.borderBottomLeftRadius = LightThemeMove.sizing.scale300;
        ret.style['::before'] = {content: '"Pickup"'};
        ret.date.style.color = LightThemeMove.colors.white;
      } else if (hovered < i) {
        if (i < hovered + dateRange - 1) {
          ret.price = '';
          ret.style.backgroundColor = LightThemeMove.colors.primary50;
          ret.style.borderWidth = `${LightThemeMove.sizing.scale0} 0`;
          ret.style.borderColor = LightThemeMove.colors.primary;
          ret.date.style.color = LightThemeMove.colors.mono700;
        } else if (i === hovered + dateRange - 1) {
          ret.price = '';
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
          ret.style.borderTopRightRadius = LightThemeMove.sizing.scale300;
          ret.style.borderBottomRightRadius = LightThemeMove.sizing.scale300;
          ret.date.style.color = LightThemeMove.colors.white;
          ret.style['::before'] = {content: '"Dropoff"'};
        }
      }
    }

    return ret;
  };

  getDropoffDateAttributes = (d, i) => {
    const {dateRange, hovered, selected} = this.state;

    const ret = {
      price: this.getDollarString(d.price),
      date: {
        content: d.date.toLocaleDateString('en-US', {
          ...(!i || d.date.getDate() === 1 ? {month: 'short'} : {}),
          day: 'numeric',
        }),
      },
      style: {},
    };

    // Process price
    if (!d.price) {
      ret.disabled = true;
      ret.style.color = LightThemeMove.colors.mono600;
      ret.style.backgroundColor = LightThemeMove.colors.mono200;
    }

    // Process quintile
    switch (d.quintile) {
      case 1:
        ret.style.backgroundColor = LightThemeMove.colors.primary50;
        break;
      case 2:
        ret.style.backgroundColor = LightThemeMove.colors.primary200;
        break;
      default:
    }

    // Process selected
    if (d.price) {
      const {pickup, dropoff} = selected;
      if (i < pickup) {
        ret.price = '';
        ret.style.backgroundColor = LightThemeMove.colors.white;
        ret.disabled = true;
      } else if (i === pickup) {
        ret.style.backgroundColor = LightThemeMove.colors.primary;
        ret.style.color = LightThemeMove.colors.white;
      } else if (i < pickup + dateRange || i <= dropoff) {
        ret.style.backgroundColor = LightThemeMove.colors.primary200;
        ret.style.color = LightThemeMove.colors.white;
        ret.price = '';
      } else if (!selected.dropoff && i > selected.pickup + dateRange - 1) {
        const priceDifference = 150 * (i - selected.pickup - dateRange + 1);
        ret.price = this.getDollarString(priceDifference, '+');
        ret.style.color = LightThemeMove.colors.negative;
        ret.date.style = {color: LightThemeMove.colors.mono800};
        ret.style.backgroundColor = LightThemeMove.colors.white;
      }

      if (selected.dropoff) {
        ret.disabled = true;
        if (i === selected.pickup) {
          const newPrice =
            d.price + 150 * (1 + selected.dropoff - i - dateRange);
          ret.price = this.getDollarString(newPrice);
        } else if (i > selected.dropoff) {
          ret.style.backgroundColor = LightThemeMove.colors.white;
          ret.price = '';
        }
      }
    }

    // Process hovered
    if (hovered !== null) {
      if (!selected) {
        if (hovered === i) {
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
        } else if (hovered < i && i < hovered + dateRange) {
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
          ret.price = '';
        }
      } else if (!selected.dropoff) {
        if (i === selected.pickup && hovered >= selected.pickup + dateRange) {
          const newPrice =
            d.price + 150 * (1 + hovered - dateRange - selected.pickup);
          ret.price = this.getDollarString(newPrice);
        } else if (i > selected.pickup && i <= hovered) {
          ret.style.backgroundColor = LightThemeMove.colors.primary;
          ret.style.color = LightThemeMove.colors.white;
          ret.date.style = {color: LightThemeMove.colors.white};
          ret.price = '';
        }
      }
    }

    return ret;
  };

  getDate = (d, i) => {
    const {selected} = this.state;
    const dateAttributes = selected
      ? this.getDropoffDateAttributes(d, i)
      : this.getPricingDateAttributes(d, i);
    return (
      <AspectRatioBox key={`date-${i}`}>
        <DateButton
          $disabled={dateAttributes.disabled}
          $style={dateAttributes.style}
          disabled={dateAttributes.disabled}
          onBlur={this.onHover(null)}
          onClick={this.onClickDate(i)}
          onFocus={this.onHover(i)}
          onMouseOut={this.onHover(null)}
          onMouseOver={this.onHover(i)}
        >
          <DateSpan $style={dateAttributes.date.style}>
            {dateAttributes.date.content}
          </DateSpan>
          <Price>{dateAttributes.price}</Price>
        </DateButton>
      </AspectRatioBox>
    );
  };

  onClickDate = (i) => () => {
    const {dateRange, selected} = this.state;
    if (!selected) {
      this.setState({selected: {pickup: i, dropoff: i + dateRange - 1}});
    } else if (i >= selected.pickup + dateRange - 1) {
      this.setState({selected: {...selected, dropoff: i}});
    }
  };

  onClickReset = () => {
    this.setState({hovered: null, selected: null});
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
          marginBottom="scale600"
        >
          <Title>Select shipment dates</Title>
          <Button
            disabled={!selected}
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
            <Day key={`day-${i}`}>{day}</Day>
          ))}
          {dates.map(this.getDate)}
        </Grid>
        <Button
          disabled={!selected || !selected.dropoff}
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
    theme={extend(true, LightThemeMove, {
      breakpoints: {small: 769},
      media: {small: '@media only screen and (min-width: 769px)'},
      typography: {
        font250: {fontFamily: 'UberMoveText-Medium'},
        font350: {fontFamily: 'UberMoveText-Medium'},
        font450: {fontFamily: 'UberMoveText-Medium'},
        font500: {fontFamily: 'UberMoveText-Medium'},
        font600: {fontFamily: 'UberMoveText-Medium'},
        font700: {fontFamily: 'UberMoveText-Medium'},
        font800: {fontFamily: 'UberMoveText-Medium'},
        font900: {fontFamily: 'UberMoveText-Medium'},
      },
    })}
  >
    <Main>
      <Calendar />
    </Main>
  </ThemeProvider>
);
