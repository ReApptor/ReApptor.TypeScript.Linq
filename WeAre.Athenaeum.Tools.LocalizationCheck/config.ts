import { Configuration, TypescriptLocalizationPrefix } from "./src/types";

const configuration: Configuration = {
    logSearchStrings: false,
    resources: ["../../renta-tools/Renta.Tools.WebUI.Resources/SharedResources.resx"],
    typescriptLocalizationPrefix: TypescriptLocalizationPrefix.LOCALIZER,
    cSharpDirectories: ["../../renta-tools/Renta.Tools.WebUI", "../../renta-tools/Renta.Tools.WebUI.Server"],
    typescriptComponentsDirectories: ["../../renta-tools/Renta.Tools.WebUI/src"],
    enumsToKeep: [
        "WebApplicationType",
        "ReportDefinitionType",
        "DeviceCounterType",
        "MaintenanceReason",
        "FaultLevel",
        "ReportItemType",
        "ResourceItemType",
        "LoginResultStatus",
        "UserRole",
        "MeasuringOperators",
        "InvitationType",
        "AuditTimestamp",
        "AuthType",
        "DeviceStatus",
        "SavePasswordResultStatus",
        "SortDirection",
        "InvoiceStatusFilter",
    ],
};

export default configuration;
