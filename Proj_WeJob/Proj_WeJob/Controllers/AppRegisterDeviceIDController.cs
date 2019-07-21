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
    [Route("api/AppRegisterDeviceIDController")]
    public class AppRegisterDeviceIDController : ApiController
    {
        [HttpGet]
        public void Get(string studentId, string register,string fcmToken)
        {
            if (String.IsNullOrEmpty(studentId) || String.IsNullOrEmpty(register))
                return;
            Student s = new Student();
            s.RegisterStudentDeviceId(studentId, register == "1", fcmToken);
        }
    }
}
