const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/sendEmail', async function (req, res) {
    try {
        let user_email = req.body.email; // Received email from the client
        console.log(user_email);

        let number = Math.floor(Math.random() * 1000000) + 100000;
        if (number > 1000000) {
            number = number - 100000;
        }

        console.log(number);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            host: 'smtp.gmail.com',
            secure: false,
            requireTLS: true,
            auth: {
                user: '9726283@gmail.com',
                pass: 'tjgml0208',
            },
        });

        // Send mail
        let info = await transporter.sendMail({
            from: '9726283@gmail.com',
            to: user_email,
            subject: 'Jada 인증번호',
            text: String(number),
        });

        let checkemail = {
            number: number,
        };

        res.json(checkemail);
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});