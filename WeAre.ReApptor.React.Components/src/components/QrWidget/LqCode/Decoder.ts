import ReedSolomonDecoder from "./ReedSolomon/ReedSolomonDecoder";
import GenericGF from "./ReedSolomon/GenericGF";
import DecoderResult from "./DecoderResult";
import {Dictionary} from "typescript-collections";
import {DecodeHintType} from "./Types";
import BitMatrix from "./BitMatrix";

// export default class Decoder {
//     private readonly rsDecoder: ReedSolomonDecoder;
//
//     constructor() {
//         this.rsDecoder = new ReedSolomonDecoder(GenericGF.QR_CODE_FIELD_256);
//     }
//
//     public decode(imageOrMatrix: boolean[][] | BitMatrix, hints?: Dictionary<DecodeHintType, any> | null): DecoderResult {
//         return (Array.isArray(imageOrMatrix))
//             ? this.decodeImage(imageOrMatrix, hints)
//             : this.decodeMatrix(imageOrMatrix, hints);
//     }
//    
//     public decodeImage(image: boolean[][], hints?: Dictionary<DecodeHintType, any> | null): DecoderResult {
//         const dimension: number = image.length;
//         const bits: BitMatrix = new BitMatrix(dimension);
//    
//         for(let i: number = 0; i < dimension; ++i) {
//             for(let j: number = 0; j < dimension; ++j) {
//                 if (image[i][j]) {
//                     bits.set(j, i);
//                 }
//             }
//         }
//    
//         return this.decode(bits, hints);
//     }
//    
//     public decodeMatrix(bits: BitMatrix, hints?: Dictionary<DecodeHintType, any> | null): DecoderResult {
//         const parser: BitMatrixParser = new BitMatrixParser(bits);
//         let error: Error | null = null;
//    
//         try {
//             return this.decode(parser, hints);
//         } catch (e) {
//             error = error;
//         }
//    
//         try {
//             parser.remask();
//             parser.setMirror(true);
//             parser.readVersion();
//             parser.readFormatInformation();
//             parser.mirror();
//             const result: DecoderResult = this.decode(parser, hints);
//             result.setOther(new QRCodeDecoderMetaData(true));
//             return result;
//         } catch (e) {
//             if (error != null) {
//                 throw error;
//             } else {
//                 throw e;
//             }
//         }
//     }
//    
//     private decodeParser(parser: BitMatrixParser, hints?: Dictionary<DecodeHintType, any> | null): DecoderResult {
//         const version: Version = parser.readVersion();
//         ErrorCorrectionLevel ecLevel = parser.readFormatInformation().getErrorCorrectionLevel();
//         byte[] codewords = parser.readCodewords();
//         DataBlock[] dataBlocks = DataBlock.getDataBlocks(codewords, version, ecLevel);
//         int totalBytes = 0;
//         DataBlock[] arr$ = dataBlocks;
//         int resultOffset = dataBlocks.length;
//    
//         for(int i$ = 0; i$ < resultOffset; ++i$) {
//             DataBlock dataBlock = arr$[i$];
//             totalBytes += dataBlock.getNumDataCodewords();
//         }
//    
//         byte[] resultBytes = new byte[totalBytes];
//         resultOffset = 0;
//         DataBlock[] arr$ = dataBlocks;
//         int len$ = dataBlocks.length;
//    
//         for(int i$ = 0; i$ < len$; ++i$) {
//             DataBlock dataBlock = arr$[i$];
//             byte[] codewordBytes = dataBlock.getCodewords();
//             int numDataCodewords = dataBlock.getNumDataCodewords();
//             this.correctErrors(codewordBytes, numDataCodewords);
//    
//             for(int i = 0; i < numDataCodewords; ++i) {
//                 resultBytes[resultOffset++] = codewordBytes[i];
//             }
//         }
//    
//         return DecodedBitStreamParser.decode(resultBytes, version, ecLevel, hints);
//     }
//    
//     private correctErrors(codewordBytes: number[], numDataCodewords: number): void {
//         const numCodewords: number = codewordBytes.length;
//         const codewordsInts: number[] = new Array(numCodewords);
//    
//         let numECCodewords: number;
//         for(numECCodewords = 0; numECCodewords < numCodewords; ++numECCodewords) {
//             codewordsInts[numECCodewords] = codewordBytes[numECCodewords] & 255;
//         }
//    
//         numECCodewords = codewordBytes.length - numDataCodewords;
//    
//         try {
//             this.rsDecoder.decode(codewordsInts, numECCodewords);
//         } catch (e) {
//             throw new Error("ChecksumException");
//         }
//    
//         for(let i: number = 0; i < numDataCodewords; ++i) {
//             codewordBytes[i] = codewordsInts[i];
//         }
//    
//     }
//    
// }