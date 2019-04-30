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
    public class AppDepartmentController : ApiController
    {
        //פונקציה שמביאה את כל התתי מחלקות מהדטא בייס
        [HttpGet]
        [Route("api/AppGetSubDepartment")]
        public List<SubDepartment> Get(int departmentCode)
        {
            Department d = new Department();
            return d.GetSubDepartmentList(departmentCode);
        }

        //מעדכנים תת מחלקה לסטודנט מסויים
        [HttpPost]
        [Route("api/AppUpdateSubDepartment")]
        public void Post([FromBody] Student s)
        {
            s.UpdateDepartmentAndSubDepartment();

        }
    }

}
