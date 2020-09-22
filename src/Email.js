const nodemailer = require('nodemailer');
const { GMAIL_USER, GMAIL_PASS } = process.env;
const User = require('./User');

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
    }
});

module.exports.sendEmail = async event => {
    const html = event.html;
    const user = await User.getUserByEmail(GMAIL_USER);
    const newsletterSendOutTime = user.Items[0].newsletterSendOutTime;

    if (newsletterSendOutTime) {
        // send out time within the hour
        if (new Date().getTime() > newsletterSendOutTime && new Date().getTime() < (newsletterSendOutTime + 60*60*1000)) {
            await transport.sendMail({
                from: '"Reddit" <noreply@reddit.com>',
                to: GMAIL_USER,
                subject: 'Reddit Newsletter',
                html,
            });
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify(
            {
                message: "Reddit Newsletter",
            },
            null,
            2,
        ),
    };
};