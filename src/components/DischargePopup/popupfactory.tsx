import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { PopUpBody } from "./PopUpContent/PopUpBody";
import { PopUpHeader } from "./PopUpContent/PopUpHeader";
import { getRenderPropsFromGraphic } from "./utils";
import AppTheme from "../Theme/AppTheme";
import { AppThemeProvider } from "../Theme/ThemeProvider";
import "@radix-ui/themes/styles.css";

export function setEsriPopupHTMLContent({ graphic }: { graphic: __esri.Graphic }) {
    const container = document.createElement("div");
    const root = createRoot(container);
    const { dischargeInterval, alertStatus, location } = getRenderPropsFromGraphic(graphic);

    root.render(
        <React.StrictMode>
            <AppThemeProvider
                theme={{
                    accentColor: "blue",
                    grayColor: "gray",
                    panelBackground: "solid"
                }}
            >
                <AppTheme>
                    <PopUpBody
                        {...{ dischargeInterval, alertStatus, locationName: location }}
                    ></PopUpBody>
                </AppTheme>
            </AppThemeProvider>
        </React.StrictMode>
    );
    return container;
}

export function setEsriPopupTitle({ graphic }: { graphic: __esri.Graphic }) {
    const container = document.createElement("div");
    const root = createRoot(container);
    const { alertStatus, feeds, location } = getRenderPropsFromGraphic(graphic);
    flushSync(() => {
        root.render(
            <React.StrictMode>
                <AppThemeProvider
                    theme={{
                        accentColor: "blue",
                        grayColor: "gray",
                        panelBackground: "solid"
                    }}
                >
                    <AppTheme>
                        <PopUpHeader {...{ alertStatus, feeds, location }}></PopUpHeader>
                    </AppTheme>
                </AppThemeProvider>
            </React.StrictMode>
        );
    });

    return container.innerHTML;
}
