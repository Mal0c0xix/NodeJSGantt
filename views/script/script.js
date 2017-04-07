var app = angular.module('ganttProject',
    ['gantt',
    'gantt.sortable',
    'gantt.movable',
    'gantt.drawtask',
    'gantt.tooltips',
    'gantt.bounds',
    'gantt.progress',
    'gantt.table',
    'gantt.tree',
    'gantt.groups',
    'gantt.resizeSensor',
    'gantt.overlap',
    'gantt.dependencies']);

app.controller('Ctrl', ['$scope', function ($scope) {

    var objectModel;
    var dataToRemove;

    $scope.options = {

        currentDate: 'column', // La date actuel est affiché en colonne
        currentDateValue: getDatetime, // Date actuel
      	columns: ['from', 'to'],
        columnsHeaders: {'from': 'De', 'to': 'A'},
        daily: true, //Les tâches sont en jour
        draw: true, //Créer une tâche = true
        readOnly: false, //Ne rien pouvoir faire = True

        columnsFormatters: {
            'from': function(from) {
        		return from !== undefined ? from.format('lll') : undefined;
            },
            'to': function(to) {
                return to !== undefined ? to.format('lll') : undefined;
            }
        },

        canDraw: function(event) {
            var isLeftMouseButton = event.button === 0 || event.button === 1;
            return $scope.options.draw && !$scope.options.readOnly && isLeftMouseButton;
        },

        drawTaskFactory: function() {
            return {
                id: 'utils.randomUuid()',  // Unique id of the task.
                name: 'Drawn task', // Name shown on top of each task.
                color: '#AA8833' // Color of the task in HEX format (Optional).
            };
        },

        groupDisplayMode: 'group',

        dateFrames: {
            'weekend': {
                evaluator: function(date) {
                    return date.isoWeekday() === 6 || date.isoWeekday() === 7;
                },
                targets: ['weekend']
            }
        },

        timeFrames: {
            'day': {
                start: moment('8:00', 'HH:mm'),
                end: moment('20:00', 'HH:mm'),
                working: true,
                default: true
            },
            'noon': {
                start: moment('12:00', 'HH:mm'),
                end: moment('13:30', 'HH:mm'),
                working: false,
                default: true
            },
            'weekend': {
                working: false
            },
            'holiday': {
                working: false,
                color: 'red',
                classes: ['gantt-timeframe-holiday']
            }
        },

        timeFramesNonWorkingMode: 'visible',

        dependencies: {
            enabled: true,
            conflictChecker: true
        },
    };

    // Ajout d'une ligne (Row)
    $scope.addRow = function() {
        var name = $scope.targetDataAddRowIndex;
        var newRow = {name: name, tasks: [
            {id:'1', name: 'Finalize concept', color: '#F1C232', from: new Date(2017, 3, 4, 8, 0, 0), to: new Date(2017, 3, 8, 18, 0, 0),
                progress: 10}
            ]};
        $scope.data.push(newRow);
        console.log($scope.data);
        $scope.targetDataAddRowIndex = "";
    };

    var getDatetime = function() {
      return (new Date).toLocaleFormat("%A, %B %e, %Y");
    };
    
    $scope.data = [
        // Order is optional. If not specified it will be assigned automatically
        {name: 'Finalize concept', tasks: [
            {id:'1', name: 'Finalize concept', color: '#F1C232', from: new Date(2017, 3, 4, 8, 0, 0), to: new Date(2017, 3, 8, 18, 0, 0),
                progress: 10}
        ]},
        {name: 'Config', tasks: [
            {name: 'SW / DNS/ Backups', color: '#F1C232', from: new Date(2017, 3, 8, 12, 0, 0), to: new Date(2017, 3, 21, 18, 0, 0)}
        ]},

        {name: 'Workshop', tasks: [
            {name: 'On-side education', color: '#F1C232', from: new Date(2017, 3, 24, 9, 0, 0), to: new Date(2017, 3, 25, 15, 0, 0)}
        ]},
        {name: 'Development', children: ['Demo1', 'Demo2'], content: '<i class="fa fa-file-code-o" ng-click="scope.handleRowIconClick(row.model)"></i> {{row.model.name}}'},
        {name: 'Demo1', tooltips: false, tasks: [
            {name: 'Demo1', color: '#9FC5F8', from: new Date(2017, 3, 25, 15, 0, 0), to: new Date(2017, 3, 30, 18, 30, 0)},
            {name: 'Demo2', color: '#9FC5F8', from: new Date(2017, 4, 1, 15, 0, 0), to: new Date(2017, 4, 4, 18, 0, 0)},
        ]},
        {name: 'Demo2', tooltips: false, tasks: [
            {name: 'Demo3', color: '#9FC5F8', from: new Date(2017, 4, 5, 15, 0, 0), to: new Date(2017, 4, 10, 18, 0, 0)},
            {name: 'Demo4', color: '#9FC5F8', from: new Date(2017, 4, 11, 15, 0, 0), to: new Date(2017, 4, 15, 18, 0, 0)},
        ]},
        {name: 'Workshop', tasks: []},
    ];

}]);
