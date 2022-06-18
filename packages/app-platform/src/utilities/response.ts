interface PayloadResponse<PayloadData> {
    [key: string]: PayloadData;
}

/**
 *
 * Formats the response of the data from the endpoint
 *
 * @param data The data to include as the items in the response
 * @returns a payload response
 */
export function payloadResponse<PayloadResponseData>(
    key: string,
    data: PayloadResponseData
): PayloadResponse<PayloadResponseData> {
    return {
        [key]: data
    };
}
