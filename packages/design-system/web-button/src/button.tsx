import React from "react";
import cx from "clsx";

import * as styles from "./button.css";

// ----------------------------------------------------------------
// ButtonContext
// ----------------------------------------------------------------
interface ButtonContextProps {
    variant: keyof typeof styles.buttonRootVariants;
}

const ButtonContext = React.createContext<ButtonContextProps>({
    variant: "primary"
});

const useButtonContext = () => {
    return React.useContext(ButtonContext);
};

// ----------------------------------------------------------------
// ButtonRoot
// ----------------------------------------------------------------
type ButtonRootElementRef = HTMLButtonElement;
type ButtonRootComponentProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

interface ButtonRootProps extends ButtonRootComponentProps {
    variant?: keyof typeof styles.buttonRootVariants;
}

const ButtonRoot = React.forwardRef<ButtonRootElementRef, ButtonRootProps>(
    ({ children, className, variant = "primary", ...props }, forwardedRef) => {
        return (
            <ButtonContext.Provider value={{ variant }}>
                <button
                    {...props}
                    className={cx(
                        className,
                        styles.buttonRootVariants[variant]
                    )}
                    ref={forwardedRef}
                >
                    {children}
                </button>
            </ButtonContext.Provider>
        );
    }
);

// ----------------------------------------------------------------
// ButtonText
// ----------------------------------------------------------------
type ButtonTextElementRef = HTMLSpanElement;
type ButtonTextComponentProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
>;

interface ButtonTextProps extends ButtonTextComponentProps {}

const ButtonText = React.forwardRef<ButtonTextElementRef, ButtonTextProps>(
    ({ children, className, ...props }, forwardedRef) => {
        const { variant } = useButtonContext();

        return (
            <span
                {...props}
                className={cx(className, styles.buttonTextVariants[variant])}
                ref={forwardedRef}
            >
                {children}
            </span>
        );
    }
);

export const Button = {
    Root: ButtonRoot,
    Text: ButtonText
};

export type { ButtonRootProps, ButtonTextProps };
