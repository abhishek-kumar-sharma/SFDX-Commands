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
    public static String validateUser_Apex(){
        try{
            return null;
        }catch(Exception exce){
            System.debug('Exception occurred while validating the user. \n Message ::'+exce.getMessage()+'\n Cause ::'+exce.getCause()+'\n Line Number ::'+exce.getLineNumber());
            throw new loginException('Unable To Login '+exce.getMessage());
        }
    }
}


