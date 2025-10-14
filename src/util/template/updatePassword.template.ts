interface UpdatePasswordProps {
    name: string;
    link: string;
}

export const UpdatePasswordTemplate = (data: UpdatePasswordProps) => {
    return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
        <h1 style="color: #2c3e50;">Hola ${data.name}</h1>
        <p>Has recibido este correo porque recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Si no solicitaste este cambio, por favor, ignora este correo.</p>
        <p>Si solicitaste este cambio, por favor, haz clic en el enlace siguiente para restablecer tu contraseña:</p>
        <a 
            href="${data.link}" 
            style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #3498db;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
                font-weight: bold;
            "
        >Restablecer Contraseña</a>
        <p style="margin-top: 30px;">Saludos,<br/>El equipo de MonterPlace</p>
    </div>
    `
}
