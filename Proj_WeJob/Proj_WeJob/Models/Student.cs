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
        public List<Tags> TagsList { get; set; }
        public List <Job> JobTitlesList { get; set; }
        public string CVName { get; set; }
        public string CVFile { get; set; }

        //constructor
        public Student(int _studentId, string _firstName, string _lastName, string _cellPhone, string _email, string _gender, string _departmentName, string _subDepartmentName, int _departmentCode, int _subDepartmentCode, String _cvName)
        {
            this.StudentId = _studentId;
            this.FirstName = _firstName;
            this.LastName = _lastName;
            this.CellPhone = _cellPhone;
            this.Email = _email;
            this.Gender = _gender;
            this.DepartmentName = _departmentName;
            this.SubDepartmentName = _subDepartmentName;
            this.DepartmentCode = _departmentCode;
            this.SubDepartmentCode = _subDepartmentCode;
            this.CVName = _cvName;
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

        //הצגת סטודנטים לפי מחלקה ותת מחלקה
        public List<Student> GetListStudentFilter(string codeDepartment, string SubDepartmentId)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListStudentFilter("DBConnectionString", codeDepartment, SubDepartmentId);
        }

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
        //הבאת רשימת שפות מהדטא בייס
        public List<Language> GetLanguages()
        {
            DBservices dbs = new DBservices();
            return dbs.GetStudentLanguages(StudentId);
        }
        //עדכון שפות שהסטודנט בחר
        public void UpdateStudentLanguages()
        {
            DBservices dbs = new DBservices();
            dbs.UpdateStudentLanguages(StudentId, LanguagesList);
        }

        //עדכון תגיות שהסטודנט בחר
        public void UpdateStudentSubCategories()
        {
            DBservices dbs = new DBservices();
            dbs.UpdateStudentSubCategories(StudentId, TagsList);
        }

        public int GetAmountStudents()
        {
            DBservices db = new DBservices();
            return db.GetAmountStudents("DBConnectionString");
        }

        //עדכון משרות זמניות שהסטודנט בחר
        public void UpdateStudentTempJobs()
        {
            DBservices dbs = new DBservices();
            dbs.UpdateStudentTempJobs(StudentId, JobTitlesList);
        }

        //העלאת קורות חיים של הסטודנט באפליקציה
        public void UpdateCV()
        {
            DBservices dbs = new DBservices();
            dbs.UpdateCV(StudentId, CVFile, CVName);
        }
        //פוקנציה שמחזירה את כל התגים שהסטודנט בחר
        public List<int> GetSelectedSubCategories()
        {
            DBservices dbs = new DBservices();
            return dbs.GetSelectedSubCategories(StudentId);
        }
        //פונקציה שמחזירה את הקטגוריה שהסטודנט בחר
        public int GetSelectedCategory()
        {
            DBservices dbs = new DBservices();
            var subCatergoriesList = GetSelectedSubCategories();
            if (subCatergoriesList.Count > 0)
            {
                return dbs.GetStudentSelectedCategory(subCatergoriesList[0]);
            }

            return 0;
        }

        public KeyValuePair<string, string> GetCV()
        {
            DBservices dbs = new DBservices();
            var s = dbs.GetListStudent("DBConnectionString", StudentId.ToString(), true).FirstOrDefault();
            if (s == null)
                return new KeyValuePair<string, string>();
            return new KeyValuePair<string, string>(s.CVName, s.CVFile);
        }
    }
}