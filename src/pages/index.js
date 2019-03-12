import {Block} from 'baseui/block';
import {
  Button,
  KIND,
  StyledBaseButton,
  StyledStartEnhancer,
} from 'baseui/button';
import {Card} from 'baseui/card';
import {LightThemeMove, ThemeProvider, styled} from 'baseui';
import {Paragraph2} from 'baseui/typography';
import {mergeStyleOverrides} from 'baseui/helpers/overrides';
import React from 'react';
import extend from 'just-extend';

const FreightTheme = extend(true, LightThemeMove, {
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
});

const Main = styled('main', ({$theme}) => ({
  minHeight: 'calc(100vh - 113px)', // 113px for iPhone X toolbars
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [$theme.media.small]: {
    minHeight: '100vh',
  },
}));

const Title = styled('div', ({$theme}) => ({
  color: $theme.colors.black,
  fontFamily: 'UberMove-Medium',
  fontSize: $theme.typography.font450.fontSize,
  lineHeight: $theme.typography.font450.lineHeight,
  [$theme.media.small]: {
    fontSize: $theme.typography.font600.fontSize,
    lineHeight: $theme.typography.font600.lineHeight,
  },
}));

const ResetButton = styled(StyledBaseButton, ({$theme, disabled}) => ({
  ...$theme.typography.font350,
  ...(disabled ? {opacity: 0, pointerEvents: 'none'} : {}),
}));

const ReviewButton = styled(StyledBaseButton, ({$theme}) => ({
  ...$theme.typography.font350,
  marginLeft: $theme.sizing.scale800,
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
  borderBottom: `1px solid ${$theme.colors.mono400}`,
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
    display: 'none',
    [$theme.media.small]: {
      display: 'block',
    },
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

const Price = styled('span', ({$style, $theme}) =>
  mergeStyleOverrides(
    {
      pointerEvents: 'none',
      ...$theme.typography.font200,
      minHeight: $theme.typography.font300.lineHeight,
      [$theme.media.small]: {
        ...$theme.typography.font450,
        minHeight: $theme.typography.font500.lineHeight,
        fontVariantNumeric: 'tabular-nums',
      },
    },
    $style
  )
);

const B = styled('b', {fontFamily: 'UberMoveText-Bold'});

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
      price: {
        content: this.getDollarString(d.price),
        style: {},
      },
      date: {
        content: d.date.toLocaleDateString('en-US', {
          ...(!i || d.date.getDate() === 1 ? {month: 'short'} : {}),
          day: 'numeric',
        }),
        style: {color: FreightTheme.colors.black},
      },
      style: {},
    };

    // Process price
    if (!d.price) {
      ret.disabled = true;
      ret.style.color = FreightTheme.colors.mono600;
      ret.date.style.color = FreightTheme.colors.mono600;
    }

    // Process quintile
    switch (d.quintile) {
      case 1:
      case 2:
        ret.style.color = FreightTheme.colors.positive;
        break;
      default:
        ret.style.color = FreightTheme.colors.black;
    }

    // Process hovered
    if (hovered !== null) {
      if (hovered === i) {
        ret.style.backgroundColor = FreightTheme.colors.primary;
        ret.style.color = FreightTheme.colors.white;
        ret.style.borderTopLeftRadius = FreightTheme.sizing.scale300;
        ret.style.borderBottomLeftRadius = FreightTheme.sizing.scale300;
        ret.style['::before'] = {content: '"Pickup"'};
        ret.date.style.color = FreightTheme.colors.white;
        ret.price.style.fontSize = FreightTheme.typography.font300.fontSize;
        ret.price.style[FreightTheme.media.small] = {
          fontSize: FreightTheme.typography.font500.fontSize,
        };
      } else if (hovered < i) {
        if (i < hovered + dateRange - 1) {
          ret.price.content = '';
          ret.style.backgroundColor = FreightTheme.colors.primary50;
          ret.style.borderWidth = `${FreightTheme.sizing.scale0} 0`;
          ret.style.borderColor = FreightTheme.colors.primary;
          ret.date.style.color = FreightTheme.colors.mono700;
        } else if (i === hovered + dateRange - 1) {
          ret.price.content = '';
          ret.style.backgroundColor = FreightTheme.colors.primary;
          ret.style.color = FreightTheme.colors.white;
          ret.style.borderTopRightRadius = FreightTheme.sizing.scale300;
          ret.style.borderBottomRightRadius = FreightTheme.sizing.scale300;
          ret.date.style.color = FreightTheme.colors.white;
          ret.style['::before'] = {content: '"Dropoff"'};
        }
      }
    }

    return ret;
  };

  getDropoffDateAttributes = (d, i) => {
    const {dateRange, hovered, selected} = this.state;
    const {pickup, dropoff} = selected;

    const ret = {
      price: {
        content: this.getDollarString(d.price),
        style: {},
      },
      date: {
        content: d.date.toLocaleDateString('en-US', {
          ...(!i || d.date.getDate() === 1 ? {month: 'short'} : {}),
          day: 'numeric',
        }),
        style: {color: FreightTheme.colors.black},
      },
      style: {},
    };

    // Disable all except four options
    if (i < pickup + dateRange - 1 || i >= pickup + dateRange + 3) {
      ret.disabled = true;
    }

    // Process price
    if (!d.price) {
      ret.style.color = FreightTheme.colors.mono600;
      ret.date.style.color = FreightTheme.colors.mono600;
    }

    // Process selected
    if (i < pickup) {
      ret.price.content = '';
    } else if (i === pickup) {
      ret.style.backgroundColor = FreightTheme.colors.primary;
      ret.style.color = FreightTheme.colors.white;
      ret.style.borderTopLeftRadius = FreightTheme.sizing.scale300;
      ret.style.borderBottomLeftRadius = FreightTheme.sizing.scale300;
      ret.style['::before'] = {content: '"Pickup"'};
      ret.date.style.color = FreightTheme.colors.white;
      const newPrice = d.price + 150 * (1 + dropoff - i - dateRange);
      ret.price.content = this.getDollarString(newPrice);
      ret.price.style.fontSize = FreightTheme.typography.font300.fontSize;
      ret.price.style[FreightTheme.media.small] = {
        fontSize: FreightTheme.typography.font500.fontSize,
      };
    } else if (i < dropoff) {
      ret.price.content = '';
      ret.style.backgroundColor = FreightTheme.colors.primary50;
      ret.style.borderWidth = `${FreightTheme.sizing.scale0} 0`;
      ret.style.borderColor = FreightTheme.colors.primary;
      ret.style.color = FreightTheme.colors.mono700;
      ret.date.style.color = FreightTheme.colors.mono700;
    } else if (i === dropoff) {
      ret.price.content = '';
      ret.style.backgroundColor = FreightTheme.colors.primary;
      ret.style.color = FreightTheme.colors.white;
      ret.style.borderTopRightRadius = FreightTheme.sizing.scale300;
      ret.style.borderBottomRightRadius = FreightTheme.sizing.scale300;
      ret.date.style.color = FreightTheme.colors.white;
      ret.style['::before'] = {content: '"Dropoff"'};
    } else if (i > pickup + dateRange - 1 && i < pickup + dateRange + 3) {
      const priceDifference = 150 * (i - pickup - dateRange + 1);
      ret.price.content = this.getDollarString(priceDifference, '+');
      ret.style.color = FreightTheme.colors.negative;
      ret.date.style.color = FreightTheme.colors.black;
    } else {
      ret.price.content = '';
    }

    // Process hovered
    if (hovered !== null) {
      if (i === pickup) {
        // Update price
        const newPrice = d.price + 150 * (1 + hovered - dateRange - pickup);
        ret.price.content = this.getDollarString(newPrice);
      } else if (i > pickup && i < hovered) {
        ret.price.content = '';
        ret.style.backgroundColor = FreightTheme.colors.primary50;
        ret.style.borderWidth = `${FreightTheme.sizing.scale0} 0`;
        ret.style.borderColor = FreightTheme.colors.primary;
        ret.style.color = FreightTheme.colors.mono700;
        ret.date.style.color = FreightTheme.colors.mono700;
        ret.style.borderTopRightRadius = 0;
        ret.style.borderBottomRightRadius = 0;
        ret.style['::before'] = {content: '""'};
      } else if (i === hovered) {
        ret.price.content = '';
        ret.style.borderWidth = 0;
        ret.style.backgroundColor = FreightTheme.colors.primary;
        ret.style.color = FreightTheme.colors.white;
        ret.style.borderTopRightRadius = FreightTheme.sizing.scale300;
        ret.style.borderBottomRightRadius = FreightTheme.sizing.scale300;
        ret.date.style.color = FreightTheme.colors.white;
        ret.style['::before'] = {content: '"Dropoff"'};
      } else if (i > hovered && i < pickup + dateRange + 3) {
        const priceDifference = 150 * (i - pickup - dateRange + 1);
        ret.price.content = this.getDollarString(priceDifference, '+');
        ret.date.style.color = FreightTheme.colors.black;
        ret.style.backgroundColor = FreightTheme.colors.white;
        ret.style.borderWidth = 0;
        ret.style.color = FreightTheme.colors.negative;
        ret.style['::before'] = {content: '""'};
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
          <Price $style={dateAttributes.price.style}>
            {dateAttributes.price.content}
          </Price>
        </DateButton>
      </AspectRatioBox>
    );
  };

  onClickDate = (i) => () => {
    const {dateRange, selected} = this.state;
    if (!selected) {
      this.setState({
        hovered: null,
        selected: {pickup: i, dropoff: i + dateRange - 1},
      });
    } else {
      this.setState({hovered: null, selected: {...selected, dropoff: i}});
    }
  };

  onClickReset = () => {
    this.setState({hovered: null, selected: null});
  };

  onHover = (i) => () => {
    this.setState({hovered: i});
  };

  render() {
    const {dates, hovered, selected} = this.state;
    return (
      <Card
        overrides={{
          Root: {
            style: {
              width: '100%',
              maxWidth: '760px',
            },
          },
          Contents: {
            style: {
              [FreightTheme.media.small]: {
                margin: FreightTheme.sizing.scale900,
              },
            },
          },
        }}
      >
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
        <Block
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Paragraph2 $as="span">
            {selected ? (
              <>
                Shipment will be picked up{' '}
                <B>
                  {dates[selected.pickup].date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </B>{' '}
                and dropped off{' '}
                <B>
                  {dates[hovered || selected.dropoff].date.toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </B>
              </>
            ) : (
              ''
            )}
          </Paragraph2>
          <Button
            disabled={!selected}
            overrides={{
              BaseButton: ReviewButton,
            }}
            startEnhancer={<div />}
            endEnhancer={
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.65 9L11.775 15.75H9.15L13.275 10.125H1.5V7.875H13.275L9.15 2.25H11.775L16.65 9Z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            Review Shipment
          </Button>
        </Block>
      </Card>
    );
  }
}

export default () => (
  <ThemeProvider theme={FreightTheme}>
    <Main>
      <Calendar />
    </Main>
  </ThemeProvider>
);
