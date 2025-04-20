import bcrypt from 'bcrypt';

export const hash_password = async (password_unsecured: string): Promise<string> => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password_unsecured, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error al hashear la contraseña:', error);
        throw error;
    }
}