public class CaseFlowHandler {
    @InvocableMethod(label = 'setCaseAssignmentRuleHeader' description = 'Sets up the DML option to fire the Assignment rule')
    public static void caseAssignmentRules(List<Id> caseIds) {
        if (caseIds == null || caseIds.isEmpty()) {
            throw new IllegalArgumentException('Case IDs cannot be null or empty.');
        }

        Database.DMLOptions dmlOption = new Database.DMLOptions();
        dmlOption.assignmentRuleHeader.useDefaultRule = true;

        try {
            List<Case> casesToUpdate = [SELECT Id FROM Case WHERE Id IN :caseIds];
            if (casesToUpdate.isEmpty()) {
                throw new IllegalArgumentException('No cases found for the provided IDs.');
            }
            for (Case caseRecord : casesToUpdate) {
                caseRecord.setOptions(dmlOption);
            }
            Database.update(casesToUpdate, false);
        } catch (Exception e) {
            System.debug('Error in caseAssignmentRules: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while setting the case assignment rule: ' + e.getMessage());
        }
    }
}