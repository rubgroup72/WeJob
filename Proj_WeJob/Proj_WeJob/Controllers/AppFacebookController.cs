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
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AppFacebookController : ApiController
    {
        // הפונקציה נועדה בשביל חיבור עם פייסבוק.
        // במידה והסטודנט לא מופיע בDB נוסיף אותו עם פרטים זמנים
        [HttpPost]
        [Route("api/appFacebook")]
        public Student Post([FromBody] Student s)
        {
            if (s == null)
                return null;

            //var tempStudent = s.GetListStudent().FirstOrDefault(i => i.Email == s.Email);
            //if (tempStudent != null)
            //{
            //    tempStudent.UpdatePassword(s.Password);
            //    return tempStudent;
            //}

            var split = s.FirstName.Split(' ');
            s.FirstName = split[0];
            s.LastName = split.Count() == 1 ? "" : String.Join(" ", split.Skip(1));
            return s.FacebookLogin();
        }
    }
}