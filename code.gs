/**
* launch the html page
*
**/
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

/**
* retrieve a small list of user from the platform that the email start with the designed pattern
* @param{String} pattern, the begining of the email that need to be retrieved
* @return{Array} the short list of email address (less than 10)
**/
function getUserList(pattern){
  var optionalArgs = {"customer":"my_customer", "viewType":"domain_public", "query":"email:"+pattern+"*", "maxResults":10, "fields":"users/primaryEmail"};
  var result = AdminDirectory.Users.list(optionalArgs);
  var getPrimaryEmail = function(user){return user.primaryEmail;};
  var out = result.users.map(getPrimaryEmail);
  return out;
}
