export interface OperationResult {
    caption: string;
    message: string;
    success: boolean;
    validateData: string[];
}

export interface OperationResultWithData<T> {
    caption: string;
    message: string;
    success: boolean;
    data: T;
    validateData: string[];
}