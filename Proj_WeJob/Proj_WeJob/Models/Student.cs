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
        public int StudentID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        //constructor
        public Student( int _studentID, string _firstName, string _lastName, string _phone, string _email) 
        {
            this.StudentID = _studentID;
            this.FirstName = _firstName;
            this.LastName = _lastName;
            this.Phone = _phone;
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

    }
}