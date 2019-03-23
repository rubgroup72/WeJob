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
            Student studentFromDB = s.AppRegister();
            if (studentFromDB == null)
            {
                return new ReactResponse("אימייל קיים במערכת", null);
            }
            return new ReactResponse("", studentFromDB);
        }
    }
}
