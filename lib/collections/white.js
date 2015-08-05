var Schemas = {};
Whites = new Mongo.Collection('whites');

Schemas.Whites = new SimpleSchema({
    text:{
        type: String,
        label: "Text",
        unique: true
    },
    deck:{
        type:String,
        label: "Deck the cards are from"
    },
    deckRating:{
        type:String,
        label: "Content rating for the deck"
    }
})
        
Whites.attachSchema(Schemas.Whites);

Meteor.methods({
      reloadWhites: function() {
      if(Meteor.isServer){
        Whites.remove({});
        var test = Assets.getText('white_cards.csv').split("\n");
        for(var i = 0; i < test.length;i++){
                var temp = test[i].split('::');
                Whites.insert({"text":temp[0],"deck":temp[1],"deckRating":temp[2]})
        }
      }
      },
      randomWhites: function(num){
          if(Meteor.isServer){
              return _.sample(Whites.find().fetch(),num)
          }
      }
      
});