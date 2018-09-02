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

/**
* perform batch call the delegation batch operation on a spreadsheet
* @param{String} spreadsheetId, id of a spreadsheet with the corresponding data
* @param{String} sheetName, name of the sheet where the data are stored
* there is no return the operation is done directly on the spreadsheet
**/
function performBatch(spreadsheetId, sheetName){
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var header = data.shift(); // I'm french, we like to cut our king head. Shift! Shift! Shift!
  var thirdArg = false;
  var check3Arg = function(line){
    if(line[2] !== undefined && line[2] !== ""){
      thirdArg = true;
    }
  };

  var formatExit = function (res){
    if(res === true){
      res = "Ok";
    }
    return [res];
  };
  data.forEach(check3Arg);
  var out = batchDelegations(data).map(formatExit);
  var column = thirdArg ? 4 : 3;
  sheet.getRange(2, column, out.length, 1).setValues(out);
}
