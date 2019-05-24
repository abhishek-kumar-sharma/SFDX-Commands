public with sharing class Login_To_Password_Manager_Controller {
    public class loginException extends Exception {}
    /**
        * Created By : Abhishek Kumar Sharma
        * Created Date : 23-05-2019
        * Description : This will going to receive two parameter 
            *************************
            Param 1 - 
                name : username
                type : String
            Param 2 - 
                name : password
                type : String
    */
    @AuraEnabled
    public static String validateUser_Apex(String username, String password){
        try{
            if (String.isNotBlank(username) && String.isNotBlank(password)) {
                if (!Schema.sObjectType.ECSV__Login__c.fields.ECSV__User_Name__c.isAccessible() || !Schema.SObjectType.ECSV__Login__c.fields.ECSV__Password__c.isAccessible()) {
                    throw new loginException('You are not allowed to login.Please contact System Administrator');
                }else{
                    String query = 'SELECT Id,ECSV__User_Name__c,ECSV__Password__c FROM ECSV__Login__c WHERE ECSV__User_Name__c =:username AND ECSV__Password__c =:password LIMIT 1';
                    List<ECSV__Login__c> loginDetails = new List<ECSV__Login__c>();
                    loginDetails = Database.query(query);
                    if (loginDetails.size() > 0) {
                        return String.valueOf(loginDetails[0].Id);
                    }else{
                        throw new loginException('User Doesn\'t exist');
                    }
                }
            }else{
                throw new loginException('Username or password cannot be blank');
            }
        }catch(Exception exce){
            System.debug('Exception occurred while validating the user. \n Message ::'+exce.getMessage()+'\n Cause ::'+exce.getCause()+'\n Line Number ::'+exce.getLineNumber());
            throw new loginException('Unable To Login '+exce.getMessage());
        }
    }
}


