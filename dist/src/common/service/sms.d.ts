export declare class EskizService {
    private token;
    login(): Promise<string>;
    sendSms(phone: string, message: string): Promise<import("axios").AxiosResponse<any, {
        mobile_phone: string;
        message: string;
        from: string;
    }, {}, any>>;
}
