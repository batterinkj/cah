Meteor.publish('games',function(){
      return Games.find();
    });
    
/*******FIX - still publishing all players*/
/*Meteor.publish('players',function(){
      return Players.find();
})*/
    
    
Meteor.publish('rounds',function(){
      return Rounds.find()
})
/*
Meteor.publish('blacks',function(){
      return Blacks.find()
})

Meteor.publish('whites',function(){
      return Whites.find();
})    
*/
Meteor.publish('players',function(){
  var options = {fields: {game_id: 1, name:1,score:1,hostCount:1}};
  return Meteor.users.find({},options);
})

Meteor.publish('playersOwnWhites',function(){
      var options= {fields:{whites:1,selectedWhiteCard:1,customWhiteCard:1}}
      return Meteor.users.find({_id:this.userId},options)
})

Meteor.publish('playersSelectedWhites',function(){
      var options= {fields:{submitted:1}}
      return Meteor.users.find({},options)
})
