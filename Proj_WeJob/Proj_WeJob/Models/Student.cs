using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Models.DAL
{
    public class Student
    {
        //Propeties 
        public int StudentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CellPhone { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        //constructor
        public Student( int _studentId, string _firstName, string _lastName, string _cellPhone, string _email) 
        {
            this.StudentId = _studentId;
            this.FirstName = _firstName;
            this.LastName = _lastName;
            this.CellPhone = _cellPhone;
            this.Email = _email;
        }

        public Student()
        {
        }

 
        //הצגת כל סטודנטים ללא סינון
        public List<Student> GetListStudent()
        {
            DBservices dbs = new DBservices();
            return dbs.GetListStudent("DBConnectionString");
        }

        //פונקציית התחברות לאפליקציה
        public Student AppLogin()
        {
            DBservices dbs = new DBservices();
            return dbs.AppLogin(Email, Password);
        }

    }
}