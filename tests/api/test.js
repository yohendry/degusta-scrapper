var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var DegustaAPI = require('./../../app/degusta');

describe('Degusta', function() {
  this.timeout(10000);

  it('scrapper should works', function(done) {
    var degusta = new DegustaAPI("http://ionicabizau.net");
    degusta.test(function(err, data) {
      if (err) {
        done(err);
      } else {
        expect(data.title).to.equal('Ionică Bizău');
        done();
      }
    });
  });

  it('can get top restaurants', function(done) {
    var degusta = new DegustaAPI({
      url: 'https://www.degustapanama.com/',
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
      }
    });

    degusta.topRestaurants({
      category: 'food',
      price: 'cheap'
    }, function(err, data) {
      if (err) {
        done(err);
      } else {
        expect(data.restaurants.length).to.equal(4);
        done();
      }
    });
  });

  describe('can get restaurant data', function() {
    var degusta = new DegustaAPI({
      url: 'https://www.degustapanama.com/',
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
      }
    });

    it('Vinoteca', function(done) {
      degusta.goToRestaurant({
        url: '/restaurante/vinoteca_340.html'
      }, function(err, data) {
        if (err) {
          done(err);
        } else {
          expect(data.title).to.equal('Vinoteca');
          expect(data.ratings.length).to.equal(5);
          expect(data.hasOnlineBooking).to.equal(true);
          done();
        }
      });
    });

    it('Gelato', function(done) {
      degusta.goToRestaurant({
        url: '/restaurante/gelato-y-co_101955.html'
      }, function(err, data) {
        if (err) {
          done(err);
        } else {
          expect(data.title).to.equal('Gelato & Co');
          expect(data.ratings.length).to.equal(5);
          expect(data.hasOnlineBooking).to.equal(false);
          done();
        }
      });
    })
  });

  it('can search restaurants', function(done) {
    var degusta = new DegustaAPI({
      url: 'https://www.degustapanama.com/',
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
      }
    });

    degusta.searchRestaurants({
      q: 'pizza'
    }, function(err, data) {
      if (err) {
        done(err);
      } else {
        console.log(data.restaurants.length);
        expect(data.restaurants.length).to.equal(4);
        done();
      }
    });
  });
});