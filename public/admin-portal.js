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
  // console.log(answer);

      if(answer.results == ""){
        console.log("Can I get to answer.results is empty?");
        return;
      }else{
        console.log("I'm about to update the table");
        let dataFromDatabase = JSON.parse(answer);
        // console.log(dataFromDatabase);
      
        let tableBody = document.getElementById('tableBody');
        tableBody.textContent = "";
        console.log("I am wiping the table clean");
  
        for(let rowIndex = 0; rowIndex<dataFromDatabase.rows.length; rowIndex++){
  
          let tempRow = document.createElement('tr');
          tempRow.id = dataFromDatabase.rows[rowIndex]["userID"];
          tableBody.appendChild(tempRow);
          for(let index = 0; index < 3; index++){
            let newCell = document.createElement('td');
  
            if(index === 0){
              newCell.textContent = dataFromDatabase.rows[rowIndex]["userID"];
            }
            if(index === 1){
              newCell.textContent = dataFromDatabase.rows[rowIndex]["userName"];
            }
            if(index === 2){
              if(dataFromDatabase.rows[rowIndex]["isAdmin"] == 0){
                newCell.textContent = "User";
              }else{
                newCell.textContent = "Admin";
              }
            }

            tempRow.appendChild(newCell);
          }
        
    
            let nameButton = document.createElement('button');
            let passwordButton = document.createElement('button');
            let deleteButton = document.createElement('button');
            let permButton = document.createElement('button');

            nameButton.textContent = "Change username";
            nameButton.id = "nameButton" + dataFromDatabase.rows[rowIndex]["userID"];
            nameButton.classList.add("btn", "btn-primary"); 

            passwordButton.textContent = "Change password";
            passwordButton.id = "passwordButton" + dataFromDatabase.rows[rowIndex]["userID"];
            passwordButton.classList.add("btn", "btn-warning"); 

            deleteButton.textContent = "Delete user";
            deleteButton.id = "deleteButton" + dataFromDatabase.rows[rowIndex]["userID"];
            deleteButton.classList.add("btn", "btn-danger"); 

            permButton.textContent = "Flip Permission Level";
            permButton.id = "permButton" + dataFromDatabase.rows[rowIndex]["userID"];
            permButton.classList.add("btn", "btn-info"); 

            newCell = document.createElement('td');
            let newDiv = document.createElement('div')
            newDiv.style.display = "flex";
            newDiv.style.justifyContent = "space-around";

            newCell.appendChild(newDiv);

            newDiv.appendChild(nameButton);
            newDiv.appendChild(passwordButton);
            newDiv.appendChild(deleteButton);
            newDiv.appendChild(permButton);

            tempRow.appendChild(newCell);

            document.getElementById(nameButton.id).addEventListener('click', function(){nameButtonPushed(nameButton.id)});
            document.getElementById(passwordButton.id).addEventListener('click', function(){passwordButtonPushed(passwordButton.id)});
            document.getElementById(deleteButton.id).addEventListener('click', function(){deleteButtonPushed(deleteButton.id)});
            document.getElementById(permButton.id).addEventListener('click', function(){permButtonPushed(permButton.id)});

        }
    }
}  

function nameButtonPushed(nameButton_id){
    console.log('you clicked ' + nameButton_id);
    let usernameEntry = document.getElementById('usernameInput');
    console.log(usernameEntry.value);

     // set up request
     let req = new XMLHttpRequest();
     req.open("PATCH", "https://itworks-itco-admin1-hy2ohm3daz.herokuapp.com/admin-portal", true);
     req.setRequestHeader('Content-Type', 'application/json');
   
   
     req.addEventListener('load', function(){
       console.log("async patch");
       alert('username updated');
       let myFormReset = document.getElementById('pickUsernameForm').reset();
      //  console.log("I am the responseText");
      //  console.log(req.responseText);
       drawTable(req);
       });
     req.send(JSON.stringify({'userID':nameButton_id.slice(10),'username':usernameEntry.value}));
     event.preventDefault();
}

function deleteButtonPushed(deleteButton_id){
    console.log('you clicked ' + deleteButton_id);
  
    // set up request
    let req = new XMLHttpRequest();
    req.open("DELETE", "https://itworks-itco-admin1-hy2ohm3daz.herokuapp.com/admin-portal", true);
    req.setRequestHeader('Content-Type', 'application/json');
  
  
    req.addEventListener('load', function(){
      console.log("async delete");
      alert('user deleted');
      let myFormReset = document.getElementById('pickUsernameForm').reset();
      let tableBody = document.getElementById('tableBody');
      tableBody.textContent = "";
      // console.log("I am the responseText");
      // console.log(req);
      drawTable(req);
      });
    req.send(JSON.stringify({'userID':deleteButton_id.slice(12)}));
    event.preventDefault();
}
  
function passwordButtonPushed(passwordButton_id){
    console.log('you clicked ' + passwordButton_id);
    let passwordEntry = document.getElementById('passwordInput');
    // console.log(passwordEntry.value);
  
      // set up request
      let req = new XMLHttpRequest();
      req.open("PUT", "https://itworks-itco-admin1-hy2ohm3daz.herokuapp.com/admin-portal", true);
      req.setRequestHeader('Content-Type', 'application/json');
  
  
      req.addEventListener('load', function(){
        console.log("async put");
        alert('password updated');
        let myFormReset = document.getElementById('pickUsernameForm').reset();
        });
  
      req.send(JSON.stringify({'userID':passwordButton_id.slice(14),'password':passwordEntry.value}));
      event.preventDefault();
}

function permButtonPushed(permButton_id){
  console.log('you clicked ' + permButton_id);

  // set up request
  let req = new XMLHttpRequest();
  req.open("POST", "https://itworks-itco-admin1-hy2ohm3daz.herokuapp.com/admin-portal/admin", true);
  req.setRequestHeader('Content-Type', 'application/json');


  req.addEventListener('load', function(){
    console.log("async post");
    alert('permission level changed');
    drawTable(req);
    });

  req.send(JSON.stringify({'userID':permButton_id.slice(10)}));
  event.preventDefault();

}