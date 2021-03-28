var UserSession = (function() {
    var user_voter_id = "";
  
    var getUser = function() {
      return user_voter_id;    
    };
  
    var setUser = function(voter_id) {
      user_voter_id = voter_id;     
    };
  
    return {
      getUser: getUser,
      setUser: setUser
    }
  
  })();
  
  export default UserSession;