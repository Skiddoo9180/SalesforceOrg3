@isTest
public class ZipCodeControllerTest {
    @isTest
    static void testGetCountryValues() {
        // Call the method
        Test.startTest();
        List<ZipCodeController.CountryWrapper> result = ZipCodeController.getCountryValues();
        Test.stopTest();

        // Verify the results
        System.assertEquals(2, result.size());
        System.assertEquals('Country1', result[0].label);
        System.assertEquals('C1', result[0].value);
        System.assertEquals('Country2', result[1].label);
        System.assertEquals('C2', result[1].value);
    }

    @isTest
    static void testGetZipCodeData() {
        // Mock the HTTP response
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"key1":"value1","key2":"value2"}');
        response.setStatusCode(200);

        // Create a mock HTTP callout
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator(response));

        // Call the method
        Test.startTest();
        Map<String, Object> result = ZipCodeController.getZipCodeData('12345', 'US');
        Test.stopTest();

        // Verify the results
        System.assertEquals('value1', result.get('key1'));
        System.assertEquals('value2', result.get('key2'));
    }

    // Mock HTTP response generator class
    private class MockHttpResponseGenerator implements HttpCalloutMock {
        private HttpResponse response;

        public MockHttpResponseGenerator(HttpResponse response) {
            this.response = response;
        }

        public HTTPResponse respond(HTTPRequest req) {
            return response;
        }
    }
}