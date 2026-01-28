export type QuestionType = 'open' | 'options' | 'yes_no' | 'numeric' | 'date' | 'photo';

export interface IQuestion {
    id_question: number,
    id_user: number,
    question: string,
    question_type: QuestionType,
    base_price: number,
    promoter_earns: number,
    i_status: boolean,
    is_multiple?: boolean,      // Para tipo 'options'
    min_value?: number,         // Para tipo 'numeric'
    max_value?: number,         // Para tipo 'numeric'
    max_photos?: number,        // Para tipo 'photo'
    dt_register: string,
    dt_updated: string,
    options?: IQuestionOption[] // Opciones para tipo 'options'
}

export interface IQuestionOption {
    id_option?: number,
    id_question?: number,
    option_text: string,
    option_value_numeric?: number,
    option_value_text?: string,
    option_order: number,
    i_status?: boolean,
    dt_register?: string
}

export interface ICreateQuestionPayload {
    id_user: number,
    question: string,
    question_type?: QuestionType,
    base_price: number,
    promoter_earns: number,
    i_status?: boolean,
    is_multiple?: boolean,
    min_value?: number,
    max_value?: number,
    max_photos?: number,
    options?: ICreateOptionPayload[]
}

export interface ICreateOptionPayload {
    option_text: string,
    option_value_numeric?: number,
    option_value_text?: string,
    option_order: number
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
