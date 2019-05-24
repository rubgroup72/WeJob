using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Proj_WeJob.Models;


namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DepartmentController:ApiController
    {
        //הפעלת פונקציה שמחזירה את כל המחלקות
        [HttpGet]
        [Route("api/Departments")]
        public IEnumerable<Department> Get()
        {
            Department d = new Department();
            return d.GetListDepartment();
        }
    }
}