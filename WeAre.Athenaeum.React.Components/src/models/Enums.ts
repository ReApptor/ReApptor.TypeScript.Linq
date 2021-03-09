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

export enum AuthType {
    Email,

    Phone
}