import Client from 'node-mjml-mustache-nodemailer'
 
var config = {
  // Default mail sender
  default_from: 'jean.pierre@bern.ard',
  // If true, template content are stored in memory
  // Default to process.env.NODE_ENV === 'production' ? true : false
  cache: false,
   smtp: {
    host: '127.0.0.1',
    port: 1025
  },
  // Use partials widh mustache
  partials: {
    my_template_name: 'My template str'
  }
};
 
var client = new Client(config);

// Set template file path
var template_path = './welcome.mjml.mustache';
var template_data = { username: 'jean pierre' };
 
client.sendMail(template_path, template_data, {
  to: 'test@test.tld',
  from: 'jean.pierre@bern.ard',
  subject: 'Hello'
  // See [nodemailer options for more](https://github.com/nodemailer/nodemailer#tldr-usage-example)
}).then(function(infos){
  // Email is sent
}, function(err){
  // an error was occured
});