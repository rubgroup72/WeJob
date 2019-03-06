using System.Collections.Generic;
using System.Web.Http;
using Proj_WeJob.Models.DAL;


namespace Proj_WeJob.Controllers
{
    public class StudentController : ApiController
    {
        // POST api/values
        //הפעלת פונקצית הוספת מפיצים במחלקת מפיץ
        //public void POST([FromBody]Student student)
        //{
        //    student.InsertStudent();
        //}
        //הפעלת פונקציה שמחזירה את כל המפיצים
        [HttpGet]
        [Route("api/Student")]
        public IEnumerable<Student> Get()
        {
            Student d = new Student();
            return d.GetListStudent();
        }
    }
}