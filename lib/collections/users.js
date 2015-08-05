/*
    "name":{
        type: String,
        label: "Player Name"
    },
    "game_id":{
        type: String,
        label: "Game ID"
    },
    "whites":{
        type: [Object],
        label: "White Card IDs",
    },
    "whites.$._id":{
        type: String,
        label: "White Card ID"
    },
    "whites.$.text":{
        type: String,
        label: "White Card text"
    },
    "score":{
        type: Number,
        label: "Score"
    },
    "hostCount":{
        type: Number,
        label: "Number of times player has been host in this game"
    },
    "customWhiteCard":{
        type: Object
    },
    customWhiteCard.text":{
        type: String
    },
    "selectedWhiteCard":{
        type: [Object]
    },
    "selectedWhiteCard.$.text":{
        type: String
    },
    "selectedWhiteCard.$._id":{
        type: String
    },
    submitted:{
        type: boolean,
        label: "has the player confirmed submission"
    }
    }
    
*/


Meteor.users.deny({
  update: function() {
    return true;
  }
});

Meteor.methods({
    "joinGame":function(game_id){
        Meteor.users.update(Meteor.userId(), 
          {$set:{
              score:0,
              game_id:game_id,
              whites: Meteor.call("randomWhites",5),
              customWhiteCard: {text:"Make your own!"},
              selectedWhiteCard: [],
              hostCount: 0,
              submitted: false
            }
          })
        if(Meteor.isClient){
            Router.go('gamePage',{_id: game_id})
        }
    },
    "leaveGame":function(game,round){
        var unsetOptions ={$unset:{score:"",game_id:"",submitted: "",whites:"",hostCount:"",selectedWhiteCard:"",customWhiteCard:"",}}
        if(_.isEmpty(game)){
            Meteor.users.update(Meteor.user(),unsetOptions)
        }
        if(!game.hasOwnProperty("currentRound_id")&&Meteor.userId()===game.creatorUser_id){
            Meteor.users.update({game_id:game._id},unsetOptions,{multi:true})
            Meteor.call("gameDelete",game)
        }else if(!game.hasOwnProperty("currentRound_id")){
            Meteor.users.update(Meteor.userId(),unsetOptions)
        }else if(round.host_id === Meteor.userId()){
            Meteor.users.update(Meteor.userId(),unsetOptions)
            if(Meteor.users.find({game_id:round.game_id}).length > 0 ){
                Rounds.update(round._id,{$set:{host_id: _.sample(Meteor.users.find({game_id:round.game_id}).fetch())._id}})
            }
        }else{
            Meteor.users.update(Meteor.userId(),unsetOptions)
        }
    },
    "updatePlayerName":function(name){
        Meteor.users.update(Meteor.userId(),{$set:{name:name}})
    },
    "updatePlayerCustomWhiteCard":function(text){
        Meteor.users.update(Meteor.userId(),{$set:{customWhiteCard:{text:text}}})
    },
    "playerConfirmSelectedCards":function(){
        Meteor.users.update(Meteor.userId(),{$set:{submitted:true}})
    },
    "playerChangeSelectedCards":function(){
        Meteor.users.update(Meteor.userId(),{$set:{submitted:false}})
    }
})