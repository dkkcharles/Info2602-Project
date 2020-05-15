const tabs = M.Tabs.init(document.querySelector('.tabs'));

async function displayCourses(data){

  let result = document.querySelector('#result');//access the DOM

  result.innerHTML = '';//clear result area
  
  let html = '';//make an empty html string 

  if("error" in data){//user not logged in 
    html+= `
      <p>Error</p>
    `;
  }else{
    for(let course of data){
      html+= `
        <li class="card collection-item col s12 m4">
                  <div class="card-content">
                    <span class="card-title">${course.code}
                    <span class="card-title">${course.contacthours}
                    <span class="card-title">${course.date}
                   
                      <label class="right">
                        <input type="checkbox" data-id="${course.id}" onclick="toggleDone(event)" ${course.done ? 'checked': ''} />
                        <span>Done</span>
                      </label>
                    </span>
                  </div>
                  <div class="card-action">
                    <a href="#" onclick="deleteTodo('${course.id}')">DELETE</a>
                  </div>
          </li>
      `;//create html for each todo data by interpolating the values in the todo
    }
  }
  
  //add the dynamic html to the DOM
  result.innerHTML = html;
}

async function loadView(){
  let courses = await sendRequest(`${server}/course`, 'GET');
  displayCourses(courses);
  let r = document.querySelector("#test");
  r.innerHTML = `
     <p>this is a test</p>
    `;
}

loadView();

async function createCourse(event){
  event.preventDefault();//stop the form from reloading the page
  let form = event.target.elements;//get the form from the event object

  let data = {
    code: form['code'].value,//get data from form
    contacthours: form['contacthours'].value,
    numhours: form['numhours'].value,//get data from form
    date: form['date'].value,
    done: false,// newly created todos aren't done by default
  }

  event.target.reset();//reset form

  let result = await sendRequest(`${server}/course`, 'POST', data);

  if('error' in result){
    toast('Error: Not Logged In');
  }else{
    toast('Course Created!');
  }
    
  loadView();
}

//attach createTodo() to the submit event of the form
document.forms['addForm'].addEventListener('submit', createCourse);

async function toggleDone(event){
  let checkbox = event.target;

  let id = checkbox.dataset['id'];//get id from data attribute

  let done = checkbox.checked;//returns true if the checkbox is checked
  let result = await sendRequest(`${server}/course/${id}`, 'PUT', {done: done});

  let message = done ? 'Done!' : 'Not Done!';
  toast(message);
}

async function deleteCourse(id){
  let result = await sendRequest(`${server}/course/${id}`, 'DELETE');

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
  let data = await sendRequest(`${server}/course`, 'GET');
  const fs = require('fs') 
  data = "DATE\tCOURSE COURSE CODE\tPERIOD OF CONTACT HOURS\tNO. OF CONTACT HOURS\n"
  for (let course of data){
    data += `${course.date}\t${course.code}\t${course.contacthours}\t
    ${course.numhours}\n`;

  }
  data += "\nNAME:\nDATE:\nEMPLOYEE SIGNATURE:\n\nDATE:\nHOD SIGNATURE:"

  fs.writeFile('claimsform.txt', data, (err) => { 
         
      if (err) throw err; 
  })
}

async function createClaimsForm(event){
  let r = document.querySelector("#test");
  r.innerHTML = `
     <p>this is a test</p>
    `;

  let data = await sendRequest(`${server}/course`, 'GET');

  let r = document.querySelector("#cform");//access the DOM

  r.innerHTML = '';//clear result area
  
  let h = '';//make an empty html string 

  if("error" in data){//user not logged in 
    h+= `
      <p>Error</p>
    `;
  }else{
    for(let course of data){
      h+= `
          <tr>
            <td>${course.date}</td>
            <td>${course.code}</td>
            <td>${course.contacthours}</td>
            <td>${course.numhours}</td>
          </tr>
        
      `;//create html for each todo data by interpolating the values in the todo
    }
  }

  for(var j=0; j<3, j++){
    h+= `<tbody><tr>
              <td>this</td>
              <td>is</td>
              <td>a</td>
              <td>test</td>
            </tr>
            </tbody>`;
  }
  //add the dynamic html to the DOM
  r.innerHTML = h;
}
  







