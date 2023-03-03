// Utilities:
export * from "./utilities/ArrayUtility";
export {default as ArrayUtility} from "./utilities/ArrayUtility";

// Extensions:
export * from "./extensions/ArrayExtensions";

// Linq & Settings
export * from "./LinqSettings";
export * from "./Linq";

// Initializing:
//   1) Automatic:
//   import "@reapptor/ts-linq";
//   2) Manual:
//   import Linq from "@reapptor/ts-linq";
//   Linq.init();

// Settings:
//   Linq.settings.stringToDateCastEnabled = false;