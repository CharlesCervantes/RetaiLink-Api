import { Question } from "../app_superadmin/question";

export class QuestionAdmin extends Question {
    constructor() {
        super();
    }

    /**
     * Obtener preguntas asignadas a un cliente específico
     * Solo devuelve las preguntas que el cliente tiene asignadas
     * Incluye question_type y campos específicos por tipo
     */
    async getQuestionsForClient(id_client: number) {
        try {
            const query = `
                SELECT
                    qc.id_question_client,
                    qc.id_question,
                    qc.id_client,
                    qc.client_price,
                    qc.client_promoter_earns,
                    qc.i_status as assignment_status,
                    qc.dt_register as assigned_at,
                    qc.dt_updated,
                    q.question,
                    q.question_type,
                    q.base_price,
                    q.promoter_earns,
                    q.is_multiple,
                    q.min_value,
                    q.max_value,
                    q.max_photos,
                    q.i_status as question_status,
                    q.dt_register as question_created_at
                FROM questions_client qc
                INNER JOIN questions q ON qc.id_question = q.id_question
                WHERE qc.id_client = ?
                AND qc.i_status = 1
                AND q.i_status = 1
                ORDER BY qc.dt_register DESC
            `;
            return await this.db.select(query, [id_client]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener una pregunta específica asignada al cliente
     * Incluye opciones si question_type = 'options'
     */
    async getQuestionForClient(id_question_client: number, id_client: number) {
        try {
            const query = `
                SELECT
                    qc.id_question_client,
                    qc.id_question,
                    qc.id_client,
                    qc.client_price,
                    qc.client_promoter_earns,
                    qc.i_status as assignment_status,
                    qc.dt_register as assigned_at,
                    qc.dt_updated,
                    q.question,
                    q.question_type,
                    q.base_price,
                    q.promoter_earns,
                    q.is_multiple,
                    q.min_value,
                    q.max_value,
                    q.max_photos,
                    q.i_status as question_status
                FROM questions_client qc
                INNER JOIN questions q ON qc.id_question = q.id_question
                WHERE qc.id_question_client = ?
                AND qc.id_client = ?
                AND qc.i_status = 1
                AND q.i_status = 1
            `;
            const result = await this.db.select(query, [id_question_client, id_client]);

            if (result.length === 0) {
                return {
                    ok: false,
                    data: null,
                    message: "Pregunta no encontrada o no asignada a este cliente"
                };
            }

            const questionData = result[0];

            // Si es tipo 'options', obtener las opciones
            if (questionData.question_type === 'options') {
                questionData.options = await this.getOptionsByQuestion(questionData.id_question);
            }

            return {
                ok: true,
                data: questionData,
                message: "Pregunta obtenida exitosamente"
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar preguntas asignadas al cliente por texto
     * Permite búsqueda parcial en el texto de la pregunta
     * Incluye question_type y campos específicos
     */
    async searchQuestionsForClient(id_client: number, searchTerm: string) {
        try {
            const query = `
                SELECT
                    qc.id_question_client,
                    qc.id_question,
                    qc.id_client,
                    qc.client_price,
                    qc.client_promoter_earns,
                    qc.i_status as assignment_status,
                    qc.dt_register as assigned_at,
                    q.question,
                    q.question_type,
                    q.base_price,
                    q.promoter_earns,
                    q.is_multiple,
                    q.min_value,
                    q.max_value,
                    q.max_photos,
                    q.i_status as question_status
                FROM questions_client qc
                INNER JOIN questions q ON qc.id_question = q.id_question
                WHERE qc.id_client = ?
                AND qc.i_status = 1
                AND q.i_status = 1
                AND q.question LIKE ?
                ORDER BY q.question ASC
            `;
            const searchPattern = `%${searchTerm}%`;
            return await this.db.select(query, [id_client, searchPattern]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener estadísticas de preguntas del cliente
     * Incluye desglose por tipo de pregunta
     */
    async getQuestionStatsForClient(id_client: number) {
        try {
            const query = `
                SELECT
                    COUNT(*) as total_questions,
                    SUM(qc.client_price) as total_price,
                    AVG(qc.client_price) as avg_price,
                    SUM(qc.client_promoter_earns) as total_promoter_earns,
                    AVG(qc.client_promoter_earns) as avg_promoter_earns
                FROM questions_client qc
                INNER JOIN questions q ON qc.id_question = q.id_question
                WHERE qc.id_client = ?
                AND qc.i_status = 1
                AND q.i_status = 1
            `;
            const result = await this.db.select(query, [id_client]);

            // Obtener desglose por tipo
            const typeQuery = `
                SELECT
                    q.question_type,
                    COUNT(*) as count
                FROM questions_client qc
                INNER JOIN questions q ON qc.id_question = q.id_question
                WHERE qc.id_client = ?
                AND qc.i_status = 1
                AND q.i_status = 1
                GROUP BY q.question_type
            `;
            const typeStats = await this.db.select(typeQuery, [id_client]);

            return {
                ...(result.length > 0 ? result[0] : {}),
                by_type: typeStats
            };
        } catch (error) {
            throw error;
        }
    }
}
