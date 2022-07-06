// #### Our code starts here
// #### declare global variables
var curr_task=0,box_data;

// #### Declaring Global Variables
var data, y, conf, result, expnotsub, box_data, tableCells, token, conftype=["table-success", "table-warning", "table-danger"], new_rows,threshold, predthis, text = "ALL";
var  feedback_data,total_submissions = 0,this_task;
var team_status=["seen", "unseen"];

let mychart = document.getElementById("barChart2").getContext('2d');
var table = false
var threshold = JSON.parse(localStorage.getItem("thresh"));
threshold = parseFloat(threshold)
var parameters = JSON.parse(localStorage.getItem("parameters"));
var data = JSON.parse(localStorage.getItem("json_data"));
var this_task = JSON.parse(localStorage.getItem("this_task"));
var discourse_topics = JSON.parse(localStorage.getItem("discourse_topics"));
var discourse_categories = JSON.parse(localStorage.getItem("discourse_categories"));
var current_task_no = localStorage.getItem("current_task");
// console.log(discourse_topics);
// console.log(discourse_categories);
let bargra = false;
let category_selector = document.getElementById("category_select");
let topic_selector = document.getElementById("topic_select");
var key_value = {
    'ALL':0,
    'AB':1,
    'BM':2,
    'DB':3,
    'FW':4,
    'SM':5,
    'SS':6
};
// Selected Teams list for sendinf emails
var selected_teams=[];

let nav_theme = document.getElementById("main_theme").value;
// doughnutChart();
const theme_change = () => {
    nav_theme = document.getElementById("main_theme").value;
    // nav_theme = "BM";
    updateDoughnutChart();
    // console.log(total_submissions, result.length, expnotsub)
    updateOnChange();
    updateOnChange_topic();
}

console.log(nav_theme)
console.log(discourse_categories)
console.log(discourse_topics)
// Appending option tags in HTML of "Select Topic" of "Informed Teams Counter" table
Object.keys(discourse_categories["name"]).forEach((val,index)=>{
    let new_option = document.createElement("option")
    new_option.innerText=discourse_categories["name"][val]
    // console.log(discourse_categories["name"][val])
    new_option.value=discourse_categories["category_id"][val]
    category_selector.appendChild(new_option)
})
// category_selector.appendChild()
$(document).ready( function () {
    $.noConflict();
    
} );


const updateOnChange_category = () =>{
    let select_option = category_selector.value
    console.log(select_option)

    let new_option = document.createElement("option")
    new_option.innerText="Select Topic"
    new_option.value="-5"

    topic_selector.innerHTML=''
    topic_selector.appendChild(new_option)

    // console.log(discourse_topics["title"]);
    Object.keys(discourse_topics["title"]).forEach((val,index)=>{
        // console.log({"value":val,"title":discourse_topics["title"][val],"id":discourse_topics["id"][val],"category":discourse_topics["category_id"][val]})
        if (select_option == discourse_topics["category_id"][val]) {
            let new_option = document.createElement("option")
            new_option.innerText=discourse_topics["title"][val]
            new_option.value=discourse_topics["id"][val]
            topic_selector.appendChild(new_option)            
        }
    })
}
// console.log(topic_selector)


const updateOnChange_topic = () =>{
    console.log(topic_selector.value)

    $.ajax({
        // #### URL and datatype for ajax call
        url: `/get-seen-teams/${topic_selector.value}/`,
        dataType: 'json',
        // #### Success function
        success: function (suc_data) {
            // #### Converting data in json format
            let seen_teams = JSON.parse(suc_data.seen_teams)
            let unseen_teams=JSON.parse(suc_data.unseen_teams)

            console.log({seen_teams,unseen_teams})
            console.log(seen_teams.email)

            let seen_list = Object.keys(seen_teams.theme).filter((val,index)=>{
                if (nav_theme=="ALL") {
                    return seen_teams.team_id[val]
                }
                else if(seen_teams.theme[val]==nav_theme)
                {
                    return seen_teams.team_id[val]
                }
                else return false;
            })

            let unseen_list = Object.keys(unseen_teams.theme).filter((val,index)=>{
                if (nav_theme=="ALL") {
                    return unseen_teams.team_id[val]
                }
                else if(unseen_teams.theme[val]==nav_theme)
                {
                    return unseen_teams.team_id[val]
                }
                else return false;
            })
            let count_seen = seen_list.length
            let count_unseen = unseen_list.length 
            if (bargra!==false) {
                bargra.destroy();
                console.log("destroyed the prev_canvas");
            }
            // ########################################   Bar Chart Start ###################################################
            // #### Bar chart Constructor
            bargra = new Chart(mychart, {
                type: 'bar',
                data: {
                    // #### Bar chart labels on X axis i.e. theme names
                    labels: [""],

                    // #### Data 1 for all teams who submitted this task
                    datasets: [{
                        label: 'Seen Task',
                        data: [count_seen],
                        borderColor: [`rgba(97, 216, 216, 1)`],
                        backgroundColor: [`rgba(0, 175, 185, 1)`],
                        stack: "Stack 0"
                    },
                    // #### Data 2 for teams submitted prev task
                    {
                        label: 'Not Seen Task',
                        data: [count_unseen],
                        borderColor: [`rgba(255,0,0,1)`],
                        backgroundColor: [`rgba(240, 113, 103, 1)`],
                        stack: "Stack 1"
                    },
                    // #### Data 3 for total teams in the event
                    // {
                    //     label: 'Total teams',
                    //     data: total.map((obj, index) => { return (obj[1]) }),
                    //     backgroundColor: [`rgb(254, 217, 183)`, `rgb(254, 217, 183)`, `rgb(254, 217, 183)`, `rgb(254, 217, 183)`, `rgb(254, 217, 183)`],
                    //     stack: "Stack 2"
                    // },

                    ]

                },

                options: {
                    // #### Show theme name on top
                    legend: { display: true },
                    // #### Title of chart
                    title: {
                        display: true,
                        text: `Teams Seen Topic List`

                    },
                    responsive: true,
                    scales: {
                        xAxes: [{
                            stacked: true // #### this should be set to make the bars stacked
                        }],
                        yAxes: [{
                            stacked: false // #### this also..
                        }]
                    }
                }
            })
            // ########################################   Bar Chart Ends #########################################
            var trHTML = '';
            Object.keys(seen_teams.team_id).forEach((val,index)=>{

                if (nav_theme=="ALL"||seen_teams.theme[val]==nav_theme) {
                    trHTML += "<tr class='table-success seen'><td>"+
                '</td><td>' + seen_teams.team_id[val]+
                '</td><td>' + 'Seen by team' +
                '</td><td>' + seen_teams.name[val] +
                '</td><td>' + seen_teams.email[val] +
                '</td><td>' + seen_teams.contact[val] +
                '</td></tr>';
                }
                
            })

            Object.keys(unseen_teams.team_id).forEach((val,index)=>{
                if (nav_theme=="ALL"||unseen_teams.theme[val]==nav_theme) {
                    trHTML += "<tr class='table-danger unseen'><td>"+
                '</td><td>' + unseen_teams.team_id[val]+
                '</td><td>' + 'Unseen by team' +
                '</td><td>' + unseen_teams.name[val] +
                '</td><td>' + unseen_teams.email[val] +
                '</td><td>' + unseen_teams.contact[val] +
                '</td></tr>';
                
                }
                // console.log("inside the unseen loop")
            })

            // document.getElementById('table3Content').innerHTML = trHTML
            // $('#table3 tfoot th').each( function () {
            //     var title = $(this).text();
            //     $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
            // } );
            // console.log(trHTML)
            if(table){
                // document.getElementById('table3Content').innerHTML = trHTML
                // $('#table3').DataTable().destroy();
                // document.getElementById('table3Content').innerHTML = ""
                // $('#table3').find('tbody').append(trHTML);
                // $('#table3').DataTable({
                //     dom: 'Blfrtip',
                //     destroy: true,
                //     // #### buttons for datatable download
                //     buttons: [
                //         'copyHtml5',
                //         {
                //             extend: 'pdfHtml5',
                //             title: function () { return getPredText(); }
                //         },
                //         {
                //             extend: 'excelHtml5',
                //             title: function () { return getPredText(); }
                //         },
                //         {
                //             extend: 'csvHtml5',
                //             title: function () { return getPredText(); }
                //         },
                //     ],
                //     "paging": true,
                //     responsive: true,
                //     "lengthChange": true,
                //     "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                //     "pageLength": 10,
                //     "pagingType": "full_numbers",
                //     // #### for search bar in footer
                //     initComplete: function () {
                //         // #### Apply the search
                //         this.api().columns().every( function () {
                //             var that = this;
            
                //             $( 'input', this.footer() ).on( 'keyup change clear', function () {
                //                 if ( that.search() !== this.value ) {
                //                     that
                //                         .search( this.value )
                //                         .draw();
                //                 }
                //             } );
                //         } );
                //     },
                //     columnDefs: [ {
                //         orderable: false,
                //         className: 'select-checkbox',
                //         targets:   0
                //     } ],
                //     select: {
                //         style:    'os',
                //         selector: 'td:first-child'
                //     },
                //     order: [[ 1, 'asc' ]]
                // }).draw();
                // table.clear();
                // table.draw()
                // table.ajax.reload();
            }
            else{
                document.getElementById('table3Content').innerHTML = trHTML

                table = $(`#table3`).DataTable({
                    dom: 'Blfrtip',
                    destroy: true,
                    // #### buttons for datatable download
                    buttons: [
                        'copyHtml5',
                        {
                            extend: 'pdfHtml5',
                            title: function () { return getPredText(); }
                        },
                        {
                            extend: 'excelHtml5',
                            title: function () { return getPredText(); }
                        },
                        {
                            extend: 'csvHtml5',
                            title: function () { return getPredText(); }
                        },
                    ],
                    "paging": true,
                    responsive: true,
                    "lengthChange": true,
                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                    "pageLength": 10,
                    "pagingType": "full_numbers",
                    "language": {
                        oPaginate: {
                        //    sNext: '<i class="fa fa-forward"></i>',
                        //    sPrevious: '<i class="fa fa-backward"></i>',
                           sFirst: '<<',
                           sLast: '>>'
                        }
                      } ,
                    // #### for search bar in footer
                    initComplete: function () {
                        // #### Apply the search
                        this.api().columns().every( function () {
                            var that = this;
                
                            $('#table3_filter', this.footer() ).on( 'keyup change clear', function () {
                                if( that.search() !== this.value ) {
                                    that
                                        .search( this.value )
                                        .draw();
                                }
                            });
                        });
                    },
                    columnDefs: [ {
                        orderable: false,
                        className: 'select-checkbox',
                        targets:   0
                    } ],
                    select: {
                        style:    'multi',
                        selector: 'td:first-child'
                    },
                    order: [[ 1, 'asc' ]]
                });

                // To select/deselect "Seen teams" when checkbox in checked/unchecked
                $('#seen-teams').click(function() {
                    console.log($('#seen-teams')[0].checked);
                    if ($('#seen-teams')[0].checked) {
                        table.rows('.seen').select();
                    }
                    else {
                        table.rows('.seen').deselect();
                    }
                });

                // To select/deselect "Unseen teams" when checkbox in checked/unchecked
                $('#unseen-teams').click(function() {
                    console.log($('#unseen-teams')[0].checked);
                    if ($('#unseen-teams')[0].checked) {
                        table.rows('.unseen').select();
                    }
                    else {
                        table.rows('.unseen').deselect();
                    }
                });
                
                $('#MyTableCheckAllButton').click(function() {
                    if (table.rows({
                            selected: true
                        }).count() > 0) {
                        table.rows().deselect();
                        $('#unseen-teams')[0].checked=false;
                        $('#seen-teams')[0].checked=false;
                        return;
                    }
                    table.rows().select();
                });
            
                table.on('select deselect', function(e, dt, type, indexes) {
                    if (type === 'row') {
                        // We may use dt instead of myTable to have the freshest data.
                        if (dt.rows().count() === dt.rows({
                                selected: true
                            }).count()) {
                            // Deselect all items button.
                            $("path").attr('d', 'M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z');
                            $('#seen-teams').prop('checked', true);
                            $('#unseen-teams').prop('checked', true);
                            // console.log("Select All " , $('#seen-teams')[0].checked);
                            return;
                        }
            
                        if (dt.rows({
                                selected: true
                            }).count() === 0) {
                            // Select all items button.
                            $("path").attr("d", "M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z");
                            // console.log("Deselect All ", $('#seen-teams')[0].checked);
                            return;
                        }
            
                        // Deselect some items button.
                        $("path").attr('d', 'M19,19V5H5V19H19M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5C3,3.89 3.9,3 5,3H19M17,11V13H7V11H17Z');
                    }
                });

                $("#draft-mail").click(function(){
                    selected_teams=[];
                    var rows_selected = table.rows('.selected').data();
                    $.each(rows_selected,function(i,v){
                        selected_teams.push(v);
                    });
                    console.log(selected_teams)
                });
            }
            var buttons = document.getElementsByClassName("dt-button")
            setTimeout(() => {
                style_buttons(buttons);
                style_table();
                // set_in_line()
            }, 2000);
            // table.draw();
        }
    })
    // document.getElementById("informed_teams").style.display="block"
    console.log(document.getElementById("informed_teams"))
}
// $('table3').DataTable(
//     $('#table3 thead th').on('click', 'tr', function () {
//         if ($(this).hasClass('selected')) {
//             $(this).removeClass('selected');
//         }
//         else {
//             $('#table3 tr.selected').removeClass('selected');
//             $(this).addClass('selected');
//         }
//     })
// )

// // ########################################   Sending Email Reminder #########################################
// const draft_mail = () => {

// }

// ########################################   Alert To confirm the "Team IDs"   #########################################
$('#alertEmail').on('show.bs.modal', function (event) {
    console.log("Selected Teams: ", selected_teams);
    document.getElementById("alertButton").innerHTML = `Total of ${selected_teams.length} teams selected`;
    console.log("Selected teams length: ", selected_teams.length);
    var tpHTML = '';
    Object.keys(selected_teams).forEach((val,index)=>{
        tpHTML += '<li class="list-group-item">'+ selected_teams[index][1] +'</li>';
    })
    document.getElementById("alertBody").innerHTML=tpHTML;
    if (selected_teams.length > 0) {
        document.getElementById("alertSubmit").disabled=false;
    }
});

// ########################################   Drafting the Reminder Email #########################################
$('#draftEmail').on('shown.bs.modal', function (event) {
    console.log("Selected Teams: ", selected_teams);
    console.log("Selected teams length: ", selected_teams.length);
    // var button = $(event.relatedTarget) // Button that triggered the modal
    // var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    // var modal = $(this)
    // modal.find('.modal-title').text('New message to ' + recipient)
    // modal.find('.modal-body input').val(recipient)
    // modal.find('#email').val(recipient);
    // if (! (( $('#draftEmail-sub').is(':empty') ) && ( $('#draftEmail-msg').is(':empty') )) ) {
        // $('draftEmailSubmit').prop('disabled', false);
        // document.getElementById("draftEmailSubmit").disabled=false;
        // console.log("Enable button");
    // }
});

(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
        })
})()

// ########################################   Doughnut Chart Start #########################################
let BarchartData = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]
// ##########################################  AJAX BEGINS #################################################

// ##########################################  AJAX ENDS #################################################
// #### Populate rest of the themes

const getPredText = () => { 
    return `${topic_selector.options[topic_selector.selectedIndex].innerText}_${nav_theme}_Seen_unseen`;
}

const setBarData=(data,y,threshold)=>{
    for (var i = 0; i < y.length; ++i) {
            switch(data["theme"][i]) {
                case "AB":{
                    if (data["confidence"][i] > threshold) {
                        BarchartData[1][1] +=1
                    } else {
                        BarchartData[2][1] += 1
                    }
                    break;
                }
                case "BM":{
                    if (data["confidence"][i] > threshold) {
                        BarchartData[1][2] +=1
                    } else {
                        BarchartData[2][2] += 1
                    }
                    break;
                }
                case "DB":{
                    if (data["confidence"][i] > threshold) {
                        BarchartData[1][3] +=1
                    } else {
                        BarchartData[2][3] += 1
                    }
                    break;
                }
                case "FW":{
                    if (data["confidence"][i] > threshold) {
                        BarchartData[1][4] +=1
                    } else {
                        BarchartData[2][4] += 1
                    }
                    break;
                }
                case "SM":{
                    if (data["confidence"][i] > threshold) {
                        BarchartData[1][5] +=1
                    } else {
                        BarchartData[2][5] += 1
                    }
                    break;
                }
                case "SS":{
                    if (data["confidence"][i] > threshold) {
                        BarchartData[1][6] +=1
                    } else {
                        BarchartData[2][6] += 1
                    }
                    break;
                }
              }
    }
    // console.log(this_task)
    BarchartData[0][1] = this_task[5][1]
    BarchartData[0][2] = this_task[2][1]
    BarchartData[0][3] = this_task[3][1]
    BarchartData[0][4] = this_task[1][1]
    BarchartData[0][5] = this_task[4][1]
    BarchartData[0][6] = this_task[0][1]
    // console.log(BarchartData)
}

// #### Function to update doughnut chart based on themes
const updateDoughnutChart=()=>{
    // #### get value of the selected item
    // var value = document.getElementById(`doughnut1`).value;
    var pos = 0
    // #### Switch case for values
    switch(nav_theme) {
        case "AB":{
            pos=1;
            break;
        }
        case "BM":{
            pos=2;
            break;
        }
        case "DB":{
            pos=3;
            break;
        }
        case "FW":{
            pos=4;
            break;
        }
        case "SM":{
            pos=5;
            break;
        }
        case "SS":{
            pos=6;
            break;
        }
        default:{
            pos=0;
            break;
        }
    }
    // #### update doughnut chart
    doughnutChart.data.datasets[0].data[0] = BarchartData[0][pos];
    doughnutChart.data.datasets[0].data[1] = BarchartData[1][pos];
    doughnutChart.data.datasets[0].data[2] = BarchartData[2][pos];
    // doughnutChart.data.labels.pop();
    // doughnutChart.data.datasets.forEach((dataset) => {
    //     dataset.data.pop();
    // });
    console.log(BarchartData[0][pos], BarchartData[1][pos], BarchartData[2][pos])
    doughnutChart.update();
    // doughnutChart.update();
}


// #### Threshold for this model
// console.log(this_task)
this_task.map((obj, index) => { total_submissions = total_submissions + obj[1]; return(true)})
threshold = parseFloat(threshold)
// console.log(team_contact_details);


// #### Calculate data for doughnut chart
// console.log(data)
y = Object.values(data["team_id"])
conf = Object.values(data["confidence"])
result = conf.filter(con => con > threshold)
expnotsub = conf.length - result.length
// console.log(result)

// // #### Set table loading spinners to none
// document.getElementById("spinner_home2").style.display = "none";
document.getElementById("spinner_home1").style.display = "none";
    

setBarData(data,y,threshold)


// #### Set data of 2D matrix
BarchartData[0][0] = total_submissions
BarchartData[1][0] = result.length
BarchartData[2][0] = expnotsub

// #### Draw Doughnut chart
// doughnutChart = new Chart(document.getElementById("doughnutChart"), {
//     type: 'doughnut',
//     data: {
//         labels: ["Teams Submitted", 'Teams expected to submit', 'Teams not expected to submit'],
//         datasets: [
//             {
//                 label: "Task status",
//                 backgroundColor: ["#00AFB9", "#0081A7", "#F07167"],
//                 data: [total_submissions, result.length, expnotsub]
//             }
//         ]
//     },
//     options: {
//         title: {
//             display: true,
//             text: `Task ${current_task_no} Prediction`
//         }
//     }
// });

const config = {
    type: 'doughnut',
    data: {
        labels: [
            'Teams Submitted', 
            'Teams expected to submit', 
            'Teams not expected to submit'
            // 'Red',
            // 'Blue',
            // 'Yellow'
        ],
        datasets: [{
            label: 'Task Status',
            data: [BarchartData[0][key_value[nav_theme]], BarchartData[1][key_value[nav_theme]], BarchartData[2][key_value[nav_theme]]],
            backgroundColor: [
                "#00AFB9", 
                "#0081A7", 
                "#F07167"
                // 'rgb(255, 99, 132)',
                // 'rgb(54, 162, 235)',
                // 'rgb(255, 205, 86)'
            ],
            hoverOffset: 10
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: `Task ${current_task_no} Prediction`,
                font: {
                    size: 24
                }
            }
        }
    }
}

const doughnutChart = new Chart(
    document.getElementById('myChart'),
    config,
    // console.log(BarchartData[0][key_value[nav_theme]], BarchartData[1][key_value[nav_theme]], BarchartData[2][key_value[nav_theme]])
);

// ########################################   Doughnut Chart Ends  #########################################


// #### ajax for the box chart
$.ajax({
    // #### URL and Datatype for ajax call
    url: `/feedbackdata/0/`,
    dataType: 'json',
    success: function (suc_data) {
        // #### parsing json data
        box_data = JSON.parse(suc_data.box_chart_data)
        //  console.log(box_data)
        delete box_data.Entries;
        // #### clear the box chart element
        document.getElementById("box_chart").innerHTML=" ";

        // #### get theme name from select
        //   var val_index = document.getElementById(`feedback_select`).value;
        document.getElementById(`feedback_title`).innerText = `${nav_theme} Task 0 Feedback`;
        console.log(box_data);
        // #### create array of data in required format
        var data = Object.keys(box_data).map((obj1,index1)=>{
            // console.log(
            //     {
            //         x:obj1,
            //         val_index:val_index,
            //         val:`('${val_index}', 0.0)`,
            //         low :box_data[obj1][`('${val_index}', 0.0)`],
            //         q1 : box_data[obj1][`('${val_index}', 0.25)`],
            //         median : box_data[obj1][`('${val_index}', 0.5)`],
            //         q3 : box_data[obj1][`('${val_index}', 0.75)`],
            //         high : box_data[obj1][`('${val_index}', 1.0)`]
            //     }
            // )
            return(
                {
                x:obj1,
                low :box_data[obj1][`('${nav_theme}', 0.0)`],
                q1 : box_data[obj1][`('${nav_theme}', 0.25)`],
                median : box_data[obj1][`('${nav_theme}', 0.5)`],
                q3 : box_data[obj1][`('${nav_theme}', 0.75)`],
                high : box_data[obj1][`('${nav_theme}', 1.0)`]
                }
            )
        })
        console.log(data)
    
        // #### Create chart object and set the data
        chart = anychart.box();
        series = chart.box(data);
        // #### style box chart
        series.whiskerWidth(30);
        series.normal().whiskerStroke("#000", 0.5);
        series.hovered().whiskerStroke("#000", 1);
        series.selected().fill("#ff3b55", 2);
        series.hover().fill("#ff3b55", 1);
        series.normal().fill("#ff3b55", 0.5);
        series.selected().stroke("#b03e00", 2);
        series.normal().stroke("#b03e00", 0.5);
        console.log(series)
        series.normal().stemStroke("#000", 0.5);
        series.hovered().stemStroke("#000", 1);
        series.selected().stemStroke("#000", 2);
        var xAxis = chart.xAxis();
        xAxis.staggerMode(2);
        chart.yScale().maximum(6);
        chart.yScale().ticks().interval(1);
        // #### Create box chart
        chart.container("box_chart");
        chart.draw();
    }
})

const updateOnChange = () =>{
    // #### get task name from select
    console.log("Changed task");
    var new_task = parseInt(document.getElementById(`task_select`).value);
    if (new_task !== curr_task) {
        curr_task=new_task
        // console.log(typeof(curr_task));
        $.ajax({
            // #### URL and Datatype for ajax call
            url: `/feedbackdata/${new_task}/`,
            dataType: 'json',
            success: function (suc_data) {
                // #### parsing json data
                box_data = JSON.parse(suc_data.box_chart_data)
                console.log(box_data)
                // console.log(suc_data.legend)
                document.getElementById("legend").innerHTML=suc_data.legend;
                delete box_data.Entries;
                // #### clear the box chart element
                document.getElementById("box_chart").innerHTML=" ";

                // #### get theme name from select
                // var val_index = document.getElementById(`feedback_select`).value;
                if (new_task==6 || new_task==7 || new_task==8 || new_task==9) {
                    document.getElementById(`feedback_title`).innerText = `${nav_theme} Task Stage 1 Feedback`;
                } else {
                    document.getElementById(`feedback_title`).innerText = `${nav_theme} Task ${new_task} Feedback`;
                }
              
      
                // #### create array of data in required format
                var data = Object.keys(box_data).map((obj1,index1)=>{
                    // console.log(
                    //     {
                    //         x:obj1,
                    //         val_index:val_index,
                    //         val:`('${val_index}', 0.0)`,
                    //         low :box_data[obj1][`('${val_index}', 0.0)`],
                    //         q1 : box_data[obj1][`('${val_index}', 0.25)`],
                    //         median : box_data[obj1][`('${val_index}', 0.5)`],
                    //         q3 : box_data[obj1][`('${val_index}', 0.75)`],
                    //         high : box_data[obj1][`('${val_index}', 1.0)`]
                    //     }
                    // )
                    return({
                        x:obj1,
                        low :box_data[obj1][`('${nav_theme}', 0.0)`],
                        q1 : box_data[obj1][`('${nav_theme}', 0.25)`],
                        median : box_data[obj1][`('${nav_theme}', 0.5)`],
                        q3 : box_data[obj1][`('${nav_theme}', 0.75)`],
                        high : box_data[obj1][`('${nav_theme}', 1.0)`]
                    })
                })
          
                // #### Create chart object and set the data
                chart = anychart.box();
                //  var legend = chart.legend();
                // // enable legend
                // legend.enabled(true);
                // legend.itemsSourceMode("categories");
                series = chart.box(data);
                // #### style box chart
                series.whiskerWidth(30);
                series.normal().whiskerStroke("#000", 0.5);
                series.hovered().whiskerStroke("#000", 1);
                series.selected().fill("#ff3b55", 2);
                series.hover().fill("#ff3b55", 1);
                series.normal().fill("#ff3b55", 0.5);
                series.selected().stroke("#b03e00", 2);
                series.normal().stroke("#b03e00", 0.5);
                console.log(series)
                series.normal().stemStroke("#000", 0.5);
                series.hovered().stemStroke("#000", 1);
                series.selected().stemStroke("#000", 2);
                var xAxis = chart.xAxis();
                xAxis.staggerMode(2);
                chart.yScale().maximum(6);
                chart.yScale().ticks().interval(1);
                // #### Create box chart
                chart.container("box_chart");
                chart.draw();
            }
        })
    } 
    else {
        // #### clear the box chart element
        document.getElementById("box_chart").innerHTML=" ";

        // #### get theme name from select
        //   var val_index = document.getElementById(`feedback_select`).value;
        document.getElementById(`feedback_title`).innerText = `${nav_theme} Task ${curr_task} Feedback`;
      
        // #### create array of data in required format
        var data = Object.keys(box_data).map((obj1,index1)=>{
            return(
                {
                    x:obj1,
                    low :box_data[obj1][`('${nav_theme}', 0.0)`],
                    q1 : box_data[obj1][`('${nav_theme}', 0.25)`],
                    median : box_data[obj1][`('${nav_theme}', 0.5)`],
                    q3 : box_data[obj1][`('${nav_theme}', 0.75)`],
                    high : box_data[obj1][`('${nav_theme}', 1.0)`]
                }
            )
        })
      
        // #### Create chart object and set the data
        chart = anychart.box();
        series = chart.box(data);
        // #### style box chart
        series.whiskerWidth(30);
        series.normal().whiskerStroke("#000", 0.5);
        series.hovered().whiskerStroke("#000", 1);
        series.selected().fill("#ff3b55", 2);
        series.hover().fill("#ff3b55", 1);
        series.normal().fill("#ff3b55", 0.5);
        series.selected().stroke("#b03e00", 2);
        series.normal().stroke("#b03e00", 0.5);
        console.log(series)
        series.normal().stemStroke("#000", 0.5);
        series.hovered().stemStroke("#000", 1);
        series.selected().stemStroke("#000", 2);
        var xAxis = chart.xAxis();
        xAxis.staggerMode(2);
        chart.yScale().maximum(6);
        chart.yScale().ticks().interval(1);
        // #### Create box chart
        chart.container("box_chart");
        chart.draw();
    }
}

// #### function for getting quotes on dashboard
$.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.quotable.io/random?tags=technology,famous-quotes'), function (data) {
    // alert(data.contents);
    suc_data = JSON.parse(data.contents)
    // console.log(suc_data);
    // #### set data quote element
    document.getElementById("quotes").innerText =suc_data.content
    document.getElementById("author").innerText = "-  "+suc_data.author
});

// console.log(discourse_topics)


const style_buttons = (buttons) => {
    // console.log(buttons)
    // buttons.style.display="flex"
    // var button_box = document.getElementsByClassName("dt-buttons")[0]
    // button_box.style.display="flex"
    // button_box.style.justifyContent="space-evenly"
    // button_box.style.margin="5px"

    for (let index = 0; index < buttons.length; index++) {
        buttons[index].classList.add("btn")

        if (buttons[index].classList[1] === "buttons-pdf") {
            // #### if button is for downloading pdf: color red and add the pdf symbol
            buttons[index].classList.add("btn-danger")
            buttons[index].innerHTML = buttons[index].innerHTML + `  <i class="mdi mdi-file-pdf-outline" style="font-size: 1.2em;"></i>`;
        } else if (buttons[index].classList[1] === "buttons-csv") {
            // #### if button is for downloading CSV: color blue and add the arrow symbol
            buttons[index].classList.add("btn-primary")
            buttons[index].innerHTML = buttons[index].innerHTML + `  <i class="mdi mdi-arrow-right" style="font-size: 1.2em;"></i>`;
        } else if (buttons[index].classList[1] === "buttons-excel") {
            // #### if button is for downloading excel: color green and add the excel symbol
            buttons[index].classList.add("btn-success")
            buttons[index].innerHTML = buttons[index].innerHTML + `  <i class="mdi mdi-file-excel" style="font-size: 1.2em;"></i>`;
        } else {
            // #### if button is for Copying: color grey and add the clipboard symbol
            buttons[index].classList.add("btn-secondary")
            buttons[index].innerHTML = buttons[index].innerHTML + `  <i class="mdi mdi-clipboard-outline" style="font-size: 1.2em;"></i>`;
        }
    }
}

const style_table = () => {

        // #### get the table length filter
        var table_len = document.getElementById("table3_length");
        // #### get the table search
        var table_filter = document.getElementById("table3_filter");
        
        table_len.style.marginLeft = "1px";
        table_filter.style.marginRight = "15px";

        var parent = table_len.parentNode;
    
        // Create and add a new wrapper div
        var wrapper = document.createElement('div');
        wrapper.classList.add("row")
        
        c1 = document.createElement("div")
        c1.classList.add("col-6")
        // c1.classList.add("col-md-4")
        table_len.classList.add("form-inline")
        table_len.getElementsByTagName("select").item(0).style.margin="5px"
        // table_len.childNodes[0].childNodes[0].
    
        // c2 = document.createElement("div")
        // c2.classList.add("col-12")
        // c2.classList.add("col-md-4")
    
        c3 = document.createElement("div")
        c3.classList.add("col-6")
        // c3.classList.add("col-md-4")
        
        // #### insert wrapper element
        parent.replaceChild(wrapper, table_len);
    
        // #### set elements as childrens of wrapper
        wrapper.appendChild(c1);
        // wrapper.appendChild(c2);
        wrapper.appendChild(c3);
        c1.appendChild(table_len)
        // c2.appendChild(el)
        c3.appendChild(table_filter)
    
        table_len.firstElementChild.firstElementChild.style.maxHeight="36px"
        table_len.firstElementChild.classList.add("d-flex")
        table_len.firstElementChild.style.marginTop="6px"
        table_len.firstElementChild.style.alignItems="center"
        table_len.firstElementChild.style.marginBottom="0px"
        table_len.firstElementChild.style.marginTop="0px"


        table_filter.parentElement.style.margin="auto"
        table_filter.firstChild.style.marginBottom="0px"
        table_filter.style.marginTop="0px"
        
        $(table_filter.firstChild).contents().filter(function(){
            return (this.nodeType == 3);
        }).remove();

        table_filter.firstChild.firstChild.placeholder="Search"
        table_filter.firstChild.firstChild.style.maxWidth="30vw"

        // #### wrapper for table
        tb2 = document.getElementById("table3");
        var p_tag = tb2.parentNode;
        console.log(p_tag);
        var w_tag = document.createElement('div');
        // set the wrapper as child (instead of the element)
        p_tag.replaceChild(w_tag, tb2);
        // set element as child of wrapper
        w_tag.appendChild(tb2);
        // w_tag.style.maxHeight = "300px";
        // w_tag.style.display = "block";
        // w_tag.style.overflow = "auto";
        // w_tag.style.marginTop = "10px";
        w_tag.style.cssText += 'max-height:300px;'
                                + 'display:block;'
                                + 'overflow:auto;'
                                + 'margin-top:10px;';
    

}

// const checkbox_1 = $.querySelector("#t3-seen-teams");
// checkbox_1.addEventListner("change",(e) => {
//     console.log(e.target.value);
// })
const seen_teams = (e) => {
    return true;
}
// $.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.metaweather.com/api/location/12586539/'), function (data) {
//     // alert(data.contents);
//     suc_data = JSON.parse(data.contents)
//     // console.log(suc_data);
//     // #### Set temperature in dashboard
//     document.getElementById("temperature").innerText = parseInt(suc_data.consolidated_weather[0].the_temp)

// });

// $.ajax({
//     url: `https://cors-proxy.htmldriven.com/?url=https://www.metaweather.com/api/location/12586539/`,
//     dataType: 'json',
//     success: function (suc_data) {
//         console.log(suc_data)
//         document.getElementById("temperature").innerText = parseInt(suc_data.consolidated_weather[0].the_temp)
//     }

// })


// $.ajax({
//     url: `https://cors-proxy.htmldriven.com/?url=https://api.quotable.io/random?tags=technology,famous-quotes`,
//     dataType: 'json',
//     success: function (suc_data) {
//         console.log(suc_data)
//         document.getElementById("quotes").innerText =suc_data.content
//         document.getElementById("author").innerText = "-  "+suc_data.author

//     }

// })