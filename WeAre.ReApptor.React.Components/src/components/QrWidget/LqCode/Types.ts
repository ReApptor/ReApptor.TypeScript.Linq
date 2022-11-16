
export enum BarcodeFormat {
    AZTEC,
    
    CODABAR,
    
    CODE_39,
    
    CODE_93,
    
    CODE_128,
    
    DATA_MATRIX,
    
    EAN_8,
    
    EAN_13,
    
    ITF,
    
    MAXICODE,
    
    PDF_417,
    
    QR_CODE,
    
    RSS_14,
    
    RSS_EXPANDED,
    
    UPC_A,
    
    UPC_E,
    
    UPC_EAN_EXTENSION,
}

export enum ResultMetadataType {
    OTHER,
    
    ORIENTATION,
    
    BYTE_SEGMENTS,
    
    ERROR_CORRECTION_LEVEL,
    
    ISSUE_NUMBER,
    
    SUGGESTED_PRICE,
    
    POSSIBLE_COUNTRY,
    
    UPC_EAN_EXTENSION,
    
    PDF417_EXTRA_METADATA,
    
    STRUCTURED_APPEND_SEQUENCE,
    
    STRUCTURED_APPEND_PARITY,
}

export enum DecodeHintType {
    OTHER,
    
    PURE_BARCODE,
    
    POSSIBLE_FORMATS,
    
    TRY_HARDER,
    
    CHARACTER_SET,
    
    ALLOWED_LENGTHS,
    
    ASSUME_CODE_39_CHECK_DIGIT,
    
    ASSUME_GS1,
    
    RETURN_CODABAR_START_END,
    
    NEED_RESULT_POINT_CALLBACK,
    
    ALLOWED_EAN_EXTENSIONS,
}
