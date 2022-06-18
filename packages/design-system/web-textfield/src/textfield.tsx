import React from "react";
import cx from "clsx";

import * as styles from "./textfield.css";

// ----------------------------------------------------------------
// TextFieldRoot
// ----------------------------------------------------------------
type TextFieldRootElementRef = HTMLDivElement;
type TextFieldRootComponentProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

interface TextFieldRootProps extends TextFieldRootComponentProps {}

const TextFieldRoot = React.forwardRef<
    TextFieldRootElementRef,
    TextFieldRootProps
>(({ children, ...props }, forwardedRef) => {
    return (
        <div {...props} ref={forwardedRef}>
            {children}
        </div>
    );
});

export const TextField = {
    Root: TextFieldRoot
};

export type { TextFieldRootProps };
