Template.header.helpers({
    noCurrentGame:function(){
        if(Meteor.user() && Meteor.user().game_id){
            return false
        }else{
            return true
        }
    }
})

Template.header.events({
    "click #logoutButton":function(){
        Meteor.logout(function(){
            Router.go('home')
        })
    },
    "click #leaveGame":function(){
        Meteor.call("leaveGame", 
                    this,
                    Rounds.findOne(this.currentRound_id),
                    function(){
                        Router.go("/")
                    })
        
    }
})