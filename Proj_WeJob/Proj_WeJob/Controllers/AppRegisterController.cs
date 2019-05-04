using Proj_WeJob.Models;
using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Proj_WeJob.Controllers
{
    [Route("api/Register")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AppRegisterController : ApiController
    {
        [HttpGet]
        public string Get()
        {
            return "register test";
        }

        [HttpPost]
        public ReactResponse Post([FromBody] Student s)
        {
            if (s == null)
                return new ReactResponse("לא התקבלו נתונים", null);
            if (String.IsNullOrEmpty(s.FirstName))
                return new ReactResponse("שם פרטי חסר", null);
            if (String.IsNullOrEmpty(s.LastName))
                return new ReactResponse("שם משפחה חסר", null);
            if (String.IsNullOrEmpty(s.Email))
                return new ReactResponse("אימייל חסר", null);
            if (String.IsNullOrEmpty(s.Password))
                return new ReactResponse("סיסמא חסרה", null);
            if (String.IsNullOrEmpty(s.CellPhone))
                return new ReactResponse("מספר פלאפון חסר", null);
            if (String.IsNullOrEmpty(s.Gender))
                return new ReactResponse("מין הינו שדה חובה", null);

            Student studentFromDB = s.AppRegister();
            if (studentFromDB == null)
            {
                return new ReactResponse("אימייל קיים במערכת", null);
            }
            return new ReactResponse("", studentFromDB);
        }
    }
}
