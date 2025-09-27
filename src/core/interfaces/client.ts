export interface IClient {
    id_client: number,
    id_user: number,
    name: string,
    i_status: boolean,
    dt_register: string,
    dt_updated: string
}

export interface IClientLog {
    id_client_log: number,
    id_client: number,
    id_user: number,
    log: string,
    i_status: boolean,
    dt_register: string,
    dt_updated: string
}