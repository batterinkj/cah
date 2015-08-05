Template.gamePage.helpers({
    currentRound:function(){
        if(!this.hasOwnProperty("currentRound_id")) return
        return Rounds.findOne(this.currentRound_id)
    },
    creatorAndNewGame:function(){
        console.log(this);
        return (this.creatorUser_id === Meteor.userId() &&
                !this.hasOwnProperty("currentRound_id"))
    }
})

Template.gamePage.events({
    "click #startGame":function(){
        console.log(this);
        Meteor.call("newRound",this);
    }

})