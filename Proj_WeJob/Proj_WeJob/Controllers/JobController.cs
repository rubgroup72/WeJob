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
        [HttpPut]
        [Route("api/updateStatus")]
        public void PUT([FromBody]Job j) => j.updateStatusJob();
        [HttpPut]
        [Route("api/IsDeleted")]
        public void put([FromBody]Job j) => j.updateIsDeleted();

        [HttpGet]
        [Route("api/Jobs")]
        public IEnumerable<Job> GET(string companyNo)
        {
            Job j = new Job();
            return j.GetListJobsOfDistributor(companyNo);
        }
        [HttpGet]
        [Route("api/HotJobsByCategoryNo")]
        public IEnumerable<Job> get(string CategoryNo)
        {
            Job j = new Job();
            return j.GetHotJobsByCategoryNo(CategoryNo);
        }
        [HttpGet]
        [Route("api/HistoryJob")]
        public IEnumerable<Job> get()
        {
            Job j = new Job();
            return j.getHistory();
        }
        [HttpGet]
        [Route("api/Job")]
        public Job Get(string JobNo)
        {
            Job j = new Job();
            return j.GetJob(JobNo);
        }
        [HttpGet]
        [Route("api/AmountJobsGood")]
        public int GET()
        {
            Job d = new Job();
            return d.GetAmountJobsGood();
        }
        [HttpGet]
        [Route("api/AmountJobsBad")]
        public int Get()
        {
            Job d = new Job();
            return d.GetAmountJobsBad();
        }
        [HttpGet]
        [Route("api/PopularJobs")]
        public IEnumerable<Job> GeT()
        {
            Job d = new Job();
            return d.GetPopularJobs();
        }
        [HttpGet]
        [Route("api/reportJobs")]
        public List<Job> GEt()
        {
            Job j = new Job();
            return j.GetreportJobs();
        }
    }
}