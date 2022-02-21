import { Configuration, TypescriptLocalizationPrefix } from "./src/types";

const configuration: Configuration = {
    typescriptLocalizationPrefix: TypescriptLocalizationPrefix.LOCALIZER,
    logSearchStrings: true,
    deleteOnFound: false,
    resources: [
        "/Users/ericaska/Desktop/WEARE/REAPPTOR/reapptor-app-template/WeAre.ReApptor.TemplateApp.WebUI.Resources/SharedResources.resx"
    ],
    cSharpDirectories: [
        "/Users/ericaska/Desktop/WEARE/REAPPTOR/reapptor-app-template/WeAre.ReApptor.TemplateApp.WebUI",
        "/Users/ericaska/Desktop/WEARE/REAPPTOR/reapptor-app-template/WeAre.ReApptor.TemplateApp.WebUI.Server"
    ],
    typescriptComponentsDirectories: ["/Users/ericaska/Desktop/WEARE/REAPPTOR/reapptor-app-template/WeAre.ReApptor.TemplateApp.WebUI/src"],
    prefixesToExclude: [
        "Month.",
        "DayOfWeek.",
        "Enum.AuthType",
        "Enum.WebApplicationType",
        "Enum.ReportDefinitionType",
        "Enum.MaintenanceReason",
        "Enum.FaultLevel",
        "Enum.ReportItemType",
        "Enum.ResourceItemType",
        "Enum.LoginResultStatus",
        "Enum.UserRole",
        "Enum.InvitationType",
        "Enum.AuditTimestamp",
        "Enum.DeviceStatus",
        "Enum.SavePasswordResultStatus",
        "Enum.SortDirection",
        "Enum.InvoiceStatusFilter"
    ],
    postfixesToExclude: [
        "Page.Title",
        "Page.Subtitle"
    ]
};

export default configuration;
