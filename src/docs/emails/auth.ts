export const getPasswordResetTemplate = (
  userName: string,
  resetLink: string,
  _token: string,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperar Contraseña</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f4f4f4;
          border-radius: 10px;
          padding: 30px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background-color: #45a049;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
        .token-box {
          background-color: #f0f0f0;
          padding: 15px;
          border-left: 4px solid #4CAF50;
          margin: 20px 0;
          word-break: break-all;
        }
        .warning {
          color: #d32f2f;
          font-weight: bold;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Recuperar Contraseña</h1>
        </div>
        <div class="content">
          <h2>Hola ${userName},</h2>
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Restablecer Contraseña</a>
          </div>

          <p>O copia y pega este enlace en tu navegador:</p>
          <div class="token-box">
            ${resetLink}
          </div>

          <p class="warning">⚠️ Este enlace expirará en 1 hora por seguridad.</p>

          <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.</p>

          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getPasswordChangedTemplate = (userName: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contraseña Actualizada</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f4f4f4;
          border-radius: 10px;
          padding: 30px;
        }
        .header {
          background-color: #2196F3;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .success-icon {
          text-align: center;
          font-size: 48px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Contraseña Actualizada</h1>
        </div>
        <div class="content">
          <div class="success-icon">✅</div>
          <h2>Hola ${userName},</h2>
          <p>Tu contraseña ha sido actualizada exitosamente.</p>
          <p>Si no realizaste este cambio, contacta con soporte inmediatamente.</p>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
