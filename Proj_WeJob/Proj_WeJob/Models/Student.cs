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
        public string Gender { get; set; }
        public string DepartmentName { get; set; }
        public int DepartmentCode { get; set; }
        public string SubDepartmentName { get; set; }
        public int SubDepartmentCode { get; set; }
        public List<Language> LanguagesList { get; set; }

        //constructor
        public Student( int _studentId, string _firstName, string _lastName, string _cellPhone, string _email, string _gender,string _departmentName, string _subDepartmentName) 
        {
            this.StudentId = _studentId;
            this.FirstName = _firstName;
            this.LastName = _lastName;
            this.CellPhone = _cellPhone;
            this.Email = _email;
            this.Gender = _gender;
            this.DepartmentName = _departmentName;
            this.SubDepartmentName = _subDepartmentName;
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

        //הצגת סטודנטים עם סינון
        public List<Student> GetListStudent(string StudentId)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListStudent("DBConnectionString", StudentId);
        }


        //פונקציית התחברות לאפליקציה
        public Student AppLogin()
        {
            DBservices dbs = new DBservices();
            return dbs.AppLogin(Email, Password);
        }

        //פונקציית הרשמה לאפליקציה
        public Student AppRegister()
        {
            DBservices dbs = new DBservices();
            return dbs.Register(Email, FirstName, LastName, CellPhone, Password, Gender);
        }
        public int deleteStudent(string StudentId)
        {
            DBservices db = new DBservices();
            return db.deleteStudent(StudentId);
        }

        //פונקציית התחברות עם פייסבוק
        public Student FacebookLogin()
        {
            DBservices dbs = new DBservices();
            return dbs.FacebookLogin(Email, FirstName, LastName, Password);
        }

        //פונקציה שמעדכנת את הפרטים של הסטודנט בהינתן אימייל
        public void UpdateData()
        {
            DBservices dbs = new DBservices();
            dbs.UpdateStudentDataByEmail(Email, this);
        }

        //עדכון סיסמא
        public void UpdatePassword(String newPassword)
        {
            DBservices dbs = new DBservices();
            dbs.UpdatePassword(Email, newPassword);
        }

        //הוספת מחלקה ותת מחלקה בהינתן אימייל
        public void UpdateDepartmentAndSubDepartment()
        {
            DBservices dbs = new DBservices();
            dbs.UpdateStudentDeapartmentAndSubDepartment(Email, DepartmentCode, SubDepartmentCode);
        }
        public List<Language> GetLanguages()
        {
            DBservices dbs = new DBservices();
            return dbs.GetStudentLanguages(StudentId);
        }
        public void UpdateStudentLanguages()
        {
            DBservices dbs = new DBservices();
            dbs.UpdateStudentLanguages(StudentId, LanguagesList);
        }
    }
}