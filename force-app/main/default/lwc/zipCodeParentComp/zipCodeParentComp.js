import { LightningElement,track,api,wire } from 'lwc';
import getCountry from '@salesforce/apex/ZipCodeController.getCountryValues';
import getZipCodeData from '@salesforce/apex/ZipCodeController.getZipCodeData';
import SampleMC from '@salesforce/messageChannel/zipCodeMessageChannel__c'
import { publish,subscribe,unsubscribe,MessageContext } from 'lightning/messageService';
import { createRecord } from 'lightning/uiRecordApi';
import ZIPCODE_OBJECT from '@salesforce/schema/ZipCode__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ZipCodeParentComp extends LightningElement 
{
    @track countryName;
    selectedCountry=undefined;
    zipcode=undefined;

    @wire (MessageContext)
    context;

    @wire(getCountry,{})
    getCountryVal({data,error})
    {
    if(data)
    {
        console.log('***data***'+JSON.stringify(data));
        this.countryName = data;
    }
    if(error)
    {
        console.log('***error***'+error);
    }
    }
    get isDisabled()
    {
        return (this.zipcode == undefined && this.selectedCountry ==undefined) ? true :false;
    }
    countrySelectionHandler(event)
    {
        this.selectedCountry=event.target.value;
         console.log('***selectedCountry***'+this.selectedCountry);

    }

    handleZipChange(event)
    {
        console.log('***event***'+event.target.value);
        this.zipcode = event.target.value;
    
    }
    handleSubmit()
    {
        if(this.zipcode && this.selectedCountry)
        {
            getZipCodeData({zipcode:this.zipcode,country:this.selectedCountry})
            .then((data)=>{
                console.log('***data***'+JSON.stringify(data));
                this.validateResponse(data);
            })
            .catch((error)=>{
                console.log('***error***'+error);
            })
        }
        else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error calling Api Service',
                    message: 'Please fill the required fields',
                    variant: 'error',
                }),
            );
        }

    }
    validateResponse(data)
    {

        if(data.country === 'United States')
        {
            const message = {
            lmsData: data,
            };
            publish(this.context, SampleMC, message);
        }
        else
        {
            this.createZipCodeRecords(data);
        }
    }

    createZipCodeRecords(data)
    {
        const fields = {};
        fields['Name'] = data["post code"] + 'test';
        fields['country__c'] = data["country"];
        fields['country_abbreviation__c'] = data["country abbreviation"];
        // fields['Places__latitude__s'] = data["places"][0].latitude;
        // fields['Places__longitude__s'] = data["places"][0].longitude;
        const recordInput = { apiName: ZIPCODE_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(account => {
                this.accountId = account.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Zip Record created 11',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }
}