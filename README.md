# Hospital Readmission Dashboard

Express authentication template using the following:
* Materialize 
* Highcharts
* Passport 
* Flash messages 
* Express & EJS + other custom middleware 

## Approach
This project was approached with the Model-View-Controller and RESTful routes methods. Two APIs are used, one to get the general data for all the hospitals and a second to get the measure data for reporting. 
The most complicated (and satisfying) part was writing the calculations to get the data needed for the charts on the Dashboard.

### APIs Used
* https://data.medicare.gov/Hospital-Compare/Hospital-Readmissions-Reduction-Program/9n3s-kdb3
* https://data.medicare.gov/Hospital-Compare/Hospital-General-Information/xubh-q36u

## Wireframes
See Axure wireframes here: http://boq901.axshare.com

## Future Features
* Add an edit button for each dataset
* Default state benchmark to hospital's state
* Update action and website colors, if Materialize will allow
* Add more info about data used and what charts represent
* Clean hospital dataset by removind hospitals without data to report
* Clean up MVC and RESTful routes
* CSS...

## Unsolved Problems
* How to call the highcharts only when you get the data and not at page load
* How to customize colors on Materialize
* Research making fields required in Materialize modals


## Getting Started

* Run `npm install` to install dependencies
  * Use `npm run lint:js` to lint your JS
  * Use `npm run lint:css` to lint your CSS
  * Use `npm test` to run tests
* Instal Databases
