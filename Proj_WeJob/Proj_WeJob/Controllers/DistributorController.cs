using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Proj_WeJob.Models.DAL;


namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DistributorController:ApiController
    {
        // POST api/values
        //הפעלת פונקצית הוספת מפיצים במחלקת מפיץ
        public void POST([FromBody]Distributor distributor)
        {
            distributor.InsertDistibutor();
        }
        //הפעלת פונקציה שמחזירה את כל המפיצים
        [HttpGet]
        [Route("api/distributors")]
        public IEnumerable<Distributor> Get()
        {
            Distributor d = new Distributor();
            return d.GetListDistributor();
        }
        //פונקציה שמפעילה עדכון של פרטי מפיץ
        [HttpPut]
        [Route("api/Update")]
        // PUT api/Update
        public void Put([FromBody]Distributor d)
        {
         d.UpdateDistributer();
        }
        [HttpDelete]
        [Route("api/Dis")]
        public void DELETE(string companyNo)
        {
            Distributor d = new Distributor();
            d.deleteDistributor(companyNo);
        }
    }
}