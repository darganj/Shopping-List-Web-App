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
  console.log("called drawTable");
    let answer = req.responseText;
    console.log(answer);

    // if(answer == "bad entry"){
    //   console.log("I found a bad entry");
    //   // var myResult = document.getElementById('databaseResult');
    //   // myResult.textContent = "bad entry";
    //   // console.log(answer);
  
    // }else{
    //   console.log("that was a good entry");
    //   // var myResult = document.getElementById('databaseResult');
      if(answer.results == ""){
        console.log("Can I get to answer.results is empty?");
        return;
      }else{
        console.log("im about to update the table");
        let dataFromDatabase = JSON.parse(answer);
        console.log(dataFromDatabase);
      
//         let myFormReset = document.getElementById('addWorkoutForm').reset();
        let tableBody = document.getElementById('tableBody');
        tableBody.textContent = "";
  
        for(let rowIndex = 0; rowIndex<dataFromDatabase.rows.length; rowIndex++){
          // console.log(dataFromDatabase.rows[rowIndex]);
  
          let tempRow = document.createElement('tr');
          tempRow.id = dataFromDatabase.rows[rowIndex]["userID"];
          tableBody.appendChild(tempRow);
          for(let index = 0; index < 2; index++){
            let newCell = document.createElement('td');
  
            if(index === 0){
            //   newCell.hidden = true;
              newCell.textContent = dataFromDatabase.rows[rowIndex]["userID"];
            }
            if(index === 1){
              newCell.textContent = dataFromDatabase.rows[rowIndex]["userName"];
            }

            tempRow.appendChild(newCell);
          }
        
    
            let nameButton = document.createElement('button');
            let passwordButton = document.createElement('button');
            let deleteButton = document.createElement('button');

            nameButton.textContent = "Change username";
            nameButton.id = "nameButton" + dataFromDatabase.rows[rowIndex]["userID"];
            nameButton.classList.add("btn", "btn-primary"); 

            passwordButton.textContent = "Change password";
            passwordButton.id = "passwordButton" + dataFromDatabase.rows[rowIndex]["userID"];
            passwordButton.classList.add("btn", "btn-warning"); 

            deleteButton.textContent = "Delete user";
            deleteButton.id = "deleteButton" + dataFromDatabase.rows[rowIndex]["userID"];
            deleteButton.classList.add("btn", "btn-danger"); 

            newCell = document.createElement('td');
            let newDiv = document.createElement('div')
            newDiv.style.display = "flex";
            newDiv.style.justifyContent = "space-around";

            newCell.appendChild(newDiv);

            newDiv.appendChild(nameButton);
            newDiv.appendChild(passwordButton);
            newDiv.appendChild(deleteButton);

            tempRow.appendChild(newCell);

            document.getElementById(nameButton.id).addEventListener('click', function(){nameButtonPushed(nameButton.id)});
            document.getElementById(passwordButton.id).addEventListener('click', function(){passwordButtonPushed(passwordButton.id)});
            document.getElementById(deleteButton.id).addEventListener('click', function(){deleteButtonPushed(deleteButton.id)}); //{
      
        }
    }
//         }
//       }
//     }
//   }
}  

function nameButtonPushed(nameButton_id){
    console.log('you clicked ' + nameButton_id);
}

function deleteButtonPushed(deleteButton_id){
    console.log('you clicked ' + deleteButton_id);
  
    // set up request
    let req = new XMLHttpRequest();
    req.open("DELETE", "https://itworks-itco-admin1-hy2ohm3daz.herokuapp.com/admin-portal", true);
    req.setRequestHeader('Content-Type', 'application/json');
  
  
    req.addEventListener('load', function(){
      console.log("async delete");
      // let answerD = req.responseText;
      drawTable(req);
      });
    req.send(JSON.stringify({'userID':deleteButton_id.slice(12)}));
    event.preventDefault();
}
  
function passwordButtonPushed(passwordButton_id){
    console.log('you clicked ' + passwordButton_id);
  
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
}