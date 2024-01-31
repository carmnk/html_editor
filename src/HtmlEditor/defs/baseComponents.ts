import {
  mdiButtonCursor,
  mdiDockBottom,
  mdiFormatListNumbered,
  mdiFormatText,
  mdiInformation,
  mdiRectangleOutline,
  mdiTab,
} from "@mdi/js";
import { Button } from "../../components/buttons/Button";
import { ButtonComponentPropsFormFactory } from "./baseComponentButton";
import { ChipComponentPropsFormFactory } from "./baseComponentChip";
import { TypographyComponentPropsFormFactory } from "./baseComponentTypography";
import { TabsComponentPropsFormFactory } from "./baseComponentTabs";
import { NavContainerComponentPropsFormFactory } from "./baseComponentNavContainer";
import { BottomNavigationComponentPropsFormFactory } from "./baseComponentBottomNavigation";
import { ListNavigationComponentPropsFormFactory } from "./baseComponentListNav";

export const baseComponents = [
  {
    type: "Button",
    component: Button,
    formGen: ButtonComponentPropsFormFactory,
    props: {
      type: "primary",
      label: "test2324r",
      disabled: false,
      loading: false,
      iconButton: false,
      size: "medium",
    },
    icon: mdiButtonCursor,
  },
  {
    type: "Chip",
    props: {
      label: "test",
      size: "medium",
      variant: "filled",
      color: "primary",
      clickable: false,
      disabled: false,
    },
    formGen: ChipComponentPropsFormFactory,
    icon: mdiInformation,
  },
  {
    type: "Typography",
    props: {
      children: "test",
      noWrap: false,
      align: "inherit",
      variant: "body1",
    },
    formGen: TypographyComponentPropsFormFactory,
    icon: mdiFormatText,
  },
  {
    type: "Tabs",
    props: {
      // children: "test",
      // noWrap: false,
      // align: "inherit",
      items: [{ value: "test", label: "test" }],
    },
    state: "test",
    formGen: TabsComponentPropsFormFactory,
    icon: mdiTab,
  },
  {
    type: "BottomNavigation",
    props: {
      // children: "test",
      // noWrap: false,
      // align: "inherit",
      items: [{ value: "test", label: "test" }],
    },
    state: "test",
    formGen: BottomNavigationComponentPropsFormFactory,
    icon: mdiDockBottom,
  },
  {
    type: "ListNavigation",
    props: {
      // children: "test",
      // noWrap: false,
      // align: "inherit",
      items: [{ value: "test", label: "test" }],
    },
    state: "test",
    formGen: ListNavigationComponentPropsFormFactory,
    icon: mdiFormatListNumbered,
  },
  {
    type: "NavContainer",
    props: {
      // children: "test",
      // noWrap: false,
      // align: "inherit",
      navigationElementId: null,
      children: [],
    },

    formGen: NavContainerComponentPropsFormFactory,
    icon: mdiRectangleOutline,
  },
];
