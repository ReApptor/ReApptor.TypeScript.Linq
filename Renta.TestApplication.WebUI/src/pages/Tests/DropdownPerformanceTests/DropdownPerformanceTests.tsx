import React from "react";
// import {BaseComponent} from "@weare/athenaeum-react-common";
// import { Dropdown, LayoutThreeColumns as ThreeColumns } from "@weare/athenaeum-react-components";
//
// export interface IDropdownPerformanceTestsState {
// }
//
// export default class DropdownPerformanceTests extends BaseComponent<{}, IDropdownPerformanceTestsState> {
//
//     state: IDropdownPerformanceTestsState = {
//     };
//
//     private _items: any[] | null = null;
//    
//     private get items(): any[] {
//         if (this._items == null) {
//             const size: number = 100;//10000;
//             this._items = [];
//             for (let i: number = 0; i < size; i++) {
//                 this._items.push({name: i + "th item" });
//             }
//         }
//         return this._items;
//     }
//    
//     public render(): React.ReactNode {
//        
//         return (
//             <React.Fragment>
//
//                 <ThreeColumns>
//                     
//                     <Dropdown id="performanceTest"
//                               label="Dropdown"
//                               items={this.items}
//                               filterMaxLength={Number.MAX_VALUE}
//                     />
//                        
//                 </ThreeColumns>
//                
//             </React.Fragment>
//         );
//     }
// }