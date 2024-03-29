const nodemailer = require("nodemailer");

exports.sendMail = async(options) => {
    // 1 Create the transporter that transports the email from the nodejs server to the user
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2 Create the mail options 
    const mailOptions = {
        from: "Farah Ghazal <trainee@techlarious.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3 send the mail
    await transporter.sendMail(mailOptions);
};