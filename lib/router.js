Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: "waiting",
})

var defaultWaitOn = function () {
        return [Meteor.subscribe('rounds'),Meteor.subscribe('players')];
    }

Router.route('/', function () {
    if(Meteor.user() && Meteor.user().hasOwnProperty("game_id")){
        this.redirect('/games/'+Meteor.user().game_id)
    }else if(Meteor.user()){
        this.render('gamesList');   
    }else{
        this.render('intro');
      }
    },{
        name:"home"
    });

Router.route('/gameNew', {
    name: 'gameNew'
})

Router.route('/games/:_id', {
    name: 'gamePage',
    data: function(){
        var game = Games.findOne(this.params._id);
        if(!game) this.redirect("/")
        else return game ;},
    waitOn: defaultWaitOn,
})