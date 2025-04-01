import { LightningElement ,wire,api} from 'lwc';
import SampleMC from '@salesforce/messageChannel/zipCodeMessageChannel__c'
import { publish,subscribe,unsubscribe,createMessageContext,MessageContext } from 'lightning/messageService';

export default class ZipCodeParentCompUnrelated extends LightningElement {

    countryName;
    postCode;
    state;

    @wire (MessageContext)
    context;

    isSubscribed = false;
    connectedCallback() {
        subscribe(this.context, SampleMC, (message) => {
            console.log('***message***'+JSON.stringify(message));
            this.setValuesToRender(message);
        });
    }
    setValuesToRender(message)
    {
        this.postCode =message.lmsData["post code"];
        this.countryName =message.lmsData["country"];
        this.state =message.lmsData["places"][0].state;
    }
}


// system.debug(+Country__mdt.getAll().values());

// system.debug(+ZipCodeController.getCountryValues());


//  String apiUrl = 'http://api.zippopotam.us/us/90210';
//         Http http = new Http();
//         HttpRequest request = new HttpRequest();
//         request.setEndpoint(apiUrl);
//         request.setMethod('GET');
//         HttpResponse response = http.send(request);
//         Map<String, Object> responseData = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            
//             system.debug('***responseData***'+responseData);