using Newtonsoft.Json;
using Proj_WeJob.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AppSendPushNotificationController : ApiController
    {
        [HttpGet]
        public void Get(string title, string body)
        {
        }
    }
}
