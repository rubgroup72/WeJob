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
    [Route("api/AppStudnetJobStatus")]
    public class AppStudnetJobStatusController : ApiController
    {
        [HttpPost]
        public string Post([FromBody] StudnetJob studentJob)
        {
            if (studentJob == null || string.IsNullOrEmpty(studentJob.StudentId) || string.IsNullOrEmpty(studentJob.JobId))
                return "Invalid parameters";
            return (new Job()).UpdateStudentJob(studentJob.StudentId, studentJob.JobId, studentJob.Status);
        }
    }

    public class StudnetJob
    {
        public string StudentId { get; set; }
        public string JobId { get; set; }
        public string Status { get; set; }
    }
}