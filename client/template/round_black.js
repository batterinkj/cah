Template.roundBlack.helpers({
    selected:function(){
        self = this;
        round = Template.parentData(1);
        if(round.winningWhites){
            if(self.player_id===round.winningWhites.player_id){
                return "selected"
            }
        }
    },
    selectableOrUnselectable:function(){
        self = this;
        round = Template.parentData(1);
        if(round.status === "active") return 
        if(round.winningWhites){
            if(self.player_id===round.winningWhites.player_id) return "unselectable"
            else return "selectable"
            
        }else return "selectable"
    },
})

Template.roundBlack.events({
    "click .selectable.selectingWinner":function(){
        var self = this;
        console.log(this)
        Meteor.call("selectWinningCard",
            Template.parentData(1), //round
            self)//player_hand
    },
    "click .unselectable.selectingWinner.selected":function(){
        var self = this;
        round = Template.parentData(1)
        Meteor.call("unselectWinningCard",round) //round
    },
    
})