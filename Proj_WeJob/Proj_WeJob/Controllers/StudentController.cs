using System.Collections.Generic;
using System.Web.Http;
using Proj_WeJob.Models.DAL;
using System.Linq;
using System.Web.Http.Cors;

namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class StudentController:ApiController
    {
     
        //הפעלת פונקציה שמחזירה את כל הסטודנטים
        [HttpGet]
        [Route("api/Students")]
        public IEnumerable<Student> Get()
        {
            Student s = new Student();
            return s.GetListStudent();
        }
        // הפעלת פונקציה שמחזירה את כל הסטודנטים עם סינון של מחלקה ותת מחלקה
        [HttpGet]
        [Route("api/Student")]
        public IEnumerable<Student> GET(string codeDepartment,string SubDepartmentId)
        {
            Student s = new Student();
            return s.GetListStudentFilter(codeDepartment, SubDepartmentId);
        }
       //פונקציה שמחזירה סטודנט ספציפי על פי תעודת סטודנט
        [HttpGet]
        [Route("api/StudentProfile")]
        public IEnumerable<Student> Get(string StudentId)
        {
            Student s = new Student();
            return s.GetListStudent(StudentId);
        }

        //פונקציה למחיקת סטודנט
        [HttpDelete]
        [Route("api/stu")]
        public void DELETE(string StudentId)
        {
            Student s = new Student();
            s.deleteStudent(StudentId);
        }

        //פונקציה שמעדכנת את הפרטים של הסטודנט - משמש את האפליקציה
        [HttpPost]
        [Route("api/Students")]
        public Student Post([FromBody] Student s)
        {
            if (s == null)
                return null;
            if (!string.IsNullOrEmpty(s.CVName)) //אם מצורפים קורות חיים לבקשה
            {
                s.UpdateCV();
                return s;
            }
            s.UpdateData();
            return s;
        }
        [HttpGet]
        [Route("api/AmountStudents")]
        public int GET()
        {
            Student d = new Student();
            return d.GetAmountStudents();
        }
        [HttpGet]
        [Route("api/tags")]
        public IEnumerable<Student> GET(string StudentId)
        {
            Student d = new Student();
            return d.GetTagsforStudent(StudentId);
        }
    }
}