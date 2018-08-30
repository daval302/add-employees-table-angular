### Add Employee table throw modal

I need to develop an app to add employees end working slot hours in a table that rapresent 1 Rota week working hours

Some key features:

* *slot* is like : 13-19, 7-13, 15-19, 19-24
	* they raprensts the hour range within a day


Requirements :

* [X] in `main-view.html` the `ng-repeat` on line 17 has to be pull out from `employees` shifts array and placed in the table of 7 days. So for example the record on table will be as `MORGESE VITO ANTONIO	C/A	7-19	7-19	7-19	7-19	7-19	7-19	7-19`

* [X] it needs to be handled the case *no employees loaded*, so in app.js line 9 will remain an emtpy array and the `$.getJSON()` function not load the json file
