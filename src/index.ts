// Import (Array extension initialization)
// Usage:
//   import "@reapptor/ts-linq";
import "./extensions/ArrayExtensions";

// Utilities:
export * from "./utilities/ArrayUtility";
export {default as ArrayUtility} from "./utilities/ArrayUtility";

// Extensions:
export * from "./extensions/ArrayExtensions";

// Static initializer (optional):
// Usage:
//   import Linq from "@reapptor/ts-linq";
//   Linq.init();
export default class Linq {
    public static init() {
    }
}