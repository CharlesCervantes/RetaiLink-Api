import { IQuestion } from "../core/interfaces/question";
import db from '../config/database';
import { Database } from '../core/database';
import { Utils } from '../core/utils';

export class Question {
    private db: Database = db;
    
    constructor(){}

    async createQuestion(id_user: number, questionData: IQuestion) {
        let commit = false;
        try {
            if (!this.db.inTransaction) {
                await this.db.beginTransaction();
                commit = true;
            }

            let query = "INSERT INTO questions(id_user, question, base_price, promoter_earns";
            let queryValues = "VALUES (?, ?, ?, ?";
            let params: any[] = [id_user, questionData.question, questionData.base_price, questionData.promoter_earns];

            if (questionData.i_status !== undefined) {
                query += ", i_status";
                queryValues += ", ?";
                params.push(questionData.i_status ? 1 : 0);
            }

            query += ") " + queryValues + ")";
            
            const result = await this.db.execute(
                query,
                params
            );
 
            await Utils.registerQuestionLog(this.db, result.insertId, id_user, "Pregunta creada");

            if (commit) {
                await this.db.commit();
            }

            return result.insertId;
        } catch (error) {
            if (commit) {
                await this.db.rollback();
            }
            throw error;
        }
    }

    async selectQuestionById(id_question: number) {
        try {
            const query = "SELECT * FROM questions WHERE id_question = ?";
            const params = [id_question];
            const [rows]: any = await this.db.execute(query, params);

            // console.log("superadmin - question.ts - selectQeustionById: ", rows); //DEBUG

            return rows;
        } catch (error) {
            throw error;
        }
    }

    async asignQuestionToClient(id_question: number, id_client: number, id_user: number, client_price: number = 0, client_promoter_earns: number = 0) {
        let commit = false;
        try {
            if (!this.db.inTransaction) {
                await this.db.beginTransaction();
                commit = true;
            }

            // console.log("id_question: ", id_question);
            const question = await this.selectQuestionById(id_question);

            // console.log(question);

            if(!question){
                throw new Error("La pregunta no existe");
            }

            if(client_price === 0){
                client_price = question.base_price;
            }

            if(client_promoter_earns === 0){
                client_promoter_earns = question.promoter_earns;
            }

            const query = "INSERT INTO questions_client (id_question, id_client, id_user, client_price, client_promoter_earns) VALUES (?, ?, ?, ?, ?)";
            const params = [id_question, id_client, id_user, client_price, client_promoter_earns];

            const result = await this.db.execute(query, params);

            await Utils.registerQuestionLog(this.db, id_question, id_user, "Pregunta asignada a cliente");
            await Utils.registerClienteLog(this.db, id_client, id_user, "Pregunta asignada a cliente");

            if (commit) {
                await this.db.commit();
            }

            return result.insertId;
        } catch (error) {
            if (commit) {
                await this.db.rollback();
            }
            throw error;
        }
    }
}
