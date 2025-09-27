export interface IStore {
    id_store: number,
    id_user: number,
    name: string,
    store_code?: string,
    street: string,
    ext_number: string,
    int_number?: string,
    neighborhood: string,
    municipality: string,
    state: string,
    postal_code: string,
    country: string,
    latitude?: number,
    longitude?: number,
    i_status: boolean,
    dt_register: string,
    dt_updated: string
}

export interface IStoreLog {
    id_store_log: number,
    id_store: number,
    id_user: number,
    log: string,
    i_status: boolean,
    dt_register: string,
    dt_updated: string
}
