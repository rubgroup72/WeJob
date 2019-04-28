using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Proj_WeJob.Controllers
{
    [Route("api/AppStudentLanguagesController")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AppStudentLanguagesController : ApiController
    {
        [HttpGet]
        public List<Language> Get(int studentId)
        {
            Student s = new Student() { StudentId = studentId };
            return s.GetLanguages();
        }

        [HttpPost]
        public void Post([FromBody] Student s)
        {
            if (s == null)
                return;
            s.UpdateStudentLanguages();
        }
    }
}
