import { style, styleVariants } from "@vanilla-extract/css";

import { rootVars } from "@tallii/web-css";

const buttonRootBase = style({
    border: "none",
    boxSizing: "border-box",
    outline: "none",
    padding: 0,
    userSelect: "none",
    // @ts-ignore
    "-webkit-tap-highlight-color": `rgba(${rootVars.color.black}, 0)`
});

const primaryButtonRootBase = style({
    backgroundColor: `rgb(${rootVars.color.white})`,
    borderRadius: rootVars.borderRadius.xsmall,
    height: "42px",
    padding: `0 ${rootVars.space.p150}`,
    transition: `transform ${rootVars.motion.duration.fast} ease, box-shadow ${rootVars.motion.duration.fast} ease`,
    ":active": {
        transform: "scale(0.95)"
    }
});

export const buttonRootVariants = styleVariants({
    primary: [
        buttonRootBase,
        primaryButtonRootBase,
        {
            ":focus-visible": {
                boxShadow: `0px 3px 0px 0px rgba(${rootVars.color.black}, 0.3), 0px 0px 0px 5px rgb(${rootVars.color.brand})`
            },
            ":active": {
                boxShadow: `0px 0px 0px 1px rgba(${rootVars.color.black}, 0.3), 0px 0px 0px 3px rgb(${rootVars.color.brand})`
            }
        }
    ],
    primaryDanger: [
        buttonRootBase,
        primaryButtonRootBase,
        {
            boxShadow: `0px 4px 0px 0px rgb(${rootVars.color.danger})`,
            ":focus-visible": {
                boxShadow: `0px 3px 0px 0px rgba(${rootVars.color.black}, 0.3), 0px 0px 0px 5px rgb(${rootVars.color.danger})`
            },
            ":active": {
                boxShadow: `0px 0px 0px 1px rgba(${rootVars.color.black}, 0.3), 0px 0px 0px 3px rgb(${rootVars.color.danger})`
            }
        }
    ],
    secondary: [
        buttonRootBase,
        {
            backgroundColor: `rgb(${rootVars.color.grey400})`,
            borderRadius: rootVars.borderRadius.medium,
            boxShadow: `0px 4px 0px 0px rgb(${rootVars.color.grey100})`,
            height: "42px",
            padding: `0 ${rootVars.space.p150}`,
            transition: `transform ${rootVars.motion.duration.fast} ease, box-shadow ${rootVars.motion.duration.fast} ease`,
            ":focus-visible": {
                boxShadow: `0px 3px 0px 0px rgba(${rootVars.color.black}, 0.15), 0px 0px 0px 5px rgb(${rootVars.color.grey100})`
            },
            ":active": {
                boxShadow: `0px 0px 0px 1px rgba(${rootVars.color.black}, 0.5), 0px 0px 0px 3px rgb(${rootVars.color.grey100})`,
                transform: "scale(0.95)"
            }
        }
    ],
    text: [
        buttonRootBase,
        {
            backgroundColor: "transparent",
            display: "inline-block",
            marginTop: `${rootVars.space.p025}`,
            padding: `${rootVars.space.p05} ${rootVars.space.p05} ${rootVars.space.p025} ${rootVars.space.p05}`,
            transition: `transform ${rootVars.motion.duration.fast} ease`,
            ":active": {
                transform: "scale(0.95)"
            },
            "::after": {
                backgroundColor: "transparent",
                borderRadius: `${rootVars.borderRadius.xsmall}`,
                content: "''",
                display: "block",
                height: "4px",
                margin: "auto",
                transition: `width ${rootVars.motion.duration.regular} ease, background-color ${rootVars.motion.duration.regular} ease`,
                width: "0"
            },
            selectors: {
                ["&:focus-visible::after"]: {
                    backgroundColor: `rgb(${rootVars.color.brand})`,
                    width: "100%"
                },
                ["&:active::after"]: {
                    backgroundColor: `rgb(${rootVars.color.brand})`,
                    width: "100%"
                }
            }
        }
    ]
});

const buttonTextBase = style({
    boxSizing: "border-box",
    fontFamily: rootVars.font.family.body,
    fontWeight: rootVars.font.weight.bold,
    fontSize: rootVars.font.size.body,
    userSelect: "none"
});

export const buttonTextVariants = styleVariants({
    primary: [
        buttonTextBase,
        {
            color: `rgb(${rootVars.color.black})`
        }
    ],
    primaryDanger: [
        buttonTextBase,
        {
            color: `rgb(${rootVars.color.black})`
        }
    ],
    secondary: [
        buttonTextBase,
        {
            color: `rgb(${rootVars.color.white})`
        }
    ],
    text: [
        buttonTextBase,
        {
            color: `rgb(${rootVars.color.white})`
        }
    ]
});
