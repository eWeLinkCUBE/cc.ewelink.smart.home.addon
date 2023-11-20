export interface IUser {
    account: string;
    autoSyncStatus:boolean
}

export interface ILoginWithAccountParams {
    countryCode:string;
    password:string;
    account:string;
}

