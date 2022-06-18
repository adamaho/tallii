import { createGlobalTheme } from "@vanilla-extract/css";

/**
 * Media Queries to be used in styles
 */
export const mediaQueries = {
    mobile: "screen and (max-width: 420px)",
    tablet: "screen and (max-width: 820px)"
};

/**
 * Define the entire color pallete in rgb triplet
 *
 * Why rgb triplets? Well, there are some cases where we need to control
 * the alpha of a background color. rgb triplets are the easiest way to support
 * that.
 */
const colors = {
    white: "255,255,255",
    black: "0,0,0",
    brand: "115,175,255",
    danger: "252,112,112",
    grey100: "74,74,74",
    grey400: "50,50,50",
    grey600: "82,82,91",
    grey700: "63,63,70",
    grey800: "39,39,42",
    grey900: "24,24,27"
} as const;

/**
 * Define all of the different border radius' to support
 */
const borderRadius = {
    xxsmall: "4px",
    xsmall: "8px",
    small: "10px",
    medium: "14px",
    large: "18px",
    xlarge: "22px",
    xxlarge: "26px"
} as const;

/**
 * Define all of the spaces
 */
const spaces = {
    p025: "4px",
    p05: "8px",
    p075: "12px",
    p100: "16px",
    p125: "20px",
    p150: "24px",
    p175: "28px",
    p200: "32px"
} as const;

/**
 * Define all of the motion duration values
 */
const motionDurations = {
    superFast: "0.1s",
    fast: "0.15s",
    regular: "0.2s",
    slow: "0.3s",
    superSlow: "0.35s"
};

/**
 * Define the font families
 */
const fontFamilies = {
    body: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`
};

/**
 * Define the font weights
 */
const fontWeights = {
    normal: "300",
    bold: "500",
    black: "700"
};

/**
 * Define the font sizes
 */
const fontSizes = {
    caption2: "10px",
    caption: "12px",
    callout: "14px",
    body: "16px",
    subheadline: "20px",
    headline: "24px",
    title3: "28px",
    title2: "32px",
    title1: "36px",
    largeTitle: "40px"
};

/**
 * Create a global theme of variables
 */
export const rootVars = createGlobalTheme(":root", {
    borderRadius: {
        ...borderRadius
    },
    color: {
        ...colors
    },
    font: {
        family: {
            ...fontFamilies
        },
        size: {
            ...fontSizes
        },
        weight: {
            ...fontWeights
        }
    },
    motion: {
        duration: {
            ...motionDurations
        }
    },
    space: {
        ...spaces
    }
});
