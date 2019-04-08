using System.Collections.Generic;
using System.Web.Http;
using Proj_WeJob.Models.DAL;
namespace Proj_WeJob.Controllers
{
    public class JobControllera:ApiController
    {
        // POST api/values
        //הפעלת פונקצית הכנסה של פרטי משתמש במחלקת משתמש
        //public void POST([FromBody]Job j)
        //{
        //    j.InsertJob();
        //}
        [HttpGet]
        [Route("api/Jobs")]
        public IEnumerable<Job> GET(string companyNo)
        {
            Job j = new Job();
            return j.GetListJobsOfDistributor(companyNo);
        }
    }
}