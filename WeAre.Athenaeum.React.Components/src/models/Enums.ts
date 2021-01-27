export enum LoginResultStatus {
    Success,

    NotFound,

    Deleted,

    Locked,

    /**
     * Token security stamp does not correspond to user security stamp
     */
    TokenInvalidSecurityStamp,

    /**
     * Token already used
     */
    TokenUsed,

    /**
     * Token invalid or expired
     */
    TokenInvalidOrExpired
}

export enum LinkTarget {
    /**
     * Load in a new window
     */
    Blank = "_blank",

    /**
     * Load in the same frame as it was clicked
     */
    Self = "_self"
}

export enum BaseInputType {
    Text = "text",

    Email = "email",

    Password = "password",

    Number = "number",

    Currency = "currency",

    TextArea = "textarea",

    Dropdown = "dropdown",

    Checkbox = "checkbox",

    File = "file"
}

export enum InputValidationRule {
    /**
     * Default empty matcher
     */
    Default = "",

    /**
     * Value must be a proper email form
     */

    Email = ".+@.+\..+",

    /**
     * Value must contain at least 1 lowercase, 1 uppercase character and 1 special character
     * Value must be 8 characters or longer
     */
    Password = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9 :])(?=.{8,})",

    /**
     * General phone number validation for Finland, Estonia and Sweden.
     * It will pass old and new format numbers.
     * Between numbers space or dash can be used ones.
     * Number has to start +358 or 00358 or +372 or +41 or 0 are code can be 2 or 3 digit.
     */
    Phone = "^((([\\+][\\s]{0,1})|([0]{2}[\\s-]{0,1}))((358|372|41)[\\s-]{0,1})|([0]{1}))(([1-9]{1}[0-9]{0,1})([\\s-]{0,1})([0-9]{2,4})([\\s-]{0,1})([0-9]{2,4})([\\s-]{0,1}))([0-9]{0,3}){1}$"
}

export enum PasswordValidationRule {
    LowerCaseCharacter = "^(?=.*[a-z])",

    UpperCaseCharacter = "^(?=.*[A-Z])",

    NumberCharacter = "^(?=.*[0-9])",

    SpecialCharacter = "^(?=.*[^a-zA-Z0-9 :])"
}

export enum PasswordValidationError {
    /**
     * One lowercase ('a'-'z') characters.
     */
    Lowercase,

    /**
     * One uppercase ('A'-'Z') characters.
     */
    Uppercase,

    /**
     * One non alphanumeric characters.
     */
    NonAlphabetic,

    /**
     * Min 6 and at max 100 characters long.
     */
    Length
}

export enum WorkDayState {
    Normal = 0,

    /**
     * Sairas
     */
    SickLeave = 1,

    /**
     * Loma
     */
    Vacation = 2,

    /**
     * Vko lepo
     */
    WeeklyRest = 3,

    /**
     * Maksullinen vapaapäivä
     */
    PaidDayOff = 4,

    /**
     * Pekkanen
     */
    FlexHours = 5,
}

export enum DropdownSchema {
    Default,

    Widget,

    Transparent
}

export enum ConstructionSiteStatus {
    Active = 0,

    Inactive = 1,

    Closed = 2
}

export enum WorkOrderStatus {
    Created = 0,

    InProgress = 1,

    Completed = 2,

    SentToCustomer = 3,

    ApprovedByCustomer = 4,

    DeclinedByCustomer = 5,

    ReadyForInvoicing = 6,

    Invoiced = 7,

    Deleted = 8,

    Unknown = 9
}

export enum ConstructionSiteWorkOrderStatus {

    //Active tasks
    HasActiveTasks = 0,

    //Tasks completed, not sent workReports
    WorkReportNotSent = 1,

    //WorkReport sent, not approved by customer
    WorkReportNotApprovedByCustomer = 2,

    //Tasks completed, not approved by manager
    TaskNotApprovedByManager = 3,

    //InvoiceRows not approved by manager
    InvoiceRowsNotApprovedNyManager = 4,

    //InvoiceRows approved, not sent to Pagero (not created actual invoice)
    InvoiceNotCreated = 5
}

export enum UserRoleGroup {
    Admins,

    Managers,

    Employees,

    ContactPersons
}

export enum ConstructionSiteOrWarehouseType {
    ConstructionSite = 0,

    Warehouse = 1
}

export enum TaskStatusFilter {
    Unscheduled = 0,
    
    InProgress = 1,
    
    Upcoming = 2,
    
    Completed = 3,
    
    SentToCustomer = 4,
    
    ApprovedByCustomer = 5,
    
    DeclinedByCustomer = 6,
    
    ReadyForInvoicing = 7
}

export enum CustomerApprovalType {
    Email = 0,

    Phone = 1,

    Signature = 2
}

export enum ProductUnit {
    Piece = 0,

    Meter = 1,

    Kilometer = 2,

    Meter2 = 3,

    Liter = 4,

    Box = 5,

    Pair = 6,

    Bottle = 7,

    Can = 8,

    Bag = 9,

    Roll = 10,

    Custom = 11,
}

export enum UserDocumentLevel {
    First,

    Second
}

export enum ActionType {
    Default,

    /**
     * "text-success"
     */
    Create,

    Edit,

    /**
     * red
     */
    Delete,

    /**
     * grey
     */
    Muted,

    /**
     * "text-light"
     */
    Light,

    /**
     * "text-secondary"
     */
    Secondary,

    /**
     * cyan
     */
    Info,

    Grey,

    Blue,
}

export enum UserSalaryAggregateType {
    Day,

    Month
}

export enum InvitationType {
    Invitation,

    ResetPassword,

    ForgotPassword
}

export enum AuthType {
    Email,

    Phone
}
export enum AuditTimestamp {
    CreatedAt,

    ModifiedAt
}

export enum SavePasswordResultStatus {
    Success,

    WeakPassword,

    WrongCurrent
}

export enum OrganizationContractLevel {
    Operator = 0,

    Company = 1,

    SubCompany = 2
}

export enum OrganizationContractType {
    Customer = 0,

    Subcontractor = 1
}