import { CSSProperties, ReactNode } from "react";

import {
  BorderValue,
  BlocksRadiusType,
  ResponsiveProp,
  BlocksSpaceType,
  ValueOf,
  BlocksGapType,
} from "../Blocks.types";
import { FlattenSimpleInterpolation } from "styled-components";
import { TextColors, ThemeColors } from "../theme/Theme.types";

export type BoxResponsiveProps = {
  /* Sets align-items css property */
  alignItems?: ResponsiveProp<CSSProperties["alignItems"]>;
  /* Sets align-self css property */
  alignSelf?: ResponsiveProp<CSSProperties["alignSelf"]>;
  /* Sets flex-direction css property */
  flexDirection?: ResponsiveProp<CSSProperties["flexDirection"]>;
  /* Sets gap between the elements */
  gap?: ResponsiveProp<BlocksGapType>;
  /* Sets display css property */
  display?: ResponsiveProp<CSSProperties["display"]>;
  /* Sets height css property */
  height?: ResponsiveProp<string>;
  /* Sets justify-content css property */
  justifyContent?: ResponsiveProp<CSSProperties["justifyContent"]>;
  /* Sets margin css property */
  margin?: ResponsiveProp<BlocksSpaceType>;
  /* Sets max-height css property */
  maxHeight?: ResponsiveProp<string>;
  /* Sets min-height css property */
  minHeight?: ResponsiveProp<string>;
  /* Sets max-width css property */
  maxWidth?: ResponsiveProp<string>;
  /* Sets min-width css property */
  minWidth?: ResponsiveProp<string>;
  /* Sets padding css property */
  padding?: ResponsiveProp<BlocksSpaceType>;
  /* Sets text-align css property */
  textAlign?: ResponsiveProp<CSSProperties["textAlign"]>;
  /* Sets width css property */
  width?: ResponsiveProp<string>;
};

export type BoxNonResponsiveProps = {
  /* Sets border css property */
  border?: BorderValue;
  /* Sets border-radius css property */
  borderRadius?: BlocksRadiusType;
  /* Sets background-color css property */
  backgroundColor?: ThemeColors;
  /* Sets color css property */
  color?: TextColors;
  /* Sets cursor css property */
  cursor?: CSSProperties["cursor"];
  /* Sets position css property */
  position?: CSSProperties["position"];
  /* Sets box-shadow css property */
  boxShadow?: string;
  /* Sets overflow css property */
  overflow?: CSSProperties["overflow"];
};

export type BoxCSSProps = BoxResponsiveProps & BoxNonResponsiveProps;

type BoxHTMLTags = "div" | "span";

export type BoxComponentProps = {
  /* Decides which HTML tag to render inside Box */
  as?: BoxHTMLTags;
  /* Additional prop from styled components to apply custom css to Box */
  css?: FlattenSimpleInterpolation;
  /* Child react nodes rendered by Box */
  children?: ReactNode;
  // option to add custom scroll bar to box
  customScrollbar?: boolean;
};

export type BoxResponsiveCSSProperties =
  | "align-items"
  | "align-self"
  | "display"
  | "flex-direction"
  | "gap"
  | "height"
  | "justify-content"
  | "margin"
  | "max-height"
  | "min-height"
  | "max-width"
  | "min-width"
  | "padding"
  | "text-align"
  | "width";

export type BoxResponsivePropValues = ValueOf<BoxResponsiveProps>;

export type BoxResponsiveCSSPropertiesData = {
  propName: BoxResponsiveCSSProperties;
  prop: BoxResponsivePropValues;
};
