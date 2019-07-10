/* eslint no-console:["error",{allow:["warn","error","log"]}] */
import { LightningElement, track } from "lwc";
import loginData from "@salesforce/apex/Login_To_Password_Manager_Controller.validateUser_Apex";
import loginDetailData from "@salesforce/apex/Login_To_Password_Manager_Controller.getLoginDetails";
import deleteRecord from "@salesforce/apex/Login_To_Password_Manager_Controller.deleteSelectedRecord";
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
  @track allloginRecords = null;
  @track dataTableColumns = [];
  @track dataTableDataLoadWait = false;
  @track isviewDetails = false;
  @track selectedRecordFromDataTable = null;

  /**  */
  connectedCallback() {
    if (sessionStorage.getItem("loginId")) {
      this.hasPageError = "slds-hide";
      this.errorMessage = null;
      this.isLogin = true;
      this.dataTableDataLoadWait = true;
      this.getDataFromApex();
    }
  }

  /**
   *  Handle login button action
   *  Method to check the user record and create session if record exist
   * Created By : Abhishek Kumar Sharma
   * Created Date : 22-MAy-2019
   */
  handleLogin() {
    try {
      loginData({
        username: this.user.username,
        password: this.user.password
      })
        .then(value => {
          if (value !== undefined && value !== null) {
            this.hasPageError = "slds-hide";
            this.errorMessage = null;
            this.isLogin = true;
            sessionStorage.setItem("loginId", value);
            this.dataTableDataLoadWait = true;
            this.getDataFromApex();
          } else {
            this.hasPageError =
              "slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small";
            this.errorMessage = "No Such user found";
          }
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
   * Created By : Abhishek Kumar Sharma
   * Created Date : 22-May-2019
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
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
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
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
   */
  getDataFromApex() {
    try {
      if (
        sessionStorage.getItem("loginId") !== null &&
        sessionStorage.getItem("loginId") !== undefined
      ) {
        loginDetailData({
          userId: sessionStorage.getItem("loginId")
        })
          .then(value => {
            if (value !== null && value !== undefined) {
              this.hasPageError = "slds-hide";
              this.errorMessage = null;
              console.log("hello value ==>", value);
              this.loadDataTable(value);
            } else {
              this.isLogin = false;
              this.hasPageError =
                "slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small";
              this.errorMessage =
                "Unable to get your data right now. Please logout and try again";
            }
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

  /**
   * Method to get all the data from apex after login
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
   */
  loadDataTable(userLoginDetails) {
    if (userLoginDetails !== null && userLoginDetails !== undefined) {
      userLoginDetails.forEach(element => {
        if (element.ECSV__isValidated__c !== true) {
          element.addClass = "redColor";
        }
      });
      console.log("userLoginDetails ==>", userLoginDetails);
      let dataTableAction = [
        { label: "View", name: "view", iconName: "action:preview" },
        { label: "Edit", name: "edit", iconName: "action:edit" },
        { label: "Delete", name: "delete", iconName: "action:delete" },
        { label: "Validate", name: "validate", iconName: "utility:sync" },
        { label: "Login", name: "login", iconName: "utility:new_window" }
      ];
      this.dataTableColumns = [
        {
          label: "Project Name",
          fieldName: "ECSV__Project_Name__c",
          type: "text",
          cellAttributes: {
            class: {
              fieldName: "addClass"
            }
          }
        },
        {
          label: "Org Name",
          fieldName: "ECSV__Organization_Name__c",
          type: "text",
          cellAttributes: {
            class: {
              fieldName: "addClass"
            }
          }
        },
        {
          label: "User Name",
          fieldName: "ECSV__User_Name__c",
          type: "text",
          cellAttributes: {
            class: {
              fieldName: "addClass"
            }
          }
        },
        {
          label: "Password",
          fieldName: "ECSV__Password__c",
          type: "text",
          cellAttributes: {
            class: {
              fieldName: "addClass"
            }
          }
        },
        {
          label: "Security Token",
          fieldName: "ECSV__Security_Token__c",
          type: "text",
          cellAttributes: {
            class: {
              fieldName: "addClass"
            }
          }
        },
        {
          label: "Is Sandbox",
          fieldName: "ECSV__isSandbox__c",
          type: "boolean",
          cellAttributes: {
            class: {
              fieldName: "addClass"
            }
          }
        },
        {
          label: "Is Salesfore Credentials",
          fieldName: "ECSV__is_Salesforce_Credentials__c",
          type: "boolean",
          cellAttributes: {
            class: {
              fieldName: "addClass"
            }
          }
        },
        {
          label: "Is Valid",
          fieldName: "ECSV__isValidated__c",
          type: "boolean",
          cellAttributes: {
            class: {
              fieldName: "addClass"
            }
          }
        },
        {
          label: "Validated On",
          fieldName: "ECSV__Validated_On__c",
          type: "date",
          cellAttributes: {
            class: {
              fieldName: "addClass"
            }
          }
        },
        {
          label: "Action",
          type: "action",
          typeAttributes: { rowActions: dataTableAction }
        }
      ];
      this.dataTableDataLoadWait = false;
      this.allloginRecords = userLoginDetails;
      console.log(userLoginDetails);
    }
  }

  /**
   * Method to get all the data from apex after login
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
   */
  handleVerifyAllCredentialsClick() {}

  /**
   * Method to get all the data from apex after login
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
   */
  handleRowButtonActions(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
      case "view":
        this.showRecordDetails(row);
        break;
      case "edit":
        this.openEditRecord(row);
        break;
      case "delete":
        this.openDeleteRecord(row);
        break;
      case "validate":
        this.validateRecord(row);
        break;
      case "login":
        this.loginToOrg(row);
        break;
      default:
        console.error(
          "Unable to match any action for data table action. Reload the page if problem still persist contact system administrator with this message"
        );
    }
  }

  /**
   * Method to get all the data from apex after login
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
   */
  showRecordDetails(selectedRow) {
    try {
      console.log("selectedRow showRecordDetails id==>", selectedRow.Id);
      this.selectedRecordFromDataTable = selectedRow;
      this.isviewDetails = true;
      let projectNameForModelHeader = selectedRow.ECSV__Project_Name__c;
      console.log(projectNameForModelHeader);
    } catch (exception) {
      console.error(
        "Exception occureed while getting the record details from data table.\n Please refresh the page and try again.\nMessage ::" +
          exception.message
      );
    }
  }

  /**
   * Method to get all the data from apex after login
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
   */
  openEditRecord(selectedRow) {
    try {
      console.log("selectedRow openEditRecord==>", selectedRow.Id);
    } catch (exception) {
      console.error(
        "Exception occurred unable to open record in edit view \n Message ::",
        exception.message
      );
    }
  }

  /**
   * Method to get all the data from apex after login
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
   */
  openDeleteRecord(selectedRow) {
    try {
      if (
        selectedRow !== null &&
        selectedRow.Id !== null &&
        selectedRow.Id !== undefined
      ) {
        console.log("selectedRow openEditRecord==>", selectedRow.Id);
        deleteRecord({
          recordId: selectedRow.Id
        })
          .then(value => {
            console.log("Deleted ==>" + value);
          })
          .catch(error => {
            console.error(
              "Exception occured while deleting the record. \n Message ::" +
                error.body.message
            );
            this.hasPageError =
              "slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small";
            this.errorMessage = error.body.message;
          });
      } else {
        this.hasPageError =
          "slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small";
        this.errorMessage = "Unable to delete record. Record not found";
      }
    } catch (exception) {
      console.error(
        "Exception occurred unable to open record in edit view \n Message ::",
        exception.message
      );
    }
  }

  /**
   * Method to get all the data from apex after login
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
   */
  validateRecord(selectedRow) {
    console.log("selectedRow validateRecord==>", selectedRow);
  }

  /**
   * Method to get all the data from apex after login
   * Created By : Abhishek Kumar Sharma
   * Created date : 23-May-2019
   */
  loginToOrg(selectedRow) {
    console.log("selectedRow loginToOrg==>", selectedRow);
  }

  /**
   * Method to close all the pop up
   * Created By : Abhishek Kumar Sharma
   * Created date : 15-June-2019
   */
  handleModalClose(event) {
    try {
      let attributName = event.target.name;
      console.log("attribute name ", attributName);
      if (attributName !== null && attributName !== undefined) {
        switch (attributName) {
          case "isviewDetails":
            this.isviewDetails = false;
            break;
          default:
            console.error(
              "Error while closing the pop up default case. Please contact system administrator with this error message"
            );
            break;
        }
      }
    } catch (exception) {
      this.hasPageError =
        "slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error sdls-m-bottom_small";
      this.errorMessage = exception.message;
      console.error(
        "Exception occuured while login. \n Message ::" + exception.message
      );
    }
  }

  verifyCredentials() {
  try{
    console.log('selectedRecordFromDataTable',JSON.stringify(this.selectedRecordFromDataTable));
    console.log('selectedRecordFromDataTable name',this.selectedRecordFromDataTable.ECSV__Project_Name__c);
  }catch(exception){
    console.error('Exception occurred while verifying the details. Contact System administrator with this message. \n Message ::',exception.message);
  }


  }

  
} // class closing
