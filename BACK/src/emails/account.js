const sgMail = require('@sendgrid/mail')

//when naming environment variables convention is to do all uppercase with underscores
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kraken.coding@topendams.com',
        subject: 'Dynamic Ward List Scratch Environment',
        //the thing below is a template string, it uses the backtick quate next to the 1 key to inject variables inside the string
        text: `Welcome to the Dynamic Ward List Scratch Environment ${name}. Thanks for giving it a go. We might shoot you an email from time to time when we have updates to the application, if you don't want to get emails from us, or if you have any suggestions for improvement or hints you want added, then please email kraken.coding@gmail.com. Thanks!`
        //can use html instead of text to do a nice email. But the dude says that text emails from web applications actually have a better response rate.
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kraken.coding@topendams.com',
        subject: 'Removed from Dynamic Ward List Scratch',
        //the thing below is a template string, it uses the backtick quate next to the 1 key to inject variables inside the string
        text: `Sorry to see you go, ${name} you have been removed from the Dynamic Ward List Scratch environment. If you have any recommendations on how we can improve the application or any rules you would like added please email kraken.coding@gmail.com`
        //can use html instead of text to do a nice email. But the dude says that text emails from web applications actually have a better response rate.
    })
}


//we have to export an object instead of the file to be able to export multiple different types of emails I assume

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
