Template.gameScores.helpers({
    playerRoundStatus:function(){
        var game = Template.parentData(1);
        if(!game) return
        if(!game.hasOwnProperty("currentRound_id")) return 'Waiting'
        var round = Rounds.findOne(game.currentRound_id);
        if(round.host_id===this._id){//is host or not
            return "Host";
        }else if(this.submitted){//has submitted card or not
            return "Submitted";
        }else{
            return "Waiting"
        }
    },
    playerScore:function(){
        return this.score;
    },    
    currentGameName:function(){
        return Games.findOne(Meteor.user().game_id).title
    },
    players: function(){
        return Meteor.users.find({game_id:this._id}).fetch()
    },    
    notHostAndRoundActive: function(){
        var game = this;
        if(!game.hasOwnProperty("currentRound_id")) return false
        var round = Rounds.findOne(game.currentRound_id)
        return (round.host_id !== Meteor.user()._id && round.status === "active");
    },
})