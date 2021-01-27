import {PageRoute, BasePageDefinitions} from "@weare/athenaeum-react-common";
import ConstructionSiteNavigator from "@/ConstructionSiteNavigator";

export default class PageDefinitions extends BasePageDefinitions {

    protected async require(pageContainer: string, pageName: string): Promise<any> {
        return await require(`../pages/${pageContainer}${pageName}/${pageName}`);
    }
    
    constructor() {
        super();
    }

    public static readonly logoutRouteName: string = "Logout";

    public static readonly dummyRouteName: string = "Dummy";

    public static readonly dummyRoute: PageRoute = new PageRoute(PageDefinitions.dummyRouteName);

    public static readonly testsRouteName: string = "Tests";

    public static readonly testsRoute: PageRoute = new PageRoute(PageDefinitions.testsRouteName);

    public static readonly accountRouteName: string = "Account";

    public static readonly loginRouteName: string = "Login";

    public static readonly loginRoute: PageRoute = new PageRoute(PageDefinitions.loginRouteName);

    public static readonly adminRouteName: string = "Admin";

    public static readonly adminRoute: PageRoute = new PageRoute(PageDefinitions.adminRouteName);

    public static readonly employeesRouteName: string = "Employees";

    public static readonly employeesRoute: PageRoute = new PageRoute(PageDefinitions.employeesRouteName);

    public static readonly workOrdersRouteName: string = "WorkOrders";

    public static readonly workOrders: PageRoute = new PageRoute(PageDefinitions.workOrdersRouteName);

    public static readonly constructionSitesRouteName: string = "ConstructionSites";

    public static readonly constructionSitesRoute: PageRoute = new PageRoute(PageDefinitions.constructionSitesRouteName);

    public static readonly dashboardRouteName: string = "Dashboard";

    public static readonly dashboardRoute: PageRoute = new PageRoute(PageDefinitions.dashboardRouteName);

    public static readonly errorRouteName: string = "Error";

    public static readonly errorRoute: PageRoute = new PageRoute(PageDefinitions.errorRouteName);

    public static readonly contactSupportRouteName: string = "ContactSupport";

    public static readonly contactSupportRoute: PageRoute = new PageRoute(PageDefinitions.contactSupportRouteName);

    public static readonly offlineRouteName: string = "Offline";

    public static readonly offlineRoute: PageRoute = new PageRoute(PageDefinitions.offlineRouteName);

    public static readonly changePasswordRouteName: string = "ChangePassword";

    public static readonly changePasswordRoute: PageRoute = new PageRoute(PageDefinitions.changePasswordRouteName);

    public static readonly forgotPasswordRouteName: string = "ForgotPassword";
    
    public static readonly forgotPasswordRoute: PageRoute = new PageRoute(PageDefinitions.forgotPasswordRouteName);

    public static readonly constructionSiteManagementRouteName: string = "ConstructionSiteManagement";

    public static readonly constructionSiteManagementRoute: PageRoute = new PageRoute(PageDefinitions.constructionSiteManagementRouteName);
    
    public static readonly constructionSiteManagement: (constructionSiteId: string) => PageRoute = (constructionSiteId: string) => ConstructionSiteNavigator.managementRoute(constructionSiteId);

    public static readonly warehouseManagementRouteName: string = "WarehouseManagement";

    public static readonly warehouseManagement: (warehouseId: string) => PageRoute = (warehouseId: string) => new PageRoute(PageDefinitions.warehouseManagementRouteName, null, warehouseId);
    
    public static readonly resetPasswordRouteName: string = "ResetPassword";

    public static readonly resetPasswordRoute: PageRoute = new PageRoute(PageDefinitions.resetPasswordRouteName);

    public static readonly myWorkReportsRouteName: string = "MyWorkReports";

    public static readonly myWorkReportsRoute: PageRoute = new PageRoute(PageDefinitions.myWorkReportsRouteName);

    public static readonly homeRouteName: string = "Home";

    public static readonly homeRoute: PageRoute = new PageRoute(PageDefinitions.homeRouteName);

    // #region RentaTasks

    public static readonly rentaTasksRouteName: string = "RentaTasks/Dashboard";

    public static readonly rentaTasksRoute: PageRoute = new PageRoute(PageDefinitions.rentaTasksRouteName);

    public static readonly assignMountersRouteName: string = "RentaTasks/AssignMounters";

    public static readonly assignMountersRoute: PageRoute = new PageRoute(PageDefinitions.assignMountersRouteName);

    public static readonly checkOutRouteName: string = "RentaTasks/CheckOut";

    public static readonly checkOutRoute: PageRoute = new PageRoute(PageDefinitions.checkOutRouteName);

    public static readonly hoursAndDistancesRouteName: string = "RentaTasks/HoursAndDistances";

    public static readonly hoursAndDistancesRoute: PageRoute = new PageRoute(PageDefinitions.hoursAndDistancesRouteName);
    
    public static readonly selectConstructionSiteRouteName: string = "RentaTasks/SelectConstructionSite";

    public static readonly selectConstructionSiteRoute: PageRoute = new PageRoute(PageDefinitions.selectConstructionSiteRouteName);

    public static readonly approveRouteName: string = "RentaTasks/Approve";

    public static readonly approveRoute: PageRoute = new PageRoute(PageDefinitions.approveRouteName);

    public static readonly summaryRouteName: string = "RentaTasks/Summary";

    public static readonly summaryRoute: PageRoute = new PageRoute(PageDefinitions.summaryRouteName);

    public static readonly rentaTasksWorkOrdersRouteName: string = "RentaTasks/WorkOrders";

    public static readonly rentaTasksWorkOrdersRoute: PageRoute = new PageRoute(PageDefinitions.rentaTasksWorkOrdersRouteName);

    public static readonly rentaTasksWorkOrderRouteName: string = "RentaTasks/WorkOrder";

    public static readonly rentaTasksWorkOrderRoute: PageRoute = new PageRoute(PageDefinitions.rentaTasksWorkOrderRouteName);
    
    public static readonly rentaTasksWorkOrder: (workOrderId: string) => PageRoute = (workOrderId: string) => new PageRoute(PageDefinitions.rentaTasksWorkOrderRouteName, null, workOrderId);

    public static readonly addEquipmentRouteName: string = "RentaTasks/AddEquipment";

    public static readonly addEquipmentRoute: PageRoute = new PageRoute(PageDefinitions.addEquipmentRouteName);

    public static readonly addWorkOrderRouteName: string = "RentaTasks/AddWorkOrder";

    public static readonly addWorkOrderRoute: PageRoute = new PageRoute(PageDefinitions.addWorkOrderRouteName);

    public static readonly myWorkHoursRouteName: string = "RentaTasks/MyWorkHours";

    public static readonly myWorkHoursRoute: PageRoute = new PageRoute(PageDefinitions.myWorkHoursRouteName);

    // #endregion

    // #region RentaManagement

    public static readonly rentaManagementRouteName: string = "RentaManagement/Dashboard";

    public static readonly rentaManagementRoute: PageRoute = new PageRoute(PageDefinitions.rentaManagementRouteName);

    public static readonly selectOrganizationRouteName: string = "RentaManagement/SelectOrganization";

    public static readonly selectOrganizationRoute: PageRoute = new PageRoute(PageDefinitions.selectOrganizationRouteName);

    public static readonly managementSelectConstructionSiteRouteName: string = "RentaManagement/SelectConstructionSite";

    public static readonly managementSelectConstructionSiteRoute: PageRoute = new PageRoute(PageDefinitions.managementSelectConstructionSiteRouteName);

    // #endregion
}

new PageDefinitions();