import {
  mdiRectangleOutline,
  mdiViewColumnOutline,
  mdiGridLarge,
  mdiFormatTextRotationNone,
  mdiEyeOff,
  mdiFormatFloatLeft,
  mdiViewAgendaOutline,
  mdiArrowUDownLeft,
  mdiAlignVerticalTop,
  mdiAlignVerticalBottom,
  mdiAlignVerticalCenter,
  mdiArrowExpandVertical,
  mdiAlignHorizontalLeft,
  mdiAlignHorizontalCenter,
  mdiAlignHorizontalRight,
  mdiArrowExpandHorizontal,
  mdiAnchor,
  mdiVectorPoint,
  mdiPercent,
  mdiArrowUpDown,
  mdiArrowLeftRight,
  mdiStickerCircleOutline,
  mdiAxis,
  mdiMoveResize,
  mdiArrowDown,
  mdiArrowExpandAll,
  mdiBorderRadius,
  mdiNumeric4BoxOutline,
  mdiClose,
  mdiFormatVerticalAlignCenter,
  mdiFormatText,
  mdiFormatBold,
} from '@mdi/js'
import { CSS_DISPLAY } from '../../defs/CssDisplayDict'
import { CSS_FLEX_DIRECTION } from '../../defs/CssFlexDirectionDict'
import { CSS_ALIGN, CSS_JUSTIFY } from '../../defs/CssAlignJustifyDict'

export const displayButtons = [
  { value: CSS_DISPLAY.Block, icon: mdiRectangleOutline, tooltip: 'Block' },
  { value: CSS_DISPLAY.Flex, icon: mdiViewColumnOutline, tooltip: 'Flexbox' },
  { value: CSS_DISPLAY.Grid, icon: mdiGridLarge, tooltip: 'Grid' },
  {
    value: CSS_DISPLAY.Inline,
    icon: mdiFormatTextRotationNone,
    tooltip: 'Inline',
  },
  { value: CSS_DISPLAY.None, icon: mdiEyeOff, tooltip: 'None' },
  null,
  { value: 'inline-', icon: mdiFormatFloatLeft, tooltip: 'Inline-' },
]

export const directionButtons = [
  {
    value: CSS_FLEX_DIRECTION.Row,
    icon: mdiViewColumnOutline,
    tooltip: 'Horizontal',
  },
  {
    value: CSS_FLEX_DIRECTION.Column,
    icon: mdiViewAgendaOutline,
    tooltip: 'Vertical',
  },
  null,
  { value: '-reverse', icon: mdiArrowUDownLeft, tooltip: 'Reverse' },
]

export const alignButtons = [
  { value: CSS_ALIGN.Start, icon: mdiAlignVerticalTop, tooltip: 'Start' },
  { value: CSS_ALIGN.End, icon: mdiAlignVerticalBottom, tooltip: 'End' },
  { value: CSS_ALIGN.Center, icon: mdiAlignVerticalCenter, tooltip: 'Center' },
  {
    value: CSS_ALIGN.Stretch,
    icon: mdiArrowExpandVertical,
    tooltip: 'Stretch',
  },
  {
    value: CSS_ALIGN.Baseline,
    icon: mdiFormatVerticalAlignCenter,
    tooltip: 'BaseLine',
  },
]

export const justifyButtons = [
  { value: CSS_JUSTIFY.Start, icon: mdiAlignHorizontalLeft, tooltip: 'Start' },
  {
    value: CSS_JUSTIFY.Center,
    icon: mdiAlignHorizontalCenter,
    tooltip: 'Center',
  },
  { value: CSS_JUSTIFY.End, icon: mdiAlignHorizontalRight, tooltip: 'End' },
  {
    value: CSS_JUSTIFY.Stretch,
    icon: mdiArrowExpandHorizontal,
    tooltip: 'Stretch',
  },
  // { value: CSS_JUSTIFY.SpaceBetween, icon: mdiHelp, tooltip: "Space Between" },
  // { value: CSS_JUSTIFY.SpaceAround, icon: mdiHelp, tooltip: "Space Around" },
  // { value: CSS_JUSTIFY.SpaceEvenly, icon: mdiHelp, tooltip: "Space Evenly" },
]

export const sizePreSelectButtons = [
  {
    value: 'px',
    icon: mdiVectorPoint,
    tooltip: 'pixel as specified',
  },
  {
    value: '%',
    icon: mdiPercent,
    tooltip: "percent of parent element's dimension",
  },
  {
    value: 'vh',
    icon: mdiArrowUpDown,
    tooltip: "percent of vertical viewport's dimension",
  },

  {
    value: 'vw',
    icon: mdiArrowLeftRight,
    tooltip: "percent of horizontal viewport's dimension",
  },
  //   {
  //     value: "vmin",
  //     icon: mdiArrowCollapse,
  //     tooltip: "percent of the smaller viewport dimension",
  //   },
  //   {
  //     value: "vmax",
  //     icon: mdiArrowTopRightBottomLeft,
  //     tooltip: "percent of the bigger viewport dimension",
  //   },
  null,
  {
    value: 'auto',
    icon: (
      <div style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>Auto</div>
    ),
    tooltip: 'default html element size',
  },
]

export const positionButtons = [
  {
    value: 'static',
    icon: mdiArrowDown,
    tooltip: 'Static',
  },
  {
    value: 'relative',
    icon: mdiMoveResize,
    tooltip: 'Relative',
  },
  {
    value: 'absolute',
    icon: mdiAxis,
    tooltip: 'Absolute',
  },
  { value: 'fixed', icon: mdiAnchor, tooltip: 'Fixed' },
  {
    value: 'sticky',
    icon: mdiStickerCircleOutline,
    tooltip: 'Sticky',
  },
]

export const borderRadiusCornerModeButtons = [
  {
    value: '1',
    icon: mdiBorderRadius,
    tooltip: 'All Corners',
  },
  {
    value: '2',
    icon: mdiArrowExpandAll,
    tooltip: 'FUTURE : Top Left and Bottom Right / Top Right and Bottom Left',
    disabled: true,
  },
  {
    value: '4',
    icon: mdiNumeric4BoxOutline,
    tooltip: 'FUTURE : all specific corners',
    disabled: true,
  },
  {
    value: '0',
    icon: mdiClose,
    tooltip: 'none',
  },
]

export const fontWeightButtons = [
  {
    value: 'normal',
    icon: mdiFormatText,
    tooltip: 'normal',
  },
  {
    value: 'bold',
    icon: mdiFormatBold,
    tooltip: 'bold',
    // disabled: false,
  },
]
