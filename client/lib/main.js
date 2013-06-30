Template.footer.rendered= function(){
// hide all objects that are not to be shown when logged in
    // $('.chat').hide();
    
    
    $('.profile').hide();
    
    $('.add_announcements').hide();
    
    $('.new_announcement').hide();

    // check that user has a profile if not show inital survey
    $('.initialSurvey').hide();
    
};

Template.chat.events({
  'click .submit_chat' : function (evt, tmpl){
      // probably set a session variable that refers to the
      // appropriate chat room
      var room_id = Session.get('room_id'), user_id = Meteor.userId();
      if(room_id && user_id){
          msg = tmpl.find('.chat-new-message-content').value;
          if(msg){
              console.log('inserting');
              var user = Meteor.users.findOne({ _id: Meteor.userId() });
              chat.insert({msg : msg, room_id:room_id,user_id :user.emails[0].address});
              }
      }
      evt.preventDefault();
  },

  'change input[name=search]': function() {
    $(".results-list").html(Meteor.render(Template.addUsers));
  }
});

Template.chat.getMessages = function(){
    var room_id = Session.get('room_id');
    
    if(room_id){
        var q =chat.find({room_id : room_id}).fetch();
        return q;
    }
};

Template.chat.emailHash = function() {
  return md5(this.user_id);
};

Template.main.activeRooms = function(){
  return rooms.find({ $where: function() {
    return this.users.indexOf(Meteor.userId()) > -1;
  }});
};

Template.main.rendered = function() {
  $("section").hide();
  $("section#chat").show();
  if (Session.get("room_id")) {
    $("a[data-room-id=" + Session.get("room_id") + "] li").addClass("active");
  }
};

Template.main.events({
  'click .side-menu a': function(e) {
    $("section").hide();
    $("section#" + $(e.target).parent().data("target")).show();

    $(".side-menu li").removeClass("active");
    $(e.srcElement).addClass('active');
  },

  'click .show_chatroom' : function(evt,tmpl){
    Session.set('room_id', $(evt.target).parent().data("roomId"));
    evt.preventDefault();
  }
});

Template.announcements.getMsg = function (){
    return announcements.find({});
};

Template.announcements.events({
    'click .cancel' : function(evt,tmpl){
        $('.new_announcement').hide();
    }
});

Template.announcements.getAnnouncements = function(){
    return announcements.find({}, { sort: { createdAt: -1 } });
}

Template.new_announcement.events({
    'click .cancel' : function(evt,tmpl){
        $('.new_announcement').hide();
    },

  'click .add_announcement': function(evt,tmpl){
    evt.preventDefault();
    var msg=tmpl.find(".msg").value;
    announcements.insert({msg: msg, user_id: Meteor.userId(), createdAt: new Date()});
    //What does pepsi wild cherry taste like with crown royal?
    $('.new_announcement').hide();
  }
});


Template.dashboard.events({
    'click .show_profile' : function(){
        alert('show profile using userId');
        // do jquery stuff to show the chatrooms in tab format
        // from here go to settings template ....
    },
    
    'click .show_announcements' : function(){
      $('.announcements').show();
    },
    
    'click .new_announcements' : function(){
      $('.new_announcement').show();
    }
});

Template.profile.events({
    'click .save_profile': function(){
        // save profile to mongo, use session id to determine what record
        // this is based on users' userId
    
    }


});

Template.profile.userProfile= function(){
        // get userId to load from user profile collection
};

Accounts.ui.config({ 
    passwordSignupFields: 'EMAIL_ONLY'
});
