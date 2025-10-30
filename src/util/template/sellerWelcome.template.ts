export const SellerWelcomeTemplate = (name: string, adminLink: string) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #2563eb;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    background-color: #f9fafb;
                    padding: 30px;
                    border-radius: 0 0 5px 5px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #2563eb;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>¡Bienvenido a MonterPlace!</h1>
                </div>
                <div class="content">
                    <h2>Hola ${name},</h2>
                    <p>¡Gracias por registrarte como vendedor en MonterPlace!</p>
                    <p>Tu cuenta ha sido creada exitosamente. Para acceder al panel de administrador y comenzar a gestionar tus productos, por favor haz clic en el siguiente enlace:</p>
                    <div style="text-align: center;">
                        <a href="${adminLink}" class="button">Acceder al Administrador</a>
                    </div>
                    <p>También puedes copiar y pegar este enlace en tu navegador:</p>
                    <p style="background-color: #e5e7eb; padding: 10px; border-radius: 5px; word-break: break-all;">
                        ${adminLink}
                    </p>
                    <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
                    <p>¡Bienvenido a bordo!</p>
                    <p><strong>El equipo de MonterPlace</strong></p>
                </div>
                <div class="footer">
                    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
