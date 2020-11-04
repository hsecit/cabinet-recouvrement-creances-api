import nodemailer from 'nodemailer'



async function sendMailPasswordInit({rEmail,rName,rPassword,change_password_url}) {

    const plain = ` welcome ${rName} ,
    to acces to ypur profile use
    user : {your email}
    password : ${rPassword}
    if you want to change password go to ${change_password_url}
    `
    
    const html = `<h1>welcome ${rName}</h1> <br> ,
    to acces to ypur profile use
    user : {your email}
    password : ${rPassword}
    if you want to change password go to ${change_password_url}
    `
   
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
    });
 
    let info = await transporter.sendMail({
      from: '"Mourad aoyoub 👻" <foo@example.com>', // sender address
      to: rEmail, // list of receivers
      subject: "Change password ✔", 
      text: plain, 
      html: html, 
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } 
  

  
  export {sendMailPasswordInit}