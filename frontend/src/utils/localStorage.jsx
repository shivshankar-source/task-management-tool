
const employees = [
    {
        "id": 1,
        "firstName": "Arjun",
        "email": "employee1@example.com",
        "password": "123",
        "taskCounts": {
            "active": 0,
            "newTask": 0,
            "completed": 0,
            "failed": 0
        },
        "tasks": []
    },
    {
        "id": 2,
        "firstName": "Sneha",
        "email": "employee2@example.com",
        "password": "123",
        "taskCounts": {
            "active": 0,
            "newTask": 0,
            "completed": 0,
            "failed": 0
        },
        "tasks": []
    },
    {
        "id": 3,
        "firstName": "Ravi",
        "email": "employee3@example.com",
        "password": "123",
        "taskCounts": {
            "active": 0,
            "newTask": 0,
            "completed": 0,
            "failed": 0
        },
        "tasks": []
    },
    {
        "id": 4,
        "firstName": "Priya",
        "email": "employee4@example.com",
        "password": "123",
        "taskCounts": {
            "active": 0,
            "newTask": 0,
            "completed": 0,
            "failed": 0
        },
        "tasks": []
    },
    {
        "id": 5,
        "firstName": "Karan",
        "email": "employee5@example.com",
        "password": "123",
        "taskCounts": {
            "active": 0,
            "newTask": 0,
            "completed": 0,
            "failed": 0
        },
        "tasks": []
    }
];


const admin = [{
    "id": 1,
    "email": "admin@me.com",
    "password": "123"
}];

export const setLocalStorage = () => {
  const existingEmployees = localStorage.getItem("employees");
  const existingAdmin = localStorage.getItem("admin");

  if (!existingEmployees) {
    localStorage.setItem("employees", JSON.stringify(employees));
  }

  if (!existingAdmin) {
    localStorage.setItem("admin", JSON.stringify(admin));
  }
};

export const getLocalStorage = ()=>{
    const employees = JSON.parse(localStorage.getItem('employees'))
    const admin = JSON.parse(localStorage.getItem('admin'))

    return {employees,admin}
}
