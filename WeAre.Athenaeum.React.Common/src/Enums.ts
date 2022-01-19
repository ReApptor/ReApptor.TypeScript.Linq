export enum WebApplicationType {
    DesktopBrowser,

    MobileBrowser,

    MobileApp,

    PwaApp
}

export enum Align {
    Bottom = 0,

    Top = 1
}

export enum Justify {
    Left = 0,

    Right = 1
}

export enum TextAlign {
    Left,

    Center,

    Right
}

export enum VerticalAlign {
    Top,

    Middle,

    Bottom
}

export enum AlertType {
    Success,

    Warning,

    Info,

    Danger,

    Primary,

    Secondary,

    Light,

    Dark
}

/**
 * Specifies identifiers to indicate the return value of a dialog box.
 */
export enum DialogResult {
    /**
     * Nothing is returned from the dialog box. This means that the modal dialog continues running.
     */
    None = 0,

    /**
     * The dialog box return value is OK (usually sent from a button labeled OK).
     */
    OK = 1,

    /**
     * The dialog box return value is Cancel (usually sent from a button labeled Cancel).
     */
    Cancel = 2,

    /**
     * The dialog box return value is Abort (usually sent from a button labeled Abort).
     */
    Abort = 3,

    /**
     * The dialog box return value is Retry (usually sent from a button labeled Retry).
     */
    Retry = 4,

    /**
     * The dialog box return value is Ignore (usually sent from a button labeled Ignore).
     */
    Ignore = 5,

    /**
     * The dialog box return value is Yes (usually sent from a button labeled Yes).
     */
    Yes = 6,

    /**
     * The dialog box return value is No (usually sent from a button labeled No).
     */
    No = 7
}

/**
 * Specifies constants defining which buttons to display on a System.Windows.Forms.MessageBox.
 */
export enum MessageBoxButtons {
    /**
     * The message box contains an OK button.
     */
    OK,

    /**
     * The message box contains OK and Cancel buttons.
     */
    OKCancel,

    /**
     * The message box contains Abort, Retry, and Ignore buttons.
     */
    AbortRetryIgnore,

    /**
     * The message box contains Yes, No, and Cancel buttons.
     */
    YesNoCancel,

    /**
     * The message box contains Yes and No buttons.
     */
    YesNo,

    /**
     * The message box contains Retry and Cancel buttons.
     */
    RetryCancel,

    Custom = 6,
}

/**
 * Specifies constants defining which information to display.
 */
export enum MessageBoxIcon {
    /**
     * The message box contain no symbols.
     */
    None,

    /**
     * The message box contains a symbol consisting of a white X in a circle with a red background.
     */
    Hand,

    /**
     * The message box contains a symbol consisting of white X in a circle with a red background.
     */
    Stop,

    /**
     * The message box contains a symbol consisting of white X in a circle with a red background.
     */
    Error,

    /**
     * The message box contains a symbol consisting of a question mark in a circle.
      * The question-mark message icon is no longer recommended because it does not clearly
      * represent a specific type of message and because the phrasing of a message as
      * a question could apply to any message type. In addition, users can confuse the
      * message symbol question mark with Help information. Therefore, do not use this
      * question mark message symbol in your message boxes. The system continues to support
      * its inclusion only for backward compatibility.
     */
    Question,

    /**
     * The message box contains a symbol consisting of an exclamation point in a triangle with a yellow background.
     */
    Exclamation,

    /**
     * The message box contains a symbol consisting of an exclamation point in a triangle with a yellow background.
     */
    Warning,

    /**
     * The message box contains a symbol consisting of a lowercase letter i in a circle.
     */
    Asterisk,

    /**
     * The message box contains a symbol consisting of a lowercase letter i in a circle.
     */
    Information
}

export enum SwipeDirection {
    Left = 0,

    Right = 1,

    Up = 2,

    Down = 3
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

    Url = "url",

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
    Email = "^.+@.+\\..+$",

    /**
     * Value must be a proper url form, no port number or localhost supported
     */
    Url = "(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})",

    /**
     * Value must contain at least 1 lowercase, 1 uppercase character and 1 special character
     * Value must be 8 characters or longer
     */
    Password = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9 :])(?=.{8,})",

    /**
     * Generalish phone number validation. Requires 5-15 numbers separated by arbtirary amount of separators.
     *
     * Example matched numbers (source: https://stdcxx.apache.org/doc/stdlibug/26-1.html and self generated):
     *
     * 754-3010
     *
     * (541) 754-3010
     *
     * +1-541-754-3010
     *
     * 1-541-754-3010
     *
     * 001-541-754-3010
     *
     * 191 541 754 3010
     *
     * 636-48018
     *
     * (089) / 636-48018
     *
     * +49-89-636-48018
     *
     * 19-49-89-636-48018
     *
     * +358 123 456 789
     *
     * 044 440 040 045
     *
     * 020202
     *
     * 02 02 02
     *
     * 020 202
     */
    Phone = "^\\+?([- ()/]*[0-9][-()/]*){5,15}$"
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