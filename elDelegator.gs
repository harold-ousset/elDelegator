/*
Copyright 2018 Harold Ousset
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
*
* elDelegator documentation:
* https://github.com/harold-ousset/elDelegator
*
* Script link:
* https://script.google.com/d/162qqlNzwgewITmJpXoe4p3VsIrGSZYqGDqm4jQhywaaVV31yFLIbfJoB/edit?usp=sharing
*
* activate the Admin API in the apps script project (needed for email autocomplete)
*
* Google API documentation
* https://developers.google.com/gmail/api/v1/reference/users/settings/delegates
*
* Require w2d library: https://github.com/harold-ousset/w2d
*
* Activate wide domaine delegation scopes for the w2d project:
* - https://mail.google.com/
* - https://www.googleapis.com/auth/gmail.settings.sharing
*
**/

/**
* retrieve the list of the delegated users for a delegated mailbox
* @param {String} userId, the email address of the delegated mailbox
* @return {Array} the list of the delegated users [{delegateEmail,verificationStatus}]
**/
function listDelegations(userId) {
  userId = userId || Session.getActiveUser().getEmail();
  var scopes = ["https://mail.google.com/"];
  var url = 'https://www.googleapis.com/gmail/v1/users/'+userId+'/settings/delegates';
  
  var w2dInstance = new w2d(userId,scopes,jsonKey);
  var token = w2dInstance.getToken().token;
  
  var method = 'get';
  var param = {
    method      : method,
    headers: {"Authorization": "Bearer " + token},
    muteHttpExceptions:true,
  };
  var result = UrlFetchApp.fetch(url, param);
  if(result.getResponseCode() ===  200){
    var res = JSON.parse(result.getContentText());
    res.delegates = res.delegates || [];
    return res.delegates;
  }
  else{
    throw 'could not finish listing the delegations for '+userId+' : '+result.getContentText(); 
  }
}

/**
* create a gmail delegation
* @param{String} delegator, email address of the account granting access to his mailbox
* @param{String} delegated, email address of the account allowed to see the mail from the delegator
**/
function addDelegation(delegator, delegated){
  delegator = delegator || Session.getActiveUser().getEmail();
  var scopes = ["https://www.googleapis.com/auth/gmail.settings.sharing"];
  var url = 'https://www.googleapis.com/gmail/v1/users/'+delegator+'/settings/delegates';
  
  var w2dInstance = new w2d(delegator,scopes,jsonKey);
  var token = w2dInstance.getToken().token;
  
  var method = 'post';
  
  var payload = {delegateEmail:delegated};
  var param = {
    method: method,
    contentType: 'application/json',
    headers: {"Authorization": "Bearer " + token},
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  var result = UrlFetchApp.fetch(url, param);
  if(result.getResponseCode() ===  200){
    return true;
  }
  else if(result.getResponseCode() ===  409){
    var res = JSON.parse(result.getContentText());
    try{
      if(res.error.errors[0].reason === "alreadyExists"){
        return true;
      }
    }
    catch(err){}
  }
  throw 'could not finish creating the delegations for '+delegator+' : '+result.getContentText(); 
}

/**
* remove a gmail delegation
* @param{String} delegator, email address of the account granting access to his mailbox
* @param{String} delegated, email address of the account allowed to see the mail from the delegator
**/
function removeDelegation(delegator, delegated){
  delegator = delegator || Session.getActiveUser().getEmail();
  var scopes = ["https://www.googleapis.com/auth/gmail.settings.sharing"];
  var url = 'https://www.googleapis.com/gmail/v1/users/'+delegator+'/settings/delegates/'+delegated;
  
  var w2dInstance = new w2d(delegator,scopes,jsonKey);
  var token = w2dInstance.getToken().token;
  
  var method = 'DELETE';
  
  var param = {
    method: method,
    contentType: 'application/json',
    headers: {"Authorization": "Bearer " + token},
    muteHttpExceptions: true,
  };
  var result = UrlFetchApp.fetch(url, param);
  if(result.getResponseCode() ===  204){
    return true;
  }
  throw 'could not finish removing the delegations for '+delegator+' : '+result.getContentText(); 
}
