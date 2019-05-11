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
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [Route("api/AppJobController")]
    public class AppJobController : ApiController
    {
        //הבאה של משרות לפי מספר קטגוריה
        [HttpGet]
        public List<Job> GET(int categoryNo)
        {
            Job j = new Job();
            return j.GetListJobNames(categoryNo);
        }

        // רישום משרות שהסטודנט בחר כרלוונטיות עבורו
        [HttpPost]
        public void Post([FromBody] Student s)
        {
            if (s == null)
                return;
            s.UpdateStudentTempJobs();
        }
    }
}
