function Employee(
    acc,
    fullName,
    email,
    password,
    workDays,
    salary,
    roles,
    workHours
) {
    this.acc = acc;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.workDays = workDays;
    this.salary = salary;
    this.totalSalary = () => {
        if (this.roles === "Sếp") {
            return salary * 3;
        } else if (this.roles === "Trưởng phòng") {
            return salary * 2;
        } else if (this.roles === "Nhân viên") {
            return salary;
        }
    };
    this.roles = roles;
    this.workHours = parseInt(workHours);
    this.rankEmployee = () => {
        if (this.workHours >= 192) {
            return "Excellent";
        } else if (this.workHours >= 176) {
            return "Good";
        } else if (this.workHours >= 160) {
            return "Well done";
        } else if (this.workHours <= 160) {
            return "Bad";
        }
    };
}

let employeeList = [];

let createEmployee = function() {
    // validate();
    let form = document.getElementById("form");
    console.log(form.checkValidity());
    if (form.checkValidity()) {
        let acc = document.getElementById("tknv").value;
        if (acc.length < 4 || acc.length > 6) {
            // console.log("hello");
            alert("Account must be from 4 to 6");
            return false;
        }
        let fullName = document.getElementById("name").value;
        // let letters = /^[A-Za-z]+$/;
        // if (fullName.value.match(letters)) {
        //     console.log("hello");
        //     return true;
        // }
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let workDays = document.getElementById("datepicker").value;
        let salary = document.getElementById("luongCB").value;
        if (salary.length < 1000000 || salary.length > 20000000) {
            console.log("hello");
            alert("Invalid salary");
            return false;
        }
        let roles = document.getElementById("chucvu").value;
        let workHours = document.getElementById("gioLam").value;

        let newEmployee = new Employee(
            acc,
            fullName,
            email,
            password,
            workDays,
            salary,
            roles,
            workHours
        );

        employeeList.push(newEmployee);
        renderEmployee();
        saveData();
    }
};
// let validate = function() {
//     var letters = /^[A-Za-z]+$/;
//     if (Employee.fullName.value.match(letters)) {
//         return true;
//     } else {
//         alert("message");
//         return false;
//     }
// };

let deleteEmployee = function(acc) {
    let index = findEmployee(acc);
    if (index === -1) {
        alert("Unavailable employee");
        return -1;
    }
    employeeList.splice(index, 1);
    renderEmployee();
    saveData();
};

let findEmployee = function(acc) {
    for (let i = 0; i < employeeList.length; i++) {
        if (employeeList[i].acc === acc) {
            return i;
        }
    }
    return -1;
};

let getEmployee = function(acc) {
    // lay thong tin dua len form
    let index = findEmployee(acc);
    if (index === -1) {
        alert("Unavailable employee");
        return -1;
    }
    let foundEmployee = employeeList[index];
    document.getElementById("tknv").value = foundEmployee.acc;
    document.getElementById("name").value = foundEmployee.fullName;
    document.getElementById("email").value = foundEmployee.email;
    document.getElementById("password").value = foundEmployee.password;
    document.getElementById("datepicker").value = foundEmployee.workDays;
    document.getElementById("luongCB").value = foundEmployee.salary;
    document.getElementById("chucvu").value = foundEmployee.roles;
    document.getElementById("gioLam").value = foundEmployee.workHours;
};

let updateEmployee = function() {
    let acc = document.getElementById("tknv").value;
    let fullName = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let workDays = document.getElementById("datepicker").value;
    let salary = document.getElementById("luongCB").value;
    let roles = document.getElementById("chucvu").value;
    let workHours = document.getElementById("gioLam").value;

    let index = findEmployee(acc);
    if (index === -1) {
        alert("Unavailable employee");
        return -1;
    }
    let foundEmployee = employeeList[index];

    foundEmployee.acc = acc;
    foundEmployee.email = email;
    foundEmployee.password = password;
    foundEmployee.workDays = workDays;
    foundEmployee.salary = salary;
    foundEmployee.roles = roles;
    foundEmployee.workHours = workHours;

    renderEmployee();
    saveData();
};

let findEmployeeByRank = function() {
    let keyword = document.getElementById("searchName").value.trim();
    let result = [];
    for (let i = 0; i < employeeList.length; i++) {
        if (
            employeeList[i].rankEmployee() === keyword ||
            employeeList[i].rankEmployee().includes(keyword)
        ) {
            result.push(employeeList[i]);
        }
    }
    console.log(result);
    renderEmployee(result);
};

//console.log(employeeList);
let renderEmployee = function(data) {
    data = data || employeeList;
    // if (!data) data = employeeList;
    let dataHTML = "";
    for (let i = 0; i < data.length; i++) {
        dataHTML += `
		<tr>
		<td>${data[i].acc}</td>
		<td>${data[i].fullName}</td>
		<td>${data[i].email}</td>
		<td>${data[i].workDays}</td>
		<td>${data[i].roles}</td>
		<td>${data[i].totalSalary()}</td>
		<td>${data[i].rankEmployee()}</td>
		<td>
		<button class="btn btn-danger" onClick="deleteEmployee('${
      data[i].acc
    }')" >Delete</button></td>
		<td>
		<button class="btn btn-info" onClick="getEmployee('${
      data[i].acc
    }')">Update</button></td>

	</tr>`;
    }
    document.getElementById("tableDanhSach").innerHTML = dataHTML;
};

let saveData = function() {
    // luu data vao localstorage
    let employeeListJSON = JSON.stringify(employeeList); //convert array to string
    localStorage.setItem("list", employeeListJSON);
};

let getData = function() {
    // f5 lay list duoi local hien len
    let employeeListJSON = localStorage.getItem("list");
    if (employeeListJSON) {
        employeeList = mapData(JSON.parse(employeeListJSON)); // chuyen tu chuoi ra array
        renderEmployee();
    }
};

let mapData = function(dataFromLocal) {
    let data = [];
    for (let i = 0; i < dataFromLocal.length; i++) {
        let currentEmployee = dataFromLocal[i];
        let mappedEmployee = new Employee(
            currentEmployee.acc,
            currentEmployee.fullName,
            currentEmployee.email,
            currentEmployee.password,
            currentEmployee.workDays,
            currentEmployee.salary,
            currentEmployee.roles,
            currentEmployee.workHours
        );
        data.push(mappedEmployee);
    }
    return data;
};
getData();