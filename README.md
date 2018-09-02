# elDelegator  
## perform email delegation for Gsuite accounts  
![elDelegatorHomePage](https://i.imgur.com/zchqHQd.png)

### Install  
-  Copy the script available here: https://script.google.com/d/162qqlNzwgewITmJpXoe4p3VsIrGSZYqGDqm4jQhywaaVV31yFLIbfJoB/edit?usp=sharing
- Follow the instruction available in the script to enable it. (create a cloud console project, a service account with the correct scope enabled)

Install process can be tricky as it need a cloud console project with a service account having wide domain delegation activated.
Install process video demo can be found here: https://youtu.be/AgNPvSI0Z0w

*Note about the video:* This quick demo do not follow state of the art installation, I directly used the cloud project generated with the Google Apps Script. By default it's not attached to the domain from whom wide domine delegation need to be activated. That's the reason why I activated both services Admin API and Gmail API. Gmail API is activated to be used by the delegation function, Admin API is needed for the email autocompletion used on the UI (so it's not mandatory for the delegation function to work).
*Seconde note about the first note:* About the Admin API, you do not need to have an admin account to use it thanks to the parameter `"viewType":"domain_public"` it just seems to me that it was cool to use this feature here to autocomplete email addresses. On the Other side the Gmail API is used by a service account with wide Domain rights, so this one is really sensitive and as I directly wrote the JSON Key in the code well... If you do the same than me do not share your code with someone who you can't trust (I mean it, really!).

### About elDelegator
elDelegator do not intend to be a tool to handle your delegation but more a demo of what can be achieved with the Google Gmail Delegation API ⇒ That is only available through service account with wide domain delegation (you can't even use the API with your own account....).
