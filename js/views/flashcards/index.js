define([
  'underscore',
  'view',
  'hbs!templates/flashcards/index',
  'routers/mediator',
  'views/root'
], function (_, View, template, mediator, RootView) {
  return View.extend({
    initialize: function(){
      View.prototype.initialize.apply(this, arguments); // call standard Thorax init code
      this.$el.attr("class", "container");
      this.getScore();
    },

    name: 'flashcards/index',
    template: template,
    events: {
      "click button.previous": "previous",
      "click button.next": "next",
      "click button.toggle": "toggle",
      "click button.guess": "checkGuess",
      "click button.review": "review",
      "click button.add": "add"
    },

    previous: function(e){
      e.preventDefault();
      if (this.model.id === 0) {
        this.model = this.collection.get(this.collection.length - 1);
      } else {
        this.model = this.collection.get(this.model.id - 1);
      }
      this.render();
    },

    checkGuess: function(e){
      this.model.set("attempts", this.model.get("attempts") + 1);
      if (e.target.innerHTML === this.model.get('answer')){
        this.model.set("correct", this.model.get("correct") + 1);
        this.result = "Correct!";
      } else {
        this.result = "Incorrect. The correct answer is " + this.model.get('answer') + ".";
      }
      this.getScore();
    },

    getScore: function(){
      var totalCorrect = 0;
      var totalAttempts = 0;
      this.collection.each(function(value){
        totalCorrect += value.get("correct");
        totalAttempts += value.get("attempts");
      });
      this.totalCorrect = totalCorrect;
      this.totalAttempts = totalAttempts;
      this.render();
    },

    next: function(e){
      e.preventDefault();
      if (this.model.id === this.collection.length - 1) {
        this.model = this.collection.get(0);
      } else {
        this.model = this.collection.get(this.model.id + 1);
      }
      this.render();
    },
    
    toggle: function(e){
      $('.toggle').toggleClass('hide');
    },

    add: function(e){
      e.preventDefault();
      mediator.trigger('add');
    },

    review: function(e){
      e.preventDefault();
      mediator.trigger('review');
    }
  });
});
