const sgMail =  require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to : email,
        from : 'estheribeh2001@gmail.com',
        subject : "Thanks for signing up!",
        text : `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to : email,
        from : "estheribeh2001@gmail.com",
        subject : "Goodbye!",
        text : `We hate to see you go, ${name}. Please let us know if there is anything we could have done to keep you`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}