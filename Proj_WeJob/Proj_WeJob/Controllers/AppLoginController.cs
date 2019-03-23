using Proj_WeJob.Models;
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
    [Route("api/Login")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AppLoginController : ApiController
    {
        [HttpGet]
        public string Get()
        {
            return "app/Login test";
        }

        [HttpPost]
        public ReactResponse Post([FromBody] Student s)
        {
            if (s == null)
            {
                return new ReactResponse("לא התקבלו פרטים", null);
            }
            Student studentFromDB = s.AppLogin();
            if (studentFromDB == null)
            {
                return new ReactResponse("יוזר לא קיים במערכת", null);
            }
            return new ReactResponse("", studentFromDB);
        }
    }
}
