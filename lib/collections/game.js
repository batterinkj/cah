var Schemas = {};
Games = new Mongo.Collection('games');

Schemas.Game = new SimpleSchema({
    title:{
        type: String,
        label: "Title",
        },
    creatorUser_id:{
        type:String,
        label: "userId"
        },
    password:{
        type: String,
        label: "Password",
        optional: true
        },
    currentRound_id:{
        type: String,
        label: "Current Round ID",
        optional:true
    },
    timerLength:{
        type:Number,
        label: "Timer Length",
        autoform: {
          afFieldInput: {
            type: "number"
      }
    }
    }
    
})

Games.attachSchema(Schemas.Game);


if (Meteor.isClient){
    AutoForm.hooks({
      insertGameForm:{
          before: {
            insert: function (insertDoc) {
              insertDoc = _.extend(insertDoc,{creatorUser_id:Meteor.user()._id})
              return insertDoc
            }
          },
          after: {
              insert: function(err, result){
                  Meteor.call("joinGame",result)
                  Router.go('gamePage',{_id: result});
              }
          }
      }
    });
}

Meteor.methods({
    gameDelete: function(game){
        Games.remove(game);
    }
})

Games.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId; 
  },
  update: function(userId, doc) {
    // only allow updating if you are logged in
    return !! userId; 
  },
  remove: function(userID, doc) {
    //only allow deleting if you are owner
    return doc.submittedById === Meteor.userId();
  }
});