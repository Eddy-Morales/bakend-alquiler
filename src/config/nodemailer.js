import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    },
    tls: {
        rejectUnauthorized: false // Soluciona el error de "self-signed certificate"
    }
});

const sendMailToRegister = (userMail, token) => {

    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "SmartVET -🐶 😺",
        html: `<p>Hola, haz clic <a href="${process.env.URL_FRONTEND}confirm/${token}">aquí</a> para confirmar tu cuenta.</p>
        El equipo de SmartVET te da la más cordial bienvenida.
        `
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
        }
    })
}

export {
    sendMailToRegister,
    sendMailToRecoveryPassword
}