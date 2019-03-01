using System.Collections.Generic;
using System.Web.Http;
using Proj_WeJob.Models.DAL;


namespace Proj_WeJob.Controllers
{
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
    }
}