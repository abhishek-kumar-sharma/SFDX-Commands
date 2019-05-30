/* eslint no-console:["error",{allow:["warn","error","log"]}] */
import { LightningElement, track } from "lwc";
import loginData from "@salesforce/apex/Login_To_Password_Manager_Controller.validateUser_Apex";
import loginDetailData from "@salesforce/apex/Login_To_Password_Manager_Controller.getLoginDetails";
export default class Login_To_Password_Manager extends LightningElement {
  /**
   * Variable section to hold all the condition and intermediate value
   * Created by Abhishek
   */
  @track user = {
    username: undefined,
    password: undefined
  };
  @track isLogin = false;
  @track hasPageError = "slds-hide";
  @track errorMessage = null;

  /**
   * Handle login button action
   *  Method to check the user record and create session if record exist
   */
  handleLogin() {
    try {
      loginData({
        username: this.user.username,
        password: this.user.password
      })
        .then(value => {
          this.hasPageError = "slds-hide";
          this.errorMessage = null;
          this.isLogin = true;
          sessionStorage.setItem("loginId", value);
          this.getDataFromApex();
        })
        .catch(error => {
          this.hasPageError =
            "slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small";
          this.errorMessage = error.body.message;
          console.error("Error ", error.body.message);
        });
    } catch (exception) {
      this.hasPageError =
        "slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small";
      this.errorMessage = exception.message;
      console.error(
        "Exception occuured while login. \n Message ::" + exception.message
      );
    }
  }

  /**
   * Method to handle the logout button action
   * This method will invalidate the active session of user
   */
  handleLogout() {
    this.hasPageError = "slds-hide";
    this.errorMessage = null;
    this.isLogin = false;
    this.user = {};
    sessionStorage.clear();
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

  /**
   * Method to get all the data from apex after login
   * Created by Abhishek Kumar Sharma
   * Created Date MAY 25,2019
   */
  getDataFromApex() {
    console.log("hello get data from apex");
    try {
      if (
        sessionStorage.getItem("loginId") !== null &&
        sessionStorage.getItem("loginId") !== undefined
      ) {
        console.log("helo");
        loginDetailData({
          userId: sessionStorage.getItem("loginId")
        })
          .then(value => {
            this.hasPageError = "slds-hide";
            this.errorMessage = null;
            console.log("hello value ==>", value);
          })
          .catch(error => {
            this.isLogin = false;
            this.hasPageError =
              "slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small";
            this.errorMessage = error.body.message;
            console.error(
              "Exception occured while setting the call back. \n Message ::" +
                error.body.message
            );
          });
      }
    } catch (exception) {
      console.error(
        "Exception occurred. Please contact System administrator for help.\n Message ::" +
          exception.message
      );
    }
  }
}
