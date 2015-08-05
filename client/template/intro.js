Template.intro.helpers({
    //returns an array like [{name: 'facebook'}];
    service:function(){
        return Accounts._loginButtons.getLoginServices();
    }
})