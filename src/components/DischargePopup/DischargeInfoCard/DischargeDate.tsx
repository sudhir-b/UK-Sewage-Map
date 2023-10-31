import styled from "@emotion/styled";

import { AlertStatus, DischargeInterval } from "../../../utils/discharge/types";
import { getDischargeDateObject } from "../../../utils/discharge/discharge.utils";
import { Flex, Text } from "@radix-ui/themes";

function getBGColorFromAlertStatus(alertStatus: AlertStatus): string {
    switch (alertStatus) {
        case "Discharging":
            return "--red-a3";
        case "Recent Discharge":
            return "--orange-a3";
        case "Not Discharging":
            return "--green-a3";
    }
}

function getColorFromAlertStatus(alertStatus: AlertStatus): string {
    switch (alertStatus) {
        case "Discharging":
            return "--red-a11";
        case "Recent Discharge":
            return "--orange-a11";
        case "Not Discharging":
            return "--green-a11";
    }
}

const Container = styled(Flex)`
    background-color: var(--backgroundcardcolor);
    border-radius: 8px;
    padding: 10px;
    width: 60px;
    text-align: center;
`;

type DischargeDateProps = {
    alertStatus: AlertStatus;
    dischargeInterval: DischargeInterval;
};

export function DischargeDate({ alertStatus, dischargeInterval }: DischargeDateProps) {
    if (dischargeInterval.start === null) {
        return (
            <Container
                direction={"column"}
                justify={"center"}
                align={"center"}
                style={
                    {
                        "--backgroundcardcolor": `var(${getBGColorFromAlertStatus(alertStatus)})`,
                        color: `var(${getColorFromAlertStatus(alertStatus)})`
                    } as React.CSSProperties
                }
            >
                <Text size={"8"}>N/A</Text>
            </Container>
        );
    }

    return (
        <Container
            direction={"column"}
            justify={"center"}
            align={"center"}
            style={
                {
                    "--backgroundcardcolor": `var(${getBGColorFromAlertStatus(alertStatus)})`,
                    color: `var(${getColorFromAlertStatus(alertStatus)})`
                } as React.CSSProperties
            }
        >
            <>
                <Text>{getDischargeDateObject(dischargeInterval.end ?? Date.now()).month}</Text>
                <Text size={"6"}>
                    {getDischargeDateObject(dischargeInterval.end ?? Date.now()).day}
                </Text>
                <Text>{getDischargeDateObject(dischargeInterval.end ?? Date.now()).year}</Text>
            </>
        </Container>
    );
}
