import {Utility} from "@weare/athenaeum-toolkit";
import {ApiProvider, ch, ILayoutPage, PageRoute, PageRouteProvider} from "@weare/athenaeum-react-common";
import MounterContext from "./Models/MounterContext";
import {ITitleModel} from "@/components/WizardContainer/TitleWidget/TitleWidget";
import WorkOrderModel from "../../models/server/WorkOrderModel";
import {IWizardStep, IWizardSteps} from "@/components/WizardContainer/StepsWidget/StepsWidget";
import PageDefinitions from "../../providers/PageDefinitions";
import Comparator from "../../helpers/Comparator";
import UserContext from "../../models/server/UserContext";
import CreateWorkOrderRequest from "../../models/server/requests/CreateWorkOrderRequest";
import TaskCheckOutRequest from "../../models/server/requests/TaskCheckOutRequest";
import SaveWorkOrderDataRequest from "../../models/server/requests/SaveWorkOrderDataRequest";
import ApproveWorkOrderRequest from "../../models/server/requests/ApproveWorkOrderRequest";
import SignInRequest from "../../models/server/requests/SignInRequest";
import SignOutRequest from "../../models/server/requests/SignOutRequest";
import CheckOutRequest from "../../models/server/requests/CheckOutRequest";
import RentaTaskConstants from "../../helpers/RentaTaskConstants";
import ConstructionSiteOrWarehouse from "@/models/server/ConstructionSiteOrWarehouse";
import UserSalaryHour from "@/models/server/UserSalaryHour";
import {CustomerApprovalType, WorkOrderStatus} from "@/models/Enums";
import WizardContext from "@/pages/RentaTasks/Models/WizardContext";
import User from "@/models/server/User";
import TransformProvider from "../../providers/TransformProvider";
import Localizer from "@/localization/Localizer";

export enum RentaTasksAction {
    None = 0,

    SignOut = 1,

    NewWorkOrder = 2,
    
    EditWorkOrder = 3,
    
    AddEquipment = 4,
    
    CompleteWorkOrder = 5,
}

export interface IWizardNextStep {
    nextRoute: PageRoute;
    
    firstStep: boolean;
    
    lastStep: boolean;
}

class RentaTasksController {
    private _key: string | null = null;
    private _mounterContext: MounterContext | null = null;

    private get key(): string {
        if (this._key == null) {
            this._key = `$${RentaTaskConstants.applicationName}.${this.userContext.email}.${RentaTasksController.name}`;
        }
        return this._key!;
    }

    private indexOfCurrentStep(route: PageRoute): number {
        const wizard: IWizardSteps | null = this.getSteps();
        return (wizard)
            ? wizard.steps.findIndex(step => Comparator.isEqual(step.route, route))
            : -1;
    }

    private async postAsync<TResponse>(endpoint: string, request: any | null = null): Promise<TResponse> {
        const layout: ILayoutPage = ch.getLayout();
        return await ApiProvider.postAsync<TResponse>(endpoint, request, layout);
    }

    public saveContext(): void {
        const json: string = JSON.stringify(this.context);
        window.localStorage.setItem(this.key, json);
    }

    public get context(): MounterContext {
        if (this._mounterContext === null) {
            const json: string | null = window.localStorage.getItem(this.key);
            this._mounterContext = (json)
                ? MounterContext.parse(json!)
                : new MounterContext();
        }

        return this._mounterContext!;
    }
    
    public get wizard(): WizardContext {
        return this.context.wizard;
    }

    public get userContext(): UserContext {
        return (ch.getContext() as UserContext);
    }
    
    public get isSignedIn(): boolean {
        return this.context.isSignedIn;
    }
    
    public get isCheckedIn(): boolean {
        return this.context.isCheckedIn;
    }

    public get checkedInWorkOrderId(): string | null {
        return this.context.workOrderId;
    }

    public get wizardTitle(): ITitleModel | undefined {
        const wizard: WizardContext = this.context.wizard;
        
        if (wizard.workOrder) {
            if (wizard.action == RentaTasksAction.NewWorkOrder) {
                const workOrder = new WorkOrderModel();
                workOrder.name = (wizard.workOrder.name) ? wizard.workOrder.name : Localizer.rentaTasksControllerNewWorkOrderName;
                workOrder.owner = wizard.owner;
                return TransformProvider.toTitle(workOrder);
            }
            return TransformProvider.toTitle(wizard.workOrder);
        }
        
        if (wizard.owner) {
            return TransformProvider.toTitle(wizard.owner);
        }
        
        return undefined;
    }

    public get signInTitle(): ITitleModel | undefined {
        const context: MounterContext = this.context;

        if (context.isSignedIn) {
            if (context.workOrder) {
                return TransformProvider.toTitle(context.workOrder);
            }
        }

        return undefined;
    }

    public async actionAsync(action: RentaTasksAction, stopPropagation: boolean = false): Promise<void> {

        const initialPageRoute: PageRoute = ch.getPage().route;

        const workOrder: WorkOrderModel | null = this.wizard.workOrder;
        const owner: ConstructionSiteOrWarehouse | null = this.wizard.owner;
        
        const wizard = new WizardContext();
        this.context.wizard = wizard;
        wizard.workOrder = workOrder;
        wizard.owner = owner;
        wizard.action = action;
        wizard.actionInitialPageRoute = initialPageRoute;

        if (action == RentaTasksAction.NewWorkOrder) {
            const workOrder = new WorkOrderModel();
            workOrder.activationDate = Utility.today();
            wizard.owner = (this.context.workOrder) ? this.context.workOrder.owner : null;
            wizard.workOrder = workOrder;
        }

        if ((action == RentaTasksAction.SignOut) && (this.context.workOrder)) {
            wizard.workOrder = this.context.workOrder;
            wizard.owner = this.context.workOrder.owner;
            wizard.addEquipment = true;
        }

        await this.reloadWorkOrderAsync();

        this.saveContext();

        const nextStep: IWizardNextStep = await this.getNextStepAsync(initialPageRoute);

        await PageRouteProvider.redirectAsync(nextStep.nextRoute, false, stopPropagation);
    }

    public async completeActionAsync(): Promise<void> {

        const action: RentaTasksAction = this.wizard.action;

        if (action == RentaTasksAction.SignOut) {

            await this.checkOutAsync();

            await this.signOutAsync();

            await ch.alertMessageAsync(Localizer.rentaTasksWorkOrderSignOutAlert, true);
        }

        if (action == RentaTasksAction.NewWorkOrder) {

            await this.createWorkOrderAsync();
        }

        if (action == RentaTasksAction.EditWorkOrder) {

            await this.saveWorkOrderDataAsync();

            await ch.alertMessageAsync(Localizer.rentaTasksWorkOrderSaveAlert, true);
        }

        if (action == RentaTasksAction.AddEquipment) {

            await this.saveWorkOrderEquipmentAsync();

            await ch.alertMessageAsync(Localizer.rentaTasksWorkOrderUpdateEquipmentAlert, true);
        }

        if (action == RentaTasksAction.CompleteWorkOrder) {
            
            const workOrder: WorkOrderModel | null = this.wizard.workOrder;
            if (workOrder) {
                
                const myWorkOrder: boolean = (this.isCheckedIn) && (this.context.workOrderId == workOrder.id);
                if (myWorkOrder) {
                    await this.checkOutAsync();

                    await this.signOutAsync();
                } else {
                    await this.saveWorkOrderDataAsync();
                }

                if (workOrder.currentStatus == WorkOrderStatus.InProgress) {
                    await this.completeWorkOrderAsync();
                }
                
                await this.approveWorkOrderAsync();

                await ch.alertMessageAsync(Localizer.rentaTasksWorkOrderCompleteAlert, true);
            }
        }

        this.context.wizard = new WizardContext();

        this.saveContext();
    }

    private async completeWorkOrderAsync(): Promise<void> {
        const wizard: WizardContext = this.wizard;

        if (wizard.workOrder) {
            const workOrder: WorkOrderModel = wizard.workOrder;

            await this.postAsync("api/rentaTasks/completeWorkOrder", workOrder.id);
        }
    }
    
    private async approveWorkOrderAsync(): Promise<void> {
        const wizard: WizardContext = this.wizard;
        
        if (wizard.workOrder) {
            const workOrder: WorkOrderModel = wizard.workOrder;

            const request = new ApproveWorkOrderRequest();
            request.workOrderId = workOrder.id;
            request.customerApprover = workOrder.customerApprover;
            request.approvalType = wizard.approvalType;
            request.signatureSrc = wizard.signatureSrc;

            await this.postAsync("api/rentaTasks/ApproveWorkOrder", request);

            const message: string = (wizard.approvalType == CustomerApprovalType.Phone)
                ? Localizer.rentaTasksControllerAlertsApproved.format(workOrder)
                : Localizer.rentaTasksControllerAlertsSentToCustomer.format(workOrder);

            await ch.alertErrorAsync(message, true);
        }
    }

    private async createWorkOrderAsync(): Promise<void> {

        const owner: ConstructionSiteOrWarehouse | null = this.wizard.owner;
        const workOrder: WorkOrderModel | null = this.wizard.workOrder;
        
        if ((workOrder) && (owner)) {

            const request = new CreateWorkOrderRequest(null);
            request.activationDate = workOrder.activationDate;
            request.name = workOrder.name;
            request.description = workOrder.description;
            request.constructionSiteOrWarehouseId = owner.id;
            request.mounters = this.wizard.mounters || [];
            request.equipment = this.wizard.equipment;
            request.hoursPrice = owner.hoursPrice;
            request.mileagePrice = owner.mileagePrice;
            
            await this.postAsync("/api/RentaTasks/createWorkOrder", request);

            await ch.alertMessageAsync(Localizer.rentaTasksControllerAlertsCreated.format(request.name), true);
            
        }
    }

    public async checkExpirationAsync(): Promise<boolean> {
        if (this.context.isExpired) {
            this.context.signOut();

            this.saveContext();

            await PageRouteProvider.redirectAsync(PageDefinitions.rentaTasksRoute, false);

            await ch.alertMessageAsync(Localizer.rentaTasksControllerSignInExpirationAlert, true);

            return true;
        }

        return false;
    }
    
    private async reloadWorkOrderAsync(): Promise<void> {
        if ((this.wizard.workOrder) && (this.wizard.workOrder.id)) {

            const workOrderId: string = this.wizard.workOrder.id;
            const workOrder: WorkOrderModel = await this.postAsync("/api/RentaTasks/getWorkOrder", workOrderId);
            const userId: string = ch.getUserId();

            let myHours: UserSalaryHour | null = workOrder.userSalaryHours!.find(item => (item.workOrderId == workOrderId) && (item.userId == userId) && (item.day.isToday())) || null;
            if (!myHours) {
                myHours = new UserSalaryHour();
                myHours.day = Utility.today();
                myHours.workOrderId = workOrder.id;
                myHours.user = ch.getUser<User>();
                myHours.userId = ch.getUserId();
            }

            this.wizard.myHours = myHours;
            
            this.wizard.workOrder = workOrder;
            this.wizard.owner = workOrder.owner;
        }
    }

    private async signOutAsync(): Promise<void> {
        if (this.isSignedIn) {
            
            const request = new SignOutRequest();
            request.location = await Utility.getLocationAsync();
            
            await this.postAsync("/api/RentaTasks/SignOut", request);
            
            this.context.signOut();
        }
    }

    private async checkOutAsync(): Promise<void> {
        const context: MounterContext = this.context;
        const wizard: WizardContext = this.wizard;

        if (context.isSignedIn) {
            
            if ((context.isCheckedIn) && (wizard.workOrder)) {

                const request = new TaskCheckOutRequest();
                request.location = await Utility.getLocationAsync();
                request.normalHours = wizard.myHours.normalHours;
                request.overtime50Hours = wizard.myHours.overtime50Hours;
                request.overtime100Hours = wizard.myHours.overtime100Hours;

                await this.postAsync("/api/RentaTasks/TaskCheckOut", request);

                await this.saveWorkOrderDataAsync();

            } else {
                
                const request = new CheckOutRequest();
                request.location = await Utility.getLocationAsync();

                await this.postAsync("/api/RentaTasks/CheckOut", request);
            }

            context.checkOut();
        }
    }

    private async saveWorkOrderDataAsync(): Promise<void> {
        const wizard: WizardContext = this.wizard;
        const workOrder: WorkOrderModel | null = wizard.workOrder;

        if ((workOrder) && (workOrder.id)) {

            const request = new SaveWorkOrderDataRequest();
            request.workOrderId = workOrder.id;
            request.distances = workOrder.distances;
            request.userSalaryHours = workOrder.userSalaryHours;
            request.equipment = wizard.equipment;

            await this.postAsync("/api/RentaTasks/SaveWorkOrderData", request);
        }
    }

    private async saveWorkOrderEquipmentAsync(): Promise<void> {
        const wizard: WizardContext = this.wizard;
        const workOrder: WorkOrderModel | null = wizard.workOrder;

        if ((workOrder) && (workOrder.id)) {

            const request = new SaveWorkOrderDataRequest();
            request.workOrderId = workOrder.id;
            request.equipment = wizard.equipment;

            await this.postAsync("/api/RentaTasks/SaveWorkOrderData", request);
        }
    }
    
    public async checkInAsync(workOrder: WorkOrderModel): Promise<void> {

        this.wizard.workOrder = workOrder;
        
        await this.reloadWorkOrderAsync();

        const request = new SignInRequest();
        request.location = await Utility.getLocationAsync();
        request.workOrderId = workOrder.id;
        request.constructionSiteOrWarehouseId = workOrder.owner!.id;

        await this.postAsync(`/api/RentaTasks/SignIn`, request);

        this.context.checkIn(workOrder);
        
        this.saveContext();
    }

    public getSteps(): IWizardSteps | null {
        const selectConstructionSiteStep: IWizardStep = {route: PageDefinitions.selectConstructionSiteRoute, title: Localizer.rentaTasksControllerStepsTitleSelectSite};
        const checkOutWorkOrderStep: IWizardStep = {route: PageDefinitions.checkOutRoute, title: Localizer.rentaTasksControllerStepsTitleTaskStatus};
        const hoursAndDistancesStep: IWizardStep = {route: PageDefinitions.hoursAndDistancesRoute, title: Localizer.rentaTasksControllerStepsTitleHoursAndDistance};
        const addEquipmentStep: IWizardStep = {route: PageDefinitions.addEquipmentRoute, title: Localizer.rentaTasksControllerStepsTitleEquipment};
        const approveStep: IWizardStep = {route: PageDefinitions.approveRoute, title: Localizer.rentaTasksControllerStepsTitleApproving};
        const summaryStep: IWizardStep = {route: PageDefinitions.summaryRoute, title: Localizer.rentaTasksControllerStepsTitleSummary};
        const addWorkOrderStep: IWizardStep = {route: PageDefinitions.addWorkOrderRoute, title: Localizer.rentaTasksControllerStepsTitleNewTask};
        const assignMountersStep: IWizardStep = {route: PageDefinitions.assignMountersRoute, title: Localizer.rentaTasksControllerStepsTitleMounters};

        const context: MounterContext = this.context;
        const wizard: WizardContext = this.wizard;
        const action: RentaTasksAction = wizard.action;
        const isSignedIn: boolean = context.isCheckedIn;

        if (action == RentaTasksAction.NewWorkOrder) {
            const steps: IWizardStep[] = [];
            if (!isSignedIn) {
                steps.push(selectConstructionSiteStep);
            }
            steps.push(addWorkOrderStep, assignMountersStep, addEquipmentStep);
            return {steps: steps};
        }

        if (action == RentaTasksAction.SignOut) {
            const steps: IWizardStep[] = [];
            steps.push(checkOutWorkOrderStep);
            if (wizard.addEquipment) {
                steps.push(addEquipmentStep);
            }
            return {steps: steps};
        }

        if (action == RentaTasksAction.EditWorkOrder) {
            return {steps: [addEquipmentStep, hoursAndDistancesStep]};
        }

        if (action == RentaTasksAction.CompleteWorkOrder) {
            const steps: IWizardStep[] = [];
            if (isSignedIn) {
                steps.push(checkOutWorkOrderStep);
            }
            steps.push(addEquipmentStep, hoursAndDistancesStep, summaryStep, approveStep);
            return {steps: steps};
        }

        if (action == RentaTasksAction.AddEquipment) {
            return {steps: [addEquipmentStep]};
        }

        return null;
    }

    public async getPrevStepAsync(route: PageRoute): Promise<PageRoute> {
        const index: number = this.indexOfCurrentStep(route);
        const steps: IWizardStep[] = this.getSteps()!.steps;
        if ((index === -1) || (index === 0)) {
            return this.wizard.actionInitialPageRoute || PageDefinitions.rentaTasksRoute;
        }
        return steps[index - 1].route;
    }

    public async getNextStepAsync(route: PageRoute): Promise<IWizardNextStep> {
        const index: number = this.indexOfCurrentStep(route);
        const steps: IWizardStep[] = this.getSteps()!.steps;
        const firstStep: boolean = (index === -1) && (steps.length > 0);
        if (firstStep) {
            return {nextRoute: steps[0].route, firstStep: true, lastStep: false};
        }
        const lastStep: boolean = (index === -1) || (index === steps.length - 1);
        if (lastStep) {
            const wizard: WizardContext = this.wizard;
            const nextRoute: PageRoute | null = (!Comparator.isEqualPageRoute(wizard.actionInitialPageRoute, route))
                ? wizard.actionInitialPageRoute
                : null;
            return {nextRoute: nextRoute || PageDefinitions.rentaTasksRoute, firstStep: false, lastStep: true};
        }
        return {nextRoute: steps[index + 1].route, firstStep: false, lastStep: false};
    }
}

//Singleton
export default new RentaTasksController();