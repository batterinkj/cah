var Schemas = {};
Rounds = new Mongo.Collection('rounds');

Schemas.Round = new SimpleSchema({
    "game_id":{
        type: String,
        label: "Game ID"
    },
    "timer":{
        type: Number,
        label: "Round Timer"
    },
    "host_id":{
        type: String,
        label: "Host ID"
    },
    "black":{
        type:Object,
        label: "Round Black Card"
    },
    "black._id":{
        type: String,
        label: "Black Card ID"
    },
    "black.text":{
        type: String,
    },
    "black.pick":{
        type: Number,
        label: "Cards to pick this round",
    },
    "black.draw":{
        type: Number,
        label: "Number of cards to draw at beginning of round"
    },
    "status":{
        type: String,
        label: "Round Finished?",
        allowedValues: ["active","selectingWinner","finished"],
        optional: true
    },
    "whites":{
        type: [Object],
        label: "White Card IDs",
    },
    "whites.$.player_id":{
        type: String,
        label: "Player ID",
        optional:true
    },
    "whites.$.cards":{
        type: [Object],
        label: "Player cards"
    },
    "whites.$.cards.$._id":{
        type: String,
        label: "White Card ID",
        optional:true
    },
    "whites.$.cards.$.text":{
        type: String,
        label: "White Card text",
        optional:true
    },
    "winningWhites":{
        type:Object,
        label: "Winning Card ID",
        optional:true
    },
    "winningWhites.player_id":{
        type: String,
        label: "Player ID",
        optional:true
    },
    "winningWhites.cards":{
        type: [Object],
        label: "Winning Cards",
        optional:true
    },
    "winningWhites.cards.$._id":{
        type: String,
        label: "Winning Card ID",
        optional:true
    },
    "winningWhites.cards.$.text":{
        type: String,
        label: "Winning Card Text",
        optional:true
    },
  
})
        
Rounds.attachSchema(Schemas.Round);

Meteor.methods({
    "newRound":function(game){
        if(Meteor.isServer){
            //create the new round
            var players = Meteor.users.find({game_id:game._id}).fetch()
            if(game.hasOwnProperty("currentRound_id"))
                var players = _.reject(players,function(player){return player._id===Rounds.findOne({game_id:game._id}).host_id});
            var host = _.sample(players)
            //black = _.sample(Blacks.find().fetch())
            var black = _.sample(Blacks.find().fetch())
            var round_id = Rounds.insert({
                game_id: game._id,
                timer: game.timerLength||10,
                host_id: host._id,
                black: black,
                whites:[],
                status : "active"
            })
            var timer_id = Meteor.setInterval(function(){
                Rounds.update(round_id,{$inc:{timer:-1}});
                if(Rounds.findOne(round_id).timer===0) clearInterval(timer_id)
            },1000)
            Games.update(game, {$set: {currentRound_id: round_id}})
            Meteor.users.update(host,{$inc:{hostCount:1}})
            //Set the new round as the currentRound for the game
            
            //Ensure that all players have 5 cards
            var gamePlayers = Meteor.users.find({game_id:game._id}).fetch()
            for(var i = 0; i < gamePlayers.length;i++){
                var count = gamePlayers[i].whites.length
                while(count < 5 + Rounds.findOne(round_id).black.draw){
                    Meteor.users.update(gamePlayers[i]._id,{$push:
                        {whites: _.sample(Whites.find().fetch(),1)[0]},
                        $set:{submitted:false,selectedWhiteCard: [],customWhiteCard: {text:"Make your own!"}}
                    })
                    count++;
                }
            }
        }
    },
    "startSelectingWinner":function(round){
    if(Meteor.isServer){
        var selectedWhites = _.map(Meteor.users.find({game_id:round.game_id}).fetch(),
                function(i){
                    if(i.selectedWhiteCard.length===round.black.pick){
                        return _.extend({cards:i.selectedWhiteCard}, {player_id:i._id})
                    }else{ 
                        return false}})//looks for whites submitted, if player didn't submit then false
        var filteredSelectedWhites = _.filter(selectedWhites,function(val){ return val !=false}) //filters out falses
        if(filteredSelectedWhites.length>0){
            var temp = filteredSelectedWhites;//[{player_id,cards:[{_id,text}]}
            for(var i = 0; i<temp.length;i++){
                for(var j = 0; j< temp[i].cards.length;j++){
                        Meteor.users.update(temp[i].player_id,{$pull:{whites:temp[i].cards[j]}})
                }
            }
            
            
            Rounds.update(round,{$set:{status:"selectingWinner",
                                        whites:filteredSelectedWhites
                                        }
                        })
        }else{
            return "No selectedWhiteExists"
        }
    }
    },
    "playerSelectWhite":function(white){
        var user = Meteor.user()
        var pick = Rounds.findOne(Games.findOne(user.game_id).currentRound_id).black.pick;
        if(_.findWhere(user.selectedWhiteCard,{_id:white._id})){
            
        }else{
            
            if(user.selectedWhiteCard.length>=pick){
                Meteor.users.update(user._id,{$pop:{selectedWhiteCard:-1}})
            }
            Meteor.users.update(user._id,{$push:{selectedWhiteCard:white}})
        }
    },
    "playerUnselectWhite":function(white_id){
        Meteor.users.update(Meteor.userId(),{$pull:{selectedWhiteCard:{_id:white_id}}})
    },
    "selectWinningCard":function( round, hand){
        Rounds.update(round, {
            $set:{"winningWhites":hand,
        }})
    },
    "unselectWinningCard":function(round){
        Rounds.update(round, {
            $unset:{"winningWhites":{},
        }})
    },
    "selectWinner":function( round){
        var white = round.winningCard;
        var player_id = round.winningWhites.player_id //find owner of the winning card
        Meteor.users.update(player_id,{$inc: {score:1}})
        for(var i = 0; i <round.winningWhites.cards.length;i++){
            Meteor.users.update(player_id,{$pull:{whites:round.winningWhites.cards[i]}})
        }
        Rounds.update(round._id, {
            $set:{"status":"finished",
        }})

    }
})