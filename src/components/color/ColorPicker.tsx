"use strict";

import { Box, Popover, hexToRgb, useTheme } from "@mui/material";
import React, { CSSProperties, useEffect } from "react";
import { SketchPicker } from "react-color";
import { Button } from "../buttons/Button/Button";
import { mdiCheck } from "@mdi/js";

type GenericColorPickerProps = {
  value: CSSProperties["color"];
  defaultValue?: string;
  selectorSize?: string | number;
};
type DisabledColorPickerProps = GenericColorPickerProps & {
  disabled: true;
  onChange?: (color: string) => void;
};

type EnabledColorPickerProps = GenericColorPickerProps & {
  disabled?: false;
  onChange: (color: string) => void;
};

export type ColorPickerProps =
  | EnabledColorPickerProps
  | DisabledColorPickerProps;

// export type ColorPickerProps = {
//   value: CSSProperties["color"];
//   defaultValue?: string;
//   onChange: (color: string) => void;
//   selectorSize?: string | number;
// };

const simplifiedRgbaRegex =
  /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
const simplifiedHexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const simplifiedHexARegex = /^#(?:[0-9a-fA-F]{3,4}){1,2}$/;

export const rgbaToObj = (rgbaString?: string, defaultRgbaStr?: string) => {
  const colorParts =
    rgbaString
      ?.match(/rgba*\((.*)\)/)?.[1]
      ?.split(",")
      ?.map((val: string) => val?.trim?.()) ?? [];
  const defaultColor: any = defaultRgbaStr
    ? rgbaToObj(defaultRgbaStr)
    : { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: parseInt(colorParts?.[0] ?? defaultColor),
    g: parseInt(colorParts?.[1] ?? defaultColor),
    b: parseInt(colorParts?.[2] ?? defaultColor),
    a: rgbaString?.match(/rgba\((.*)\)/) ? colorParts?.[3] ?? defaultColor : 1,
  };
};

const extractRgbaValuesFromString = (rgba: string) => {
  return rgba.replaceAll(/^(?:\d+(?:,\d+)*,?)?$/, "")?.split(",");
};

export const ColorPicker = (props: ColorPickerProps) => {
  const { value, onChange, defaultValue, disabled, selectorSize = 28 } = props;
  const theme = useTheme();
  const [color, setColor] = React.useState(rgbaToObj(value, defaultValue));
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

  const handleToggleColorPicker = React.useCallback(() => {
    if (disabled) return;
    setDisplayColorPicker((current) => !current);
  }, [disabled]);

  const handleChangeColor = React.useCallback((color: any) => {
    setColor(color.rgb);
  }, []);

  const handleTakeover = React.useCallback(() => {
    const defaultObjectColor =
      "r" in color
        ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        : null;
    const colorAdj =
      typeof color === "string"
        ? simplifiedRgbaRegex.test(color)
          ? color
          : simplifiedHexRegex.test(color)
          ? hexToRgb(color)
          : defaultObjectColor
        : defaultObjectColor;
    if (!colorAdj) return;
    // const colorCss = `rgba(${color?.r ?? 0}, ${color?.g ?? 0}, ${
    //   color?.b ?? 0
    // }, ${color?.a ?? 1})`;
    onChange?.(colorAdj);
  }, [onChange, color]);

  const indicatorRef = React.useRef<HTMLDivElement>(null);
  //   const styles = React.useMemo(() => makeStyles/;(rgbaToObj(value)), [value]);

  // EFFECTS

  useEffect(() => {
    const colorAdj =
      typeof value === "string"
        ? simplifiedRgbaRegex.test(value)
          ? value
          : simplifiedHexRegex.test(value) || simplifiedHexARegex.test(value)
          ? hexToRgb(value)
          : value
        : value;

    const colorObj = rgbaToObj(colorAdj, defaultValue);
    setColor(colorObj);
  }, [value, defaultValue]);

  return (
    <div style={{ height: selectorSize, width: selectorSize }}>
      <Box
        sx={{
          width: selectorSize,
          boxSizing: "border-box",
          height: selectorSize,
          padding: "4px",

          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: disabled ? undefined : "pointer",
        }}
        onClick={handleToggleColorPicker}
        ref={indicatorRef}
      >
        <Box
          sx={{
            width: selectorSize,
            borderRadius: "2px",
            border: "1px solid " + theme.palette.divider,
            height: selectorSize,
            backgroundColor:
              "r" in color
                ? `rgba(${color?.r ?? 0}, ${color?.g ?? 0}, ${color?.b ?? 0}, ${
                    color?.a ?? 1
                  })`
                : "#fff",
          }}
        />
      </Box>
      {displayColorPicker ? (
        // <Dialog open={displayColorPicker} onClose={handleToggleColorPicker}>

        <Popover
          anchorEl={indicatorRef.current}
          open={displayColorPicker}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          onClose={handleToggleColorPicker}
        >
          <div onClick={handleToggleColorPicker} />
          <SketchPicker color={color as any} onChange={handleChangeColor} />
          <Box position="absolute" bottom={4} right={4}>
            <Button
              iconButton={true}
              icon={mdiCheck}
              onClick={handleTakeover}
            />
          </Box>
        </Popover>
      ) : null}
    </div>
  );
};
