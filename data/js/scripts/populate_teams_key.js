module.exports = {
  populate: function(){
    var arr = {};
      for(var i = 0; i < results.length; i++){
        if(!(arr[results[i].awayNickname])){
          arr[results[i].awayNickname] = results[i].awayTeam;
        }
      }
      // console.log(arr)
    }
  }
