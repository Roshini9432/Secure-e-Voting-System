var UserSession = (function() {
    var user_voter_id = "";
  
    var getUser = function() {
      return user_voter_id;    // Or pull this from cookie/localStorage
    };
  
    var setUser = function(voter_id) {
      user_voter_id = voter_id;     
      // Also set this in cookie/localStorage
    };
  
    return {
      getUser: getUser,
      setUser: setUser
    }
  
  })();
  
  export default UserSession;