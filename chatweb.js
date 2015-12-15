# chatapp
Chatweb = new Mongo.Collection('chatweb');


if (Meteor.isClient) {
  Meteor.subscribe("chatweb");

  Template.chatwebs.events({
    'click .delete': function(){
      Meteor.call("deleteMess", this._id);
    },
    'keypress messarea': function(e, instance) {
      if(e.keyCode == 13) {
        var mes = instance.find('messarea').value;
        Meteor.call("sendMess",mess);
      }
    }
  });

  Template.chatwebs.helpers({
    isOwner: function(){
      return this.owner === Meteor.userId();
    },
    time: function() {
      return moment(this.timestamp).format('h:mm a');
    }
  });

  Template.body.events({
    'submit .new-mess': function(event){
      var mess = event.target.mess.value;
      Meteor.call("sendMess",mess);
      event.target.mess.value = "";
      return false;
    }
  });

  Template.body.helpers({
    chatweb: function(){
      return Chatweb.find();
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}



if (Meteor.isServer) {
  Meteor.startup(function () {
  });

  Meteor.publish("chatweb", function(){
    return Chatweb.find({
      $or: [
        {private: {$ne: true}},
        {owner: this.userId}
      ]
    });
  })
}


Meteor.methods({
  sendMess: function(mess){
    Chatweb.insert({
      mess: mess,
      timestamp: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    })
  },
  deleteMess: function(id){
    var mes = Chatweb.findOne(id);
    if(mes.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    Chatweb.remove(id);
  }
})

