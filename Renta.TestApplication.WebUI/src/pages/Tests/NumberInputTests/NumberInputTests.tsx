import React from "react";
// import {BaseComponent} from "@weare/athenaeum-react-common";
// import { Form, NumberInputBehaviour, LayoutThreeColumns as ThreeColumns } from "@weare/athenaeum-react-components";
// import { NumberInput } from "@weare/athenaeum-react-components";
//
// export default class NumberInputTests extends BaseComponent {
//    
//     public render(): React.ReactNode {        
//         return (
//             <React.Fragment>
//
//                 <Form>
//                    
//                     <ThreeColumns>
//                        
//                         <NumberInput label={"Test (step 0.01, [min = 1; max = 10])"} step={0.01} min={1} max={10} />
//                        
//                         <NumberInput label={"Test (step 0.01, [min = -10; max = 10])"} step={0.01} min={-10} max={10} />
//                        
//                         <NumberInput label={"Test (step 1, [min = -10; max = 10])"} step={1} min={-10} max={10} />
//                        
//                     </ThreeColumns>
//                    
//                     <ThreeColumns>
//                        
//                         <NumberInput label={"Test (step 0.01, [min = 1; max = 10], Restricted)"} step={0.01} min={1} max={10} behaviour={NumberInputBehaviour.Restricted} />
//                        
//                         <NumberInput label={"Test (step 0.01, [min = 1; max = 10], OnChange)"} step={0.01} min={1} max={10} behaviour={NumberInputBehaviour.ValidationOnChange} />
//                        
//                         <NumberInput label={"Test (step 0.01, [min = 1; max = 10]), OnSave"} step={0.01} min={1} max={10} behaviour={NumberInputBehaviour.ValidationOnSave} />
//                        
//                     </ThreeColumns>
//                    
//                 </Form>
//                
//             </React.Fragment>
//         );
//     }
// }