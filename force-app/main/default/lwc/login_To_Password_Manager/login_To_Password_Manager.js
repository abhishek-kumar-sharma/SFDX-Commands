/* eslint no-console:["error",{allow:["warn","error","log"]}] */
import { LightningElement, track } from "lwc";
import loginData from "@salesforce/apex/Login_To_Password_Manager_Controller.validateUser_Apex";
export default class Login_To_Password_Manager extends LightningElement {
  /**
   * Created by Abhishek
   */
  @track user = {
    username: undefined,
    password: undefined
  };
  @track hasPageError = 'slds-hide';
  @track errorMessage = null;

  /**
   * Handle login button
   */
  handleLogin() {
    try {
      console.log("user data ==>", this.user.username);
      console.log("user data ==>", this.user.password);
      loginData({
        username: this.user.username,
        password: this.user.password
      })
        .then(value => {
            this.hasPageError = 'slds-hide';
            this.errorMessage = null;
          console.log("value -->", value);
        })
        .catch(error => {
            this.hasPageError = 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small';
            this.errorMessage = error.body.message;
          console.log("Error ", error.body.message);
        });
    } catch (exception) {
        this.hasPageError = 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small';
        this.errorMessage = exception.message;
      console.error(
        "Exception occuured while login. \n Message ::" + exception.message
      );
    }
  }

  /**
   * Handler method to set the input value , name must be same as UI
   */
  setInputValue(event) {
    if (
      event.target.value !== null &&
      event.target.value !== undefined &&
      event.target.value.trim() !== ""
    ) {
      this.user[event.target.name] = event.target.value;
    }
  }
}
