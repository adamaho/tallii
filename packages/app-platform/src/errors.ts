enum ErrorResponseEnum {
    DATABASE_ERROR = "DATABASE_ERROR",
    FORBIDDEN = "FORBIDDEN",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    NOT_FOUND = "NOT_FOUND",
    UNKNONW_USER = "UNKNOWN_USER",
    UNAUTHORIZED = "UNAUTHORIZED"
}

interface ErrorResponse {
    error_code: `${ErrorResponseEnum}`;
    error: string;
}

/**
 *
 * Creates an error response object
 *
 * @param error string of the raw error
 * @param errorCode the error code
 * @returns object of the string and raw error
 */
export const errorResponse = (
    error: string,
    errorCode: `${ErrorResponseEnum}`
): ErrorResponse => ({
    error_code: errorCode,
    error
});
