helpers = {
        displayError: function(error,time){
                var time = time||3000
                $('#errorMessages').html(error)
                setTimeout(function(){$('#errorMessages').html("")},time)
        },
        allPlayersConfirmed: function(round){
            var players = Meteor.users.find({game_id:round.game_id}).fetch();
            var unsubmitted = _.reject(players,function(player){
                return player.submitted || round.host_id===player._id;
            })
            return unsubmitted.length===0
        },
        playersConfirmed:function(round){
            var players = Meteor.users.find({game_id:round.game_id}).fetch();
            var submitted = _.reject(players,function(player){
                return !player.submitted || round.host_id===player._id;
            })
            return submitted.length 
        }
}
Template.registerHelper("host", function(){
        return Rounds.findOne(Games.findOne(Meteor.user().game_id).currentRound_id).host_id === Meteor.user()._id;
    })