export interface ZukiResponse<T> {
    entity: T;
    validationMessages: Record<string, string>;
    exception: any;
}