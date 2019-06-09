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
    public class AppRegisterDeviceIDController : ApiController
    {
        public static String FCMToken = "";
        [HttpGet]
        public void Get(string email, string fcmToken)
        {
            FCMToken = fcmToken;
        }
    }
}
