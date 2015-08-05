Template.gamesList.helpers({
    games: function(){
        return Games.find();
    },
    creator:function(){
        return (this.creatorUser_id === Meteor.user()._id);
    },
    playerName:function(){
        return Meteor.user().name;
    },
    gamePlayers:function(){
        return Meteor.users.find({game_id: this._id}).fetch()
    }
})

Template.gamesList.events({
    'click #deleteGameButton': function(){
        if(window.confirm("Are you sure you want to delete?")) Meteor.call("gameDelete",this)
    },
    'click #joinGame':function(){
        if($('#enterPlayerName').val()) Meteor.call('joinGame', this._id)
        else{
            helpers.displayError("Please Enter a Name")
        } 
    },
    'keyup #enterPlayerName':function(e,r){
        Meteor.call('updatePlayerName',e.target.value)
    }
    
})