var Schemas = {};
Blacks = new Mongo.Collection('blacks');

Schemas.Blacks = new SimpleSchema({
    text:{
        type: String,
        label: "Text",
        },
    draw:{
        type: Number,
        label: "Draw",
    },
    pick:{
        type: Number,
        label: "Pick"
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
        
Blacks.attachSchema(Schemas.Blacks);

Meteor.methods({

          reloadBlacks: function() {
            if(Meteor.isServer){
            Blacks.remove({});
            var test = Assets.getText('black_cards.csv').split("\n");
            for(var i = 0; i < test.length;i++){
                    var temp = test[i].split('::');
                    Blacks.insert({"text":temp[0],"draw":parseInt(temp[1]),"pick":parseInt(temp[2]),"deck":temp[3],"deckRating":temp[4]})
            }
          }
      }
})