'use strict';

const scrapeIt = require("scrape-it");
const _ = require("lodash");

class DegustaAPI {
  constructor(url) {
    this.url = url;
  }

  test(callback) {
    return scrapeIt(this.url, {
        title: ".header h1",
        desc: ".header h2",
        avatar: {
          selector: ".header img",
          attr: "src"
        }
      },
      callback);
  }

  goToRestaurant(params, callback) {
    var url;
    if (params.url) {
      if (_.isString(this.url)) {
        url = `${this.url}${params.url}`;
      } else {
        url = this.url;
        url.url = `${url.url}${params.url}`;
      }
    }
    return scrapeIt(url, {
        title: "h1#restaurante",
        phone: {
          selector: '#main .btn-show-telefono',
          attr: 'data-phone'
        },
        image: {
          selector: ".bxslider li img",
          attr: "src"
        },
        direction: '.direccion-holder address.adr span',
        hours: '.horario-holder span.horario',
        hasOnlineBooking: {
          selector: '.new-widget-reserva',
          convert: value => {
            return value.trim().length > 0 ? true : false;
          }
        },
        ratings: {
          listItem: '.rating-list .rating',
          data: {
            name: {
              selector: '.rating-title',
              convert: value => {
                value = value.replace(/([^a-z0-9áéíóúñü_-\s\.,]|[\t\n\f\r\v\0])/gim, "");
                return value;
              }
            },
            value: {
              selector: '.rating-value > strong',
              convert: value => {
                let index = value.indexOf('/');
                if (index >= 0) {
                  return value.substring(0, value.indexOf('/'));
                } else {
                  return value;
                }

              }
            }
          }
        }
      },
      callback);
  }

  searchRestaurants(params, callback) {
    var url;

    if (_.isString(this.url)) {
      url = `${this.url}/search?ciudad=panama&q=${params.q}`;
    } else {
      url = this.url;
      url.url = `${url.url}/search?ciudad=panama&q=${params.q}`;
    }

    return scrapeIt(url, {
        restaurants: {
          listItem: '.search-holder > .search-article',
          data: {
            price: '.precio em',
            name: '.rest-head h3 a',
            url: {
              selector: '.rest-head h3 a',
              attr: 'href'
            }
          }
        }
      },
      function(err, data) {
        data.restaurants = _.slice(data.restaurants, 0, 4);
        callback(err, data)
      }

    );
  }

  topRestaurants(params, callback) {
    var tab = "tab201";
    var priceIndex = 0;

    switch (params.price) {
      case "expensive":
        priceIndex = 0;
        break;
      case "pricy":
        priceIndex = 0;
        break;
      case "mid higth":
        priceIndex = 1;
        break;
      case "mid low":
        priceIndex = 2;
        break;
      case "cheap":
        priceIndex = 3;
        break;
      case "cheap":
        priceIndex = 3;
        break;
      default:
        priceIndex = 0;
        break;
    }


    switch (params.category) {
      case "food":
        tab = "tab201";
        break;
      case "service":
        tab = "tab202";
        break;
      case "ambience":
        tab = "tab203";
        break;
      default:
        tab = "tab201";
        break;
    }

    return scrapeIt(this.url, {
        categories: {
          listItem: `#${tab} .block`,
          data: {
            title: 'a h3',
            restaurants: {
              listItem: 'ol > li',
              data: {
                name: 'a',
                url: {
                  selector: 'a',
                  attr: "href"
                }
              }
            }
          }
        }
      },
      function(err, data) {
        if (err) {
          callback(err, {});
        } else {
          callback(err, data.categories[priceIndex]);
        }
      });
  }
}

module.exports = DegustaAPI;