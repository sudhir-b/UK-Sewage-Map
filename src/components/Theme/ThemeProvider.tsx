import { ThemeOptions } from "@radix-ui/themes";
import React from "react";

interface ThemeContextProps {
    theme: Partial<ThemeOptions>;
    toggleColorMode: () => void;
}

type colorMode = "light" | "dark" | "inherit";

function isColorMode(value: string): value is colorMode {
    return value === "light" || value === "dark";
}

const loadEsriStylesheet = (href: string) => {
    const linkElement = document.createElement("link");
    linkElement.type = "text/css";
    linkElement.rel = "stylesheet";
    linkElement.href = href;
    linkElement.id = "themeStylesheet";

    const head = document.head || document.getElementsByTagName("head")[0];
    const existingLink = document.getElementById("themeStylesheet");

    if (existingLink) {
        head.insertBefore(linkElement, existingLink);
        head.removeChild(existingLink);
    } else {
        head.insertBefore(linkElement, head.firstChild);
    }
};

const AppThemeContext = React.createContext<ThemeContextProps>({
    theme: {},
    toggleColorMode: () => {}
});

const AppThemeProvider = ({
    theme,
    children
}: React.PropsWithChildren<{ theme: Partial<ThemeOptions> }>) => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [colorMode, setColorMode] = React.useState<colorMode>(() => {
        let colorMode: colorMode;

        if (theme.appearance) {
            colorMode = theme.appearance;
        } else {
            const localStorageValue = window.localStorage.getItem("color-mode");
            colorMode = localStorageValue
                ? isColorMode(localStorageValue)
                    ? localStorageValue
                    : prefersDarkMode
                    ? "dark"
                    : "light"
                : prefersDarkMode
                ? "dark"
                : "light";
        }

        if (document?.body) {
            document.body.classList.remove("light", "dark", "inherit");
            document.body.classList.add(colorMode);
        }

        if (colorMode === "dark") {
            loadEsriStylesheet(
                "https://js.arcgis.com/4.27/@arcgis/core/assets/esri/themes/dark/main.css"
            );
        } else {
            loadEsriStylesheet(
                "https://js.arcgis.com/4.27/@arcgis/core/assets/esri/themes/light/main.css"
            );
        }

        return colorMode;
    });

    React.useEffect(() => {
        window.localStorage.setItem("color-mode", colorMode);
        if (document?.body) {
            document.body.classList.remove("light", "dark", "inherit");
            document.body.classList.add(colorMode);
        }
    }, [colorMode]);

    const toggleColorMode = React.useCallback(() => {
        setColorMode((currentTheme) => {
            return currentTheme === "light" ? "dark" : "light";
        });
        if (colorMode === "dark") {
            loadEsriStylesheet(
                "https://js.arcgis.com/4.27/@arcgis/core/assets/esri/themes/dark/main.css"
            );
        } else {
            loadEsriStylesheet(
                "https://js.arcgis.com/4.27/@arcgis/core/assets/esri/themes/light/main.css"
            );
        }
    }, []);

    return (
        <AppThemeContext.Provider
            value={{ toggleColorMode, theme: { ...theme, appearance: colorMode } }}
        >
            {children}
        </AppThemeContext.Provider>
    );
};

export { AppThemeContext, AppThemeProvider };
