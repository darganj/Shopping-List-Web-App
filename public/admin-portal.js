window.addEventListener('load', function(event){
    console.log("my page loaded.");
  
     // set up request
       let req = new XMLHttpRequest();
      req.open("GET", "https://itworks-itco-admin1-hy2ohm3daz.herokuapp.com/admin-portal/table", true);
  
      req.addEventListener('load', function(){
        console.log("window async listener working");
        drawTable(req);
     });
  
     // send the request
     req.send(null);
     // prevent page reload
     event.preventDefault();
  });
  
function drawTable(req){
    let answer = req.responseText;
    console.log(answer);
}
    // if(answer == "bad entry"){
    //   console.log("I found a bad entry");
    //   // var myResult = document.getElementById('databaseResult');
    //   // myResult.textContent = "bad entry";
    //   // console.log(answer);
  
    // }else{
    //   console.log("that was a good entry");
    //   // var myResult = document.getElementById('databaseResult');
//       if(answer.results == ""){
//         console.log("Can I get to answer.results is empty?");
//         return;
//       }else{
//         console.log("im about to update the table");
//         let dataFromDatabase = JSON.parse(answer);
//         // console.log(dataFromDatabase);
//         let myFormReset = document.getElementById('addWorkoutForm').reset();
//         let tableBody = document.getElementById('tableBody');
//         tableBody.textContent = "";
  
//         for(let rowIndex = 0; rowIndex<dataFromDatabase.rows.length; rowIndex++){
//           // console.log(dataFromDatabase.rows[rowIndex]);
  
//           let tempRow = document.createElement('tr');
//           tempRow.id = dataFromDatabase.rows[rowIndex]["id"];
//           tableBody.appendChild(tempRow);
//           for(let index = 0; index < 6; index++){
//             let newCell = document.createElement('td');
  
//             if(index === 0){
//               newCell.hidden = true;
//               newCell.textContent = dataFromDatabase.rows[rowIndex]["id"];
//             }
//             if(index === 1){
//               newCell.textContent = dataFromDatabase.rows[rowIndex]["name"];
//             }
//             if(index === 2){
//               newCell.textContent = dataFromDatabase.rows[rowIndex]["reps"];
//             }
//             if(index === 3){
//               newCell.textContent = dataFromDatabase.rows[rowIndex]["weight"];
//             }
//             if(index === 4){
//               longDateFormat = dataFromDatabase.rows[rowIndex]["date"];
  
//               if(longDateFormat == null){
//                 newCell.textContent = longDateFormat;
//               }else{
//                 var yyyy = longDateFormat.slice(0,4);
//                 var mm = longDateFormat.slice(5,7);
//                 var dd = longDateFormat.slice(8,10);
//                 newCell.textContent = mm + "-" + dd + "-" + yyyy;
//               }
  
//             }
//             if(index === 5){
//               var unitToPrint = dataFromDatabase.rows[rowIndex]["lbs"];
  
//               if(unitToPrint == 0){
//                 newCell.textContent = "Kilograms";
//               }else if(unitToPrint == 1){
//                 newCell.textContent = "Pounds";
//               }else{
//                 newCell.textContent = "";
//               }
  
//             }
//             tempRow.appendChild(newCell);
//           }
//           let editButton = document.createElement('button');
//           let deleteButton = document.createElement('button');
//           editButton.textContent = "edit";
//           editButton.id = "editButton" + dataFromDatabase.rows[rowIndex]["id"];
//           deleteButton.textContent = "delete";
//           deleteButton.id = "deleteButton" + dataFromDatabase.rows[rowIndex]["id"];
//           newCell = document.createElement('td');
//           let newDiv = document.createElement('div')
//           newDiv.style.display = "flex";
//           newDiv.style.justifyContent = "space-around";
//           newCell.appendChild(newDiv);
//           newDiv.appendChild(editButton);
//           newDiv.appendChild(deleteButton);
//           tempRow.appendChild(newCell);
//           document.getElementById(editButton.id).addEventListener('click', function(){editButtonPushed(editButton.id)});
//           document.getElementById(deleteButton.id).addEventListener('click', function(){deleteButtonPushed(deleteButton.id)}); //{
  
//         }
//       }
//     }
//   }
  
//   function deleteButtonPushed(deleteButton_id){
//     console.log('you clicked ' + deleteButton_id);
  
//     // set up request
//     let req = new XMLHttpRequest();
//     req.open("DELETE", "https://itworks-itco-admin1-hy2ohm3daz.herokuapp.com/admin-portal", true);
//     req.setRequestHeader('Content-Type', 'application/json');
  
  
//     req.addEventListener('load', function(){
//       console.log("async delete");
//       // let answerD = req.responseText;
//       drawTable(req);
  
  
  
  
//       });
//     req.send(JSON.stringify({'id':deleteButton_id.slice(12)}));
//     event.preventDefault();
  
//   }
  
//   function editButtonPushed(editButton_id){
//     console.log('you clicked ' + editButton_id);
  
//     let addWorkoutButton = document.getElementById('addWorkoutButton');
//     addWorkoutButton.style.display = "none";
//     let editWorkoutButton = document.getElementById('editWorkoutButton');
//     editWorkoutButton.style.display = "block";
  
  
//     let myEditRow = document.getElementById(editButton_id.slice(10));
//     let myEditCells = myEditRow.querySelectorAll("td");
//     // console.log(myEditCells);
//     let myForm = document.getElementById('addWorkoutForm');
//     name = myForm.elements[1];
//     reps = myForm.elements[2];
//     weight = myForm.elements[3];
//     date = myForm.elements[4];
  
//     name.value = myEditCells[1]["innerText"];
//     reps.value = myEditCells[2]["innerText"];
//     weight.value = myEditCells[3]["innerText"];
  
//     let longWrongDate = myEditCells[4]["innerText"];
//     let year1 = longWrongDate.slice(6);
//     let month1 = longWrongDate.slice(0,2);
//     let day1 = longWrongDate.slice(3,5);
//     date.value = year1 + "-" + month1 + "-" + day1;
  
//     let lbsToCheck = "";
//     if(myEditCells[5]["innerText"] == "Pounds"){
//       lbsToCheck = 0;
//     }else if(myEditCells[5]["innerText"] == "Kilograms"){
//       lbsToCheck = 1;
//     }else{
//       lbsToCheck = 2;
//     }
  
//     if(lbsToCheck == 0){
//       document.getElementById("pounds").checked = true;
//     }else if(lbsToCheck == 1){
//       document.getElementById("kilograms").checked = true;
//     }else if(lbsToCheck == 2){
//       document.getElementById("unitless").checked = true;
//     }
  
//     document.getElementById('addWorkoutForm').addEventListener('submit', function(event){
//       // console.log(event.submitter.id);
//       if(event.submitter.id == "addWorkoutButton"){
//         return;
//       }
//       console.log("Save button pressed");
  
//       let myForm = document.getElementById('addWorkoutForm');
//       name = myForm.elements[1].value;
//       reps = myForm.elements[2].value;
//       weight = myForm.elements[3].value;
//       date = myForm.elements[4].value;
  
//       let myRadioCollection = document.getElementsByName('lbs');
//       for (let index = 0; index < myRadioCollection.length; index++){
//         if(myRadioCollection[index].checked){
//           lbs = myRadioCollection[index].value;
//         }
//       }
  
//       // set up request
//       let req = new XMLHttpRequest();
//       req.open("PUT", "https://itworks-itco-admin1-hy2ohm3daz.herokuapp.com/admin-portal", true);
//       req.setRequestHeader('Content-Type', 'application/json');
  
  
//       req.addEventListener('load', function(){
//         console.log("async put");
//         let addWorkoutButton = document.getElementById('addWorkoutButton');
//         addWorkoutButton.style.display = "block";
//         let editWorkoutButton = document.getElementById('editWorkoutButton');
//         editWorkoutButton.style.display = "none";
//         document.getElementById('addWorkoutForm').reset();
//         let answer = req.responseText;
//         // console.log(answer);
  
//         drawTable(req);
  
//         });
  
//       if(reps == ""){
//         reps = null;
//       }
//       if(weight == ""){
//         weight = null;
//       }
//       if(date == ""){
//         date = null;
//       }
//       if((lbs == "") || (lbs == "NULL")){
//         lbs = null;
//       }
  
//       req.send(JSON.stringify({'id': myEditRow.id, 'name': name, 'reps': reps, 'weight': weight, 'date': date, 'lbs':lbs}));
//       event.preventDefault();
  
//     })
// }