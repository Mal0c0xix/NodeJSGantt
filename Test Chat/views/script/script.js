var app = angular.module('plnkrGanttMaster',
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
    'gantt.overlap'
    ]);

app.controller('Ctrl', ['$scope', function ($scope) {
    $scope.options = {
        currentDate: 'column',
        currentDateValue: new Date(2017, 3, 6, 11, 20, 0),
        readOnly: false,
      	columns: ['from', 'to'],
        columnsHeaders: {'from': 'De', 'to': 'A'},
        columnsFormatters: {
            'from': function(from) {
        		return from !== undefined ? from.format('lll') : undefined;
            },
            'to': function(to) {
                return to !== undefined ? to.format('lll') : undefined;
            }
        },
        groupDisplayMode: 'group'
    }
    
    $scope.data = [
        // Order is optional. If not specified it will be assigned automatically
        {name: 'Finalize concept', tasks: [
            {id:'1', name: 'Finalize concept', color: '#F1C232', from: new Date(2017, 3, 4, 8, 0, 0), to: new Date(2017, 3, 8, 18, 0, 0),
                progress: 10, content:""}
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
    ];
    
}]);
