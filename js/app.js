var app = angular.module('accelerometer', ['consoleModule']);

app.run(function ($document, con) {

	angular.element($document).ready(function () {
        con.register($("#consoleContainer"));
        con.attach();
    });
})