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
    public class AppStudentRemoveJobController : ApiController
    {
        [HttpGet]
        [Route("api/AppStudentRemoveJobController")]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public void Get([FromUri] int studentId, [FromUri] int jobNo)
        {
            if (studentId == 0 || jobNo == 0)
                return;
            // TODO
        }
    }
}
