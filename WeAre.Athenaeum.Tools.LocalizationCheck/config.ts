import { Configuration, TypescriptLocalizationPrefix } from "./src/types";
//
// const configuration: Configuration = {
//     typescriptLocalizationPrefix: TypescriptLocalizationPrefix.COMPONENT_NAME,
//     logSearchStrings: false,
//     resources: ["../WeAre.Athenaeum.React.Components.Localization/resources/SharedResources.resx"],
//     cSharpDirectories: [],
//     typescriptComponentsDirectories: ["../WeAre.Athenaeum.React.Components/src/components"],
//     prefixesToExclude: [],
//     postfixesToExclude: []
// };


const configuration: Configuration = {
    typescriptLocalizationPrefix: TypescriptLocalizationPrefix.LOCALIZER,
    logSearchStrings: false,
    resources: ["../../renta-tools/Renta.Tools.WebUI.Resources/SharedResources.resx"],
    cSharpDirectories: [
        "../../renta-tools/Renta.Tools.WebUI",
        "../../renta-tools/Renta.Tools.WebUI.Server"
    ],
    typescriptComponentsDirectories: ["../../renta-tools/Renta.Tools.WebUI/src"],
    prefixesToExclude: [
        "Enum.WebApplicationType",
        "Enum.ReportDefinitionType",
        "Enum.DeviceCounterType",
        "Enum.MaintenanceReason",
        "Enum.FaultLevel",
        "Enum.ReportItemType",
        "Enum.ResourceItemType",
        "Enum.LoginResultStatus",
        "Enum.UserRole",
        "Enum.MeasuringOperators",
        "Enum.InvitationType",
        "Enum.AuditTimestamp",
        "Enum.AuthType",
        "Enum.DeviceStatus",
        "Enum.SavePasswordResultStatus",
        "Enum.SortDirection",
        "Enum.InvoiceStatusFilter",
        "Month.",
        "DayOfWeek."
    ],
    postfixesToExclude: [
        "Page.Title",
        "Page.Subtitle"
    ]
};

export default configuration;
