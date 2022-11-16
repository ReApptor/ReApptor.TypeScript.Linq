import Reader from "./Reader";
import {Dictionary} from "typescript-collections";
import {BarcodeFormat, DecodeHintType} from "./Types";
import BinaryBitmap from "./BinaryBitmap";
import Result from "./Result";

// export default class MultiFormatReader implements Reader {
//     private hints: Dictionary<DecodeHintType, any> | null = null;
//     private readers: Reader[] | null = null;
//
//     constructor() {
//     }
//    
//     public decode(image: BinaryBitmap, hints?: Dictionary<DecodeHintType, any>): Result {
//         this.setHints(hints);
//         return this.decodeInternal(image);
//     }
//    
//     public decodeWithState(image: BinaryBitmap): Result {
//         if (this.readers == null) {
//             this.setHints(null);
//         }
//    
//         return this.decodeInternal(image);
//     }
//    
//     public setHints(hints?: Dictionary<DecodeHintType, any>): void {
//         this.hints = hints || null;
//         const tryHarder: boolean = hints != null && hints.containsKey(DecodeHintType.TRY_HARDER);
//         //Collection<BarcodeFormat> formats = hints == null ? null : (Collection)hints.get(DecodeHintType.POSSIBLE_FORMATS);
//         const formats: BarcodeFormat[] | null = (hints == null) ? null : hints.getValue(DecodeHintType.POSSIBLE_FORMATS);
//
//         const readers: Reader[] = [];
//
//         if (formats != null) {
//            
//             const addOneDReader: boolean = 
//                 formats.contains(BarcodeFormat.UPC_A) || 
//                 formats.contains(BarcodeFormat.UPC_E) || 
//                 formats.contains(BarcodeFormat.EAN_13) || 
//                 formats.contains(BarcodeFormat.EAN_8) || 
//                 formats.contains(BarcodeFormat.CODABAR) || 
//                 formats.contains(BarcodeFormat.CODE_39) || 
//                 formats.contains(BarcodeFormat.CODE_93) || 
//                 formats.contains(BarcodeFormat.CODE_128) || 
//                 formats.contains(BarcodeFormat.ITF) || 
//                 formats.contains(BarcodeFormat.RSS_14) || 
//                 formats.contains(BarcodeFormat.RSS_EXPANDED);
//            
//             if (addOneDReader && !tryHarder) {
//                 readers.push(new MultiFormatOneDReader(hints));
//             }
//
//             if (formats.contains(BarcodeFormat.QR_CODE)) {
//                 readers.push(new QRCodeReader());
//             }
//
//             if (formats.contains(BarcodeFormat.DATA_MATRIX)) {
//                 readers.push(new DataMatrixReader());
//             }
//
//             if (formats.contains(BarcodeFormat.AZTEC)) {
//                 readers.push(new AztecReader());
//             }
//
//             if (formats.contains(BarcodeFormat.PDF_417)) {
//                 readers.push(new PDF417Reader());
//             }
//
//             if (formats.contains(BarcodeFormat.MAXICODE)) {
//                 readers.push(new MaxiCodeReader());
//             }
//
//             if (addOneDReader && tryHarder) {
//                 readers.push(new MultiFormatOneDReader(hints));
//             }
//         }
//
//         if (readers.length == 0) {
//             if (!tryHarder) {
//                 readers.push(new MultiFormatOneDReader(hints));
//             }
//
//             readers.push(new QRCodeReader());
//             readers.push(new DataMatrixReader());
//             readers.push(new AztecReader());
//             readers.push(new PDF417Reader());
//             readers.push(new MaxiCodeReader());
//
//             if (tryHarder) {
//                 readers.push(new MultiFormatOneDReader(hints));
//             }
//         }
//
//         this.readers = readers;
//     }
//    
//     public reset(): void {
//         if (this.readers != null) {
//             const arr: Reader[] = this.readers;
//             const len: number = arr.length;
//    
//             for(let i: number = 0; i < len; ++i) {
//                 const reader: Reader = arr[i];
//                 reader.reset();
//             }
//         }
//    
//     }
//    
//     private decodeInternal(image: BinaryBitmap): Result {
//         if (this.readers != null) {
//             const arr: Reader[] = this.readers;
//             const len: number = arr.length;
//            
//             let i: number = 0;
//             while(i < len) {
//                 const reader: Reader = arr[i];
//    
//                 try {
//                     return reader.decode(image, this.hints);
//                 } catch (e) {
//                     ++i;
//                 }
//             }
//         }
//    
//         throw new Error("NotFoundException");
//     }
// }