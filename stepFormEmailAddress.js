/* eslint-disable no-console */
import { LightningElement, track, api } from 'lwc';
import searchEmail_Apex from '@salesforce/apex/Step_Form_Controller_For_First_Step.searchInputtedEmailAddress_Apex'; // calling the apex method to search inputted email is available or not
import first_step_Label_Apex from '@salesforce/label/c.Apply_to_be_STEP_Member_Step_Form_First_step_Label';

export default class stepFormEmailAddress extends LightningElement {
    first_step_Label = first_step_Label_Apex;

    @api commonDataToAllComponent = {}; // Shared attribute to all component for handling the data
    @track userInputtedEmail; // variable to store the inputted email address
    @track enableNextButton = false; // variable to enable/disable next button
    @track showSpinnerStepOne = false; // variable to show/hide the spinner
    @track errorMessage = null; // variable to hold the error message
    @track notificationDivClass = 'slds-hide';
    @track showError = false;

    /**
     * Method to initialized the next button
     * Created Date : 15-Nov-2019
     * Created By   : Abhishek
     */
    connectedCallback() {
        try {
            /**
             * Setting up the email from from previous step if exist
             */
            if (this.commonDataToAllComponent.step1Data !== null && this.commonDataToAllComponent.step1Data !== undefined) {
                this.userInputtedEmail = this.commonDataToAllComponent.step1Data.data.inputtedEmail;
                this.enableNextButton = true;
            }
        } catch (e) {
            console.error('Exception occurred in connected call back of step first. \n Message ::', e.message);
        }
    }

    /**
     * Handler method to set the input value of email address field 
     * Parameter : event for accessing the value
     * created date : 14-Nov-2019
     * created by : Abhishek
     */
    setInputValue(event) {
        try {
            if (event.target.value !== null && event.target.value !== undefined && event.target.value.trim() !== "" && this.template.querySelector(".input").validity.valid) {
                this.userInputtedEmail = event.target.value;
                this.enableNextButton = true;
            }
            if (this.template.querySelector(".input").validity.valid === false) {
                this.enableNextButton = false;
            }
        } catch (e) {
            console.error('Error occurred while setting the input. \n Message :: ', e.message);

        }
    }

    /**
     * Method to handle the next button click on step 1 In this we are sending the inputted email email address to apex method
     * Parameter : event use to prevent the default operation of button
     * created date : 15-Nov-2019
     * created by : Abhishek
     */
    handleNextButtonClickOnStepFirst() {
        try {
            /**
             * Calling apex method to check email is available in salesforce or not
             */
            this.showSpinnerStepOne = true;
            this.notificationDivClass = undefined;
            this.showError = false;

            searchEmail_Apex({ inputtedEmail: this.userInputtedEmail })
                .then(result => {
                    console.log('email search result step one ==>', result);
                    //let fireNextStepCustomEvent = true; // attribute to hold the firing status of event for next step;
                    if (result !== null && result !== undefined && result.isSuccess === true && result.isSTEPApplicant === false && result.isEmailFound === false && result.isGeneralContact === false && result.fireNextEventWithData === false && result.fireNextEventWithoutData === true) {
                        /** Case 1 when email not found in org*/
                        //this.notificationDivClass = 'slds-notify slds-box slds-notify_alert slds-theme_alert-texture slds-theme_warning sdls-m-bottom_small';
                        //this.errorMessage = result.message;
                        //this.showError = true;
                        //fireNextStepCustomEvent = true; // checked (1)

                        let eventData = {}; // Local variable to store the event data only. We are using this data on parent event handler method
                        eventData.progressBarNextStep = 1;
                        eventData.data = result;
                        this.showSpinnerStepOne = false;
                        const onclickFirstStepEvent = new CustomEvent('firststep', { detail: eventData });
                        this.dispatchEvent(onclickFirstStepEvent);

                    } else if (result !== null && result !== undefined && result.isSuccess === true && result.isSTEPApplicant === true && result.isEmailFound === true && result.isGeneralContact === false && result.fireNextEventWithData === false && result.fireNextEventWithoutData === false) {
                        /** Case 2 application form filled and submitted */
                        this.notificationDivClass = 'slds-notify slds-box slds-notify_alert slds-theme_alert-texture slds-theme_warning sdls-m-bottom_small';
                        this.errorMessage = result.message;
                        this.showError = true;
                        //fireNextStepCustomEvent = false; // checked (2)
                    } else if (result !== null && result !== undefined && result.isSuccess === true && result.isSTEPApplicant === true && result.isEmailFound === true && result.isGeneralContact === false && result.fireNextEventWithData === true && result.fireNextEventWithoutData === false) {
                        /** Case 3 when applicant left the data in mid and come back  */
                        //this.notificationDivClass = 'slds-notify slds-box slds-notify_alert slds-theme_alert-texture slds-theme--warning sdls-m-bottom_small';
                        //this.errorMessage = result.message;
                        //this.showError = true;
                        //fireNextStepCustomEvent = true; // with data mapping
                        let eventData = {}; // Local variable to store the event data only. We are using this data on parent event handler method
                        eventData.progressBarNextStep = result.Last_Active_Step;
                        eventData.data = result.previouslyFilledData;
                        const mapPreviousValues = new CustomEvent('mappreviousvalues', { detail: eventData });
                        this.dispatchEvent(mapPreviousValues); // checked (3)
                    } else if (result !== null && result !== undefined && result.isSuccess === true && result.isSTEPApplicant === false && result.isEmailFound === true && result.isGeneralContact === true && result.fireNextEventWithData === false && result.fireNextEventWithoutData === true) {
                        let eventData = {}; // Local variable to store the event data only. We are using this data on parent event handler method
                        eventData.progressBarNextStep = 1;
                        eventData.data = result;
                        this.showSpinnerStepOne = false;
                        const onclickFirstStepEvent = new CustomEvent('firststep', { detail: eventData });
                        this.dispatchEvent(onclickFirstStepEvent); // checked (4) general contact
                    } else if (result !== null && result !== undefined && result.isSuccess === true && result.isSTEPApplicant === false && result.isEmailFound === true && result.isGeneralContact === false && result.fireNextEventWithData === false && result.fireNextEventWithoutData === false) {
                        this.notificationDivClass = 'slds-notify slds-box slds-notify_alert slds-theme_alert-texture slds-theme_warning sdls-m-bottom_small';
                        this.errorMessage = result.message;
                        this.showError = true;
                    }


                    this.showSpinnerStepOne = false;
                })
                .catch(error => {
                    console.error('Error occurred in handle next button click method. \n Message ::', error);
                })
        } catch (e) {
            console.error('Exception occurred while searching the email in salesforce. \n Message ::', e.message);
        }
    }
}