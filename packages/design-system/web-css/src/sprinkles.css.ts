import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const colorProperties = defineProperties({
    properties: {
        color: {},
        backgroundColor: {}
    }
});

export const sprinkles = createSprinkles(colorProperties);

// It's a good idea to export the Sprinkles type too
export type Sprinkles = Parameters<typeof sprinkles>[0];
