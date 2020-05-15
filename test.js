const tabs = M.Tabs.init(document.querySelector('.tabs'));

async function displayTodos(data){

  let r = document.querySelector("#test");
  r.innerHTML = `
     <p>this is a test</p>
    `;

  let result = document.querySelector('#result');//access the DOM

  result.innerHTML = '';//clear result area
  
  let html = '';//make an empty html string 

  if("error" in data){//user not logged in 
    html+= `
      <li class="card collection-item col s12 m4">
                <div class="card-content">
                  <span class="card-title">
                    Error : Not Logged In
                  </span>
                </div>
        </li>
    `;
  }else{
    for(let todo of data){
      html+= `
        <li class="card collection-item col s12 m4">
                  <div class="card-content">
                    <span class="card-title">${todo.text}
                    <span class="card-title">${todo.done}
                   
                      <label class="right">
                        <input type="checkbox" data-id="${todo.id}" onclick="toggleDone(event)" ${todo.done ? 'checked': ''} />
                        <span>Done</span>
                      </label>
                    </span>
                  </div>
                  <div class="card-action">
                    <a href="#" onclick="deleteTodo('${todo.id}')">DELETE</a>
                  </div>
          </li>
      `;//create html for each todo data by interpolating the values in the todo
    }
  }
  
  //add the dynamic html to the DOM
  result.innerHTML = html;
}

async function loadView(){
  let todos = await sendRequest(`${server}/todo`, 'GET');
  displayTodos(todos);
  
}

loadView();

async function createTodo(event){
  event.preventDefault();//stop the form from reloading the page
  let form = event.target.elements;//get the form from the event object

  let data = {
    text: form['addText'].value,//get data from form
    duration: form['duration'].value,//get data from form
    date: form['date'].value,
    done: false,// newly created todos aren't done by default
  }

  event.target.reset();//reset form

  let result = await sendRequest(`${server}/todo`, 'POST', data);

  if('error' in result){
    toast('Error: Not Logged In');
  }else{
    toast('Todo Created!');
  }
    
  loadView();
}

//attach createTodo() to the submit event of the form
document.forms['addForm'].addEventListener('submit', createTodo);

async function toggleDone(event){
  let checkbox = event.target;

  let id = checkbox.dataset['id'];//get id from data attribute

  let done = checkbox.checked;//returns true if the checkbox is checked
  let result = await sendRequest(`${server}/todo/${id}`, 'PUT', {done: done});

  let message = done ? 'Done!' : 'Not Done!';
  toast(message);
}

async function deleteTodo(id){
  let result = await sendRequest(`${server}/todo/${id}`, 'DELETE');

  toast('Deleted!');

  loadView();
}

function logout(){
  window.localStorage.removeItem('access_token');
  window.location.href ="index.html";
}


var link1 = document.getElementById("generate")
link1.addEventListener("click", createClaimsForm);

var link2 = document.getElementById("download")
link1.addEventListener("click", generateFile);

async function generateFile(event){
  let data = await sendRequest(`${server}/todo`, 'GET');
  const fs = require('fs') 
  data = "DATE\tCOURSE COURSE CODE\tPERIOD OF CONTACT HOURS\tNO. OF CONTACT HOURS\n"
  for (let course of data){
    data += `${course.date}\t${course.text}\t
    ${course.duration}\n`;

  }
  data += "\nNAME:\nDATE:\nEMPLOYEE SIGNATURE:\n\nDATE:\nHOD SIGNATURE:"

  fs.writeFile('claimsform.txt', data, (err) => { 
         
      if (err) throw err; 
  })
}

function logout(){
  window.localStorage.removeItem('access_token');
  window.location.href ="index.html";
}

var link1 = document.getElementById("generate")
link1.addEventListener("click", createClaimsForm);

var link2 = document.getElementById("download")
link1.addEventListener("click", generateFile);

async function generateFile(event){
  let data = await sendRequest(`${server}/todo`, 'GET');
  const fs = require('fs') 
  data = "DATE\tCOURSE COURSE CODE\tPERIOD OF CONTACT HOURS\tNO. OF CONTACT HOURS\n"
  for (let course of data){
    data += `${course.date}\t${course.text}\t
    ${course.duration}\n`;

  }
  data += "\nNAME:\nDATE:\nEMPLOYEE SIGNATURE:\n\nDATE:\nHOD SIGNATURE:"

  fs.writeFile('claimsform.txt', data, (err) => { 
         
      if (err) throw err; 
  })
}

async function createClaimsForm(event){
  

  let data = await sendRequest(`${server}/todo`, 'GET');

  let r = document.querySelector("#cform");//access the DOM

  r.innerHTML = '';//clear result area
  
  let h = '';//make an empty html string 

  if("error" in data){//user not logged in 
    h+= `
      <p>Error</p>
    `;
  }else{
    for(let todo of data){
      h+= `
          <tr>
            <td>${todo.date}</td>
            <td>${todo.text}</td>
            <td>${todo.duration}</td>
            <td>${todo.done}</td>
          </tr>
        
      `;//create html for each todo data by interpolating the values in the todo
    }
  }

  /*for(var j=0; j<3, j++){
    h+= `<tbody><tr>
              <td>this</td>
              <td>is</td>
              <td>a</td>
              <td>test</td>
            </tr>
            </tbody>`;
  }*/
  //add the dynamic html to the DOM
  r.innerHTML = h;
}