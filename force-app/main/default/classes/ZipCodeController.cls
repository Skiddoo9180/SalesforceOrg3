public with sharing class ZipCodeController {
    public class CountryWrapper {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String value;
    }

    @AuraEnabled(Cacheable=true)
    public static List<CountryWrapper> getCountryValues() {
        List<CountryWrapper> countryList = new List<CountryWrapper>();
        try {
            for (Country__mdt c : Country__mdt.getAll().values()) {
                CountryWrapper cnt = new CountryWrapper();
                cnt.label = c.label;
                cnt.value = c.Value__c;
                countryList.add(cnt);
            }
        } catch (Exception e) {
            System.debug('Error fetching country values: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while fetching country values.');
        }
        return countryList;
    }

    @AuraEnabled(Cacheable=true)
    public static Map<String, Object> getZipCodeData(String zipcode, String country) {
        Map<String, Object> responseData = new Map<String, Object>();
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('callout:ZipCode/' + country + '/' + zipcode);
            request.setMethod('GET');
            HttpResponse response = http.send(request);

            if (response.getStatusCode() == 200) {
                responseData = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            } else {
                throw new AuraHandledException('Failed to fetch zip code data. Status code: ' + response.getStatusCode());
            }
        } catch (Exception e) {
            // Log the exception
            System.debug('Error fetching zip code data: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while fetching zip code data.');
        }
        return responseData;
    }
}