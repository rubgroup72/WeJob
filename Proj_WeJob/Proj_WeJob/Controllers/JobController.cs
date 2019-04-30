using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Proj_WeJob.Models.DAL;
namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class JobController:ApiController
    {
        // POST api/values
        //הפעלת פונקצית הכנסה של פרטי משתמש במחלקת משתמש
        [HttpPost]
        [Route("api/JobNew")]
        public void POST([FromBody]Job j)
        {
            j.InsertJob();
        }
        [HttpGet]
        [Route("api/Jobs")]
        public IEnumerable<Job> GET(string companyNo)
        {
            Job j = new Job();
            return j.GetListJobsOfDistributor(companyNo);
        }
        [HttpGet]
        [Route("api/Job")]
        public Job Get(string JobNo)
        {
            Job j = new Job();
            return j.GetJob(JobNo);
        }
    }
}