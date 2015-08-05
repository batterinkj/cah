Template.gameRound.helpers({
    playerWhites:function(){
        var whites = _.sortBy(Meteor.user().whites,"_id");
        var selectedWhites = Meteor.user().selectedWhiteCard;
        return _.reject(whites,function(white){
            return _.findWhere(selectedWhites,{_id:white._id})!=undefined
        })
         
    },
    selectedWhites:function(){
        var self = this; //round
        if(self.status ==="active"){
            var user = Meteor.user();
            if(self.host_id != user._id &&Meteor.user().selectedWhiteCard.length>0){
                return Meteor.user().selectedWhiteCard;
            }else{
                return {no:"cards"}
            }
        }else if(self.status === "selectingWinner"){
            return self.whites
        }else if(self.status === "finished"){
            return self.winningWhites
        }else{
            return false
        }
        
    },
    customWhiteCard:function(){
        return Meteor.user().customWhiteCard;
    },
    active: function(){
        return this.status ==="active";
    },
    selectingWinner: function(){
        return this.status ==="selectingWinner";
    },
    finished: function(){
        return this.status ==="finished";
    },
    waitOnTimerOrPlayer:function(){
        var round = this;
        if(round.timer===0) return false;
        else{
            return !helpers.allPlayersConfirmed(round);
        } 
    },
    waitOnTimer:function(){
        var round = this;
        if(round.timer>0) return true;
        else return false;
    },
    hostOrSubmitted:function(){
        return this.host_id === Meteor.userId() || Meteor.user().submitted
    },
    submitted:function(){
        return Meteor.user().submitted
    },
    blackAnsweredText:function(){
        var round = Template.parentData(1);
        var blackCardText = round.black.text;
        var whiteCards = []
        if(round.status ==="active"){
            whiteCards = this;
        }else if(round.status === "selectingWinner"){
            whiteCards =  this.cards
        }else if(round.status === "finished"){
            whiteCards =  round.winningWhites.cards
        }
        
        if(!whiteCards || whiteCards.length===0)return blackCardText;
        
        for(var i = 0; i<whiteCards.length;i++){
            if(blackCardText.indexOf("____")!==-1){
                blackCardText = blackCardText.replace("____","<span id ='"+whiteCards[i]._id+"' class='blackcardAnsweredText'>"+whiteCards[i].text+"</span>");
            }else{
                blackCardText = blackCardText.concat("<br><span id ='"+whiteCards[i]._id+"' class='blackcardAnsweredText'>"+whiteCards[i].text+"</span>")
            }
        }
        return blackCardText;
        
    },
})

Template.gameRound.events({
    "click .blackcardAnsweredText":function(e){
        Meteor.call("playerUnselectWhite",e.target.id)
    },
    "click .whitecard.selectable.submit":function(){
        var self = this;
        if(!self.hasOwnProperty("_id")) _.extend(self,{_id:"cust"+Random.id()})
        Meteor.call("playerSelectWhite",self)
    },
    "click .whitecard.selectable.submit #customWhiteCard":function(e) {
        e.stopPropagation();
    },//stops customWhiteCard from being submitted when editting text
    'keypress #customWhiteCard':function(e,r){
        if(e.keyCode ===13){
            e.preventDefault()
            Meteor.call("playerSelectWhite",{_id:"cust"+Random.id(),text:e.target.value})
            Meteor.call('updatePlayerCustomWhiteCard',e.target.value)
        }else{
            Meteor.call('updatePlayerCustomWhiteCard',e.target.value)
        }
    },
    "click .whitecard.unselectable":function(){
        var self = this;
        Meteor.call("playerUnselectWhite",self)
    },
    "click #confirmSelectedCards":function(){
        var round = this;
        if(round.black.pick===Meteor.user().selectedWhiteCard.length) Meteor.call("playerConfirmSelectedCards")
        else helpers.displayError("Select More Cards")
    },
    "click #changeSelectedCards":function(){
        var round = this;
        if(round.timer>0) Meteor.call("playerChangeSelectedCards")
        else helpers.displayError("Time to change cards is out")
    },
    "click #startSelectingWinnerButton":function(){
        var round = this;
        if(this.timer>0 && !helpers.allPlayersConfirmed(round)){
            helpers.displayError("Wait for all players to submit or timer to expire")
            return
        }else if(helpers.playersConfirmed(round)>0){
            if(helpers.allPlayersConfirmed(round)||window.confirm("Not all players have confirmed. Proceed?")){
                Meteor.call("startSelectingWinner", round)
            }
        }else{
            helpers.displayError("Wait for at least one player to submit")
        }
    },
    "click #selectWinnerButton":function(){
        var round = this;
        if(round.hasOwnProperty('winningWhites')) Meteor.call("selectWinner", round)
        else(helpers.displayError("Please select a winner"))
    },
    "click #newRoundButton":function(){
        Meteor.call("newRound",Template.parentData(1));
    }
    
})