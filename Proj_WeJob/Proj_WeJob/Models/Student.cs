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
        public int DepartmentCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        //public string CV { get; set; }
        public string CellPhone { get; set; }
        public string Gender { get; set; }
        //public string Photo { get; set; }
        //constructor
        public Student( int _StudentId, int _DepartmentCode, string _FirstName, string _LastName, string _Email,/*string _CV*//*,*/string _CellPhone, string _Gender/*,*/ /*string _Photo*/) 
        {
            this.StudentId = _StudentId;
            this.DepartmentCode = _DepartmentCode;
            this.FirstName = _FirstName;
            this.LastName = _LastName;
            this.Email = Email;
            //this.CV = _CV;
            this.CellPhone = _CellPhone;
            this.Gender = _Gender;
            //this.Photo = _Photo;
        }

        public Student()
        {
        }

        //הכנסת נתונים לטבלה באמצעות קשירה לDB  
        //public int InsertDistibutor()
        //{
        //    DBservices dbs = new DBservices();
        //    int num = dbs.InsertDistibutor(this);
        //    CompanyNo = num;
        //    return num;

        //}
        //הצגת כל המפיצים ללא סינון
        public List<Student> GetListStudent()
        {
            DBservices dbs = new DBservices();
            return dbs.GetListStudent("DBConnectionString");
        }

    }
}