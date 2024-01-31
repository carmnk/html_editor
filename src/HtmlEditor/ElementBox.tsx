import {
  CSSProperties,
  HTMLProps,
  PropsWithChildren,
  MouseEvent,
  useMemo,
} from "react";
import { HtmlEditorElementType } from "./EditorState";
import { Box, useTheme } from "@mui/material";
import { useElementHover } from "../hooks/useElementHover";
import { EditorStateType } from "./EditorState";
import { getStylesFromClasses } from "./renderElements";
import { useNavigate } from "react-router-dom";

export type ElementBoxProps = {
  element: HtmlEditorElementType;
  editorState: EditorStateType;
  onSelectElement: (
    element: HtmlEditorElementType,
    isHovering: boolean
  ) => void;
  isProduction?: boolean;
};

const sx = {
  position: "relative",
};

export const ElementBox = (props: PropsWithChildren<ElementBoxProps>) => {
  const { element, children, onSelectElement, editorState, isProduction } =
    props;
  const theme = useTheme();
  const navigate = useNavigate();

  const { callbackRef: ref, isHovering } = useElementHover();

  const className =
    "attributes" in element ? element?.attributes?.className : undefined;
  const stylesFromClasses = getStylesFromClasses(
    className ?? "",
    editorState?.cssWorkspaces
  );

  const styles = useMemo(() => {
    const additionalHoverStyles =
      !isProduction &&
      (isHovering || editorState?.selectedHtmlElementName === element.id)
        ? {
            border:
              "1px " +
              (editorState?.selectedHtmlElementName === element.id
                ? "solid "
                : "dashed ") +
              theme.palette.primary.main,
            borderRadius: "1px",
            "& >div:first-of-type": {
              display: "block",
            },
            //   width: "calc(100% - 2px)",
          }
        : {};

    const styleAttributes =
      "attributes" in element ? element?.attributes?.style ?? {} : {};

    const aggregatedUserStyles = {
      ...stylesFromClasses,
      ...styleAttributes,
    };
    const userOverridesEditorHoverStyles: CSSProperties = {};
    if ("borderWidth" in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderWidth =
        aggregatedUserStyles.borderWidth + " !important";
    }
    if ("borderStyle" in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderStyle =
        aggregatedUserStyles.borderStyle + " !important";
    }
    if ("borderColor" in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderColor =
        aggregatedUserStyles.borderColor + " !important";
    }
    if ("borderRadius" in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderRadius =
        aggregatedUserStyles.borderRadius + " !important";
    }

    return {
      ...sx,
      ...stylesFromClasses,
      ...styleAttributes,
      ...additionalHoverStyles,
      ...userOverridesEditorHoverStyles,
      //   backgroundColor: "rgba(0,150,136,0.1)",
    } as CSSProperties;
  }, [
    isHovering,
    editorState?.selectedHtmlElementName,
    theme,
    stylesFromClasses,
    isProduction,
    element,
  ]);

  // useEffect(() => {
  //   onSelectElement(element, isHovering);
  // }, [isHovering, element, onSelectElement]);

  const isOverheadHtmlElement = ["html", "head", "body"].includes(element.type);
  const elementAttributs =
    "attributes" in element
      ? (element?.attributes as HTMLProps<HTMLLinkElement> & {
          href: string;
        })
      : ({} as HTMLProps<HTMLLinkElement>);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { style, href, ...styleLessAttributes } = elementAttributs;

  const boxProps = useMemo(
    () => ({
      // id: isOverheadHtmlElement ? element.type + "_" + element?.id : element.id,
      component: isOverheadHtmlElement
        ? ("div" as const)
        : (element.type as any),
      key: element.id,
      ...(styleLessAttributes ?? {}),
      sx: styles,
    }),
    [element, isOverheadHtmlElement, styles, styleLessAttributes]
  );

  const linkProps = useMemo(() => {
    if (element.type === "a") {
      return {
        onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          e.preventDefault();
          const attributes =
            element.attributes as HTMLProps<HTMLLinkElement> & {
              href: string;
            };
          if (attributes?.href?.startsWith("http")) {
            window.open(attributes?.href, "_blank");
          } else {
            navigate(attributes?.href ?? "");
          }
        },
      };
    }
    return {};
  }, [element, navigate]);

  const uiEditorHandlers = useMemo(() => {
    return {
      onClick: (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        onSelectElement(element, isHovering);
      },
    };
  }, [onSelectElement, element, isHovering]);

  return ["br", "hr", "img"].includes(element?.type) ? (
    <Box {...boxProps} {...linkProps} ref={ref} />
  ) : (
    <Box {...linkProps} {...boxProps} {...uiEditorHandlers} ref={ref}>
      {/* label */}
      {!isProduction && (
        <Box
          // onMouseOver={() => {}}
          // onMouseOut={() => {}}
          sx={{
            display: "none",
            position: "absolute",
            top: 0,
            right: 0,
            border: "1px solid rgba(0,150,136,0.5)",
            borderRadius: "1px",
            color: "text.primary",
          }}
        >
          {element.type}
        </Box>
      )}

      {("content" in element ? element?.content : children) || children}
    </Box>
  );
};
