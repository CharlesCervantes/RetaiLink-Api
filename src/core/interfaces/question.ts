export interface IQuestion {
    id_question: number,
    id_user: number,
    question: string,
    base_price: number,
    promoter_earns: number,
    i_status: boolean,
    dt_register: string,
    dt_updated: string
}

export interface IQuestionLog {
    id_question_log: number,
    id_question: number,
    id_user: number,
    log: string,
    i_status: boolean,
    dt_register: string,
    dt_updated: string
}


export interface IQuestionClient {
    id_question_client: number,
    id_question: number,
    id_client: number,
    id_user: number,
    client_price: number,
    client_promoter_earns: number,
    i_status: boolean,
    dt_register: string,
    dt_updated: string
}

export interface IQuestionClientLog {
    id_question_client_log: number,
    id_question_client: number,
    id_user: number,
    log: string,
    i_status: boolean,
    dt_register: string,
    dt_updated: string
}
