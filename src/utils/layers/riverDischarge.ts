import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import CIMSymbol from "@arcgis/core/symbols/CIMSymbol.js";

export function getRiverDischargeLayer() {
    const geojsonlayer = new GeoJSONLayer({
        url: "https://thamessewage.s3.eu-west-2.amazonaws.com/now/now.geojson",
        copyright: "Sewage Map",
        renderer: {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: {
                type: "simple-line", // autocasts as new SimpleLineSymbol()
                color: "#733f2e",
                width: "6px",
                style: "solid"
            }
        } as any
    });

    let lastTimestamp = 0;
    let offset = 0;
    const stepDuration = 70; // 100ms

    function animate(timestamp: number) {
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
        }

        const elapsed = timestamp - lastTimestamp;

        if (elapsed >= stepDuration) {
            offset++;
            lastTimestamp = timestamp;
        }

        geojsonlayer.renderer = new SimpleRenderer({
            symbol: new CIMSymbol({
                data: {
                    type: "CIMSymbolReference",
                    symbol: {
                        type: "CIMLineSymbol",
                        symbolLayers: [
                            {
                                // white dashed layer at center of the line
                                type: "CIMSolidStroke",
                                effects: [
                                    {
                                        type: "CIMGeometricEffectDashes",
                                        offsetAlongLine: offset,
                                        dashTemplate: [3, 5, 3, 5], // width of dashes and spacing between the dashes
                                        lineDashEnding: "NoConstraint"
                                    }
                                ],
                                enable: true, // must be set to true in order for the symbol layer to be visible
                                capStyle: "Round",
                                joinStyle: "Round",
                                width: 2,
                                color: [115, 63, 46, 255]
                            },
                            {
                                // lighter green line layer that surrounds the dashes
                                type: "CIMSolidStroke",
                                enable: true,
                                capStyle: "Round",
                                joinStyle: "Round",
                                width: 3,
                                color: [170, 93, 68, 255]
                            },
                            {
                                // darker green outline around the line symbol
                                type: "CIMSolidStroke",
                                enable: true,
                                capStyle: "Round",
                                joinStyle: "Round",
                                width: 6,
                                color: [115, 63, 46, 255]
                            }
                        ]
                    }
                }
            })
        });

        requestAnimationFrame(animate); // Call animate again on the next frame
    }

    // Start the animation
    requestAnimationFrame(animate);

    return geojsonlayer;
}
