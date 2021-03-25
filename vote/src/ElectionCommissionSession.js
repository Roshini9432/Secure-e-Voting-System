var ElectionCommissionSession = (function() {
    var electionCommission_id = "";
  
    var getOfficer = function() {
      return electionCommission_id;    
    };
  
    var setOfficer = function(election_commission_id) {
      electionCommission_id = election_commission_id;     
    };
  
    return {
      getOfficer: getOfficer,
      setOfficer: setOfficer
    }
  
  })();
  
  export default ElectionCommissionSession;