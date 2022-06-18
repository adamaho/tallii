import { style } from "@vanilla-extract/css";

import { rootVars } from "@tallii/web-css";

export const app = style({
    backgroundColor: `rgb(${rootVars.color.grey900})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    minHeight: "100vh",
    padding: rootVars.space.p200,
    position: "relative"
});

export const dialog = style({
    backgroundColor: `rgb(${rootVars.color.grey800})`,
    borderRadius: "14px",
    padding: "24px"
});

export const dialogTitle = style({
    color: `rgb(${rootVars.color.white})`,
    fontSize: rootVars.font.size.title3,
    fontWeight: rootVars.font.weight.black,
    margin: 0
});

export const dialogDescription = style({
    color: `rgb(${rootVars.color.white})`,
    fontSize: rootVars.font.size.body,
    margin: 0,
    marginTop: rootVars.space.p05
});

export const dialogFooter = style({
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: rootVars.space.p100,
    justifyContent: "flex-end",
    marginTop: rootVars.space.p100
});
